'use client';

import { useState, useRef, useEffect } from 'react';

interface WorkflowNode {
  id: string;
  type: 'start' | 'task' | 'review' | 'approve' | 'notify' | 'condition' | 'parallel' | 'end';
  label: string;
  x: number;
  y: number;
  properties?: any;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export default function WorkflowBuilderPage() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: 'start', type: 'start', label: 'Start', x: 100, y: 200 }
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const nodeTemplates = [
    // Document Intake & Processing
    { type: 'upload', label: 'Upload Document', icon: '📤', color: '#0052CC' },
    { type: 'scan', label: 'Scan Document', icon: '📄', color: '#6554C0' },
    { type: 'ocr', label: 'OCR Processing', icon: '🔍', color: '#00875A' },
    { type: 'classify', label: 'Auto-Classify', icon: '🏷️', color: '#FF5630' },
    { type: 'metadata', label: 'Extract Metadata', icon: '📊', color: '#FFAB00' },
    
    // Review & Approval
    { type: 'review', label: 'Document Review', icon: '👁️', color: '#0052CC' },
    { type: 'approve', label: 'Approve', icon: '✅', color: '#00875A' },
    { type: 'reject', label: 'Reject', icon: '❌', color: '#DE350B' },
    { type: 'revise', label: 'Request Revision', icon: '📝', color: '#FF8B00' },
    { type: 'sign', label: 'Digital Signature', icon: '✍️', color: '#6554C0' },
    
    // Transformation
    { type: 'convert', label: 'Convert Format', icon: '🔄', color: '#00875A' },
    { type: 'merge', label: 'Merge Documents', icon: '🔗', color: '#0052CC' },
    { type: 'split', label: 'Split Document', icon: '✂️', color: '#FF5630' },
    { type: 'watermark', label: 'Add Watermark', icon: '💧', color: '#6554C0' },
    { type: 'redact', label: 'Redact Content', icon: '⬛', color: '#DE350B' },
    
    // Distribution
    { type: 'email', label: 'Email Document', icon: '✉️', color: '#00875A' },
    { type: 'notify', label: 'Send Notification', icon: '🔔', color: '#FFAB00' },
    { type: 'publish', label: 'Publish', icon: '🌐', color: '#0052CC' },
    { type: 'archive', label: 'Archive', icon: '📦', color: '#6554C0' },
    { type: 'retention', label: 'Apply Retention', icon: '⏳', color: '#FF8B00' },
    
    // Department Tasks
    { type: 'hr', label: 'HR Task', icon: '👥', color: '#00875A' },
    { type: 'it', label: 'IT Task', icon: '💻', color: '#0052CC' },
    { type: 'finance', label: 'Finance Task', icon: '💰', color: '#FFAB00' },
    { type: 'legal', label: 'Legal Review', icon: '⚖️', color: '#6554C0' },
    { type: 'manager', label: 'Manager Task', icon: '👔', color: '#FF5630' },
    
    // Workflow Control
    { type: 'task', label: 'User Task', icon: '👤', color: '#0052CC' },
    { type: 'service', label: 'Service Task', icon: '⚙️', color: '#6554C0' },
    { type: 'condition', label: 'Decision', icon: '❓', color: '#FFAB00' },
    { type: 'parallel', label: 'Parallel Gateway', icon: '⚡', color: '#FF5630' },
    { type: 'timer', label: 'Timer', icon: '⏰', color: '#FF8B00' },
    { type: 'escalate', label: 'Escalation', icon: '🚨', color: '#DE350B' },
    { type: 'end', label: 'End', icon: '🏁', color: '#172B4D' }
  ];

  const workflowTemplates = [
    { 
      name: 'Document Intake & Processing', 
      description: 'Upload → OCR → Classify → Metadata → Archive',
      nodes: [
        { id: 'start', type: 'start', label: 'Start', x: 50, y: 200 },
        { id: 'upload', type: 'upload', label: 'Upload Document', x: 180, y: 200 },
        { id: 'ocr', type: 'ocr', label: 'OCR Processing', x: 340, y: 200 },
        { id: 'classify', type: 'classify', label: 'Auto-Classify', x: 500, y: 200 },
        { id: 'metadata', type: 'metadata', label: 'Extract Metadata', x: 660, y: 200 },
        { id: 'archive', type: 'archive', label: 'Archive Document', x: 840, y: 200 },
        { id: 'end', type: 'end', label: 'End', x: 1000, y: 200 }
      ],
      connections: [
        { id: 'c1', from: 'start', to: 'upload' },
        { id: 'c2', from: 'upload', to: 'ocr' },
        { id: 'c3', from: 'ocr', to: 'classify' },
        { id: 'c4', from: 'classify', to: 'metadata' },
        { id: 'c5', from: 'metadata', to: 'archive' },
        { id: 'c6', from: 'archive', to: 'end' }
      ]
    },
    { 
      name: 'Document Review & Approval', 
      description: 'Upload → Review → Decision → Approve/Reject → Notify',
      nodes: [
        { id: 'start', type: 'start', label: 'Start', x: 50, y: 200 },
        { id: 'upload', type: 'upload', label: 'Upload Document', x: 180, y: 200 },
        { id: 'review', type: 'review', label: 'Document Review', x: 340, y: 200 },
        { id: 'decision', type: 'condition', label: 'Decision', x: 500, y: 200 },
        { id: 'approve', type: 'approve', label: 'Approve', x: 660, y: 150 },
        { id: 'reject', type: 'reject', label: 'Reject', x: 660, y: 250 },
        { id: 'notify', type: 'notify', label: 'Send Notification', x: 820, y: 200 },
        { id: 'end', type: 'end', label: 'End', x: 980, y: 200 }
      ],
      connections: [
        { id: 'c1', from: 'start', to: 'upload' },
        { id: 'c2', from: 'upload', to: 'review' },
        { id: 'c3', from: 'review', to: 'decision' },
        { id: 'c4', from: 'decision', to: 'approve', label: 'Approved' },
        { id: 'c5', from: 'decision', to: 'reject', label: 'Rejected' },
        { id: 'c6', from: 'approve', to: 'notify' },
        { id: 'c7', from: 'reject', to: 'notify' },
        { id: 'c8', from: 'notify', to: 'end' }
      ]
    },
    { 
      name: 'Contract Management', 
      description: 'Upload → Legal → Finance → Sign → Archive',
      nodes: [
        { id: 'start', type: 'start', label: 'Start', x: 50, y: 200 },
        { id: 'upload', type: 'upload', label: 'Upload Contract', x: 180, y: 200 },
        { id: 'legal', type: 'legal', label: 'Legal Review', x: 340, y: 200 },
        { id: 'finance', type: 'finance', label: 'Finance Review', x: 500, y: 200 },
        { id: 'sign', type: 'sign', label: 'Digital Signature', x: 660, y: 200 },
        { id: 'watermark', type: 'watermark', label: 'Add Watermark', x: 820, y: 200 },
        { id: 'archive', type: 'archive', label: 'Archive Contract', x: 980, y: 200 },
        { id: 'end', type: 'end', label: 'End', x: 1140, y: 200 }
      ],
      connections: [
        { id: 'c1', from: 'start', to: 'upload' },
        { id: 'c2', from: 'upload', to: 'legal' },
        { id: 'c3', from: 'legal', to: 'finance' },
        { id: 'c4', from: 'finance', to: 'sign' },
        { id: 'c5', from: 'sign', to: 'watermark' },
        { id: 'c6', from: 'watermark', to: 'archive' },
        { id: 'c7', from: 'archive', to: 'end' }
      ]
    },
    { 
      name: 'Invoice Processing', 
      description: 'Scan → OCR → Extract → Validate → Approve → Archive',
      nodes: [
        { id: 'start', type: 'start', label: 'Start', x: 50, y: 200 },
        { id: 'scan', type: 'scan', label: 'Scan Invoice', x: 180, y: 200 },
        { id: 'ocr', type: 'ocr', label: 'OCR Processing', x: 320, y: 200 },
        { id: 'metadata', type: 'metadata', label: 'Extract Data', x: 460, y: 200 },
        { id: 'validate', type: 'task', label: 'Validate Details', x: 600, y: 200 },
        { id: 'approve', type: 'finance', label: 'Finance Approval', x: 760, y: 200 },
        { id: 'archive', type: 'archive', label: 'Archive Invoice', x: 920, y: 200 },
        { id: 'end', type: 'end', label: 'End', x: 1080, y: 200 }
      ],
      connections: [
        { id: 'c1', from: 'start', to: 'scan' },
        { id: 'c2', from: 'scan', to: 'ocr' },
        { id: 'c3', from: 'ocr', to: 'metadata' },
        { id: 'c4', from: 'metadata', to: 'validate' },
        { id: 'c5', from: 'validate', to: 'approve' },
        { id: 'c6', from: 'approve', to: 'archive' },
        { id: 'c7', from: 'archive', to: 'end' }
      ]
    },
    { 
      name: 'Employee Onboarding', 
      description: 'HR → IT Setup → Manager → Complete',
      nodes: [
        { id: 'start', type: 'start', label: 'Start', x: 50, y: 200 },
        { id: 'upload', type: 'upload', label: 'Upload Documents', x: 180, y: 200 },
        { id: 'hr', type: 'hr', label: 'HR Processing', x: 340, y: 200 },
        { id: 'parallel', type: 'parallel', label: 'Parallel Setup', x: 500, y: 200 },
        { id: 'it', type: 'it', label: 'IT Setup', x: 660, y: 120 },
        { id: 'access', type: 'task', label: 'Access Cards', x: 660, y: 200 },
        { id: 'desk', type: 'task', label: 'Desk Assignment', x: 660, y: 280 },
        { id: 'manager', type: 'manager', label: 'Manager Meeting', x: 820, y: 200 },
        { id: 'archive', type: 'archive', label: 'Archive Forms', x: 980, y: 200 },
        { id: 'end', type: 'end', label: 'Complete', x: 1140, y: 200 }
      ],
      connections: [
        { id: 'c1', from: 'start', to: 'upload' },
        { id: 'c2', from: 'upload', to: 'hr' },
        { id: 'c3', from: 'hr', to: 'parallel' },
        { id: 'c4', from: 'parallel', to: 'it' },
        { id: 'c5', from: 'parallel', to: 'access' },
        { id: 'c6', from: 'parallel', to: 'desk' },
        { id: 'c7', from: 'it', to: 'manager' },
        { id: 'c8', from: 'access', to: 'manager' },
        { id: 'c9', from: 'desk', to: 'manager' },
        { id: 'c10', from: 'manager', to: 'archive' },
        { id: 'c11', from: 'archive', to: 'end' }
      ]
    },
    { 
      name: 'Compliance Document Processing', 
      description: 'Upload → Classify → Redact → Review → Retention',
      nodes: [
        { id: 'start', type: 'start', label: 'Start', x: 50, y: 200 },
        { id: 'upload', type: 'upload', label: 'Upload Document', x: 180, y: 200 },
        { id: 'classify', type: 'classify', label: 'Auto-Classify', x: 340, y: 200 },
        { id: 'decision', type: 'condition', label: 'Contains PII?', x: 500, y: 200 },
        { id: 'redact', type: 'redact', label: 'Redact PII', x: 660, y: 120 },
        { id: 'review', type: 'legal', label: 'Legal Review', x: 820, y: 200 },
        { id: 'retention', type: 'retention', label: 'Apply Retention', x: 980, y: 200 },
        { id: 'archive', type: 'archive', label: 'Archive', x: 1140, y: 200 },
        { id: 'end', type: 'end', label: 'End', x: 1280, y: 200 }
      ],
      connections: [
        { id: 'c1', from: 'start', to: 'upload' },
        { id: 'c2', from: 'upload', to: 'classify' },
        { id: 'c3', from: 'classify', to: 'decision' },
        { id: 'c4', from: 'decision', to: 'redact', label: 'Yes' },
        { id: 'c5', from: 'decision', to: 'review', label: 'No' },
        { id: 'c6', from: 'redact', to: 'review' },
        { id: 'c7', from: 'review', to: 'retention' },
        { id: 'c8', from: 'retention', to: 'archive' },
        { id: 'c9', from: 'archive', to: 'end' }
      ]
    }
  ];

  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      });
      setDragging(nodeId);
      setSelectedNode(nodeId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      
      setNodes(prev => prev.map(node => 
        node.id === dragging ? { ...node, x: newX, y: newY } : node
      ));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const addNode = (type: string, label: string) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: type as any,
      label: label,
      x: 300 + Math.random() * 200,
      y: 150 + Math.random() * 200
    };
    setNodes([...nodes, newNode]);
  };

  const startConnection = (nodeId: string) => {
    setConnecting(nodeId);
  };

  const completeConnection = (toNodeId: string) => {
    if (connecting && connecting !== toNodeId) {
      const newConnection: Connection = {
        id: `conn_${Date.now()}`,
        from: connecting,
        to: toNodeId
      };
      setConnections([...connections, newConnection]);
    }
    setConnecting(null);
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId !== 'start') {
      setNodes(nodes.filter(n => n.id !== nodeId));
      setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
      setSelectedNode(null);
    }
  };

  // Handle ESC key to cancel connection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConnecting(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getNodeColor = (type: string) => {
    const template = nodeTemplates.find(t => t.type === type);
    return template?.color || '#666';
  };

  const getNodeIcon = (type: string) => {
    if (type === 'start') return '▶️';
    const template = nodeTemplates.find(t => t.type === type);
    return template?.icon || '📋';
  };

  const renderConnection = (conn: Connection) => {
    const fromNode = nodes.find(n => n.id === conn.from);
    const toNode = nodes.find(n => n.id === conn.to);
    if (!fromNode || !toNode) return null;

    const x1 = fromNode.x + 60;
    const y1 = fromNode.y + 30;
    const x2 = toNode.x + 60;
    const y2 = toNode.y + 30;
    
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return (
      <g key={conn.id}>
        <path
          d={`M ${x1} ${y1} Q ${midX} ${y1} ${midX} ${midY} T ${x2} ${y2}`}
          stroke="#666"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        {conn.label && (
          <text
            x={midX}
            y={midY}
            fill="#666"
            fontSize="12"
            textAnchor="middle"
            style={{ backgroundColor: 'white', padding: '2px' }}>
            {conn.label}
          </text>
        )}
      </g>
    );
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem 2rem', backgroundColor: '#fff', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0052CC', margin: 0 }}>Workflow Designer</h1>
          <nav>
            <a href="/workflow" style={{ color: '#0052CC', textDecoration: 'none' }}>← Back to Workflows</a>
          </nav>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => alert('Workflow saved!')}
            style={{ padding: '0.5rem 1.5rem', backgroundColor: '#00875A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            💾 Save
          </button>
          <button 
            onClick={() => alert('Deploying workflow...')}
            style={{ padding: '0.5rem 1.5rem', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            🚀 Deploy
          </button>
          <button 
            onClick={() => alert('Testing workflow...')}
            style={{ padding: '0.5rem 1.5rem', backgroundColor: '#6554C0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ▶️ Test
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{ width: '280px', backgroundColor: '#f5f5f5', padding: '1rem', overflowY: 'auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#333' }}>📦 Workflow Templates</h3>
            {workflowTemplates.map(template => (
              <div 
                key={template.name}
                onClick={() => {
                  setNodes(template.nodes as WorkflowNode[]);
                  setConnections(template.connections as Connection[]);
                  setSelectedNode(null);
                }}
                style={{ padding: '0.75rem', marginBottom: '0.5rem', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer', border: '1px solid #ddd' }}>
                <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{template.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>{template.description}</div>
              </div>
            ))}
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#333' }}>🔧 Workflow Nodes</h3>
            {nodeTemplates.map(template => (
              <div 
                key={template.type}
                draggable
                onDragEnd={() => addNode(template.type, template.label)}
                style={{ 
                  padding: '0.75rem', 
                  marginBottom: '0.5rem', 
                  backgroundColor: 'white', 
                  borderRadius: '4px', 
                  cursor: 'move', 
                  border: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                <span style={{ fontSize: '1.2rem' }}>{template.icon}</span>
                <span style={{ fontWeight: '500' }}>{template.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <main style={{ flex: 1, position: 'relative', backgroundColor: '#fafafa' }}>
          {connecting && (
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#00875A',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              zIndex: 2000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              ✨ Click on another node to connect, or press ESC to cancel
            </div>
          )}
          
          <div 
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative',
              backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}>
            
            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#666" />
                </marker>
              </defs>
              {connections.map(renderConnection)}
            </svg>

            {nodes.map(node => (
              <div
                key={node.id}
                onMouseDown={(e) => {
                  // Only start dragging if not in connecting mode
                  if (!connecting) {
                    handleNodeDragStart(node.id, e);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node.id);
                  // If we're in connecting mode and click a different node, complete the connection
                  if (connecting && connecting !== node.id) {
                    completeConnection(node.id);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  width: '120px',
                  padding: '0.5rem',
                  backgroundColor: 'white',
                  border: `2px solid ${
                    connecting === node.id ? '#00875A' : 
                    connecting && connecting !== node.id ? '#FF5630' :
                    selectedNode === node.id ? getNodeColor(node.type) : '#ddd'
                  }`,
                  borderRadius: node.type === 'condition' ? '0' : '8px',
                  transform: node.type === 'condition' ? 'rotate(45deg)' : 'none',
                  cursor: connecting ? 'pointer' : (dragging === node.id ? 'grabbing' : 'grab'),
                  boxShadow: connecting === node.id ? '0 0 8px rgba(0, 135, 90, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
                  userSelect: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transform: node.type === 'condition' ? 'rotate(-45deg)' : 'none'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{getNodeIcon(node.type)}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{node.label}</span>
                </div>
                
                {node.id !== 'start' && (
                  <button
                    onClick={() => deleteNode(node.id)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#FF5630',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      display: selectedNode === node.id ? 'block' : 'none'
                    }}>
                    ✕
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (connecting === node.id) {
                      // Cancel connection if clicking same node's button again
                      setConnecting(null);
                    } else if (connecting) {
                      // Complete connection to this node
                      completeConnection(node.id);
                    } else {
                      // Start new connection from this node
                      startConnection(node.id);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '-8px',
                    right: '50%',
                    transform: 'translateX(50%)',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: connecting === node.id ? '#00875A' : 
                                   connecting && connecting !== node.id ? '#FF5630' : '#0052CC',
                    border: '2px solid white',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  title={connecting === node.id ? 'Click to cancel' : 
                        connecting ? 'Click to connect here' : 'Start connection'}
                />
              </div>
            ))}
          </div>

          {selectedNode && (
            <div style={{
              position: 'absolute',
              right: '1rem',
              top: '1rem',
              width: '300px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Node Properties</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#666' }}>Label</label>
                <input 
                  type="text" 
                  value={nodes.find(n => n.id === selectedNode)?.label || ''}
                  onChange={(e) => {
                    setNodes(nodes.map(n => n.id === selectedNode ? {...n, label: e.target.value} : n));
                  }}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#666' }}>Assignee</label>
                <select style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option>Auto-assign</option>
                  <option>Specific User</option>
                  <option>Role-based</option>
                  <option>Group</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#666' }}>Due Date</label>
                <input 
                  type="text" 
                  placeholder="e.g., 3 days"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}