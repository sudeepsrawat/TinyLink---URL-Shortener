import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT version()`;
    console.log('✅ Database connection successful');
    console.log('PostgreSQL version:', result[0].version);
    
    // Test links table access
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Available tables:', tables.map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();