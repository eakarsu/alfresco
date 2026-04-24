'use client';

import { useState, useEffect, Component, ReactNode } from 'react';

class WorkflowErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean; error: string}> {
  constructor(props: {children: ReactNode}) { super(props); this.state = { hasError: false, error: '' }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error: error.message }; }
  render() {
    if (this.state.hasError) {
      return (<div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FFF3F3', borderRadius: '8px', margin: '2rem' }}><h2 style={{ color: '#FF5630' }}>Something went wrong</h2><p style={{ color: '#666', margin: '1rem 0' }}>{this.state.error}</p><button onClick={() => this.setState({ hasError: false, error: '' })} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Try Again</button></div>);
    }
    return this.props.children;
  }
}

interface Workflow { id: string; name: string; type: string; status: string; priority: string; assignee: string; startDate: string; dueDate: string; progress: number; description: string; businessKey: string; }
interface Toast { id: number; message: string; type: 'success' | 'error' | 'warning' | 'info'; }

const allWorkflows: Workflow[] = [
  { id: '1', name: 'Review Company Policy Update', type: 'Document Review', status: 'Active', priority: 'High', assignee: 'john.doe', startDate: '2024-01-10', dueDate: '2024-01-17', progress: 60, description: 'Annual company policy document review and approval', businessKey: 'DOC-2024-001' },
  { id: '2', name: 'Review API Documentation', type: 'Document Review', status: 'Active', priority: 'Medium', assignee: 'david.lee', startDate: '2024-01-12', dueDate: '2024-01-20', progress: 30, description: 'Technical documentation completeness review', businessKey: 'DOC-2024-002' },
  { id: '3', name: 'Publish Brand Guidelines', type: 'Content Publishing', status: 'Active', priority: 'Medium', assignee: 'carlos.garcia', startDate: '2024-01-08', dueDate: '2024-01-18', progress: 75, description: 'Updated brand guidelines for 2024', businessKey: 'PUB-2024-001' },
  { id: '4', name: 'Vendor NDA Processing', type: 'Contract Lifecycle', status: 'Active', priority: 'High', assignee: 'alice.johnson', startDate: '2024-01-05', dueDate: '2024-01-16', progress: 45, description: 'NDA for new technology vendor partnership', businessKey: 'CON-2024-001' },
  { id: '5', name: 'Process Q4 Invoices', type: 'Invoice Processing', status: 'Active', priority: 'High', assignee: 'jane.smith', startDate: '2024-01-11', dueDate: '2024-01-18', progress: 50, description: 'Batch processing of Q4 vendor invoices', businessKey: 'INV-2024-001' },
  { id: '6', name: 'Onboard Noah Harris', type: 'Employee Onboarding', status: 'Active', priority: 'Medium', assignee: 'john.doe', startDate: '2024-01-13', dueDate: '2024-01-20', progress: 25, description: 'New employee onboarding process', businessKey: 'EMP-2024-001' },
  { id: '7', name: 'Conference Travel Expenses', type: 'Expense Approval', status: 'Active', priority: 'Low', assignee: 'bob.wilson', startDate: '2024-01-09', dueDate: '2024-01-19', progress: 40, description: 'Tech conference travel expense report', businessKey: 'EXP-2024-001' },
  { id: '8', name: 'Annual Leave Request', type: 'Leave Request', status: 'Active', priority: 'Low', assignee: 'bob.wilson', startDate: '2024-01-14', dueDate: '2024-01-17', progress: 10, description: 'Two week vacation request approval', businessKey: 'LVE-2024-001' },
  { id: '9', name: 'Database Migration Request', type: 'Change Request', status: 'Suspended', priority: 'High', assignee: 'frank.miller', startDate: '2024-01-07', dueDate: '2024-01-21', progress: 55, description: 'PostgreSQL version upgrade request', businessKey: 'CHG-2024-001' },
  { id: '10', name: 'Approve Cloud Provider', type: 'Vendor Approval', status: 'Active', priority: 'High', assignee: 'admin', startDate: '2024-01-01', dueDate: '2024-01-22', progress: 70, description: 'Evaluation of new cloud provider', businessKey: 'VND-2024-001' },
  { id: '11', name: 'QA Review Deployment Guide', type: 'Quality Review', status: 'Active', priority: 'Medium', assignee: 'grace.taylor', startDate: '2024-01-12', dueDate: '2024-01-19', progress: 35, description: 'Quality check on deployment documentation', businessKey: 'QA-2024-001' },
  { id: '12', name: 'GDPR Compliance Audit', type: 'Compliance Check', status: 'Active', priority: 'High', assignee: 'alice.johnson', startDate: '2024-01-03', dueDate: '2024-01-25', progress: 80, description: 'Quarterly GDPR compliance verification', businessKey: 'CMP-2024-001' },
  { id: '13', name: 'Approve Project Delta', type: 'Project Approval', status: 'Active', priority: 'Medium', assignee: 'admin', startDate: '2024-01-13', dueDate: '2024-01-23', progress: 15, description: 'New project proposal review and approval', businessKey: 'PRJ-2024-001' },
  { id: '14', name: 'Review Security Policy', type: 'Document Review', status: 'Completed', priority: 'High', assignee: 'admin', startDate: '2023-11-01', dueDate: '2023-12-01', progress: 100, description: 'Annual security policy content review', businessKey: 'DOC-2023-015' },
  { id: '15', name: 'Publish Training Video', type: 'Content Publishing', status: 'Completed', priority: 'Medium', assignee: 'grace.taylor', startDate: '2023-10-15', dueDate: '2023-11-15', progress: 100, description: 'New security training video production', businessKey: 'PUB-2023-010' },
  { id: '16', name: 'Process SLA Agreement', type: 'Contract Lifecycle', status: 'Completed', priority: 'High', assignee: 'alice.johnson', startDate: '2023-09-01', dueDate: '2023-10-01', progress: 100, description: 'Service level agreement for client', businessKey: 'CON-2023-008' },
  { id: '17', name: 'Process December Invoices', type: 'Invoice Processing', status: 'Completed', priority: 'Medium', assignee: 'jane.smith', startDate: '2023-12-01', dueDate: '2023-12-15', progress: 100, description: 'Monthly invoice batch processing', businessKey: 'INV-2023-045' },
  { id: '18', name: 'Onboard Peter Robinson', type: 'Employee Onboarding', status: 'Completed', priority: 'Low', assignee: 'john.doe', startDate: '2023-08-15', dueDate: '2023-09-15', progress: 100, description: 'Employee onboarding completed', businessKey: 'EMP-2023-012' },
];

const statusColors: Record<string, { bg: string; color: string }> = { 'Active': { bg: '#E8F5E9', color: '#2E7D32' }, 'Completed': { bg: '#E3F2FD', color: '#1565C0' }, 'Suspended': { bg: '#FFF3E0', color: '#E65100' }, 'Failed': { bg: '#FFEBEE', color: '#C62828' } };
const priorityColors: Record<string, { bg: string; color: string }> = { 'High': { bg: '#FFEBEE', color: '#C62828' }, 'Medium': { bg: '#FFF3E0', color: '#E65100' }, 'Low': { bg: '#E8F5E9', color: '#2E7D32' } };

export default function WorkflowPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(allWorkflows);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<Workflow | null>(null);
  const [editItem, setEditItem] = useState<Workflow | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ action: string; ids: string[]; message: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkField, setBulkField] = useState('status');
  const [bulkValue, setBulkValue] = useState('');

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  const addToast = (message: string, type: Toast['type']) => { const id = Date.now(); setToasts(prev => [...prev, { id, message, type }]); setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000); };

  const filtered = workflows.filter(w => {
    const matchSearch = !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.assignee.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || w.status === statusFilter;
    const matchType = !typeFilter || w.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);
  const toggleSelect = (id: string) => { const n = new Set(selectedIds); n.has(id) ? n.delete(id) : n.add(id); setSelectedIds(n); };
  const toggleAll = () => { selectedIds.size === paginated.length ? setSelectedIds(new Set()) : setSelectedIds(new Set(paginated.map(w => w.id))); };
  const handleDelete = (ids: string[]) => { setWorkflows(prev => prev.filter(w => !ids.includes(w.id))); setSelectedIds(new Set()); setDetailItem(null); setShowConfirm(null); addToast(`${ids.length} workflow(s) deleted`, 'success'); };
  const handleBulkUpdate = () => { if (!bulkValue) return; setWorkflows(prev => prev.map(w => selectedIds.has(w.id) ? { ...w, [bulkField]: bulkValue } : w)); addToast(`${selectedIds.size} workflow(s) updated`, 'success'); setSelectedIds(new Set()); setShowBulkUpdate(false); };
  const handleEditSave = () => { if (!editItem) return; setWorkflows(prev => prev.map(w => w.id === editItem.id ? editItem : w)); setDetailItem(editItem); setEditItem(null); addToast('Workflow updated', 'success'); };

  const exportCSV = () => {
    const headers = ['ID', 'BusinessKey', 'Name', 'Type', 'Status', 'Priority', 'Assignee', 'StartDate', 'DueDate', 'Progress'];
    const items = selectedIds.size > 0 ? workflows.filter(w => selectedIds.has(w.id)) : workflows;
    const rows = items.map(w => [w.id, w.businessKey, `"${w.name}"`, w.type, w.status, w.priority, w.assignee, w.startDate, w.dueDate, w.progress].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'workflows.csv'; a.click(); addToast('CSV exported', 'success');
  };
  const exportPDF = () => {
    const items = selectedIds.size > 0 ? workflows.filter(w => selectedIds.has(w.id)) : workflows;
    let c = 'WORKFLOW REPORT\n' + '='.repeat(80) + '\nGenerated: ' + new Date().toLocaleString() + '\nTotal: ' + items.length + '\n\n';
    items.forEach(w => { c += `[${w.businessKey}] ${w.name}\nType: ${w.type} | Status: ${w.status} | Priority: ${w.priority}\nAssignee: ${w.assignee} | Progress: ${w.progress}%\n${'-'.repeat(60)}\n`; });
    const blob = new Blob([c], { type: 'application/pdf' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'workflows.pdf'; a.click(); addToast('PDF exported', 'success');
  };

  const types = [...new Set(allWorkflows.map(w => w.type))];

  return (
    <WorkflowErrorBoundary>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } } @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div><h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC' }}>Workflow Management</h1><p style={{ color: '#666', marginTop: '0.25rem' }}>{filtered.length} workflows total</p></div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={exportCSV} style={{ padding: '0.5rem 1rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export CSV</button>
            <button onClick={exportPDF} style={{ padding: '0.5rem 1rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export PDF</button>
            <button onClick={() => window.location.href = '/workflow/builder'} style={{ padding: '0.5rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ New Workflow</button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search workflows..." style={{ flex: 1, minWidth: '200px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option value="">All Statuses</option>{['Active', 'Completed', 'Suspended', 'Failed'].map(s => <option key={s} value={s}>{s}</option>)}</select>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option value="">All Types</option>{types.map(t => <option key={t} value={t}>{t}</option>)}</select>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '40px' }}><input type="checkbox" checked={selectedIds.size === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Type</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Priority</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Assignee</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Due Date</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Progress</th>
            </tr></thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}>{Array(8).fill(0).map((_, j) => (<td key={j} style={{ padding: '1rem' }}><div style={{ height: '16px', borderRadius: '4px', background: 'linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} /></td>))}</tr>
              )) : paginated.map(w => (
                <tr key={w.id} onClick={() => setDetailItem(w)} style={{ borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedIds.has(w.id) ? '#f0f4ff' : 'transparent' }}
                  onMouseEnter={e => { if (!selectedIds.has(w.id)) (e.currentTarget).style.backgroundColor = '#fafafa'; }}
                  onMouseLeave={e => { if (!selectedIds.has(w.id)) (e.currentTarget).style.backgroundColor = 'transparent'; }}>
                  <td style={{ padding: '0.75rem' }} onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedIds.has(w.id)} onChange={() => toggleSelect(w.id)} /></td>
                  <td style={{ padding: '0.75rem', color: '#0052CC', fontWeight: '500' }}>{w.name}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{w.type}</td>
                  <td style={{ padding: '0.75rem' }}><span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: statusColors[w.status]?.bg, color: statusColors[w.status]?.color }}>{w.status}</span></td>
                  <td style={{ padding: '0.75rem' }}><span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: priorityColors[w.priority]?.bg, color: priorityColors[w.priority]?.color }}>{w.priority}</span></td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{w.assignee}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{w.dueDate}</td>
                  <td style={{ padding: '0.75rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ flex: 1, height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: `${w.progress}%`, height: '100%', backgroundColor: w.progress === 100 ? '#2E7D32' : w.progress > 60 ? '#1565C0' : '#E65100', borderRadius: '4px' }} /></div><span style={{ fontSize: '0.8rem', color: '#666', minWidth: '35px' }}>{w.progress}%</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>Showing {Math.min(startIdx + 1, filtered.length)} to {Math.min(startIdx + pageSize, filtered.length)} of {filtered.length}</span>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>First</button>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => setCurrentPage(p)} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: p === currentPage ? '#0052CC' : 'white', color: p === currentPage ? 'white' : '#333' }}>{p}</button>))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>Last</button>
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} style={{ padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', marginLeft: '0.5rem' }}>{[5, 10, 25].map(s => <option key={s} value={s}>{s}/page</option>)}</select>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (<div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1a1a2e', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, boxShadow: '0 -2px 10px rgba(0,0,0,0.2)' }}>
          <span style={{ fontWeight: '500' }}>{selectedIds.size} item(s) selected</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowConfirm({ action: 'bulk-delete', ids: [...selectedIds], message: `Delete ${selectedIds.size} workflow(s)?` })} style={{ padding: '0.5rem 1rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete Selected</button>
            <button onClick={() => setShowBulkUpdate(true)} style={{ padding: '0.5rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update Selected</button>
            <button onClick={exportCSV} style={{ padding: '0.5rem 1rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export CSV</button>
            <button onClick={exportPDF} style={{ padding: '0.5rem 1rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export PDF</button>
            <button onClick={() => setSelectedIds(new Set())} style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
          </div>
        </div>)}

        {/* Detail Panel */}
        {detailItem && (<>
          <div onClick={() => { setDetailItem(null); setEditItem(null); }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 200 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', backgroundColor: 'white', zIndex: 201, boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', overflow: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0052CC' }}>Workflow Details</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setEditItem(editItem ? null : { ...detailItem })} style={{ padding: '0.4rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>{editItem ? 'Cancel' : 'Edit'}</button>
                <button onClick={() => setShowConfirm({ action: 'delete', ids: [detailItem.id], message: `Delete "${detailItem.name}"?` })} style={{ padding: '0.4rem 1rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                <button onClick={() => { setDetailItem(null); setEditItem(null); }} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}>X</button>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {editItem ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Name</label><input value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Status</label><select value={editItem.status} onChange={e => setEditItem({ ...editItem, status: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>{['Active', 'Completed', 'Suspended', 'Failed'].map(s => <option key={s}>{s}</option>)}</select></div>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Priority</label><select value={editItem.priority} onChange={e => setEditItem({ ...editItem, priority: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>{['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}</select></div>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Assignee</label><input value={editItem.assignee} onChange={e => setEditItem({ ...editItem, assignee: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                  <button onClick={handleEditSave} style={{ padding: '0.75rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Save Changes</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[['Business Key', detailItem.businessKey], ['Name', detailItem.name], ['Type', detailItem.type], ['Description', detailItem.description], ['Status', detailItem.status], ['Priority', detailItem.priority], ['Assignee', detailItem.assignee], ['Start Date', detailItem.startDate], ['Due Date', detailItem.dueDate]].map(([l, v]) => (<div key={l}><div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>{l}</div><div style={{ fontWeight: '500', marginTop: '0.2rem' }}>{v}</div></div>))}
                  <div><div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>Progress</div><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}><div style={{ flex: 1, height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${detailItem.progress}%`, height: '100%', backgroundColor: detailItem.progress === 100 ? '#2E7D32' : '#0052CC', borderRadius: '6px' }} /></div><span style={{ fontWeight: '600' }}>{detailItem.progress}%</span></div></div>
                </div>
              )}
            </div>
          </div>
        </>)}

        {/* Confirmation Dialog */}
        {showConfirm && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }} onClick={() => setShowConfirm(null)}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#FF5630' }}>Confirm Delete</h3><p style={{ color: '#666', marginBottom: '1.5rem' }}>{showConfirm.message}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConfirm(null)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(showConfirm.ids)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>)}

        {/* Bulk Update Modal */}
        {showBulkUpdate && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#0052CC' }}>Bulk Update {selectedIds.size} Workflows</h3>
            <div style={{ marginBottom: '1rem' }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Field</label><select value={bulkField} onChange={e => setBulkField(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option value="status">Status</option><option value="priority">Priority</option></select></div>
            <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>New Value</label><select value={bulkValue} onChange={e => setBulkValue(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option value="">Select...</option>{bulkField === 'status' ? ['Active', 'Completed', 'Suspended'].map(s => <option key={s}>{s}</option>) : ['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}</select></div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowBulkUpdate(false)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleBulkUpdate} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Apply</button>
            </div>
          </div>
        </div>)}

        {/* Toasts */}
        <div style={{ position: 'fixed', top: '80px', right: '1rem', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {toasts.map(t => (<div key={t.id} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', color: 'white', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', backgroundColor: t.type === 'success' ? '#00875A' : t.type === 'error' ? '#FF5630' : t.type === 'warning' ? '#FF9800' : '#0052CC', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideIn 0.3s ease' }}>{t.message}<button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.1rem' }}>x</button></div>))}
        </div>
      </div>
    </WorkflowErrorBoundary>
  );
}
