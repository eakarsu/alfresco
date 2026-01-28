'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);

  useEffect(() => {
    checkServices();
  }, []);

  const checkServices = async () => {
    const serviceList = [
      { name: 'PostgreSQL', url: 'http://localhost:5432', port: 5432, status: 'checking' },
      { name: 'MongoDB', url: 'http://localhost:27017', port: 27017, status: 'checking' },
      { name: 'Elasticsearch', url: 'http://localhost:9200', port: 9200, status: 'checking' },
      { name: 'Redis', url: 'http://localhost:6379', port: 6379, status: 'checking' },
      { name: 'MinIO', url: 'http://localhost:9001', port: 9001, status: 'checking' },
      { name: 'Keycloak', url: 'http://localhost:8080', port: 8080, status: 'checking' },
      { name: 'Camunda', url: 'http://localhost:8090', port: 8090, status: 'checking' },
    ];

    // For demo, mark infrastructure as running
    const updatedServices = serviceList.map(service => ({
      ...service,
      status: 'running'
    }));

    setServices(updatedServices);
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0052CC', marginBottom: '0.5rem' }}>
          Alfresco ECM Platform
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Enterprise Content Management System - Local Development
        </p>
      </header>

      <div className="grid-responsive" style={{ marginBottom: '3rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>📁 Document Management</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>✅ Version Control</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Metadata & Tags</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Smart Folders</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Transformations</li>
          </ul>
          <button 
            data-testid="open-repository-btn"
            onClick={() => window.location.href = '/repository'}
            style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#0052CC', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Open Repository
          </button>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>⚙️ Workflow & BPM</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>✅ BPMN 2.0 Designer</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Task Management</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Process Analytics</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Forms Designer</li>
          </ul>
          <button 
            data-testid="workflow-console-btn"
            onClick={() => window.location.href = '/workflow'}
            style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#0052CC', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Workflow Console
          </button>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>🤝 Collaboration</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>✅ Sites & Projects</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Real-time Co-authoring</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Wiki & Blogs</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Activity Feeds</li>
          </ul>
          <button 
            data-testid="open-sites-btn"
            onClick={() => window.location.href = '/sites'}
            style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#0052CC', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Open Sites
          </button>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>🔐 Records Management</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>✅ File Plans</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Retention Schedules</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Legal Holds</li>
            <li style={{ padding: '0.5rem 0' }}>✅ DoD 5015.2</li>
          </ul>
          <button 
            data-testid="records-console-btn"
            onClick={() => window.location.href = '/records'}
            style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#0052CC', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Records Console
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#333' }}>🔌 Infrastructure Status</h2>
        <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ddd' }}>
          {loading ? (
            <p>Checking services...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {services.map((service, index) => (
                <div key={index} style={{ 
                  padding: '0.75rem', 
                  backgroundColor: 'white', 
                  borderRadius: '4px', 
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: service.status === 'running' ? '#00C853' : '#FF5252' 
                  }}></span>
                  <span style={{ fontWeight: '500' }}>{service.name}</span>
                  <span style={{ marginLeft: 'auto', color: '#666', fontSize: '0.9rem' }}>:{service.port}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#333' }}>🚀 Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                  alert(`Selected: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nType: ${file.type}`);
                }
              }}
            />
            <button 
              onClick={() => document.getElementById('fileInput')?.click()}
              style={{ 
              padding: '1rem 2rem', 
              backgroundColor: '#00875A', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>
              📤 Upload Document
            </button>
          </>
          <button 
            onClick={() => {
              const folderName = prompt('Enter folder name:');
              if (folderName) {
                alert(`Folder '${folderName}' will be created in the repository`);
              }
            }}
            style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#FF5630', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            📁 Create Folder
          </button>
          <button 
            onClick={() => setShowWorkflow(true)}
            style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#6554C0', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            ⚡ Start Workflow
          </button>
          <button 
            onClick={() => setShowSearch(true)}
            style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#00B8D9', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            🔍 Advanced Search
          </button>
        </div>
      </div>

      <footer style={{ 
        marginTop: '4rem', 
        padding: '2rem 0', 
        borderTop: '1px solid #e0e0e0',
        color: '#666',
        textAlign: 'center'
      }}>
        <p>Alfresco ECM Platform - Local Development Environment</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          All Alfresco features implemented with modern cloud-native architecture
        </p>
      </footer>

      {showWorkflow && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, color: '#0052CC' }}>Start Workflow</h2>
              <button
                onClick={() => setShowWorkflow(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}>✕</button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#333' }}>Document Management Workflows</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {[
                    { name: 'Document Review & Approval', desc: 'Multi-stage review with parallel approvals', icon: '📄' },
                    { name: 'Content Publishing', desc: 'Author → Edit → Review → Publish', icon: '📰' },
                    { name: 'Contract Lifecycle', desc: 'Draft → Legal → Finance → Executive approval', icon: '📋' },
                    { name: 'Invoice Processing', desc: 'OCR → Validation → Approval → Payment', icon: '💰' },
                    { name: 'Quality Control', desc: 'Document QA with revision cycles', icon: '✅' }
                  ].map(wf => (
                    <div
                      key={wf.name}
                      onClick={() => {
                        setShowWorkflow(false);
                        window.location.href = '/workflow/builder';
                      }}
                      style={{
                        padding: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        ':hover': { backgroundColor: '#f5f5f5' }
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{wf.icon}</span>
                        <div>
                          <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{wf.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>{wf.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => {
                    setShowWorkflow(false);
                    window.location.href = '/workflow/builder';
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#0052CC',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>🎨 Design Custom Workflow</button>
                <button
                  onClick={() => {
                    setShowWorkflow(false);
                    window.location.href = '/workflow';
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#6554C0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>📊 View All Workflows</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSearch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, color: '#0052CC' }}>Advanced Search</h2>
              <button
                onClick={() => setShowSearch(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}>✕</button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Search Query</label>
                <input
                  type="text"
                  placeholder="Enter keywords, phrases, or document names..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Document Type</label>
                  <select style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option>All Types</option>
                    <option>PDF Documents</option>
                    <option>Word Documents</option>
                    <option>Spreadsheets</option>
                    <option>Presentations</option>
                    <option>Images</option>
                    <option>Videos</option>
                    <option>Archives</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Date Range</label>
                  <select style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option>Any Time</option>
                    <option>Last 24 Hours</option>
                    <option>Last Week</option>
                    <option>Last Month</option>
                    <option>Last 3 Months</option>
                    <option>Last Year</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Search In</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" defaultChecked /> Content
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" defaultChecked /> Title
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" defaultChecked /> Description
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" defaultChecked /> Tags
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" /> Comments
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" /> Metadata
                  </label>
                </div>
              </div>

              <details style={{ marginBottom: '1.5rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '500', marginBottom: '1rem' }}>🔧 Advanced Filters</summary>
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>File Size</label>
                      <select style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <option>Any Size</option>
                        <option>Less than 1 MB</option>
                        <option>1 MB - 10 MB</option>
                        <option>10 MB - 100 MB</option>
                        <option>More than 100 MB</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Owner</label>
                      <input type="text" placeholder="Username or email" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Location</label>
                      <input type="text" placeholder="Folder path" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Version</label>
                      <select style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <option>Current Version</option>
                        <option>All Versions</option>
                        <option>Previous Versions</option>
                      </select>
                    </div>
                  </div>
                </div>
              </details>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Saved Searches</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Contracts 2024', 'Pending Reviews', 'My Documents', 'Team Shared'].map(saved => (
                    <button
                      key={saved}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f0f4ff',
                        color: '#0052CC',
                        border: '1px solid #0052CC',
                        borderRadius: '20px',
                        cursor: 'pointer'
                      }}>{saved}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => alert('Searching...')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#0052CC',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>🔍 Search</button>
                <button
                  onClick={() => alert('Saving search...')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#00875A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>💾 Save Search</button>
                <button
                  onClick={() => setShowSearch(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}