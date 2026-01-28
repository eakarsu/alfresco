import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { transformRouter } from './routes/transform.routes';
import { imageRouter } from './routes/image.routes';
import { videoRouter } from './routes/video.routes';
import { audioRouter } from './routes/audio.routes';
import { officeRouter } from './routes/office.routes';
import { pdfRouter } from './routes/pdf.routes';
import { ocrRouter } from './routes/ocr.routes';
import { barcodeRouter } from './routes/barcode.routes';
import { watermarkRouter } from './routes/watermark.routes';
import { metadataRouter } from './routes/metadata.routes';
import { compressionRouter } from './routes/compression.routes';
import { encryptionRouter } from './routes/encryption.routes';
import { signatureRouter } from './routes/signature.routes';
import { conversionRouter } from './routes/conversion.routes';
import { previewRouter } from './routes/preview.routes';
import { startWorkers } from './workers';
import { initializeCache } from './cache/redis';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3004;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '1073741824'), // 1GB default
  }
});

async function startServer() {
  try {
    // Initialize cache
    await initializeCache();
    
    // Start background workers
    await startWorkers();
    
    // Middleware
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ extended: true, limit: '100mb' }));
    
    // Transformation Routes
    app.use('/api/v1/transform', transformRouter);
    app.use('/api/v1/image', imageRouter);
    app.use('/api/v1/video', videoRouter);
    app.use('/api/v1/audio', audioRouter);
    app.use('/api/v1/office', officeRouter);
    app.use('/api/v1/pdf', pdfRouter);
    app.use('/api/v1/ocr', ocrRouter);
    app.use('/api/v1/barcode', barcodeRouter);
    app.use('/api/v1/watermark', watermarkRouter);
    app.use('/api/v1/metadata', metadataRouter);
    app.use('/api/v1/compression', compressionRouter);
    app.use('/api/v1/encryption', encryptionRouter);
    app.use('/api/v1/signature', signatureRouter);
    app.use('/api/v1/conversion', conversionRouter);
    app.use('/api/v1/preview', previewRouter);
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'healthy', service: 'transformation-service' });
    });
    
    // Error handling
    app.use(errorHandler);
    
    app.listen(PORT, () => {
      logger.info(`Transformation Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start transformation service:', error);
    process.exit(1);
  }
}

startServer();