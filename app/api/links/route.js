import { sql } from '@/lib/database';

export async function POST(request) {
  try {
    const { url, code } = await request.json();
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate code format
    if (code && !/^[A-Za-z0-9]{1,8}$/.test(code)) {
      return new Response(
        JSON.stringify({ error: 'Code must be 1-8 characters and contain only letters and numbers' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const shortCode = code || generateRandomCode();
    
    try {
      const result = await sql`
        INSERT INTO links (code, url) 
        VALUES (${shortCode}, ${url})
        RETURNING code, url, clicks, last_clicked
      `;
      
      return new Response(JSON.stringify(result[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Code already exists' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  try {
    const links = await sql`
      SELECT code, url, clicks, last_clicked 
      FROM links 
      ORDER BY created_at DESC
    `;
    return new Response(JSON.stringify(links), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function generateRandomCode() {
  return Math.random().toString(36).substring(2, 8);
}