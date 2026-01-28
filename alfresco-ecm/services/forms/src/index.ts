import express from 'express';
import cors from 'cors';
import { formRouter } from './routes/form.routes';
import { designerRouter } from './routes/designer.routes';
import { templateRouter } from './routes/template.routes';
import { validationRouter } from './routes/validation.routes';
import { submissionRouter } from './routes/submission.routes';
import { fieldRouter } from './routes/field.routes';
import { ruleRouter } from './routes/rule.routes';
import { workflowRouter } from './routes/workflow.routes';
import { reportRouter } from './routes/report.routes';
import { connectDatabase } from './database/connection';
import { initializeCache } from './cache/redis';
import { startFormProcessors } from './processors/form.processor';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3011;

// Form Field Types
const FORM_FIELD_TYPES = {
  // Basic Fields
  TEXT: { type: 'text', label: 'Text Field', icon: 'text_fields' },
  TEXTAREA: { type: 'textarea', label: 'Text Area', icon: 'subject' },
  NUMBER: { type: 'number', label: 'Number', icon: 'pin' },
  EMAIL: { type: 'email', label: 'Email', icon: 'email' },
  PASSWORD: { type: 'password', label: 'Password', icon: 'lock' },
  URL: { type: 'url', label: 'URL', icon: 'link' },
  TEL: { type: 'tel', label: 'Phone', icon: 'phone' },
  
  // Selection Fields
  SELECT: { type: 'select', label: 'Dropdown', icon: 'arrow_drop_down' },
  RADIO: { type: 'radio', label: 'Radio Buttons', icon: 'radio_button_checked' },
  CHECKBOX: { type: 'checkbox', label: 'Checkbox', icon: 'check_box' },
  SWITCH: { type: 'switch', label: 'Toggle Switch', icon: 'toggle_on' },
  MULTISELECT: { type: 'multiselect', label: 'Multi-Select', icon: 'checklist' },
  
  // Date & Time
  DATE: { type: 'date', label: 'Date Picker', icon: 'calendar_today' },
  TIME: { type: 'time', label: 'Time Picker', icon: 'schedule' },
  DATETIME: { type: 'datetime', label: 'Date & Time', icon: 'event' },
  DATERANGE: { type: 'daterange', label: 'Date Range', icon: 'date_range' },
  
  // Advanced Fields
  FILE: { type: 'file', label: 'File Upload', icon: 'upload_file' },
  IMAGE: { type: 'image', label: 'Image Upload', icon: 'image' },
  SIGNATURE: { type: 'signature', label: 'Signature', icon: 'draw' },
  LOCATION: { type: 'location', label: 'Location', icon: 'location_on' },
  RICHTEXT: { type: 'richtext', label: 'Rich Text Editor', icon: 'format_color_text' },
  CODE: { type: 'code', label: 'Code Editor', icon: 'code' },
  JSON: { type: 'json', label: 'JSON Editor', icon: 'data_object' },
  
  // Layout Fields
  SECTION: { type: 'section', label: 'Section', icon: 'view_agenda' },
  COLUMNS: { type: 'columns', label: 'Columns', icon: 'view_column' },
  TABS: { type: 'tabs', label: 'Tabs', icon: 'tab' },
  ACCORDION: { type: 'accordion', label: 'Accordion', icon: 'expand_more' },
  DIVIDER: { type: 'divider', label: 'Divider', icon: 'horizontal_rule' },
  
  // Data Fields
  TABLE: { type: 'table', label: 'Data Table', icon: 'table_chart' },
  REPEATER: { type: 'repeater', label: 'Repeater', icon: 'repeat' },
  LOOKUP: { type: 'lookup', label: 'Data Lookup', icon: 'search' },
  AUTOCOMPLETE: { type: 'autocomplete', label: 'Autocomplete', icon: 'auto_complete' },
  
  // Custom Fields
  PEOPLE: { type: 'people', label: 'People Picker', icon: 'people' },
  WORKFLOW: { type: 'workflow', label: 'Workflow Selector', icon: 'account_tree' },
  DOCUMENT: { type: 'document', label: 'Document Picker', icon: 'description' },
  FOLDER: { type: 'folder', label: 'Folder Picker', icon: 'folder' },
  CATEGORY: { type: 'category', label: 'Category Selector', icon: 'category' },
  TAG: { type: 'tag', label: 'Tag Selector', icon: 'label' },
  SITE: { type: 'site', label: 'Site Selector', icon: 'business' }
};

// Form Templates
const FORM_TEMPLATES = {
  'document-review': {
    name: 'Document Review Form',
    description: 'Review and approve documents',
    fields: [
      { type: 'document', name: 'document', label: 'Document to Review', required: true },
      { type: 'select', name: 'decision', label: 'Decision', options: ['Approve', 'Reject', 'Request Changes'], required: true },
      { type: 'textarea', name: 'comments', label: 'Comments', rows: 5 },
      { type: 'people', name: 'reviewers', label: 'Additional Reviewers', multiple: true },
      { type: 'date', name: 'dueDate', label: 'Due Date' }
    ]
  },
  'expense-claim': {
    name: 'Expense Claim Form',
    description: 'Submit expense claims',
    fields: [
      { type: 'text', name: 'title', label: 'Claim Title', required: true },
      { type: 'date', name: 'date', label: 'Expense Date', required: true },
      { type: 'number', name: 'amount', label: 'Amount', required: true, validation: { min: 0 } },
      { type: 'select', name: 'category', label: 'Category', options: ['Travel', 'Meals', 'Accommodation', 'Other'] },
      { type: 'textarea', name: 'description', label: 'Description' },
      { type: 'file', name: 'receipts', label: 'Receipts', multiple: true, accept: 'image/*,application/pdf' }
    ]
  },
  'leave-request': {
    name: 'Leave Request Form',
    description: 'Request time off',
    fields: [
      { type: 'select', name: 'leaveType', label: 'Leave Type', options: ['Vacation', 'Sick', 'Personal', 'Other'] },
      { type: 'daterange', name: 'dates', label: 'Leave Dates', required: true },
      { type: 'number', name: 'days', label: 'Number of Days', readonly: true, calculated: true },
      { type: 'textarea', name: 'reason', label: 'Reason' },
      { type: 'people', name: 'approver', label: 'Approver', required: true },
      { type: 'people', name: 'substitute', label: 'Substitute' }
    ]
  }
};

async function startServer() {
  try {
    await connectDatabase();
    await initializeCache();
    await startFormProcessors();
    
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    
    // Form Routes
    app.use('/api/v1/forms', formRouter);
    app.use('/api/v1/designer', designerRouter);
    app.use('/api/v1/templates', templateRouter);
    app.use('/api/v1/validation', validationRouter);
    app.use('/api/v1/submissions', submissionRouter);
    app.use('/api/v1/fields', fieldRouter);
    app.use('/api/v1/rules', ruleRouter);
    app.use('/api/v1/workflow-forms', workflowRouter);
    app.use('/api/v1/reports', reportRouter);
    
    // Get form field types
    app.get('/api/v1/field-types', (req, res) => {
      res.json({ fieldTypes: FORM_FIELD_TYPES });
    });
    
    // Get form templates
    app.get('/api/v1/templates/library', (req, res) => {
      res.json({ templates: FORM_TEMPLATES });
    });
    
    // Create form from template
    app.post('/api/v1/forms/from-template', async (req, res) => {
      try {
        const { templateId, name, workflowId } = req.body;
        const template = FORM_TEMPLATES[templateId];
        
        if (!template) {
          return res.status(404).json({ error: 'Template not found' });
        }
        
        const form = {
          id: `form-${Date.now()}`,
          name: name || template.name,
          description: template.description,
          fields: template.fields,
          workflowId,
          version: 1,
          status: 'draft',
          createdAt: new Date(),
          createdBy: req.user?.id
        };
        
        res.json({ form });
      } catch (error) {
        logger.error('Failed to create form from template:', error);
        res.status(500).json({ error: 'Failed to create form' });
      }
    });
    
    // Form Designer API
    app.post('/api/v1/designer/save', async (req, res) => {
      try {
        const { formId, schema, layout, rules, validation } = req.body;
        
        const savedForm = {
          id: formId || `form-${Date.now()}`,
          schema,
          layout,
          rules,
          validation,
          version: 1,
          updatedAt: new Date(),
          updatedBy: req.user?.id
        };
        
        res.json({ form: savedForm });
      } catch (error) {
        logger.error('Failed to save form:', error);
        res.status(500).json({ error: 'Failed to save form' });
      }
    });
    
    // Form validation
    app.post('/api/v1/validation/validate', async (req, res) => {
      try {
        const { formId, data } = req.body;
        
        // Validate form data
        const validationResult = await validateFormData(formId, data);
        
        res.json({
          valid: validationResult.valid,
          errors: validationResult.errors,
          warnings: validationResult.warnings
        });
      } catch (error) {
        logger.error('Validation failed:', error);
        res.status(500).json({ error: 'Validation failed' });
      }
    });
    
    // Submit form
    app.post('/api/v1/submissions/submit', async (req, res) => {
      try {
        const { formId, data, attachments, action } = req.body;
        
        const submission = {
          id: `submission-${Date.now()}`,
          formId,
          data,
          attachments,
          action,
          status: 'submitted',
          submittedAt: new Date(),
          submittedBy: req.user?.id
        };
        
        // Process submission
        const result = await processFormSubmission(submission);
        
        res.json({
          submission,
          result: {
            workflowStarted: result.workflowStarted,
            taskId: result.taskId,
            nextStep: result.nextStep
          }
        });
      } catch (error) {
        logger.error('Submission failed:', error);
        res.status(500).json({ error: 'Submission failed' });
      }
    });
    
    // Form analytics
    app.get('/api/v1/forms/:id/analytics', async (req, res) => {
      try {
        const { id } = req.params;
        
        const analytics = await getFormAnalytics(id);
        
        res.json({
          submissions: analytics.submissions,
          averageCompletionTime: analytics.averageCompletionTime,
          fieldUsage: analytics.fieldUsage,
          errorRate: analytics.errorRate,
          abandonmentRate: analytics.abandonmentRate
        });
      } catch (error) {
        logger.error('Failed to get analytics:', error);
        res.status(500).json({ error: 'Failed to get analytics' });
      }
    });
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        service: 'forms-service',
        fieldTypes: Object.keys(FORM_FIELD_TYPES).length,
        templates: Object.keys(FORM_TEMPLATES).length
      });
    });
    
    app.use(errorHandler);
    
    app.listen(PORT, () => {
      logger.info(`Forms Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start forms service:', error);
    process.exit(1);
  }
}

async function validateFormData(formId: string, data: any): Promise<any> {
  return { valid: true, errors: [], warnings: [] };
}

async function processFormSubmission(submission: any): Promise<any> {
  return { workflowStarted: true, taskId: 'task-123', nextStep: 'review' };
}

async function getFormAnalytics(formId: string): Promise<any> {
  return {
    submissions: 0,
    averageCompletionTime: 0,
    fieldUsage: {},
    errorRate: 0,
    abandonmentRate: 0
  };
}

startServer();