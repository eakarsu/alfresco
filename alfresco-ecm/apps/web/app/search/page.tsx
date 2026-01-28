'use client';

import { useState } from 'react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    // Simulate search results
    const mockResults = [
      { id: 1, type: 'document', name: 'Q4 Financial Report.pdf', modified: '2024-01-15', size: '2.3 MB' },
      { id: 2, type: 'document', name: 'Project Proposal.docx', modified: '2024-01-14', size: '856 KB' },
      { id: 3, type: 'folder', name: 'Marketing Materials', modified: '2024-01-13', items: 24 },
      { id: 4, type: 'workflow', name: 'Document Approval Process', status: 'Active', instances: 12 },
      { id: 5, type: 'site', name: 'Engineering Team', members: 45, lastActivity: '2024-01-15' }
    ];
    setResults(mockResults.filter(r => 
      searchQuery === '' || r.name.toLowerCase().includes(searchQuery.toLowerCase())
    ));
    alert(`Searching for: ${searchQuery || 'all items'}`);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🔍 Advanced Search</h1>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1,
              padding: '1rem',
              fontSize: '1rem',
              border: '2px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#0052CC',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Search
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['all', 'documents', 'folders', 'workflows', 'sites', 'users'].map(type => (
            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="searchType"
                value={type}
                checked={searchType === type}
                onChange={(e) => setSearchType(e.target.value)}
              />
              <span style={{ textTransform: 'capitalize' }}>{type}</span>
            </label>
          ))}
        </div>
        
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Advanced Options</summary>
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date Range:</label>
              <input type="date" style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>File Size:</label>
              <select style={{ width: '100%', padding: '0.5rem' }}>
                <option>Any size</option>
                <option>Less than 1MB</option>
                <option>1MB - 10MB</option>
                <option>Greater than 10MB</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Owner:</label>
              <input type="text" placeholder="Username" style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tags:</label>
              <input type="text" placeholder="Enter tags" style={{ width: '100%', padding: '0.5rem' }} />
            </div>
          </div>
        </details>
      </div>

      {results.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Search Results ({results.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map(result => (
              <div
                key={result.id}
                style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => alert(`Opening: ${result.name}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {result.type === 'document' ? '📄' : 
                     result.type === 'folder' ? '📁' :
                     result.type === 'workflow' ? '⚙️' :
                     result.type === 'site' ? '👥' : '📎'}
                  </span>
                  <div>
                    <h3 style={{ margin: 0 }}>{result.name}</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>
                      {result.type === 'document' && `Modified: ${result.modified} • Size: ${result.size}`}
                      {result.type === 'folder' && `Modified: ${result.modified} • ${result.items} items`}
                      {result.type === 'workflow' && `Status: ${result.status} • ${result.instances} instances`}
                      {result.type === 'site' && `${result.members} members • Last activity: ${result.lastActivity}`}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Previewing: ${result.name}`);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#0052CC',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Preview
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Downloading: ${result.name}`);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#00C853',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && searchQuery && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span style={{ fontSize: '3rem' }}>🔍</span>
          <p style={{ fontSize: '1.25rem', color: '#666' }}>No results found for "{searchQuery}"</p>
          <p>Try different keywords or adjust your search filters</p>
        </div>
      )}
    </div>
  );
}