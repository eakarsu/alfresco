'use client';

import { useState } from 'react';

interface Record {
  id: string;
  title: string;
  category: string;
  classification: 'public' | 'confidential' | 'secret';
  retentionDate: string;
  status: 'active' | 'hold' | 'cutoff' | 'destroyed';
}

export default function RecordsPage() {
  const [records] = useState<Record[]>([
    { id: '1', title: 'Financial Audit 2023', category: 'Financial Records', classification: 'confidential', retentionDate: '2030-12-31', status: 'active' },
    { id: '2', title: 'Employee Records - Q4', category: 'HR Records', classification: 'secret', retentionDate: '2031-06-30', status: 'hold' },
    { id: '3', title: 'Contract ABC-123', category: 'Legal Documents', classification: 'confidential', retentionDate: '2029-03-15', status: 'active' },
    { id: '4', title: 'Tax Returns 2020', category: 'Financial Records', classification: 'confidential', retentionDate: '2027-12-31', status: 'cutoff' },
  ]);

  const getClassificationColor = (classification: string) => {
    switch(classification) {
      case 'public': return '#36B37E';
      case 'confidential': return '#FFAB00';
      case 'secret': return '#FF5630';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return '#00875A';
      case 'hold': return '#FF9800';
      case 'cutoff': return '#6554C0';
      case 'destroyed': return '#666';
      default: return '#666';
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC' }}>Records Management</h1>
          <nav style={{ marginTop: '0.5rem' }}>
            <a href="/" style={{ color: '#0052CC', textDecoration: 'none' }}>← Back to Dashboard</a>
          </nav>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => alert('Opening file plan editor...')}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6554C0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            File Plan
          </button>
          <button 
            onClick={() => alert('Declaring new record...')}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            + Declare Record
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#e6f7ff', borderRadius: '8px', border: '1px solid #0052CC' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0052CC' }}>234</h3>
          <p style={{ margin: 0, color: '#666' }}>Active Records</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fff7e6', borderRadius: '8px', border: '1px solid #FFAB00' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#FFAB00' }}>18</h3>
          <p style={{ margin: 0, color: '#666' }}>Legal Holds</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f0f4ff', borderRadius: '8px', border: '1px solid #6554C0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#6554C0' }}>45</h3>
          <p style={{ margin: 0, color: '#666' }}>Cutoff Records</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#e6fcf5', borderRadius: '8px', border: '1px solid #36B37E' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#36B37E' }}>100%</h3>
          <p style={{ margin: 0, color: '#666' }}>Compliance</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <aside style={{ width: '250px' }}>
          <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Categories</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li onClick={() => alert('Showing all records...')} style={{ padding: '0.5rem', cursor: 'pointer', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>📁 All Records</li>
              <li onClick={() => alert('Filtering financial records...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>💼 Financial Records</li>
              <li onClick={() => alert('Filtering HR records...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>👥 HR Records</li>
              <li onClick={() => alert('Filtering legal documents...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>⚖️ Legal Documents</li>
              <li onClick={() => alert('Filtering corporate records...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>🏢 Corporate Records</li>
              <li onClick={() => alert('Filtering contracts...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>📋 Contracts</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#ffebe6', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#FF5630' }}>⚠️ Compliance Alert</h4>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>3 records approaching retention deadline</p>
            <button 
              onClick={() => alert('Viewing compliance report...')}
              style={{ marginTop: '0.5rem', padding: '0.5rem', width: '100%', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              View Report
            </button>
          </div>
        </aside>

        <main style={{ flex: 1 }}>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Search records..." 
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option>All Classifications</option>
              <option>Public</option>
              <option>Confidential</option>
              <option>Secret</option>
            </select>
            <select style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option>All Status</option>
              <option>Active</option>
              <option>Hold</option>
              <option>Cutoff</option>
            </select>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Record Title</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Classification</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Retention Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>🔒 {record.title}</td>
                    <td style={{ padding: '1rem' }}>{record.category}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        backgroundColor: getClassificationColor(record.classification) + '20',
                        color: getClassificationColor(record.classification),
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        {record.classification.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{record.retentionDate}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        backgroundColor: getStatusColor(record.status) + '20',
                        color: getStatusColor(record.status),
                        borderRadius: '12px',
                        fontSize: '0.9rem'
                      }}>
                        {record.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => alert(`Viewing record: ${record.title}`)}
                        style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        View
                      </button>
                      <button 
                        onClick={() => alert(`Editing retention for: ${record.title}`)}
                        style={{ padding: '0.25rem 0.5rem', backgroundColor: '#6554C0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Records Management Tools</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <button 
                onClick={() => alert('Opening retention schedule...')}
                style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                📅 <strong>Retention Schedule</strong>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Manage lifecycle rules</div>
              </button>
              <button 
                onClick={() => alert('Opening legal holds...')}
                style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                ⚖️ <strong>Legal Holds</strong>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Preserve records</div>
              </button>
              <button 
                onClick={() => alert('Opening audit trail...')}
                style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                📊 <strong>Audit Trail</strong>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Track all activities</div>
              </button>
              <button 
                onClick={() => alert('Opening DoD 5015.2 compliance...')}
                style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                🛡️ <strong>DoD 5015.2</strong>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Compliance reports</div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}