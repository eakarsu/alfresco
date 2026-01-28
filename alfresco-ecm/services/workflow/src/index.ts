import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { processRouter } from './routes/process.routes';
import { taskRouter } from './routes/task.routes';
import { definitionRouter } from './routes/definition.routes';
import { instanceRouter } from './routes/instance.routes';
import { deploymentRouter } from './routes/deployment.routes';
import { historyRouter } from './routes/history.routes';
import { formRouter } from './routes/form.routes';
import { decisionRouter } from './routes/decision.routes';
import { timerRouter } from './routes/timer.routes';
import { signalRouter } from './routes/signal.routes';
import { messageRouter } from './routes/message.routes';
import { incidentRouter } from './routes/incident.routes';
import { slaRouter } from './routes/sla.routes';
import { delegationRouter } from './routes/delegation.routes';
import { escalationRouter } from './routes/escalation.routes';
import { connectDatabase } from './database/connection';
import { initializeCamunda } from './engines/camunda';
import { initializeZeebe } from './engines/zeebe';
import { startWorkers } from './workers';
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

const PORT = process.env.PORT || 3003;

async function startServer() {
  try {
    // Initialize connections
    await connectDatabase();
    await initializeCamunda();
    await initializeZeebe();
    
    // Start background workers
    await startWorkers();
    
    // Middleware
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(authMiddleware);
    
    // Workflow Routes
    app.use('/api/v1/processes', processRouter);
    app.use('/api/v1/tasks', taskRouter);
    app.use('/api/v1/definitions', definitionRouter);
    app.use('/api/v1/instances', instanceRouter);
    app.use('/api/v1/deployments', deploymentRouter);
    app.use('/api/v1/history', historyRouter);
    app.use('/api/v1/forms', formRouter);
    app.use('/api/v1/decisions', decisionRouter);
    app.use('/api/v1/timers', timerRouter);
    app.use('/api/v1/signals', signalRouter);
    app.use('/api/v1/messages', messageRouter);
    app.use('/api/v1/incidents', incidentRouter);
    app.use('/api/v1/sla', slaRouter);
    app.use('/api/v1/delegation', delegationRouter);
    app.use('/api/v1/escalation', escalationRouter);
    
    // WebSocket for real-time workflow updates
    io.on('connection', (socket) => {
      logger.info('Workflow client connected:', socket.id);
      
      socket.on('subscribe:process', (processId) => {
        socket.join(`process:${processId}`);
      });
      
      socket.on('subscribe:task', (taskId) => {
        socket.join(`task:${taskId}`);
      });
      
      socket.on('subscribe:user-tasks', (userId) => {
        socket.join(`user-tasks:${userId}`);
      });
      
      socket.on('disconnect', () => {
        logger.info('Workflow client disconnected:', socket.id);
      });
    });
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'healthy', service: 'workflow-service' });
    });
    
    // Error handling
    app.use(errorHandler);
    
    httpServer.listen(PORT, () => {
      logger.info(`Workflow Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start workflow service:', error);
    process.exit(1);
  }
}

startServer();

export { io };