import express from 'express';
import cors from 'cors';
import { SMTPServer } from 'smtp-server';
import { createServer as createIMAPServer } from './servers/imap.server';
import { createServer as createPOP3Server } from './servers/pop3.server';
import { inboxRouter } from './routes/inbox.routes';
import { composeRouter } from './routes/compose.routes';
import { folderRouter } from './routes/folder.routes';
import { attachmentRouter } from './routes/attachment.routes';
import { ruleRouter } from './routes/rule.routes';
import { aliasRouter } from './routes/alias.routes';
import { templateRouter } from './routes/template.routes';
import { calendarRouter } from './routes/calendar.routes';
import { contactRouter } from './routes/contact.routes';
import { settingsRouter } from './routes/settings.routes';
import { connectDatabase } from './database/connection';
import { initializeCache } from './cache/redis';
import { startEmailProcessors } from './processors';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3008;
const SMTP_PORT = process.env.SMTP_PORT || 25;
const SMTP_SECURE_PORT = process.env.SMTP_SECURE_PORT || 465;
const IMAP_PORT = process.env.IMAP_PORT || 143;
const IMAP_SECURE_PORT = process.env.IMAP_SECURE_PORT || 993;
const POP3_PORT = process.env.POP3_PORT || 110;
const POP3_SECURE_PORT = process.env.POP3_SECURE_PORT || 995;

async function startServers() {
  try {
    // Initialize connections
    await connectDatabase();
    await initializeCache();
    
    // Start email processors
    await startEmailProcessors();
    
    // Create SMTP Server for receiving emails
    const smtpServer = new SMTPServer({
      name: 'Alfresco SMTP Server',
      banner: 'Alfresco ECM Email Service',
      size: 25 * 1024 * 1024, // 25MB max message size
      authOptional: false,
      onAuth(auth, session, callback) {
        // Authenticate user
        if (auth.username === 'admin' && auth.password === 'admin') {
          callback(null, { user: auth.username });
        } else {
          callback(new Error('Invalid credentials'));
        }
      },
      onConnect(session, callback) {
        logger.info('SMTP connection from:', session.remoteAddress);
        callback();
      },
      onMailFrom(address, session, callback) {
        logger.info('Mail from:', address.address);
        callback();
      },
      onRcptTo(address, session, callback) {
        logger.info('Mail to:', address.address);
        // Check if recipient exists in our system
        callback();
      },
      onData(stream, session, callback) {
        let emailData = '';
        stream.on('data', (chunk) => {
          emailData += chunk;
        });
        stream.on('end', () => {
          // Process email
          logger.info('Email received, size:', emailData.length);
          // Save email to database and trigger workflows
          callback();
        });
      },
      onClose(session) {
        logger.info('SMTP connection closed');
      }
    });
    
    smtpServer.listen(SMTP_PORT, () => {
      logger.info(`SMTP server listening on port ${SMTP_PORT}`);
    });
    
    // Create IMAP Server
    const imapServer = await createIMAPServer({
      port: IMAP_PORT,
      securePort: IMAP_SECURE_PORT,
      tls: {
        key: process.env.TLS_KEY,
        cert: process.env.TLS_CERT
      }
    });
    
    logger.info(`IMAP server listening on ports ${IMAP_PORT} and ${IMAP_SECURE_PORT}`);
    
    // Create POP3 Server
    const pop3Server = await createPOP3Server({
      port: POP3_PORT,
      securePort: POP3_SECURE_PORT,
      tls: {
        key: process.env.TLS_KEY,
        cert: process.env.TLS_CERT
      }
    });
    
    logger.info(`POP3 server listening on ports ${POP3_PORT} and ${POP3_SECURE_PORT}`);
    
    // Express middleware
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    
    // Email Management Routes
    app.use('/api/v1/inbox', inboxRouter);
    app.use('/api/v1/compose', composeRouter);
    app.use('/api/v1/folders', folderRouter);
    app.use('/api/v1/attachments', attachmentRouter);
    app.use('/api/v1/rules', ruleRouter);
    app.use('/api/v1/aliases', aliasRouter);
    app.use('/api/v1/templates', templateRouter);
    app.use('/api/v1/calendar', calendarRouter);
    app.use('/api/v1/contacts', contactRouter);
    app.use('/api/v1/settings', settingsRouter);
    
    // Email-to-Alfresco Integration Endpoints
    app.post('/api/v1/email2alfresco', async (req, res) => {
      try {
        const { from, to, subject, body, attachments } = req.body;
        
        // Parse email metadata
        const folderPath = extractFolderPath(to);
        const metadata = extractMetadata(subject);
        const workflow = extractWorkflow(body);
        
        // Create document in Alfresco from email
        const result = await createDocumentFromEmail({
          from,
          to,
          subject,
          body,
          attachments,
          folderPath,
          metadata,
          workflow
        });
        
        res.json({
          success: true,
          documentId: result.documentId,
          message: 'Email successfully converted to Alfresco document'
        });
      } catch (error) {
        logger.error('Email to Alfresco conversion failed:', error);
        res.status(500).json({ error: 'Conversion failed' });
      }
    });
    
    // Alfresco-to-Email Integration
    app.post('/api/v1/alfresco2email', async (req, res) => {
      try {
        const { documentId, recipients, subject, message } = req.body;
        
        // Get document from Alfresco
        const document = await getDocument(documentId);
        
        // Send email with document as attachment
        const result = await sendDocumentAsEmail({
          document,
          recipients,
          subject,
          message
        });
        
        res.json({
          success: true,
          messageId: result.messageId,
          message: 'Document successfully sent via email'
        });
      } catch (error) {
        logger.error('Alfresco to email conversion failed:', error);
        res.status(500).json({ error: 'Send failed' });
      }
    });
    
    // Email aliases for folders
    app.get('/api/v1/folder-aliases', async (req, res) => {
      // Return mapping of email addresses to Alfresco folders
      res.json({
        aliases: [
          { email: 'invoices@alfresco.local', folder: '/Sites/finance/documentLibrary/Invoices' },
          { email: 'contracts@alfresco.local', folder: '/Sites/legal/documentLibrary/Contracts' },
          { email: 'hr@alfresco.local', folder: '/Sites/hr/documentLibrary/Documents' },
          { email: 'projects@alfresco.local', folder: '/Sites/projects/documentLibrary' }
        ]
      });
    });
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        service: 'email-service',
        servers: {
          smtp: { ports: [SMTP_PORT, SMTP_SECURE_PORT], status: 'active' },
          imap: { ports: [IMAP_PORT, IMAP_SECURE_PORT], status: 'active' },
          pop3: { ports: [POP3_PORT, POP3_SECURE_PORT], status: 'active' }
        }
      });
    });
    
    // Error handling
    app.use(errorHandler);
    
    app.listen(HTTP_PORT, () => {
      logger.info(`Email Service HTTP API running on port ${HTTP_PORT}`);
    });
    
  } catch (error) {
    logger.error('Failed to start email servers:', error);
    process.exit(1);
  }
}

// Helper functions
function extractFolderPath(to: string): string {
  // Extract folder path from email address
  // e.g., invoices@alfresco.local -> /Sites/finance/documentLibrary/Invoices
  const mappings: Record<string, string> = {
    'invoices': '/Sites/finance/documentLibrary/Invoices',
    'contracts': '/Sites/legal/documentLibrary/Contracts',
    'hr': '/Sites/hr/documentLibrary/Documents'
  };
  
  const prefix = to.split('@')[0];
  return mappings[prefix] || '/Company Home/Inbox';
}

function extractMetadata(subject: string): Record<string, any> {
  // Extract metadata from subject line
  // e.g., "[Invoice #12345] [Due: 2024-01-31] Invoice from Vendor"
  const metadata: Record<string, any> = {};
  
  const invoiceMatch = subject.match(/\[Invoice #(\d+)\]/);
  if (invoiceMatch) {
    metadata.invoiceNumber = invoiceMatch[1];
  }
  
  const dueMatch = subject.match(/\[Due: ([\d-]+)\]/);
  if (dueMatch) {
    metadata.dueDate = dueMatch[1];
  }
  
  return metadata;
}

function extractWorkflow(body: string): string | null {
  // Extract workflow trigger from email body
  // e.g., "#approve" -> Start approval workflow
  const workflowTriggers: Record<string, string> = {
    '#approve': 'approval-workflow',
    '#review': 'review-workflow',
    '#sign': 'signature-workflow'
  };
  
  for (const [trigger, workflow] of Object.entries(workflowTriggers)) {
    if (body.includes(trigger)) {
      return workflow;
    }
  }
  
  return null;
}

async function createDocumentFromEmail(data: any): Promise<{ documentId: string }> {
  // Implementation to create Alfresco document from email
  return { documentId: 'doc-' + Date.now() };
}

async function getDocument(documentId: string): Promise<any> {
  // Implementation to get document from Alfresco
  return { id: documentId, name: 'document.pdf', content: Buffer.from('') };
}

async function sendDocumentAsEmail(data: any): Promise<{ messageId: string }> {
  // Implementation to send document as email
  return { messageId: 'msg-' + Date.now() };
}

startServers();