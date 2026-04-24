'use client';

import React, { useState, useEffect, useCallback, Component, ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  version: string;
  owner: string;
  status: string;
  department: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

// ─── Error Boundary ──────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: '#FFF5F5',
            border: '1px solid #FEB2B2',
            borderRadius: '8px',
            padding: '2rem',
          }}>
            <h2 style={{ color: '#C53030', marginBottom: '1rem' }}>Something went wrong</h2>
            <p style={{ color: '#742A2A', marginBottom: '1rem' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#C53030',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const initialDocuments: Document[] = [
  { id: '1', name: 'Company Policy 2024.pdf', type: 'PDF', size: '2.0 MB', modified: '2024-01-15', version: '2.0', owner: 'admin', status: 'Published', department: 'HR' },
  { id: '2', name: 'Q4 Financial Report.xlsx', type: 'Excel', size: '512 KB', modified: '2024-01-14', version: '2.1', owner: 'jane.smith', status: 'Published', department: 'Finance' },
  { id: '3', name: 'Architecture Design.docx', type: 'Word', size: '1.0 MB', modified: '2024-01-13', version: '3.0', owner: 'david.lee', status: 'Approved', department: 'Engineering' },
  { id: '4', name: 'Meeting Notes Jan 2024.txt', type: 'Text', size: '4 KB', modified: '2024-01-12', version: '1.0', owner: 'bob.wilson', status: 'Published', department: 'General' },
  { id: '5', name: 'Brand Guidelines.pdf', type: 'PDF', size: '8.0 MB', modified: '2024-01-11', version: '1.5', owner: 'carlos.garcia', status: 'Published', department: 'Marketing' },
  { id: '6', name: 'Employee Handbook.pdf', type: 'PDF', size: '3.0 MB', modified: '2024-01-10', version: '4.0', owner: 'john.doe', status: 'Published', department: 'HR' },
  { id: '7', name: 'NDA Template.docx', type: 'Word', size: '64 KB', modified: '2024-01-09', version: '2.0', owner: 'alice.johnson', status: 'Approved', department: 'Legal' },
  { id: '8', name: 'API Documentation.md', type: 'Markdown', size: '128 KB', modified: '2024-01-08', version: '5.2', owner: 'bob.wilson', status: 'Draft', department: 'Engineering' },
  { id: '9', name: 'Onboarding Presentation.pptx', type: 'PowerPoint', size: '15 MB', modified: '2024-01-07', version: '3.0', owner: 'grace.taylor', status: 'Published', department: 'HR' },
  { id: '10', name: 'Budget 2024.xlsx', type: 'Excel', size: '768 KB', modified: '2024-01-06', version: '1.3', owner: 'jane.smith', status: 'Draft', department: 'Finance' },
  { id: '11', name: 'Mobile App Wireframes.png', type: 'Image', size: '5.0 MB', modified: '2024-01-05', version: '2.0', owner: 'emma.brown', status: 'Approved', department: 'Engineering' },
  { id: '12', name: 'Data Privacy Policy.pdf', type: 'PDF', size: '1.5 MB', modified: '2024-01-04', version: '3.0', owner: 'admin', status: 'Published', department: 'Compliance' },
  { id: '13', name: 'Company Logo.svg', type: 'Image', size: '32 KB', modified: '2024-01-03', version: '1.0', owner: 'carlos.garcia', status: 'Published', department: 'Marketing' },
  { id: '14', name: 'Deployment Guide.md', type: 'Markdown', size: '96 KB', modified: '2024-01-02', version: '2.1', owner: 'frank.miller', status: 'Published', department: 'Engineering' },
  { id: '15', name: 'Monthly KPI Report.xlsx', type: 'Excel', size: '384 KB', modified: '2024-01-01', version: '1.0', owner: 'jane.smith', status: 'Published', department: 'Finance' },
  { id: '16', name: 'Service Agreement.pdf', type: 'PDF', size: '512 KB', modified: '2023-12-30', version: '1.2', owner: 'alice.johnson', status: 'Approved', department: 'Legal' },
  { id: '17', name: 'Security Training.mp4', type: 'Video', size: '100 MB', modified: '2023-12-28', version: '1.0', owner: 'grace.taylor', status: 'Published', department: 'Training' },
  { id: '18', name: 'Invoice Template.xlsx', type: 'Excel', size: '44 KB', modified: '2023-12-25', version: '2.0', owner: 'admin', status: 'Published', department: 'Finance' },
];

// ─── File type icon helper ───────────────────────────────────────────────────

function getFileIcon(type: string): string {
  switch (type) {
    case 'PDF': return '\u{1F4C4}';
    case 'Word': return '\u{1F4DD}';
    case 'Excel': return '\u{1F4CA}';
    case 'PowerPoint': return '\u{1F4CA}';
    case 'Image': return '\u{1F5BC}';
    case 'Video': return '\u{1F3AC}';
    case 'Markdown': return '\u{1F4C3}';
    case 'Text': return '\u{1F4C3}';
    default: return '\u{1F4C4}';
  }
}

function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case 'Published': return { bg: '#C6F6D5', text: '#22543D' };
    case 'Draft': return { bg: '#FEFCBF', text: '#744210' };
    case 'Approved': return { bg: '#BEE3F8', text: '#2A4365' };
    default: return { bg: '#E2E8F0', text: '#4A5568' };
  }
}

// ─── Shimmer keyframes injector ──────────────────────────────────────────────

function ShimmerStyle() {
  return (
    <style>{`
      @keyframes shimmer {
        0% { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
    `}</style>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────

function RepositoryPageContent() {
  // ── Core state ──
  const [allDocuments, setAllDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');

  // ── Pagination ──
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ── Selection ──
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  // ── Detail panel ──
  const [detailDoc, setDetailDoc] = useState<Document | null>(null);
  const [editingDetail, setEditingDetail] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editDepartment, setEditDepartment] = useState('');

  // ── Toasts ──
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Confirmation dialog ──
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // ── Bulk update modal ──
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState('Published');

  // ── Active folder ──
  const [activeFolder, setActiveFolder] = useState('All Documents');

  // ── Simulate initial loading ──
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ── Toast helper ──
  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // ── Filtering ──
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All Types' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'All Statuses' || doc.status === statusFilter;
    const matchesDept = departmentFilter === 'All Departments' || doc.department === departmentFilter;
    return matchesSearch && matchesType && matchesStatus && matchesDept;
  });

  // ── Pagination computed values ──
  const totalItems = filteredDocuments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statusFilter, departmentFilter, pageSize]);

  // ── Selection helpers ──
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocs(newSelected);
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedDocuments.map(d => d.id);
    const allSelected = pageIds.every(id => selectedDocs.has(id));
    const newSelected = new Set(selectedDocs);
    if (allSelected) {
      pageIds.forEach(id => newSelected.delete(id));
    } else {
      pageIds.forEach(id => newSelected.add(id));
    }
    setSelectedDocs(newSelected);
  };

  const clearSelection = () => setSelectedDocs(new Set());

  const pageAllSelected = paginatedDocuments.length > 0 &&
    paginatedDocuments.every(d => selectedDocs.has(d.id));
  const pageSomeSelected = paginatedDocuments.some(d => selectedDocs.has(d.id)) && !pageAllSelected;

  // ── Detail panel ──
  const openDetail = (doc: Document) => {
    setDetailDoc(doc);
    setEditingDetail(false);
    setEditName(doc.name);
    setEditStatus(doc.status);
    setEditDepartment(doc.department);
  };

  const closeDetail = () => {
    setDetailDoc(null);
    setEditingDetail(false);
  };

  const startEditing = () => {
    if (detailDoc) {
      setEditName(detailDoc.name);
      setEditStatus(detailDoc.status);
      setEditDepartment(detailDoc.department);
      setEditingDetail(true);
    }
  };

  const saveEdit = () => {
    if (detailDoc) {
      setAllDocuments(prev => prev.map(d =>
        d.id === detailDoc.id
          ? { ...d, name: editName, status: editStatus, department: editDepartment }
          : d
      ));
      const updatedDoc = { ...detailDoc, name: editName, status: editStatus, department: editDepartment };
      setDetailDoc(updatedDoc);
      setEditingDetail(false);
      addToast(`"${editName}" updated successfully.`);
    }
  };

  // ── Delete single document ──
  const deleteSingleDoc = (doc: Document) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Document',
      message: `Are you sure you want to delete "${doc.name}"? This action cannot be undone.`,
      onConfirm: () => {
        setAllDocuments(prev => prev.filter(d => d.id !== doc.id));
        setSelectedDocs(prev => {
          const ns = new Set(prev);
          ns.delete(doc.id);
          return ns;
        });
        if (detailDoc?.id === doc.id) closeDetail();
        setConfirmDialog(prev => ({ ...prev, open: false }));
        addToast(`"${doc.name}" deleted successfully.`);
      },
    });
  };

  // ── Bulk delete ──
  const bulkDelete = () => {
    const count = selectedDocs.size;
    setConfirmDialog({
      open: true,
      title: 'Delete Selected Documents',
      message: `Are you sure you want to delete ${count} document(s)? This action cannot be undone.`,
      onConfirm: () => {
        setAllDocuments(prev => prev.filter(d => !selectedDocs.has(d.id)));
        if (detailDoc && selectedDocs.has(detailDoc.id)) closeDetail();
        setSelectedDocs(new Set());
        setConfirmDialog(prev => ({ ...prev, open: false }));
        addToast(`${count} document(s) deleted successfully.`);
      },
    });
  };

  // ── Bulk update status ──
  const openBulkUpdate = () => setBulkUpdateOpen(true);

  const applyBulkUpdate = () => {
    const count = selectedDocs.size;
    setAllDocuments(prev => prev.map(d =>
      selectedDocs.has(d.id) ? { ...d, status: bulkUpdateStatus } : d
    ));
    if (detailDoc && selectedDocs.has(detailDoc.id)) {
      setDetailDoc(prev => prev ? { ...prev, status: bulkUpdateStatus } : null);
    }
    setBulkUpdateOpen(false);
    setSelectedDocs(new Set());
    addToast(`${count} document(s) updated to "${bulkUpdateStatus}".`);
  };

  // ── CSV Export ──
  const exportCSV = () => {
    const docsToExport = selectedDocs.size > 0
      ? allDocuments.filter(d => selectedDocs.has(d.id))
      : filteredDocuments;
    const headers = ['ID', 'Name', 'Type', 'Size', 'Modified', 'Version', 'Owner', 'Status', 'Department'];
    const rows = docsToExport.map(d =>
      [d.id, `"${d.name}"`, d.type, d.size, d.modified, d.version, d.owner, d.status, d.department].join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `documents_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast(`Exported ${docsToExport.length} document(s) to CSV.`);
  };

  // ── PDF Export ──
  const exportPDF = () => {
    const docsToExport = selectedDocs.size > 0
      ? allDocuments.filter(d => selectedDocs.has(d.id))
      : filteredDocuments;

    const separator = '='.repeat(80);
    const thinSep = '-'.repeat(80);
    let content = '';
    content += separator + '\n';
    content += '  DOCUMENT REPOSITORY EXPORT\n';
    content += '  Generated: ' + new Date().toLocaleString() + '\n';
    content += '  Total Documents: ' + docsToExport.length + '\n';
    content += separator + '\n\n';

    docsToExport.forEach((doc, idx) => {
      content += `  Document ${idx + 1} of ${docsToExport.length}\n`;
      content += thinSep + '\n';
      content += `  Name:        ${doc.name}\n`;
      content += `  Type:        ${doc.type}\n`;
      content += `  Size:        ${doc.size}\n`;
      content += `  Modified:    ${doc.modified}\n`;
      content += `  Version:     ${doc.version}\n`;
      content += `  Owner:       ${doc.owner}\n`;
      content += `  Status:      ${doc.status}\n`;
      content += `  Department:  ${doc.department}\n`;
      content += '\n';
    });

    content += separator + '\n';
    content += '  End of Report\n';
    content += separator + '\n';

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `documents_export_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast(`Exported ${docsToExport.length} document(s) to PDF.`);
  };

  // ── Unique values for filter dropdowns ──
  const uniqueTypes = Array.from(new Set(allDocuments.map(d => d.type))).sort();
  const uniqueStatuses = Array.from(new Set(allDocuments.map(d => d.status))).sort();
  const uniqueDepartments = Array.from(new Set(allDocuments.map(d => d.department))).sort();

  // ── Pagination page numbers ──
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push('...');
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safeCurrentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // ── Folder items ──
  const folders = [
    { name: 'All Documents', icon: '\u{1F4C1}' },
    { name: 'My Documents', icon: '\u{1F4C1}' },
    { name: 'Shared', icon: '\u{1F4C1}' },
    { name: 'Recent', icon: '\u{1F554}' },
    { name: 'Favorites', icon: '\u2B50' },
    { name: 'Trash', icon: '\u{1F5D1}' },
  ];

  // ── Skeleton row ──
  const skeletonRow = (key: number) => (
    <tr key={`skel-${key}`} style={{ borderBottom: '1px solid #eee' }}>
      <td style={{ padding: '0.75rem 1rem' }}>
        <div style={{
          width: 16, height: 16, borderRadius: 3,
          background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
          backgroundSize: '400px 100%',
          animation: 'shimmer 1.5s infinite linear',
        }} />
      </td>
      {[180, 60, 60, 90, 50, 70, 80, 80].map((w, i) => (
        <td key={i} style={{ padding: '0.75rem 1rem' }}>
          <div style={{
            width: w, height: 14, borderRadius: 4,
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '400px 100%',
            animation: 'shimmer 1.5s infinite linear',
          }} />
        </td>
      ))}
    </tr>
  );

  // ─────────────────────────────── Render ────────────────────────────────────

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', backgroundColor: '#F7FAFC' }}>
      <ShimmerStyle />

      {/* ── Toast notifications ── */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 10000, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: 8,
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: 280,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: toast.type === 'success' ? '#38A169' : toast.type === 'error' ? '#E53E3E' : '#3182CE',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 12, fontSize: '1.1rem', lineHeight: 1 }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      {/* ── Confirm dialog ── */}
      {confirmDialog.open && (
        <>
          <div
            onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: 'white', borderRadius: 12, padding: '2rem',
                maxWidth: 440, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', color: '#1A202C' }}>
                {confirmDialog.title}
              </h3>
              <p style={{ margin: '0 0 1.5rem', color: '#4A5568', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {confirmDialog.message}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
                  style={{
                    padding: '0.5rem 1.25rem', backgroundColor: '#E2E8F0', color: '#4A5568',
                    border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  style={{
                    padding: '0.5rem 1.25rem', backgroundColor: '#E53E3E', color: 'white',
                    border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Bulk update modal ── */}
      {bulkUpdateOpen && (
        <div
          onClick={() => setBulkUpdateOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white', borderRadius: 12, padding: '2rem',
              maxWidth: 400, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', color: '#1A202C' }}>
              Update {selectedDocs.size} Document(s)
            </h3>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#4A5568', fontWeight: 500 }}>
              New Status
            </label>
            <select
              value={bulkUpdateStatus}
              onChange={e => setBulkUpdateStatus(e.target.value)}
              style={{
                width: '100%', padding: '0.5rem', border: '1px solid #CBD5E0',
                borderRadius: 6, fontSize: '0.875rem', marginBottom: '1.5rem',
              }}
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Approved">Approved</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setBulkUpdateOpen(false)}
                style={{
                  padding: '0.5rem 1.25rem', backgroundColor: '#E2E8F0', color: '#4A5568',
                  border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={applyBulkUpdate}
                style={{
                  padding: '0.5rem 1.25rem', backgroundColor: '#3182CE', color: 'white',
                  border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                }}
              >
                Apply Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail slide-in panel ── */}
      {detailDoc && (
        <>
          <div
            onClick={closeDetail}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)',
              zIndex: 8000,
            }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 450,
            backgroundColor: 'white', zIndex: 8001, boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column', overflow: 'auto',
          }}>
            {/* Panel header */}
            <div style={{
              padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1A202C' }}>Document Details</h3>
              <button
                onClick={closeDetail}
                style={{
                  background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer',
                  color: '#718096', lineHeight: 1, padding: '0.25rem',
                }}
              >
                X
              </button>
            </div>

            {/* Panel body */}
            <div style={{ padding: '1.5rem', flex: 1 }}>
              {!editingDetail ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '3rem' }}>{getFileIcon(detailDoc.type)}</span>
                    <h4 style={{ margin: '0.75rem 0 0.25rem', fontSize: '1.1rem', color: '#1A202C', wordBreak: 'break-word' }}>
                      {detailDoc.name}
                    </h4>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 12,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: getStatusColor(detailDoc.status).bg,
                      color: getStatusColor(detailDoc.status).text,
                    }}>
                      {detailDoc.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                      { label: 'Type', value: detailDoc.type },
                      { label: 'Size', value: detailDoc.size },
                      { label: 'Modified', value: detailDoc.modified },
                      { label: 'Version', value: detailDoc.version },
                      { label: 'Owner', value: detailDoc.owner },
                      { label: 'Department', value: detailDoc.department },
                    ].map(item => (
                      <div key={item.label} style={{
                        backgroundColor: '#F7FAFC', borderRadius: 8, padding: '0.75rem',
                      }}>
                        <div style={{ fontSize: '0.7rem', color: '#A0AEC0', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#2D3748', fontWeight: 500 }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* ── Inline edit form ── */
                <div>
                  <h4 style={{ margin: '0 0 1rem', color: '#1A202C' }}>Edit Document</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A5568', marginBottom: '0.3rem' }}>Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{
                        width: '100%', padding: '0.5rem', border: '1px solid #CBD5E0',
                        borderRadius: 6, fontSize: '0.9rem', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A5568', marginBottom: '0.3rem' }}>Status</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      style={{
                        width: '100%', padding: '0.5rem', border: '1px solid #CBD5E0',
                        borderRadius: 6, fontSize: '0.9rem', boxSizing: 'border-box',
                      }}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A5568', marginBottom: '0.3rem' }}>Department</label>
                    <select
                      value={editDepartment}
                      onChange={e => setEditDepartment(e.target.value)}
                      style={{
                        width: '100%', padding: '0.5rem', border: '1px solid #CBD5E0',
                        borderRadius: 6, fontSize: '0.9rem', boxSizing: 'border-box',
                      }}
                    >
                      {uniqueDepartments.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={saveEdit}
                      style={{
                        flex: 1, padding: '0.5rem', backgroundColor: '#3182CE', color: 'white',
                        border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingDetail(false)}
                      style={{
                        flex: 1, padding: '0.5rem', backgroundColor: '#E2E8F0', color: '#4A5568',
                        border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Panel footer with actions */}
            {!editingDetail && (
              <div style={{
                padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0',
                display: 'flex', gap: '0.75rem',
              }}>
                <button
                  onClick={startEditing}
                  style={{
                    flex: 1, padding: '0.6rem', backgroundColor: '#3182CE', color: 'white',
                    border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSingleDoc(detailDoc)}
                  style={{
                    flex: 1, padding: '0.6rem', backgroundColor: '#E53E3E', color: 'white',
                    border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ────────────────────── Main Layout ────────────────────── */}
      <div style={{ padding: '1.5rem 2rem', maxWidth: 1500, margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0052CC', margin: 0 }}>
              Document Repository
            </h1>
            <nav style={{ marginTop: '0.4rem' }}>
              <a href="/" style={{ color: '#0052CC', textDecoration: 'none', fontSize: '0.85rem' }}>
                &larr; Back to Dashboard
              </a>
            </nav>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={{
              padding: '0.5rem 1.25rem', backgroundColor: '#00875A', color: 'white',
              border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
            }}>
              + Upload
            </button>
            <button style={{
              padding: '0.5rem 1.25rem', backgroundColor: '#FF5630', color: 'white',
              border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
            }}>
              + New Folder
            </button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {/* ── Sidebar ── */}
          <aside style={{
            width: 230, flexShrink: 0, backgroundColor: 'white',
            borderRadius: 10, padding: '1rem', border: '1px solid #E2E8F0',
            alignSelf: 'flex-start',
          }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Folders
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {folders.map(folder => (
                <li
                  key={folder.name}
                  onClick={() => setActiveFolder(folder.name)}
                  style={{
                    padding: '0.55rem 0.75rem',
                    cursor: 'pointer',
                    borderRadius: 6,
                    marginBottom: 2,
                    fontSize: '0.875rem',
                    fontWeight: activeFolder === folder.name ? 600 : 400,
                    backgroundColor: activeFolder === folder.name ? '#EBF4FF' : 'transparent',
                    color: activeFolder === folder.name ? '#2B6CB0' : '#4A5568',
                    transition: 'background-color 0.15s',
                  }}
                >
                  {folder.icon} {folder.name}
                </li>
              ))}
            </ul>
          </aside>

          {/* ── Main content ── */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Search / filter bar */}
            <div style={{
              display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap',
            }}>
              <input
                type="text"
                placeholder="Search by name, owner, or department..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: '1 1 250px', padding: '0.5rem 0.75rem', border: '1px solid #CBD5E0',
                  borderRadius: 6, fontSize: '0.875rem', outline: 'none',
                }}
              />
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem', border: '1px solid #CBD5E0',
                  borderRadius: 6, fontSize: '0.875rem', backgroundColor: 'white',
                }}
              >
                <option>All Types</option>
                {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem', border: '1px solid #CBD5E0',
                  borderRadius: 6, fontSize: '0.875rem', backgroundColor: 'white',
                }}
              >
                <option>All Statuses</option>
                {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem', border: '1px solid #CBD5E0',
                  borderRadius: 6, fontSize: '0.875rem', backgroundColor: 'white',
                }}
              >
                <option>All Departments</option>
                {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Document table */}
            <div style={{
              backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: 10,
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F7FAFC', borderBottom: '2px solid #E2E8F0' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: 40 }}>
                      <input
                        type="checkbox"
                        checked={pageAllSelected}
                        ref={el => { if (el) el.indeterminate = pageSomeSelected; }}
                        onChange={toggleSelectAll}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modified</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Version</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: pageSize }, (_, i) => skeletonRow(i))
                  ) : paginatedDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#A0AEC0' }}>
                        No documents found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedDocuments.map(doc => {
                      const sc = getStatusColor(doc.status);
                      return (
                        <tr
                          key={doc.id}
                          onClick={() => openDetail(doc)}
                          style={{
                            borderBottom: '1px solid #EDF2F7',
                            cursor: 'pointer',
                            backgroundColor: selectedDocs.has(doc.id) ? '#EBF8FF' : 'transparent',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={e => {
                            if (!selectedDocs.has(doc.id)) (e.currentTarget as HTMLElement).style.backgroundColor = '#F7FAFC';
                          }}
                          onMouseLeave={e => {
                            if (!selectedDocs.has(doc.id)) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }}
                        >
                          <td style={{ padding: '0.75rem 1rem' }} onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedDocs.has(doc.id)}
                              onChange={() => toggleSelect(doc.id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#2B6CB0', fontWeight: 500, fontSize: '0.875rem' }}>
                            {getFileIcon(doc.type)} {doc.name}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#4A5568' }}>{doc.type}</td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#4A5568' }}>{doc.size}</td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#4A5568' }}>{doc.modified}</td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#4A5568' }}>{doc.version}</td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#4A5568' }}>{doc.owner}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.15rem 0.5rem',
                              borderRadius: 10,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: sc.bg,
                              color: sc.text,
                            }}>
                              {doc.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#4A5568' }}>{doc.department}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {!loading && (
              <div style={{
                marginTop: '1rem', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem',
              }}>
                <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                  Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} items
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#718096', marginRight: '0.25rem' }}>Page size:</span>
                  <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    style={{
                      padding: '0.3rem 0.5rem', border: '1px solid #CBD5E0',
                      borderRadius: 4, fontSize: '0.85rem', backgroundColor: 'white',
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {/* First */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={safeCurrentPage === 1}
                    style={{
                      padding: '0.35rem 0.6rem', border: '1px solid #CBD5E0', borderRadius: 4,
                      backgroundColor: safeCurrentPage === 1 ? '#EDF2F7' : 'white', cursor: safeCurrentPage === 1 ? 'default' : 'pointer',
                      color: safeCurrentPage === 1 ? '#A0AEC0' : '#4A5568', fontSize: '0.8rem',
                    }}
                  >
                    First
                  </button>
                  {/* Prev */}
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={safeCurrentPage === 1}
                    style={{
                      padding: '0.35rem 0.6rem', border: '1px solid #CBD5E0', borderRadius: 4,
                      backgroundColor: safeCurrentPage === 1 ? '#EDF2F7' : 'white', cursor: safeCurrentPage === 1 ? 'default' : 'pointer',
                      color: safeCurrentPage === 1 ? '#A0AEC0' : '#4A5568', fontSize: '0.8rem',
                    }}
                  >
                    Prev
                  </button>
                  {/* Page numbers */}
                  {getPageNumbers().map((pg, idx) =>
                    typeof pg === 'string' ? (
                      <span key={`ellipsis-${idx}`} style={{ padding: '0.35rem 0.3rem', color: '#A0AEC0', fontSize: '0.8rem' }}>...</span>
                    ) : (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        style={{
                          padding: '0.35rem 0.65rem', border: '1px solid',
                          borderColor: pg === safeCurrentPage ? '#3182CE' : '#CBD5E0',
                          borderRadius: 4,
                          backgroundColor: pg === safeCurrentPage ? '#3182CE' : 'white',
                          color: pg === safeCurrentPage ? 'white' : '#4A5568',
                          cursor: 'pointer', fontWeight: pg === safeCurrentPage ? 600 : 400,
                          fontSize: '0.8rem',
                        }}
                      >
                        {pg}
                      </button>
                    )
                  )}
                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage === totalPages}
                    style={{
                      padding: '0.35rem 0.6rem', border: '1px solid #CBD5E0', borderRadius: 4,
                      backgroundColor: safeCurrentPage === totalPages ? '#EDF2F7' : 'white',
                      cursor: safeCurrentPage === totalPages ? 'default' : 'pointer',
                      color: safeCurrentPage === totalPages ? '#A0AEC0' : '#4A5568', fontSize: '0.8rem',
                    }}
                  >
                    Next
                  </button>
                  {/* Last */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safeCurrentPage === totalPages}
                    style={{
                      padding: '0.35rem 0.6rem', border: '1px solid #CBD5E0', borderRadius: 4,
                      backgroundColor: safeCurrentPage === totalPages ? '#EDF2F7' : 'white',
                      cursor: safeCurrentPage === totalPages ? 'default' : 'pointer',
                      color: safeCurrentPage === totalPages ? '#A0AEC0' : '#4A5568', fontSize: '0.8rem',
                    }}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Bulk operations toolbar ── */}
      {selectedDocs.size > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: '#1A202C', color: 'white', zIndex: 7000,
          padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {selectedDocs.size} item{selectedDocs.size > 1 ? 's' : ''} selected
          </span>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={bulkDelete}
              style={{
                padding: '0.45rem 1rem', backgroundColor: '#E53E3E', color: 'white',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem',
              }}
            >
              Delete Selected
            </button>
            <button
              onClick={openBulkUpdate}
              style={{
                padding: '0.45rem 1rem', backgroundColor: '#3182CE', color: 'white',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem',
              }}
            >
              Update Selected
            </button>
            <button
              onClick={exportCSV}
              style={{
                padding: '0.45rem 1rem', backgroundColor: '#38A169', color: 'white',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem',
              }}
            >
              Export CSV
            </button>
            <button
              onClick={exportPDF}
              style={{
                padding: '0.45rem 1rem', backgroundColor: '#DD6B20', color: 'white',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem',
              }}
            >
              Export PDF
            </button>
            <button
              onClick={clearSelection}
              style={{
                padding: '0.45rem 1rem', backgroundColor: '#4A5568', color: 'white',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem',
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Default export wrapped in ErrorBoundary ─────────────────────────────────

export default function RepositoryPage() {
  return (
    <ErrorBoundary>
      <RepositoryPageContent />
    </ErrorBoundary>
  );
}
