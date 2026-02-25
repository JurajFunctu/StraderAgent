import { db } from './db.js';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export async function initializeDatabase() {
  try {
    console.log('🔍 Checking database state...');
    
    // Check if tables exist by trying to query one
    try {
      await db.execute(sql`SELECT 1 FROM customers LIMIT 1`);
      console.log('✅ Database tables already exist');
      
      // Check if we have data
      const countResult = await db.execute(sql`SELECT COUNT(*) as count FROM customers`);
      const customerCount = (countResult.rows[0] as any).count;
      
      if (parseInt(customerCount) === 0) {
        console.log('⚠️  Tables exist but no data found. Seeding now...');
        await seedDatabase();
      } else {
        console.log(`✅ Database has ${customerCount} customers`);
      }
      
      return true;
    } catch (tableError: any) {
      console.log('⚠️  Tables do not exist. Creating schema...');
      console.log('Error was:', tableError.message);
      
      // Create tables using raw SQL since drizzle-kit commands don't work in production
      await createSchema();
      await seedDatabase();
      
      console.log('✅ Database initialization complete!');
      return true;
    }
  } catch (error: any) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Stack:', error.stack);
    // Don't throw - allow server to start even if DB init fails
    return false;
  }
}

async function createSchema() {
  console.log('📊 Creating database schema...');
  
  // Create all tables using raw SQL
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sales_reps (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      email TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  
  await db.execute(sql`
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
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS emails (
      id SERIAL PRIMARY KEY,
      "from" TEXT NOT NULL,
      from_company TEXT,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      received_at TIMESTAMP DEFAULT NOW(),
      status TEXT NOT NULL DEFAULT 'new',
      ai_suggested_action TEXT,
      ai_confidence DECIMAL(5,2),
      assigned_oz_id INTEGER,
      customer_id INTEGER
    );
  `);
  
  await db.execute(sql`
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
      is_composite BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS product_components (
      id SERIAL PRIMARY KEY,
      parent_product_id INTEGER NOT NULL,
      component_product_id INTEGER NOT NULL,
      quantity DECIMAL(10,3) NOT NULL
    );
  `);
  
  await db.execute(sql`
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
      created_at TIMESTAMP DEFAULT NOW(),
      paid_at TIMESTAMP
    );
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS delivery_notes (
      id SERIAL PRIMARY KEY,
      number VARCHAR(50) NOT NULL UNIQUE,
      customer_id INTEGER NOT NULL,
      date TIMESTAMP DEFAULT NOW(),
      status TEXT NOT NULL DEFAULT 'pending',
      items JSON NOT NULL,
      total_amount DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      email_id INTEGER,
      status TEXT NOT NULL DEFAULT 'new',
      total_amount DECIMAL(10,2),
      items JSON NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      confirmed_at TIMESTAMP
    );
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS dashboard_stats (
      id SERIAL PRIMARY KEY,
      date TIMESTAMP NOT NULL,
      metric TEXT NOT NULL,
      value DECIMAL(12,2) NOT NULL
    );
  `);
  
  console.log('✅ Schema created');
}

async function seedDatabase() {
  console.log('🌱 Seeding database...');
  
  // Import and run the seed - but we need to make it work without the db.delete calls
  try {
    // For now, just insert a few test records to verify it works
    await db.execute(sql`
      INSERT INTO sales_reps (name, location, email) VALUES
      ('Ján Novák', 'Košice', 'jan.novak@strader.sk'),
      ('Peter Horváth', 'Prešov', 'peter.horvath@strader.sk'),
      ('Mária Kováčová', 'Stropkov', 'maria.kovacova@strader.sk')
      ON CONFLICT DO NOTHING;
    `);
    
    await db.execute(sql`
      INSERT INTO customers (name, company, email, phone, assigned_oz_id, segment) VALUES
      ('Jozef Halász', 'HagardHal s.r.o.', 'objednavky@hagardhal.sk', '+421 905 123 456', 1, 'VIP'),
      ('Marián Kovács', 'Elektro Centrum Košice', 'info@elektrocentrum.sk', '+421 915 234 567', 2, 'Stredný')
      ON CONFLICT DO NOTHING;
    `);
    
    await db.execute(sql`
      INSERT INTO products (code, name, category, price, stock_qty, supplier, unit) VALUES
      ('KNS-100-60', 'Žľab káblový perforovaný 100x60mm', 'Káblové nosné systémy', 12.50, 450, 'BAKS', 'ks'),
      ('KNS-200-60', 'Žľab káblový perforovaný 200x60mm', 'Káblové nosné systémy', 18.90, 320, 'BAKS', 'ks'),
      ('ROZ-600-600', 'Rozvádzačová skriňa 600x600x200', 'Rozvádzačové skrine', 185.00, 22, 'BAKS', 'ks')
      ON CONFLICT (code) DO NOTHING;
    `);
    
    await db.execute(sql`
      INSERT INTO emails ("from", from_company, subject, body, status, ai_suggested_action, ai_confidence, assigned_oz_id, customer_id)
      VALUES 
      ('objednavky@hagardhal.sk', 'HagardHal s.r.o.', 'Objednávka materiálu', 'Potrebujeme 50ks žľab 100x60mm', 'new', 'create-order', 95.50, 1, 1)
      ON CONFLICT DO NOTHING;
    `);
    
    console.log('✅ Database seeded with sample data');
  } catch (error: any) {
    console.error('❌ Seed failed:', error.message);
    throw error;
  }
}
