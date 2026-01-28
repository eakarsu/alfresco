// Comprehensive API Integration Tests
// Tests ALL API endpoints with all parameter combinations

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { TestDataGenerator } from '../../fixtures/test-data-generator';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
const generator = new TestDataGenerator();

describe('Complete API Integration Tests', () => {
  let authToken: string;
  let testUsers: any[];
  let testDocuments: any[];
  
  beforeAll(async () => {
    // Setup test data
    testUsers = generator.generateValidUsers(10);
    testDocuments = generator.generateValidDocuments(50);
    
    // Get auth token
    const response = await request(API_BASE_URL)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    
    authToken = response.body.token;
  });

  // ========================================
  // AUTHENTICATION ENDPOINTS
  // ========================================
  
  describe('POST /api/auth/login', () => {
    test('should test all login combinations', async () => {
      const loginTests = [
        // Valid credentials
        { username: 'admin', password: 'admin123', expectedStatus: 200 },
        { username: 'user@test.com', password: 'password', expectedStatus: 200 },
        
        // Invalid credentials
        { username: 'invalid', password: 'wrong', expectedStatus: 401 },
        { username: '', password: '', expectedStatus: 400 },
        { username: 'admin', password: '', expectedStatus: 400 },
        { username: '', password: 'admin123', expectedStatus: 400 },
        
        // SQL injection attempts
        { username: "admin' OR '1'='1", password: 'password', expectedStatus: 401 },
        { username: "admin'; DROP TABLE users;--", password: 'password', expectedStatus: 401 },
        
        // XSS attempts
        { username: '<script>alert("XSS")</script>', password: 'password', expectedStatus: 401 },
        { username: 'admin', password: '<img src=x onerror=alert("XSS")>', expectedStatus: 401 },
        
        // Boundary conditions
        { username: 'a', password: 'b', expectedStatus: 401 },
        { username: 'a'.repeat(1000), password: 'password', expectedStatus: 400 },
        { username: 'admin', password: 'p'.repeat(1000), expectedStatus: 400 },
        
        // Special characters
        { username: 'user@domain.com', password: 'P@ssw0rd!', expectedStatus: 200 },
        { username: 'user+tag@domain.com', password: 'password', expectedStatus: 200 },
        
        // Case sensitivity
        { username: 'ADMIN', password: 'admin123', expectedStatus: 401 },
        { username: 'admin', password: 'ADMIN123', expectedStatus: 401 }
      ];

      for (const test of loginTests) {
        const response = await request(API_BASE_URL)
          .post('/api/auth/login')
          .send(test)
          .expect(test.expectedStatus);
        
        if (test.expectedStatus === 200) {
          expect(response.body).toHaveProperty('token');
          expect(response.body).toHaveProperty('user');
          expect(response.body.user).not.toHaveProperty('password');
        } else {
          expect(response.body).toHaveProperty('error');
        }
      }
    });

    test('should handle rate limiting', async () => {
      // Attempt 100 rapid login attempts
      const promises = Array.from({ length: 100 }, () =>
        request(API_BASE_URL)
          .post('/api/auth/login')
          .send({ username: 'admin', password: 'wrong' })
      );
      
      const responses = await Promise.all(promises);
      
      // Should start getting rate limited after threshold
      const rateLimited = responses.filter(r => r.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should handle all logout scenarios', async () => {
      // Valid logout
      await request(API_BASE_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      // Logout without token
      await request(API_BASE_URL)
        .post('/api/auth/logout')
        .expect(401);
      
      // Logout with invalid token
      await request(API_BASE_URL)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
      
      // Logout with expired token
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjB9.invalid';
      await request(API_BASE_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  // ========================================
  // DOCUMENT MANAGEMENT ENDPOINTS
  // ========================================
  
  describe('GET /api/documents', () => {
    test('should test all query parameter combinations', async () => {
      const queryTests = [
        // Pagination
        { page: 1, limit: 10 },
        { page: 2, limit: 20 },
        { page: 0, limit: 10 }, // Invalid page
        { page: 1, limit: 0 }, // Invalid limit
        { page: 1, limit: 1000 }, // Large limit
        { page: -1, limit: -10 }, // Negative values
        
        // Sorting
        { sort: 'title', order: 'asc' },
        { sort: 'created', order: 'desc' },
        { sort: 'size', order: 'asc' },
        { sort: 'invalid_field', order: 'asc' }, // Invalid sort field
        { sort: 'title', order: 'invalid' }, // Invalid order
        
        // Filtering
        { status: 'published' },
        { status: 'draft,archived' }, // Multiple statuses
        { owner: 'usr_1' },
        { folder: 'fld_shared' },
        { mime: 'application/pdf' },
        { tags: 'important,urgent' },
        
        // Date ranges
        { created_from: '2024-01-01', created_to: '2024-12-31' },
        { modified_from: '2024-01-01' },
        { created_from: 'invalid_date' }, // Invalid date
        
        // Size ranges
        { size_min: 1000, size_max: 1000000 },
        { size_min: 1000000, size_max: 1000 }, // Min > Max
        { size_min: -1000 }, // Negative size
        
        // Search
        { q: 'document' },
        { q: 'type:pdf author:"John Doe"' }, // Advanced search
        { q: '' }, // Empty search
        { q: 'a'.repeat(1000) }, // Long search query
        
        // Complex combinations
        { 
          page: 1, 
          limit: 50, 
          sort: 'title', 
          order: 'asc', 
          status: 'published',
          mime: 'application/pdf',
          q: 'report'
        }
      ];

      for (const query of queryTests) {
        const response = await request(API_BASE_URL)
          .get('/api/documents')
          .set('Authorization', `Bearer ${authToken}`)
          .query(query);
        
        expect([200, 400]).toContain(response.status);
        
        if (response.status === 200) {
          expect(response.body).toHaveProperty('documents');
          expect(response.body).toHaveProperty('total');
          expect(response.body).toHaveProperty('page');
          expect(response.body).toHaveProperty('limit');
          expect(Array.isArray(response.body.documents)).toBe(true);
        }
      }
    });
  });

  describe('POST /api/documents', () => {
    test('should test all document creation scenarios', async () => {
      const createTests = [
        // Valid documents
        {
          title: 'Test Document.pdf',
          folderId: 'fld_shared',
          file: Buffer.from('PDF content'),
          expectedStatus: 201
        },
        {
          title: 'Image.png',
          folderId: 'fld_shared',
          file: Buffer.from('PNG content'),
          metadata: { width: 1920, height: 1080 },
          expectedStatus: 201
        },
        
        // Missing required fields
        {
          folderId: 'fld_shared',
          expectedStatus: 400 // Missing title
        },
        {
          title: 'No Folder.pdf',
          expectedStatus: 400 // Missing folder
        },
        
        // Invalid data
        {
          title: '',
          folderId: 'fld_shared',
          expectedStatus: 400 // Empty title
        },
        {
          title: 'a'.repeat(256),
          folderId: 'fld_shared',
          expectedStatus: 400 // Title too long
        },
        {
          title: 'Invalid Folder.pdf',
          folderId: 'non_existent_folder',
          expectedStatus: 400
        },
        
        // File size limits
        {
          title: 'Large File.bin',
          folderId: 'fld_shared',
          file: Buffer.alloc(5368709120), // 5GB
          expectedStatus: 413 // Payload too large
        },
        {
          title: 'Empty File.txt',
          folderId: 'fld_shared',
          file: Buffer.alloc(0),
          expectedStatus: 201 // Empty files allowed
        },
        
        // Special characters
        {
          title: 'File with !@#$%^&*() chars.pdf',
          folderId: 'fld_shared',
          expectedStatus: 201
        },
        {
          title: '../../../etc/passwd',
          folderId: 'fld_shared',
          expectedStatus: 400 // Path traversal attempt
        }
      ];

      for (const test of createTests) {
        const req = request(API_BASE_URL)
          .post('/api/documents')
          .set('Authorization', `Bearer ${authToken}`);
        
        if (test.title) req.field('title', test.title);
        if (test.folderId) req.field('folderId', test.folderId);
        if (test.metadata) req.field('metadata', JSON.stringify(test.metadata));
        if (test.file) req.attach('file', test.file, test.title || 'file');
        
        const response = await req.expect(test.expectedStatus);
        
        if (test.expectedStatus === 201) {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('title', test.title);
          expect(response.body).toHaveProperty('folderId', test.folderId);
        }
      }
    });
  });

  describe('PUT /api/documents/:id', () => {
    test('should test all update scenarios', async () => {
      const documentId = 'doc_001';
      
      const updateTests = [
        // Valid updates
        {
          title: 'Updated Title.pdf',
          expectedStatus: 200
        },
        {
          folderId: 'fld_archive',
          expectedStatus: 200
        },
        {
          status: 'archived',
          expectedStatus: 200
        },
        {
          tags: ['updated', 'test'],
          expectedStatus: 200
        },
        {
          metadata: { reviewed: true, reviewer: 'admin' },
          expectedStatus: 200
        },
        
        // Invalid updates
        {
          title: '', // Empty title
          expectedStatus: 400
        },
        {
          title: 'a'.repeat(256), // Too long
          expectedStatus: 400
        },
        {
          folderId: 'non_existent', // Invalid folder
          expectedStatus: 400
        },
        {
          status: 'invalid_status',
          expectedStatus: 400
        },
        
        // Partial updates
        {
          title: 'Only Title Update',
          expectedStatus: 200
        },
        
        // No changes
        {},
        
        // Version conflict
        {
          title: 'Conflicting Update',
          version: 'old_version',
          expectedStatus: 409
        }
      ];

      for (const update of updateTests) {
        const response = await request(API_BASE_URL)
          .put(`/api/documents/${documentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(update)
          .expect(update.expectedStatus || 200);
        
        if (update.expectedStatus === 200 || !update.expectedStatus) {
          if (update.title) {
            expect(response.body.title).toBe(update.title);
          }
        }
      }
    });
  });

  describe('DELETE /api/documents/:id', () => {
    test('should test all deletion scenarios', async () => {
      const deleteTests = [
        // Valid deletion
        { id: 'doc_to_delete_1', expectedStatus: 204 },
        
        // Non-existent document
        { id: 'non_existent_doc', expectedStatus: 404 },
        
        // Already deleted
        { id: 'doc_to_delete_1', expectedStatus: 404 }, // Second attempt
        
        // Invalid ID format
        { id: '../etc/passwd', expectedStatus: 400 },
        { id: 'null', expectedStatus: 400 },
        { id: '', expectedStatus: 404 }, // Empty ID
        
        // Permission denied
        { id: 'doc_protected', expectedStatus: 403 },
        
        // Document with dependencies
        { id: 'doc_with_workflow', expectedStatus: 409 } // Has active workflow
      ];

      for (const test of deleteTests) {
        await request(API_BASE_URL)
          .delete(`/api/documents/${test.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(test.expectedStatus);
      }
    });
  });

  // ========================================
  // WORKFLOW ENDPOINTS
  // ========================================
  
  describe('Workflow API', () => {
    test('POST /api/workflows - should create workflows', async () => {
      const workflowTests = [
        // Valid workflow
        {
          name: 'Test Workflow',
          description: 'Test description',
          definition: {
            nodes: ['start', 'review', 'approve', 'end'],
            connections: [
              { from: 'start', to: 'review' },
              { from: 'review', to: 'approve' },
              { from: 'approve', to: 'end' }
            ]
          },
          expectedStatus: 201
        },
        
        // Missing required fields
        {
          description: 'No name',
          expectedStatus: 400
        },
        
        // Invalid definition
        {
          name: 'Invalid Workflow',
          definition: {
            nodes: ['start'], // No end node
            connections: []
          },
          expectedStatus: 400
        },
        
        // Circular dependency
        {
          name: 'Circular Workflow',
          definition: {
            nodes: ['start', 'task1', 'task2', 'end'],
            connections: [
              { from: 'start', to: 'task1' },
              { from: 'task1', to: 'task2' },
              { from: 'task2', to: 'task1' }, // Circular
              { from: 'task2', to: 'end' }
            ]
          },
          expectedStatus: 400
        }
      ];

      for (const test of workflowTests) {
        const response = await request(API_BASE_URL)
          .post('/api/workflows')
          .set('Authorization', `Bearer ${authToken}`)
          .send(test)
          .expect(test.expectedStatus);
        
        if (test.expectedStatus === 201) {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('name', test.name);
        }
      }
    });

    test('POST /api/workflows/:id/instances - should start workflow instances', async () => {
      const workflowId = 'wf_001';
      
      const instanceTests = [
        // Valid instance
        {
          documentId: 'doc_001',
          variables: { priority: 'high' },
          expectedStatus: 201
        },
        
        // Missing document
        {
          documentId: 'non_existent',
          expectedStatus: 400
        },
        
        // Invalid workflow
        {
          workflowId: 'invalid_wf',
          documentId: 'doc_001',
          expectedStatus: 404
        },
        
        // Duplicate instance
        {
          documentId: 'doc_001', // Same document
          expectedStatus: 409 // Already has instance
        }
      ];

      for (const test of instanceTests) {
        await request(API_BASE_URL)
          .post(`/api/workflows/${test.workflowId || workflowId}/instances`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            documentId: test.documentId,
            variables: test.variables
          })
          .expect(test.expectedStatus);
      }
    });
  });

  // ========================================
  // SEARCH ENDPOINTS
  // ========================================
  
  describe('POST /api/search', () => {
    test('should test all search scenarios', async () => {
      const searchTests = [
        // Simple search
        {
          query: 'document',
          expectedStatus: 200
        },
        
        // Advanced search
        {
          query: 'type:pdf AND author:"John Doe" AND created:[2024-01-01 TO 2024-12-31]',
          filters: {
            status: ['published'],
            folders: ['fld_shared']
          },
          expectedStatus: 200
        },
        
        // Faceted search
        {
          query: '*',
          facets: ['type', 'author', 'year'],
          expectedStatus: 200
        },
        
        // Fuzzy search
        {
          query: 'documnet~', // Typo with fuzzy
          expectedStatus: 200
        },
        
        // Wildcard search
        {
          query: 'doc*',
          expectedStatus: 200
        },
        
        // Proximity search
        {
          query: '"financial report"~5',
          expectedStatus: 200
        },
        
        // Boolean operators
        {
          query: '(invoice OR receipt) AND NOT draft',
          expectedStatus: 200
        },
        
        // Invalid queries
        {
          query: '',
          expectedStatus: 400
        },
        {
          query: 'AND OR NOT', // Invalid syntax
          expectedStatus: 400
        },
        {
          query: 'a'.repeat(10000), // Too long
          expectedStatus: 400
        }
      ];

      for (const test of searchTests) {
        const response = await request(API_BASE_URL)
          .post('/api/search')
          .set('Authorization', `Bearer ${authToken}`)
          .send(test)
          .expect(test.expectedStatus);
        
        if (test.expectedStatus === 200) {
          expect(response.body).toHaveProperty('results');
          expect(response.body).toHaveProperty('total');
          expect(Array.isArray(response.body.results)).toBe(true);
          
          if (test.facets) {
            expect(response.body).toHaveProperty('facets');
          }
        }
      }
    });
  });

  // ========================================
  // BULK OPERATIONS
  // ========================================
  
  describe('Bulk Operations', () => {
    test('POST /api/documents/bulk - should handle bulk operations', async () => {
      const bulkTests = [
        // Bulk update
        {
          operation: 'update',
          ids: ['doc_001', 'doc_002', 'doc_003'],
          data: { status: 'archived' },
          expectedStatus: 200
        },
        
        // Bulk delete
        {
          operation: 'delete',
          ids: ['doc_004', 'doc_005'],
          expectedStatus: 200
        },
        
        // Bulk move
        {
          operation: 'move',
          ids: ['doc_006', 'doc_007'],
          data: { folderId: 'fld_archive' },
          expectedStatus: 200
        },
        
        // Bulk tag
        {
          operation: 'tag',
          ids: ['doc_008', 'doc_009', 'doc_010'],
          data: { tags: ['bulk', 'processed'] },
          expectedStatus: 200
        },
        
        // Too many items
        {
          operation: 'update',
          ids: Array.from({ length: 1001 }, (_, i) => `doc_${i}`),
          data: { status: 'archived' },
          expectedStatus: 400 // Exceeds limit
        },
        
        // Invalid operation
        {
          operation: 'invalid_op',
          ids: ['doc_001'],
          expectedStatus: 400
        },
        
        // Mixed success/failure
        {
          operation: 'delete',
          ids: ['doc_exists', 'doc_not_exists', 'doc_protected'],
          expectedStatus: 207 // Multi-status
        }
      ];

      for (const test of bulkTests) {
        const response = await request(API_BASE_URL)
          .post('/api/documents/bulk')
          .set('Authorization', `Bearer ${authToken}`)
          .send(test)
          .expect(test.expectedStatus);
        
        if (test.expectedStatus === 207) {
          expect(response.body).toHaveProperty('succeeded');
          expect(response.body).toHaveProperty('failed');
          expect(response.body.succeeded.length + response.body.failed.length)
            .toBe(test.ids.length);
        }
      }
    });
  });

  // ========================================
  // PERFORMANCE TESTS
  // ========================================
  
  describe('Performance Tests', () => {
    test('should handle concurrent requests', async () => {
      const concurrentRequests = 100;
      
      const promises = Array.from({ length: concurrentRequests }, (_, i) =>
        request(API_BASE_URL)
          .get('/api/documents')
          .set('Authorization', `Bearer ${authToken}`)
          .query({ page: i % 10 + 1, limit: 10 })
      );
      
      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      
      // Should complete within reasonable time (10 seconds for 100 requests)
      expect(duration).toBeLessThan(10000);
    });

    test('should handle large payloads efficiently', async () => {
      // Create large document
      const largeMetadata = {
        data: Array.from({ length: 1000 }, (_, i) => ({
          key: `field_${i}`,
          value: 'x'.repeat(100)
        }))
      };
      
      const startTime = Date.now();
      
      const response = await request(API_BASE_URL)
        .post('/api/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Large Document')
        .field('folderId', 'fld_shared')
        .field('metadata', JSON.stringify(largeMetadata))
        .attach('file', Buffer.alloc(10485760), 'large.bin'); // 10MB file
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(201);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    test('should paginate large result sets efficiently', async () => {
      const pages = 10;
      const pageSize = 100;
      
      for (let page = 1; page <= pages; page++) {
        const startTime = Date.now();
        
        const response = await request(API_BASE_URL)
          .get('/api/documents')
          .set('Authorization', `Bearer ${authToken}`)
          .query({ page, limit: pageSize })
          .expect(200);
        
        const duration = Date.now() - startTime;
        
        expect(response.body.documents.length).toBeLessThanOrEqual(pageSize);
        expect(duration).toBeLessThan(1000); // Each page should load within 1 second
      }
    });
  });

  // ========================================
  // ERROR RECOVERY
  // ========================================
  
  describe('Error Recovery', () => {
    test('should handle database connection failures', async () => {
      // This would need to be simulated by temporarily stopping the database
      // or using a test database that can be controlled
      
      // For now, test that API returns appropriate error when DB is unavailable
      const response = await request(API_BASE_URL)
        .get('/api/health/database')
        .expect((res) => {
          expect([200, 503]).toContain(res.status);
        });
      
      if (response.status === 503) {
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('database');
      }
    });

    test('should handle transaction rollbacks', async () => {
      // Start a transaction that will fail
      const response = await request(API_BASE_URL)
        .post('/api/documents/transaction')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          operations: [
            { type: 'create', data: { title: 'Doc 1', folderId: 'fld_shared' } },
            { type: 'create', data: { title: 'Doc 2', folderId: 'invalid_folder' } }, // Will fail
            { type: 'create', data: { title: 'Doc 3', folderId: 'fld_shared' } }
          ]
        })
        .expect(400);
      
      // Verify none of the documents were created (transaction rolled back)
      const checkResponse = await request(API_BASE_URL)
        .get('/api/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ q: 'Doc 1 OR Doc 2 OR Doc 3' });
      
      expect(checkResponse.body.total).toBe(0);
    });
  });
});

// ========================================
// HELPER FUNCTIONS
// ========================================

async function createTestDocument(token: string, data: any) {
  return request(API_BASE_URL)
    .post('/api/documents')
    .set('Authorization', `Bearer ${token}`)
    .send(data);
}

async function cleanupTestData(token: string, ids: string[]) {
  for (const id of ids) {
    await request(API_BASE_URL)
      .delete(`/api/documents/${id}`)
      .set('Authorization', `Bearer ${token}`);
  }
}