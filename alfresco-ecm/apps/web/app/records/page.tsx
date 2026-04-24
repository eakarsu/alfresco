'use client';

import { useState, useEffect, Component, ReactNode } from 'react';

class RecordsErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean; error: string}> {
  constructor(props: {children: ReactNode}) { super(props); this.state = { hasError: false, error: '' }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error: error.message }; }
  render() { if (this.state.hasError) { return (<div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FFF3F3', borderRadius: '8px', margin: '2rem' }}><h2 style={{ color: '#FF5630' }}>Something went wrong</h2><p style={{ color: '#666', margin: '1rem 0' }}>{this.state.error}</p><button onClick={() => this.setState({ hasError: false, error: '' })} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Try Again</button></div>); } return this.props.children; }
}

interface RecordItem { id: string; title: string; identifier: string; category: string; classification: string; retentionDate: string; disposition: string; status: string; filePlan: string; createdBy: string; createdDate: string; description: string; }
interface Toast { id: number; message: string; type: 'success' | 'error' | 'warning' | 'info'; }

const allRecords: RecordItem[] = [
  { id: '1', title: 'Company Policy 2024', identifier: 'REC-2024-001', category: 'HR Records', classification: 'Confidential', retentionDate: '2031-01-01', disposition: 'Archive', status: 'Active', filePlan: 'Corporate Records Plan', createdBy: 'admin', createdDate: '2024-01-15', description: 'Annual company policy document filed as HR record' },
  { id: '2', title: 'Q4 Financial Report', identifier: 'REC-2024-002', category: 'Financial Records', classification: 'Internal', retentionDate: '2031-12-31', disposition: 'Review', status: 'Active', filePlan: 'Financial Records Plan', createdBy: 'jane.smith', createdDate: '2024-01-14', description: 'Fourth quarter financial summary and analysis' },
  { id: '3', title: 'Vendor NDA - TechCorp', identifier: 'REC-2024-003', category: 'Legal Documents', classification: 'Confidential', retentionDate: '2034-01-01', disposition: 'Review', status: 'Active', filePlan: 'Legal Records Plan', createdBy: 'alice.johnson', createdDate: '2024-01-13', description: 'Non-disclosure agreement with TechCorp vendor' },
  { id: '4', title: 'Employee Handbook v4', identifier: 'REC-2024-004', category: 'HR Records', classification: 'Internal', retentionDate: '2029-06-30', disposition: 'Archive', status: 'Active', filePlan: 'HR Records Plan', createdBy: 'john.doe', createdDate: '2024-01-12', description: 'Comprehensive employee handbook version 4' },
  { id: '5', title: 'Patent Filing - Widget X', identifier: 'REC-2024-005', category: 'Legal Documents', classification: 'Confidential', retentionDate: '2044-01-01', disposition: 'Permanent', status: 'Hold', filePlan: 'Legal Records Plan', createdBy: 'alice.johnson', createdDate: '2024-01-11', description: 'Patent filing under legal hold for litigation' },
  { id: '6', title: 'Tax Returns 2023', identifier: 'REC-2024-006', category: 'Financial Records', classification: 'Confidential', retentionDate: '2031-04-15', disposition: 'Destroy', status: 'Active', filePlan: 'Financial Records Plan', createdBy: 'jane.smith', createdDate: '2024-01-10', description: 'Corporate tax returns for fiscal year 2023' },
  { id: '7', title: 'Safety Inspection Report', identifier: 'REC-2024-007', category: 'Compliance', classification: 'Internal', retentionDate: '2029-01-01', disposition: 'Review', status: 'Active', filePlan: 'Safety Records Plan', createdBy: 'john.doe', createdDate: '2024-01-09', description: 'Annual workplace safety inspection results' },
  { id: '8', title: 'Board Meeting Minutes Q4', identifier: 'REC-2024-008', category: 'Corporate Records', classification: 'Confidential', retentionDate: '2034-12-31', disposition: 'Archive', status: 'Active', filePlan: 'Corporate Records Plan', createdBy: 'admin', createdDate: '2024-01-08', description: 'Q4 board meeting minutes and resolutions' },
  { id: '9', title: 'Insurance Policy 2024', identifier: 'REC-2024-009', category: 'Legal Documents', classification: 'Internal', retentionDate: '2025-12-31', disposition: 'Review', status: 'Active', filePlan: 'Legal Records Plan', createdBy: 'alice.johnson', createdDate: '2024-01-07', description: 'Corporate insurance policy documents' },
  { id: '10', title: 'GDPR Compliance Report', identifier: 'REC-2024-010', category: 'Compliance', classification: 'Confidential', retentionDate: '2031-01-01', disposition: 'Archive', status: 'Active', filePlan: 'Compliance Records Plan', createdBy: 'admin', createdDate: '2024-01-06', description: 'GDPR compliance audit and assessment report' },
  { id: '11', title: 'Vendor Contract - CloudCo', identifier: 'REC-2024-011', category: 'Legal Documents', classification: 'Confidential', retentionDate: '2031-06-30', disposition: 'Review', status: 'Hold', filePlan: 'Vendor Records Plan', createdBy: 'alice.johnson', createdDate: '2024-01-05', description: 'Cloud services vendor contract under legal hold' },
  { id: '12', title: 'Training Completion Records', identifier: 'REC-2024-012', category: 'HR Records', classification: 'Internal', retentionDate: '2027-01-01', disposition: 'Destroy', status: 'Active', filePlan: 'Training Records Plan', createdBy: 'grace.taylor', createdDate: '2024-01-04', description: 'Employee training completion certificates' },
  { id: '13', title: 'Annual Audit Report 2023', identifier: 'REC-2024-013', category: 'Compliance', classification: 'Confidential', retentionDate: '2031-03-31', disposition: 'Archive', status: 'Cutoff', filePlan: 'Audit Records Plan', createdBy: 'admin', createdDate: '2024-01-03', description: 'Internal audit report for fiscal year 2023' },
  { id: '14', title: 'Customer Data Processing Agreement', identifier: 'REC-2024-014', category: 'Legal Documents', classification: 'Confidential', retentionDate: '2034-01-01', disposition: 'Review', status: 'Active', filePlan: 'Customer Records Plan', createdBy: 'alice.johnson', createdDate: '2024-01-02', description: 'Data processing agreement with major clients' },
  { id: '15', title: 'Obsolete Marketing Plan 2022', identifier: 'REC-2023-050', category: 'Marketing Records', classification: 'Public', retentionDate: '2024-01-01', disposition: 'Destroy', status: 'Destroyed', filePlan: 'Marketing Records Plan', createdBy: 'carlos.garcia', createdDate: '2022-06-15', description: 'Obsolete marketing plan that has been destroyed' },
  { id: '16', title: 'Quality Audit Q3 2023', identifier: 'REC-2023-045', category: 'Compliance', classification: 'Internal', retentionDate: '2028-09-30', disposition: 'Archive', status: 'Active', filePlan: 'Quality Records Plan', createdBy: 'grace.taylor', createdDate: '2023-10-01', description: 'Quality management audit results for Q3' },
];

const statusColors: Record<string, { bg: string; color: string }> = { 'Active': { bg: '#E8F5E9', color: '#2E7D32' }, 'Hold': { bg: '#FFF3E0', color: '#E65100' }, 'Cutoff': { bg: '#E3F2FD', color: '#1565C0' }, 'Destroyed': { bg: '#FFEBEE', color: '#C62828' } };
const classColors: Record<string, { bg: string; color: string }> = { 'Confidential': { bg: '#FFEBEE', color: '#C62828' }, 'Internal': { bg: '#FFF3E0', color: '#E65100' }, 'Public': { bg: '#E8F5E9', color: '#2E7D32' } };

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>(allRecords);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<RecordItem | null>(null);
  const [editItem, setEditItem] = useState<RecordItem | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ ids: string[]; message: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkField, setBulkField] = useState('status');
  const [bulkValue, setBulkValue] = useState('');

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);
  const addToast = (msg: string, type: Toast['type']) => { const id = Date.now(); setToasts(p => [...p, { id, message: msg, type }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000); };

  const filtered = records.filter(r => {
    const ms = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.identifier.toLowerCase().includes(search.toLowerCase());
    const mc = !catFilter || r.category === catFilter;
    const mst = !statusFilter || r.status === statusFilter;
    return ms && mc && mst;
  });
  const totalPages = Math.ceil(filtered.length / pageSize);
  const si = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(si, si + pageSize);
  const toggleSel = (id: string) => { const n = new Set(selectedIds); n.has(id) ? n.delete(id) : n.add(id); setSelectedIds(n); };
  const toggleAll = () => { selectedIds.size === paginated.length ? setSelectedIds(new Set()) : setSelectedIds(new Set(paginated.map(r => r.id))); };
  const handleDel = (ids: string[]) => { setRecords(p => p.filter(r => !ids.includes(r.id))); setSelectedIds(new Set()); setDetailItem(null); setShowConfirm(null); addToast(`${ids.length} record(s) deleted`, 'success'); };
  const handleBulkUpd = () => { if (!bulkValue) return; setRecords(p => p.map(r => selectedIds.has(r.id) ? { ...r, [bulkField]: bulkValue } : r)); addToast(`${selectedIds.size} record(s) updated`, 'success'); setSelectedIds(new Set()); setShowBulkUpdate(false); };
  const handleEditSave = () => { if (!editItem) return; setRecords(p => p.map(r => r.id === editItem.id ? editItem : r)); setDetailItem(editItem); setEditItem(null); addToast('Record updated', 'success'); };

  const exportCSV = () => {
    const h = ['Identifier', 'Title', 'Category', 'Classification', 'RetentionDate', 'Disposition', 'Status', 'FilePlan', 'CreatedBy', 'CreatedDate'];
    const items = selectedIds.size > 0 ? records.filter(r => selectedIds.has(r.id)) : records;
    const rows = items.map(r => [r.identifier, `"${r.title}"`, r.category, r.classification, r.retentionDate, r.disposition, r.status, r.filePlan, r.createdBy, r.createdDate].join(','));
    const blob = new Blob([[h.join(','), ...rows].join('\n')], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'records.csv'; a.click(); addToast('CSV exported', 'success');
  };
  const exportPDF = () => {
    const items = selectedIds.size > 0 ? records.filter(r => selectedIds.has(r.id)) : records;
    let c = 'RECORDS MANAGEMENT REPORT\n' + '='.repeat(80) + '\nGenerated: ' + new Date().toLocaleString() + '\nTotal: ' + items.length + '\n\n';
    items.forEach(r => { c += `[${r.identifier}] ${r.title}\nCategory: ${r.category} | Classification: ${r.classification} | Status: ${r.status}\nRetention: ${r.retentionDate} | Disposition: ${r.disposition}\n${'-'.repeat(60)}\n`; });
    const blob = new Blob([c], { type: 'application/pdf' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'records.pdf'; a.click(); addToast('PDF exported', 'success');
  };

  const cats = [...new Set(allRecords.map(r => r.category))];

  return (
    <RecordsErrorBoundary>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } } @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div><h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC' }}>Records Management</h1><p style={{ color: '#666', marginTop: '0.25rem' }}>{filtered.length} records total</p></div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={exportCSV} style={{ padding: '0.5rem 1rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export CSV</button>
            <button onClick={exportPDF} style={{ padding: '0.5rem 1rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export PDF</button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search records..." style={{ flex: 1, minWidth: '200px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setCurrentPage(1); }} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option value="">All Categories</option>{cats.map(c => <option key={c} value={c}>{c}</option>)}</select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option value="">All Statuses</option>{['Active', 'Hold', 'Cutoff', 'Destroyed'].map(s => <option key={s} value={s}>{s}</option>)}</select>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead><tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '40px' }}><input type="checkbox" checked={selectedIds.size === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Identifier</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Title</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Classification</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Retention</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Disposition</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
            </tr></thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (<tr key={i}>{Array(8).fill(0).map((_, j) => (<td key={j} style={{ padding: '1rem' }}><div style={{ height: '16px', borderRadius: '4px', background: 'linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} /></td>))}</tr>)) :
              paginated.map(r => (
                <tr key={r.id} onClick={() => setDetailItem(r)} style={{ borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedIds.has(r.id) ? '#f0f4ff' : 'transparent' }}
                  onMouseEnter={e => { if (!selectedIds.has(r.id)) e.currentTarget.style.backgroundColor = '#fafafa'; }}
                  onMouseLeave={e => { if (!selectedIds.has(r.id)) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <td style={{ padding: '0.75rem' }} onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleSel(r.id)} /></td>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#0052CC' }}>{r.identifier}</td>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{r.title}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{r.category}</td>
                  <td style={{ padding: '0.75rem' }}><span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: classColors[r.classification]?.bg, color: classColors[r.classification]?.color }}>{r.classification}</span></td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{r.retentionDate}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{r.disposition}</td>
                  <td style={{ padding: '0.75rem' }}><span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: statusColors[r.status]?.bg, color: statusColors[r.status]?.color }}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>Showing {Math.min(si + 1, filtered.length)} to {Math.min(si + pageSize, filtered.length)} of {filtered.length}</span>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}>First</button>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => setCurrentPage(p)} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: p === currentPage ? '#0052CC' : 'white', color: p === currentPage ? 'white' : '#333' }}>{p}</button>))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'default' : 'pointer' }}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'default' : 'pointer' }}>Last</button>
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} style={{ padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', marginLeft: '0.5rem' }}>{[5, 10, 25].map(s => <option key={s} value={s}>{s}/page</option>)}</select>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (<div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1a1a2e', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
          <span>{selectedIds.size} record(s) selected</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowConfirm({ ids: [...selectedIds], message: `Delete ${selectedIds.size} record(s)?` })} style={{ padding: '0.5rem 1rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete Selected</button>
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
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0052CC' }}>Record Details</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setEditItem(editItem ? null : { ...detailItem })} style={{ padding: '0.4rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>{editItem ? 'Cancel' : 'Edit'}</button>
                <button onClick={() => setShowConfirm({ ids: [detailItem.id], message: `Delete "${detailItem.title}"?` })} style={{ padding: '0.4rem 1rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                <button onClick={() => { setDetailItem(null); setEditItem(null); }} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {editItem ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Title</label><input value={editItem.title} onChange={e => setEditItem({ ...editItem, title: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Status</label><select value={editItem.status} onChange={e => setEditItem({ ...editItem, status: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>{['Active', 'Hold', 'Cutoff', 'Destroyed'].map(s => <option key={s}>{s}</option>)}</select></div>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Classification</label><select value={editItem.classification} onChange={e => setEditItem({ ...editItem, classification: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>{['Confidential', 'Internal', 'Public'].map(c => <option key={c}>{c}</option>)}</select></div>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Disposition</label><select value={editItem.disposition} onChange={e => setEditItem({ ...editItem, disposition: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>{['Archive', 'Review', 'Destroy', 'Permanent'].map(d => <option key={d}>{d}</option>)}</select></div>
                  <button onClick={handleEditSave} style={{ padding: '0.75rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Save Changes</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[['Identifier', detailItem.identifier], ['Title', detailItem.title], ['Description', detailItem.description], ['Category', detailItem.category], ['Classification', detailItem.classification], ['Status', detailItem.status], ['File Plan', detailItem.filePlan], ['Retention Date', detailItem.retentionDate], ['Disposition', detailItem.disposition], ['Created By', detailItem.createdBy], ['Created Date', detailItem.createdDate]].map(([l, v]) => (<div key={l}><div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>{l}</div><div style={{ fontWeight: '500', marginTop: '0.2rem' }}>{v}</div></div>))}
                </div>
              )}
            </div>
          </div>
        </>)}

        {/* Confirm Dialog */}
        {showConfirm && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }} onClick={() => setShowConfirm(null)}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#FF5630' }}>Confirm Delete</h3><p style={{ color: '#666', marginBottom: '1.5rem' }}>{showConfirm.message}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConfirm(null)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDel(showConfirm.ids)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>)}

        {/* Bulk Update */}
        {showBulkUpdate && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#0052CC' }}>Bulk Update {selectedIds.size} Records</h3>
            <div style={{ marginBottom: '1rem' }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Field</label><select value={bulkField} onChange={e => setBulkField(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option value="status">Status</option><option value="classification">Classification</option><option value="disposition">Disposition</option></select></div>
            <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>New Value</label><select value={bulkValue} onChange={e => setBulkValue(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option value="">Select...</option>{bulkField === 'status' ? ['Active', 'Hold', 'Cutoff'].map(s => <option key={s}>{s}</option>) : bulkField === 'classification' ? ['Confidential', 'Internal', 'Public'].map(c => <option key={c}>{c}</option>) : ['Archive', 'Review', 'Destroy', 'Permanent'].map(d => <option key={d}>{d}</option>)}</select></div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowBulkUpdate(false)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleBulkUpd} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Apply</button>
            </div>
          </div>
        </div>)}

        {/* Toasts */}
        <div style={{ position: 'fixed', top: '80px', right: '1rem', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {toasts.map(t => (<div key={t.id} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', color: 'white', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', backgroundColor: t.type === 'success' ? '#00875A' : t.type === 'error' ? '#FF5630' : '#0052CC', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideIn 0.3s ease' }}>{t.message}<button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>x</button></div>))}
        </div>
      </div>
    </RecordsErrorBoundary>
  );
}
