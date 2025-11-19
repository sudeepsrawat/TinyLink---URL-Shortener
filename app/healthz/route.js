export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      version: "1.0",
      timestamp: new Date().toISOString()
    }),
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}