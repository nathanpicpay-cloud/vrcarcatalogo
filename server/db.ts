import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Move up one dir from /server
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  }
});

export function initDb() {
  db.serialize(() => {
    // Users
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Categories
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      description TEXT,
      image TEXT,
      active INTEGER DEFAULT 1
    )`);

    // Products
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE,
      name TEXT,
      description TEXT,
      price REAL,
      cost REAL,
      stock INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 0,
      category_id INTEGER,
      brand TEXT,
      application TEXT,
      image TEXT,
      active INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(category_id) REFERENCES categories(id)
    )`);
    
    // Product Gallery
    db.run(`CREATE TABLE IF NOT EXISTS product_gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      image TEXT,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`);

    // Machines
    db.run(`CREATE TABLE IF NOT EXISTS machines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      specifications TEXT,
      features TEXT,
      image TEXT,
      active INTEGER DEFAULT 1
    )`);

    // CRM / Customers
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      document TEXT,
      address TEXT,
      type TEXT, -- retail, wholesale
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Budgets
    db.run(`CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      status TEXT, -- draft, sent, approved, rejected
      total REAL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    )`);

    // Budget Items
    db.run(`CREATE TABLE IF NOT EXISTS budget_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      budget_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      price REAL,
      FOREIGN KEY(budget_id) REFERENCES budgets(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`);

    // Inventory Logs (Entrada, Saida, Ajuste)
    db.run(`CREATE TABLE IF NOT EXISTS inventory_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      type TEXT, -- in, out, adjust
      quantity INTEGER,
      reason TEXT,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Insert Default admin user (username: adminadmin | password: vrcar)
    db.get("SELECT id FROM users WHERE username = 'adminadmin'", (err, row) => {
      if (!row) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('vrcar', salt);
        db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['adminadmin', hash, 'admin']);
      }
    });
  });
}

// Wrapper for easy promise-based queries
export function dbQuery(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function dbGet(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

export function dbRun(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export default db;
