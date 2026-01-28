import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { documentRouter } from './routes/document.routes';
import { versionRouter } from './routes/version.routes';
import { folderRouter } from './routes/folder.routes';
import { metadataRouter } from './routes/metadata.routes';
import { thumbnailRouter } from './routes/thumbnail.routes';
import { previewRouter } from './routes/preview.routes';
import { lockRouter } from './routes/lock.routes';
import { commentRouter } from './routes/comment.routes';
import { tagRouter } from './routes/tag.routes';
import { categoryRouter } from './routes/category.routes';
import { aspectRouter } from './routes/aspect.routes';
import { ruleRouter } from './routes/rule.routes';
import { transformRouter } from './routes/transform.routes';
import { bulkRouter } from './routes/bulk.routes';
import { importExportRouter } from './routes/import-export.routes';
import { connectDatabase } from './database/connection';
import { connectStorage } from './storage/connection';
import { initializeSearch } from './search/elasticsearch';
import { startWorkers } from './workers';
import { initializeCache } from './cache/redis';
import { errorHandler } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { logger } from './utils/logger';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3002;

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5368709120'), // 5GB default
  }
});

async function startServer() {
  try {
    // Initialize connections
    await connectDatabase();
    await connectStorage();
    await initializeSearch();
    await initializeCache();
    
    // Start background workers
    await startWorkers();
    
    // Middleware
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(authMiddleware);
    
    // Document Management Routes
    app.use('/api/v1/documents', documentRouter);
    app.use('/api/v1/versions', versionRouter);
    app.use('/api/v1/folders', folderRouter);
    app.use('/api/v1/metadata', metadataRouter);
    app.use('/api/v1/thumbnails', thumbnailRouter);
    app.use('/api/v1/preview', previewRouter);
    app.use('/api/v1/locks', lockRouter);
    app.use('/api/v1/comments', commentRouter);
    app.use('/api/v1/tags', tagRouter);
    app.use('/api/v1/categories', categoryRouter);
    app.use('/api/v1/aspects', aspectRouter);
    app.use('/api/v1/rules', ruleRouter);
    app.use('/api/v1/transform', transformRouter);
    app.use('/api/v1/bulk', bulkRouter);
    app.use('/api/v1/import-export', importExportRouter);
    
    // WebSocket for real-time updates
    io.on('connection', (socket) => {
      logger.info('Client connected:', socket.id);
      
      socket.on('subscribe:document', (documentId) => {
        socket.join(`document:${documentId}`);
      });
      
      socket.on('subscribe:folder', (folderId) => {
        socket.join(`folder:${folderId}`);
      });
      
      socket.on('disconnect', () => {
        logger.info('Client disconnected:', socket.id);
      });
    });
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'healthy', service: 'document-service' });
    });
    
    // Error handling
    app.use(errorHandler);
    
    httpServer.listen(PORT, () => {
      logger.info(`Document Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start document service:', error);
    process.exit(1);
  }
}

startServer();

export { io };