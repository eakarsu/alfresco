// Comprehensive Test Data Generator
// Generates dynamic test data for all scenarios

const crypto = require('crypto');
const { faker } = require('@faker-js/faker');

class TestDataGenerator {
  constructor() {
    this.counters = {
      users: 0,
      documents: 0,
      folders: 0,
      workflows: 0,
      tasks: 0,
      sites: 0
    };
  }

  // ========================================
  // USER DATA GENERATION
  // ========================================

  generateValidUsers(count = 100) {
    const users = [];
    const roles = ['admin', 'manager', 'user', 'viewer'];
    const statuses = ['active', 'inactive', 'pending', 'suspended'];
    
    for (let i = 0; i < count; i++) {
      users.push({
        id: `usr_${++this.counters.users}`,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: this.generatePassword(),
        fullName: faker.person.fullName(),
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        department: faker.commerce.department(),
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
        preferences: {
          theme: ['light', 'dark'][Math.floor(Math.random() * 2)],
          language: ['en', 'es', 'fr', 'de', 'it'][Math.floor(Math.random() * 5)],
          notifications: Math.random() > 0.5,
          timezone: faker.location.timeZone()
        },
        metadata: {
          lastLogin: faker.date.recent(),
          loginCount: faker.number.int({ min: 0, max: 1000 }),
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
          lastPasswordChange: faker.date.past()
        }
      });
    }
    
    return users;
  }

  generateInvalidUsers(count = 50) {
    const invalidUsers = [];
    
    // Missing required fields
    invalidUsers.push({
      id: `invalid_usr_${++this.counters.users}`,
      email: faker.internet.email() // Missing username
    });
    
    // Invalid email format
    invalidUsers.push({
      id: `invalid_usr_${++this.counters.users}`,
      username: faker.internet.userName(),
      email: 'not-an-email'
    });
    
    // SQL injection attempts
    invalidUsers.push({
      id: `invalid_usr_${++this.counters.users}`,
      username: "admin'; DROP TABLE users;--",
      email: faker.internet.email()
    });
    
    // XSS attempts
    invalidUsers.push({
      id: `invalid_usr_${++this.counters.users}`,
      username: '<script>alert("XSS")</script>',
      email: faker.internet.email(),
      fullName: '<img src=x onerror=alert("XSS")>'
    });
    
    // Extremely long values
    invalidUsers.push({
      id: `invalid_usr_${++this.counters.users}`,
      username: 'a'.repeat(1000),
      email: 'a'.repeat(500) + '@test.com'
    });
    
    // Null/undefined values
    invalidUsers.push({
      id: null,
      username: undefined,
      email: null
    });
    
    // Duplicate IDs
    for (let i = 0; i < 5; i++) {
      invalidUsers.push({
        id: 'duplicate_id',
        username: `dup_user_${i}`,
        email: `dup${i}@test.com`
      });
    }
    
    // Invalid data types
    invalidUsers.push({
      id: 12345, // Should be string
      username: { nested: 'object' }, // Should be string
      email: ['array@test.com'], // Should be string
      status: 'invalid_status'
    });
    
    return invalidUsers;
  }

  generateBoundaryUsers() {
    return [
      // Minimum valid user
      {
        id: 'min',
        username: 'a',
        email: 'a@b.c',
        role: 'user',
        status: 'active'
      },
      // Maximum field lengths
      {
        id: 'x'.repeat(50),
        username: 'u'.repeat(100),
        email: 'e'.repeat(245) + '@test.com',
        fullName: 'n'.repeat(255),
        role: 'user',
        status: 'active'
      },
      // Unicode characters
      {
        id: 'unicode_usr',
        username: '用户名',
        email: 'test@测试.com',
        fullName: '🎉 Emoji User 🚀',
        role: 'user',
        status: 'active'
      },
      // Special characters
      {
        id: 'special_usr',
        username: 'user-name_123.test',
        email: 'user+tag@sub.domain.com',
        fullName: "O'Neill-Smith, Jr.",
        role: 'user',
        status: 'active'
      }
    ];
  }

  // ========================================
  // DOCUMENT DATA GENERATION
  // ========================================

  generateValidDocuments(count = 500) {
    const documents = [];
    const mimeTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.ms-word',
      'text/plain',
      'image/png',
      'image/jpeg',
      'video/mp4',
      'application/zip'
    ];
    const statuses = ['draft', 'published', 'archived', 'deleted'];
    
    for (let i = 0; i < count; i++) {
      const mimeType = mimeTypes[Math.floor(Math.random() * mimeTypes.length)];
      documents.push({
        id: `doc_${++this.counters.documents}`,
        title: faker.system.fileName(),
        description: faker.lorem.paragraph(),
        folderId: `fld_${Math.floor(Math.random() * 10) + 1}`,
        ownerId: `usr_${Math.floor(Math.random() * 100) + 1}`,
        filePath: `/storage/${faker.system.filePath()}`,
        fileSize: faker.number.int({ min: 0, max: 104857600 }), // Up to 100MB
        mimeType: mimeType,
        extension: this.getExtensionFromMime(mimeType),
        version: `${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        tags: faker.lorem.words(5).split(' '),
        metadata: {
          author: faker.person.fullName(),
          created: faker.date.past(),
          modified: faker.date.recent(),
          accessed: faker.date.recent(),
          checksum: this.generateChecksum(),
          thumbnail: faker.image.url(),
          preview: faker.image.url()
        },
        permissions: {
          read: ['public', 'private', 'restricted'][Math.floor(Math.random() * 3)],
          write: ['owner', 'group', 'none'][Math.floor(Math.random() * 3)],
          delete: ['owner', 'admin', 'none'][Math.floor(Math.random() * 3)]
        },
        versions: this.generateVersionHistory(faker.number.int({ min: 1, max: 10 }))
      });
    }
    
    return documents;
  }

  generateVersionHistory(count) {
    const versions = [];
    for (let i = 1; i <= count; i++) {
      versions.push({
        version: `${i}.0`,
        createdBy: `usr_${Math.floor(Math.random() * 100) + 1}`,
        createdAt: faker.date.past(),
        comment: faker.lorem.sentence(),
        size: faker.number.int({ min: 1000, max: 10000000 }),
        checksum: this.generateChecksum()
      });
    }
    return versions;
  }

  generateInvalidDocuments() {
    return [
      // Missing required fields
      { id: 'invalid_doc_1', title: null },
      { id: 'invalid_doc_2', folderId: 'non_existent_folder' },
      
      // Invalid file sizes
      { id: 'invalid_doc_3', title: 'Negative Size', fileSize: -1 },
      { id: 'invalid_doc_4', title: 'Huge File', fileSize: Number.MAX_SAFE_INTEGER },
      
      // Invalid MIME types
      { id: 'invalid_doc_5', title: 'Bad MIME', mimeType: 'not/a/mime' },
      { id: 'invalid_doc_6', title: 'Empty MIME', mimeType: '' },
      
      // Path traversal attempts
      { id: 'invalid_doc_7', title: 'Path Traversal', filePath: '../../../etc/passwd' },
      { id: 'invalid_doc_8', title: 'Absolute Path', filePath: '/etc/shadow' },
      
      // Invalid characters in title
      { id: 'invalid_doc_9', title: 'Title\0with\0nulls' },
      { id: 'invalid_doc_10', title: '../../etc/passwd' }
    ];
  }

  // ========================================
  // WORKFLOW DATA GENERATION
  // ========================================

  generateWorkflows(count = 50) {
    const workflows = [];
    const workflowTypes = [
      'document_approval',
      'content_publishing',
      'invoice_processing',
      'employee_onboarding',
      'contract_review',
      'change_request',
      'incident_management'
    ];
    
    for (let i = 0; i < count; i++) {
      const type = workflowTypes[Math.floor(Math.random() * workflowTypes.length)];
      workflows.push({
        id: `wf_${++this.counters.workflows}`,
        name: `${faker.company.buzzPhrase()} Workflow`,
        type: type,
        description: faker.lorem.paragraph(),
        definition: this.generateWorkflowDefinition(type),
        status: ['active', 'inactive', 'deprecated'][Math.floor(Math.random() * 3)],
        createdBy: `usr_${Math.floor(Math.random() * 100) + 1}`,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        instances: this.generateWorkflowInstances(faker.number.int({ min: 0, max: 20 }))
      });
    }
    
    return workflows;
  }

  generateWorkflowDefinition(type) {
    const definitions = {
      document_approval: {
        nodes: ['start', 'upload', 'review', 'approve', 'publish', 'end'],
        connections: [
          { from: 'start', to: 'upload' },
          { from: 'upload', to: 'review' },
          { from: 'review', to: 'approve' },
          { from: 'approve', to: 'publish' },
          { from: 'publish', to: 'end' }
        ],
        rules: {
          timeout: '7d',
          escalation: 'manager',
          parallel: false
        }
      },
      invoice_processing: {
        nodes: ['start', 'submit', 'validate', 'approve', 'payment', 'archive', 'end'],
        connections: [
          { from: 'start', to: 'submit' },
          { from: 'submit', to: 'validate' },
          { from: 'validate', to: 'approve' },
          { from: 'approve', to: 'payment' },
          { from: 'payment', to: 'archive' },
          { from: 'archive', to: 'end' }
        ],
        rules: {
          timeout: '30d',
          escalation: 'finance_head',
          parallel: false,
          approvalThreshold: 50000
        }
      }
    };
    
    return definitions[type] || definitions.document_approval;
  }

  generateWorkflowInstances(count) {
    const instances = [];
    const statuses = ['pending', 'in_progress', 'completed', 'failed', 'cancelled'];
    
    for (let i = 0; i < count; i++) {
      instances.push({
        id: `wfi_${++this.counters.tasks}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        currentStep: faker.helpers.arrayElement(['review', 'approve', 'publish']),
        startedBy: `usr_${Math.floor(Math.random() * 100) + 1}`,
        startedAt: faker.date.past(),
        completedAt: Math.random() > 0.5 ? faker.date.recent() : null,
        variables: {
          priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
          documentId: `doc_${Math.floor(Math.random() * 500) + 1}`,
          assignee: `usr_${Math.floor(Math.random() * 100) + 1}`,
          dueDate: faker.date.future()
        }
      });
    }
    
    return instances;
  }

  // ========================================
  // PERFORMANCE TEST DATA
  // ========================================

  generateLargeDataset() {
    return {
      users: this.generateValidUsers(10000),
      documents: this.generateValidDocuments(50000),
      workflows: this.generateWorkflows(5000),
      auditLogs: this.generateAuditLogs(100000),
      searchIndex: this.generateSearchIndex(50000)
    };
  }

  generateAuditLogs(count = 10000) {
    const logs = [];
    const actions = ['create', 'read', 'update', 'delete', 'login', 'logout', 'download', 'share'];
    const resources = ['document', 'folder', 'user', 'workflow', 'site'];
    
    for (let i = 0; i < count; i++) {
      logs.push({
        id: `audit_${i}`,
        userId: `usr_${Math.floor(Math.random() * 100) + 1}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        resourceType: resources[Math.floor(Math.random() * resources.length)],
        resourceId: `res_${Math.floor(Math.random() * 1000) + 1}`,
        timestamp: faker.date.recent(),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        success: Math.random() > 0.1,
        details: {
          before: faker.lorem.words(5),
          after: faker.lorem.words(5),
          duration: faker.number.int({ min: 10, max: 5000 })
        }
      });
    }
    
    return logs;
  }

  generateSearchIndex(count = 10000) {
    const index = [];
    
    for (let i = 0; i < count; i++) {
      index.push({
        id: `idx_${i}`,
        type: ['document', 'folder', 'site', 'user'][Math.floor(Math.random() * 4)],
        title: faker.lorem.words(5),
        content: faker.lorem.paragraphs(3),
        tags: faker.lorem.words(10).split(' '),
        path: faker.system.filePath(),
        score: Math.random(),
        highlights: faker.lorem.sentences(2).split('.'),
        metadata: {
          author: faker.person.fullName(),
          created: faker.date.past(),
          modified: faker.date.recent(),
          size: faker.number.int({ min: 1000, max: 10000000 })
        }
      });
    }
    
    return index;
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  generatePassword(length = 12) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  }

  generateChecksum() {
    return crypto.randomBytes(32).toString('hex');
  }

  getExtensionFromMime(mimeType) {
    const mimeMap = {
      'application/pdf': 'pdf',
      'application/vnd.ms-excel': 'xlsx',
      'application/vnd.ms-word': 'docx',
      'text/plain': 'txt',
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'video/mp4': 'mp4',
      'application/zip': 'zip'
    };
    return mimeMap[mimeType] || 'bin';
  }

  // ========================================
  // CONCURRENT USER SCENARIOS
  // ========================================

  generateConcurrentScenarios() {
    const scenarios = [];
    
    // Multiple users editing same document
    for (let i = 0; i < 10; i++) {
      scenarios.push({
        type: 'concurrent_edit',
        users: [`usr_${i + 1}`, `usr_${i + 2}`, `usr_${i + 3}`],
        documentId: 'doc_shared_1',
        actions: [
          { user: 0, action: 'lock', timestamp: 0 },
          { user: 1, action: 'try_lock', timestamp: 100, shouldFail: true },
          { user: 0, action: 'edit', timestamp: 200 },
          { user: 2, action: 'read', timestamp: 300 },
          { user: 0, action: 'save', timestamp: 400 },
          { user: 0, action: 'unlock', timestamp: 500 },
          { user: 1, action: 'lock', timestamp: 600 }
        ]
      });
    }
    
    // Race condition in workflow
    scenarios.push({
      type: 'workflow_race',
      users: ['usr_1', 'usr_2'],
      workflowId: 'wf_approval_1',
      actions: [
        { user: 0, action: 'approve', timestamp: 0 },
        { user: 1, action: 'approve', timestamp: 10 }, // Should fail - already approved
        { user: 0, action: 'forward', timestamp: 20 },
        { user: 1, action: 'forward', timestamp: 25 } // Should fail - already forwarded
      ]
    });
    
    // Bulk operations
    scenarios.push({
      type: 'bulk_operation',
      users: Array.from({ length: 50 }, (_, i) => `usr_${i + 1}`),
      operations: Array.from({ length: 50 }, (_, i) => ({
        user: i,
        action: 'upload',
        files: Array.from({ length: 20 }, (_, j) => `file_${i}_${j}.pdf`),
        timestamp: i * 100
      }))
    });
    
    return scenarios;
  }

  // ========================================
  // ERROR SCENARIOS
  // ========================================

  generateErrorScenarios() {
    return {
      authentication: [
        { scenario: 'invalid_credentials', username: 'admin', password: 'wrong' },
        { scenario: 'locked_account', username: 'locked_user', attempts: 10 },
        { scenario: 'expired_session', token: 'expired_token_123' },
        { scenario: 'invalid_token', token: 'malformed.token.here' },
        { scenario: 'sql_injection', username: "' OR '1'='1", password: "' OR '1'='1" }
      ],
      
      fileOperations: [
        { scenario: 'file_too_large', size: 5368709120 }, // 5GB
        { scenario: 'unsupported_format', mimeType: 'application/x-executable' },
        { scenario: 'disk_full', availableSpace: 0 },
        { scenario: 'permission_denied', userId: 'usr_readonly', action: 'delete' },
        { scenario: 'file_locked', fileId: 'doc_locked_1', userId: 'usr_other' }
      ],
      
      database: [
        { scenario: 'connection_timeout', delay: 30000 },
        { scenario: 'deadlock', tables: ['documents', 'folders'] },
        { scenario: 'constraint_violation', duplicate: 'unique_email' },
        { scenario: 'transaction_rollback', operations: 100 }
      ],
      
      network: [
        { scenario: 'slow_connection', latency: 5000 },
        { scenario: 'intermittent_failure', failureRate: 0.3 },
        { scenario: 'complete_outage', duration: 60000 }
      ]
    };
  }
}

// Export for use in tests
module.exports = TestDataGenerator;

// CLI usage
if (require.main === module) {
  const generator = new TestDataGenerator();
  
  console.log('Generating comprehensive test data...');
  
  const testData = {
    valid: {
      users: generator.generateValidUsers(100),
      documents: generator.generateValidDocuments(500),
      workflows: generator.generateWorkflows(50)
    },
    invalid: {
      users: generator.generateInvalidUsers(50),
      documents: generator.generateInvalidDocuments()
    },
    boundary: {
      users: generator.generateBoundaryUsers()
    },
    concurrent: generator.generateConcurrentScenarios(),
    errors: generator.generateErrorScenarios(),
    performance: generator.generateLargeDataset()
  };
  
  // Save to JSON files
  const fs = require('fs');
  const path = require('path');
  
  Object.keys(testData).forEach(category => {
    const filePath = path.join(__dirname, `test-data-${category}.json`);
    fs.writeFileSync(filePath, JSON.stringify(testData[category], null, 2));
    console.log(`✓ Generated ${filePath}`);
  });
  
  console.log('\nTest data generation complete!');
  console.log(`Total users: ${testData.performance.users.length}`);
  console.log(`Total documents: ${testData.performance.documents.length}`);
  console.log(`Total workflows: ${testData.performance.workflows.length}`);
  console.log(`Total audit logs: ${testData.performance.auditLogs.length}`);
}