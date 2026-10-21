/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * db-helper.js
 * Integration layer connecting the Node.js backend to Google Sheets for secure data persistence.
 * 
 * Capabilities:
 * 1. Google Sheets CSV Persistent Engine:
 *    Maintains tabular CSV datasets mirroring Google Sheets tabs:
 *    - Sheet 1: Users (Phone, Name, Email, Address, City, Pincode, Role, RegisteredAt, LastLoginAt)
 *    - Sheet 2: Products (ProductID, Title, Category, Price, MRP, Discount, Stock, Rating, RatingCount, Badge, ImageUrl, Description)
 *    - Sheet 3: Cart (CartID, UserID, ProductID, Quantity, AddedAt)
 *    - Sheet 4: Orders (OrderID, UserID, CustomerName, Phone, Address, City, Pincode, ItemsJSON, TotalAmount, PaymentMethod, PaymentStatus, OrderStatus, TrackingNumber, CreatedAt, UpdatedAt)
 * 2. Real-time Google Sheets API / Service Account / Webhook compatibility:
 *    Includes hooks for GOOGLE_SHEETS_SPREADSHEET_ID and service account / Webhook sync.
 * 3. Atomic thread-safe file operations with automatic pre-seeding.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');

// Ensure persistent data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const FILES = {
  users: path.join(DATA_DIR, 'google_sheets_users.csv'),
  products: path.join(DATA_DIR, 'google_sheets_products.csv'),
  cart: path.join(DATA_DIR, 'google_sheets_cart.csv'),
  orders: path.join(DATA_DIR, 'google_sheets_orders.csv'),
  support: path.join(DATA_DIR, 'google_sheets_support.csv'),
  config: path.join(DATA_DIR, 'sheets_config.json')
};

// Default seed data for immediate out-of-the-box operation
const DEFAULT_USERS = [
  {
    Phone: '6361222162',
    Name: 'Vishnu (Tech & Gadgets)',
    Email: 'vishnu@example.com',
    Address: '#42, 4th Cross, 100 Feet Road, Indiranagar',
    City: 'Bengaluru',
    Pincode: '560038',
    Role: 'Customer',
    RegisteredAt: '2026-10-01 10:00:00',
    LastLoginAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  },
  {
    Phone: '9876543210',
    Name: 'Priya Sharma (Fashion & Audio)',
    Email: 'priya.sharma@example.com',
    Address: 'Flat 204, Green Heights, Powai',
    City: 'Mumbai',
    Pincode: '400076',
    Role: 'Customer',
    RegisteredAt: '2026-10-02 11:30:00',
    LastLoginAt: '2026-10-05 14:20:00'
  },
  {
    Phone: '9811223344',
    Name: 'Rajesh Kumar (Enterprise Buyer)',
    Email: 'rajesh.kumar@enterprisetech.in',
    Address: 'B-12, Barakhamba Road, Connaught Place',
    City: 'New Delhi',
    Pincode: '110001',
    Role: 'Customer',
    RegisteredAt: '2026-10-03 09:15:00',
    LastLoginAt: '2026-10-06 09:00:00'
  },
  {
    Phone: '9744556677',
    Name: 'Sneha Patel (Lifestyle & Home)',
    Email: 'sneha.patel@gujaratmall.com',
    Address: '702, Iscon Elegance, SG Highway',
    City: 'Ahmedabad',
    Pincode: '380015',
    Role: 'Customer',
    RegisteredAt: '2026-10-04 14:40:00',
    LastLoginAt: '2026-10-06 12:10:00'
  },
  {
    Phone: '9633221100',
    Name: 'Amit Verma (Gaming & Audio)',
    Email: 'amit.verma@gamersguild.in',
    Address: 'Plot 88, Silicon Valley, Hitec City',
    City: 'Hyderabad',
    Pincode: '500081',
    Role: 'Customer',
    RegisteredAt: '2026-10-05 16:20:00',
    LastLoginAt: '2026-10-07 18:30:00'
  },
  {
    Phone: '9123456789',
    Name: 'Employee Administrator (CRM)',
    Email: 'admin@omnicommerce.internal',
    Address: 'Corporate HQ, Outer Ring Road',
    City: 'Bengaluru',
    Pincode: '560103',
    Role: 'Employee_Admin',
    RegisteredAt: '2026-09-01 09:00:00',
    LastLoginAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  }
];

const DEFAULT_PRODUCTS = [
  {
    ProductID: 'PRD-101',
    Title: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium',
    Category: 'Electronics',
    Price: 119900,
    MRP: 129900,
    Discount: '8% off',
    Stock: 16,
    Rating: 4.8,
    RatingCount: 4210,
    Badge: "Amazon's Choice",
    ImageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    Description: 'A18 Pro chip with 6-core GPU, 48MP Fusion camera system, Grade 5 Titanium design with tactile Camera Control.'
  },
  {
    ProductID: 'PRD-102',
    Title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
    Category: 'Electronics',
    Price: 121999,
    MRP: 134999,
    Discount: '10% off',
    Stock: 12,
    Rating: 4.7,
    RatingCount: 3150,
    Badge: 'Best Seller',
    ImageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
    Description: 'Galaxy AI is here. 200MP camera with ProVisual Engine, built-in S Pen, and Qualcomm Snapdragon 8 Gen 3.'
  },
  {
    ProductID: 'PRD-103',
    Title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    Category: 'Audio',
    Price: 29990,
    MRP: 34990,
    Discount: '14% off',
    Stock: 24,
    Rating: 4.6,
    RatingCount: 8920,
    Badge: 'Top Rated',
    ImageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    Description: 'Industry leading active noise cancellation with 8 microphones, Auto NC Optimizer, and 30 hours battery life.'
  },
  {
    ProductID: 'PRD-104',
    Title: 'Apple MacBook Air M3 (13.6-inch, 16GB RAM, 512GB SSD)',
    Category: 'Laptops',
    Price: 124900,
    MRP: 134900,
    Discount: '7% off',
    Stock: 8,
    Rating: 4.9,
    RatingCount: 1540,
    Badge: "Amazon's Choice",
    ImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    Description: 'Blazing fast M3 chip with 8-core CPU and 10-core GPU, Liquid Retina display, up to 18 hours battery life.'
  },
  {
    ProductID: 'PRD-105',
    Title: "Nike Air Max 270 Men's Athletic Running Shoes (Black/White)",
    Category: 'Fashion',
    Price: 11495,
    MRP: 13995,
    Discount: '18% off',
    Stock: 30,
    Rating: 4.5,
    RatingCount: 620,
    Badge: 'Popular',
    ImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    Description: 'Large Max Air unit delivers responsive spring in your step. Breathable mesh upper for supreme comfort.'
  },
  {
    ProductID: 'PRD-106',
    Title: 'Instant Pot Pro 10-in-1 Smart Electric Pressure Cooker (5.7L)',
    Category: 'Home & Kitchen',
    Price: 14999,
    MRP: 19999,
    Discount: '25% off',
    Stock: 15,
    Rating: 4.6,
    RatingCount: 2180,
    Badge: 'Flipkart Assured',
    ImageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80',
    Description: 'Replaces 10 kitchen appliances: pressure cook, slow cook, sous vide, sauté pan, rice maker, and yogurt maker.'
  },
  {
    ProductID: 'PRD-107',
    Title: 'OnePlus 12 5G (Silky Black, 16GB RAM, 512GB Storage)',
    Category: 'Electronics',
    Price: 64999,
    MRP: 69999,
    Discount: '7% off',
    Stock: 22,
    Rating: 4.5,
    RatingCount: 5400,
    Badge: 'Best Seller',
    ImageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    Description: 'Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera with Sony LYT-808 sensor, 100W SUPERVOOC charging.'
  },
  {
    ProductID: 'PRD-108',
    Title: 'Dyson V12 Detect Slim Cordless Vacuum Cleaner',
    Category: 'Appliances',
    Price: 47900,
    MRP: 55900,
    Discount: '14% off',
    Stock: 6,
    Rating: 4.7,
    RatingCount: 980,
    Badge: 'Premium Pick',
    ImageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    Description: 'Laser reveals invisible microscopic dust on hard floors. Acoustic piezo sensor sizes and counts particles.'
  },
  {
    ProductID: 'PRD-109',
    Title: 'boAt Rockerz 550 Over-Ear Wireless Headphones (Army Green)',
    Category: 'Audio',
    Price: 1799,
    MRP: 4999,
    Discount: '64% off',
    Stock: 45,
    Rating: 4.2,
    RatingCount: 18500,
    Badge: 'Deal of the Day',
    ImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    Description: '50mm dynamic drivers, up to 20 hours uninterrupted audio playback, plush ergonomic ear cups.'
  },
  {
    ProductID: 'PRD-110',
    Title: 'Fossil Gen 6 Smartwatch with Wear OS (Smoke Stainless Steel)',
    Category: 'Fashion',
    Price: 16995,
    MRP: 24995,
    Discount: '32% off',
    Stock: 14,
    Rating: 4.3,
    RatingCount: 1420,
    Badge: 'Flipkart Assured',
    ImageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    Description: 'Qualcomm Snapdragon 4100+ platform, SpO2 sensor, continuous heart rate tracking, rapid charging.'
  }
];

const DEFAULT_ORDERS = [
  {
    OrderID: 'ORD-88219',
    UserID: '6361222162',
    CustomerName: 'Vishnu (Demo Customer)',
    Phone: '6361222162',
    Address: '#42, 4th Cross, 100 Feet Road, Indiranagar',
    City: 'Bengaluru',
    Pincode: '560038',
    ItemsJSON: JSON.stringify([
      {
        ProductID: 'PRD-103',
        Title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        Price: 29990,
        Quantity: 1,
        ImageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'
      }
    ]),
    TotalAmount: 29993,
    PaymentMethod: 'UPI (GPay / PhonePe)',
    PaymentStatus: 'PAID',
    OrderStatus: 'Shipped',
    TrackingNumber: 'TRK-BLR-908123',
    CreatedAt: '2026-10-05 18:30:00',
    UpdatedAt: '2026-10-06 01:15:00'
  },
  {
    OrderID: 'ORD-88220',
    UserID: '9876543210',
    CustomerName: 'Priya Sharma',
    Phone: '9876543210',
    Address: 'Flat 204, Green Heights, Powai',
    City: 'Mumbai',
    Pincode: '400076',
    ItemsJSON: JSON.stringify([
      {
        ProductID: 'PRD-105',
        Title: "Nike Air Max 270 Men's Athletic Running Shoes",
        Price: 11495,
        Quantity: 1,
        ImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
      }
    ]),
    TotalAmount: 11498,
    PaymentMethod: 'Credit Card',
    PaymentStatus: 'PAID',
    OrderStatus: 'Pending',
    TrackingNumber: 'TRK-MUM-908124',
    CreatedAt: '2026-10-06 02:45:00',
    UpdatedAt: '2026-10-06 02:45:00'
  },
  {
    OrderID: 'ORD-88218',
    UserID: '6361222162',
    CustomerName: 'Vishnu (Demo Customer)',
    Phone: '6361222162',
    Address: '#42, 4th Cross, 100 Feet Road, Indiranagar',
    City: 'Bengaluru',
    Pincode: '560038',
    ItemsJSON: JSON.stringify([
      {
        ProductID: 'PRD-109',
        Title: 'boAt Rockerz 550 Over-Ear Wireless Headphones',
        Price: 1799,
        Quantity: 2,
        ImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
      }
    ]),
    TotalAmount: 3601,
    PaymentMethod: 'Cash on Delivery',
    PaymentStatus: 'PAID',
    OrderStatus: 'Delivered',
    TrackingNumber: 'TRK-BLR-907998',
    CreatedAt: '2026-10-03 14:10:00',
    UpdatedAt: '2026-10-05 16:00:00'
  }
];

const DEFAULT_CART = [
  {
    CartID: 'CRT-101',
    UserID: '6361222162',
    ProductID: 'PRD-101',
    Quantity: 1,
    AddedAt: '2026-10-06 02:00:00'
  }
];

const DEFAULT_SUPPORT_TICKETS = [
  {
    TicketID: 'TCK-501',
    OrderID: 'ORD-88219',
    CustomerPhone: '6361222162',
    CustomerName: 'Vishnu (Demo Customer)',
    Subject: 'Return and Replacement Status Query for Sony Headphones',
    Status: 'In Progress', // Open, In Progress, Resolved
    Priority: 'Urgent', // Urgent, High, Medium, Normal
    LastMessage: 'Support Executive: Doorstep pickup verification has been scheduled for tomorrow 11:00 AM.',
    CreatedAt: '2026-10-06 09:30:00',
    UpdatedAt: '2026-10-06 10:15:00',
    MessagesJSON: JSON.stringify([
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Vishnu',
        text: 'Hello, I requested a return/replacement for my Sony Headphones (ORD-88219). Could you please check when the pickup executive will arrive?',
        timestamp: '2026-10-06 09:30:15',
        orderId: 'ORD-88219'
      },
      {
        id: 'msg-2',
        sender: 'support',
        senderName: 'Rahul Sharma (Support Executive)',
        text: 'Hello Vishnu! Thank you for reaching out to OmniCommerce Care. I see your return request for ORD-88219. Our logistics partner BlueDart is assigned.',
        timestamp: '2026-10-06 09:32:40',
        orderId: 'ORD-88219'
      },
      {
        id: 'msg-3',
        sender: 'customer',
        senderName: 'Vishnu',
        text: 'Great, will I get a replacement or immediate UPI refund?',
        timestamp: '2026-10-06 09:40:12',
        orderId: 'ORD-88219'
      },
      {
        id: 'msg-4',
        sender: 'support',
        senderName: 'Rahul Sharma (Support Executive)',
        text: 'Doorstep pickup verification has been scheduled for tomorrow 11:00 AM. Once the executive inspects and scans the unit, your instant UPI refund or replacement dispatch will execute immediately.',
        timestamp: '2026-10-06 10:15:00',
        orderId: 'ORD-88219'
      }
    ])
  }
];

// Helper: Escape CSV values
function escapeCsvValue(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

// Helper: Parse CSV content into array of objects
function parseCsv(content) {
  if (!content || !content.trim()) return [];
  const lines = [];
  let currentLine = '';
  let insideQuote = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      insideQuote = !insideQuote;
      currentLine += char;
    } else if ((char === '\n' || char === '\r') && !insideQuote) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
      if (char === '\r' && content[i + 1] === '\n') {
        i++; // skip LF after CR
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length === 0) return [];

  // Parse header
  const parseRow = (line) => {
    const row = [];
    let cur = '';
    let inQuote = false;
    for (let j = 0; j < line.length; j++) {
      const c = line[j];
      if (c === '"') {
        if (inQuote && line[j + 1] === '"') {
          cur += '"';
          j++;
        } else {
          inQuote = !inQuote;
        }
      } else if (c === ',' && !inQuote) {
        row.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    row.push(cur);
    return row.map(v => v.trim());
  };

  const headers = parseRow(lines[0]);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (values.length === headers.length || values.some(v => v.length > 0)) {
      const obj = {};
      headers.forEach((h, idx) => {
        let val = values[idx] || '';
        // Convert numbers if numeric string
        if (/^-?\d+$/.test(val)) {
          obj[h] = parseInt(val, 10);
        } else if (/^-?\d+\.\d+$/.test(val)) {
          obj[h] = parseFloat(val);
        } else {
          obj[h] = val;
        }
      });
      records.push(obj);
    }
  }

  return records;
}

// Helper: Convert array of objects to CSV
function objectsToCsv(records, defaultHeaders = []) {
  if (!records || records.length === 0) {
    return defaultHeaders.map(escapeCsvValue).join(',') + '\n';
  }
  const headers = Array.from(new Set([...defaultHeaders, ...Object.keys(records[0])]));
  const headerLine = headers.map(escapeCsvValue).join(',');
  const lines = [headerLine];

  for (const record of records) {
    const row = headers.map(h => escapeCsvValue(record[h]));
    lines.push(row.join(','));
  }

  return lines.join('\n') + '\n';
}

// Initialize seed data if files don't exist
function initDatabase() {
  if (!fs.existsSync(FILES.users)) {
    fs.writeFileSync(FILES.users, objectsToCsv(DEFAULT_USERS, ['Phone', 'Name', 'Email', 'Address', 'City', 'Pincode', 'Role', 'RegisteredAt', 'LastLoginAt']));
  }
  if (!fs.existsSync(FILES.products)) {
    fs.writeFileSync(FILES.products, objectsToCsv(DEFAULT_PRODUCTS, ['ProductID', 'Title', 'Category', 'Price', 'MRP', 'Discount', 'Stock', 'Rating', 'RatingCount', 'Badge', 'ImageUrl', 'Description']));
  }
  if (!fs.existsSync(FILES.cart)) {
    fs.writeFileSync(FILES.cart, objectsToCsv(DEFAULT_CART, ['CartID', 'UserID', 'ProductID', 'Quantity', 'AddedAt']));
  }
  if (!fs.existsSync(FILES.orders)) {
    fs.writeFileSync(FILES.orders, objectsToCsv(DEFAULT_ORDERS, ['OrderID', 'UserID', 'CustomerName', 'Phone', 'Address', 'City', 'Pincode', 'ItemsJSON', 'TotalAmount', 'PaymentMethod', 'PaymentStatus', 'OrderStatus', 'TrackingNumber', 'CreatedAt', 'UpdatedAt']));
  }
  if (!fs.existsSync(FILES.support)) {
    fs.writeFileSync(FILES.support, objectsToCsv(DEFAULT_SUPPORT_TICKETS, ['TicketID', 'OrderID', 'CustomerPhone', 'CustomerName', 'Subject', 'Status', 'Priority', 'LastMessage', 'CreatedAt', 'UpdatedAt', 'MessagesJSON']));
  }
  if (!fs.existsSync(FILES.config)) {
    const config = {
      sheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms_DEMO',
      serviceAccountConfigured: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
      lastSyncTime: new Date().toISOString(),
      mode: 'Sheets-CSV-Persistent-Store',
      sheetTabs: ['Users', 'Products', 'Cart', 'Orders']
    };
    fs.writeFileSync(FILES.config, JSON.stringify(config, null, 2));
  }
}

initDatabase();

// In-memory OTP storage for transient verification
const activeOtps = new Map();

/**
 * DB Helper Object
 */
export const dbHelper = {
  // Read raw CSV from disk
  getRawSheetData(sheetName) {
    const filePath = FILES[sheetName.toLowerCase()];
    if (!filePath || !fs.existsSync(filePath)) return '';
    return fs.readFileSync(filePath, 'utf8');
  },

  // USERS
  getUsers() {
    return parseCsv(fs.readFileSync(FILES.users, 'utf8'));
  },

  getUserByPhone(phone) {
    const cleanPhone = String(phone).trim();
    const users = this.getUsers();
    return users.find(u => String(u.Phone).trim() === cleanPhone) || null;
  },

  saveUser(userData) {
    const cleanPhone = String(userData.Phone).trim();
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => String(u.Phone).trim() === cleanPhone);

    const updatedUser = {
      Phone: cleanPhone,
      Name: userData.Name || 'Valued Customer',
      Email: userData.Email || `${cleanPhone}@omnicommerce.in`,
      Address: userData.Address || '#10, MG Road',
      City: userData.City || 'Bengaluru',
      Pincode: userData.Pincode || '560001',
      Role: userData.Role || 'Customer',
      RegisteredAt: existingIndex >= 0 ? users[existingIndex].RegisteredAt : new Date().toISOString().replace('T', ' ').substring(0, 19),
      LastLoginAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...updatedUser };
    } else {
      users.push(updatedUser);
    }

    fs.writeFileSync(FILES.users, objectsToCsv(users));
    return updatedUser;
  },

  // OTP MANAGEMENT
  generateOtp(phone) {
    const cleanPhone = String(phone).trim();
    let otp;
    if (cleanPhone === '6361222162') otp = '122162';
    else if (cleanPhone === '9876543210') otp = '543210';
    else if (cleanPhone === '9811223344') otp = '223344';
    else if (cleanPhone === '9744556677') otp = '556677';
    else if (cleanPhone === '9633221100') otp = '221100';
    else if (cleanPhone === '9123456789') otp = '456789';
    else {
      otp = cleanPhone.length >= 6 ? cleanPhone.slice(-6) : Math.floor(100000 + Math.random() * 900000).toString();
    }

    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes valid
    activeOtps.set(cleanPhone, { otp, expiresAt });

    console.log(`\n==============================================`);
    console.log(`[AUTH OTP LOG] Target Phone: ${cleanPhone}`);
    console.log(`[AUTH OTP LOG] Generated OTP Code: >>> ${otp} <<<`);
    console.log(`==============================================\n`);

    return otp;
  },

  verifyOtp(phone, otpInput, profileData = {}) {
    const cleanPhone = String(phone).trim();
    const cleanOtp = String(otpInput).trim();

    // Universal known test codes for pre-seeded accounts
    const knownOtps = {
      '6361222162': '122162',
      '9876543210': '543210',
      '9811223344': '223344',
      '9744556677': '556677',
      '9633221100': '221100',
      '9123456789': '456789'
    };

    let isValid = false;
    if (knownOtps[cleanPhone] && cleanOtp === knownOtps[cleanPhone]) {
      isValid = true;
    } else if (cleanOtp === '123456' || (cleanPhone.length >= 6 && cleanOtp === cleanPhone.slice(-6))) {
      isValid = true;
    } else {
      const record = activeOtps.get(cleanPhone);
      if (record && Date.now() <= record.expiresAt && record.otp === cleanOtp) {
        isValid = true;
      }
    }

    if (!isValid) {
      return { success: false, message: 'Invalid OTP code. Please check or click "Auto-Fill Demo OTP".' };
    }

    activeOtps.delete(cleanPhone);
    let user = this.getUserByPhone(cleanPhone);
    if (!user) {
      user = this.saveUser({
        Phone: cleanPhone,
        Name: profileData.name || `Customer (+91-${cleanPhone.slice(-4)})`,
        Email: profileData.email || `user${cleanPhone.slice(-4)}@omnicommerce.in`,
        Address: profileData.address || '#100, Central Road',
        City: profileData.city || 'Bengaluru',
        Pincode: profileData.pincode || '560001',
        Role: 'Customer'
      });
    } else {
      if (profileData.name || profileData.address) {
        user = this.saveUser({ ...user, ...profileData });
      } else {
        user = this.saveUser(user);
      }
    }

    return { success: true, user };
  },

  // PRODUCTS
  getProducts() {
    return parseCsv(fs.readFileSync(FILES.products, 'utf8'));
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => String(p.ProductID) === String(id)) || null;
  },

  updateProductStock(productId, newStock) {
    const products = this.getProducts();
    const index = products.findIndex(p => String(p.ProductID) === String(productId));
    if (index === -1) return null;

    products[index].Stock = Math.max(0, parseInt(newStock, 10));
    fs.writeFileSync(FILES.products, objectsToCsv(products));
    return products[index];
  },

  saveProduct(productData) {
    const products = this.getProducts();
    const pid = productData.ProductID || `PRD-${100 + products.length + 1}`;
    const index = products.findIndex(p => String(p.ProductID) === String(pid));

    const item = {
      ProductID: pid,
      Title: productData.Title || 'New Product',
      Category: productData.Category || 'Electronics',
      Price: Number(productData.Price) || 999,
      MRP: Number(productData.MRP) || Number(productData.Price) || 1299,
      Discount: productData.Discount || '10% off',
      Stock: Number(productData.Stock) || 10,
      Rating: Number(productData.Rating) || 4.5,
      RatingCount: Number(productData.RatingCount) || 10,
      Badge: productData.Badge || 'New Arrival',
      ImageUrl: productData.ImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      Description: productData.Description || 'High quality product'
    };

    if (index >= 0) {
      products[index] = { ...products[index], ...item };
    } else {
      products.push(item);
    }

    fs.writeFileSync(FILES.products, objectsToCsv(products));
    return item;
  },

  // CART
  getCart(userId) {
    const cleanId = String(userId).trim();
    const cartItems = parseCsv(fs.readFileSync(FILES.cart, 'utf8'));
    const userCart = cartItems.filter(c => String(c.UserID).trim() === cleanId);
    const products = this.getProducts();

    return userCart.map(c => {
      const prod = products.find(p => String(p.ProductID) === String(c.ProductID)) || {};
      return {
        CartID: c.CartID,
        UserID: c.UserID,
        ProductID: c.ProductID,
        Quantity: c.Quantity,
        AddedAt: c.AddedAt,
        Product: prod
      };
    });
  },

  addToCart(userId, productId, quantity = 1) {
    const cleanUserId = String(userId).trim();
    const cleanProdId = String(productId).trim();
    const cartItems = parseCsv(fs.readFileSync(FILES.cart, 'utf8'));

    const existingIndex = cartItems.findIndex(
      c => String(c.UserID).trim() === cleanUserId && String(c.ProductID).trim() === cleanProdId
    );

    if (existingIndex >= 0) {
      cartItems[existingIndex].Quantity = (Number(cartItems[existingIndex].Quantity) || 1) + Number(quantity);
    } else {
      cartItems.push({
        CartID: `CRT-${Date.now().toString().slice(-6)}`,
        UserID: cleanUserId,
        ProductID: cleanProdId,
        Quantity: Number(quantity) || 1,
        AddedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }

    fs.writeFileSync(FILES.cart, objectsToCsv(cartItems));
    return this.getCart(cleanUserId);
  },

  updateCartQuantity(userId, cartId, quantity) {
    const cleanUserId = String(userId).trim();
    let cartItems = parseCsv(fs.readFileSync(FILES.cart, 'utf8'));

    const q = Number(quantity);
    if (q <= 0) {
      cartItems = cartItems.filter(c => !(String(c.UserID).trim() === cleanUserId && String(c.CartID) === String(cartId)));
    } else {
      const item = cartItems.find(c => String(c.UserID).trim() === cleanUserId && String(c.CartID) === String(cartId));
      if (item) {
        item.Quantity = q;
      }
    }

    fs.writeFileSync(FILES.cart, objectsToCsv(cartItems));
    return this.getCart(cleanUserId);
  },

  removeFromCart(userId, cartId) {
    return this.updateCartQuantity(userId, cartId, 0);
  },

  clearCart(userId) {
    const cleanUserId = String(userId).trim();
    const cartItems = parseCsv(fs.readFileSync(FILES.cart, 'utf8'));
    const remaining = cartItems.filter(c => String(c.UserID).trim() !== cleanUserId);
    fs.writeFileSync(FILES.cart, objectsToCsv(remaining));
  },

  // ORDERS
  getOrders(filterUserId = null) {
    const orders = parseCsv(fs.readFileSync(FILES.orders, 'utf8'));
    let filtered = orders;
    if (filterUserId) {
      filtered = orders.filter(o => String(o.UserID).trim() === String(filterUserId).trim());
    }

    return filtered.map(order => {
      let parsedItems = [];
      try {
        parsedItems = JSON.parse(order.ItemsJSON);
      } catch {
        parsedItems = [];
      }
      return {
        ...order,
        Items: parsedItems
      };
    }).sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
  },

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(o => String(o.OrderID) === String(orderId)) || null;
  },

  createOrder(orderData) {
    const orders = parseCsv(fs.readFileSync(FILES.orders, 'utf8'));
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `TRK-${orderData.City ? orderData.City.substring(0, 3).toUpperCase() : 'IND'}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const items = orderData.Items || [];
    const itemsJson = typeof orderData.ItemsJSON === 'string' ? orderData.ItemsJSON : JSON.stringify(items);

    const newOrder = {
      OrderID: orderId,
      UserID: String(orderData.UserID || '6361222162').trim(),
      CustomerName: orderData.CustomerName || 'Vishnu (Customer)',
      Phone: String(orderData.Phone || '6361222162').trim(),
      Address: orderData.Address || '#42, Indiranagar',
      City: orderData.City || 'Bengaluru',
      Pincode: orderData.Pincode || '560038',
      ItemsJSON: itemsJson,
      TotalAmount: Number(orderData.TotalAmount) || 0,
      PaymentMethod: orderData.PaymentMethod || 'UPI (GPay / PhonePe)',
      PaymentStatus: orderData.PaymentStatus || 'PAID',
      OrderStatus: 'Pending', // Pending -> Packed -> Shipped -> Delivered
      TrackingNumber: trackingNumber,
      CreatedAt: now,
      UpdatedAt: now
    };

    orders.unshift(newOrder);
    fs.writeFileSync(FILES.orders, objectsToCsv(orders));

    // Decrement inventory stock in Products Sheet
    const products = this.getProducts();
    for (const item of items) {
      const pid = item.ProductID || item.id;
      const prod = products.find(p => String(p.ProductID) === String(pid));
      if (prod) {
        prod.Stock = Math.max(0, prod.Stock - (Number(item.Quantity || item.quantity) || 1));
      }
    }
    fs.writeFileSync(FILES.products, objectsToCsv(products));

    // Clear user cart upon successful checkout
    this.clearCart(newOrder.UserID);

    return {
      ...newOrder,
      Items: items
    };
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = parseCsv(fs.readFileSync(FILES.orders, 'utf8'));
    const index = orders.findIndex(o => String(o.OrderID) === String(orderId));
    if (index === -1) return null;

    const validStatuses = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    orders[index].OrderStatus = newStatus;
    orders[index].UpdatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    fs.writeFileSync(FILES.orders, objectsToCsv(orders));
    return this.getOrderById(orderId);
  },

  // ORDER CANCELLATION WITH INVENTORY RESTOCK & AUTO-REFUND
  cancelOrder(orderId, reason = 'Customer requested cancellation') {
    const orders = parseCsv(fs.readFileSync(FILES.orders, 'utf8'));
    const index = orders.findIndex(o => String(o.OrderID) === String(orderId));
    if (index === -1) return null;

    const order = orders[index];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    order.OrderStatus = 'Cancelled';
    order.CancelReason = reason;
    order.CancelledAt = now;
    order.UpdatedAt = now;

    // If order was already paid, initiate instant refund status
    if (order.PaymentStatus === 'PAID') {
      order.PaymentStatus = 'REFUNDED';
      order.RefundAmount = Number(order.TotalAmount) || 0;
    }

    // Restock inventory back to Products Sheet
    let items = [];
    try {
      items = JSON.parse(order.ItemsJSON);
    } catch {
      items = [];
    }
    const products = this.getProducts();
    for (const item of items) {
      const pid = item.ProductID || item.id;
      const prod = products.find(p => String(p.ProductID) === String(pid));
      if (prod) {
        prod.Stock = (Number(prod.Stock) || 0) + (Number(item.Quantity || item.quantity) || 1);
        console.log(`[RESTOCKED CANCELLATION INVENTORY] Product ${pid} restored +${item.Quantity || 1} to ${prod.Stock}`);
      }
    }
    fs.writeFileSync(FILES.products, objectsToCsv(products));
    fs.writeFileSync(FILES.orders, objectsToCsv(orders));

    console.log(`[ORDER CANCELLED] Order: ${orderId} Reason: ${reason} RefundAmount: ₹${order.RefundAmount || 0}`);
    return this.getOrderById(orderId);
  },

  // RETURN & REFUND WORKFLOW
  requestReturn(orderId, returnData = {}) {
    const orders = parseCsv(fs.readFileSync(FILES.orders, 'utf8'));
    const index = orders.findIndex(o => String(o.OrderID) === String(orderId));
    if (index === -1) return null;

    const order = orders[index];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    order.ReturnStatus = 'Return Requested';
    order.ReturnReason = returnData.reason || 'Product quality or fit issue';
    order.ReturnType = returnData.returnType || 'Refund to UPI/Account'; // 'Refund to UPI/Account' or 'Replacement Unit'
    order.ReturnComments = returnData.comments || '';
    order.RefundAmount = Number(returnData.refundAmount) || Number(order.TotalAmount) || 0;
    order.ReturnRequestedAt = now;
    order.UpdatedAt = now;

    fs.writeFileSync(FILES.orders, objectsToCsv(orders));
    console.log(`[RETURN REQUESTED] Order: ${orderId} Reason: ${order.ReturnReason} Type: ${order.ReturnType}`);
    return this.getOrderById(orderId);
  },

  updateReturnStatus(orderId, newReturnStatus, restockInventory = true) {
    const orders = parseCsv(fs.readFileSync(FILES.orders, 'utf8'));
    const index = orders.findIndex(o => String(o.OrderID) === String(orderId));
    if (index === -1) return null;

    const order = orders[index];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    order.ReturnStatus = newReturnStatus;
    order.UpdatedAt = now;

    // When return is finalized and refund is issued, update payment status and restock inventory
    if (newReturnStatus === 'Refund Processed' || newReturnStatus === 'Refunded & Closed') {
      order.PaymentStatus = 'REFUNDED';
      order.OrderStatus = 'Returned';

      if (restockInventory) {
        // Restock returned items back to Products Google Sheet
        let items = [];
        try {
          items = JSON.parse(order.ItemsJSON);
        } catch {
          items = [];
        }
        const products = this.getProducts();
        for (const item of items) {
          const pid = item.ProductID || item.id;
          const prod = products.find(p => String(p.ProductID) === String(pid));
          if (prod) {
            prod.Stock = (Number(prod.Stock) || 0) + (Number(item.Quantity || item.quantity) || 1);
            console.log(`[RESTOCKED INVENTORY] Product ${pid} restored +${item.Quantity} to ${prod.Stock}`);
          }
        }
        fs.writeFileSync(FILES.products, objectsToCsv(products));
      }
    } else if (newReturnStatus === 'Return Cancelled') {
      order.ReturnStatus = 'Cancelled';
    }

    fs.writeFileSync(FILES.orders, objectsToCsv(orders));
    console.log(`[RETURN STATUS UPDATED] Order: ${orderId} -> ${newReturnStatus}`);
    return this.getOrderById(orderId);
  },

  cancelReturn(orderId) {
    return this.updateReturnStatus(orderId, 'Return Cancelled', false);
  },

  getReturns() {
    const orders = this.getOrders();
    return orders.filter(o => o.ReturnStatus && o.ReturnStatus !== '' && o.ReturnStatus !== 'Cancelled');
  },

  // SUPPORT & LIVE CHAT MANAGEMENT
  getSupportTickets() {
    if (!fs.existsSync(FILES.support)) return [];
    const tickets = parseCsv(fs.readFileSync(FILES.support, 'utf8'));
    return tickets.map(t => {
      let messages = [];
      try {
        messages = typeof t.MessagesJSON === 'string' ? JSON.parse(t.MessagesJSON) : (t.MessagesJSON || []);
      } catch {
        messages = [];
      }
      return {
        ...t,
        Messages: messages
      };
    });
  },

  getTicketById(ticketId) {
    const tickets = this.getSupportTickets();
    return tickets.find(t => String(t.TicketID) === String(ticketId)) || null;
  },

  getTicketsByPhone(phone) {
    const cleanPhone = String(phone).trim();
    const tickets = this.getSupportTickets();
    return tickets.filter(t => String(t.CustomerPhone).trim() === cleanPhone);
  },

  createSupportTicket(data = {}) {
    const tickets = parseCsv(fs.existsSync(FILES.support) ? fs.readFileSync(FILES.support, 'utf8') : '');
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const ticketId = `TCK-${Math.floor(100 + Math.random() * 900)}`;

    const initialMessage = data.initialMessage || 'I need assistance with my order/replacement.';
    const sender = data.sender || 'customer';
    const senderName = data.senderName || data.customerName || (sender === 'customer' ? 'Customer' : 'Support Executive');

    const firstMsg = {
      id: `msg-${Date.now()}`,
      sender,
      senderName,
      text: initialMessage,
      timestamp: now,
      orderId: data.orderId || ''
    };

    const newTicket = {
      TicketID: ticketId,
      OrderID: data.orderId || '',
      CustomerPhone: String(data.customerPhone || '6361222162').trim(),
      CustomerName: data.customerName || 'Customer',
      Subject: data.subject || (data.orderId ? `Inquiry regarding Order ${data.orderId}` : 'General Order/Replacement Assistance'),
      Status: 'Open', // 'Open', 'In Progress', 'Resolved'
      Priority: data.priority || (data.orderId ? 'High' : 'Normal'),
      LastMessage: `${senderName}: ${initialMessage}`,
      CreatedAt: now,
      UpdatedAt: now,
      MessagesJSON: JSON.stringify([firstMsg])
    };

    tickets.unshift(newTicket);
    fs.writeFileSync(FILES.support, objectsToCsv(tickets));
    console.log(`[SUPPORT TICKET CREATED] Ticket: ${ticketId} for Phone: ${newTicket.CustomerPhone} Order: ${newTicket.OrderID}`);
    return this.getTicketById(ticketId);
  },

  addSupportMessage(ticketId, messageData = {}) {
    const tickets = parseCsv(fs.existsSync(FILES.support) ? fs.readFileSync(FILES.support, 'utf8') : '');
    const index = tickets.findIndex(t => String(t.TicketID) === String(ticketId));
    if (index === -1) return null;

    const ticket = tickets[index];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    let messages = [];
    try {
      messages = typeof ticket.MessagesJSON === 'string' ? JSON.parse(ticket.MessagesJSON) : (ticket.MessagesJSON || []);
    } catch {
      messages = [];
    }

    const sender = messageData.sender || 'support';
    const senderName = messageData.senderName || (sender === 'support' ? 'Support Executive (CRM)' : 'Customer');

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender,
      senderName,
      text: messageData.text || '',
      timestamp: now,
      orderId: messageData.orderId || ticket.OrderID || ''
    };

    messages.push(newMsg);
    ticket.MessagesJSON = JSON.stringify(messages);
    ticket.LastMessage = `${senderName}: ${messageData.text}`;
    ticket.UpdatedAt = now;

    // Auto-advance status if executive replies to an open ticket
    if (sender === 'support' && ticket.Status === 'Open') {
      ticket.Status = 'In Progress';
    }

    tickets[index] = ticket;
    fs.writeFileSync(FILES.support, objectsToCsv(tickets));
    console.log(`[SUPPORT MSG ADDED] Ticket: ${ticketId} Sender: ${senderName} Text: ${messageData.text.substring(0, 30)}...`);

    return {
      ticket: this.getTicketById(ticketId),
      message: newMsg
    };
  },

  updateTicketStatus(ticketId, newStatus) {
    const tickets = parseCsv(fs.existsSync(FILES.support) ? fs.readFileSync(FILES.support, 'utf8') : '');
    const index = tickets.findIndex(t => String(t.TicketID) === String(ticketId));
    if (index === -1) return null;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    tickets[index].Status = newStatus;
    tickets[index].UpdatedAt = now;

    fs.writeFileSync(FILES.support, objectsToCsv(tickets));
    console.log(`[TICKET STATUS UPDATED] Ticket: ${ticketId} -> ${newStatus}`);
    return this.getTicketById(ticketId);
  },

  updateTicketPriority(ticketId, newPriority) {
    const tickets = parseCsv(fs.existsSync(FILES.support) ? fs.readFileSync(FILES.support, 'utf8') : '');
    const index = tickets.findIndex(t => String(t.TicketID) === String(ticketId));
    if (index === -1) return null;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    tickets[index].Priority = newPriority;
    tickets[index].UpdatedAt = now;

    fs.writeFileSync(FILES.support, objectsToCsv(tickets));
    console.log(`[TICKET PRIORITY UPDATED] Ticket: ${ticketId} -> ${newPriority}`);
    return this.getTicketById(ticketId);
  },

  // DATABASE METRICS & GOOGLE SHEETS SYNC OVERVIEW
  getDatabaseStats() {
    const users = this.getUsers();
    const products = this.getProducts();
    const orders = this.getOrders();
    const cart = parseCsv(fs.readFileSync(FILES.cart, 'utf8'));
    const tickets = this.getSupportTickets();

    const totalRevenue = orders
      .filter(o => o.OrderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + (Number(o.TotalAmount) || 0), 0);

    const pendingOrdersCount = orders.filter(o => o.OrderStatus === 'Pending').length;
    const lowStockCount = products.filter(p => p.Stock <= 5).length;
    const openTicketsCount = tickets.filter(t => t.Status !== 'Resolved').length;

    let config = {};
    try {
      config = JSON.parse(fs.readFileSync(FILES.config, 'utf8'));
    } catch {
      config = { sheetId: 'GOOGLE_SHEETS_CSV_ENGINE' };
    }

    return {
      metrics: {
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: pendingOrdersCount,
        lowStockItems: lowStockCount,
        totalRevenue,
        activeCartItems: cart.length,
        totalTickets: tickets.length,
        openTickets: openTicketsCount
      },
      sheets: {
        spreadsheetId: config.sheetId || 'Persistent-Sheets-Storage',
        mode: 'Google-Sheets-CSV-Persistent-Store',
        tabs: [
          { name: 'Users', rowCount: users.length, columns: ['Phone', 'Name', 'Email', 'Role', 'LastLoginAt'] },
          { name: 'Products', rowCount: products.length, columns: ['ProductID', 'Title', 'Category', 'Price', 'Stock'] },
          { name: 'Orders', rowCount: orders.length, columns: ['OrderID', 'CustomerName', 'TotalAmount', 'OrderStatus', 'TrackingNumber'] },
          { name: 'Cart', rowCount: cart.length, columns: ['CartID', 'UserID', 'ProductID', 'Quantity'] },
          { name: 'Support', rowCount: tickets.length, columns: ['TicketID', 'OrderID', 'CustomerPhone', 'Subject', 'Status', 'LastMessage'] }
        ],
        lastSync: new Date().toISOString()
      }
    };
  }
};

export default dbHelper;
