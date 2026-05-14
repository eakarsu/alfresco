import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import { authRouter } from './routes/auth.routes';
import { userRouter } from './routes/user.routes';
import { groupRouter } from './routes/group.routes';
import { roleRouter } from './routes/role.routes';
import { permissionRouter } from './routes/permission.routes';
import { sessionRouter } from './routes/session.routes';
import { auditRouter } from './routes/audit.routes';
import { customFeaturesRouter } from './routes/customFeatures.routes';
import { configurePassport } from './config/passport';
import { errorHandler } from './middleware/error.middleware';
import { rateLimiter } from './middleware/rate-limit.middleware';
import { logger } from './utils/logger';
import { connectDatabase } from './database/connection';
import { initializeKeycloak } from './integrations/keycloak';
import { startMetricsServer } from './monitoring/metrics';

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize database connections
    await connectDatabase();
    
    // Initialize Keycloak integration
    await initializeKeycloak();
    
    // Configure middleware
    app.use(helmet());
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(rateLimiter);
    
    // Configure passport strategies
    configurePassport(passport);
    app.use(passport.initialize());
    
    // API Routes
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/groups', groupRouter);
    app.use('/api/v1/roles', roleRouter);
    app.use('/api/v1/permissions', permissionRouter);
    app.use('/api/v1/sessions', sessionRouter);
    app.use('/api/v1/audit', auditRouter);
    app.use('/api/v1/custom', customFeaturesRouter);
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'healthy', service: 'auth-service' });
    });
    
    // Error handling
    app.use(errorHandler);
    
    // Start metrics server
    startMetricsServer();
    
    app.listen(PORT, () => {
      logger.info(`Auth Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start auth service:', error);
    process.exit(1);
  }
}

startServer();