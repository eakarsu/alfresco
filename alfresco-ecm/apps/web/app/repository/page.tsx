'use client';

import { useState } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  version: string;
}

export default function RepositoryPage() {
  const [documents] = useState<Document[]>([
    { id: '1', name: 'Q4 Report.pdf', type: 'PDF', size: '2.3 MB', modified: '2024-01-15', version: '1.2' },
    { id: '2', name: 'Project Plan.docx', type: 'Word', size: '856 KB', modified: '2024-01-14', version: '3.0' },
    { id: '3', name: 'Budget 2024.xlsx', type: 'Excel', size: '1.5 MB', modified: '2024-01-13', version: '2.1' },
    { id: '4', name: 'Architecture.png', type: 'Image', size: '3.2 MB', modified: '2024-01-12', version: '1.0' },
  ]);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocs(newSelected);
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC' }}>Document Repository</h1>
          <nav style={{ marginTop: '0.5rem' }}>
            <a href="/" style={{ color: '#0052CC', textDecoration: 'none' }}>← Back to Dashboard</a>
          </nav>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            + Upload
          </button>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            + New Folder
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <aside style={{ width: '250px', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Folders</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li onClick={() => alert('Opening All Documents folder...')} style={{ padding: '0.5rem', cursor: 'pointer', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>📁 All Documents</li>
            <li onClick={() => alert('Opening My Documents folder...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>📁 My Documents</li>
            <li onClick={() => alert('Opening Shared folder...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>📁 Shared</li>
            <li onClick={() => alert('Opening Recent documents...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>📁 Recent</li>
            <li onClick={() => alert('Opening Favorites...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>📁 Favorites</li>
            <li onClick={() => alert('Opening Trash...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>📁 Trash</li>
          </ul>
        </aside>

        <main style={{ flex: 1 }}>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Search documents..." 
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option>All Types</option>
              <option>PDF</option>
              <option>Word</option>
              <option>Excel</option>
              <option>Images</option>
            </select>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', width: '40px' }}>
                    <input type="checkbox" />
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Size</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Modified</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Version</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedDocs.has(doc.id)}
                        onChange={() => toggleSelect(doc.id)}
                      />
                    </td>
                    <td style={{ padding: '1rem', color: '#0052CC', cursor: 'pointer' }}>📄 {doc.name}</td>
                    <td style={{ padding: '1rem' }}>{doc.type}</td>
                    <td style={{ padding: '1rem' }}>{doc.size}</td>
                    <td style={{ padding: '1rem' }}>{doc.modified}</td>
                    <td style={{ padding: '1rem' }}>{doc.version}</td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => alert(`Viewing: ${doc.name}`)}
                        style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        View
                      </button>
                      <button 
                        onClick={() => alert(`Downloading: ${doc.name}`)}
                        style={{ padding: '0.25rem 0.5rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedDocs.size > 0 && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f4ff', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{selectedDocs.size} document(s) selected</span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ padding: '0.5rem 1rem', backgroundColor: '#6554C0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Share
                </button>
                <button style={{ padding: '0.5rem 1rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Delete
                </button>
                <button style={{ padding: '0.5rem 1rem', backgroundColor: '#00B8D9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Move
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}