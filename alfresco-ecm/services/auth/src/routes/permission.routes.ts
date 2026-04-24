import { Router, Request, Response } from 'express';
import { sanitizeInput } from '../middleware/validation.middleware';
import { logger } from '../utils/logger';

const router = Router();

const permissions = [
  { id: '1', resource: 'documents', action: 'create', description: 'Create new documents' },
  { id: '2', resource: 'documents', action: 'read', description: 'View documents' },
  { id: '3', resource: 'documents', action: 'update', description: 'Edit documents' },
  { id: '4', resource: 'documents', action: 'delete', description: 'Delete documents' },
  { id: '5', resource: 'documents', action: 'export', description: 'Export documents' },
  { id: '6', resource: 'users', action: 'create', description: 'Create users' },
  { id: '7', resource: 'users', action: 'read', description: 'View users' },
  { id: '8', resource: 'users', action: 'update', description: 'Edit users' },
  { id: '9', resource: 'users', action: 'delete', description: 'Delete users' },
  { id: '10', resource: 'workflows', action: 'create', description: 'Create workflows' },
  { id: '11', resource: 'workflows', action: 'read', description: 'View workflows' },
  { id: '12', resource: 'workflows', action: 'update', description: 'Modify workflows' },
  { id: '13', resource: 'workflows', action: 'delete', description: 'Delete workflows' },
  { id: '14', resource: 'records', action: 'create', description: 'Create records' },
  { id: '15', resource: 'records', action: 'read', description: 'View records' },
  { id: '16', resource: 'records', action: 'update', description: 'Modify records' },
  { id: '17', resource: 'sites', action: 'create', description: 'Create sites' },
  { id: '18', resource: 'sites', action: 'manage', description: 'Manage sites' },
  { id: '19', resource: 'audit', action: 'read', description: 'View audit logs' },
  { id: '20', resource: 'admin', action: 'access', description: 'Access admin console' },
];

router.get('/', async (_req: Request, res: Response) => {
  try { res.json(permissions); } catch (error) { res.status(500).json({ error: 'Failed to retrieve permissions' }); }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const perm = permissions.find(p => p.id === req.params.id);
    if (!perm) return res.status(404).json({ error: 'Permission not found' });
    res.json(perm);
  } catch (error) { res.status(500).json({ error: 'Failed to retrieve permission' }); }
});

router.post('/', sanitizeInput, async (req: Request, res: Response) => {
  try {
    const { resource, action, description } = req.body;
    if (!resource || !action) return res.status(400).json({ error: 'Resource and action required' });
    const newPerm = { id: String(permissions.length + 1), resource, action, description: description || '' };
    permissions.push(newPerm);
    res.status(201).json(newPerm);
  } catch (error) { res.status(500).json({ error: 'Failed to create permission' }); }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const idx = permissions.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Permission not found' });
    const deleted = permissions.splice(idx, 1)[0];
    res.json({ message: 'Permission deleted', permission: deleted });
  } catch (error) { res.status(500).json({ error: 'Failed to delete permission' }); }
});

export const permissionRouter = router;
