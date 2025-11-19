import { sql } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getLinkStats(code) {
  try {
    const result = await sql`
      SELECT code, url, clicks, last_clicked, created_at 
      FROM links 
      WHERE code = ${code}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('❌ [STATS] Error fetching stats:', error);
    return null;
  }
}

export default async function StatsPage({ params }) {
  const { code } = await params;
  const link = await getLinkStats(code);

  if (!link) {
    return (
      <div className="error-container">
        <h1>Link Not Found</h1>
        <p>The requested link does not exist.</p>
        <a href="/">Return to Dashboard</a>
      </div>
    );
  }

  console.log(`📊 [STATS] Showing stats for ${code}: ${link.clicks} clicks`);

  return (
    <div className="stats-page">
      <h1>Stats for {link.code}</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Target URL</h3>
          <p className="url">{link.url}</p>
        </div>
        <div className="stat-card">
          <h3>Total Clicks</h3>
          <p className="clicks">{link.clicks}</p>
        </div>
        <div className="stat-card">
          <h3>Last Clicked</h3>
          <p>{link.last_clicked ? new Date(link.last_clicked).toLocaleString() : 'Never'}</p>
        </div>
        <div className="stat-card">
          <h3>Created</h3>
          <p>{new Date(link.created_at).toLocaleString()}</p>
        </div>
      </div>
      <a href="/" className="back-link">← Back to Dashboard</a>
    </div>
  );
}