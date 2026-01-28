import express from 'express';
import cors from 'cors';
import { classificationRouter } from './routes/classification.routes';
import { extractionRouter } from './routes/extraction.routes';
import { recognitionRouter } from './routes/recognition.routes';
import { nlpRouter } from './routes/nlp.routes';
import { generationRouter } from './routes/generation.routes';
import { translationRouter } from './routes/translation.routes';
import { recommendationRouter } from './routes/recommendation.routes';
import { searchRouter } from './routes/search.routes';
import { connectDatabase } from './database/connection';
import { initializeCache } from './cache/redis';
import { initializeAIModels } from './models/initialize';
import { startAIProcessors } from './processors/ai.processor';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3013;

// AI Capabilities
const AI_CAPABILITIES = {
  // Document Intelligence
  'auto-classification': {
    name: 'Auto Classification',
    description: 'Automatically classify documents based on content',
    models: ['bert-classifier', 'custom-taxonomy-model'],
    accuracy: 0.95
  },
  'metadata-extraction': {
    name: 'Metadata Extraction',
    description: 'Extract structured data from unstructured documents',
    models: ['ner-model', 'entity-extraction'],
    supported: ['invoices', 'contracts', 'resumes', 'forms']
  },
  'smart-tagging': {
    name: 'Smart Tagging',
    description: 'Generate relevant tags automatically',
    models: ['keyword-extraction', 'topic-modeling'],
    maxTags: 10
  },
  
  // Content Understanding
  'document-summarization': {
    name: 'Document Summarization',
    description: 'Generate concise summaries of long documents',
    models: ['bart-large', 't5-summarization'],
    lengths: ['short', 'medium', 'long']
  },
  'sentiment-analysis': {
    name: 'Sentiment Analysis',
    description: 'Analyze emotional tone of content',
    models: ['sentiment-bert', 'emotion-detection'],
    emotions: ['positive', 'negative', 'neutral', 'joy', 'anger', 'sadness']
  },
  'language-detection': {
    name: 'Language Detection',
    description: 'Identify document language',
    models: ['language-identification'],
    languages: 100
  },
  
  // Visual Intelligence
  'ocr-plus': {
    name: 'Advanced OCR',
    description: 'Extract text from images and scanned documents',
    models: ['tesseract-v5', 'paddleocr'],
    languages: 50
  },
  'image-recognition': {
    name: 'Image Recognition',
    description: 'Identify objects, scenes, and faces in images',
    models: ['yolov8', 'detectron2', 'face-recognition'],
    categories: 1000
  },
  'video-analysis': {
    name: 'Video Analysis',
    description: 'Analyze video content for objects, actions, and scenes',
    models: ['video-transformer', 'action-recognition'],
    fps: 30
  },
  
  // Search & Discovery
  'semantic-search': {
    name: 'Semantic Search',
    description: 'Understanding-based search beyond keywords',
    models: ['sentence-transformers', 'dense-retrieval'],
    embeddings: 768
  },
  'similar-content': {
    name: 'Similar Content Discovery',
    description: 'Find related documents based on content similarity',
    models: ['doc2vec', 'content-similarity'],
    threshold: 0.8
  },
  'duplicate-detection': {
    name: 'Duplicate Detection',
    description: 'Identify duplicate and near-duplicate content',
    models: ['simhash', 'minhash-lsh'],
    similarity: 0.95
  },
  
  // Content Generation
  'auto-description': {
    name: 'Auto Description',
    description: 'Generate descriptions for documents',
    models: ['gpt-3.5', 'claude-2'],
    maxLength: 500
  },
  'translation': {
    name: 'Neural Translation',
    description: 'Translate documents between languages',
    models: ['mbart', 'google-translate'],
    languages: 100
  },
  'content-enrichment': {
    name: 'Content Enrichment',
    description: 'Add context and related information',
    models: ['knowledge-graph', 'entity-linking'],
    sources: ['wikipedia', 'wikidata', 'custom-kb']
  },
  
  // Compliance & Security
  'pii-detection': {
    name: 'PII Detection',
    description: 'Identify personal information in documents',
    models: ['pii-bert', 'presidio'],
    types: ['ssn', 'credit-card', 'email', 'phone', 'address']
  },
  'content-moderation': {
    name: 'Content Moderation',
    description: 'Detect inappropriate or sensitive content',
    models: ['toxicity-detection', 'nsfw-classifier'],
    categories: ['toxic', 'threat', 'insult', 'explicit']
  },
  'compliance-check': {
    name: 'Compliance Check',
    description: 'Verify content meets regulatory requirements',
    models: ['regulation-matcher', 'policy-validator'],
    regulations: ['gdpr', 'hipaa', 'sox', 'pci-dss']
  }
};

async function startServer() {
  try {
    await connectDatabase();
    await initializeCache();
    await initializeAIModels();
    await startAIProcessors();
    
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ extended: true, limit: '100mb' }));
    
    // AI Routes
    app.use('/api/v1/classification', classificationRouter);
    app.use('/api/v1/extraction', extractionRouter);
    app.use('/api/v1/recognition', recognitionRouter);
    app.use('/api/v1/nlp', nlpRouter);
    app.use('/api/v1/generation', generationRouter);
    app.use('/api/v1/translation', translationRouter);
    app.use('/api/v1/recommendation', recommendationRouter);
    app.use('/api/v1/search', searchRouter);
    
    // Get AI capabilities
    app.get('/api/v1/capabilities', (req, res) => {
      res.json({ capabilities: AI_CAPABILITIES });
    });
    
    // Auto-classify document
    app.post('/api/v1/classify/auto', async (req, res) => {
      try {
        const { documentId, content, taxonomyId } = req.body;
        
        const classification = await classifyDocument({
          documentId,
          content,
          taxonomyId
        });
        
        res.json({
          documentId,
          classification: {
            category: classification.category,
            confidence: classification.confidence,
            subcategories: classification.subcategories,
            suggestedTags: classification.suggestedTags,
            metadata: classification.metadata
          }
        });
      } catch (error) {
        logger.error('Classification failed:', error);
        res.status(500).json({ error: 'Classification failed' });
      }
    });
    
    // Extract entities and metadata
    app.post('/api/v1/extract/entities', async (req, res) => {
      try {
        const { content, documentType } = req.body;
        
        const extraction = await extractEntities({
          content,
          documentType
        });
        
        res.json({
          entities: extraction.entities,
          metadata: extraction.metadata,
          relationships: extraction.relationships,
          keyPhrases: extraction.keyPhrases
        });
      } catch (error) {
        logger.error('Extraction failed:', error);
        res.status(500).json({ error: 'Extraction failed' });
      }
    });
    
    // Content summarization
    app.post('/api/v1/nlp/summarize', async (req, res) => {
      try {
        const { content, length, format } = req.body;
        
        const summary = await summarizeContent({
          content,
          length: length || 'medium',
          format: format || 'paragraph'
        });
        
        res.json({
          summary: summary.text,
          keyPoints: summary.keyPoints,
          readingTime: summary.readingTime
        });
      } catch (error) {
        logger.error('Summarization failed:', error);
        res.status(500).json({ error: 'Summarization failed' });
      }
    });
    
    // Semantic search
    app.post('/api/v1/search/semantic', async (req, res) => {
      try {
        const { query, filters, limit } = req.body;
        
        const results = await semanticSearch({
          query,
          filters,
          limit: limit || 10
        });
        
        res.json({
          results: results.items,
          totalCount: results.totalCount,
          queryUnderstanding: results.queryUnderstanding,
          suggestions: results.suggestions
        });
      } catch (error) {
        logger.error('Semantic search failed:', error);
        res.status(500).json({ error: 'Search failed' });
      }
    });
    
    // Content recommendations
    app.get('/api/v1/recommendations/:userId', async (req, res) => {
      try {
        const { userId } = req.params;
        const { type, limit } = req.query;
        
        const recommendations = await getRecommendations({
          userId,
          type: type as string,
          limit: parseInt(limit as string) || 10
        });
        
        res.json({
          recommendations: recommendations.items,
          reasoning: recommendations.reasoning,
          personalizationScore: recommendations.personalizationScore
        });
      } catch (error) {
        logger.error('Recommendations failed:', error);
        res.status(500).json({ error: 'Recommendations failed' });
      }
    });
    
    // PII detection and redaction
    app.post('/api/v1/compliance/pii', async (req, res) => {
      try {
        const { content, action } = req.body;
        
        const piiResult = await detectPII({
          content,
          action: action || 'detect'
        });
        
        res.json({
          detected: piiResult.detected,
          redacted: piiResult.redacted,
          entities: piiResult.entities,
          riskScore: piiResult.riskScore
        });
      } catch (error) {
        logger.error('PII detection failed:', error);
        res.status(500).json({ error: 'Detection failed' });
      }
    });
    
    // Content moderation
    app.post('/api/v1/moderation/check', async (req, res) => {
      try {
        const { content, policy } = req.body;
        
        const moderation = await moderateContent({
          content,
          policy: policy || 'standard'
        });
        
        res.json({
          safe: moderation.safe,
          flags: moderation.flags,
          score: moderation.score,
          recommendations: moderation.recommendations
        });
      } catch (error) {
        logger.error('Moderation failed:', error);
        res.status(500).json({ error: 'Moderation failed' });
      }
    });
    
    // Document Q&A
    app.post('/api/v1/nlp/qa', async (req, res) => {
      try {
        const { documentId, question } = req.body;
        
        const answer = await answerQuestion({
          documentId,
          question
        });
        
        res.json({
          answer: answer.text,
          confidence: answer.confidence,
          sources: answer.sources,
          relatedQuestions: answer.relatedQuestions
        });
      } catch (error) {
        logger.error('Q&A failed:', error);
        res.status(500).json({ error: 'Q&A failed' });
      }
    });
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        service: 'ai-service',
        capabilities: Object.keys(AI_CAPABILITIES).length,
        models: 'loaded',
        gpu: process.env.GPU_ENABLED === 'true'
      });
    });
    
    app.use(errorHandler);
    
    app.listen(PORT, () => {
      logger.info(`AI Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start AI service:', error);
    process.exit(1);
  }
}

// AI Helper functions
async function classifyDocument(params: any): Promise<any> {
  // Implement document classification
  return {
    category: 'Finance',
    confidence: 0.95,
    subcategories: ['Invoice', 'Purchase Order'],
    suggestedTags: ['Q1-2024', 'vendor-abc'],
    metadata: {}
  };
}

async function extractEntities(params: any): Promise<any> {
  // Implement entity extraction
  return {
    entities: [],
    metadata: {},
    relationships: [],
    keyPhrases: []
  };
}

async function summarizeContent(params: any): Promise<any> {
  // Implement content summarization
  return {
    text: '',
    keyPoints: [],
    readingTime: 0
  };
}

async function semanticSearch(params: any): Promise<any> {
  // Implement semantic search
  return {
    items: [],
    totalCount: 0,
    queryUnderstanding: {},
    suggestions: []
  };
}

async function getRecommendations(params: any): Promise<any> {
  // Implement recommendations
  return {
    items: [],
    reasoning: '',
    personalizationScore: 0
  };
}

async function detectPII(params: any): Promise<any> {
  // Implement PII detection
  return {
    detected: false,
    redacted: '',
    entities: [],
    riskScore: 0
  };
}

async function moderateContent(params: any): Promise<any> {
  // Implement content moderation
  return {
    safe: true,
    flags: [],
    score: 0,
    recommendations: []
  };
}

async function answerQuestion(params: any): Promise<any> {
  // Implement Q&A
  return {
    text: '',
    confidence: 0,
    sources: [],
    relatedQuestions: []
  };
}

startServer();