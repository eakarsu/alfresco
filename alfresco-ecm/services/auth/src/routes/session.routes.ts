import { Router, Request, Response } from 'express';
import { parsePaginationParams, createPaginatedResponse } from '../utils/pagination';
import { logger } from '../utils/logger';

const router = Router();

const sessions = [
  { id: '1', userId: '1', username: 'admin', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', createdAt: '2024-01-15T09:00:00Z', lastAccessed: '2024-01-15T10:00:00Z', expiresAt: '2024-01-22T09:00:00Z', active: true },
  { id: '2', userId: '2', username: 'john.doe', ipAddress: '192.168.1.101', userAgent: 'Firefox/121.0', createdAt: '2024-01-15T08:00:00Z', lastAccessed: '2024-01-15T09:30:00Z', expiresAt: '2024-01-22T08:00:00Z', active: true },
  { id: '3', userId: '3', username: 'jane.smith', ipAddress: '192.168.1.102', userAgent: 'Chrome/120.0', createdAt: '2024-01-15T09:30:00Z', lastAccessed: '2024-01-15T09:55:00Z', expiresAt: '2024-01-22T09:30:00Z', active: true },
  { id: '4', userId: '4', username: 'bob.wilson', ipAddress: '192.168.1.103', userAgent: 'Safari/17.0', createdAt: '2024-01-14T15:00:00Z', lastAccessed: '2024-01-14T17:00:00Z', expiresAt: '2024-01-21T15:00:00Z', active: true },
  { id: '5', userId: '5', username: 'alice.johnson', ipAddress: '192.168.1.104', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T12:00:00Z', lastAccessed: '2024-01-15T00:00:00Z', expiresAt: '2024-01-21T12:00:00Z', active: true },
  { id: '6', userId: '6', username: 'carlos.garcia', ipAddress: '192.168.1.105', userAgent: 'Edge/120.0', createdAt: '2024-01-15T07:00:00Z', lastAccessed: '2024-01-15T09:00:00Z', expiresAt: '2024-01-22T07:00:00Z', active: true },
  { id: '7', userId: '8', username: 'david.lee', ipAddress: '192.168.1.106', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T18:00:00Z', lastAccessed: '2024-01-15T00:00:00Z', expiresAt: '2024-01-21T18:00:00Z', active: true },
  { id: '8', userId: '9', username: 'emma.brown', ipAddress: '192.168.1.107', userAgent: 'Firefox/121.0', createdAt: '2024-01-15T06:00:00Z', lastAccessed: '2024-01-15T08:00:00Z', expiresAt: '2024-01-22T06:00:00Z', active: true },
  { id: '9', userId: '10', username: 'frank.miller', ipAddress: '192.168.1.108', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T16:00:00Z', lastAccessed: '2024-01-15T09:00:00Z', expiresAt: '2024-01-21T16:00:00Z', active: true },
  { id: '10', userId: '11', username: 'grace.taylor', ipAddress: '192.168.1.109', userAgent: 'Safari/17.0', createdAt: '2024-01-15T05:00:00Z', lastAccessed: '2024-01-15T06:00:00Z', expiresAt: '2024-01-22T05:00:00Z', active: true },
  { id: '11', userId: '15', username: 'kate.thomas', ipAddress: '192.168.1.110', userAgent: 'Chrome/120.0', createdAt: '2024-01-15T09:00:00Z', lastAccessed: '2024-01-15T09:50:00Z', expiresAt: '2024-01-22T09:00:00Z', active: true },
  { id: '12', userId: '16', username: 'leo.jackson', ipAddress: '192.168.1.111', userAgent: 'Firefox/121.0', createdAt: '2024-01-12T10:00:00Z', lastAccessed: '2024-01-12T12:00:00Z', expiresAt: '2024-01-19T10:00:00Z', active: false },
  { id: '13', userId: '17', username: 'mia.white', ipAddress: '192.168.1.112', userAgent: 'Chrome/120.0', createdAt: '2024-01-14T20:00:00Z', lastAccessed: '2024-01-15T05:00:00Z', expiresAt: '2024-01-21T20:00:00Z', active: true },
  { id: '14', userId: '18', username: 'noah.harris', ipAddress: '192.168.1.113', userAgent: 'Edge/120.0', createdAt: '2024-01-14T14:00:00Z', lastAccessed: '2024-01-14T21:00:00Z', expiresAt: '2024-01-21T14:00:00Z', active: true },
  { id: '15', userId: '1', username: 'admin', ipAddress: '192.168.1.100', userAgent: 'Chrome/119.0', createdAt: '2024-01-05T10:00:00Z', lastAccessed: '2024-01-07T12:00:00Z', expiresAt: '2024-01-12T10:00:00Z', active: false },
];

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit, offset } = parsePaginationParams(req.query);
    const paginated = sessions.slice(offset, offset + limit);
    res.json(createPaginatedResponse(paginated, sessions.length, page, limit));
  } catch (error) {
    logger.error('Failed to list sessions:', error);
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const session = sessions.find(s => s.id === req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (error) { res.status(500).json({ error: 'Failed to retrieve session' }); }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const idx = sessions.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Session not found' });
    sessions[idx].active = false;
    res.json({ message: 'Session invalidated' });
  } catch (error) { res.status(500).json({ error: 'Failed to invalidate session' }); }
});

export const sessionRouter = router;
