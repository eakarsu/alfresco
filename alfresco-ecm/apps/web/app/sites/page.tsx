'use client';

import { useState } from 'react';

interface Site {
  id: string;
  name: string;
  description: string;
  members: number;
  lastActivity: string;
  type: 'public' | 'private';
}

export default function SitesPage() {
  const [sites] = useState<Site[]>([
    { id: '1', name: 'Marketing Team', description: 'Marketing campaigns and materials', members: 12, lastActivity: '2 hours ago', type: 'public' },
    { id: '2', name: 'Engineering Hub', description: 'Technical documentation and code reviews', members: 25, lastActivity: '5 minutes ago', type: 'private' },
    { id: '3', name: 'HR Portal', description: 'Employee resources and policies', members: 8, lastActivity: '1 day ago', type: 'private' },
    { id: '4', name: 'Sales Collaboration', description: 'Sales materials and client documents', members: 15, lastActivity: '3 hours ago', type: 'public' },
  ]);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC' }}>Collaboration Sites</h1>
          <nav style={{ marginTop: '0.5rem' }}>
            <a href="/" style={{ color: '#0052CC', textDecoration: 'none' }}>← Back to Dashboard</a>
          </nav>
        </div>
        <button 
          onClick={() => {
            const siteName = prompt('Enter site name:');
            if (siteName) alert(`Creating site: ${siteName}`);
          }}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + Create Site
        </button>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Search sites..." 
          style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {sites.map(site => (
          <div key={site.id} style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#333' }}>{site.name}</h3>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                backgroundColor: site.type === 'public' ? '#36B37E20' : '#6554C020',
                color: site.type === 'public' ? '#36B37E' : '#6554C0',
                borderRadius: '12px',
                fontSize: '0.85rem'
              }}>
                {site.type === 'public' ? '🌐 Public' : '🔒 Private'}
              </span>
            </div>
            
            <p style={{ color: '#666', marginBottom: '1rem' }}>{site.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <span>👥 {site.members} members</span>
              <span>🕒 {site.lastActivity}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => alert(`Opening ${site.name}`)}
                style={{ flex: 1, padding: '0.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Enter Site
              </button>
              <button 
                onClick={() => alert(`Managing ${site.name} settings`)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                ⚙️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Site Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: '#0052CC', marginBottom: '0.5rem' }}>📄 Document Library</h4>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Share and collaborate on documents with version control</p>
          </div>
          <div>
            <h4 style={{ color: '#0052CC', marginBottom: '0.5rem' }}>💬 Discussions</h4>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Forum-style discussions and announcements</p>
          </div>
          <div>
            <h4 style={{ color: '#0052CC', marginBottom: '0.5rem' }}>📝 Wiki</h4>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Create and maintain team knowledge base</p>
          </div>
          <div>
            <h4 style={{ color: '#0052CC', marginBottom: '0.5rem' }}>📅 Calendar</h4>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Schedule and track team events</p>
          </div>
          <div>
            <h4 style={{ color: '#0052CC', marginBottom: '0.5rem' }}>✅ Tasks</h4>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Assign and track team tasks</p>
          </div>
          <div>
            <h4 style={{ color: '#0052CC', marginBottom: '0.5rem' }}>📊 Activity Feed</h4>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Real-time updates on site activities</p>
          </div>
        </div>
      </div>
    </div>
  );
}