import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { assetRouter } from './routes/asset.routes';
import { collectionRouter } from './routes/collection.routes';
import { metadataRouter } from './routes/metadata.routes';
import { renditionRouter } from './routes/rendition.routes';
import { brandRouter } from './routes/brand.routes';
import { publishRouter } from './routes/publish.routes';
import { distributionRouter } from './routes/distribution.routes';
import { analyticsRouter } from './routes/analytics.routes';
import { workflowRouter } from './routes/workflow.routes';
import { licensingRouter } from './routes/licensing.routes';
import { connectDatabase } from './database/connection';
import { initializeCache } from './cache/redis';
import { initializeStorage } from './storage/initialize';
import { startAssetProcessors } from './processors/asset.processor';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3014;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5368709120 // 5GB
  }
});

// DAM Asset Types
const ASSET_TYPES = {
  IMAGE: {
    formats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'raw', 'heic', 'psd', 'ai'],
    metadata: ['exif', 'iptc', 'xmp', 'color-profile'],
    renditions: ['thumbnail', 'preview', 'web', 'print', 'social-media']
  },
  VIDEO: {
    formats: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v', 'mpg', 'prores'],
    metadata: ['duration', 'resolution', 'fps', 'codec', 'bitrate'],
    renditions: ['thumbnail', 'preview', 'streaming', 'download', 'social-media']
  },
  AUDIO: {
    formats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'aiff'],
    metadata: ['duration', 'bitrate', 'sample-rate', 'channels', 'album', 'artist'],
    renditions: ['preview', 'streaming', 'podcast', 'ringtone']
  },
  DOCUMENT: {
    formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'indd', 'epub'],
    metadata: ['pages', 'author', 'subject', 'keywords'],
    renditions: ['thumbnail', 'preview', 'text-extract', 'accessible']
  },
  '3D': {
    formats: ['obj', 'fbx', 'dae', 'gltf', 'glb', 'usdz', 'stl', 'ply'],
    metadata: ['vertices', 'faces', 'materials', 'animations'],
    renditions: ['thumbnail', 'preview', 'ar-ready', 'vr-ready']
  }
};

// Brand Management
const BRAND_PORTAL = {
  templates: {
    'social-media': {
      platforms: ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'],
      sizes: {
        'instagram-post': { width: 1080, height: 1080 },
        'instagram-story': { width: 1080, height: 1920 },
        'facebook-post': { width: 1200, height: 630 },
        'twitter-post': { width: 1024, height: 512 },
        'linkedin-post': { width: 1200, height: 627 }
      }
    },
    'print': {
      formats: ['a4', 'a3', 'letter', 'poster', 'business-card'],
      specifications: {
        'a4': { width: 210, height: 297, unit: 'mm', dpi: 300 },
        'business-card': { width: 85, height: 55, unit: 'mm', dpi: 300 }
      }
    },
    'web': {
      formats: ['banner', 'hero', 'thumbnail', 'icon'],
      responsive: true,
      optimization: 'automatic'
    }
  },
  guidelines: {
    colors: [],
    fonts: [],
    logos: [],
    patterns: [],
    tone: {}
  }
};

// Asset Collections
const COLLECTION_TYPES = {
  'campaign': {
    name: 'Marketing Campaign',
    structure: ['concepts', 'finals', 'variations', 'archive'],
    workflow: 'approval-workflow'
  },
  'product': {
    name: 'Product Assets',
    structure: ['photography', '3d-renders', 'videos', 'documents'],
    metadata: ['sku', 'product-line', 'season']
  },
  'brand': {
    name: 'Brand Assets',
    structure: ['logos', 'colors', 'fonts', 'templates', 'guidelines'],
    access: 'restricted'
  },
  'event': {
    name: 'Event Assets',
    structure: ['pre-event', 'during', 'post-event', 'highlights'],
    autoArchive: true
  }
};

async function startServer() {
  try {
    await connectDatabase();
    await initializeCache();
    await initializeStorage();
    await startAssetProcessors();
    
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ extended: true, limit: '100mb' }));
    
    // DAM Routes
    app.use('/api/v1/assets', assetRouter);
    app.use('/api/v1/collections', collectionRouter);
    app.use('/api/v1/metadata', metadataRouter);
    app.use('/api/v1/renditions', renditionRouter);
    app.use('/api/v1/brand', brandRouter);
    app.use('/api/v1/publish', publishRouter);
    app.use('/api/v1/distribution', distributionRouter);
    app.use('/api/v1/analytics', analyticsRouter);
    app.use('/api/v1/workflows', workflowRouter);
    app.use('/api/v1/licensing', licensingRouter);
    
    // Upload asset
    app.post('/api/v1/assets/upload', upload.single('file'), async (req, res) => {
      try {
        const file = req.file;
        const { title, description, tags, collection, metadata } = req.body;
        
        if (!file) {
          return res.status(400).json({ error: 'No file provided' });
        }
        
        const asset = await processAsset({
          file,
          title,
          description,
          tags: tags ? tags.split(',') : [],
          collection,
          metadata: metadata ? JSON.parse(metadata) : {},
          uploadedBy: req.user?.id
        });
        
        res.json({
          asset: {
            id: asset.id,
            title: asset.title,
            url: asset.url,
            thumbnails: asset.thumbnails,
            metadata: asset.metadata,
            status: asset.status
          }
        });
      } catch (error) {
        logger.error('Asset upload failed:', error);
        res.status(500).json({ error: 'Upload failed' });
      }
    });
    
    // Batch upload
    app.post('/api/v1/assets/batch-upload', upload.array('files', 100), async (req, res) => {
      try {
        const files = req.files as Express.Multer.File[];
        const { collection, autoTag, autoProcess } = req.body;
        
        const assets = await Promise.all(files.map(file => 
          processAsset({
            file,
            collection,
            autoTag: autoTag === 'true',
            autoProcess: autoProcess === 'true',
            uploadedBy: req.user?.id
          })
        ));
        
        res.json({
          uploaded: assets.length,
          assets: assets.map(a => ({
            id: a.id,
            title: a.title,
            status: a.status
          }))
        });
      } catch (error) {
        logger.error('Batch upload failed:', error);
        res.status(500).json({ error: 'Batch upload failed' });
      }
    });
    
    // Generate renditions
    app.post('/api/v1/renditions/generate', async (req, res) => {
      try {
        const { assetId, renditions } = req.body;
        
        const generated = await generateRenditions({
          assetId,
          renditions: renditions || ['thumbnail', 'preview', 'web']
        });
        
        res.json({
          assetId,
          renditions: generated.renditions,
          urls: generated.urls
        });
      } catch (error) {
        logger.error('Rendition generation failed:', error);
        res.status(500).json({ error: 'Generation failed' });
      }
    });
    
    // Smart crop
    app.post('/api/v1/assets/:id/smart-crop', async (req, res) => {
      try {
        const { id } = req.params;
        const { aspectRatio, focusPoint } = req.body;
        
        const cropped = await smartCrop({
          assetId: id,
          aspectRatio,
          focusPoint
        });
        
        res.json({
          url: cropped.url,
          dimensions: cropped.dimensions,
          focusArea: cropped.focusArea
        });
      } catch (error) {
        logger.error('Smart crop failed:', error);
        res.status(500).json({ error: 'Crop failed' });
      }
    });
    
    // Brand portal
    app.get('/api/v1/brand/portal', async (req, res) => {
      try {
        const portal = await getBrandPortal(req.user);
        
        res.json({
          templates: portal.templates,
          guidelines: portal.guidelines,
          collections: portal.collections,
          recentAssets: portal.recentAssets
        });
      } catch (error) {
        logger.error('Brand portal failed:', error);
        res.status(500).json({ error: 'Portal failed' });
      }
    });
    
    // Publish to channels
    app.post('/api/v1/publish/channels', async (req, res) => {
      try {
        const { assetId, channels, schedule, options } = req.body;
        
        const published = await publishToChannels({
          assetId,
          channels, // ['instagram', 'facebook', 'website', 'cdn']
          schedule,
          options
        });
        
        res.json({
          published: published.success,
          channels: published.channels,
          urls: published.urls
        });
      } catch (error) {
        logger.error('Publishing failed:', error);
        res.status(500).json({ error: 'Publishing failed' });
      }
    });
    
    // Asset analytics
    app.get('/api/v1/assets/:id/analytics', async (req, res) => {
      try {
        const { id } = req.params;
        
        const analytics = await getAssetAnalytics(id);
        
        res.json({
          views: analytics.views,
          downloads: analytics.downloads,
          shares: analytics.shares,
          usage: analytics.usage,
          performance: analytics.performance,
          roi: analytics.roi
        });
      } catch (error) {
        logger.error('Analytics failed:', error);
        res.status(500).json({ error: 'Analytics failed' });
      }
    });
    
    // License management
    app.post('/api/v1/licensing/check', async (req, res) => {
      try {
        const { assetId, usage, territory, duration } = req.body;
        
        const license = await checkLicense({
          assetId,
          usage,
          territory,
          duration
        });
        
        res.json({
          allowed: license.allowed,
          restrictions: license.restrictions,
          cost: license.cost,
          agreement: license.agreement
        });
      } catch (error) {
        logger.error('License check failed:', error);
        res.status(500).json({ error: 'License check failed' });
      }
    });
    
    // Asset search with visual similarity
    app.post('/api/v1/assets/visual-search', upload.single('image'), async (req, res) => {
      try {
        const image = req.file;
        const { threshold, limit } = req.body;
        
        const results = await visualSearch({
          image,
          threshold: threshold || 0.8,
          limit: limit || 20
        });
        
        res.json({
          results: results.assets,
          similarity: results.similarity
        });
      } catch (error) {
        logger.error('Visual search failed:', error);
        res.status(500).json({ error: 'Search failed' });
      }
    });
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        service: 'dam-service',
        assetTypes: Object.keys(ASSET_TYPES),
        collectionTypes: Object.keys(COLLECTION_TYPES),
        features: [
          'asset-management',
          'renditions',
          'smart-crop',
          'brand-portal',
          'multi-channel-publish',
          'visual-search',
          'licensing',
          'analytics'
        ]
      });
    });
    
    app.use(errorHandler);
    
    app.listen(PORT, () => {
      logger.info(`DAM Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start DAM service:', error);
    process.exit(1);
  }
}

// Helper functions
async function processAsset(params: any): Promise<any> {
  return {
    id: `asset-${Date.now()}`,
    title: params.title || params.file.originalname,
    url: `/assets/${Date.now()}`,
    thumbnails: {},
    metadata: {},
    status: 'processing'
  };
}

async function generateRenditions(params: any): Promise<any> {
  return {
    renditions: [],
    urls: {}
  };
}

async function smartCrop(params: any): Promise<any> {
  return {
    url: '',
    dimensions: {},
    focusArea: {}
  };
}

async function getBrandPortal(user: any): Promise<any> {
  return {
    templates: BRAND_PORTAL.templates,
    guidelines: BRAND_PORTAL.guidelines,
    collections: [],
    recentAssets: []
  };
}

async function publishToChannels(params: any): Promise<any> {
  return {
    success: true,
    channels: [],
    urls: {}
  };
}

async function getAssetAnalytics(assetId: string): Promise<any> {
  return {
    views: 0,
    downloads: 0,
    shares: 0,
    usage: [],
    performance: {},
    roi: 0
  };
}

async function checkLicense(params: any): Promise<any> {
  return {
    allowed: true,
    restrictions: [],
    cost: 0,
    agreement: ''
  };
}

async function visualSearch(params: any): Promise<any> {
  return {
    assets: [],
    similarity: []
  };
}

startServer();