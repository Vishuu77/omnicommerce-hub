/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * server.ts
 * Full-stack entry point for OmniCommerce Dual-Interface CRM Platform.
 * Runs Express backend with Vite middlewares in development on port 3000.
 */

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
// @ts-ignore
import { WebSocketServer, WebSocket } from 'ws';
import dbHelper from './db-helper.js';
import aiAgent from './ai-agent.js';
import { agentRouter, setBroadcast } from './crm-agent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000; // Strict requirement: must run on port 3000

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  // Real-time WebSocket Server for Live Customer Support & CRM Chat
  const wss = new WebSocketServer({ server, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    clients.add(ws);
    ws.send(JSON.stringify({ type: 'init', message: 'Connected to Live Support Gateway' }));

    ws.on('message', (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        } else if (parsed.type === 'typing') {
          // Broadcast typing status to all other clients
          for (const c of clients) {
            if (c !== ws && c.readyState === WebSocket.OPEN) {
              c.send(JSON.stringify({ type: 'typing', ...parsed }));
            }
          }
        }
      } catch (err) {
        // non-json ignore
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  function broadcast(data: any) {
    const raw = JSON.stringify(data);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(raw);
      }
    }
  }

  // Let the CRM agent push its activity onto the live support WebSocket
  setBroadcast((result: any) => {
    broadcast({ type: 'agent:run', summary: result.summary, at: result.at });
    for (const d of result.decisions || []) {
      if (d.applied) broadcast({ type: 'agent:action', decision: d });
    }
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS and Headers middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Request logger
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
  });

  // ==========================================
  // AUTHENTICATION ROUTES (PHONE + OTP)
  // ==========================================

  app.post('/api/auth/send-otp', (req: Request, res: Response) => {
    try {
      const { phone } = req.body;
      const cleanPhone = String(phone || '').replace(/\D/g, '');

      if (!cleanPhone || cleanPhone.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid 10-digit mobile phone number.'
        });
      }

      const otp = dbHelper.generateOtp(cleanPhone);

      return res.json({
        success: true,
        phone: cleanPhone,
        message: `OTP sent successfully to +91-${cleanPhone}. Valid for 10 minutes.`,
        testOtp: otp, // Injected for seamless UI testing
        isTargetDemoPhone: cleanPhone === '6361222162'
      });
    } catch (err: any) {
      console.error('Error generating OTP:', err);
      return res.status(500).json({ success: false, error: 'Internal server error generating OTP.' });
    }
  });

  app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
    try {
      const { phone, otp } = req.body;
      const cleanPhone = String(phone || '').replace(/\D/g, '');
      const cleanOtp = String(otp || '').trim();

      if (!cleanPhone || !cleanOtp) {
        return res.status(400).json({
          success: false,
          error: 'Phone number and OTP are both required.'
        });
      }

      const result = dbHelper.verifyOtp(cleanPhone, cleanOtp);
      if (!result.success) {
        return res.status(401).json({ success: false, error: result.message || 'Invalid or expired OTP.' });
      }

      return res.json({
        success: true,
        message: 'Authentication successful',
        user: result.user
      });
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      return res.status(500).json({ success: false, error: 'Server error during OTP verification.' });
    }
  });

  app.get('/api/auth/users', (req: Request, res: Response) => {
    try {
      const users = dbHelper.getUsers();
      return res.json({ success: true, users });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Error fetching users list' });
    }
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { phone, name, email, address, city, pincode } = req.body;
      const cleanPhone = String(phone || '').replace(/\D/g, '');

      if (!cleanPhone || cleanPhone.length < 10) {
        return res.status(400).json({ success: false, error: 'A valid 10-digit mobile phone number is required.' });
      }
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, error: 'Full name is required.' });
      }

      const savedUser = dbHelper.saveUser({
        Phone: cleanPhone,
        Name: name.trim(),
        Email: email ? email.trim() : `${cleanPhone}@omnicommerce.in`,
        Address: address ? address.trim() : '#10, Central Market Road',
        City: city ? city.trim() : 'Bengaluru',
        Pincode: pincode ? pincode.trim() : '560001',
        Role: 'Customer'
      });

      const otp = dbHelper.generateOtp(cleanPhone);

      return res.json({
        success: true,
        message: `Account created and saved in Google Sheets database! OTP sent to +91-${cleanPhone}.`,
        user: savedUser,
        testOtp: otp
      });
    } catch (err: any) {
      console.error('Error registering user:', err);
      return res.status(500).json({ success: false, error: 'Server error creating user account.' });
    }
  });

  app.get('/api/auth/user', (req: Request, res: Response) => {
    const phone = req.query.phone as string;
    if (!phone) {
      return res.status(400).json({ error: 'Phone query required' });
    }
    const user = dbHelper.getUserByPhone(phone);
    if (!user) {
      return res.status(404).json({ error: 'User not found in Google Sheets database' });
    }
    return res.json({ success: true, user });
  });

  // ==========================================
  // PRODUCTS & CATALOG ROUTES
  // ==========================================

  app.get('/api/products', (req: Request, res: Response) => {
    try {
      let products = dbHelper.getProducts();
      const { category, q, sort } = req.query;

      if (category && category !== 'All') {
        products = products.filter((p: any) => p.Category.toLowerCase() === String(category).toLowerCase());
      }

      if (q && String(q).trim()) {
        const query = String(q).toLowerCase().trim();
        products = products.filter((p: any) =>
          (p.Title && p.Title.toLowerCase().includes(query)) ||
          (p.Description && p.Description.toLowerCase().includes(query)) ||
          (p.Category && p.Category.toLowerCase().includes(query)) ||
          (p.ProductID && p.ProductID.toLowerCase().includes(query))
        );
      }

      if (sort === 'price-low') {
        products.sort((a: any, b: any) => Number(a.Price) - Number(b.Price));
      } else if (sort === 'price-high') {
        products.sort((a: any, b: any) => Number(b.Price) - Number(a.Price));
      } else if (sort === 'rating') {
        products.sort((a: any, b: any) => Number(b.Rating) - Number(a.Rating));
      }

      return res.json({ success: true, count: products.length, products });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Error fetching products from Sheets' });
    }
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = dbHelper.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json({ success: true, product });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const item = dbHelper.saveProduct(req.body);
      return res.status(201).json({ success: true, product: item });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/products/:id/stock', (req: Request, res: Response) => {
    try {
      const { stock } = req.body;
      if (stock === undefined || stock === null) {
        return res.status(400).json({ error: 'Stock number required' });
      }
      const updated = dbHelper.updateProductStock(req.params.id, stock);
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      return res.json({ success: true, product: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // CART ROUTES
  // ==========================================

  app.get('/api/cart', (req: Request, res: Response) => {
    const userId = (req.query.userId as string) || '6361222162';
    const cart = dbHelper.getCart(userId);
    const subtotal = cart.reduce((sum: number, item: any) => sum + (Number(item.Product?.Price || 0) * (Number(item.Quantity) || 1)), 0);

    return res.json({
      success: true,
      userId,
      items: cart,
      itemCount: cart.reduce((sum: number, i: any) => sum + Number(i.Quantity), 0),
      subtotal,
      shippingFee: subtotal > 499 ? 0 : 40,
      platformFee: 3,
      totalAmount: subtotal > 0 ? (subtotal + (subtotal > 499 ? 0 : 40) + 3) : 0
    });
  });

  app.post('/api/cart', (req: Request, res: Response) => {
    try {
      const { userId = '6361222162', productId, quantity = 1 } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'ProductID required' });
      }

      const cart = dbHelper.addToCart(userId, productId, quantity);
      return res.json({ success: true, message: 'Added to cart', cart });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/cart/:cartId', (req: Request, res: Response) => {
    try {
      const { userId = '6361222162', quantity } = req.body;
      const cart = dbHelper.updateCartQuantity(userId, req.params.cartId, quantity);
      return res.json({ success: true, cart });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/cart/:cartId', (req: Request, res: Response) => {
    try {
      const userId = (req.query.userId as string) || req.body.userId || '6361222162';
      const cart = dbHelper.removeFromCart(userId, req.params.cartId);
      return res.json({ success: true, cart });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // CHECKOUT & ORDERS ROUTES
  // ==========================================

  app.post('/api/checkout', (req: Request, res: Response) => {
    try {
      const orderPayload = req.body;
      const userId = orderPayload.UserID || orderPayload.userId || '6361222162';

      let items = orderPayload.Items || orderPayload.items;
      if (!items || items.length === 0) {
        const cartItems = dbHelper.getCart(userId);
        if (cartItems.length === 0) {
          return res.status(400).json({ error: 'Cart is empty. Please add items to checkout.' });
        }
        items = cartItems.map((c: any) => ({
          ProductID: c.ProductID,
          Title: c.Product?.Title || 'Product Item',
          Price: c.Product?.Price || 0,
          Quantity: c.Quantity,
          ImageUrl: c.Product?.ImageUrl
        }));
      }

      const order = dbHelper.createOrder({
        ...orderPayload,
        UserID: userId,
        Items: items
      });

      console.log(`[ORDER CREATED] ID: ${order.OrderID} by ${order.CustomerName} (${order.Phone}) Total: ₹${order.TotalAmount}`);

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully! Tracking number generated.',
        order
      });
    } catch (err: any) {
      console.error('Error during checkout:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/orders', (req: Request, res: Response) => {
    try {
      const { userId, status, q } = req.query;
      let orders = dbHelper.getOrders((userId as any) || null);

      if (status && status !== 'All') {
        orders = orders.filter((o: any) => o.OrderStatus.toLowerCase() === String(status).toLowerCase());
      }

      if (q && String(q).trim()) {
        const query = String(q).toLowerCase().trim();
        orders = orders.filter((o: any) =>
          (o.OrderID && o.OrderID.toLowerCase().includes(query)) ||
          (o.CustomerName && o.CustomerName.toLowerCase().includes(query)) ||
          (o.Phone && o.Phone.includes(query)) ||
          (o.TrackingNumber && o.TrackingNumber.toLowerCase().includes(query))
        );
      }

      return res.json({ success: true, count: orders.length, orders });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Error fetching orders' });
    }
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = dbHelper.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json({ success: true, order });
  });

  app.put('/api/orders/:id/status', (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: 'Status is required' });

      const updatedOrder: any = dbHelper.updateOrderStatus(req.params.id, status);
      if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });

      console.log(`[ORDER STATUS UPDATED] ${updatedOrder.OrderID} -> ${status}`);
      broadcast({ type: 'order:updated', order: updatedOrder });
      return res.json({
        success: true,
        message: `Order ${updatedOrder.OrderID} updated to ${status}`,
        order: updatedOrder
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  });

  // Customer / AI cancels order
  app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
    try {
      const { reason = 'Customer requested cancellation' } = req.body;
      const order = dbHelper.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      if ((order as any).OrderStatus === 'Cancelled') {
        return res.status(400).json({ success: false, error: 'Order is already cancelled' });
      }

      const updated = dbHelper.cancelOrder(req.params.id, reason);
      broadcast({ type: 'order:updated', order: updated });

      return res.json({
        success: true,
        message: `Order ${req.params.id} has been cancelled successfully. Refund initiated.`,
        order: updated
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // RETURN & REFUND WORKFLOW ROUTES
  // ==========================================

  // Customer initiates return request
  app.post('/api/orders/:id/return', (req: Request, res: Response) => {
    try {
      const { reason, returnType, comments } = req.body;
      const order: any = dbHelper.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      const updated = dbHelper.requestReturn(req.params.id, {
        reason,
        returnType,
        comments,
        refundAmount: order.TotalAmount
      });

      broadcast({ type: 'order:updated', order: updated });
      return res.json({
        success: true,
        message: 'Return request submitted successfully. Pickup will be scheduled.',
        order: updated
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Employee CRM updates return status (Pickup Scheduled -> Item Picked Up -> Refund Processed)
  app.put('/api/orders/:id/return-status', (req: Request, res: Response) => {
    try {
      const { status, restock = true } = req.body;
      if (!status) return res.status(400).json({ error: 'Return status is required' });

      const updated = dbHelper.updateReturnStatus(req.params.id, status, restock);
      if (!updated) return res.status(404).json({ error: 'Order not found' });

      broadcast({ type: 'order:updated', order: updated });
      return res.json({
        success: true,
        message: `Order ${req.params.id} return status updated to ${status}`,
        order: updated
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Customer cancels return
  app.post('/api/orders/:id/cancel-return', (req: Request, res: Response) => {
    try {
      const updated = dbHelper.cancelReturn(req.params.id);
      if (!updated) return res.status(404).json({ error: 'Order not found' });
      broadcast({ type: 'order:updated', order: updated });
      return res.json({ success: true, message: 'Return request cancelled', order: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get all return requests for CRM
  app.get('/api/returns', (req: Request, res: Response) => {
    try {
      const returns = dbHelper.getReturns();
      return res.json({ success: true, count: returns.length, returns });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // CUSTOMERS (EMPLOYEE CRM)
  // ==========================================

  app.get('/api/customers', (req: Request, res: Response) => {
    try {
      const users = dbHelper.getUsers();
      const orders = dbHelper.getOrders();

      const enrichedCustomers = users.map((u: any) => {
        const userOrders = orders.filter((o: any) => String(o.UserID).trim() === String(u.Phone).trim());
        const totalSpent = userOrders
          .filter((o: any) => o.OrderStatus !== 'Cancelled')
          .reduce((sum: number, o: any) => sum + (Number(o.TotalAmount) || 0), 0);

        return {
          ...u,
          orderCount: userOrders.length,
          totalSpent,
          latestOrderDate: userOrders.length > 0 ? (userOrders[0] as any).CreatedAt : null
        };
      });

      return res.json({ success: true, count: enrichedCustomers.length, customers: enrichedCustomers });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Error fetching customers' });
    }
  });

  // ==========================================
  // CUSTOMER CARE & LIVE SUPPORT ROUTES
  // ==========================================

  app.get('/api/support/tickets', (req: Request, res: Response) => {
    try {
      const { phone, orderId } = req.query;
      let tickets = dbHelper.getSupportTickets();
      if (phone) {
        tickets = tickets.filter((t: any) => String(t.CustomerPhone).trim() === String(phone).trim());
      }
      if (orderId) {
        tickets = tickets.filter((t: any) => String(t.OrderID).trim() === String(orderId).trim());
      }
      return res.json({ success: true, count: tickets.length, tickets });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/support/tickets/:ticketId', (req: Request, res: Response) => {
    try {
      const ticket = dbHelper.getTicketById(req.params.ticketId);
      if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
      return res.json({ success: true, ticket });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/support/tickets', (req: Request, res: Response) => {
    try {
      const ticket = dbHelper.createSupportTicket(req.body);
      broadcast({ type: 'ticket:created', ticket });
      return res.status(201).json({ success: true, ticket });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/support/tickets/:ticketId/messages', (req: Request, res: Response) => {
    try {
      const { text, sender = 'support', senderName, orderId } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, error: 'Message text required' });
      }
      const result = dbHelper.addSupportMessage(req.params.ticketId, { text, sender, senderName, orderId });
      if (!result) return res.status(404).json({ success: false, error: 'Ticket not found' });
      broadcast({
        type: 'chat:message',
        ticketId: req.params.ticketId,
        message: result.message,
        ticket: result.ticket
      });
      return res.json({ success: true, message: result.message, ticket: result.ticket });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/support/tickets/:ticketId/status', (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ success: false, error: 'Status is required' });
      const ticket = dbHelper.updateTicketStatus(req.params.ticketId, status);
      if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
      broadcast({ type: 'ticket:status', ticketId: req.params.ticketId, status, ticket });
      return res.json({ success: true, ticket });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/support/callback-request', (req: Request, res: Response) => {
    try {
      const { phone = '6361222162', orderId = '', name = 'Vishnu' } = req.body;
      const ticket = dbHelper.createSupportTicket({
        customerPhone: phone,
        customerName: name,
        orderId,
        subject: `Instant Phone Callback Request for ${orderId ? 'Order ' + orderId : 'Account Inquiries'}`,
        initialMessage: `Customer requested urgent phone call back regarding ${orderId ? 'Order ' + orderId : 'order / replacement issue'}. Customer Contact: +91-${phone}`,
        priority: 'Urgent'
      });
      broadcast({
        type: 'callback:requested',
        phone,
        orderId,
        name,
        ticket
      });
      return res.json({
        success: true,
        message: `Callback scheduled! Our Senior Executive is calling ${phone} shortly.`,
        ticket
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // AI CUSTOMER SUPPORT AGENT ROUTE (24/7 ENQUIRIES, CANCELLATIONS, RETURNS & REFUNDS)
  // ==========================================

  app.post('/api/ai/support/chat', async (req: Request, res: Response) => {
    try {
      const rawMessage = req.body.message || req.body.userMessage || req.body.text;
      const { phone = '6361222162', orderId = '', ticketId = '' } = req.body;
      if (!rawMessage || !String(rawMessage).trim()) {
        return res.status(400).json({ success: false, error: 'Message text is required' });
      }

      const result = await (aiAgent as any).handleCustomerSupportAiChat({
        message: String(rawMessage).trim(),
        phone: String(phone).trim(),
        orderId: String(orderId || '').trim(),
        ticketId: String(ticketId || '').trim()
      });

      // Broadcast new chat message and any updated order/ticket to all live clients
      if (result.ticket) {
        broadcast({
          type: 'chat:message',
          ticketId: result.ticket.TicketID,
          ticket: result.ticket
        });
      }

      if (result.action?.order) {
        broadcast({
          type: 'order:updated',
          order: result.action.order
        });
      }

      return res.json(result);
    } catch (err: any) {
      console.error('[AI SUPPORT ERROR]:', err);
      return res.status(500).json({ success: false, error: err.message || 'AI Support Assistant error' });
    }
  });

  // ==========================================
  // AUTONOMOUS CRM OPERATIONS AGENT (Hexa)
  // ==========================================

  app.use('/api/agent', agentRouter());

  // ==========================================
  // GOOGLE SHEETS STATS & RAW CSV
  // ==========================================

  app.get('/api/sheets/stats', (req: Request, res: Response) => {
    try {
      const stats = dbHelper.getDatabaseStats();
      return res.json({ success: true, ...stats });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/sheets/raw/:sheet', (req: Request, res: Response) => {
    try {
      const csv = dbHelper.getRawSheetData(req.params.sheet);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.send(csv);
    } catch (err: any) {
      return res.status(404).send('Sheet not found');
    }
  });

  // Portfolio Contact API Endpoint
  app.post('/api/contact', (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;
      console.log(`\n📬 [PORTFOLIO INQUIRY] From: ${name} <${email}>`);
      console.log(`   Topic: ${subject || 'General'}`);
      console.log(`   Message: ${message}\n`);
      return res.json({ success: true, message: 'Inquiry received' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Standalone HTML portal routes
  app.get('/customer-portal.html', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'customer-portal.html'));
  });

  app.get('/employee-crm.html', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'employee-crm.html'));
  });

  app.get('/customer', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'customer-portal.html'));
  });

  app.get('/crm', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'employee-crm.html'));
  });

  // Mount Vite middlewares for SPA
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ['**/data/**', '**/*.csv', '**/google_sheets_*.csv', '**/.system_generated/**', '**/*.log']
        }
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api') || req.path.endsWith('.html')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api') || req.path.endsWith('.html')) {
        return next();
      }
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n================================================================`);
    console.log(`🚀 OmniCommerce Dual Platform running on port ${PORT}!`);
    console.log(`🌐 Base SPA Hub:         http://localhost:${PORT}/`);
    console.log(`🛍️ Customer Portal:      http://localhost:${PORT}/customer-portal.html`);
    console.log(`💼 Employee Back-Office: http://localhost:${PORT}/employee-crm.html`);
    console.log(`💬 Live Support & Chat:  ws://localhost:${PORT}/ws & /api/support/*`);
    console.log(`📊 Google Sheets Engine: /data/google_sheets_*.csv`);
    console.log(`🔑 Target Phone OTP:     6361222162 -> Auto OTP: 122162`);
    console.log(`================================================================\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
