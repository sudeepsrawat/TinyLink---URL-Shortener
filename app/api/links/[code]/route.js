import { sql } from '@/lib/database';

export async function GET(request, { params }) {
  try {
    const { code } = await params;
    
    console.log(`📊 [API] Fetching link: ${code}`);

    const result = await sql`
      SELECT code, url, clicks, last_clicked, created_at 
      FROM links 
      WHERE code = ${code}
    `;
    
    if (result.length === 0) {
      console.log(`❌ [API] Link not found: ${code}`);
      return new Response(
        JSON.stringify({ error: 'Link not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log(`✅ [API] Link found: ${code} with ${result[0].clicks} clicks`);
    return new Response(
      JSON.stringify(result[0]),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('❌ [API] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Your DELETE method should also be here...
export async function DELETE(request, { params }) {
  try {
    const { code } = await params;
    
    console.log(`🗑️ [API] Deleting link: ${code}`);

    const result = await sql`
      DELETE FROM links 
      WHERE code = ${code}
      RETURNING code
    `;

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Link not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ [API] Delete error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}