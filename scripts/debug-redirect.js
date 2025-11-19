import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function debugRedirect() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('🔍 Testing redirect for code: test');
    
    // Check if link exists
    const link = await sql`SELECT * FROM links WHERE code = 'test'`;
    console.log('📊 Link found:', link.length > 0);
    
    if (link.length > 0) {
      console.log('Link details:', link[0]);
    }
    
    // Test the update query
    console.log('🔄 Testing update query...');
    const result = await sql`
      UPDATE links 
      SET clicks = clicks + 1, last_clicked = NOW() 
      WHERE code = 'test' 
      RETURNING url
    `;
    console.log('✅ Update successful:', result[0]);
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  }
}

debugRedirect();