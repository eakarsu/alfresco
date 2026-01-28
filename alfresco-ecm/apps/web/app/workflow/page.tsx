'use client';

import { useState } from 'react';

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending';
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export default function WorkflowPage() {
  const [workflows] = useState<Workflow[]>([
    { id: '1', name: 'Document Review - Q4 Report', status: 'active', assignee: 'John Smith', dueDate: '2024-01-20', priority: 'high' },
    { id: '2', name: 'Approval - Budget 2024', status: 'pending', assignee: 'Sarah Johnson', dueDate: '2024-01-22', priority: 'high' },
    { id: '3', name: 'Content Publishing', status: 'active', assignee: 'Mike Davis', dueDate: '2024-01-25', priority: 'medium' },
    { id: '4', name: 'Contract Review', status: 'completed', assignee: 'Emma Wilson', dueDate: '2024-01-15', priority: 'low' },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return '#00875A';
      case 'pending': return '#FF9800';
      case 'completed': return '#6554C0';
      default: return '#666';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#FF5630';
      case 'medium': return '#FFAB00';
      case 'low': return '#36B37E';
      default: return '#666';
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC' }}>Workflow Management</h1>
          <nav style={{ marginTop: '0.5rem' }}>
            <a href="/" style={{ color: '#0052CC', textDecoration: 'none' }}>← Back to Dashboard</a>
          </nav>
        </div>
        <button 
          onClick={() => window.location.href = '/workflow/builder'}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6554C0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + Create Workflow
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0052CC' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0052CC' }}>12</h3>
          <p style={{ margin: 0, color: '#666' }}>Active Workflows</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fff4e6', borderRadius: '8px', border: '1px solid #FF9800' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#FF9800' }}>8</h3>
          <p style={{ margin: 0, color: '#666' }}>Pending Tasks</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f0f4ff', borderRadius: '8px', border: '1px solid #6554C0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#6554C0' }}>45</h3>
          <p style={{ margin: 0, color: '#666' }}>Completed</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#ffebe6', borderRadius: '8px', border: '1px solid #FF5630' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#FF5630' }}>3</h3>
          <p style={{ margin: 0, color: '#666' }}>Overdue</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <aside style={{ width: '250px' }}>
          <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Filter by Status</h3>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input type="checkbox" defaultChecked /> Active
            </label>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input type="checkbox" defaultChecked /> Pending
            </label>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input type="checkbox" /> Completed
            </label>
          </div>

          <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Workflow Types</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li onClick={() => alert('Starting Document Review workflow...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>📝 Document Review</li>
              <li onClick={() => alert('Starting Approval Process workflow...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>✅ Approval Process</li>
              <li onClick={() => alert('Starting Publishing workflow...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>📤 Publishing</li>
              <li onClick={() => alert('Starting Change Request workflow...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>🔄 Change Request</li>
              <li onClick={() => alert('Starting Contract Review workflow...')} style={{ padding: '0.5rem', cursor: 'pointer' }}>📋 Contract Review</li>
            </ul>
          </div>
        </aside>

        <main style={{ flex: 1 }}>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Search workflows..." 
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option>All Priorities</option>
              <option>High Priority</option>
              <option>Medium Priority</option>
              <option>Low Priority</option>
            </select>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Workflow Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Assignee</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Due Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Priority</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map(workflow => (
                  <tr key={workflow.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{workflow.name}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        backgroundColor: getStatusColor(workflow.status) + '20',
                        color: getStatusColor(workflow.status),
                        borderRadius: '12px',
                        fontSize: '0.9rem'
                      }}>
                        {workflow.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{workflow.assignee}</td>
                    <td style={{ padding: '1rem' }}>{workflow.dueDate}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        backgroundColor: getPriorityColor(workflow.priority) + '20',
                        color: getPriorityColor(workflow.priority),
                        borderRadius: '12px',
                        fontSize: '0.9rem'
                      }}>
                        {workflow.priority}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => alert(`Opening workflow: ${workflow.name}`)}
                        style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Open
                      </button>
                      <button 
                        onClick={() => alert(`Editing workflow: ${workflow.name}`)}
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
            <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => window.location.href = '/workflow/builder'}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Design Process
              </button>
              <button 
                onClick={() => alert('Opening task manager...')}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                My Tasks
              </button>
              <button 
                onClick={() => alert('Opening analytics dashboard...')}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#00B8D9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Analytics
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}