import express from 'express';
import cors from 'cors';
import { smartFolderRouter } from './routes/smart-folder.routes';
import { templateRouter } from './routes/template.routes';
import { queryRouter } from './routes/query.routes';
import { virtualRouter } from './routes/virtual.routes';
import { ruleRouter } from './routes/rule.routes';
import { filterRouter } from './routes/filter.routes';
import { aggregationRouter } from './routes/aggregation.routes';
import { connectDatabase } from './database/connection';
import { initializeCache } from './cache/redis';
import { initializeSearchEngine } from './search/engine';
import { startQueryProcessor } from './processors/query.processor';
import { startCacheUpdater } from './processors/cache.processor';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3009;

// Smart Folder Templates
const SMART_FOLDER_TEMPLATES = {
  'recent-documents': {
    name: 'Recent Documents',
    description: 'Documents modified in the last 7 days',
    query: {
      type: 'cm:content',
      modifiedDate: { range: { from: 'NOW-7DAYS', to: 'NOW' } }
    },
    icon: 'history',
    autoRefresh: true,
    refreshInterval: 300000 // 5 minutes
  },
  'my-drafts': {
    name: 'My Drafts',
    description: 'Documents I am currently working on',
    query: {
      type: 'cm:content',
      creator: '${user.id}',
      aspect: 'cm:workingcopy',
      status: 'draft'
    },
    icon: 'edit',
    autoRefresh: true
  },
  'pending-approval': {
    name: 'Pending Approval',
    description: 'Documents waiting for my approval',
    query: {
      type: 'cm:content',
      workflow: {
        assignee: '${user.id}',
        status: 'pending'
      }
    },
    icon: 'pending_actions',
    autoRefresh: true,
    refreshInterval: 60000 // 1 minute
  },
  'expiring-soon': {
    name: 'Expiring Soon',
    description: 'Documents expiring in the next 30 days',
    query: {
      type: 'cm:content',
      expiryDate: { range: { from: 'NOW', to: 'NOW+30DAYS' } }
    },
    icon: 'warning',
    autoRefresh: true
  },
  'large-files': {
    name: 'Large Files',
    description: 'Files larger than 100MB',
    query: {
      type: 'cm:content',
      size: { min: 104857600 } // 100MB in bytes
    },
    icon: 'storage'
  },
  'by-department': {
    name: 'By Department',
    description: 'Documents organized by department',
    query: {
      type: 'cm:content'
    },
    groupBy: 'department',
    icon: 'business',
    subfolders: 'dynamic'
  },
  'by-project': {
    name: 'By Project',
    description: 'Documents organized by project',
    query: {
      type: 'cm:content',
      aspect: 'project:related'
    },
    groupBy: 'project',
    icon: 'folder_shared',
    subfolders: 'dynamic'
  },
  'compliance-documents': {
    name: 'Compliance Documents',
    description: 'Documents requiring compliance review',
    query: {
      type: 'cm:content',
      aspect: ['compliance:required', 'audit:tracked'],
      complianceStatus: ['pending', 'review']
    },
    icon: 'policy',
    autoRefresh: true
  },
  'my-favorites': {
    name: 'My Favorites',
    description: 'Documents I have marked as favorites',
    query: {
      type: 'cm:content',
      favorite: {
        user: '${user.id}',
        isFavorite: true
      }
    },
    icon: 'star'
  },
  'shared-with-me': {
    name: 'Shared With Me',
    description: 'Documents shared with me by others',
    query: {
      type: 'cm:content',
      permissions: {
        user: '${user.id}',
        sharedBy: { not: '${user.id}' }
      }
    },
    icon: 'people',
    autoRefresh: true
  }
};

async function startServer() {
  try {
    // Initialize connections
    await connectDatabase();
    await initializeCache();
    await initializeSearchEngine();
    
    // Start background processors
    await startQueryProcessor();
    await startCacheUpdater();
    
    // Middleware
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    // Smart Folder Routes
    app.use('/api/v1/smart-folders', smartFolderRouter);
    app.use('/api/v1/templates', templateRouter);
    app.use('/api/v1/queries', queryRouter);
    app.use('/api/v1/virtual', virtualRouter);
    app.use('/api/v1/rules', ruleRouter);
    app.use('/api/v1/filters', filterRouter);
    app.use('/api/v1/aggregations', aggregationRouter);
    
    // Get all smart folder templates
    app.get('/api/v1/templates/system', (req, res) => {
      res.json({
        templates: Object.entries(SMART_FOLDER_TEMPLATES).map(([key, template]) => ({
          id: key,
          ...template
        }))
      });
    });
    
    // Create smart folder from template
    app.post('/api/v1/smart-folders/from-template', async (req, res) => {
      try {
        const { templateId, name, parentFolderId, parameters } = req.body;
        const template = SMART_FOLDER_TEMPLATES[templateId];
        
        if (!template) {
          return res.status(404).json({ error: 'Template not found' });
        }
        
        // Replace parameters in query
        let query = JSON.stringify(template.query);
        if (parameters) {
          Object.entries(parameters).forEach(([key, value]) => {
            query = query.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value as string);
          });
        }
        
        const smartFolder = {
          id: `sf-${Date.now()}`,
          name: name || template.name,
          description: template.description,
          query: JSON.parse(query),
          icon: template.icon,
          autoRefresh: template.autoRefresh,
          refreshInterval: template.refreshInterval,
          parentFolderId,
          createdAt: new Date(),
          createdBy: req.user?.id
        };
        
        // Save smart folder to database
        // await saveSmartFolder(smartFolder);
        
        res.json({ smartFolder });
      } catch (error) {
        logger.error('Failed to create smart folder:', error);
        res.status(500).json({ error: 'Failed to create smart folder' });
      }
    });
    
    // Execute smart folder query
    app.post('/api/v1/smart-folders/:id/execute', async (req, res) => {
      try {
        const { id } = req.params;
        const { offset = 0, limit = 50, sort, filters } = req.body;
        
        // Get smart folder definition
        // const smartFolder = await getSmartFolder(id);
        
        // Execute query
        const results = await executeSmartFolderQuery({
          query: req.body.query || {},
          offset,
          limit,
          sort,
          filters,
          user: req.user
        });
        
        res.json({
          items: results.items,
          totalItems: results.totalItems,
          hasMore: results.hasMore,
          executionTime: results.executionTime
        });
      } catch (error) {
        logger.error('Failed to execute smart folder query:', error);
        res.status(500).json({ error: 'Query execution failed' });
      }
    });
    
    // Virtual folder structure
    app.get('/api/v1/virtual-folders/:path(*)', async (req, res) => {
      try {
        const { path } = req.params;
        
        // Generate virtual folder structure based on queries
        const virtualStructure = await generateVirtualStructure(path, req.user);
        
        res.json({
          path,
          folders: virtualStructure.folders,
          documents: virtualStructure.documents,
          breadcrumb: virtualStructure.breadcrumb
        });
      } catch (error) {
        logger.error('Failed to generate virtual structure:', error);
        res.status(500).json({ error: 'Failed to generate virtual structure' });
      }
    });
    
    // Smart folder subscription for real-time updates
    app.post('/api/v1/smart-folders/:id/subscribe', async (req, res) => {
      try {
        const { id } = req.params;
        const { webhookUrl } = req.body;
        
        // Subscribe to smart folder updates
        const subscription = {
          id: `sub-${Date.now()}`,
          smartFolderId: id,
          webhookUrl,
          userId: req.user?.id,
          createdAt: new Date()
        };
        
        // await saveSubscription(subscription);
        
        res.json({ subscription });
      } catch (error) {
        logger.error('Failed to create subscription:', error);
        res.status(500).json({ error: 'Subscription failed' });
      }
    });
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        service: 'smart-folders-service',
        templates: Object.keys(SMART_FOLDER_TEMPLATES).length,
        features: [
          'virtual-folders',
          'dynamic-queries',
          'auto-refresh',
          'real-time-updates',
          'template-based',
          'rule-engine'
        ]
      });
    });
    
    // Error handling
    app.use(errorHandler);
    
    app.listen(PORT, () => {
      logger.info(`Smart Folders Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start smart folders service:', error);
    process.exit(1);
  }
}

// Helper functions
async function executeSmartFolderQuery(params: any): Promise<any> {
  // Implementation of smart folder query execution
  // This would integrate with Elasticsearch and database
  return {
    items: [],
    totalItems: 0,
    hasMore: false,
    executionTime: 0
  };
}

async function generateVirtualStructure(path: string, user: any): Promise<any> {
  // Generate virtual folder structure based on smart folder rules
  return {
    folders: [],
    documents: [],
    breadcrumb: []
  };
}

startServer();