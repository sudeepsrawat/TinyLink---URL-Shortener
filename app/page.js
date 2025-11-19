'use client';
import { useState, useEffect } from 'react';
import LinkForm from '@/components/LinkForm';
import LinksTable from '@/components/LinksTable';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (err) {
      setError('Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (code) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setLinks(links.filter(link => link.code !== code));
      } else {
        setError('Failed to delete link');
      }
    } catch (err) {
      setError('Failed to delete link');
    }
  };

  return (
    <div className="dashboard">
      <h1>URL Shortener</h1>
      
      <LinkForm onLinkCreated={fetchLinks} />
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading links...</div>
      ) : (
        <LinksTable links={links} onDelete={handleDelete} />
      )}
    </div>
  );
}