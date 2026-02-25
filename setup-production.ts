import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import * as schema from './server/schema.js';

const DATABASE_URL = 'postgresql://postgres:strader2026pg@caboose.proxy.rlwy.net:11702/straderagent';

async function setup() {
  console.log('🔧 Setting up production database...');
  
  const client = new pg.Client({
    connectionString: DATABASE_URL,
  });

  await client.connect();
  console.log('✅ Connected to database');

  // Drop all tables
  console.log('🗑️  Dropping existing tables...');
  await client.query(`
    DROP TABLE IF EXISTS product_components CASCADE;
    DROP TABLE IF EXISTS dashboard_stats CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS delivery_notes CASCADE;
    DROP TABLE IF EXISTS invoices CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS emails CASCADE;
    DROP TABLE IF EXISTS customers CASCADE;
    DROP TABLE IF EXISTS sales_reps CASCADE;
  `);

  // Create tables
  console.log('📦 Creating tables...');
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS sales_reps (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      email TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      assigned_oz_id INTEGER,
      segment TEXT,
      credit_terms INTEGER DEFAULT 30,
      discount DECIMAL(5,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS emails (
      id SERIAL PRIMARY KEY,
      "from" TEXT NOT NULL,
      from_company TEXT,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'new',
      ai_suggested_action TEXT,
      ai_confidence DECIMAL(5,2),
      assigned_oz_id INTEGER,
      customer_id INTEGER
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      stock_qty INTEGER DEFAULT 0,
      supplier TEXT,
      unit TEXT DEFAULT 'ks',
      description TEXT,
      is_composite BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS product_components (
      id SERIAL PRIMARY KEY,
      parent_product_id INTEGER NOT NULL,
      component_product_id INTEGER NOT NULL,
      quantity DECIMAL(10,3) NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      number VARCHAR(50) NOT NULL UNIQUE,
      customer_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      vat_amount DECIMAL(10,2) NOT NULL,
      due_date TIMESTAMP NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      revolut_payment_id TEXT,
      delivery_note_id INTEGER,
      items JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      paid_at TIMESTAMP
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS delivery_notes (
      id SERIAL PRIMARY KEY,
      number VARCHAR(50) NOT NULL UNIQUE,
      customer_id INTEGER NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'pending',
      items JSON NOT NULL,
      total_amount DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      email_id INTEGER,
      status TEXT NOT NULL DEFAULT 'new',
      total_amount DECIMAL(10,2),
      items JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      confirmed_at TIMESTAMP
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_stats (
      id SERIAL PRIMARY KEY,
      date TIMESTAMP NOT NULL,
      metric TEXT NOT NULL,
      value DECIMAL(12,2) NOT NULL
    );
  `);

  console.log('✅ Tables created successfully');
  
  await client.end();
  console.log('✅ Setup complete!');
  process.exit(0);
}

setup().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
