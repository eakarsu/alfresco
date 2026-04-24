'use client';

import { useState, useEffect, Component, ReactNode } from 'react';

class SitesErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean; error: string}> {
  constructor(props: {children: ReactNode}) { super(props); this.state = { hasError: false, error: '' }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error: error.message }; }
  render() { if (this.state.hasError) { return (<div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FFF3F3', borderRadius: '8px', margin: '2rem' }}><h2 style={{ color: '#FF5630' }}>Something went wrong</h2><p>{this.state.error}</p><button onClick={() => this.setState({ hasError: false, error: '' })} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Try Again</button></div>); } return this.props.children; }
}

interface Site { id: string; name: string; shortName: string; description: string; visibility: string; owner: string; memberCount: number; createdDate: string; lastActivity: string; status: string; }
interface Toast { id: number; message: string; type: 'success' | 'error' | 'warning' | 'info'; }

const allSites: Site[] = [
  { id: '1', name: 'Engineering Hub', shortName: 'engineering', description: 'Central hub for engineering team collaboration', visibility: 'Private', owner: 'bob.wilson', memberCount: 15, createdDate: '2022-07-01', lastActivity: '2024-01-15', status: 'Active' },
  { id: '2', name: 'Marketing Central', shortName: 'marketing', description: 'Marketing team workspace and campaigns', visibility: 'Public', owner: 'carlos.garcia', memberCount: 8, createdDate: '2022-10-15', lastActivity: '2024-01-14', status: 'Active' },
  { id: '3', name: 'HR Team Site', shortName: 'hr-team', description: 'Human resources team collaboration', visibility: 'Private', owner: 'john.doe', memberCount: 6, createdDate: '2022-07-01', lastActivity: '2024-01-15', status: 'Active' },
  { id: '4', name: 'Finance Operations', shortName: 'finance-ops', description: 'Finance department operations hub', visibility: 'Private', owner: 'jane.smith', memberCount: 5, createdDate: '2022-10-15', lastActivity: '2024-01-14', status: 'Active' },
  { id: '5', name: 'Legal Department', shortName: 'legal-team', description: 'Legal team document collaboration', visibility: 'Private', owner: 'alice.johnson', memberCount: 4, createdDate: '2023-01-15', lastActivity: '2024-01-13', status: 'Active' },
  { id: '6', name: 'Project Alpha', shortName: 'project-alpha', description: 'Cloud migration project site', visibility: 'Private', owner: 'david.lee', memberCount: 10, createdDate: '2023-07-01', lastActivity: '2024-01-15', status: 'Active' },
  { id: '7', name: 'Project Beta', shortName: 'project-beta', description: 'Mobile app development project', visibility: 'Private', owner: 'emma.brown', memberCount: 8, createdDate: '2023-08-15', lastActivity: '2024-01-14', status: 'Active' },
  { id: '8', name: 'Executive Board', shortName: 'executive', description: 'Executive team discussions and decisions', visibility: 'Private', owner: 'admin', memberCount: 5, createdDate: '2022-01-01', lastActivity: '2024-01-15', status: 'Active' },
  { id: '9', name: 'All Hands', shortName: 'all-hands', description: 'Company-wide announcements and discussions', visibility: 'Public', owner: 'admin', memberCount: 50, createdDate: '2022-01-01', lastActivity: '2024-01-15', status: 'Active' },
  { id: '10', name: 'Training Center', shortName: 'training', description: 'Training materials and courses', visibility: 'Public', owner: 'grace.taylor', memberCount: 20, createdDate: '2023-03-01', lastActivity: '2024-01-12', status: 'Active' },
  { id: '11', name: 'QA Team', shortName: 'qa-team', description: 'Quality assurance team workspace', visibility: 'Private', owner: 'grace.taylor', memberCount: 6, createdDate: '2023-05-01', lastActivity: '2024-01-11', status: 'Active' },
  { id: '12', name: 'DevOps Hub', shortName: 'devops', description: 'DevOps and infrastructure team', visibility: 'Private', owner: 'frank.miller', memberCount: 5, createdDate: '2023-05-01', lastActivity: '2024-01-14', status: 'Active' },
  { id: '13', name: 'Sales Team', shortName: 'sales-team', description: 'Sales team collaboration and pipeline', visibility: 'Private', owner: 'admin', memberCount: 12, createdDate: '2023-01-15', lastActivity: '2024-01-13', status: 'Active' },
  { id: '14', name: 'Innovation Lab', shortName: 'innovation', description: 'Ideas and innovation proposals', visibility: 'Public', owner: 'admin', memberCount: 25, createdDate: '2023-07-01', lastActivity: '2024-01-10', status: 'Active' },
  { id: '15', name: 'Customer Support', shortName: 'support', description: 'Support team knowledge base', visibility: 'Private', owner: 'admin', memberCount: 8, createdDate: '2023-04-01', lastActivity: '2024-01-14', status: 'Active' },
  { id: '16', name: 'Project Gamma', shortName: 'project-gamma', description: 'Data analytics platform project', visibility: 'Private', owner: 'frank.miller', memberCount: 7, createdDate: '2023-09-01', lastActivity: '2024-01-15', status: 'Active' },
];

const visColors: Record<string, { bg: string; color: string }> = { 'Public': { bg: '#E8F5E9', color: '#2E7D32' }, 'Private': { bg: '#FFF3E0', color: '#E65100' } };

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>(allSites);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [visFilter, setVisFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<Site | null>(null);
  const [editItem, setEditItem] = useState<Site | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ ids: string[]; message: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkValue, setBulkValue] = useState('');

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);
  const addToast = (msg: string, type: Toast['type']) => { const id = Date.now(); setToasts(p => [...p, { id, message: msg, type }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000); };

  const filtered = sites.filter(s => {
    const ms = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.owner.toLowerCase().includes(search.toLowerCase());
    const mv = !visFilter || s.visibility === visFilter;
    return ms && mv;
  });
  const totalPages = Math.ceil(filtered.length / pageSize);
  const si = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(si, si + pageSize);
  const toggleSel = (id: string) => { const n = new Set(selectedIds); n.has(id) ? n.delete(id) : n.add(id); setSelectedIds(n); };
  const toggleAll = () => { selectedIds.size === paginated.length ? setSelectedIds(new Set()) : setSelectedIds(new Set(paginated.map(s => s.id))); };
  const handleDel = (ids: string[]) => { setSites(p => p.filter(s => !ids.includes(s.id))); setSelectedIds(new Set()); setDetailItem(null); setShowConfirm(null); addToast(`${ids.length} site(s) deleted`, 'success'); };
  const handleBulkUpd = () => { if (!bulkValue) return; setSites(p => p.map(s => selectedIds.has(s.id) ? { ...s, visibility: bulkValue } : s)); addToast(`${selectedIds.size} site(s) updated`, 'success'); setSelectedIds(new Set()); setShowBulkUpdate(false); };
  const handleEditSave = () => { if (!editItem) return; setSites(p => p.map(s => s.id === editItem.id ? editItem : s)); setDetailItem(editItem); setEditItem(null); addToast('Site updated', 'success'); };

  const exportCSV = () => {
    const h = ['ShortName', 'Name', 'Description', 'Visibility', 'Owner', 'Members', 'Created', 'LastActivity'];
    const items = selectedIds.size > 0 ? sites.filter(s => selectedIds.has(s.id)) : sites;
    const rows = items.map(s => [s.shortName, `"${s.name}"`, `"${s.description}"`, s.visibility, s.owner, s.memberCount, s.createdDate, s.lastActivity].join(','));
    const blob = new Blob([[h.join(','), ...rows].join('\n')], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sites.csv'; a.click(); addToast('CSV exported', 'success');
  };
  const exportPDF = () => {
    const items = selectedIds.size > 0 ? sites.filter(s => selectedIds.has(s.id)) : sites;
    let c = 'COLLABORATION SITES REPORT\n' + '='.repeat(80) + '\nGenerated: ' + new Date().toLocaleString() + '\nTotal: ' + items.length + '\n\n';
    items.forEach(s => { c += `${s.name} (${s.shortName})\n${s.description}\nVisibility: ${s.visibility} | Owner: ${s.owner} | Members: ${s.memberCount}\n${'-'.repeat(60)}\n`; });
    const blob = new Blob([c], { type: 'application/pdf' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sites.pdf'; a.click(); addToast('PDF exported', 'success');
  };

  return (
    <SitesErrorBoundary>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } } @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div><h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0052CC' }}>Sites & Collaboration</h1><p style={{ color: '#666', marginTop: '0.25rem' }}>{filtered.length} sites total</p></div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={exportCSV} style={{ padding: '0.5rem 1rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export CSV</button>
            <button onClick={exportPDF} style={{ padding: '0.5rem 1rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export PDF</button>
            <button onClick={() => addToast('Create site form coming soon', 'info')} style={{ padding: '0.5rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ New Site</button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search sites..." style={{ flex: 1, minWidth: '200px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          <select value={visFilter} onChange={e => { setVisFilter(e.target.value); setCurrentPage(1); }} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option value="">All Visibility</option><option value="Public">Public</option><option value="Private">Private</option></select>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead><tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '40px' }}><input type="checkbox" checked={selectedIds.size === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Description</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Visibility</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Owner</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Members</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Last Activity</th>
            </tr></thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (<tr key={i}>{Array(7).fill(0).map((_, j) => (<td key={j} style={{ padding: '1rem' }}><div style={{ height: '16px', borderRadius: '4px', background: 'linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} /></td>))}</tr>)) :
              paginated.map(s => (
                <tr key={s.id} onClick={() => setDetailItem(s)} style={{ borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedIds.has(s.id) ? '#f0f4ff' : 'transparent' }}
                  onMouseEnter={e => { if (!selectedIds.has(s.id)) e.currentTarget.style.backgroundColor = '#fafafa'; }}
                  onMouseLeave={e => { if (!selectedIds.has(s.id)) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <td style={{ padding: '0.75rem' }} onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleSel(s.id)} /></td>
                  <td style={{ padding: '0.75rem', color: '#0052CC', fontWeight: '500' }}>{s.name}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#666', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description}</td>
                  <td style={{ padding: '0.75rem' }}><span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: visColors[s.visibility]?.bg, color: visColors[s.visibility]?.color }}>{s.visibility}</span></td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{s.owner}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{s.memberCount}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{s.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>Showing {Math.min(si + 1, filtered.length)} to {Math.min(si + pageSize, filtered.length)} of {filtered.length}</span>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', opacity: currentPage === 1 ? 0.5 : 1 }}>First</button>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => setCurrentPage(p)} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: p === currentPage ? '#0052CC' : 'white', color: p === currentPage ? 'white' : '#333', cursor: 'pointer' }}>{p}</button>))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', opacity: currentPage === totalPages ? 0.5 : 1 }}>Last</button>
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} style={{ padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', marginLeft: '0.5rem' }}>{[5, 10, 25].map(s => <option key={s} value={s}>{s}/page</option>)}</select>
          </div>
        </div>

        {selectedIds.size > 0 && (<div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1a1a2e', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
          <span>{selectedIds.size} site(s) selected</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowConfirm({ ids: [...selectedIds], message: `Delete ${selectedIds.size} site(s)?` })} style={{ padding: '0.5rem 1rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete Selected</button>
            <button onClick={() => setShowBulkUpdate(true)} style={{ padding: '0.5rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update Selected</button>
            <button onClick={exportCSV} style={{ padding: '0.5rem 1rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export CSV</button>
            <button onClick={exportPDF} style={{ padding: '0.5rem 1rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export PDF</button>
            <button onClick={() => setSelectedIds(new Set())} style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
          </div>
        </div>)}

        {detailItem && (<>
          <div onClick={() => { setDetailItem(null); setEditItem(null); }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 200 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', backgroundColor: 'white', zIndex: 201, boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', overflow: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0052CC' }}>Site Details</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setEditItem(editItem ? null : { ...detailItem })} style={{ padding: '0.4rem 1rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>{editItem ? 'Cancel' : 'Edit'}</button>
                <button onClick={() => setShowConfirm({ ids: [detailItem.id], message: `Delete "${detailItem.name}"?` })} style={{ padding: '0.4rem 1rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                <button onClick={() => { setDetailItem(null); setEditItem(null); }} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {editItem ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Name</label><input value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Description</label><textarea value={editItem.description} onChange={e => setEditItem({ ...editItem, description: e.target.value })} rows={3} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Visibility</label><select value={editItem.visibility} onChange={e => setEditItem({ ...editItem, visibility: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option>Public</option><option>Private</option></select></div>
                  <button onClick={handleEditSave} style={{ padding: '0.75rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Save Changes</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[['Short Name', detailItem.shortName], ['Name', detailItem.name], ['Description', detailItem.description], ['Visibility', detailItem.visibility], ['Owner', detailItem.owner], ['Member Count', String(detailItem.memberCount)], ['Created', detailItem.createdDate], ['Last Activity', detailItem.lastActivity], ['Status', detailItem.status]].map(([l, v]) => (<div key={l}><div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>{l}</div><div style={{ fontWeight: '500', marginTop: '0.2rem' }}>{v}</div></div>))}
                </div>
              )}
            </div>
          </div>
        </>)}

        {showConfirm && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }} onClick={() => setShowConfirm(null)}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#FF5630' }}>Confirm Delete</h3><p style={{ color: '#666', marginBottom: '1.5rem' }}>{showConfirm.message}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConfirm(null)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDel(showConfirm.ids)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#FF5630', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>)}

        {showBulkUpdate && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#0052CC' }}>Bulk Update Visibility</h3>
            <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>New Visibility</label><select value={bulkValue} onChange={e => setBulkValue(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}><option value="">Select...</option><option>Public</option><option>Private</option></select></div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowBulkUpdate(false)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleBulkUpd} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Apply</button>
            </div>
          </div>
        </div>)}

        <div style={{ position: 'fixed', top: '80px', right: '1rem', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {toasts.map(t => (<div key={t.id} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', color: 'white', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', backgroundColor: t.type === 'success' ? '#00875A' : t.type === 'error' ? '#FF5630' : t.type === 'warning' ? '#FF9800' : '#0052CC', animation: 'slideIn 0.3s ease' }}>{t.message}<button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>x</button></div>))}
        </div>
      </div>
    </SitesErrorBoundary>
  );
}
