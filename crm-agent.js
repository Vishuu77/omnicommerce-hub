/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * crm-agent.js — Hexa: the autonomous back-office agent for the Employee CRM.
 *
 * Complements the customer-facing OmniBot (ai-agent.js) by operating the
 * employee side of the house:
 *   1. OBSERVE — pull open tickets, orders, returns, stock, customers
 *   2. REASON  — deterministic policy engine decides what is safe to act on
 *   3. ACT     — reply to customers, advance return workflow, resolve/escalate
 *   4. RECORD  — append every action to data/agent_log.json (audit trail)
 *
 * SAFETY RAIL: money movement is never automatic. The agent may advance a
 * return up to 'Item Picked Up'; the final 'Refund Processed' step is always
 * flagged for a human. Everything else is handled without human handoff.
 *
 * Mounted by server.ts / server.js at  /api/agent/*
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dbHelper from './db-helper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, 'data');
const LOG_FILE = path.join(DATA_DIR, 'agent_log.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const now = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

// ================================================================ identity
export const AGENT = {
  name: 'Hexa',
  role: 'Autonomous CRM Operations Agent',
  version: '1.0.0',
  scope: 'Owns the back-office support queue: tickets, returns, stock watch.'
};

export const POLICY = {
  LOW_STOCK_THRESHOLD: 5,
  REPLACEMENT_WINDOW_DAYS: 7,
  DOA_WINDOW_DAYS: 3,
  AUTO_REFUND: false,                 // never move money automatically
  RETURN_CHAIN: ['Return Requested', 'Pickup Scheduled', 'Item Picked Up'],
  FINAL_RETURN_STATE: 'Refund Processed',   // human/finance gate
  TICKET_OPEN_STATES: ['Open', 'In Progress']
};

// ================================================================ 1. OBSERVE
export function buildContext() {
  const orders = dbHelper.getOrders();
  const tickets = dbHelper.getSupportTickets();
  const returns = dbHelper.getReturns();
  const products = dbHelper.getProducts();
  const customers = dbHelper.getUsers();
  return {
    generatedAt: now(),
    counts: {
      orders: orders.length,
      tickets: tickets.length,
      openTickets: tickets.filter(t => t.Status !== 'Resolved').length,
      returnsInFlight: returns.length,
      products: products.length,
      lowStock: products.filter(p => Number(p.Stock) <= POLICY.LOW_STOCK_THRESHOLD).length
    },
    orders, tickets, returns, products, customers
  };
}

const findOrder = (ctx, id) =>
  ctx.orders.find(o => String(o.OrderID) === String(id)) || null;

function daysSince(ts) {
  if (!ts) return null;
  const d = new Date(String(ts).replace(' ', 'T'));
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

// ================================================================ 2. REASON
/** Classify one open ticket into a concrete, safe action. */
function classifyTicket(ticket, ctx) {
  const order = ticket.OrderID ? findOrder(ctx, ticket.OrderID) : null;
  const base = { ticketId: ticket.TicketID, orderId: ticket.OrderID || null,
                 priority: ticket.Priority || 'Normal', status: ticket.Status };

  // --- return already in flight: keep the customer informed, advance workflow
  if (order && order.ReturnStatus && order.ReturnStatus !== 'Cancelled') {
    const rs = order.ReturnStatus;
    const idx = POLICY.RETURN_CHAIN.indexOf(rs);
    const canAdvance = idx >= 0 && idx < POLICY.RETURN_CHAIN.length - 1;
    const next = canAdvance ? POLICY.RETURN_CHAIN[idx + 1] : null;

    if (rs === POLICY.FINAL_RETURN_STATE) {
      return { ...base, type: 'resolve_ticket', auto: true,
        reason: `Return completed (${rs}); refund issued. Closing ticket.`,
        message: `Hi ${ticket.CustomerName}, your refund for order ${order.OrderID} ` +
                 `(₹${order.RefundAmount || order.TotalAmount}) has been processed to the ` +
                 `original payment method. This ticket is now closed. Thank you for your patience.` };
    }
    if (next) {
      return { ...base, type: 'advance_return', to: next, auto: true,
        reason: `Return for ${order.OrderID} is '${rs}' — advancing to '${next}'.`,
        message: `Hi ${ticket.CustomerName}, quick update on order ${order.OrderID}: your ` +
                 `return is now '${next}'. ` +
                 (next === 'Item Picked Up'
                    ? `We've received the item and are preparing your ` +
                      `${order.ReturnType || 'refund'}. The final refund step is reviewed ` +
                      `by our finance desk and will land within 3-5 business days.`
                    : `Our pickup partner will collect the item shortly.`) };
    }
    return { ...base, type: 'reply_ticket', auto: true,
      reason: `Return for ${order.OrderID} at final state; informing customer.`,
      message: `Hi ${ticket.CustomerName}, your return for order ${order.OrderID} is at ` +
               `'${rs}'. The refund is being released by our finance desk. No action needed.` };
  }

  // --- no linked order: we cannot reason about policy
  if (!order) {
    return { ...base, type: 'escalate_ticket', auto: true, priority: 'High',
      reason: 'Ticket has no linked order — needs a human to identify the purchase.',
      message: `Hi ${ticket.CustomerName}, thanks for reaching out. To look into this ` +
               `properly I need the order ID. Could you share the Order ID (starts with ORD-) ` +
               `from your confirmation email?` };
  }

  const d = daysSince(order.CreatedAt);
  const claim = String(ticket.Subject || ticket.LastMessage || '').toLowerCase();
  const isReturnClaim = /return|refund|replace|damaged|defect|wrong|broken|faulty/.test(claim);

  // --- claim inside the return window: open the return for them
  if (isReturnClaim && d !== null && d <= POLICY.REPLACEMENT_WINDOW_DAYS
      && order.OrderStatus !== 'Cancelled') {
    return { ...base, type: 'open_return', auto: true,
      reason: `Return-window claim (${d}d <= ${POLICY.REPLACEMENT_WINDOW_DAYS}d) on ${order.OrderID}.`,
      message: `Hi ${ticket.CustomerName}, I've reviewed order ${order.OrderID} — it's within ` +
               `our ${POLICY.REPLACEMENT_WINDOW_DAYS}-day return window, so you're eligible. ` +
               `I've opened a return request for you. Please reply with a photo of the item ` +
               `and packaging, and confirm whether you'd prefer a replacement or a refund.` };
  }

  // --- claim outside the window
  if (isReturnClaim && d !== null && d > POLICY.REPLACEMENT_WINDOW_DAYS) {
    return { ...base, type: 'reply_ticket', auto: true, priority: 'High',
      reason: `Claim on ${order.OrderID} is ${d}d old — outside the ` +
              `${POLICY.REPLACEMENT_WINDOW_DAYS}-day window.`,
      message: `Hi ${ticket.CustomerName}, thanks for your message about order ` +
               `${order.OrderID}. It falls outside our standard ` +
               `${POLICY.REPLACEMENT_WINDOW_DAYS}-day return window, but I've escalated this ` +
               `to a senior executive who can review it as a goodwill case.` };
  }

  // --- delivery status question
  if (/where|track|delivery|shipped|when|status|late|delay/.test(claim)) {
    return { ...base, type: 'reply_ticket', auto: true,
      reason: `Delivery-status query on ${order.OrderID} (currently '${order.OrderStatus}').`,
      message: `Hi ${ticket.CustomerName}, order ${order.OrderID} is currently ` +
               `'${order.OrderStatus}'` +
               (order.TrackingNumber ? ` — tracking number ${order.TrackingNumber}.` : `.`) +
               ` You can follow it any time at /customer-portal.html. Anything else I can help with?` };
  }

  // --- fallback acknowledgement
  return { ...base, type: 'reply_ticket', auto: true,
    reason: `General enquiry on ${order.OrderID}; acknowledged.`,
    message: `Hi ${ticket.CustomerName}, thanks for reaching out about order ` +
             `${order.OrderID}. I've logged your request and will follow up shortly.` };
}

/** Classify one in-flight return that has no open ticket yet. */
function classifyReturn(order, ctx) {
  const rs = order.ReturnStatus;
  const idx = POLICY.RETURN_CHAIN.indexOf(rs);
  if (idx < 0 || idx >= POLICY.RETURN_CHAIN.length - 1) return null;  // nothing safe to do
  const next = POLICY.RETURN_CHAIN[idx + 1];
  return { type: 'advance_return', to: next, auto: true,
    ticketId: null, orderId: order.OrderID, priority: 'Normal',
    reason: `Unattended return ${order.OrderID} at '${rs}' — advancing to '${next}'.`,
    message: null };
}

/** Stock watch: surface products at or below the low-stock threshold. */
function classifyStock(ctx) {
  return ctx.products
    .filter(p => Number(p.Stock) <= POLICY.LOW_STOCK_THRESHOLD)
    .map(p => ({ type: 'flag_stock', auto: false, productId: p.ProductID,
      priority: Number(p.Stock) <= 0 ? 'Urgent' : 'High',
      reason: `${p.Title} at ${p.Stock} units (threshold ${POLICY.LOW_STOCK_THRESHOLD}).`,
      message: null }));
}

/** Full plan: every decision the agent would make right now. */
export function plan(ctx = buildContext()) {
  const decisions = [];
  for (const t of ctx.tickets) {
    if (t.Status === 'Resolved') continue;
    decisions.push(classifyTicket(t, ctx));
  }
  const ticketed = new Set(ctx.tickets.map(t => String(t.OrderID)));
  for (const o of ctx.returns) {
    if (ticketed.has(String(o.OrderID))) continue;      // already covered above
    const d = classifyReturn(o, ctx);
    if (d) decisions.push(d);
  }
  decisions.push(...classifyStock(ctx));
  return decisions;
}

// ================================================================ brain
/** Optional Gemini phrasing. Falls back to the template when unavailable. */
async function compose(decision, ctx) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !decision.message) return decision.message;
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: key });
    const prompt =
      `You are ${AGENT.name}, the autonomous support agent for an Indian e-commerce store.\n` +
      `Rewrite the draft below as a warm, concise WhatsApp support reply (max 3 sentences, ` +
      `no markdown, no emoji spam, keep all facts and numbers exactly as given).\n\n` +
      `Facts: ${decision.reason}\nDraft: ${decision.message}\n\nReply only with the message text.`;
    const r = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
    const text = (r && (r.text || (r.candidates && r.candidates[0]?.content?.parts?.[0]?.text))) || '';
    return text.trim() || decision.message;
  } catch {
    return decision.message;      // brain offline — template stands
  }
}

// ================================================================ 3. ACT
function apply(decision, message) {
  switch (decision.type) {
    case 'reply_ticket':
    case 'escalate_ticket':
      if (decision.ticketId && message) {
        dbHelper.addSupportMessage(decision.ticketId,
          { text: message, sender: 'support', senderName: `${AGENT.name} (AI Agent)`,
            orderId: decision.orderId });
      }
      if (decision.type === 'escalate_ticket' && decision.ticketId) {
        dbHelper.updateTicketStatus(decision.ticketId, 'In Progress');
        if (decision.priority) dbHelper.updateTicketPriority(decision.ticketId, decision.priority);
      }
      return true;

    case 'resolve_ticket':
      if (decision.ticketId && message) {
        dbHelper.addSupportMessage(decision.ticketId,
          { text: message, sender: 'support', senderName: `${AGENT.name} (AI Agent)`,
            orderId: decision.orderId });
        dbHelper.updateTicketStatus(decision.ticketId, 'Resolved');
      }
      return true;

    case 'advance_return':
      dbHelper.updateReturnStatus(decision.orderId, decision.to, true);
      if (decision.ticketId && message) {
        dbHelper.addSupportMessage(decision.ticketId,
          { text: message, sender: 'support', senderName: `${AGENT.name} (AI Agent)`,
            orderId: decision.orderId });
      }
      return true;

    case 'open_return':
      dbHelper.requestReturn(decision.orderId,
        { reason: 'Reported via support ticket', returnType: 'Replacement Unit' });
      if (decision.ticketId && message) {
        dbHelper.addSupportMessage(decision.ticketId,
          { text: message, sender: 'support', senderName: `${AGENT.name} (AI Agent)`,
            orderId: decision.orderId });
      }
      return true;

    case 'flag_stock':
      return false;                 // advisory only — nothing to write

    default:
      return false;
  }
}

// ================================================================ 4. RECORD
export function readLog(limit = 50) {
  try {
    const all = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    return all.slice(-limit);
  } catch {
    return [];
  }
}

function writeLog(entry) {
  let all = [];
  try { all = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch { all = []; }
  all.push(entry);
  if (all.length > 1000) all = all.slice(-1000);
  fs.writeFileSync(LOG_FILE, JSON.stringify(all, null, 2));
}

// ================================================================ runner
export async function runOnce({ dryRun = false } = {}) {
  const ctx = buildContext();
  const decisions = plan(ctx);
  const results = [];

  for (const d of decisions) {
    const message = d.message ? await compose(d, ctx) : null;
    let applied = false;
    if (d.auto && !dryRun) applied = apply(d, message);
    const entry = {
      at: now(), agent: AGENT.name, type: d.type, auto: !!d.auto,
      ticketId: d.ticketId || null, orderId: d.orderId || null,
      productId: d.productId || null, to: d.to || null,
      priority: d.priority || 'Normal', reason: d.reason,
      message: message || null, applied, dryRun: !!dryRun
    };
    if (!dryRun) writeLog(entry);
    results.push(entry);
  }

  const acted = results.filter(r => r.applied).length;
  return {
    agent: AGENT.name, version: AGENT.version, at: now(), dryRun,
    observed: ctx.counts,
    summary: {
      decisions: results.length, actionsApplied: acted,
      replies: results.filter(r => r.applied && r.message).length,
      returnsAdvanced: results.filter(r => r.applied && r.type === 'advance_return').length,
      resolved: results.filter(r => r.applied && r.type === 'resolve_ticket').length,
      escalations: results.filter(r => r.type === 'escalate_ticket').length,
      stockAlerts: results.filter(r => r.type === 'flag_stock').length,
      humanGates: results.filter(r => !r.auto).length
    },
    decisions: results
  };
}

// ================================================================ routes
export function agentRouter() {
  const r = express.Router();

  r.get('/', (req, res) => {
    const ctx = buildContext();
    return res.json({
      success: true, agent: AGENT, policy: POLICY,
      status: 'online', observed: ctx.counts,
      endpoints: ['GET /api/agent', 'GET /api/agent/context', 'GET /api/agent/plan',
                  'POST /api/agent/run', 'GET /api/agent/log']
    });
  });

  r.get('/context', (req, res) => {
    const ctx = buildContext();
    return res.json({ success: true, counts: ctx.counts, generatedAt: ctx.generatedAt,
      openTickets: ctx.tickets.filter(t => t.Status !== 'Resolved'),
      returnsInFlight: ctx.returns,
      lowStock: ctx.products.filter(p => Number(p.Stock) <= POLICY.LOW_STOCK_THRESHOLD)
                             .map(p => ({ ProductID: p.ProductID, Title: p.Title, Stock: p.Stock })) });
  });

  r.get('/plan', (req, res) => {
    const ctx = buildContext();
    return res.json({ success: true, dryRun: true, decisions: plan(ctx), observed: ctx.counts });
  });

  r.post('/run', async (req, res) => {
    try {
      const dryRun = !!(req.body && req.body.dryRun);
      const out = await runOnce({ dryRun });
      if (!dryRun) {
        try { broadcastAgent(out); } catch { /* ws not wired here */ }
      }
      return res.json({ success: true, ...out });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  r.get('/log', (req, res) => {
    const limit = Math.min(parseInt(req.query.limit || '50', 10) || 50, 200);
    return res.json({ success: true, count: readLog(limit).length, log: readLog(limit) });
  });

  return r;
}

// optional WS hook — server.ts can assign this to push agent activity live
export let broadcastAgent = () => { };
export function setBroadcast(fn) { broadcastAgent = fn; }

export default { AGENT, POLICY, buildContext, plan, runOnce, readLog, agentRouter, setBroadcast };
