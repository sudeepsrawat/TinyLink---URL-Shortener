import { sql } from '@/lib/database';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple in-memory cache for deduplication
const recentRedirects = new Map();

export default async function RedirectPage({ params }) {
  try {
    const { code } = await params;
    
    console.log(`🔄 [PAGE] Processing redirect for: ${code}`);
    
    // Simple deduplication
    const now = Date.now();
    const lastRedirect = recentRedirects.get(code);
    
    if (lastRedirect && (now - lastRedirect) < 2000) {
      console.log(`🚫 [PAGE] Skipping duplicate redirect: ${code}`);
      // Still redirect, but don't count the click
      const result = await sql`SELECT url FROM links WHERE code = ${code}`;
      if (result.length > 0) {
        redirect(result[0].url);
      }
      return null;
    }
    
    recentRedirects.set(code, now);
    
    // Update clicks and get URL in one atomic operation
    const result = await sql`
      UPDATE links 
      SET clicks = clicks + 1, last_clicked = NOW() 
      WHERE code = ${code} 
      RETURNING url, clicks
    `;

    if (result.length === 0) {
      console.log(`❌ [PAGE] Link not found: ${code}`);
      return (
        <div className="error-container">
          <h1>404 - Link Not Found</h1>
          <p>The short code "{code}" does not exist.</p>
          <a href="/">Return to Dashboard</a>
        </div>
      );
    }

    console.log(`🎯 [PAGE] Redirecting to: ${result[0].url}`);
    console.log(`📊 [PAGE] Click count: ${result[0].clicks}`);
    redirect(result[0].url);
    
  } catch (error) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      console.log('🔄 [PAGE] Next.js redirect triggered');
      throw error;
    }
    
    console.error('💥 [PAGE] Redirect error:', error);
    return (
      <div className="error-container">
        <h1>500 - Server Error</h1>
        <p>Something went wrong with the redirect.</p>
        <a href="/">Return to Dashboard</a>
      </div>
    );
  }
}