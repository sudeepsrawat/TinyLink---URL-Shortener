'use client';
import { useState } from 'react';

export default function LinkForm({ onLinkCreated }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, code: code || undefined }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Link created successfully! Short URL: ${window.location.origin}/${data.code}`);
        setUrl('');
        setCode('');
        onLinkCreated();
      } else {
        setError(data.error || 'Failed to create link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="link-form">
      <div className="form-group">
        <label htmlFor="url">Long URL *</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very-long-url"
          required
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="code">Custom Code (optional)</label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="my-custom-code"
          pattern="[A-Za-z0-9]{1,8}"
          title="1-8 letters or numbers"
          disabled={loading}
        />
        <small>1-8 characters, letters and numbers only</small>
      </div>

      <button type="submit" disabled={loading || !url}>
        {loading ? 'Creating...' : 'Shorten URL'}
      </button>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </form>
  );
}