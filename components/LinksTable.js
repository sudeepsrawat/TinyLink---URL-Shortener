'use client';
import { useState } from 'react';

export default function LinksTable({ links, onDelete }) {
  const [search, setSearch] = useState('');

  const filteredLinks = links.filter(link =>
    link.code.toLowerCase().includes(search.toLowerCase()) ||
    link.url.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (links.length === 0) {
    return (
      <div className="empty-state">
        <p>No links yet. Create your first short URL!</p>
      </div>
    );
  }

  return (
    <div className="links-table-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by code or URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="links-table">
          <thead>
            <tr>
              <th>Short Code</th>
              <th>Target URL</th>
              <th>Clicks</th>
              <th>Last Clicked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.map((link) => (
              <tr key={link.code}>
                <td>
                  <div className="code-cell">
                    <span className="code">{link.code}</span>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/${link.code}`)}
                      className="copy-btn"
                      title="Copy short URL"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td>
                  <div className="url-cell" title={link.url}>
                    {link.url}
                  </div>
                </td>
                <td className="clicks-cell">{link.clicks}</td>
                <td className="date-cell">
                  {link.last_clicked ? new Date(link.last_clicked).toLocaleDateString() : 'Never'}
                </td>
                <td className="actions-cell">
                  <a href={`/code/${link.code}`} className="stats-btn">Stats</a>
                  <button
                    onClick={() => onDelete(link.code)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}