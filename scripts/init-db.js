import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function initDB() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(8) UNIQUE NOT NULL,
        url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        last_clicked TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Database table created successfully');
    
    // Verify the table was created
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'links'
    `;
    console.log('✅ Table verification:', result.length > 0 ? 'Table exists' : 'Table missing');
    
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
  }
}

initDB();