import { Router, Request, Response } from 'express';
import { parsePaginationParams, createPaginatedResponse } from '../utils/pagination';
import { exportToCSV, exportToPDF } from '../utils/export';
import { logger } from '../utils/logger';

const router = Router();

const auditEntries = [
  { id: '1', username: 'admin', action: 'LOGIN', resourceType: 'auth', resourceName: 'System Login', result: 'success', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', createdAt: '2024-01-15T09:00:00Z' },
  { id: '2', username: 'john.doe', action: 'LOGIN', resourceType: 'auth', resourceName: 'System Login', result: 'success', ipAddress: '192.168.1.101', userAgent: 'Firefox/121.0', createdAt: '2024-01-15T08:00:00Z' },
  { id: '3', username: 'jane.smith', action: 'CREATE', resourceType: 'document', resourceName: 'Q4 Financial Report.xlsx', result: 'success', ipAddress: '192.168.1.102', userAgent: 'Chrome/120.0', createdAt: '2024-01-15T07:00:00Z' },
  { id: '4', username: 'bob.wilson', action: 'UPDATE', resourceType: 'document', resourceName: 'API Documentation.md', result: 'success', ipAddress: '192.168.1.103', userAgent: 'Safari/17.0', createdAt: '2024-01-15T06:00:00Z' },
  { id: '5', username: 'alice.johnson', action: 'DELETE', resourceType: 'document', resourceName: 'Old Contract Draft.pdf', result: 'success', ipAddress: '192.168.1.104', userAgent: 'Chrome/120.0', createdAt: '2024-01-15T05:00:00Z' },
  { id: '6', username: 'carlos.garcia', action: 'DOWNLOAD', resourceType: 'document', resourceName: 'Brand Guidelines.pdf', result: 'success', ipAddress: '192.168.1.105', userAgent: 'Edge/120.0', createdAt: '2024-01-15T04:00:00Z' },
  { id: '7', username: 'david.lee', action: 'SHARE', resourceType: 'document', resourceName: 'Architecture Design.docx', result: 'success', ipAddress: '192.168.1.106', userAgent: 'Chrome/120.0', createdAt: '2024-01-15T03:00:00Z' },
  { id: '8', username: 'emma.brown', action: 'CREATE', resourceType: 'workflow', resourceName: 'Leave Request', result: 'success', ipAddress: '192.168.1.107', userAgent: 'Firefox/121.0', createdAt: '2024-01-15T02:00:00Z' },
  { id: '9', username: 'frank.miller', action: 'UPDATE', resourceType: 'site', resourceName: 'DevOps Hub Settings', result: 'success', ipAddress: '192.168.1.108', userAgent: 'Chrome/120.0', createdAt: '2024-01-15T01:00:00Z' },
  { id: '10', username: 'grace.taylor', action: 'CREATE', resourceType: 'site', resourceName: 'QA Team Site', result: 'success', ipAddress: '192.168.1.109', userAgent: 'Safari/17.0', createdAt: '2024-01-14T23:00:00Z' },
  { id: '11', username: 'admin', action: 'BULK_DELETE', resourceType: 'document', resourceName: '15 archived documents', result: 'success', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T22:00:00Z' },
  { id: '12', username: 'admin', action: 'EXPORT_CSV', resourceType: 'user', resourceName: 'User List Export', result: 'success', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T21:00:00Z' },
  { id: '13', username: 'admin', action: 'EXPORT_PDF', resourceType: 'audit', resourceName: 'Audit Report Export', result: 'success', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T20:00:00Z' },
  { id: '14', username: 'henry.clark', action: 'LOGIN', resourceType: 'auth', resourceName: 'System Login', result: 'failure', ipAddress: '192.168.1.150', userAgent: 'Chrome/119.0', createdAt: '2024-01-14T19:00:00Z' },
  { id: '15', username: 'ivy.martinez', action: 'LOGIN', resourceType: 'auth', resourceName: 'System Login', result: 'failure', ipAddress: '10.0.0.50', userAgent: 'curl/7.64.1', createdAt: '2024-01-14T18:00:00Z' },
  { id: '16', username: 'admin', action: 'CHANGE_PASSWORD', resourceType: 'user', resourceName: 'Password Changed for john.doe', result: 'success', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T17:00:00Z' },
  { id: '17', username: 'admin', action: 'REGISTER_USER', resourceType: 'user', resourceName: 'New User: noah.harris', result: 'success', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T16:00:00Z' },
  { id: '18', username: 'admin', action: 'BULK_UPDATE', resourceType: 'user', resourceName: 'Updated roles for 8 users', result: 'success', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T15:00:00Z' },
  { id: '19', username: 'john.doe', action: 'VERIFY_EMAIL', resourceType: 'user', resourceName: 'Email Verified: jack.anderson', result: 'success', ipAddress: '192.168.1.101', userAgent: 'Firefox/121.0', createdAt: '2024-01-14T14:00:00Z' },
  { id: '20', username: 'admin', action: 'RESET_PASSWORD', resourceType: 'user', resourceName: 'Password Reset for ivy.martinez', result: 'success', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T13:00:00Z' },
];

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit, offset } = parsePaginationParams(req.query);
    const search = (req.query.search as string) || '';
    const action = (req.query.action as string) || '';
    let filtered = auditEntries;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(e => e.username.toLowerCase().includes(s) || e.resourceName.toLowerCase().includes(s));
    }
    if (action) filtered = filtered.filter(e => e.action === action);
    const paginated = filtered.slice(offset, offset + limit);
    res.json(createPaginatedResponse(paginated, filtered.length, page, limit));
  } catch (error) {
    logger.error('Failed to list audit entries:', error);
    res.status(500).json({ error: 'Failed to retrieve audit entries' });
  }
});

router.get('/export/csv', async (_req: Request, res: Response) => {
  try {
    const csv = exportToCSV(auditEntries, ['id', 'username', 'action', 'resourceType', 'resourceName', 'result', 'ipAddress', 'createdAt']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-log.csv');
    res.send(csv);
  } catch (error) { res.status(500).json({ error: 'Export failed' }); }
});

router.get('/export/pdf', async (_req: Request, res: Response) => {
  try {
    const pdf = exportToPDF(auditEntries, 'Audit Log Report', ['username', 'action', 'resourceName', 'result', 'createdAt']);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-log.pdf');
    res.send(pdf);
  } catch (error) { res.status(500).json({ error: 'Export failed' }); }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const entry = auditEntries.find(e => e.id === req.params.id);
    if (!entry) return res.status(404).json({ error: 'Audit entry not found' });
    res.json(entry);
  } catch (error) { res.status(500).json({ error: 'Failed to retrieve audit entry' }); }
});

export const auditRouter = router;
