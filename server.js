/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * server.js
 * Express backend handling API routes for:
 * - Phone & OTP Authentication (with special targeted flow for phone 6361222162)
 * - Product Catalog Fetching & Inventory Management
 * - Shopping Cart Operations
 * - Checkout & Order Placement with Inventory Decrement
 * - Employee Order Fulfillment Status Transitions (Pending -> Packed -> Shipped -> Delivered)
 * - Google Sheets persistent database read/writes via db-helper.js
 * - Customer & Back-office CRM static portal serving
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dbHelper from './db-helper.js';
import aiAgent from './ai-agent.js';
import { agentRouter } from './crm-agent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS and Headers middleware
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Request logger
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
  });

  // ==========================================
  // AUTHENTICATION ROUTES (PHONE + OTP)
  // ==========================================

  // Send OTP
  app.post('/api/auth/send-otp', (req, res) => {
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
        testOtp: otp, // Injected for seamless UI auto-fill testing
        isTargetDemoPhone: cleanPhone === '6361222162'
      });
    } catch (err) {
      console.error('Error generating OTP:', err);
      return res.status(500).json({ success: false, error: 'Internal server error generating OTP.' });
    }
  });

  // Verify OTP
  app.post('/api/auth/verify-otp', (req, res) => {
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
    } catch (err) {
      console.error('Error verifying OTP:', err);
      return res.status(500).json({ success: false, error: 'Server error during OTP verification.' });
    }
  });

  // Get all registered users from Google Sheets DB
  app.get('/api/auth/users', (req, res) => {
    try {
      const users = dbHelper.getUsers();
      return res.json({ success: true, users });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Register new customer and persist to Google Sheets DB
  app.post('/api/auth/register', (req, res) => {
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
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get current user profile
  app.get('/api/auth/user', (req, res) => {
    const phone = req.query.phone;
    if (!phone) {
      return res.status(400).json({ error: 'Phone query required' });
    }
    const user = dbHelper.getUserByPhone(phone);
    if (!user) {
      return res.status(404).json({ error: 'User not found in Google Sheets database' });
    }
    return res.json({ success: true, user });
  });

  // Update user address / profile
  app.post('/api/auth/profile', (req, res) => {
    try {
      const user = dbHelper.saveUser(req.body);
      return res.json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // PRODUCTS & CATALOG ROUTES
  // ==========================================

  // Get all products with search & filter
  app.get('/api/products', (req, res) => {
    try {
      let products = dbHelper.getProducts();
      const { category, q, sort } = req.query;

      if (category && category !== 'All') {
        products = products.filter(p => p.Category.toLowerCase() === String(category).toLowerCase());
      }

      if (q && String(q).trim()) {
        const query = String(q).toLowerCase().trim();
        products = products.filter(p =>
          (p.Title && p.Title.toLowerCase().includes(query)) ||
          (p.Description && p.Description.toLowerCase().includes(query)) ||
          (p.Category && p.Category.toLowerCase().includes(query)) ||
          (p.ProductID && p.ProductID.toLowerCase().includes(query))
        );
      }

      if (sort === 'price-low') {
        products.sort((a, b) => Number(a.Price) - Number(b.Price));
      } else if (sort === 'price-high') {
        products.sort((a, b) => Number(b.Price) - Number(a.Price));
      } else if (sort === 'rating') {
        products.sort((a, b) => Number(b.Rating) - Number(a.Rating));
      }

      return res.json({ success: true, count: products.length, products });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Error fetching products from Sheets' });
    }
  });

  // Get single product
  app.get('/api/products/:id', (req, res) => {
    const product = dbHelper.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json({ success: true, product });
  });

  // Create product (Employee CRM)
  app.post('/api/products', (req, res) => {
    try {
      const item = dbHelper.saveProduct(req.body);
      return res.status(201).json({ success: true, product: item });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Update product stock (Employee CRM)
  app.put('/api/products/:id/stock', (req, res) => {
    try {
      const { stock } = req.body;
      if (stock === undefined || stock === null) {
        return res.status(400).json({ error: 'Stock number required' });
      }
      const updated = dbHelper.updateProductStock(req.params.id, stock);
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      return res.json({ success: true, product: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // CART ROUTES
  // ==========================================

  // Get user cart
  app.get('/api/cart', (req, res) => {
    const userId = req.query.userId || '6361222162';
    const cart = dbHelper.getCart(userId);
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.Product?.Price || 0) * (Number(item.Quantity) || 1)), 0);

    return res.json({
      success: true,
      userId,
      items: cart,
      itemCount: cart.reduce((sum, i) => sum + Number(i.Quantity), 0),
      subtotal,
      shippingFee: subtotal > 499 ? 0 : 40,
      platformFee: 3,
      totalAmount: subtotal > 0 ? (subtotal + (subtotal > 499 ? 0 : 40) + 3) : 0
    });
  });

  // Add item to cart
  app.post('/api/cart', (req, res) => {
    try {
      const { userId = '6361222162', productId, quantity = 1 } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'ProductID required' });
      }

      const cart = dbHelper.addToCart(userId, productId, quantity);
      return res.json({ success: true, message: 'Added to cart', cart });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Update quantity in cart
  app.put('/api/cart/:cartId', (req, res) => {
    try {
      const { userId = '6361222162', quantity } = req.body;
      const cart = dbHelper.updateCartQuantity(userId, req.params.cartId, quantity);
      return res.json({ success: true, cart });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Remove item from cart
  app.delete('/api/cart/:cartId', (req, res) => {
    try {
      const userId = req.query.userId || req.body.userId || '6361222162';
      const cart = dbHelper.removeFromCart(userId, req.params.cartId);
      return res.json({ success: true, cart });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // CHECKOUT & ORDERS ROUTES
  // ==========================================

  // Checkout (simulate payment and create order)
  app.post('/api/checkout', (req, res) => {
    try {
      const orderPayload = req.body;
      const userId = orderPayload.UserID || orderPayload.userId || '6361222162';

      let items = orderPayload.Items || orderPayload.items;
      if (!items || items.length === 0) {
        // Fallback to fetch from database cart
        const cartItems = dbHelper.getCart(userId);
        if (cartItems.length === 0) {
          return res.status(400).json({ error: 'Cart is empty. Please add items to checkout.' });
        }
        items = cartItems.map(c => ({
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
    } catch (err) {
      console.error('Error during checkout:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get orders (filtered by user for customer, or all for employee CRM)
  app.get('/api/orders', (req, res) => {
    try {
      const { userId, status, q } = req.query;
      let orders = dbHelper.getOrders(userId || null);

      if (status && status !== 'All') {
        orders = orders.filter(o => o.OrderStatus.toLowerCase() === String(status).toLowerCase());
      }

      if (q && String(q).trim()) {
        const query = String(q).toLowerCase().trim();
        orders = orders.filter(o =>
          (o.OrderID && o.OrderID.toLowerCase().includes(query)) ||
          (o.CustomerName && o.CustomerName.toLowerCase().includes(query)) ||
          (o.Phone && o.Phone.includes(query)) ||
          (o.TrackingNumber && o.TrackingNumber.toLowerCase().includes(query))
        );
      }

      return res.json({ success: true, count: orders.length, orders });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Error fetching orders' });
    }
  });

  // Get single order
  app.get('/api/orders/:id', (req, res) => {
    const order = dbHelper.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json({ success: true, order });
  });

  // Update order status (Employee CRM: Pending -> Packed -> Shipped -> Delivered)
  app.put('/api/orders/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: 'Status is required' });

      const updatedOrder = dbHelper.updateOrderStatus(req.params.id, status);
      if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });

      console.log(`[ORDER STATUS UPDATED] ${updatedOrder.OrderID} -> ${status}`);
      return res.json({
        success: true,
        message: `Order ${updatedOrder.OrderID} updated to ${status}`,
        order: updatedOrder
      });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  });

  // Cancel order
  app.post('/api/orders/:id/cancel', (req, res) => {
    try {
      const { reason = 'Customer requested cancellation' } = req.body;
      const order = dbHelper.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      if (order.OrderStatus === 'Cancelled') {
        return res.status(400).json({ success: false, error: 'Order is already cancelled' });
      }

      const updated = dbHelper.cancelOrder(req.params.id, reason);
      return res.json({
        success: true,
        message: `Order ${req.params.id} has been cancelled successfully. Refund initiated.`,
        order: updated
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // RETURN & REFUND WORKFLOW ROUTES
  // ==========================================

  app.post('/api/orders/:id/return', (req, res) => {
    try {
      const { reason, returnType, comments } = req.body;
      const order = dbHelper.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      const updated = dbHelper.requestReturn(req.params.id, {
        reason,
        returnType,
        comments,
        refundAmount: order.TotalAmount
      });

      return res.json({
        success: true,
        message: 'Return request submitted successfully. Pickup will be scheduled.',
        order: updated
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/orders/:id/return-status', (req, res) => {
    try {
      const { status, restock = true } = req.body;
      if (!status) return res.status(400).json({ error: 'Return status is required' });

      const updated = dbHelper.updateReturnStatus(req.params.id, status, restock);
      if (!updated) return res.status(404).json({ error: 'Order not found' });

      return res.json({
        success: true,
        message: `Order ${req.params.id} return status updated to ${status}`,
        order: updated
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/orders/:id/cancel-return', (req, res) => {
    try {
      const updated = dbHelper.cancelReturn(req.params.id);
      if (!updated) return res.status(404).json({ error: 'Order not found' });
      return res.json({ success: true, message: 'Return request cancelled', order: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/returns', (req, res) => {
    try {
      const returns = dbHelper.getReturns();
      return res.json({ success: true, count: returns.length, returns });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // CUSTOMERS (EMPLOYEE CRM)
  // ==========================================

  app.get('/api/customers', (req, res) => {
    try {
      const users = dbHelper.getUsers();
      const orders = dbHelper.getOrders();

      const enrichedCustomers = users.map(u => {
        const userOrders = orders.filter(o => String(o.UserID).trim() === String(u.Phone).trim());
        const totalSpent = userOrders
          .filter(o => o.OrderStatus !== 'Cancelled')
          .reduce((sum, o) => sum + (Number(o.TotalAmount) || 0), 0);

        return {
          ...u,
          orderCount: userOrders.length,
          totalSpent,
          latestOrderDate: userOrders.length > 0 ? userOrders[0].CreatedAt : null
        };
      });

      return res.json({ success: true, count: enrichedCustomers.length, customers: enrichedCustomers });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Error fetching customers' });
    }
  });

  // ==========================================
  // CUSTOMER CARE & LIVE SUPPORT ROUTES
  // ==========================================

  app.get('/api/support/tickets', (req, res) => {
    try {
      const { phone, orderId } = req.query;
      let tickets = dbHelper.getSupportTickets();
      if (phone) {
        tickets = tickets.filter(t => String(t.CustomerPhone).trim() === String(phone).trim());
      }
      if (orderId) {
        tickets = tickets.filter(t => String(t.OrderID).trim() === String(orderId).trim());
      }
      return res.json({ success: true, count: tickets.length, tickets });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/support/tickets/:ticketId', (req, res) => {
    try {
      const ticket = dbHelper.getTicketById(req.params.ticketId);
      if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
      return res.json({ success: true, ticket });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/support/tickets', (req, res) => {
    try {
      const ticket = dbHelper.createSupportTicket(req.body);
      return res.status(201).json({ success: true, ticket });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/support/tickets/:ticketId/messages', (req, res) => {
    try {
      const { text, sender = 'support', senderName, orderId } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, error: 'Message text required' });
      }
      const result = dbHelper.addSupportMessage(req.params.ticketId, { text, sender, senderName, orderId });
      if (!result) return res.status(404).json({ success: false, error: 'Ticket not found' });
      return res.json({ success: true, message: result.message, ticket: result.ticket });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/support/tickets/:ticketId/status', (req, res) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ success: false, error: 'Status is required' });
      const ticket = dbHelper.updateTicketStatus(req.params.ticketId, status);
      if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
      return res.json({ success: true, ticket });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/support/callback-request', (req, res) => {
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
      return res.json({
        success: true,
        message: `Callback scheduled! Our Senior Executive is calling ${phone} shortly.`,
        ticket
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // AI CUSTOMER SUPPORT AGENT ROUTE
  // ==========================================

  app.post('/api/ai/support/chat', async (req, res) => {
    try {
      const rawMessage = req.body.message || req.body.userMessage || req.body.text;
      const { phone = '6361222162', orderId = '', ticketId = '' } = req.body;
      if (!rawMessage || !String(rawMessage).trim()) {
        return res.status(400).json({ success: false, error: 'Message text is required' });
      }

      const result = await aiAgent.handleCustomerSupportAiChat({
        message: String(rawMessage).trim(),
        phone: String(phone).trim(),
        orderId: String(orderId || '').trim(),
        ticketId: String(ticketId || '').trim()
      });

      return res.json(result);
    } catch (err) {
      console.error('[AI SUPPORT ERROR]:', err);
      return res.status(500).json({ success: false, error: err.message || 'AI Support Assistant error' });
    }
  });

  // ==========================================
  // AUTONOMOUS CRM OPERATIONS AGENT (Hexa)
  // ==========================================

  app.use('/api/agent', agentRouter());

  // ==========================================
  // GOOGLE SHEETS STATS & RAW DATA
  // ==========================================

  app.get('/api/sheets/stats', (req, res) => {
    try {
      const stats = dbHelper.getDatabaseStats();
      return res.json({ success: true, ...stats });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/sheets/raw/:sheet', (req, res) => {
    try {
      const csv = dbHelper.getRawSheetData(req.params.sheet);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.send(csv);
    } catch (err) {
      return res.status(404).send('Sheet not found');
    }
  });

  // Serve static files
  app.use(express.static(path.resolve(__dirname, '.')));

  // Portal routing shortcuts
  app.get('/customer', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'customer-portal.html'));
  });

  app.get('/crm', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'employee-crm.html'));
  });

  return app;
}

// Standalone execution support
const isMain = process.argv[1] && process.argv[1].endsWith('server.js');
if (isMain) {
  const app = createApp();
  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OmniCommerce Backend server running on http://0.0.0.0:${PORT}`);
    console.log(`Customer Portal available at: http://localhost:${PORT}/customer-portal.html`);
    console.log(`Employee CRM available at: http://localhost:${PORT}/employee-crm.html`);
  });
}

export default createApp;
