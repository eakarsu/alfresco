'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🔧 Administration Console</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #ddd' }}>
        {['users', 'system', 'security', 'workflows', 'integrations'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '1rem 2rem',
              backgroundColor: activeTab === tab ? '#0052CC' : 'transparent',
              color: activeTab === tab ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: activeTab === tab ? 'bold' : 'normal'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>User Management</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              onClick={() => alert('Creating new user...')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#00C853',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ➕ Add User
            </button>
            <button 
              onClick={() => alert('Importing users...')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#0052CC',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📥 Import Users
            </button>
            <button 
              onClick={() => alert('Managing groups...')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              👥 Manage Groups
            </button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Username</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {['admin', 'john.doe', 'jane.smith', 'bob.wilson'].map(user => (
                <tr key={user} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{user}</td>
                  <td style={{ padding: '1rem' }}>{user}@alfresco.com</td>
                  <td style={{ padding: '1rem' }}>{user === 'admin' ? 'Administrator' : 'User'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: '#E8F5E9',
                      color: '#2E7D32',
                      borderRadius: '12px',
                      fontSize: '0.875rem'
                    }}>
                      Active
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => alert(`Editing ${user}...`)}
                      style={{
                        padding: '0.5rem 1rem',
                        marginRight: '0.5rem',
                        backgroundColor: '#0052CC',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => alert(`Resetting password for ${user}...`)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#FF5630',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'system' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>System Configuration</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h3>Server Information</h3>
              <p>Version: 7.3.0</p>
              <p>Database: PostgreSQL 14.2</p>
              <p>Memory: 16GB / 32GB</p>
              <p>Storage: 250GB / 1TB</p>
              <button 
                onClick={() => alert('Viewing system logs...')}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#0052CC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Logs
              </button>
            </div>
            
            <div style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h3>Performance</h3>
              <p>CPU Usage: 45%</p>
              <p>Active Sessions: 127</p>
              <p>Response Time: 120ms</p>
              <p>Uptime: 45 days</p>
              <button 
                onClick={() => alert('Opening performance monitor...')}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#00C853',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Monitor
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Security Settings</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#FFF3E0', borderRadius: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input type="checkbox" defaultChecked />
                <span>Enable Two-Factor Authentication</span>
              </label>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#FFF3E0', borderRadius: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input type="checkbox" defaultChecked />
                <span>Enforce Password Complexity</span>
              </label>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#FFF3E0', borderRadius: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input type="checkbox" defaultChecked />
                <span>Enable Audit Logging</span>
              </label>
            </div>
            <button 
              onClick={() => alert('Security settings saved!')}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#00C853',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}
            >
              Save Security Settings
            </button>
          </div>
        </div>
      )}

      {activeTab === 'workflows' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Workflow Configuration</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {['Document Approval', 'Contract Review', 'Invoice Processing'].map(workflow => (
              <div key={workflow} style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3>{workflow}</h3>
                <p>Status: Active</p>
                <p>Instances: {Math.floor(Math.random() * 100)}</p>
                <button 
                  onClick={() => alert(`Configuring ${workflow}...`)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#0052CC',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Configure
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>System Integrations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {[
              { name: 'Office 365', status: 'Connected', icon: '📧' },
              { name: 'SharePoint', status: 'Connected', icon: '📁' },
              { name: 'SAP', status: 'Disconnected', icon: '🏢' },
              { name: 'Salesforce', status: 'Connected', icon: '☁️' }
            ].map(integration => (
              <div key={integration.name} style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3>{integration.icon} {integration.name}</h3>
                <p>Status: <span style={{
                  color: integration.status === 'Connected' ? 'green' : 'red'
                }}>{integration.status}</span></p>
                <button 
                  onClick={() => alert(`Managing ${integration.name} integration...`)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: integration.status === 'Connected' ? '#FF5630' : '#00C853',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}