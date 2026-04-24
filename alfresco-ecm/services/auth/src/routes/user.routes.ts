import { Router, Request, Response } from 'express';
import { sanitizeInput, validateRegistration, validateEmail } from '../middleware/validation.middleware';
import { parsePaginationParams, createPaginatedResponse } from '../utils/pagination';
import { validatePasswordStrength, hashPassword } from '../utils/password';
import { exportToCSV, exportToPDF } from '../utils/export';
import { logger } from '../utils/logger';

const router = Router();

// In-memory store for demo (replace with database in production)
const users = [
  { id: '1', username: 'admin', email: 'admin@alfresco.com', firstName: 'System', lastName: 'Administrator', displayName: 'System Administrator', role: 'Administrator', status: 'active', emailVerified: true, lastLogin: '2024-01-15T10:00:00Z', createdAt: '2022-01-01T00:00:00Z' },
  { id: '2', username: 'john.doe', email: 'john.doe@alfresco.com', firstName: 'John', lastName: 'Doe', displayName: 'John Doe', role: 'Manager', status: 'active', emailVerified: true, lastLogin: '2024-01-15T08:00:00Z', createdAt: '2022-06-15T00:00:00Z' },
  { id: '3', username: 'jane.smith', email: 'jane.smith@alfresco.com', firstName: 'Jane', lastName: 'Smith', displayName: 'Jane Smith', role: 'Manager', status: 'active', emailVerified: true, lastLogin: '2024-01-15T09:30:00Z', createdAt: '2022-12-01T00:00:00Z' },
  { id: '4', username: 'bob.wilson', email: 'bob.wilson@alfresco.com', firstName: 'Bob', lastName: 'Wilson', displayName: 'Bob Wilson', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-14T15:00:00Z', createdAt: '2023-02-15T00:00:00Z' },
  { id: '5', username: 'alice.johnson', email: 'alice.johnson@alfresco.com', firstName: 'Alice', lastName: 'Johnson', displayName: 'Alice Johnson', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-14T12:00:00Z', createdAt: '2023-04-01T00:00:00Z' },
  { id: '6', username: 'carlos.garcia', email: 'carlos.garcia@alfresco.com', firstName: 'Carlos', lastName: 'Garcia', displayName: 'Carlos Garcia', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-15T07:00:00Z', createdAt: '2023-06-01T00:00:00Z' },
  { id: '7', username: 'maria.santos', email: 'maria.santos@alfresco.com', firstName: 'Maria', lastName: 'Santos', displayName: 'Maria Santos', role: 'User', status: 'active', emailVerified: false, lastLogin: '2024-01-13T10:00:00Z', createdAt: '2023-07-15T00:00:00Z' },
  { id: '8', username: 'david.lee', email: 'david.lee@alfresco.com', firstName: 'David', lastName: 'Lee', displayName: 'David Lee', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-14T18:00:00Z', createdAt: '2023-08-01T00:00:00Z' },
  { id: '9', username: 'emma.brown', email: 'emma.brown@alfresco.com', firstName: 'Emma', lastName: 'Brown', displayName: 'Emma Brown', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-15T06:00:00Z', createdAt: '2023-09-01T00:00:00Z' },
  { id: '10', username: 'frank.miller', email: 'frank.miller@alfresco.com', firstName: 'Frank', lastName: 'Miller', displayName: 'Frank Miller', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-14T16:00:00Z', createdAt: '2023-10-01T00:00:00Z' },
  { id: '11', username: 'grace.taylor', email: 'grace.taylor@alfresco.com', firstName: 'Grace', lastName: 'Taylor', displayName: 'Grace Taylor', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-15T05:00:00Z', createdAt: '2023-05-01T00:00:00Z' },
  { id: '12', username: 'henry.clark', email: 'henry.clark@alfresco.com', firstName: 'Henry', lastName: 'Clark', displayName: 'Henry Clark', role: 'User', status: 'inactive', emailVerified: true, lastLogin: null, createdAt: '2022-10-01T00:00:00Z' },
  { id: '13', username: 'ivy.martinez', email: 'ivy.martinez@alfresco.com', firstName: 'Ivy', lastName: 'Martinez', displayName: 'Ivy Martinez', role: 'User', status: 'suspended', emailVerified: true, lastLogin: '2023-12-15T10:00:00Z', createdAt: '2023-03-01T00:00:00Z' },
  { id: '14', username: 'jack.anderson', email: 'jack.anderson@alfresco.com', firstName: 'Jack', lastName: 'Anderson', displayName: 'Jack Anderson', role: 'User', status: 'active', emailVerified: false, lastLogin: null, createdAt: '2024-01-08T00:00:00Z' },
  { id: '15', username: 'kate.thomas', email: 'kate.thomas@alfresco.com', firstName: 'Kate', lastName: 'Thomas', displayName: 'Kate Thomas', role: 'Manager', status: 'active', emailVerified: true, lastLogin: '2024-01-15T09:00:00Z', createdAt: '2023-01-15T00:00:00Z' },
  { id: '16', username: 'leo.jackson', email: 'leo.jackson@alfresco.com', firstName: 'Leo', lastName: 'Jackson', displayName: 'Leo Jackson', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-12T10:00:00Z', createdAt: '2022-09-01T00:00:00Z' },
  { id: '17', username: 'mia.white', email: 'mia.white@alfresco.com', firstName: 'Mia', lastName: 'White', displayName: 'Mia White', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-14T20:00:00Z', createdAt: '2023-06-15T00:00:00Z' },
  { id: '18', username: 'noah.harris', email: 'noah.harris@alfresco.com', firstName: 'Noah', lastName: 'Harris', displayName: 'Noah Harris', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-14T14:00:00Z', createdAt: '2023-08-15T00:00:00Z' },
  { id: '19', username: 'olivia.martin', email: 'olivia.martin@alfresco.com', firstName: 'Olivia', lastName: 'Martin', displayName: 'Olivia Martin', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-15T03:00:00Z', createdAt: '2023-09-15T00:00:00Z' },
  { id: '20', username: 'peter.robinson', email: 'peter.robinson@alfresco.com', firstName: 'Peter', lastName: 'Robinson', displayName: 'Peter Robinson', role: 'User', status: 'active', emailVerified: true, lastLogin: '2024-01-14T21:00:00Z', createdAt: '2023-07-01T00:00:00Z' },
];

// GET / - List users with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit, offset, sortBy, sortOrder } = parsePaginationParams(req.query);
    const search = (req.query.search as string) || '';

    let filtered = users;
    if (search) {
      const s = search.toLowerCase();
      filtered = users.filter(u => u.username.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.displayName.toLowerCase().includes(s));
    }

    if (sortBy && (sortBy as string) in filtered[0]) {
      filtered.sort((a: any, b: any) => {
        const valA = a[sortBy as string] || '';
        const valB = b[sortBy as string] || '';
        return sortOrder === 'desc' ? String(valB).localeCompare(String(valA)) : String(valA).localeCompare(String(valB));
      });
    }

    const paginated = filtered.slice(offset, offset + limit);
    res.json(createPaginatedResponse(paginated, filtered.length, page, limit));
  } catch (error) {
    logger.error('Failed to list users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// GET /export/csv - Export users as CSV
router.get('/export/csv', async (req: Request, res: Response) => {
  try {
    const csv = exportToCSV(users, ['id', 'username', 'email', 'displayName', 'role', 'status', 'emailVerified', 'lastLogin', 'createdAt']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csv);
  } catch (error) {
    logger.error('CSV export failed:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// GET /export/pdf - Export users as PDF
router.get('/export/pdf', async (req: Request, res: Response) => {
  try {
    const pdf = exportToPDF(users, 'User List Report', ['username', 'email', 'displayName', 'role', 'status']);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');
    res.send(pdf);
  } catch (error) {
    logger.error('PDF export failed:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// GET /:id - Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    logger.error('Failed to get user:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// POST / - Create user
router.post('/', sanitizeInput, validateRegistration, async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;
    const strengthCheck = validatePasswordStrength(password);
    if (!strengthCheck.isValid) {
      return res.status(400).json({ error: 'Password too weak', details: strengthCheck });
    }
    const passwordHash = await hashPassword(password);
    const newUser = {
      id: String(users.length + 1),
      username, email, firstName, lastName,
      displayName: `${firstName} ${lastName}`,
      role: role || 'User',
      status: 'active',
      emailVerified: false,
      lastLogin: null,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    logger.info(`User created: ${username}`);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error('Failed to create user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /:id - Update user
router.put('/:id', sanitizeInput, async (req: Request, res: Response) => {
  try {
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    const { firstName, lastName, role, status, email } = req.body;
    if (firstName) users[idx].firstName = firstName;
    if (lastName) users[idx].lastName = lastName;
    if (role) users[idx].role = role;
    if (status) users[idx].status = status;
    if (email) users[idx].email = email;
    if (firstName || lastName) users[idx].displayName = `${users[idx].firstName} ${users[idx].lastName}`;
    logger.info(`User updated: ${users[idx].username}`);
    res.json(users[idx]);
  } catch (error) {
    logger.error('Failed to update user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /:id - Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    const deleted = users.splice(idx, 1)[0];
    logger.info(`User deleted: ${deleted.username}`);
    res.json({ message: 'User deleted successfully', user: deleted });
  } catch (error) {
    logger.error('Failed to delete user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// PUT /:id/change-password - Change password
router.put('/:id/change-password', sanitizeInput, async (req: Request, res: Response) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    const strengthCheck = validatePasswordStrength(newPassword);
    if (!strengthCheck.isValid) {
      return res.status(400).json({ error: 'New password too weak', details: strengthCheck });
    }
    await hashPassword(newPassword);
    logger.info(`Password changed for: ${user.username}`);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Failed to change password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// GET /:id/profile - Get user profile
router.get('/:id/profile', async (req: Request, res: Response) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      ...user,
      settings: { theme: 'light', notifications: true, language: 'en', timezone: 'UTC' }
    });
  } catch (error) {
    logger.error('Failed to get profile:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// PUT /:id/profile - Update user profile
router.put('/:id/profile', sanitizeInput, async (req: Request, res: Response) => {
  try {
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    const { displayName, firstName, lastName } = req.body;
    if (displayName) users[idx].displayName = displayName;
    if (firstName) users[idx].firstName = firstName;
    if (lastName) users[idx].lastName = lastName;
    logger.info(`Profile updated for: ${users[idx].username}`);
    res.json(users[idx]);
  } catch (error) {
    logger.error('Failed to update profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /bulk-delete - Bulk delete users
router.post('/bulk-delete', async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of user IDs is required' });
    }
    const deleted: string[] = [];
    for (const id of ids) {
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        deleted.push(users[idx].username);
        users.splice(idx, 1);
      }
    }
    logger.info(`Bulk deleted ${deleted.length} users`);
    res.json({ message: `${deleted.length} users deleted`, deleted });
  } catch (error) {
    logger.error('Bulk delete failed:', error);
    res.status(500).json({ error: 'Bulk delete failed' });
  }
});

// POST /bulk-update - Bulk update users
router.post('/bulk-update', sanitizeInput, async (req: Request, res: Response) => {
  try {
    const { ids, updates } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of user IDs is required' });
    }
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Updates object is required' });
    }
    let updatedCount = 0;
    for (const id of ids) {
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        if (updates.role) users[idx].role = updates.role;
        if (updates.status) users[idx].status = updates.status;
        updatedCount++;
      }
    }
    logger.info(`Bulk updated ${updatedCount} users`);
    res.json({ message: `${updatedCount} users updated`, updatedCount });
  } catch (error) {
    logger.error('Bulk update failed:', error);
    res.status(500).json({ error: 'Bulk update failed' });
  }
});

export const userRouter = router;
