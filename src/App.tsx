/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OmniCommerce Hub - Dual Customer & Employee CRM Platform
 * Mimicking Amazon & Flipkart Workflows with Google Sheets Persistence
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  MapPin,
  User,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ChevronRight,
  Star,
  ShieldCheck,
  AlertTriangle,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Copy,
  ExternalLink,
  X,
  CreditCard,
  ArrowRight,
  Lock,
  Phone,
  Boxes,
  Store,
  Trash2,
  RotateCcw,
  Headphones,
  MessageSquare,
  Send,
  PhoneCall,
  HelpCircle,
  Check,
  Sparkles
} from 'lucide-react';
import { PortfolioView } from './components/portfolio/PortfolioView';

interface Product {
  ProductID: string;
  Title: string;
  Category: string;
  Price: number;
  MRP: number;
  Discount: string;
  Stock: number;
  Rating: number;
  RatingCount: number;
  Badge?: string;
  ImageUrl: string;
  Description: string;
}

interface CartItem {
  CartID: string;
  UserID: string;
  ProductID: string;
  Quantity: number;
  Product?: Product;
}

interface OrderItem {
  ProductID: string;
  Title: string;
  Price: number;
  Quantity: number;
  ImageUrl?: string;
}

interface Order {
  OrderID: string;
  UserID: string;
  CustomerName: string;
  Phone: string;
  Address: string;
  City: string;
  Pincode: string;
  Items: OrderItem[];
  TotalAmount: number;
  PaymentMethod: string;
  PaymentStatus: string;
  OrderStatus: 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  TrackingNumber: string;
  CreatedAt: string;
  UpdatedAt: string;
  ReturnStatus?: string;
  ReturnReason?: string;
  ReturnType?: string;
  ReturnComments?: string;
  RefundAmount?: number;
  ReturnRequestedAt?: string;
}

interface Customer {
  Phone: string;
  Name: string;
  Email: string;
  Address: string;
  City: string;
  Pincode: string;
  Role: string;
  orderCount: number;
  totalSpent: number;
  LastLoginAt: string;
}

interface SupportMessage {
  id: string;
  sender: 'customer' | 'support';
  senderName: string;
  text: string;
  timestamp: string;
  orderId?: string;
}

interface SupportTicket {
  TicketID: string;
  OrderID?: string;
  CustomerPhone: string;
  CustomerName: string;
  Subject: string;
  Status: 'Open' | 'In Progress' | 'Resolved';
  Priority: 'Urgent' | 'High' | 'Normal';
  LastMessage: string;
  CreatedAt: string;
  UpdatedAt: string;
  Messages: SupportMessage[];
}

export default function App() {
  // Navigation / Portal State
  const [activePortal, setActivePortal] = useState<'portfolio' | 'customer' | 'crm'>('portfolio');
  const [crmSubTab, setCrmSubTab] = useState<'orders' | 'returns' | 'support' | 'inventory' | 'customers' | 'sheets'>('orders');

  // Customer State
  const [currentUser, setCurrentUser] = useState<{
    Phone: string;
    Name: string;
    Address: string;
    City: string;
    Pincode: string;
  }>({
    Phone: '6361222162',
    Name: 'Vishnu (Demo Customer)',
    Address: '#42, 4th Cross, 100 Feet Road, Indiranagar',
    City: 'Bengaluru',
    Pincode: '560038'
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');

  // Modals & Navigation Views
  const [customerViewTab, setCustomerViewTab] = useState<'shop' | 'orders'>('shop');
  const [customerOrderFilter, setCustomerOrderFilter] = useState<'All' | 'Delivered' | 'Returns'>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isEmployeeInitiateReturnModalOpen, setIsEmployeeInitiateReturnModalOpen] = useState(false);
  const [employeeReturnOrderId, setEmployeeReturnOrderId] = useState('');
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);
  const [returnForm, setReturnForm] = useState({
    reason: "Defective or doesn't work properly",
    returnType: 'Refund to UPI/Account',
    comments: ''
  });

  // Multi-User Authentication & Profile Switching
  const [authTab, setAuthTab] = useState<'profiles' | 'custom' | 'register'>('profiles');
  const [allUsersList, setAllUsersList] = useState<any[]>([
    {
      Phone: '6361222162',
      Name: 'Vishnu (Demo Customer)',
      Email: 'vishnu@example.com',
      Address: '#42, 4th Cross, 100 Feet Road, Indiranagar',
      City: 'Bengaluru',
      Pincode: '560038',
      Role: 'Customer',
      tag: 'Tech & Flagships',
      otp: '122162',
      avatar: '👨‍💻'
    },
    {
      Phone: '9876543210',
      Name: 'Priya Sharma',
      Email: 'priya.sharma@example.com',
      Address: 'Flat 204, Green Heights, Powai',
      City: 'Mumbai',
      Pincode: '400076',
      Role: 'Customer',
      tag: 'Fashion & Audio',
      otp: '543210',
      avatar: '👩‍💼'
    },
    {
      Phone: '9811223344',
      Name: 'Rajesh Kumar',
      Email: 'rajesh.kumar@delhitech.in',
      Address: 'B-12, Barakhamba Road, Connaught Place',
      City: 'New Delhi',
      Pincode: '110001',
      Role: 'Customer',
      tag: 'Enterprise Buyer',
      otp: '223344',
      avatar: '👨‍💼'
    },
    {
      Phone: '9744556677',
      Name: 'Sneha Patel',
      Email: 'sneha.patel@gujaratmall.com',
      Address: '702, Iscon Elegance, SG Highway',
      City: 'Ahmedabad',
      Pincode: '380015',
      Role: 'Customer',
      tag: 'Lifestyle & Kitchen',
      otp: '556677',
      avatar: '👩‍🍳'
    },
    {
      Phone: '9633221100',
      Name: 'Amit Verma',
      Email: 'amit.verma@gamersguild.in',
      Address: 'Plot 88, Silicon Valley, Hitec City',
      City: 'Hyderabad',
      Pincode: '500081',
      Role: 'Customer',
      tag: 'Gaming & Tech',
      otp: '221100',
      avatar: '🎮'
    },
    {
      Phone: '9123456789',
      Name: 'Employee Administrator (CRM)',
      Email: 'admin@omnicommerce.internal',
      Address: 'Corporate HQ, Outer Ring Road',
      City: 'Bengaluru',
      Pincode: '560103',
      Role: 'Employee_Admin',
      tag: 'Back-Office Admin',
      otp: '456789',
      avatar: '🛡️'
    }
  ]);

  // Registration Form
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Bengaluru',
    pincode: '560001'
  });

  // OTP Flow
  const [otpPhoneInput, setOtpPhoneInput] = useState('6361222162');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');
  const [otpCodeInput, setOtpCodeInput] = useState('122162');
  const [generatedOtp, setGeneratedOtp] = useState('122162');
  const [authLoading, setAuthLoading] = useState(false);

  // Checkout Flow
  const [checkoutForm, setCheckoutForm] = useState({
    Name: 'Vishnu (Demo Customer)',
    Phone: '6361222162',
    Address: '#42, 4th Cross, 100 Feet Road, Indiranagar',
    City: 'Bengaluru',
    Pincode: '560038',
    PaymentMethod: 'UPI (GPay / PhonePe)'
  });

  // CRM State
  const [crmOrders, setCrmOrders] = useState<Order[]>([]);
  const [crmOrderFilter, setCrmOrderFilter] = useState('All');
  const [crmSearchQuery, setCrmSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sheetsStats, setSheetsStats] = useState<any>(null);
  const [rawCsvText, setRawCsvText] = useState('');
  const [activeRawSheet, setActiveRawSheet] = useState('orders');

  // New Product Form
  const [newProductForm, setNewProductForm] = useState({
    Title: '',
    Category: 'Electronics',
    Price: 19999,
    MRP: 24999,
    Stock: 20,
    ImageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    Description: 'High performance device with advanced connectivity.'
  });

  // Customer Care & Live Chat State
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [isCustomerChatOpen, setIsCustomerChatOpen] = useState(false);
  const [activeCustomerTicket, setActiveCustomerTicket] = useState<SupportTicket | null>(null);
  const [customerChatMessage, setCustomerChatMessage] = useState('');
  const [customerChatLinkedOrderId, setCustomerChatLinkedOrderId] = useState('');
  const [isCallRequested, setIsCallRequested] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [customerChatTab, setCustomerChatTab] = useState<'live' | 'tickets'>('live');
  
  // Persistent in-session conversation messages (stay visible until reload or manual reset)
  const [sessionChatMessages, setSessionChatMessages] = useState<Array<{
    id: string;
    sender: 'customer' | 'ai';
    senderName: string;
    text: string;
    timestamp: string;
    productCards?: any[];
  }>>([]);

  const [aiSuggestedActions, setAiSuggestedActions] = useState<string[]>([
    '⚡ Cancel Recent Order',
    '🔄 Return / Replace Item',
    '💳 Check Refund Status',
    '🚚 Track Delivery',
    '📞 Speak to Human Executive'
  ]);

  // CRM Support Desk State
  const [crmSelectedTicket, setCrmSelectedTicket] = useState<SupportTicket | null>(null);
  const [crmChatMessage, setCrmChatMessage] = useState('');
  const [crmTicketFilter, setCrmTicketFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [crmTicketSearch, setCrmTicketSearch] = useState('');

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initial Data Fetching
  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchOrders();
    fetchCrmOrders();
    fetchCustomers();
    fetchSheetsStats();
    fetchAllUsers();
  }, [selectedCategory, sortOption, currentUser.Phone]);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users) && data.users.length > 0) {
        setAllUsersList(data.users.map((u: any) => ({
          ...u,
          avatar: u.Role === 'Employee_Admin' ? '🛡️' : (u.Name.includes('Priya') || u.Name.includes('Sneha') ? '👩‍💼' : '👨‍💻'),
          tag: u.Role === 'Employee_Admin' ? 'CRM Admin' : (u.City || 'Customer'),
          otp: u.Phone.slice(-6)
        })));
      }
    } catch {
      // ignore
    }
  };

  const handleSelectUserAccount = (user: any) => {
    setCurrentUser({
      Phone: user.Phone,
      Name: user.Name,
      Address: user.Address || '#10, Central Road',
      City: user.City || 'Bengaluru',
      Pincode: user.Pincode || '560001'
    });
    setCheckoutForm({
      Name: user.Name,
      Phone: user.Phone,
      Address: user.Address || '#10, Central Road',
      City: user.City || 'Bengaluru',
      Pincode: user.Pincode || '560001',
      PaymentMethod: 'UPI (GPay / PhonePe)'
    });
    setIsOtpModalOpen(false);
    showToast(`Logged in as ${user.Name} (+91-${user.Phone})! Cart & Orders refreshed.`, 'success');
  };

  const handleRegisterNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = registerForm.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }
    if (!registerForm.name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Account created & stored in Google Sheets! Logging in as ${data.user.Name}...`, 'success');
        setCurrentUser(data.user);
        setCheckoutForm({
          Name: data.user.Name,
          Phone: data.user.Phone,
          Address: data.user.Address,
          City: data.user.City,
          Pincode: data.user.Pincode,
          PaymentMethod: 'UPI (GPay / PhonePe)'
        });
        setIsOtpModalOpen(false);
        fetchAllUsers();
        fetchCustomers();
        fetchSheetsStats();
      } else {
        showToast(data.error || 'Registration failed', 'error');
      }
    } catch {
      showToast('Network error creating account', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      let url = `/api/products?category=${encodeURIComponent(selectedCategory)}&sort=${sortOption}`;
      if (searchQuery.trim()) {
        url += `&q=${encodeURIComponent(searchQuery.trim())}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart?userId=${currentUser.Phone}`);
      const data = await res.json();
      if (data.success) {
        setCartItems(data.items);
        setCartSubtotal(data.subtotal);
        setCartTotal(data.totalAmount);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?userId=${currentUser.Phone}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchCrmOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setCrmOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching CRM orders:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchSheetsStats = async () => {
    try {
      const res = await fetch('/api/sheets/stats');
      const data = await res.json();
      if (data.success) {
        setSheetsStats(data);
      }
    } catch (err) {
      console.error('Error fetching sheets stats:', err);
    }
  };

  const loadRawCsv = async (sheetName: string) => {
    try {
      setActiveRawSheet(sheetName);
      const res = await fetch(`/api/sheets/raw/${sheetName}`);
      const text = await res.text();
      setRawCsvText(text);
    } catch (err) {
      setRawCsvText('Error loading raw CSV from Sheets backend.');
    }
  };

  // Support & Live Chat Handlers
  const fetchSupportTickets = async () => {
    try {
      const res = await fetch('/api/support/tickets');
      const data = await res.json();
      if (data.success) {
        setSupportTickets(data.tickets);
        if (activeCustomerTicket) {
          const updated = data.tickets.find((t: SupportTicket) => t.TicketID === activeCustomerTicket.TicketID);
          if (updated) setActiveCustomerTicket(updated);
        }
        if (crmSelectedTicket) {
          const updated = data.tickets.find((t: SupportTicket) => t.TicketID === crmSelectedTicket.TicketID);
          if (updated) setCrmSelectedTicket(updated);
        } else if (data.tickets.length > 0) {
          setCrmSelectedTicket(data.tickets[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching support tickets:', err);
    }
  };

  useEffect(() => {
    fetchSupportTickets();

    // WebSocket real-time subscription
    let ws: WebSocket | null = null;
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat:message' || data.type === 'ticket:created' || data.type === 'ticket:status') {
            fetchSupportTickets();
            if (data.type === 'chat:message' && data.message?.sender === 'support') {
              showToast(`Support Executive: "${data.message.text.substring(0, 45)}..."`, 'info');
            } else if (data.type === 'callback:requested') {
              showToast(`Urgent callback requested by ${data.name} (+91-${data.phone})`, 'info');
            }
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // ignore
    }

    const interval = setInterval(fetchSupportTickets, 4000);
    return () => {
      clearInterval(interval);
      if (ws) ws.close();
    };
  }, []);

  const handleOpenCustomerChat = (orderId?: string) => {
    setIsCustomerChatOpen(true);
    if (orderId) {
      setCustomerChatLinkedOrderId(orderId);
      // check if existing ticket for this order exists
      const existing = supportTickets.find((t) => t.OrderID === orderId && t.CustomerPhone === currentUser.Phone);
      if (existing) {
        setActiveCustomerTicket(existing);
        return;
      }
    }
    // pick or find latest ticket for this customer
    const userTickets = supportTickets.filter((t) => t.CustomerPhone === currentUser.Phone);
    if (userTickets.length > 0) {
      setActiveCustomerTicket(userTickets[0]);
    }
  };

  const handleCancelOrder = async (orderId: string, reason?: string) => {
    const cancelReason = reason || prompt('Please enter cancellation reason (e.g. Changed mind, Found better price):', 'Changed my mind / Order placed by mistake');
    if (cancelReason === null) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason || 'Customer requested cancellation' })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`⚡ Order #${orderId} cancelled! Full refund initiated.`, 'success');
        fetchOrders();
        fetchProducts();
        fetchSheetsStats();
      } else {
        showToast(data.error || 'Failed to cancel order', 'error');
      }
    } catch (err) {
      showToast('Error cancelling order', 'error');
    }
  };

  const handleClearSessionChat = () => {
    setSessionChatMessages([]);
    showToast('Started new conversation session. Session chat history cleared.', 'info');
  };

  const handleSendCustomerMessage = async (presetText?: string) => {
    const textToSend = presetText || customerChatMessage.trim();
    if (!textToSend) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: 'msg-' + Date.now() + '-user',
      sender: 'customer' as const,
      senderName: currentUser.Name || 'You',
      text: textToSend,
      timestamp: timeStr
    };

    setSessionChatMessages(prev => [...prev, userMsg]);
    setCustomerChatMessage('');
    setIsAiResponding(true);

    try {
      const res = await fetch('/api/ai/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          phone: currentUser.Phone,
          orderId: customerChatLinkedOrderId || (activeCustomerTicket?.OrderID || ''),
          ticketId: activeCustomerTicket?.TicketID || ''
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.ticket) {
          setActiveCustomerTicket(data.ticket);
        }
        if (data.suggestedActions && data.suggestedActions.length > 0) {
          setAiSuggestedActions(data.suggestedActions);
        }

        const replyText = data.reply || (data.ticket && data.ticket.Messages && data.ticket.Messages.slice(-1)[0]?.text) || 'Your request has been processed.';
        const aiMsg = {
          id: 'msg-' + Date.now() + '-ai',
          sender: 'ai' as const,
          senderName: 'OmniBot AI Specialist',
          text: replyText,
          productCards: data.productCards || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setSessionChatMessages(prev => [...prev, aiMsg]);

        if (data.action?.type === 'ORDER_CANCELLED') {
          showToast(`⚡ Order #${data.action.orderId} cancelled! Full refund initiated.`, 'success');
        } else if (data.action?.type === 'RETURN_REQUESTED') {
          showToast(`🔄 Return & ${data.action.returnType} requested for #${data.action.orderId}!`, 'success');
        } else if (data.action?.type === 'CALLBACK_SCHEDULED') {
          showToast(`📞 Instant callback scheduled for +91-${currentUser.Phone}!`, 'success');
        }
        fetchOrders();
        fetchProducts();
        fetchSupportTickets();
        fetchSheetsStats();
      } else {
        const errorMsg = {
          id: 'msg-' + Date.now() + '-err',
          sender: 'ai' as const,
          senderName: 'OmniBot AI Specialist',
          text: data.error || 'Sorry, I encountered an issue processing your request.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setSessionChatMessages(prev => [...prev, errorMsg]);
        showToast(data.error || 'AI Support Assistant encountered an issue', 'error');
      }
    } catch (err) {
      showToast('Error communicating with AI support agent', 'error');
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleRequestCallback = async () => {
    try {
      setIsCallRequested(true);
      const res = await fetch('/api/support/callback-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: currentUser.Phone,
          name: currentUser.Name,
          orderId: customerChatLinkedOrderId || (activeCustomerTicket?.OrderID || '')
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('📞 Callback scheduled! Senior Executive will call +91-6361222162 within 5 mins.', 'success');
        fetchSupportTickets();
        if (data.ticket) setActiveCustomerTicket(data.ticket);
      }
    } catch (err) {
      showToast('Error requesting callback', 'error');
    } finally {
      setTimeout(() => setIsCallRequested(false), 5000);
    }
  };

  const handleSendCrmMessage = async (presetText?: string) => {
    if (!crmSelectedTicket) return;
    const textToSend = presetText || crmChatMessage.trim();
    if (!textToSend) return;

    try {
      const res = await fetch(`/api/support/tickets/${crmSelectedTicket.TicketID}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          sender: 'support',
          senderName: 'Rahul Sharma (Senior Support Specialist)',
          orderId: crmSelectedTicket.OrderID
        })
      });
      const data = await res.json();
      if (data.success) {
        setCrmChatMessage('');
        fetchSupportTickets();
        showToast('Message sent to customer!', 'success');
      }
    } catch (err) {
      showToast('Error sending message', 'error');
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Ticket status updated to ${status}!`, 'success');
        fetchSupportTickets();
      }
    } catch (err) {
      showToast('Error updating ticket status', 'error');
    }
  };

  const handleStartChatForOrder = (order: Order) => {
    if (activePortal === 'customer') {
      handleOpenCustomerChat(order.OrderID);
    } else {
      // Find or create ticket for this order in CRM
      let existing = supportTickets.find((t) => t.OrderID === order.OrderID);
      if (existing) {
        setCrmSelectedTicket(existing);
        setCrmSubTab('support');
      } else {
        // create ticket and open
        fetch('/api/support/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.OrderID,
            customerPhone: order.Phone,
            customerName: order.CustomerName,
            subject: `Fulfillment Support for Order ${order.OrderID}`,
            initialMessage: `Support Executive initiated communication regarding Order ${order.OrderID} (${order.OrderStatus}).`,
            sender: 'support',
            senderName: 'Rahul Sharma (Support Executive)'
          })
        })
          .then((r) => r.json())
          .then((d) => {
            if (d.success) {
              fetchSupportTickets();
              setCrmSelectedTicket(d.ticket);
              setCrmSubTab('support');
              showToast(`Opened support channel for Order ${order.OrderID}`, 'info');
            }
          });
      }
    }
  };

  // Cart Handlers
  const handleAddToCart = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.Phone, productId, quantity: 1 })
      });
      const data = await res.json();
      if (data.success) {
        fetchCart();
        showToast('Item added to cart!', 'success');
      }
    } catch (err) {
      showToast('Failed to add to cart', 'error');
    }
  };

  const handleUpdateCartQty = async (cartId: string, qty: number) => {
    try {
      await fetch(`/api/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.Phone, quantity: qty })
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCartItem = async (cartId: string) => {
    try {
      await fetch(`/api/cart/${cartId}?userId=${currentUser.Phone}`, { method: 'DELETE' });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // OTP Authentication
  const handleSendOtp = async () => {
    const clean = otpPhoneInput.replace(/\D/g, '');
    if (clean.length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedOtp(data.testOtp || '122162');
        setOtpCodeInput(data.testOtp || '122162');
        setOtpStep('otp');
        showToast(`OTP generated: ${data.testOtp} (Logged to console & auto-filled)`, 'success');
      } else {
        showToast(data.error || 'Failed to send OTP', 'error');
      }
    } catch (err) {
      showToast('Error requesting OTP', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhoneInput, otp: otpCodeInput })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setIsOtpModalOpen(false);
        showToast(`Welcome ${data.user.Name}! Authenticated via Sheets DB.`, 'success');
        fetchCart();
        fetchOrders();
      } else {
        showToast(data.error || 'Invalid OTP code', 'error');
      }
    } catch (err) {
      showToast('Verification error', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  // Checkout
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    try {
      const payload = {
        UserID: currentUser.Phone,
        CustomerName: checkoutForm.Name,
        Phone: checkoutForm.Phone,
        Address: checkoutForm.Address,
        City: checkoutForm.City,
        Pincode: checkoutForm.Pincode,
        PaymentMethod: checkoutForm.PaymentMethod,
        TotalAmount: cartTotal,
        Items: cartItems.map(i => ({
          ProductID: i.ProductID,
          Title: i.Product?.Title,
          Price: i.Product?.Price,
          Quantity: i.Quantity,
          ImageUrl: i.Product?.ImageUrl
        }))
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsCheckoutOpen(false);
        fetchCart();
        fetchProducts(); // Refresh inventory counts
        fetchOrders();
        fetchCrmOrders();
        fetchSheetsStats();
        showToast(`Order ${data.order.OrderID} confirmed! Tracking: ${data.order.TrackingNumber}`, 'success');
        setIsOrdersModalOpen(true);
      } else {
        showToast(data.error || 'Checkout failed', 'error');
      }
    } catch (err) {
      showToast('Error completing order', 'error');
    }
  };

  // CRM Order Fulfillment
  const handleAdvanceOrderStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus = 'Packed';
    if (currentStatus === 'Pending') nextStatus = 'Packed';
    else if (currentStatus === 'Packed') nextStatus = 'Shipped';
    else if (currentStatus === 'Shipped') nextStatus = 'Delivered';

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order ${orderId} status advanced to ${nextStatus} in Sheets DB!`, 'success');
        fetchCrmOrders();
        fetchOrders();
        fetchSheetsStats();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // CRM Stock Adjustment
  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Stock updated for ${productId} to ${newStock} in Sheets!`, 'success');
        fetchProducts();
        fetchSheetsStats();
      }
    } catch (err) {
      showToast('Failed to update stock', 'error');
    }
  };

  // Add Product to Sheets DB
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsNewProductModalOpen(false);
        showToast('New product added to Google Sheets Products table!', 'success');
        fetchProducts();
        fetchSheetsStats();
      }
    } catch (err) {
      showToast('Failed to save product', 'error');
    }
  };

  // Return & Refund Handlers
  const handleOpenReturnModal = (order: Order) => {
    setSelectedOrderForReturn(order);
    setReturnForm({
      reason: "Defective or doesn't work properly",
      returnType: 'Refund to UPI/Account',
      comments: ''
    });
    setIsReturnModalOpen(true);
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrderForReturn.OrderID}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsReturnModalOpen(false);
        showToast(`Return requested for Order ${selectedOrderForReturn.OrderID}! Pickup will be scheduled.`, 'success');
        fetchOrders();
        fetchCrmOrders();
        fetchSheetsStats();
      } else {
        showToast(data.error || 'Failed to submit return', 'error');
      }
    } catch (err) {
      showToast('Error requesting return', 'error');
    }
  };

  const handleCancelReturn = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel-return`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Return request cancelled for ${orderId}`, 'info');
        fetchOrders();
        fetchCrmOrders();
        fetchSheetsStats();
      }
    } catch (err) {
      showToast('Error cancelling return', 'error');
    }
  };

  const handleUpdateReturnStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/return-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, restock: true })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order ${orderId} return status updated to: ${status}`, 'success');
        fetchOrders();
        fetchCrmOrders();
        fetchProducts();
        fetchSheetsStats();
      } else {
        showToast(data.error || 'Failed to update return', 'error');
      }
    } catch (err) {
      showToast('Error updating return status', 'error');
    }
  };

  // Calculated metrics
  const totalRevenue = crmOrders
    .filter(o => o.OrderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (Number(o.TotalAmount) || 0), 0);
  const pendingOrdersCount = crmOrders.filter(o => o.OrderStatus === 'Pending').length;
  const returnRequestsCount = crmOrders.filter(
    (o) => o.ReturnStatus && o.ReturnStatus !== '' && o.ReturnStatus !== 'Cancelled'
  ).length;
  const lowStockCount = products.filter(p => Number(p.Stock) <= 8).length;

  if (activePortal === 'portfolio') {
    return <PortfolioView onSwitchPortal={(portal) => setActivePortal(portal)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col font-sans">
      
      {/* GLOBAL SYSTEM DUAL-PORTAL SWITCHER HEADER */}
      <nav aria-label="Portal Navigation" className="bg-slate-950 text-white text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-1"></span>
            <span>Sheets DB Engine Live</span>
          </span>
          <span className="text-gray-300 hidden sm:inline">
            OmniCommerce Enterprise Platform &bull; Customer Shopping &amp; Back-Office Fulfillment
          </span>
        </div>

        {/* Portal Switching Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActivePortal('portfolio')}
            className="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>← Vish's Portfolio</span>
          </button>

          <div className="bg-slate-800 p-0.5 rounded-lg flex space-x-1 border border-slate-700">
            <button
              onClick={() => setActivePortal('customer')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activePortal === 'customer'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Customer Portal (Amazon/Flipkart)</span>
            </button>
            <button
              onClick={() => {
                setActivePortal('crm');
                fetchCrmOrders();
              }}
              className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activePortal === 'crm'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Employee Back-Office CRM</span>
              {pendingOrdersCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>

          {/* Standalone HTML File Links */}
          <div className="hidden lg:flex items-center space-x-1 border-l border-slate-800 pl-2">
            <a
              href="/customer-portal.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-amber-400 px-1.5 py-0.5 text-[11px] flex items-center space-x-1"
              title="Open standalone customer-portal.html"
            >
              <span>portal.html</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a
              href="/employee-crm.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 px-1.5 py-0.5 text-[11px] flex items-center space-x-1"
              title="Open standalone employee-crm.html"
            >
              <span>crm.html</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* PORTAL VIEW 1: CUSTOMER PORTAL (AMAZON & FLIPKART WORKFLOW) */}
      {/* ========================================================= */}
      {activePortal === 'customer' && (
        <div className="flex-1 flex flex-col">
          {/* Header Bar */}
          <header className="bg-[#131921] text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
              {/* Brand Logo */}
              <div className="flex flex-col cursor-pointer" onClick={() => setSelectedCategory('All')}>
                <div className="flex items-center">
                  <span className="text-2xl font-black tracking-tight text-white">omni</span>
                  <span className="text-2xl font-black text-amber-400">kart</span>
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded ml-1.5 uppercase">
                    Plus
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 tracking-wider -mt-1 flex items-center">
                  Explore <span className="text-amber-400 font-bold ml-1">Plus</span>
                </span>
              </div>

              {/* Delivery Pin (Amazon Style) */}
              <div
                onClick={() => setIsOtpModalOpen(true)}
                className="hidden md:flex items-center space-x-1.5 text-xs text-gray-300 hover:text-white cursor-pointer px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-gray-400"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <div className="leading-tight">
                  <span className="text-[11px] text-gray-400 block">Deliver to {currentUser.Name.split(' ')[0]}</span>
                  <span className="font-bold text-white text-xs">{currentUser.City} {currentUser.Pincode}</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl flex items-center">
                <div className="relative w-full flex rounded-md overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-amber-500">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-2 border-r border-gray-300 outline-none hover:bg-gray-200 cursor-pointer hidden sm:block"
                  >
                    <option value="All">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Home & Kitchen">Home &amp; Kitchen</option>
                  </select>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                    placeholder="Search iPhone, MacBook, Sony, Nike shoes, appliances..."
                    className="w-full px-4 py-2 text-sm text-gray-900 bg-white outline-none"
                  />
                  <button
                    onClick={fetchProducts}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-5 flex items-center justify-center transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Header Navigation Actions */}
              <div className="flex items-center space-x-3 sm:space-x-5 text-sm">
                {/* Account / Login Trigger */}
                <button
                  onClick={() => setIsOtpModalOpen(true)}
                  className="hover:outline hover:outline-1 hover:outline-gray-400 p-1.5 rounded text-left flex flex-col"
                >
                  <span className="text-[11px] text-gray-300 block">Hello, {currentUser.Name.split(' ')[0]}</span>
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center">
                    +91-{currentUser.Phone}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                  </span>
                </button>

                {/* Returns & Orders (Always visible on mobile & desktop) */}
                <button
                  onClick={() => {
                    fetchOrders();
                    setCustomerViewTab('orders');
                  }}
                  className="hover:outline hover:outline-1 hover:outline-gray-400 p-1.5 rounded text-left flex flex-col relative group transition"
                  title="View your orders and return/replace items"
                >
                  <span className="text-[11px] text-gray-300 flex items-center">
                    <RotateCcw className="w-3 h-3 text-amber-400 mr-1" />
                    <span>Returns</span>
                    {orders.some(o => o.ReturnStatus && o.ReturnStatus !== '' && o.ReturnStatus !== 'Cancelled') && (
                      <span className="w-2 h-2 rounded-full bg-purple-400 ml-1 animate-ping"></span>
                    )}
                  </span>
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center">
                    &amp; Orders ({orders.length})
                  </span>
                </button>

                {/* Direct Return Order Button */}
                <button
                  onClick={() => {
                    fetchOrders();
                    setCustomerViewTab('orders');
                    setIsOrdersModalOpen(true);
                  }}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-2.5 py-1.5 rounded text-xs flex items-center space-x-1 shadow-sm transition"
                  title="Need to return an order? Click here"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Return Order</span>
                </button>

                {/* Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="hover:outline hover:outline-1 hover:outline-gray-400 p-1.5 rounded flex items-center space-x-2 text-white"
                >
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6 text-amber-400" />
                    <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-black text-xs px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                      {cartItems.reduce((sum, i) => sum + Number(i.Quantity), 0)}
                    </span>
                  </div>
                  <span className="font-bold text-sm hidden md:inline">Cart</span>
                </button>
              </div>
            </div>

            {/* Sub-nav Category Strip */}
            <div className="bg-[#232f3e] text-gray-200 text-xs px-4 py-2 border-t border-slate-700 flex items-center justify-between overflow-x-auto gap-4">
              <div className="flex items-center space-x-4 shrink-0">
                {['All', 'Electronics', 'Audio', 'Laptops', 'Fashion', 'Appliances', 'Home & Kitchen'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCustomerViewTab('shop');
                    }}
                    className={`hover:text-amber-400 transition-colors font-medium ${
                      selectedCategory === cat && customerViewTab === 'shop' ? 'text-amber-400 font-bold border-b border-amber-400' : ''
                    }`}
                  >
                    {cat === 'All' ? 'All Deals' : cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-extrabold px-2 py-0.5 rounded text-[11px]">
                  FESTIVE SALE LIVE
                </span>
                <button
                  onClick={() => {
                    fetchOrders();
                    setCustomerViewTab('orders');
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-2.5 py-1 rounded text-[11px] flex items-center space-x-1 shadow transition"
                >
                  <RotateCcw className="w-3 h-3 text-purple-200" />
                  <span>Return or Track Orders ({orders.length})</span>
                </button>
              </div>
            </div>
          </header>

          {/* Festive Banner */}
          <section className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white py-6 px-4 shadow-inner">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Google Sheets Persistent Database Active &bull; Free 7-Day Returns</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">
                  Great Indian Festive Electronics Sale
                </h1>
                <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
                  Shop flagships with fast delivery, or initiate doorstep returns &amp; instant UPI refunds with 1 click. Targeted test customer: <strong>6361222162</strong>.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setOtpPhoneInput('6361222162');
                      setIsOtpModalOpen(true);
                    }}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-md text-xs shadow"
                  >
                    Login (6361222162)
                  </button>
                  <button
                    onClick={() => {
                      fetchOrders();
                      setCustomerViewTab('orders');
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-1.5 rounded-md text-xs shadow flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return My Order (Doorstep Pickup)</span>
                  </button>
                  <button
                    onClick={() => setActivePortal('crm')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded-md text-xs shadow flex items-center space-x-1"
                  >
                    <span>Employee Back-Office CRM</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 text-xs shrink-0 w-full md:w-auto">
                <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                  <span className="font-bold text-amber-400 block"><Truck className="w-4 h-4 inline mr-1" /> Free Delivery</span>
                  <span className="text-gray-300 text-[11px]">Orders over ₹499</span>
                </div>
                <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                  <span className="font-bold text-amber-400 block"><RotateCcw className="w-4 h-4 inline mr-1" /> Easy Returns</span>
                  <span className="text-gray-300 text-[11px]">7-Day Doorstep Pickup</span>
                </div>
              </div>
            </div>
          </section>

          {/* PAGE VIEW SWITCHER: BROWSE CATALOG vs MY ORDERS & RETURN CENTER */}
          <div className="max-w-7xl mx-auto px-4 pt-4 w-full">
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCustomerViewTab('shop')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                    customerViewTab === 'shop'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Shop Catalog Deals ({products.length})</span>
                </button>
                <button
                  onClick={() => {
                    fetchOrders();
                    setCustomerViewTab('orders');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                    customerViewTab === 'orders'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-700 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>My Orders &amp; Return Center ({orders.length})</span>
                  {orders.some(o => o.ReturnStatus && o.ReturnStatus !== '' && o.ReturnStatus !== 'Cancelled') && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                      Active Return
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-500 hidden sm:inline">Returns processed in Google Sheets DB</span>
                <button
                  onClick={() => {
                    fetchOrders();
                    setIsOrdersModalOpen(true);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-xs transition border border-gray-300"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Full Orders Modal</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: SHOP CATALOG */}
          {customerViewTab === 'shop' && (
            <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
              {/* Quick Return Help Banner */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-3.5 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600 text-white p-2 rounded-lg">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Need to return or exchange an item?</h3>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      You have <strong>{orders.length} order(s)</strong> in your account. Doorstep courier pickup &amp; instant refund to UPI/Card.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      fetchOrders();
                      setCustomerViewTab('orders');
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow transition flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>View Orders &amp; Return Items &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Category Strip & Sort */}
              <div className="bg-white p-3.5 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-500 font-medium">Category:</span>
                  <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded border border-blue-200">
                    {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                  </span>
                  <span className="text-gray-500">({products.length} products available)</span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <label className="text-gray-600 font-medium">Sort by:</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 outline-none"
                  >
                    <option value="featured">Featured (Relevance)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((p) => {
                  const inStock = Number(p.Stock) > 0;
                  const isLow = inStock && Number(p.Stock) <= 8;

                  return (
                    <div
                      key={p.ProductID}
                      className="bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                    >
                      <div className="p-4 flex flex-col items-center relative">
                        {p.Badge && (
                          <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-sm">
                            {p.Badge}
                          </span>
                        )}

                        <span
                          className={`absolute top-3 right-3 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            inStock
                              ? isLow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {inStock ? (isLow ? `Only ${p.Stock} left!` : `${p.Stock} in stock`) : 'Out of Stock'}
                        </span>

                        <div className="w-full h-44 flex items-center justify-center overflow-hidden my-3">
                          <img
                            src={p.ImageUrl}
                            alt={p.Title}
                            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="w-full text-left">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            {p.Category}
                          </span>
                          <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mt-0.5 group-hover:text-blue-600 transition-colors">
                            {p.Title}
                          </h3>

                          <div className="flex items-center space-x-1.5 mt-1.5">
                            <span className="bg-emerald-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                              <span>{p.Rating}</span>
                              <Star className="w-2.5 h-2.5 fill-current" />
                            </span>
                            <span className="text-[11px] text-gray-500">
                              ({Number(p.RatingCount).toLocaleString()})
                            </span>
                            <span className="text-[10px] text-blue-600 font-bold ml-auto flex items-center">
                              <ShieldCheck className="w-3 h-3 mr-0.5" /> Assured
                            </span>
                          </div>

                          <div className="mt-2.5 flex items-baseline space-x-2">
                            <span className="text-base font-black text-gray-900">
                              ₹{Number(p.Price).toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{Number(p.MRP).toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-emerald-600 font-bold">{p.Discount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                        <button
                          onClick={() => handleAddToCart(p.ProductID)}
                          disabled={!inStock}
                          className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 px-2 rounded text-xs transition shadow-sm disabled:opacity-40 flex items-center justify-center space-x-1"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                        </button>
                        <button
                          onClick={async () => {
                            await handleAddToCart(p.ProductID);
                            setIsCheckoutOpen(true);
                          }}
                          disabled={!inStock}
                          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-2 rounded text-xs transition shadow-sm disabled:opacity-40"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          )}

          {/* VIEW MODE 2: MY ORDERS & RETURN CENTER (INLINE PAGE VIEW) */}
          {customerViewTab === 'orders' && (
            <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 space-y-6">
              {/* Header Box */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-600 text-white p-3 rounded-xl shadow">
                      <RotateCcw className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-gray-900">
                        My Orders &amp; Returns Center
                      </h2>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Eligible for 7-Day Doorstep Pickup &bull; Instant Refund to Original Payment Method &bull; Synced with Sheets DB
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Filters */}
                    <div className="bg-gray-100 p-1 rounded-lg flex space-x-1 text-xs">
                      {(['All', 'Delivered', 'Returns'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setCustomerOrderFilter(filter)}
                          className={`px-3 py-1 rounded font-bold transition ${
                            customerOrderFilter === filter
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {filter === 'All' ? `All Orders (${orders.length})` : filter === 'Delivered' ? 'Delivered / Return Eligible' : 'Active Returns'}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        fetchOrders();
                        showToast('Updated order statuses from Google Sheets!', 'info');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shadow transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Orders</span>
                    </button>
                  </div>
                </div>

                {/* Return Guarantee Banner */}
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-purple-50/70 p-2.5 rounded-lg border border-purple-100 flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="text-gray-700"><strong>Free Doorstep Pickup:</strong> Courier collects from your address</span>
                  </div>
                  <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-gray-700"><strong>Instant Refund:</strong> Credited immediately upon pickup verification</span>
                  </div>
                  <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-100 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-gray-700"><strong>Flipkart/Amazon Policy:</strong> 7-day hassle-free return window</span>
                  </div>
                </div>
              </div>

              {/* Order Cards List */}
              <div className="space-y-4">
                {orders.filter((o) => {
                  if (customerOrderFilter === 'Delivered') return o.OrderStatus === 'Delivered';
                  if (customerOrderFilter === 'Returns') return o.ReturnStatus && o.ReturnStatus !== '' && o.ReturnStatus !== 'Cancelled';
                  return true;
                }).length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-800 text-base">No Matching Orders Found</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                      {customerOrderFilter === 'Returns'
                        ? 'You have not submitted any return requests yet. Select any completed order below to start a return or exchange.'
                        : 'Place an order from the shop catalog to experience full order tracking and returns.'}
                    </p>
                    <button
                      onClick={() => setCustomerViewTab('shop')}
                      className="mt-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow"
                    >
                      Browse Products Catalog &rarr;
                    </button>
                  </div>
                ) : (
                  orders
                    .filter((o) => {
                      if (customerOrderFilter === 'Delivered') return o.OrderStatus === 'Delivered';
                      if (customerOrderFilter === 'Returns') return o.ReturnStatus && o.ReturnStatus !== '' && o.ReturnStatus !== 'Cancelled';
                      return true;
                    })
                    .map((order) => {
                      const statusSteps = ['Pending', 'Packed', 'Shipped', 'Delivered'];
                      const currentIdx = statusSteps.indexOf(order.OrderStatus);
                      const hasActiveReturn = order.ReturnStatus && order.ReturnStatus !== '' && order.ReturnStatus !== 'Cancelled';

                      return (
                        <div
                          key={order.OrderID}
                          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4 hover:shadow-md transition"
                        >
                          {/* Order Header */}
                          <div className="flex flex-wrap justify-between items-start gap-3 border-b border-gray-100 pb-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-black text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded font-mono">
                                  {order.OrderID}
                                </span>
                                <span className="text-xs text-gray-500">&bull; Placed: {order.CreatedAt}</span>
                                {hasActiveReturn && (
                                  <span className="bg-purple-100 text-purple-800 border border-purple-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
                                    <RotateCcw className="w-2.5 h-2.5" />
                                    <span>{order.ReturnStatus}</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600 mt-1 flex items-center space-x-2">
                                <span>Tracking: <strong className="font-mono text-gray-900">{order.TrackingNumber}</strong></span>
                                <span>&bull;</span>
                                <span>Deliver to: <strong>{order.City} ({order.Pincode})</strong></span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-base font-black text-gray-900">
                                Total: ₹{Number(order.TotalAmount).toLocaleString('en-IN')}
                              </span>
                              <div className="text-[11px] text-emerald-600 font-bold">
                                {order.PaymentMethod} &bull; {order.PaymentStatus}
                              </div>
                            </div>
                          </div>

                          {/* Fulfillment Stepper */}
                          <div>
                            <div className="text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
                              <span className="flex items-center space-x-1">
                                <Package className="w-3.5 h-3.5 text-blue-600" />
                                <span>Delivery Milestone:</span>
                              </span>
                              <span className="font-black text-blue-700 uppercase text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                Status: {order.OrderStatus}
                              </span>
                            </div>

                            <div className="relative flex items-center justify-between px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-0">
                                <div
                                  className="h-full bg-emerald-500 transition-all duration-500"
                                  style={{ width: `${(Math.max(0, currentIdx) / (statusSteps.length - 1)) * 100}%` }}
                                />
                              </div>

                              {statusSteps.map((step, idx) => {
                                const isPassed = idx <= currentIdx;
                                const isCurrent = idx === currentIdx;
                                return (
                                  <div key={step} className="flex flex-col items-center relative z-10 text-center">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                                        isPassed
                                          ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                                          : 'bg-white text-gray-400 border-gray-300'
                                      }`}
                                    >
                                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                                    </div>
                                    <span
                                      className={`text-[10px] font-bold mt-1 ${
                                        isCurrent ? 'text-emerald-700 font-black' : isPassed ? 'text-gray-800' : 'text-gray-400'
                                      }`}
                                    >
                                      {step}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                              Items in Package:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {order.Items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-2.5 bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs"
                                >
                                  <img
                                    src={item.ImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                                    alt={item.Title}
                                    className="w-12 h-12 object-contain rounded bg-white p-1 border border-gray-200"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 truncate">{item.Title}</div>
                                    <div className="text-gray-500 text-[11px] mt-0.5">
                                      Qty: <strong>{item.Quantity}</strong> &bull; ₹{Number(item.Price).toLocaleString('en-IN')} each
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* ========================================= */}
                          {/* RETURN / REPLACEMENT WORKFLOW CONTAINER */}
                          {/* ========================================= */}
                          <div className="pt-3 border-t border-gray-200">
                            {hasActiveReturn ? (
                              <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center space-x-2">
                                    <div className="bg-purple-600 text-white p-1.5 rounded-lg">
                                      <RotateCcw className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <span className="font-black text-purple-900 text-xs uppercase block">
                                        Return Workflow: {order.ReturnStatus}
                                      </span>
                                      <span className="text-[11px] text-purple-700">
                                        Doorstep courier pickup requested for this order
                                      </span>
                                    </div>
                                  </div>

                                  {order.ReturnStatus !== 'Refund Processed' && order.ReturnStatus !== 'Return Rejected' && (
                                    <button
                                      onClick={() => handleCancelReturn(order.OrderID)}
                                      className="text-rose-600 hover:text-rose-700 hover:underline text-xs font-bold"
                                    >
                                      Cancel Return Request
                                    </button>
                                  )}
                                </div>

                                {/* Return Details */}
                                <div className="bg-white p-3 rounded-lg border border-purple-100 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                                  <div>
                                    <span className="text-gray-500 text-[11px] block">Return Reason:</span>
                                    <strong className="text-gray-900">{order.ReturnReason || 'Defective / Damaged Item'}</strong>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-[11px] block">Resolution Preference:</span>
                                    <strong className="text-gray-900">{order.ReturnType || 'Refund to UPI/Account'}</strong> &bull; Amount: <strong className="text-emerald-700">₹{Number(order.RefundAmount || order.TotalAmount).toLocaleString('en-IN')}</strong>
                                  </div>
                                  {order.ReturnComments && (
                                    <div className="sm:col-span-2 text-[11px] bg-gray-50 p-2 rounded text-gray-600">
                                      <em>"{order.ReturnComments}"</em>
                                    </div>
                                  )}
                                </div>

                                {/* 4-Step Return Tracker Stepper */}
                                <div className="bg-white p-3 rounded-lg border border-purple-100">
                                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">
                                    Doorstep Pickup &amp; Refund Progress:
                                  </span>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                                    <div className={`p-2 rounded border ${order.ReturnStatus ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                      <div className="text-[10px] text-emerald-600">Step 1</div>
                                      <div>Return Requested</div>
                                    </div>
                                    <div className={`p-2 rounded border ${order.ReturnStatus === 'Pickup Scheduled' || order.ReturnStatus === 'Out for Pickup' || order.ReturnStatus === 'Refund Processed' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                      <div className="text-[10px] text-blue-600">Step 2</div>
                                      <div>Pickup Scheduled</div>
                                    </div>
                                    <div className={`p-2 rounded border ${order.ReturnStatus === 'Out for Pickup' || order.ReturnStatus === 'Refund Processed' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                      <div className="text-[10px] text-indigo-600">Step 3</div>
                                      <div>Item Picked Up</div>
                                    </div>
                                    <div className={`p-2 rounded border ${order.ReturnStatus === 'Refund Processed' ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                      <div className="text-[10px] text-emerald-700">Step 4</div>
                                      <div>Refund Completed</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-[11px] text-purple-900 flex items-center justify-between">
                                  <span>
                                    Pickup Address: <strong>{order.Address}, {order.City} {order.Pincode}</strong> (Phone: +91-{order.Phone})
                                  </span>
                                  <span className="bg-purple-200/80 px-2 py-0.5 rounded font-bold text-[10px]">
                                    Synced with CRM Back-Office
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gradient-to-r from-purple-50/50 via-white to-purple-50/50 border border-purple-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                                <div>
                                  <div className="flex items-center space-x-1.5 text-purple-900 font-bold text-xs">
                                    <RotateCcw className="w-4 h-4 text-purple-600" />
                                    <span>Need to return or exchange this order?</span>
                                  </div>
                                  <p className="text-[11px] text-gray-600 mt-0.5">
                                    Eligible for 100% Free Doorstep Pickup &amp; Instant UPI Refund.
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    onClick={() => handleStartChatForOrder(order)}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-2 rounded-lg text-xs border border-blue-200 transition flex items-center space-x-1.5"
                                  >
                                    <Headphones className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Need Help? Chat with Executive</span>
                                  </button>
                                  <button
                                    onClick={() => handleOpenReturnModal(order)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition flex items-center space-x-2"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Return or Replace This Order &rarr;</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </main>
          )}

          {/* Floating Customer Care & Return Actions */}
          <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2.5">
            <button
              onClick={() => handleOpenCustomerChat()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-bold border-2 border-blue-400 hover:scale-105 transition-all"
              title="Chat with Customer Care Executive"
            >
              <Headphones className="w-4 h-4" />
              <span>24x7 Customer Care</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            <button
              onClick={() => {
                fetchOrders();
                setCustomerViewTab('orders');
              }}
              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center space-x-2 text-xs font-bold border border-purple-400 hover:scale-105 transition-all"
              title="Need to return or replace an order?"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Returns Center ({orders.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PORTAL VIEW 2: EMPLOYEE CRM (BACK-OFFICE FULFILLMENT & DB) */}
      {/* ========================================================= */}
      {activePortal === 'crm' && (
        <div className="flex-1 flex flex-col bg-slate-900 text-slate-100">
          {/* CRM Header */}
          <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-black text-white">OmniCommerce Employee Back-Office</h2>
                  <span className="bg-blue-900/60 text-blue-400 border border-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    CRM Engine
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time Order Fulfillment &bull; Inventory Stock Control &bull; Google Sheets DB Pipeline
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  fetchCrmOrders();
                  fetchProducts();
                  fetchCustomers();
                  fetchSheetsStats();
                  showToast('Refreshed data from Google Sheets backend!', 'info');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync with Sheets</span>
              </button>
              <button
                onClick={() => setActivePortal('portfolio')}
                className="bg-gradient-to-r from-cyan-950 to-indigo-950 hover:from-cyan-900 hover:to-indigo-900 text-cyan-300 border border-cyan-500/40 font-bold px-3 py-1.5 rounded-lg text-xs shadow flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>← Vish's Portfolio</span>
              </button>
              <button
                onClick={() => setActivePortal('customer')}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow flex items-center space-x-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Return to Customer View</span>
              </button>
            </div>
          </div>

          {/* KPI Cards Strip */}
          <div className="bg-slate-950/40 border-b border-slate-800 px-6 py-4">
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center space-x-3">
                <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg text-lg border border-emerald-500/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Sales</span>
                  <div className="text-base font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center space-x-3">
                <div className="bg-amber-500/10 text-amber-400 p-2.5 rounded-lg text-lg border border-amber-500/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending Orders</span>
                  <div className="text-base font-black text-amber-400">{pendingOrdersCount}</div>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center space-x-3">
                <div className="bg-purple-500/10 text-purple-400 p-2.5 rounded-lg text-lg border border-purple-500/20">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Return Requests</span>
                  <div className="text-base font-black text-purple-400">{returnRequestsCount}</div>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center space-x-3">
                <div className="bg-indigo-500/10 text-indigo-400 p-2.5 rounded-lg text-lg border border-indigo-500/20">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Support Tickets</span>
                  <div className="text-base font-black text-indigo-400">
                    {supportTickets.filter(t => t.Status !== 'Resolved').length} Active
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center space-x-3">
                <div className="bg-rose-500/10 text-rose-400 p-2.5 rounded-lg text-lg border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Low Stock Alerts</span>
                  <div className="text-base font-black text-rose-400">{lowStockCount}</div>
                </div>
              </div>
            </div>
          </div>

          {/* CRM Navigation Subtabs */}
          <div className="max-w-7xl mx-auto px-6 mt-4 w-full">
            <div className="border-b border-slate-800 flex space-x-4 overflow-x-auto">
              <button
                onClick={() => setCrmSubTab('orders')}
                className={`py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 shrink-0 ${
                  crmSubTab === 'orders'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Order Fulfillment Pipeline</span>
                <span className="bg-blue-900/60 text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full">
                  {crmOrders.length}
                </span>
              </button>

              <button
                onClick={() => setCrmSubTab('returns')}
                className={`py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 shrink-0 ${
                  crmSubTab === 'returns'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Returns &amp; Refunds Management</span>
                {returnRequestsCount > 0 && (
                  <span className="bg-purple-900/60 text-purple-300 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                    {returnRequestsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCrmSubTab('support')}
                className={`py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 shrink-0 ${
                  crmSubTab === 'support'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>Support Desk &amp; Live Chat</span>
                {supportTickets.filter(t => t.Status !== 'Resolved').length > 0 && (
                  <span className="bg-indigo-900/80 text-indigo-200 text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                    {supportTickets.filter(t => t.Status !== 'Resolved').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCrmSubTab('inventory')}
                className={`py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 shrink-0 ${
                  crmSubTab === 'inventory'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>Inventory &amp; Stock Levels</span>
              </button>

              <button
                onClick={() => setCrmSubTab('customers')}
                className={`py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 ${
                  crmSubTab === 'customers'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Customer Records (Users Sheet)</span>
              </button>

              <button
                onClick={() => {
                  setCrmSubTab('sheets');
                  loadRawCsv(activeRawSheet);
                }}
                className={`py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 ${
                  crmSubTab === 'sheets'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Google Sheets Console</span>
              </button>
            </div>
          </div>

          {/* CRM Main Content Area */}
          <main className="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
            {/* SUBTAB 1: ORDERS FULFILLMENT */}
            {crmSubTab === 'orders' && (
              <div className="space-y-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={crmSearchQuery}
                      onChange={(e) => setCrmSearchQuery(e.target.value)}
                      placeholder="Search Order ID, Customer Phone (6361222162), Tracking No..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {['All', 'Pending', 'Packed', 'Shipped', 'Delivered', 'Return Requested'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setCrmOrderFilter(status)}
                        className={`px-3 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
                          crmOrderFilter === status
                            ? status === 'Return Requested' ? 'bg-purple-600 text-white shadow' : 'bg-blue-600 text-white shadow'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {status === 'Return Requested' && <RotateCcw className="w-3 h-3 mr-0.5" />}
                        <span>{status}</span>
                        {status === 'Return Requested' && returnRequestsCount > 0 && (
                          <span className="bg-purple-300 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black ml-1">
                            {returnRequestsCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-slate-800/80 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-700">
                        <tr>
                          <th className="py-3 px-4">Order ID &amp; Date</th>
                          <th className="py-3 px-4">Customer Details</th>
                          <th className="py-3 px-4">Ordered Items</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status &amp; Return</th>
                          <th className="py-3 px-4 text-center">Fulfillment Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {crmOrders
                          .filter((o) => {
                            if (crmOrderFilter === 'Return Requested') {
                              return o.ReturnStatus && o.ReturnStatus !== '' && o.ReturnStatus !== 'Cancelled';
                            }
                            if (crmOrderFilter !== 'All' && o.OrderStatus.toLowerCase() !== crmOrderFilter.toLowerCase()) {
                              return false;
                            }
                            if (crmSearchQuery.trim()) {
                              const q = crmSearchQuery.toLowerCase();
                              return (
                                o.OrderID.toLowerCase().includes(q) ||
                                o.CustomerName.toLowerCase().includes(q) ||
                                o.Phone.includes(q) ||
                                o.TrackingNumber.toLowerCase().includes(q)
                              );
                            }
                            return true;
                          })
                          .map((order) => {
                            const isDelivered = order.OrderStatus === 'Delivered';
                            const hasActiveReturn = order.ReturnStatus && order.ReturnStatus !== '' && order.ReturnStatus !== 'Cancelled';

                            return (
                              <tr key={order.OrderID} className="hover:bg-slate-800/50 transition">
                                <td className="py-3 px-4">
                                  <div className="font-black text-blue-400 font-mono">{order.OrderID}</div>
                                  <div className="text-[10px] text-slate-400">{order.CreatedAt}</div>
                                  <div className="text-[10px] text-slate-500 font-mono">Trk: {order.TrackingNumber}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-bold text-white flex items-center space-x-1">
                                    <span>{order.CustomerName}</span>
                                    {order.Phone === '6361222162' && (
                                      <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1 rounded font-bold">
                                        Target Test
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">+91-{order.Phone}</div>
                                  <div className="text-[10px] text-slate-500 truncate max-w-xs">
                                    {order.Address}, {order.City}
                                  </div>
                                  <button
                                    onClick={() => handleStartChatForOrder(order)}
                                    className="mt-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1 transition"
                                  >
                                    <Headphones className="w-3 h-3" />
                                    <span>Chat with Customer</span>
                                  </button>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="space-y-1">
                                    {order.Items.map((item, idx) => (
                                      <div key={idx} className="text-[11px] text-slate-300">
                                        <span className="font-bold text-white">{item.Quantity}x</span> {item.Title}
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-black text-emerald-400 text-sm">
                                    ₹{Number(order.TotalAmount).toLocaleString('en-IN')}
                                  </div>
                                  <span className="text-[10px] text-slate-400 block">{order.PaymentMethod}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="space-y-1">
                                    <span
                                      className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                                        order.OrderStatus === 'Pending'
                                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                          : order.OrderStatus === 'Packed'
                                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                          : order.OrderStatus === 'Shipped'
                                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                                          : order.OrderStatus === 'Returned'
                                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      }`}
                                    >
                                      {order.OrderStatus}
                                    </span>
                                    {hasActiveReturn && (
                                      <div className="mt-1">
                                        <span className="inline-flex items-center space-x-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase bg-purple-900 text-purple-200 border border-purple-500">
                                          <RotateCcw className="w-2.5 h-2.5 mr-0.5" />
                                          <span>{order.ReturnStatus}</span>
                                        </span>
                                        <div className="text-[10px] text-amber-300 mt-0.5 truncate max-w-[140px]" title={order.ReturnReason}>
                                          {order.ReturnReason}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {hasActiveReturn ? (
                                    <div className="space-y-1 max-w-[180px] mx-auto">
                                      {order.ReturnStatus === 'Return Requested' && (
                                        <button
                                          onClick={() => handleUpdateReturnStatus(order.OrderID, 'Pickup Scheduled')}
                                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded text-[11px] transition shadow flex items-center justify-center space-x-1"
                                        >
                                          <Truck className="w-3 h-3" />
                                          <span>Schedule Pickup</span>
                                        </button>
                                      )}
                                      {(order.ReturnStatus === 'Pickup Scheduled' || order.ReturnStatus === 'Out for Pickup') && (
                                        <button
                                          onClick={() => handleUpdateReturnStatus(order.OrderID, 'Refund Processed')}
                                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded text-[11px] transition shadow flex items-center justify-center space-x-1"
                                        >
                                          <RotateCcw className="w-3 h-3" />
                                          <span>Issue Refund &amp; Restock</span>
                                        </button>
                                      )}
                                      {(order.ReturnStatus === 'Refund Processed' || order.ReturnStatus === 'Refunded & Closed') ? (
                                        <span className="text-emerald-400 font-bold text-xs flex items-center justify-center space-x-1">
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          <span>Refunded &bull; Restocked</span>
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => setCrmSubTab('returns')}
                                          className="text-purple-400 hover:underline text-[10px] block mx-auto font-medium"
                                        >
                                          Open in Returns Center &rarr;
                                        </button>
                                      )}
                                    </div>
                                  ) : isDelivered ? (
                                    <div className="space-y-1">
                                      <span className="text-emerald-400 font-bold text-xs flex items-center justify-center space-x-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Delivered</span>
                                      </span>
                                      <button
                                        onClick={() => handleOpenReturnModal(order)}
                                        className="text-purple-400 hover:underline text-[10px] block mx-auto font-medium"
                                      >
                                        + Initiate Return
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleAdvanceOrderStatus(order.OrderID, order.OrderStatus)}
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded text-xs transition flex items-center space-x-1 mx-auto shadow"
                                    >
                                      <span>
                                        Advance to{' '}
                                        {order.OrderStatus === 'Pending'
                                          ? 'Packed'
                                          : order.OrderStatus === 'Packed'
                                          ? 'Shipped'
                                          : 'Delivered'}
                                      </span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleStartChatForOrder(order)}
                                    className="text-indigo-400 hover:text-indigo-300 hover:underline text-[10px] block mx-auto font-medium flex items-center justify-center space-x-1 mt-1.5"
                                  >
                                    <Headphones className="w-2.5 h-2.5" />
                                    <span>Support Chat</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: SUPPORT DESK & LIVE CHAT */}
            {crmSubTab === 'support' && (
              <div className="space-y-4">
                {/* Top Support Bar */}
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">Customer Care &amp; Support Executive Desk</span>
                        <span className="bg-indigo-900/80 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-700">
                          Live Agent Gateway
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Direct two-way customer communication &bull; Order dispute handling &bull; Return &amp; Replacement assistance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        fetchSupportTickets();
                        showToast('Support tickets refreshed from database!', 'info');
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Tickets</span>
                    </button>
                    <button
                      onClick={() => {
                        const phone = prompt('Enter customer phone number to initiate support chat:', '6361222162');
                        if (phone) {
                          const subject = prompt('Enter ticket subject:', 'Support Follow-up regarding order');
                          fetch('/api/support/tickets', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              customerPhone: phone,
                              customerName: phone === '6361222162' ? 'Vishnu (Customer)' : 'Customer',
                              subject: subject || 'Support Follow-up',
                              initialMessage: 'OmniCommerce Support Executive initiated this chat session.',
                              sender: 'support',
                              senderName: 'Rahul Sharma (Support Executive)'
                            })
                          })
                            .then(r => r.json())
                            .then(d => {
                              if (d.success) {
                                fetchSupportTickets();
                                setCrmSelectedTicket(d.ticket);
                                showToast(`New conversation created for +91-${phone}!`, 'success');
                              }
                            });
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow flex items-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Outbound Ticket</span>
                    </button>
                  </div>
                </div>

                {/* 2-Column Split Desk */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[620px]">
                  {/* Left Column: Tickets Queue (4 cols) */}
                  <div className="lg:col-span-4 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-xl">
                    <div className="p-3 border-b border-slate-700 space-y-2.5 bg-slate-900/60">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={crmTicketSearch}
                          onChange={(e) => setCrmTicketSearch(e.target.value)}
                          placeholder="Search phone, ticket #, order..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex space-x-1 text-xs">
                        {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setCrmTicketFilter(filter)}
                            className={`flex-1 py-1 rounded text-[11px] font-bold transition ${
                              crmTicketFilter === filter
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ticket List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-700/50 p-1.5 space-y-1 max-h-[540px]">
                      {supportTickets
                        .filter((t) => {
                          if (crmTicketFilter !== 'All' && t.Status !== crmTicketFilter) return false;
                          if (crmTicketSearch.trim()) {
                            const q = crmTicketSearch.toLowerCase();
                            return (
                              t.TicketID.toLowerCase().includes(q) ||
                              t.CustomerPhone.includes(q) ||
                              (t.OrderID && t.OrderID.toLowerCase().includes(q)) ||
                              t.CustomerName.toLowerCase().includes(q) ||
                              t.Subject.toLowerCase().includes(q)
                            );
                          }
                          return true;
                        })
                        .map((ticket) => {
                          const isSelected = crmSelectedTicket?.TicketID === ticket.TicketID;
                          return (
                            <div
                              key={ticket.TicketID}
                              onClick={() => setCrmSelectedTicket(ticket)}
                              className={`p-3 rounded-lg cursor-pointer transition text-xs ${
                                isSelected
                                  ? 'bg-indigo-950/80 border border-indigo-500/80 text-white'
                                  : 'hover:bg-slate-700/50 text-slate-300 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-indigo-400 text-[11px]">
                                  {ticket.TicketID}
                                </span>
                                <div className="flex items-center space-x-1.5">
                                  {ticket.OrderID && (
                                    <span className="bg-blue-900/60 text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                                      {ticket.OrderID}
                                    </span>
                                  )}
                                  <span
                                    className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                                      ticket.Status === 'Open'
                                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                        : ticket.Status === 'In Progress'
                                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    }`}
                                  >
                                    {ticket.Status}
                                  </span>
                                </div>
                              </div>

                              <div className="font-bold text-white mt-1 truncate">{ticket.Subject}</div>
                              <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                                <span>{ticket.CustomerName} (+91-{ticket.CustomerPhone})</span>
                                <span className="text-[10px] text-slate-500 font-mono">{ticket.UpdatedAt.split(' ')[1] || ticket.UpdatedAt}</span>
                              </div>

                              <div className="text-[11px] text-slate-400 truncate mt-1 bg-slate-900/70 p-1.5 rounded italic">
                                {ticket.LastMessage}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Right Column: Live Chat Panel (8 cols) */}
                  <div className="lg:col-span-8 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-xl">
                    {crmSelectedTicket ? (
                      <>
                        {/* Conversation Header */}
                        <div className="p-4 border-b border-slate-700 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                              {crmSelectedTicket.CustomerName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-white text-sm">{crmSelectedTicket.CustomerName}</h3>
                                <span className="text-xs text-slate-400 font-mono">+91-{crmSelectedTicket.CustomerPhone}</span>
                                {crmSelectedTicket.CustomerPhone === '6361222162' && (
                                  <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1 rounded font-bold">
                                    Target Customer
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                                <span>Ticket: <strong className="font-mono text-indigo-300">{crmSelectedTicket.TicketID}</strong></span>
                                {crmSelectedTicket.OrderID && (
                                  <span>&bull; Linked Order: <strong className="font-mono text-blue-300">{crmSelectedTicket.OrderID}</strong></span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                showToast(`Calling customer +91-${crmSelectedTicket.CustomerPhone}... VoIP simulation active!`, 'success');
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>Call Customer</span>
                            </button>

                            <select
                              value={crmSelectedTicket.Status}
                              onChange={(e) => handleUpdateTicketStatus(crmSelectedTicket.TicketID, e.target.value)}
                              className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none font-bold"
                            >
                              <option value="Open">Status: Open</option>
                              <option value="In Progress">Status: In Progress</option>
                              <option value="Resolved">Status: Resolved</option>
                            </select>
                          </div>
                        </div>

                        {/* Order Context Strip (If Order Linked) */}
                        {crmSelectedTicket.OrderID && (() => {
                          const linkedOrder = crmOrders.find(o => o.OrderID === crmSelectedTicket.OrderID);
                          if (!linkedOrder) return null;
                          return (
                            <div className="bg-slate-950/70 border-b border-slate-700/80 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center space-x-3">
                                <Package className="w-4 h-4 text-blue-400" />
                                <div>
                                  <span className="font-bold text-white">Order {linkedOrder.OrderID}:</span>{' '}
                                  <span className="text-slate-300">₹{Number(linkedOrder.TotalAmount).toLocaleString('en-IN')} &bull; {linkedOrder.Items.map(i => `${i.Quantity}x ${i.Title}`).join(', ')}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  linkedOrder.OrderStatus === 'Delivered' ? 'bg-emerald-950 text-emerald-300' : 'bg-blue-950 text-blue-300'
                                }`}>
                                  {linkedOrder.OrderStatus}
                                </span>
                                {linkedOrder.ReturnStatus && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-purple-900 text-purple-200">
                                    Return: {linkedOrder.ReturnStatus}
                                  </span>
                                )}
                              </div>

                              {/* 1-Click Order Action Shortcuts in Chat */}
                              <div className="flex items-center space-x-2">
                                {linkedOrder.ReturnStatus === 'Return Requested' && (
                                  <button
                                    onClick={() => handleUpdateReturnStatus(linkedOrder.OrderID, 'Pickup Scheduled')}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded text-[11px] shadow flex items-center space-x-1"
                                  >
                                    <Truck className="w-3 h-3" />
                                    <span>Schedule Courier Pickup</span>
                                  </button>
                                )}
                                {(linkedOrder.ReturnStatus === 'Return Requested' || linkedOrder.ReturnStatus === 'Pickup Scheduled') && (
                                  <button
                                    onClick={() => handleUpdateReturnStatus(linkedOrder.OrderID, 'Refund Processed')}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded text-[11px] shadow flex items-center space-x-1"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Instant Refund &amp; Restock</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/40 min-h-[340px] max-h-[380px]">
                          {crmSelectedTicket.Messages && crmSelectedTicket.Messages.length > 0 ? (
                            crmSelectedTicket.Messages.map((msg) => {
                              const isSupport = msg.sender === 'support';
                              return (
                                <div
                                  key={msg.id}
                                  className={`flex flex-col ${isSupport ? 'items-end' : 'items-start'}`}
                                >
                                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-1">
                                    <span className="font-bold text-slate-300">{msg.senderName}</span>
                                    <span>&bull;</span>
                                    <span>{msg.timestamp}</span>
                                  </div>
                                  <div
                                    className={`max-w-lg p-3 rounded-2xl text-xs shadow ${
                                      isSupport
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
                                    }`}
                                  >
                                    {msg.text}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center text-slate-500 py-12 text-xs">
                              No messages in this ticket yet. Send a message to start communicating.
                            </div>
                          )}
                        </div>

                        {/* Executive Canned Responses Chips */}
                        <div className="p-2.5 bg-slate-900/80 border-t border-slate-700/80 flex items-center space-x-1.5 overflow-x-auto text-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Quick Answers:</span>
                          <button
                            onClick={() => handleSendCrmMessage('Hello Vishnu, your doorstep courier pickup has been scheduled with BlueDart for tomorrow 11:00 AM.')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[11px] shrink-0 border border-slate-700"
                          >
                            🚚 Pickup Scheduled
                          </button>
                          <button
                            onClick={() => handleSendCrmMessage('We have processed your full refund to your original UPI account. Google Sheets DB restocked.')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[11px] shrink-0 border border-slate-700"
                          >
                            💵 Refund Processed
                          </button>
                          <button
                            onClick={() => handleSendCrmMessage('A brand-new replacement unit has been dispatched under express courier tracking.')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[11px] shrink-0 border border-slate-700"
                          >
                            🔄 Replacement Dispatched
                          </button>
                        </div>

                        {/* Composer */}
                        <div className="p-3 border-t border-slate-700 bg-slate-900 flex items-center space-x-2">
                          <input
                            type="text"
                            value={crmChatMessage}
                            onChange={(e) => setCrmChatMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSendCrmMessage();
                            }}
                            placeholder="Type support reply to customer (updates real-time)..."
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleSendCrmMessage()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow flex items-center space-x-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Reply</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 text-center">
                        <Headphones className="w-12 h-12 text-slate-600 mb-3" />
                        <h4 className="font-bold text-slate-300 text-sm">Select a Support Ticket to Begin Chat</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">
                          Select any customer ticket from the left queue or click "New Outbound Ticket" to initiate conversation with a customer.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: RETURNS & REFUNDS CENTER */}
            {crmSubTab === 'returns' && (
              <div className="space-y-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-5 h-5 text-purple-400" />
                    <div>
                      <span className="font-bold text-white text-sm">Customer Returns &amp; Refunds Pipeline</span>
                      <p className="text-xs text-slate-400">Manage pickup schedules, review return reasons, and issue simulated refunds with auto-restock.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsEmployeeInitiateReturnModalOpen(true)}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Initiate Return for Customer</span>
                    </button>
                    <button
                      onClick={() => {
                        fetchCrmOrders();
                        showToast('Refreshed returns pipeline!', 'info');
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Returns</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-700">
                        <tr>
                          <th className="py-3 px-4">Order ID &amp; Customer</th>
                          <th className="py-3 px-4">Return Reason &amp; Comments</th>
                          <th className="py-3 px-4">Resolution Type</th>
                          <th className="py-3 px-4">Refund Amount</th>
                          <th className="py-3 px-4">Return Status</th>
                          <th className="py-3 px-4 text-center">Fulfillment Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {crmOrders
                          .filter((o) => o.ReturnStatus && o.ReturnStatus !== '' && o.ReturnStatus !== 'Cancelled')
                          .length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-slate-500">
                                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                <div className="font-bold text-slate-400">No active return requests</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">When customers request a return from their orders page, it will appear here.</div>
                              </td>
                            </tr>
                          ) : (
                            crmOrders
                              .filter((o) => o.ReturnStatus && o.ReturnStatus !== '' && o.ReturnStatus !== 'Cancelled')
                              .map((order) => {
                                const isRefunded = order.ReturnStatus === 'Refund Processed' || order.ReturnStatus === 'Refunded & Closed';
                                const isRejected = order.ReturnStatus === 'Return Rejected';

                                return (
                                  <tr key={order.OrderID} className="hover:bg-slate-800/50 transition">
                                    <td className="py-3 px-4">
                                      <div className="font-black text-blue-400 font-mono">{order.OrderID}</div>
                                      <div className="font-bold text-white mt-0.5">{order.CustomerName}</div>
                                      <div className="text-[10px] text-slate-400 font-mono">+91-{order.Phone}</div>
                                      <div className="text-[10px] text-slate-500 truncate max-w-xs">{order.Address}, {order.City}</div>
                                    </td>
                                    <td className="py-3 px-4 max-w-xs">
                                      <div className="font-bold text-amber-300 text-xs">{order.ReturnReason || 'Defective / Damaged item'}</div>
                                      {order.ReturnComments && (
                                        <div className="text-[11px] text-slate-300 italic mt-0.5 bg-slate-900/60 p-1.5 rounded">
                                          "{order.ReturnComments}"
                                        </div>
                                      )}
                                      <div className="text-[10px] text-slate-500 mt-1">Requested: {order.ReturnRequestedAt || order.UpdatedAt}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className="font-semibold text-slate-200 bg-slate-900 px-2 py-1 rounded text-[11px] border border-slate-700">
                                        {order.ReturnType || 'Refund to UPI/Account'}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="font-black text-emerald-400 text-sm">
                                        ₹{Number(order.RefundAmount || order.TotalAmount).toLocaleString('en-IN')}
                                      </div>
                                      <span className="text-[10px] text-slate-400">{order.PaymentMethod}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                                        order.ReturnStatus === 'Return Requested'
                                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                          : order.ReturnStatus === 'Pickup Scheduled'
                                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                          : isRefunded
                                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                          : isRejected
                                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                          : 'bg-purple-950 text-purple-300 border border-purple-800'
                                      }`}>
                                        {order.ReturnStatus}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      {isRefunded ? (
                                        <div className="text-emerald-400 font-bold text-xs flex items-center justify-center space-x-1">
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          <span>Refund Completed &bull; Restocked</span>
                                        </div>
                                      ) : isRejected ? (
                                        <span className="text-rose-400 font-bold text-xs">Return Rejected</span>
                                      ) : (
                                        <div className="flex flex-col space-y-1.5 max-w-[200px] mx-auto">
                                          {order.ReturnStatus === 'Return Requested' && (
                                            <button
                                              onClick={() => handleUpdateReturnStatus(order.OrderID, 'Pickup Scheduled')}
                                              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded text-xs transition shadow flex items-center justify-center space-x-1"
                                            >
                                              <Truck className="w-3 h-3" />
                                              <span>Schedule Courier Pickup</span>
                                            </button>
                                          )}
                                          {(order.ReturnStatus === 'Return Requested' || order.ReturnStatus === 'Pickup Scheduled') && (
                                            <button
                                              onClick={() => handleUpdateReturnStatus(order.OrderID, 'Refund Processed')}
                                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded text-xs transition shadow flex items-center justify-center space-x-1"
                                            >
                                              <RotateCcw className="w-3 h-3" />
                                              <span>Process Refund &amp; Restock</span>
                                            </button>
                                          )}
                                          <button
                                            onClick={() => handleUpdateReturnStatus(order.OrderID, 'Return Rejected')}
                                            className="bg-slate-700 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 px-2 py-0.5 rounded text-[10px]"
                                          >
                                            Reject Return
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: SUPPORT DESK & LIVE CHAT */}
            {crmSubTab === 'support' && (
              <div className="space-y-4">
                {/* Top Support Bar */}
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">Customer Care &amp; Support Executive Desk</span>
                        <span className="bg-indigo-900/80 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-700">
                          Live Agent Gateway
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Direct two-way customer communication &bull; Order dispute handling &bull; Return &amp; Replacement assistance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        fetchSupportTickets();
                        showToast('Support tickets refreshed from database!', 'info');
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Tickets</span>
                    </button>
                    <button
                      onClick={() => {
                        const phone = prompt('Enter customer phone number to initiate support chat:', '6361222162');
                        if (phone) {
                          const subject = prompt('Enter ticket subject:', 'Support Follow-up regarding order');
                          fetch('/api/support/tickets', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              customerPhone: phone,
                              customerName: phone === '6361222162' ? 'Vishnu (Customer)' : 'Customer',
                              subject: subject || 'Support Follow-up',
                              initialMessage: 'OmniCommerce Support Executive initiated this chat session.',
                              sender: 'support',
                              senderName: 'Rahul Sharma (Support Executive)'
                            })
                          })
                            .then(r => r.json())
                            .then(d => {
                              if (d.success) {
                                fetchSupportTickets();
                                setCrmSelectedTicket(d.ticket);
                                showToast(`New conversation created for +91-${phone}!`, 'success');
                              }
                            });
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow flex items-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Outbound Ticket</span>
                    </button>
                  </div>
                </div>

                {/* 2-Column Split Desk */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[620px]">
                  {/* Left Column: Tickets Queue (4 cols) */}
                  <div className="lg:col-span-4 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-xl">
                    <div className="p-3 border-b border-slate-700 space-y-2.5 bg-slate-900/60">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={crmTicketSearch}
                          onChange={(e) => setCrmTicketSearch(e.target.value)}
                          placeholder="Search phone, ticket #, order..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex space-x-1 text-xs">
                        {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setCrmTicketFilter(filter)}
                            className={`flex-1 py-1 rounded text-[11px] font-bold transition ${
                              crmTicketFilter === filter
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ticket List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-700/50 p-1.5 space-y-1 max-h-[540px]">
                      {supportTickets
                        .filter((t) => {
                          if (crmTicketFilter !== 'All' && t.Status !== crmTicketFilter) return false;
                          if (crmTicketSearch.trim()) {
                            const q = crmTicketSearch.toLowerCase();
                            return (
                              t.TicketID.toLowerCase().includes(q) ||
                              t.CustomerPhone.includes(q) ||
                              (t.OrderID && t.OrderID.toLowerCase().includes(q)) ||
                              t.CustomerName.toLowerCase().includes(q) ||
                              t.Subject.toLowerCase().includes(q)
                            );
                          }
                          return true;
                        })
                        .map((ticket) => {
                          const isSelected = crmSelectedTicket?.TicketID === ticket.TicketID;
                          return (
                            <div
                              key={ticket.TicketID}
                              onClick={() => setCrmSelectedTicket(ticket)}
                              className={`p-3 rounded-lg cursor-pointer transition text-xs ${
                                isSelected
                                  ? 'bg-indigo-950/80 border border-indigo-500/80 text-white'
                                  : 'hover:bg-slate-700/50 text-slate-300 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-indigo-400 text-[11px]">
                                  {ticket.TicketID}
                                </span>
                                <div className="flex items-center space-x-1.5">
                                  {ticket.OrderID && (
                                    <span className="bg-blue-900/60 text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                                      {ticket.OrderID}
                                    </span>
                                  )}
                                  <span
                                    className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                                      ticket.Status === 'Open'
                                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                        : ticket.Status === 'In Progress'
                                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    }`}
                                  >
                                    {ticket.Status}
                                  </span>
                                </div>
                              </div>

                              <div className="font-bold text-white mt-1 truncate">{ticket.Subject}</div>
                              <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                                <span>{ticket.CustomerName} (+91-{ticket.CustomerPhone})</span>
                                <span className="text-[10px] text-slate-500 font-mono">{ticket.UpdatedAt.split(' ')[1] || ticket.UpdatedAt}</span>
                              </div>

                              <div className="text-[11px] text-slate-400 truncate mt-1 bg-slate-900/70 p-1.5 rounded italic">
                                {ticket.LastMessage}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Right Column: Live Chat Panel (8 cols) */}
                  <div className="lg:col-span-8 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-xl">
                    {crmSelectedTicket ? (
                      <>
                        {/* Conversation Header */}
                        <div className="p-4 border-b border-slate-700 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                              {crmSelectedTicket.CustomerName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-white text-sm">{crmSelectedTicket.CustomerName}</h3>
                                <span className="text-xs text-slate-400 font-mono">+91-{crmSelectedTicket.CustomerPhone}</span>
                                {crmSelectedTicket.CustomerPhone === '6361222162' && (
                                  <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1 rounded font-bold">
                                    Target Customer
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                                <span>Ticket: <strong className="font-mono text-indigo-300">{crmSelectedTicket.TicketID}</strong></span>
                                {crmSelectedTicket.OrderID && (
                                  <span>&bull; Linked Order: <strong className="font-mono text-blue-300">{crmSelectedTicket.OrderID}</strong></span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                showToast(`Calling customer +91-${crmSelectedTicket.CustomerPhone}... VoIP simulation active!`, 'success');
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>Call Customer</span>
                            </button>

                            <select
                              value={crmSelectedTicket.Status}
                              onChange={(e) => handleUpdateTicketStatus(crmSelectedTicket.TicketID, e.target.value)}
                              className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none font-bold"
                            >
                              <option value="Open">Status: Open</option>
                              <option value="In Progress">Status: In Progress</option>
                              <option value="Resolved">Status: Resolved</option>
                            </select>
                          </div>
                        </div>

                        {/* Order Context Strip (If Order Linked) */}
                        {crmSelectedTicket.OrderID && (() => {
                          const linkedOrder = crmOrders.find(o => o.OrderID === crmSelectedTicket.OrderID);
                          if (!linkedOrder) return null;
                          return (
                            <div className="bg-slate-950/70 border-b border-slate-700/80 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center space-x-3">
                                <Package className="w-4 h-4 text-blue-400" />
                                <div>
                                  <span className="font-bold text-white">Order {linkedOrder.OrderID}:</span>{' '}
                                  <span className="text-slate-300">₹{Number(linkedOrder.TotalAmount).toLocaleString('en-IN')} &bull; {linkedOrder.Items.map(i => `${i.Quantity}x ${i.Title}`).join(', ')}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  linkedOrder.OrderStatus === 'Delivered' ? 'bg-emerald-950 text-emerald-300' : 'bg-blue-950 text-blue-300'
                                }`}>
                                  {linkedOrder.OrderStatus}
                                </span>
                                {linkedOrder.ReturnStatus && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-purple-900 text-purple-200">
                                    Return: {linkedOrder.ReturnStatus}
                                  </span>
                                )}
                              </div>

                              {/* 1-Click Order Action Shortcuts in Chat */}
                              <div className="flex items-center space-x-2">
                                {linkedOrder.ReturnStatus === 'Return Requested' && (
                                  <button
                                    onClick={() => handleUpdateReturnStatus(linkedOrder.OrderID, 'Pickup Scheduled')}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded text-[11px] shadow flex items-center space-x-1"
                                  >
                                    <Truck className="w-3 h-3" />
                                    <span>Schedule Courier Pickup</span>
                                  </button>
                                )}
                                {(linkedOrder.ReturnStatus === 'Return Requested' || linkedOrder.ReturnStatus === 'Pickup Scheduled') && (
                                  <button
                                    onClick={() => handleUpdateReturnStatus(linkedOrder.OrderID, 'Refund Processed')}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded text-[11px] shadow flex items-center space-x-1"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Instant Refund &amp; Restock</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/40 min-h-[340px] max-h-[380px]">
                          {crmSelectedTicket.Messages && crmSelectedTicket.Messages.length > 0 ? (
                            crmSelectedTicket.Messages.map((msg) => {
                              const isSupport = msg.sender === 'support';
                              return (
                                <div
                                  key={msg.id}
                                  className={`flex flex-col ${isSupport ? 'items-end' : 'items-start'}`}
                                >
                                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-1">
                                    <span className="font-bold text-slate-300">{msg.senderName}</span>
                                    <span>&bull;</span>
                                    <span>{msg.timestamp}</span>
                                  </div>
                                  <div
                                    className={`max-w-lg p-3 rounded-2xl text-xs shadow ${
                                      isSupport
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
                                    }`}
                                  >
                                    {msg.text}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center text-slate-500 py-12 text-xs">
                              No messages in this ticket yet. Send a message to start communicating.
                            </div>
                          )}
                        </div>

                        {/* Executive Canned Responses Chips */}
                        <div className="p-2.5 bg-slate-900/80 border-t border-slate-700/80 flex items-center space-x-1.5 overflow-x-auto text-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Quick Answers:</span>
                          <button
                            onClick={() => handleSendCrmMessage('Hello Vishnu, your doorstep courier pickup has been scheduled with BlueDart for tomorrow 11:00 AM.')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[11px] shrink-0 border border-slate-700"
                          >
                            🚚 Pickup Scheduled
                          </button>
                          <button
                            onClick={() => handleSendCrmMessage('We have processed your full refund to your original UPI account. Google Sheets DB restocked.')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[11px] shrink-0 border border-slate-700"
                          >
                            💵 Refund Processed
                          </button>
                          <button
                            onClick={() => handleSendCrmMessage('A brand-new replacement unit has been dispatched under express courier tracking.')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[11px] shrink-0 border border-slate-700"
                          >
                            🔄 Replacement Dispatched
                          </button>
                        </div>

                        {/* Composer */}
                        <div className="p-3 border-t border-slate-700 bg-slate-900 flex items-center space-x-2">
                          <input
                            type="text"
                            value={crmChatMessage}
                            onChange={(e) => setCrmChatMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSendCrmMessage();
                            }}
                            placeholder="Type support reply to customer (updates real-time)..."
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleSendCrmMessage()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow flex items-center space-x-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Reply</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 text-center">
                        <Headphones className="w-12 h-12 text-slate-600 mb-3" />
                        <h4 className="font-bold text-slate-300 text-sm">Select a Support Ticket to Begin Chat</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">
                          Select any customer ticket from the left queue or click "New Outbound Ticket" to initiate conversation with a customer.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 3: INVENTORY & CATALOG */}
            {crmSubTab === 'inventory' && (
              <div className="space-y-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">Product Inventory Catalog</span>
                    <span className="text-xs text-slate-400">&bull; Persistent in Google Sheets Products Tab</span>
                  </div>
                  <button
                    onClick={() => setIsNewProductModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Product to Sheets</span>
                  </button>
                </div>

                <div className="bg-slate-800/80 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-700">
                        <tr>
                          <th className="py-3 px-4">Product Details</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Stock Quantity</th>
                          <th className="py-3 px-4">Stock Status</th>
                          <th className="py-3 px-4 text-center">Adjust Stock in Sheets</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {products.map((p) => {
                          const stock = Number(p.Stock);
                          const isLow = stock <= 8;
                          const isOut = stock === 0;

                          return (
                            <tr key={p.ProductID} className="hover:bg-slate-800/50 transition">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={p.ImageUrl}
                                    alt={p.Title}
                                    className="w-10 h-10 object-contain bg-white rounded p-1 border border-slate-700 shrink-0"
                                  />
                                  <div>
                                    <span className="font-mono text-[10px] text-blue-400 font-bold">
                                      {p.ProductID}
                                    </span>
                                    <div className="font-bold text-white line-clamp-1 max-w-sm">{p.Title}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-300 font-semibold">{p.Category}</td>
                              <td className="py-3 px-4 font-black text-white">
                                ₹{Number(p.Price).toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-sm text-white">{stock} units</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    isOut
                                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                      : isLow
                                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  }`}
                                >
                                  {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'OPTIMAL'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center space-x-1.5">
                                  <button
                                    onClick={() => handleUpdateStock(p.ProductID, Math.max(0, stock - 5))}
                                    className="bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-200 text-xs font-bold"
                                    title="Decrease stock by 5"
                                  >
                                    -5
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStock(p.ProductID, stock + 10)}
                                    className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white text-xs font-bold"
                                    title="Restock +10 units"
                                  >
                                    +10 Restock
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 3: CUSTOMER RECORDS */}
            {crmSubTab === 'customers' && (
              <div className="space-y-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Customer Database (Google Sheets Users Tab)</h3>
                    <p className="text-xs text-slate-400">Captured through Phone OTP logins and checkout records.</p>
                  </div>
                  <button
                    onClick={fetchCustomers}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Users</span>
                  </button>
                </div>

                <div className="bg-slate-800/80 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-700">
                        <tr>
                          <th className="py-3 px-4">Phone Number</th>
                          <th className="py-3 px-4">Full Name</th>
                          <th className="py-3 px-4">Delivery Address</th>
                          <th className="py-3 px-4">Orders Placed</th>
                          <th className="py-3 px-4">Lifetime Spend</th>
                          <th className="py-3 px-4">Last Activity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {customers.map((c) => (
                          <tr key={c.Phone} className="hover:bg-slate-800/50 transition">
                            <td className="py-3 px-4">
                              <span className="font-mono text-xs font-bold text-white flex items-center space-x-1.5">
                                <span>+91-{c.Phone}</span>
                                {c.Phone === '6361222162' && (
                                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 rounded">
                                    Target
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-white">{c.Name}</td>
                            <td className="py-3 px-4 text-slate-300">
                              <div>{c.Address}</div>
                              <div className="text-[10px] text-slate-500">
                                {c.City} {c.Pincode}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-blue-400">{c.orderCount || 0} orders</td>
                            <td className="py-3 px-4 font-black text-emerald-400">
                              ₹{Number(c.totalSpent || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[10px]">{c.LastLoginAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 4: GOOGLE SHEETS CONSOLE */}
            {crmSubTab === 'sheets' && (
              <div className="space-y-6">
                <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-xl border border-emerald-500/30 text-2xl">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">Google Sheets Persistent Engine</h3>
                        <p className="text-xs text-slate-400">
                          Active file path: <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300">/data/google_sheets_*.csv</code>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {['users', 'products', 'orders', 'cart'].map((sheet) => (
                      <button
                        key={sheet}
                        onClick={() => loadRawCsv(sheet)}
                        className={`p-3.5 rounded-lg border text-left transition ${
                          activeRawSheet === sheet
                            ? 'bg-blue-900/30 border-blue-500'
                            : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold uppercase text-slate-200">Sheet: {sheet}</span>
                          <span className="text-[10px] text-blue-400 font-mono">TAB</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-2">Click to inspect raw CSV</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>Google Sheets Raw Tab: {activeRawSheet.toUpperCase()}</span>
                    </h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(rawCsvText);
                        showToast('CSV copied to clipboard!', 'info');
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-2.5 py-1 rounded font-semibold flex items-center space-x-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy CSV</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto max-h-72 border border-slate-800">
                    {rawCsvText || 'Click any sheet tab above to inspect raw contents.'}
                  </pre>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CART DRAWER */}
      {/* ========================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-4 bg-[#131921] text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base">Shopping Cart</h3>
                  <span className="bg-amber-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartItems.reduce((sum, i) => sum + Number(i.Quantity), 0)}
                  </span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center text-gray-500">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <h4 className="font-bold text-gray-700 text-sm">Your shopping cart is empty</h4>
                    <p className="text-xs text-gray-400 mt-1">Browse our products and add items to your cart.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.CartID}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <img
                        src={item.Product?.ImageUrl || ''}
                        alt={item.Product?.Title}
                        className="w-16 h-16 object-contain bg-white rounded p-1 border border-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">
                          {item.Product?.Title || 'Product Item'}
                        </h4>
                        <div className="text-xs font-black text-gray-900 mt-0.5">
                          ₹{Number(item.Product?.Price || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-300 rounded bg-white text-xs">
                            <button
                              onClick={() => handleUpdateCartQty(item.CartID, Number(item.Quantity) - 1)}
                              className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 font-bold">{item.Quantity}</span>
                            <button
                              onClick={() => handleUpdateCartQty(item.CartID, Number(item.Quantity) + 1)}
                              className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 font-bold"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleDeleteCartItem(item.CartID)}
                            className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-gray-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span className="text-gray-900 font-semibold">₹3</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total Amount:</span>
                      <span className="text-base text-gray-950 font-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 px-4 rounded-md shadow transition text-sm flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CHECKOUT & SIMULATED PAYMENT */}
      {/* ========================================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-200 my-8">
            <div className="bg-[#131921] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Checkout &amp; Order Placement</h3>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-6">
              <div>
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-2">
                  <span className="bg-amber-400 text-slate-900 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                    1
                  </span>
                  <h4>Shipping Address</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={checkoutForm.Name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, Name: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={checkoutForm.Phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, Phone: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={checkoutForm.Address}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, Address: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      value={checkoutForm.City}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, City: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={checkoutForm.Pincode}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, Pincode: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-2">
                  <span className="bg-amber-400 text-slate-900 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                    2
                  </span>
                  <h4>Payment Simulation Method</h4>
                </div>
                <div className="space-y-2 text-xs">
                  {['UPI (GPay / PhonePe)', 'Credit / Debit Card', 'Cash on Delivery (COD)'].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                        checkoutForm.PaymentMethod === method
                          ? 'border-amber-400 bg-amber-50/50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment"
                          checked={checkoutForm.PaymentMethod === method}
                          onChange={() => setCheckoutForm({ ...checkoutForm, PaymentMethod: method })}
                        />
                        <span className="font-semibold text-gray-900">{method}</span>
                      </div>
                      <span className="text-emerald-700 font-bold text-[10px] bg-emerald-100 px-2 py-0.5 rounded">
                        VERIFIED
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center text-sm font-bold text-gray-900 mb-2">
                  <span>Total Amount Payable:</span>
                  <span className="text-xl text-emerald-700 font-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-md shadow-lg transition text-sm flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Order &amp; Deduct Stock in Sheets DB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MULTI-USER AUTHENTICATION & REGISTRATION */}
      {/* ========================================================= */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 my-6">
            {/* Modal Header */}
            <div className="bg-[#131921] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">OmniCommerce Multi-User Access</h3>
                  <p className="text-[11px] text-gray-300">Select demo account, enter mobile OTP, or register new user</p>
                </div>
              </div>
              <button onClick={() => setIsOtpModalOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthTab('profiles')}
                className={`flex-1 py-3 text-center border-b-2 transition ${
                  authTab === 'profiles'
                    ? 'border-amber-500 text-amber-800 bg-white shadow-xs'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                👥 Demo Accounts ({allUsersList.length})
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('custom')}
                className={`flex-1 py-3 text-center border-b-2 transition ${
                  authTab === 'custom'
                    ? 'border-amber-500 text-amber-800 bg-white shadow-xs'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                📱 Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-3 text-center border-b-2 transition ${
                  authTab === 'register'
                    ? 'border-amber-500 text-amber-800 bg-white shadow-xs'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                ➕ Register New
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto">
              {/* TAB 1: PRE-SEEDED MULTI-USER PROFILES */}
              {authTab === 'profiles' && (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                    <span>⚡ 1-Click Multi-Account Switcher &bull; Persisted to Google Sheets DB</span>
                    <span className="font-bold text-emerald-700 text-[11px] bg-emerald-100 px-2 py-0.5 rounded">6 Pre-Configured</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {allUsersList.map((user) => {
                      const isCurrent = currentUser.Phone === user.Phone;
                      return (
                        <div
                          key={user.Phone}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                            isCurrent
                              ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-400/30'
                              : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50/70'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center text-lg shrink-0">
                              {user.avatar || '👤'}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-gray-900 text-xs truncate">{user.Name}</span>
                                {isCurrent && (
                                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-500 flex items-center space-x-2 mt-0.5">
                                <span className="font-mono text-gray-700 font-semibold">+91-{user.Phone}</span>
                                <span>&bull;</span>
                                <span className="truncate">{user.City}</span>
                              </div>
                              <div className="text-[10px] text-indigo-700 font-medium mt-0.5">
                                {user.tag || user.Role}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 ml-2">
                            {isCurrent ? (
                              <span className="text-emerald-700 font-bold text-xs flex items-center space-x-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                                <Check className="w-3.5 h-3.5" />
                                <span>Logged In</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelectUserAccount(user)}
                                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition cursor-pointer flex items-center space-x-1"
                              >
                                <span>Login</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: CUSTOM MOBILE & OTP VERIFICATION */}
              {authTab === 'custom' && (
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-900">
                    <p>Enter any 10-digit mobile number. Our backend will generate and auto-verify the OTP through Google Sheets.</p>
                  </div>

                  {otpStep === 'phone' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Phone Number</label>
                        <div className="flex rounded-md shadow-sm border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                          <span className="bg-gray-100 text-gray-600 px-3 py-2 text-sm font-semibold border-r border-gray-300 flex items-center">
                            +91
                          </span>
                          <input
                            type="tel"
                            value={otpPhoneInput}
                            onChange={(e) => setOtpPhoneInput(e.target.value)}
                            maxLength={10}
                            placeholder="6361222162"
                            className="w-full px-3 py-2 text-sm text-gray-900 outline-none"
                          />
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">We will send a 6-digit OTP code to this mobile number.</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={authLoading}
                        className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2.5 px-4 rounded-md shadow transition text-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        <span>{authLoading ? 'Sending...' : 'Continue & Get OTP'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Enter 6-Digit OTP</label>
                        <button type="button" onClick={() => setOtpStep('phone')} className="text-xs text-blue-600 hover:underline">
                          Change Phone
                        </button>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded flex items-center justify-between">
                        <div>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline mr-1.5" />
                          <span>Generated OTP for <strong>+91-{otpPhoneInput}</strong>: <strong>{generatedOtp}</strong></span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpCodeInput(generatedOtp)}
                          className="text-xs font-bold text-emerald-700 underline cursor-pointer"
                        >
                          Auto-Fill
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        value={otpCodeInput}
                        onChange={(e) => setOtpCodeInput(e.target.value)}
                        className="w-full text-center text-xl font-mono tracking-widest py-2 border-2 border-amber-400 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
                      />

                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={authLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-md shadow transition text-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{authLoading ? 'Verifying...' : 'Verify OTP & Login'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: REGISTER NEW CUSTOMER ACCOUNT */}
              {authTab === 'register' && (
                <form onSubmit={handleRegisterNewUser} className="space-y-3 text-xs">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 text-purple-900">
                    <span>Create a new customer profile. Data is stored directly in <strong>google_sheets_users.csv</strong>.</span>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Mobile Phone (10 digits) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        placeholder="9876543210"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="user@example.com"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Street Address</label>
                    <input
                      type="text"
                      value={registerForm.address}
                      onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                      placeholder="#12, Main Street, Landmark"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">City</label>
                      <input
                        type="text"
                        value={registerForm.city}
                        onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                        placeholder="Bengaluru"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Pincode</label>
                      <input
                        type="text"
                        value={registerForm.pincode}
                        onChange={(e) => setRegisterForm({ ...registerForm, pincode: e.target.value })}
                        placeholder="560001"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-xs shadow transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{authLoading ? 'Creating Profile...' : 'Save to Google Sheets DB & Login'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ORDER TRACKING & FULFILLMENT STEPS */}
      {/* ========================================================= */}
      {isOrdersModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 my-8">
            <div className="bg-[#131921] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Your Orders &amp; Fulfillment Milestones</h3>
              </div>
              <button onClick={() => setIsOrdersModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center space-x-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>Synchronized with Google Sheets CRM Fulfillment pipeline.</span>
              </div>
              <button
                onClick={() => {
                  fetchOrders();
                  showToast('Updated order statuses from Sheets!', 'info');
                }}
                className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded hover:bg-blue-700 transition"
              >
                Refresh Status
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-800 text-sm">No Orders Placed Yet</h4>
                  <p className="text-xs text-gray-400 mt-1">Place an order to see live tracking milestones!</p>
                </div>
              ) : (
                orders.map((order) => {
                  const statusSteps = ['Pending', 'Packed', 'Shipped', 'Delivered'];
                  const currentIdx = statusSteps.indexOf(order.OrderStatus);

                  return (
                    <div
                      key={order.OrderID}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-200 pb-3">
                        <div>
                          <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-mono">
                            {order.OrderID}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">Placed: {order.CreatedAt}</span>
                          <div className="text-xs text-gray-600 mt-1">
                            Tracking: <strong className="font-mono text-gray-900">{order.TrackingNumber}</strong>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-gray-900">
                            Total: ₹{Number(order.TotalAmount).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] block text-emerald-600 font-bold">
                            {order.PaymentMethod} &bull; {order.PaymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* 4-Step Milestone Stepper */}
                      <div>
                        <div className="text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
                          <span>Fulfillment Progress:</span>
                          <span className="font-black text-blue-600 uppercase text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Current: {order.OrderStatus}
                          </span>
                        </div>

                        <div className="relative flex items-center justify-between px-2 py-3 bg-white rounded-lg border border-gray-200">
                          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-0">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${(Math.max(0, currentIdx) / (statusSteps.length - 1)) * 100}%` }}
                            />
                          </div>

                          {statusSteps.map((step, idx) => {
                            const isPassed = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;
                            return (
                              <div key={step} className="flex flex-col items-center relative z-10 text-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                                    isPassed
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                                      : 'bg-white text-gray-400 border-gray-300'
                                  }`}
                                >
                                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span
                                  className={`text-[10px] font-bold mt-1.5 ${
                                    isCurrent ? 'text-emerald-700 font-black' : isPassed ? 'text-gray-800' : 'text-gray-400'
                                  }`}
                                >
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Package Contents:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {order.Items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200 text-xs"
                            >
                              <img
                                src={item.ImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                                alt={item.Title}
                                className="w-10 h-10 object-contain rounded border border-gray-100"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-800 truncate">{item.Title}</div>
                                <div className="text-gray-500 text-[11px]">
                                  Qty: {item.Quantity} &bull; ₹{Number(item.Price).toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Return & Replacement Workflow Section */}
                      <div className="pt-2 border-t border-gray-200">
                        {order.ReturnStatus && order.ReturnStatus !== '' && order.ReturnStatus !== 'Cancelled' ? (
                          <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-purple-900 flex items-center space-x-1.5">
                                <RotateCcw className="w-4 h-4 text-purple-600" />
                                <span>Return Request: <strong className="uppercase">{order.ReturnStatus}</strong></span>
                              </span>
                              {order.ReturnStatus !== 'Refund Processed' && order.ReturnStatus !== 'Return Rejected' && (
                                <button
                                  onClick={() => handleCancelReturn(order.OrderID)}
                                  className="text-red-600 hover:underline text-[11px] font-semibold"
                                >
                                  Cancel Return
                                </button>
                              )}
                            </div>
                            <div className="text-gray-700 text-[11px] space-y-0.5">
                              <div>Reason: <strong>{order.ReturnReason}</strong></div>
                              <div>Resolution: <strong>{order.ReturnType || 'Refund'}</strong> &bull; Amount: <strong>₹{Number(order.RefundAmount || order.TotalAmount).toLocaleString('en-IN')}</strong></div>
                              {order.ReturnComments && <div>Comments: <em>"{order.ReturnComments}"</em></div>}
                            </div>
                            <div className="text-[10px] text-purple-800 font-medium bg-white/80 p-2 rounded border border-purple-100 flex items-center justify-between">
                              <span>
                                {order.ReturnStatus === 'Return Requested' && 'Courier agent will contact you soon for inspection & pickup.'}
                                {order.ReturnStatus === 'Pickup Scheduled' && 'Pickup scheduled! Courier agent assigned for verification.'}
                                {order.ReturnStatus === 'Refund Processed' && 'Refund credited to your original payment method. Inventory restocked.'}
                                {order.ReturnStatus === 'Return Rejected' && 'Return request could not be approved.'}
                              </span>
                              <span className="font-bold">{order.City}</span>
                            </div>
                          </div>
                        ) : order.OrderStatus === 'Cancelled' ? (
                          <div className="flex items-center justify-between bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                            <div>
                              <span className="text-xs font-bold text-rose-800 block">❌ Order Cancelled</span>
                              <span className="text-[11px] text-rose-600">
                                Refund: ₹{Number(order.TotalAmount).toLocaleString('en-IN')} &bull; Status: {order.PaymentStatus}
                              </span>
                            </div>
                            <button
                              onClick={() => handleOpenCustomerChat(order.OrderID)}
                              className="bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1.5 shadow-sm transition"
                            >
                              <span>🤖 AI Refund Help</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-gray-200">
                            <div>
                              <span className="text-xs font-bold text-gray-800 block">Need Help or Change?</span>
                              <span className="text-[11px] text-gray-500">
                                {order.OrderStatus === 'Delivered'
                                  ? '7-Day Return & Replacement window is active.'
                                  : 'Order is being prepared. You can track, modify, or cancel.'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {(order.OrderStatus === 'Pending' || order.OrderStatus === 'Packed') && (
                                <button
                                  onClick={() => handleCancelOrder(order.OrderID)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-2.5 py-1.5 rounded text-xs flex items-center space-x-1 shadow-sm transition"
                                >
                                  <span>⚡ Cancel Order</span>
                                </button>
                              )}
                              {order.OrderStatus === 'Delivered' && (
                                <button
                                  onClick={() => handleOpenReturnModal(order)}
                                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold px-2.5 py-1.5 rounded text-xs flex items-center space-x-1 shadow-sm transition"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Return or Replace</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenCustomerChat(order.OrderID)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1.5 rounded text-xs flex items-center space-x-1 shadow-sm transition"
                              >
                                <span>🤖 Ask OmniBot</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-gray-600 bg-amber-50 p-2 rounded border border-amber-200 flex items-center justify-between">
                        <span>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
                          Update from <strong>Employee CRM</strong> will reflect here instantly!
                        </span>
                        <button
                          onClick={() => {
                            setIsOrdersModalOpen(false);
                            setActivePortal('crm');
                          }}
                          className="text-blue-600 hover:underline font-bold text-[10px]"
                        >
                          Switch to Back-Office &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RETURN & REPLACEMENT REQUEST */}
      {/* ========================================================= */}
      {isReturnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 my-8">
            <div className="bg-[#131921] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Return or Replace Order #{selectedOrderForReturn.OrderID}</h3>
              </div>
              <button onClick={() => setIsReturnModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="p-6 space-y-4 text-xs">
              {/* Order Items Preview */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-bold text-gray-600 block text-[11px] mb-1 uppercase tracking-wider">Returning items from this order:</span>
                <div className="space-y-1">
                  {selectedOrderForReturn.Items.map((item, idx) => (
                    <div key={idx} className="flex justify-between font-medium text-gray-800">
                      <span className="truncate max-w-[280px]">{item.Quantity}x {item.Title}</span>
                      <span className="font-bold">₹{Number(item.Price).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 font-bold text-gray-900">
                  <span>Refundable Amount:</span>
                  <span className="text-emerald-700 font-black text-sm">₹{Number(selectedOrderForReturn.TotalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Reason Selector */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">Reason for Return</label>
                <select
                  value={returnForm.reason}
                  onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none text-xs bg-white text-gray-900"
                >
                  <option value="Defective or doesn't work properly">Defective or doesn't work properly</option>
                  <option value="Product damaged during transit">Product damaged during transit</option>
                  <option value="Different item received">Different item received from order</option>
                  <option value="Quality or performance not adequate">Quality or performance not as expected</option>
                  <option value="Size or fit issue">Size or fit issue</option>
                  <option value="Missing parts or accessories">Missing parts or accessories</option>
                </select>
              </div>

              {/* Resolution Preference */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">Resolution Preference</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2.5 border rounded-lg cursor-pointer flex items-center space-x-2 ${returnForm.returnType === 'Refund to UPI/Account' ? 'border-amber-400 bg-amber-50/50' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="returnType"
                      checked={returnForm.returnType === 'Refund to UPI/Account'}
                      onChange={() => setReturnForm({ ...returnForm, returnType: 'Refund to UPI/Account' })}
                    />
                    <div>
                      <span className="font-bold text-gray-900 block text-xs">Refund</span>
                      <span className="text-[10px] text-gray-500">Back to UPI / Card</span>
                    </div>
                  </label>
                  <label className={`p-2.5 border rounded-lg cursor-pointer flex items-center space-x-2 ${returnForm.returnType === 'Replacement Unit' ? 'border-amber-400 bg-amber-50/50' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="returnType"
                      checked={returnForm.returnType === 'Replacement Unit'}
                      onChange={() => setReturnForm({ ...returnForm, returnType: 'Replacement Unit' })}
                    />
                    <div>
                      <span className="font-bold text-gray-900 block text-xs">Replacement</span>
                      <span className="text-[10px] text-gray-500">Free exchange unit</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Customer Comments */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">Detailed Feedback (Optional)</label>
                <textarea
                  rows={2}
                  value={returnForm.comments}
                  onChange={(e) => setReturnForm({ ...returnForm, comments: e.target.value })}
                  placeholder="Provide more details about the issue to help our fulfillment team..."
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none text-xs"
                />
              </div>

              {/* Pickup Address */}
              <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-[11px] text-gray-600">
                <span className="font-bold text-gray-800 block">Pickup Location:</span>
                <span>{selectedOrderForReturn.Address}, {selectedOrderForReturn.City} {selectedOrderForReturn.Pincode}</span>
                <span className="block text-gray-500 mt-0.5">Phone: +91-{selectedOrderForReturn.Phone}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-md shadow transition text-xs flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Submit Return Request &amp; Sync to CRM</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD PRODUCT TO SHEETS */}
      {/* ========================================================= */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-700">
            <div className="bg-slate-900 p-4 flex items-center justify-between border-b border-slate-700">
              <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Add Product to Google Sheets DB</span>
              </h4>
              <button onClick={() => setIsNewProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  value={newProductForm.Title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, Title: e.target.value })}
                  placeholder="e.g. Apple iPad Air 11-inch M2"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={newProductForm.Category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, Category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Home & Kitchen">Home &amp; Kitchen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProductForm.Stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, Stock: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newProductForm.Price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, Price: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={newProductForm.MRP}
                    onChange={(e) => setNewProductForm({ ...newProductForm, MRP: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProductForm.ImageUrl}
                  onChange={(e) => setNewProductForm({ ...newProductForm, ImageUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-xs shadow transition"
              >
                Save Product to Sheets Catalog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EMPLOYEE INITIATE RETURN FOR CUSTOMER */}
      {/* ========================================================= */}
      {isEmployeeInitiateReturnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-700">
            <div className="bg-slate-900 p-4 flex items-center justify-between border-b border-slate-700">
              <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>Initiate Return Request on Customer's Behalf</span>
              </h4>
              <button onClick={() => setIsEmployeeInitiateReturnModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!employeeReturnOrderId) {
                showToast('Please select an order to return', 'error');
                return;
              }
              try {
                const res = await fetch(`/api/orders/${employeeReturnOrderId}/return`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(returnForm)
                });
                const data = await res.json();
                if (data.success) {
                  setIsEmployeeInitiateReturnModalOpen(false);
                  showToast(`Return request logged for ${employeeReturnOrderId}! Synced with Sheets.`, 'success');
                  fetchCrmOrders();
                  fetchOrders();
                  fetchSheetsStats();
                } else {
                  showToast(data.error || 'Failed to initiate return', 'error');
                }
              } catch (err) {
                showToast('Network error initiating return', 'error');
              }
            }} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Select Customer Order</label>
                <select
                  value={employeeReturnOrderId}
                  onChange={(e) => setEmployeeReturnOrderId(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                >
                  <option value="">-- Choose an Order --</option>
                  {crmOrders.map((o) => (
                    <option key={o.OrderID} value={o.OrderID}>
                      {o.OrderID} - {o.CustomerName} (+91-{o.Phone}) - ₹{o.TotalAmount} ({o.OrderStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Customer Reported Reason</label>
                <select
                  value={returnForm.reason}
                  onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                >
                  <option value="Defective or doesn't work properly">Defective or doesn't work properly</option>
                  <option value="Product damaged during transit">Product damaged during transit</option>
                  <option value="Different item received">Different item received from order</option>
                  <option value="Quality or performance not adequate">Quality or performance not as expected</option>
                  <option value="Size or fit issue">Size or fit issue</option>
                  <option value="Missing parts or accessories">Missing parts or accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Resolution Requested</label>
                <select
                  value={returnForm.returnType}
                  onChange={(e) => setReturnForm({ ...returnForm, returnType: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                >
                  <option value="Refund to UPI/Account">Full Refund to UPI / Bank</option>
                  <option value="Replacement Unit">Replacement Unit (Exchange)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Agent Notes / Call Log</label>
                <textarea
                  rows={2}
                  value={returnForm.comments}
                  onChange={(e) => setReturnForm({ ...returnForm, comments: e.target.value })}
                  placeholder="Customer contacted support regarding..."
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-lg text-xs shadow transition flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Create Return &amp; Schedule Courier in Sheets DB</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 24x7 CUSTOMER CARE & LIVE SUPPORT DRAWER (CUSTOMER VIEW) */}
      {/* ========================================================= */}
      {isCustomerChatOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCustomerChatOpen(false);
          }}
        >
          <div
            className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-indigo-900/50 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg border border-indigo-300/30">
                    🤖
                  </div>
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 absolute bottom-0 right-0 animate-pulse"></span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-white">OmniBot AI Specialist</h3>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wide uppercase">
                      24/7 AI Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Logged in as: <strong>{currentUser.Name.split(' ')[0]}</strong> (+91-{currentUser.Phone})
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={handleClearSessionChat}
                  title="Clear chat and start fresh conversation"
                  className="text-xs bg-white/10 hover:bg-white/20 text-slate-200 px-2 py-1 rounded-md transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomerChatOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Callback Banner */}
            <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border-b border-indigo-100 p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="text-gray-700 text-[11px] font-medium">Prefer speaking with human specialist?</span>
              </div>
              <button
                type="button"
                onClick={handleRequestCallback}
                disabled={isCallRequested}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded text-[10px] shadow transition flex items-center space-x-1 disabled:opacity-50"
              >
                <span>{isCallRequested ? 'Calling...' : 'Request Call'}</span>
              </button>
            </div>

            {/* Mode Switcher: Active AI Session vs Past Support Tickets */}
            <div className="flex border-b border-gray-200 bg-gray-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCustomerChatTab('live')}
                className={`flex-1 py-2 text-center transition flex items-center justify-center space-x-1.5 ${
                  customerChatTab === 'live'
                    ? 'bg-white text-indigo-900 border-b-2 border-indigo-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Active AI Chat {sessionChatMessages.length > 0 && `(${sessionChatMessages.length})`}</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomerChatTab('tickets')}
                className={`flex-1 py-2 text-center transition flex items-center justify-center space-x-1.5 ${
                  customerChatTab === 'tickets'
                    ? 'bg-white text-indigo-900 border-b-2 border-indigo-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Past Tickets ({supportTickets.filter(t => t.CustomerPhone === currentUser.Phone).length})</span>
              </button>
            </div>

            {customerChatTab === 'live' ? (
              <>
                {/* Linked Order Badge / Selector */}
                <div className="bg-slate-50 border-b border-gray-200 p-2.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                      <Package className="w-3 h-3 text-indigo-600" />
                      <span>Order Context (Optional):</span>
                    </span>
                    {customerChatLinkedOrderId && (
                      <span className="text-indigo-600 font-bold font-mono text-[11px]">#{customerChatLinkedOrderId}</span>
                    )}
                  </div>
                  <select
                    value={customerChatLinkedOrderId}
                    onChange={(e) => setCustomerChatLinkedOrderId(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-1.5 text-xs text-gray-800 outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="">General Support / No Specific Order</option>
                    {orders.map((o) => (
                      <option key={o.OrderID} value={o.OrderID}>
                        {o.OrderID} - ₹{Number(o.TotalAmount).toLocaleString('en-IN')} ({o.OrderStatus}{o.ReturnStatus ? ` • Return: ${o.ReturnStatus}` : ''})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic AI Suggested Action Chips */}
                <div className="p-2 bg-slate-100/80 border-b border-gray-200 flex items-center space-x-1.5 overflow-x-auto text-xs no-scrollbar">
                  {aiSuggestedActions.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendCustomerMessage(chip)}
                      className="bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-900 px-2.5 py-1 rounded-full text-[11px] shrink-0 font-medium shadow-xs transition cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f3f4f6]">
                  {sessionChatMessages.length > 0 ? (
                    sessionChatMessages.map((msg, idx) => {
                      const isMe = msg.sender === 'customer';
                      return (
                        <div
                          key={msg.id || idx}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center space-x-1.5 text-[10px] text-gray-500 mb-0.5">
                            <span className="font-semibold">
                              {isMe ? currentUser.Name.split(' ')[0] : 'OmniBot AI Specialist'}
                            </span>
                            <span>&bull;</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <div
                            className={`max-w-[90%] p-3.5 rounded-2xl text-xs shadow-sm leading-relaxed whitespace-pre-line ${
                              isMe
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none font-medium'
                                : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                            }`}
                          >
                            <div>{msg.text}</div>

                            {/* Render Interactive Product Recommendation Cards if present */}
                            {!isMe && msg.productCards && msg.productCards.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                                <div className="text-[11px] font-bold text-indigo-700 flex items-center space-x-1 mb-1.5">
                                  <span>✨ Recommended In-Stock Products:</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  {msg.productCards.map((card: any, cIdx: number) => {
                                    const cardInStock = Number(card.Stock) > 0;
                                    return (
                                      <div
                                        key={card.ProductID || cIdx}
                                        className="bg-slate-50 hover:bg-indigo-50/40 p-2.5 rounded-xl border border-gray-200 transition flex items-center gap-3 shadow-xs"
                                      >
                                        <img
                                          src={card.ImageUrl}
                                          alt={card.Title}
                                          className="w-14 h-14 object-contain rounded-lg bg-white p-1 border border-gray-200 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                                            {card.Category}
                                          </div>
                                          <div className="font-bold text-gray-900 text-xs truncate">
                                            {card.Title}
                                          </div>
                                          <div className="flex items-center space-x-2 mt-0.5">
                                            <span className="font-extrabold text-gray-900 text-xs">
                                              ₹{Number(card.Price).toLocaleString('en-IN')}
                                            </span>
                                            {card.Discount && (
                                              <span className="text-[10px] text-emerald-600 font-bold">
                                                {card.Discount}
                                              </span>
                                            )}
                                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                              cardInStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                            }`}>
                                              {cardInStock ? `🟢 ${card.Stock} in stock` : 'Out of stock'}
                                            </span>
                                          </div>
                                          <div className="mt-1.5 flex items-center gap-1.5">
                                            <button
                                              type="button"
                                              onClick={() => handleAddToCart(card.ProductID)}
                                              disabled={!cardInStock}
                                              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded text-[10px] transition shadow-xs disabled:opacity-40 flex items-center space-x-1 cursor-pointer"
                                            >
                                              <ShoppingCart className="w-3 h-3" />
                                              <span>Add to Cart</span>
                                            </button>
                                            <button
                                              type="button"
                                              onClick={async () => {
                                                await handleAddToCart(card.ProductID);
                                                setIsCheckoutOpen(true);
                                              }}
                                              disabled={!cardInStock}
                                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded text-[10px] transition shadow-xs disabled:opacity-40 cursor-pointer"
                                            >
                                              Buy Now
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto text-2xl shadow-md">
                        🤖
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm">Hello {currentUser.Name.split(' ')[0]}! How can OmniBot help you?</h4>
                      <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                        I can instantly cancel orders, initiate 7-day returns & replacements, check UPI/Card refunds, track live shipments, and recommend products.
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-2 text-left max-w-xs mx-auto">
                        <button
                          type="button"
                          onClick={() => handleSendCustomerMessage('Cancel my recent order')}
                          className="p-2 bg-white rounded-lg border border-gray-200 text-[11px] hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 font-medium transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                        >
                          <span>⚡</span>
                          <span>Cancel Order</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendCustomerMessage('I want to return or replace my delivered item')}
                          className="p-2 bg-white rounded-lg border border-gray-200 text-[11px] hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 font-medium transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                        >
                          <span>🔄</span>
                          <span>Return / Replace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendCustomerMessage('Check refund status for my order')}
                          className="p-2 bg-white rounded-lg border border-gray-200 text-[11px] hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 font-medium transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                        >
                          <span>💳</span>
                          <span>Refund Status</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendCustomerMessage('Where is my package? Track live shipment')}
                          className="p-2 bg-white rounded-lg border border-gray-200 text-[11px] hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 font-medium transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                        >
                          <span>🚚</span>
                          <span>Track Shipment</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AI Typing Indicator */}
                  {isAiResponding && (
                    <div className="flex items-center space-x-2 text-xs text-indigo-600 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 max-w-[80%] animate-pulse">
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                      <span className="text-[11px] font-semibold">OmniBot is processing your request...</span>
                    </div>
                  )}
                </div>

                {/* Message Input Bar with Form Event Control */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSendCustomerMessage();
                  }}
                  className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={customerChatMessage}
                    onChange={(e) => setCustomerChatMessage(e.target.value)}
                    placeholder="Ask OmniBot (e.g. Cancel order, return policy, refund status)..."
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-2.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                  <button
                    type="submit"
                    disabled={isAiResponding || !customerChatMessage.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              /* TAB: PAST SUPPORT TICKETS HISTORY */
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f3f4f6]">
                <div className="text-xs text-gray-600 mb-2">
                  <span>Showing historical CRM support tickets recorded for <strong>+91-{currentUser.Phone}</strong>:</span>
                </div>
                {supportTickets.filter(t => t.CustomerPhone === currentUser.Phone).length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs">No previous support tickets recorded.</p>
                  </div>
                ) : (
                  supportTickets
                    .filter(t => t.CustomerPhone === currentUser.Phone)
                    .map((t) => (
                      <div key={t.TicketID} className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-indigo-700">{t.TicketID}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            t.Status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.Status === 'In Progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {t.Status}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-gray-800">{t.Subject}</div>
                        {t.OrderID && (
                          <div className="text-[11px] text-gray-500">
                            Linked Order: <strong className="font-mono text-gray-700">{t.OrderID}</strong>
                          </div>
                        )}
                        <div className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                          {t.LastMessage}
                        </div>
                        <div className="text-[10px] text-gray-400 text-right">
                          {t.UpdatedAt || t.CreatedAt}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION CONTAINER */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold text-white transition-all transform duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-600'
              : toast.type === 'error'
              ? 'bg-rose-600'
              : 'bg-slate-900'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
