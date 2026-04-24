import { Router, Request, Response } from 'express';
import { sanitizeInput } from '../middleware/validation.middleware';
import { parsePaginationParams, createPaginatedResponse } from '../utils/pagination';
import { logger } from '../utils/logger';

const router = Router();

const roles = [
  { id: '1', name: 'ROLE_ADMIN', displayName: 'Administrator', description: 'Full system access', isSystem: true, userCount: 2, createdAt: '2022-01-01T00:00:00Z' },
  { id: '2', name: 'ROLE_MANAGER', displayName: 'Manager', description: 'Department management', isSystem: true, userCount: 3, createdAt: '2022-01-01T00:00:00Z' },
  { id: '3', name: 'ROLE_USER', displayName: 'Standard User', description: 'Basic access', isSystem: true, userCount: 12, createdAt: '2022-01-01T00:00:00Z' },
  { id: '4', name: 'ROLE_VIEWER', displayName: 'Viewer', description: 'Read-only access', isSystem: true, userCount: 3, createdAt: '2022-01-01T00:00:00Z' },
  { id: '5', name: 'ROLE_CONTRIBUTOR', displayName: 'Contributor', description: 'Create and edit own documents', isSystem: false, userCount: 5, createdAt: '2022-06-01T00:00:00Z' },
  { id: '6', name: 'ROLE_EDITOR', displayName: 'Editor', description: 'Edit any document in assigned areas', isSystem: false, userCount: 4, createdAt: '2022-06-01T00:00:00Z' },
  { id: '7', name: 'ROLE_REVIEWER', displayName: 'Reviewer', description: 'Review and approve documents', isSystem: false, userCount: 6, createdAt: '2023-01-01T00:00:00Z' },
  { id: '8', name: 'ROLE_RECORDS_MANAGER', displayName: 'Records Manager', description: 'Records lifecycle management', isSystem: false, userCount: 2, createdAt: '2023-01-01T00:00:00Z' },
  { id: '9', name: 'ROLE_SITE_ADMIN', displayName: 'Site Administrator', description: 'Manage team sites', isSystem: false, userCount: 3, createdAt: '2023-02-01T00:00:00Z' },
  { id: '10', name: 'ROLE_WORKFLOW_ADMIN', displayName: 'Workflow Administrator', description: 'Manage workflows', isSystem: false, userCount: 2, createdAt: '2023-02-01T00:00:00Z' },
  { id: '11', name: 'ROLE_AUDITOR', displayName: 'Auditor', description: 'Read-only audit access', isSystem: false, userCount: 2, createdAt: '2023-04-01T00:00:00Z' },
  { id: '12', name: 'ROLE_EXTERNAL', displayName: 'External User', description: 'Limited external access', isSystem: false, userCount: 3, createdAt: '2023-06-01T00:00:00Z' },
  { id: '13', name: 'ROLE_API_USER', displayName: 'API User', description: 'Service account for APIs', isSystem: false, userCount: 1, createdAt: '2023-06-01T00:00:00Z' },
  { id: '14', name: 'ROLE_COMPLIANCE', displayName: 'Compliance Officer', description: 'Compliance monitoring', isSystem: false, userCount: 2, createdAt: '2023-08-01T00:00:00Z' },
  { id: '15', name: 'ROLE_POWER_USER', displayName: 'Power User', description: 'Advanced features and bulk ops', isSystem: false, userCount: 4, createdAt: '2023-09-01T00:00:00Z' },
];

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit, offset } = parsePaginationParams(req.query);
    const search = (req.query.search as string) || '';
    let filtered = roles;
    if (search) {
      const s = search.toLowerCase();
      filtered = roles.filter(r => r.displayName.toLowerCase().includes(s) || r.name.toLowerCase().includes(s));
    }
    const paginated = filtered.slice(offset, offset + limit);
    res.json(createPaginatedResponse(paginated, filtered.length, page, limit));
  } catch (error) {
    logger.error('Failed to list roles:', error);
    res.status(500).json({ error: 'Failed to retrieve roles' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const role = roles.find(r => r.id === req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve role' });
  }
});

router.post('/', sanitizeInput, async (req: Request, res: Response) => {
  try {
    const { name, displayName, description } = req.body;
    if (!name || !displayName) return res.status(400).json({ error: 'Name and displayName required' });
    const newRole = { id: String(roles.length + 1), name, displayName, description: description || '', isSystem: false, userCount: 0, createdAt: new Date().toISOString() };
    roles.push(newRole);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create role' });
  }
});

router.put('/:id', sanitizeInput, async (req: Request, res: Response) => {
  try {
    const idx = roles.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Role not found' });
    if (roles[idx].isSystem) return res.status(403).json({ error: 'Cannot modify system roles' });
    const { displayName, description } = req.body;
    if (displayName) roles[idx].displayName = displayName;
    if (description) roles[idx].description = description;
    res.json(roles[idx]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const idx = roles.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Role not found' });
    if (roles[idx].isSystem) return res.status(403).json({ error: 'Cannot delete system roles' });
    const deleted = roles.splice(idx, 1)[0];
    res.json({ message: 'Role deleted', role: deleted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

export const roleRouter = router;
