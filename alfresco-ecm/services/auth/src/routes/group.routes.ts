import { Router, Request, Response } from 'express';
import { sanitizeInput } from '../middleware/validation.middleware';
import { parsePaginationParams, createPaginatedResponse } from '../utils/pagination';
import { logger } from '../utils/logger';

const router = Router();

const groups = [
  { id: '1', name: 'GROUP_EVERYONE', displayName: 'Everyone', description: 'All authenticated users', type: 'system', memberCount: 20, createdAt: '2022-01-01T00:00:00Z' },
  { id: '2', name: 'GROUP_ADMINS', displayName: 'Administrators', description: 'System administrators', type: 'system', memberCount: 2, createdAt: '2022-01-01T00:00:00Z' },
  { id: '3', name: 'GROUP_HR', displayName: 'Human Resources', description: 'HR department team', type: 'department', memberCount: 4, createdAt: '2022-06-01T00:00:00Z' },
  { id: '4', name: 'GROUP_FINANCE', displayName: 'Finance', description: 'Finance department', type: 'department', memberCount: 5, createdAt: '2022-06-01T00:00:00Z' },
  { id: '5', name: 'GROUP_ENGINEERING', displayName: 'Engineering', description: 'Engineering team', type: 'department', memberCount: 8, createdAt: '2022-06-01T00:00:00Z' },
  { id: '6', name: 'GROUP_MARKETING', displayName: 'Marketing', description: 'Marketing team', type: 'department', memberCount: 4, createdAt: '2022-09-01T00:00:00Z' },
  { id: '7', name: 'GROUP_SALES', displayName: 'Sales', description: 'Sales team', type: 'department', memberCount: 6, createdAt: '2022-09-01T00:00:00Z' },
  { id: '8', name: 'GROUP_LEGAL', displayName: 'Legal', description: 'Legal department', type: 'department', memberCount: 3, createdAt: '2023-01-01T00:00:00Z' },
  { id: '9', name: 'GROUP_EXECUTIVES', displayName: 'Executive Team', description: 'C-level executives', type: 'custom', memberCount: 5, createdAt: '2023-01-01T00:00:00Z' },
  { id: '10', name: 'GROUP_PROJECT_ALPHA', displayName: 'Project Alpha Team', description: 'Cloud migration project team', type: 'project', memberCount: 10, createdAt: '2023-06-01T00:00:00Z' },
  { id: '11', name: 'GROUP_PROJECT_BETA', displayName: 'Project Beta Team', description: 'Mobile app project team', type: 'project', memberCount: 8, createdAt: '2023-08-01T00:00:00Z' },
  { id: '12', name: 'GROUP_CONTRACTORS', displayName: 'Contractors', description: 'External contractors', type: 'external', memberCount: 3, createdAt: '2023-04-01T00:00:00Z' },
  { id: '13', name: 'GROUP_QA', displayName: 'Quality Assurance', description: 'QA team', type: 'department', memberCount: 4, createdAt: '2023-02-01T00:00:00Z' },
  { id: '14', name: 'GROUP_DEVOPS', displayName: 'DevOps', description: 'DevOps and infrastructure', type: 'department', memberCount: 3, createdAt: '2023-02-01T00:00:00Z' },
  { id: '15', name: 'GROUP_SUPPORT', displayName: 'Customer Support', description: 'Support team', type: 'department', memberCount: 5, createdAt: '2023-03-01T00:00:00Z' },
  { id: '16', name: 'GROUP_INTERNS', displayName: 'Interns', description: 'Current interns', type: 'custom', memberCount: 2, createdAt: '2023-09-01T00:00:00Z' },
];

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit, offset } = parsePaginationParams(req.query);
    const search = (req.query.search as string) || '';
    let filtered = groups;
    if (search) {
      const s = search.toLowerCase();
      filtered = groups.filter(g => g.displayName.toLowerCase().includes(s) || g.name.toLowerCase().includes(s));
    }
    const paginated = filtered.slice(offset, offset + limit);
    res.json(createPaginatedResponse(paginated, filtered.length, page, limit));
  } catch (error) {
    logger.error('Failed to list groups:', error);
    res.status(500).json({ error: 'Failed to retrieve groups' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const group = groups.find(g => g.id === req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (error) {
    logger.error('Failed to get group:', error);
    res.status(500).json({ error: 'Failed to retrieve group' });
  }
});

router.post('/', sanitizeInput, async (req: Request, res: Response) => {
  try {
    const { name, displayName, description, type } = req.body;
    if (!name || !displayName) return res.status(400).json({ error: 'Name and displayName are required' });
    const newGroup = { id: String(groups.length + 1), name, displayName, description: description || '', type: type || 'custom', memberCount: 0, createdAt: new Date().toISOString() };
    groups.push(newGroup);
    res.status(201).json(newGroup);
  } catch (error) {
    logger.error('Failed to create group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

router.put('/:id', sanitizeInput, async (req: Request, res: Response) => {
  try {
    const idx = groups.findIndex(g => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Group not found' });
    const { displayName, description, type } = req.body;
    if (displayName) groups[idx].displayName = displayName;
    if (description) groups[idx].description = description;
    if (type) groups[idx].type = type;
    res.json(groups[idx]);
  } catch (error) {
    logger.error('Failed to update group:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const idx = groups.findIndex(g => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Group not found' });
    const deleted = groups.splice(idx, 1)[0];
    res.json({ message: 'Group deleted', group: deleted });
  } catch (error) {
    logger.error('Failed to delete group:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

export const groupRouter = router;
