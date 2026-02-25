import { db } from './db.js';
import { sql } from 'drizzle-orm';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function initializeDatabase() {
  try {
    console.log('🔍 Checking database state...');
    
    // Check if tables exist by trying to query one
    try {
      const result = await db.execute(sql`SELECT 1 FROM customers LIMIT 1`);
      console.log('✅ Database tables already exist');
      
      // Check if we have data
      const count = await db.execute(sql`SELECT COUNT(*) as count FROM customers`);
      const customerCount = (count.rows[0] as any).count;
      
      if (parseInt(customerCount) === 0) {
        console.log('⚠️  Tables exist but no data found. Running seed...');
        await runSeed();
      } else {
        console.log(`✅ Database has ${customerCount} customers`);
      }
      
      return true;
    } catch (tableError) {
      console.log('⚠️  Tables do not exist. Initializing database...');
      
      // Run db:push to create tables
      console.log('📊 Pushing schema to database...');
      const { stdout: pushOutput } = await execAsync('npm run db:push');
      console.log('Push completed:', pushOutput.substring(0, 200));
      
      // Run seed
      await runSeed();
      
      console.log('✅ Database initialization complete!');
      return true;
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Don't throw - allow server to start even if DB init fails
    return false;
  }
}

async function runSeed() {
  console.log('🌱 Seeding database...');
  const { stdout: seedOutput } = await execAsync('npm run db:seed');
  console.log('Seed completed:', seedOutput.substring(0, 200));
}
