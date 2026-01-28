import express from 'express';
import cors from 'cors';
import { atomRouter } from './routes/atom.routes';
import { browserRouter } from './routes/browser.routes';
import { discoveryRouter } from './routes/discovery.routes';
import { navigationRouter } from './routes/navigation.routes';
import { objectRouter } from './routes/object.routes';
import { multiFilingRouter } from './routes/multifiling.routes';
import { versioningRouter } from './routes/versioning.routes';
import { relationshipRouter } from './routes/relationship.routes';
import { policyRouter } from './routes/policy.routes';
import { aclRouter } from './routes/acl.routes';
import { queryRouter } from './routes/query.routes';
import { repositoryRouter } from './routes/repository.routes';
import { connectDatabase } from './database/connection';
import { initializeCache } from './cache/redis';
import { errorHandler } from './middleware/error.middleware';
import { cmisAuthMiddleware } from './middleware/auth.middleware';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3005;

async function startServer() {
  try {
    // Initialize connections
    await connectDatabase();
    await initializeCache();
    
    // Middleware
    app.use(cors({
      origin: '*', // CMIS requires open CORS
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'cmisaction']
    }));
    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ extended: true, limit: '100mb' }));
    app.use(express.text({ type: 'text/xml', limit: '100mb' }));
    app.use(cmisAuthMiddleware);
    
    // CMIS 1.1 Endpoints
    
    // AtomPub Binding
    app.use('/cmis/atom', atomRouter);
    app.use('/cmis/atom11', atomRouter);
    
    // Browser Binding (JSON)
    app.use('/cmis/browser', browserRouter);
    
    // Service Document
    app.use('/cmis/discovery', discoveryRouter);
    
    // Repository Services
    app.use('/cmis/repositories', repositoryRouter);
    
    // Navigation Services
    app.use('/cmis/navigation', navigationRouter);
    
    // Object Services
    app.use('/cmis/objects', objectRouter);
    
    // Multi-filing Services
    app.use('/cmis/multifiling', multiFilingRouter);
    
    // Versioning Services
    app.use('/cmis/versioning', versioningRouter);
    
    // Relationship Services
    app.use('/cmis/relationships', relationshipRouter);
    
    // Policy Services
    app.use('/cmis/policies', policyRouter);
    
    // ACL Services
    app.use('/cmis/acl', aclRouter);
    
    // Query Services
    app.use('/cmis/query', queryRouter);
    
    // CMIS Service Document
    app.get('/cmis', (req, res) => {
      res.set('Content-Type', 'application/atomsvc+xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <service xmlns="http://www.w3.org/2007/app" 
                 xmlns:atom="http://www.w3.org/2005/Atom"
                 xmlns:cmisra="http://docs.oasis-open.org/ns/cmis/restatom/200908/"
                 xmlns:cmis="http://docs.oasis-open.org/ns/cmis/core/200908/">
          <workspace>
            <atom:title>Alfresco CMIS Repository</atom:title>
            <collection href="/cmis/atom/children">
              <atom:title>Root Collection</atom:title>
              <accept>application/atom+xml;type=entry</accept>
              <accept>application/cmis+xml</accept>
              <cmisra:collectionType>root</cmisra:collectionType>
            </collection>
            <collection href="/cmis/atom/types">
              <atom:title>Types Collection</atom:title>
              <accept>application/atom+xml;type=entry</accept>
              <cmisra:collectionType>types</cmisra:collectionType>
            </collection>
            <collection href="/cmis/atom/query">
              <atom:title>Query Collection</atom:title>
              <accept>application/cmisquery+xml</accept>
              <cmisra:collectionType>query</cmisra:collectionType>
            </collection>
          </workspace>
        </service>`);
    });
    
    // WSDL for Web Services Binding
    app.get('/cmis/services/RepositoryService?wsdl', (req, res) => {
      res.set('Content-Type', 'text/xml');
      res.sendFile(__dirname + '/wsdl/CMIS-Core.wsdl');
    });
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        service: 'cmis-service',
        version: '1.1',
        vendor: 'Alfresco ECM',
        productName: 'Alfresco CMIS',
        productVersion: '1.0.0'
      });
    });
    
    // Error handling
    app.use(errorHandler);
    
    app.listen(PORT, () => {
      logger.info(`CMIS Service running on port ${PORT}`);
      logger.info(`CMIS AtomPub: http://localhost:${PORT}/cmis/atom`);
      logger.info(`CMIS Browser: http://localhost:${PORT}/cmis/browser`);
    });
  } catch (error) {
    logger.error('Failed to start CMIS service:', error);
    process.exit(1);
  }
}

startServer();