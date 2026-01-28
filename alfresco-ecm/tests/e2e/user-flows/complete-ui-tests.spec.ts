// Comprehensive UI Integration Tests
// Tests ALL possible UI combinations and interactions

import { test, expect, Page, Locator } from '@playwright/test';
import { TestDataGenerator } from '../../fixtures/test-data-generator';

const generator = new TestDataGenerator();

test.describe('Complete UI Integration Tests', () => {
  let page: Page;
  
  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('http://localhost:3000');
  });

  // ========================================
  // AUTHENTICATION & USER MANAGEMENT
  // ========================================
  
  test.describe('Authentication Flow', () => {
    test('should handle all login scenarios', async () => {
      const loginScenarios = [
        { username: 'admin', password: 'admin123', shouldSucceed: true },
        { username: 'user@test.com', password: 'password', shouldSucceed: true },
        { username: 'invalid', password: 'wrong', shouldSucceed: false },
        { username: '', password: '', shouldSucceed: false },
        { username: 'a'.repeat(1000), password: 'test', shouldSucceed: false },
        { username: "admin'; DROP TABLE users;--", password: 'test', shouldSucceed: false },
        { username: '<script>alert("XSS")</script>', password: 'test', shouldSucceed: false }
      ];

      for (const scenario of loginScenarios) {
        await page.goto('/login');
        
        // Fill login form
        await page.fill('[data-testid="username-input"]', scenario.username);
        await page.fill('[data-testid="password-input"]', scenario.password);
        await page.click('[data-testid="login-button"]');
        
        if (scenario.shouldSucceed) {
          await expect(page).toHaveURL('/dashboard');
          await page.click('[data-testid="logout-button"]');
        } else {
          await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
        }
      }
    });

    test('should handle password reset flow', async () => {
      await page.goto('/login');
      await page.click('[data-testid="forgot-password-link"]');
      
      // Test various email inputs
      const emails = [
        'valid@email.com',
        'invalid-email',
        '',
        'a@b.c',
        'user+tag@domain.co.uk'
      ];
      
      for (const email of emails) {
        await page.fill('[data-testid="reset-email-input"]', email);
        await page.click('[data-testid="reset-submit-button"]');
        
        if (email.includes('@')) {
          await expect(page.locator('[data-testid="reset-success"]')).toBeVisible();
        } else {
          await expect(page.locator('[data-testid="reset-error"]')).toBeVisible();
        }
      }
    });

    test('should enforce session timeout', async () => {
      // Login
      await page.goto('/login');
      await page.fill('[data-testid="username-input"]', 'admin');
      await page.fill('[data-testid="password-input"]', 'admin123');
      await page.click('[data-testid="login-button"]');
      
      // Wait for session timeout (simulate with time manipulation)
      await page.evaluate(() => {
        localStorage.setItem('session_expiry', new Date(Date.now() - 1000).toISOString());
      });
      
      // Try to navigate
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/login');
      await expect(page.locator('[data-testid="session-expired-message"]')).toBeVisible();
    });
  });

  // ========================================
  // DOCUMENT MANAGEMENT UI
  // ========================================
  
  test.describe('Document Management', () => {
    test.beforeEach(async () => {
      // Login as admin
      await loginAsAdmin(page);
    });

    test('should handle all document upload scenarios', async () => {
      await page.goto('/documents');
      
      const uploadTests = [
        // Valid files
        { file: 'test.pdf', size: 1024000, shouldSucceed: true },
        { file: 'document.docx', size: 2048000, shouldSucceed: true },
        { file: 'image.png', size: 512000, shouldSucceed: true },
        
        // Edge cases
        { file: 'empty.txt', size: 0, shouldSucceed: true },
        { file: 'large.bin', size: 5368709120, shouldSucceed: false }, // 5GB
        { file: 'virus.exe', size: 1024, shouldSucceed: false },
        { file: '../../etc/passwd', size: 1024, shouldSucceed: false },
        { file: 'file with spaces.pdf', size: 1024, shouldSucceed: true },
        { file: 'файл.pdf', size: 1024, shouldSucceed: true }, // Unicode
        { file: 'a'.repeat(255) + '.pdf', size: 1024, shouldSucceed: false }
      ];

      for (const test of uploadTests) {
        await page.click('[data-testid="upload-button"]');
        
        // Create and upload file
        const buffer = Buffer.alloc(test.size);
        await page.setInputFiles('[data-testid="file-input"]', {
          name: test.file,
          mimeType: getMimeType(test.file),
          buffer: buffer
        });
        
        await page.click('[data-testid="upload-submit"]');
        
        if (test.shouldSucceed) {
          await expect(page.locator(`[data-testid="file-${test.file}"]`)).toBeVisible();
        } else {
          await expect(page.locator('[data-testid="upload-error"]')).toBeVisible();
        }
      }
    });

    test('should handle all document operations', async () => {
      await page.goto('/documents');
      
      // Test all CRUD operations
      const operations = [
        'create', 'read', 'update', 'delete', 'copy', 'move', 
        'rename', 'download', 'share', 'lock', 'unlock', 'version'
      ];
      
      for (const operation of operations) {
        // Select a document
        await page.click('[data-testid="document-1"]');
        
        // Perform operation
        await page.click(`[data-testid="${operation}-button"]`);
        
        // Handle operation-specific dialogs
        switch (operation) {
          case 'rename':
            await page.fill('[data-testid="new-name-input"]', 'New Name.pdf');
            await page.click('[data-testid="confirm-rename"]');
            break;
          case 'move':
            await page.selectOption('[data-testid="folder-select"]', 'folder-2');
            await page.click('[data-testid="confirm-move"]');
            break;
          case 'share':
            await page.fill('[data-testid="share-email"]', 'user@test.com');
            await page.selectOption('[data-testid="share-permission"]', 'read');
            await page.click('[data-testid="confirm-share"]');
            break;
          case 'delete':
            await page.click('[data-testid="confirm-delete"]');
            break;
        }
        
        // Verify operation succeeded
        await expect(page.locator('[data-testid="operation-success"]')).toBeVisible();
      }
    });

    test('should handle bulk operations', async () => {
      await page.goto('/documents');
      
      // Select multiple documents
      for (let i = 1; i <= 10; i++) {
        await page.click(`[data-testid="checkbox-doc-${i}"]`);
      }
      
      // Test bulk operations
      const bulkOps = ['bulk-download', 'bulk-delete', 'bulk-move', 'bulk-tag'];
      
      for (const op of bulkOps) {
        await page.click(`[data-testid="${op}"]`);
        
        if (op === 'bulk-move') {
          await page.selectOption('[data-testid="bulk-folder-select"]', 'archive');
        } else if (op === 'bulk-tag') {
          await page.fill('[data-testid="bulk-tags"]', 'important, reviewed, 2024');
        }
        
        await page.click('[data-testid="confirm-bulk-operation"]');
        await expect(page.locator('[data-testid="bulk-success"]')).toBeVisible();
      }
    });
  });

  // ========================================
  // WORKFLOW BUILDER UI
  // ========================================
  
  test.describe('Workflow Builder', () => {
    test('should test all workflow builder interactions', async () => {
      await loginAsAdmin(page);
      await page.goto('/workflow/builder');
      
      // Test node operations
      const nodeTypes = [
        'upload', 'scan', 'ocr', 'classify', 'metadata',
        'review', 'approve', 'reject', 'sign',
        'convert', 'merge', 'split', 'watermark',
        'email', 'notify', 'publish', 'archive'
      ];
      
      for (const nodeType of nodeTypes) {
        // Drag and drop node
        const source = page.locator(`[data-testid="node-${nodeType}"]`);
        const target = page.locator('[data-testid="canvas"]');
        
        await source.dragTo(target, {
          targetPosition: { x: 100 + nodeTypes.indexOf(nodeType) * 50, y: 200 }
        });
        
        // Verify node added
        await expect(page.locator(`[data-testid="canvas-node-${nodeType}"]`)).toBeVisible();
      }
      
      // Test connections
      for (let i = 0; i < nodeTypes.length - 1; i++) {
        const fromNode = page.locator(`[data-testid="canvas-node-${nodeTypes[i]}"]`);
        const toNode = page.locator(`[data-testid="canvas-node-${nodeTypes[i + 1]}"]`);
        
        // Connect nodes
        await fromNode.locator('[data-testid="connect-button"]').click();
        await toNode.click();
        
        // Verify connection
        await expect(page.locator(`[data-testid="connection-${i}"]`)).toBeVisible();
      }
      
      // Test node properties
      await page.click(`[data-testid="canvas-node-review"]`);
      await page.fill('[data-testid="node-label"]', 'Document Review');
      await page.selectOption('[data-testid="node-assignee"]', 'manager');
      await page.fill('[data-testid="node-duration"]', '3 days');
      
      // Save workflow
      await page.click('[data-testid="save-workflow"]');
      await page.fill('[data-testid="workflow-name"]', 'Test Workflow');
      await page.fill('[data-testid="workflow-description"]', 'Comprehensive test workflow');
      await page.click('[data-testid="confirm-save"]');
      
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    test('should handle workflow templates', async () => {
      await loginAsAdmin(page);
      await page.goto('/workflow/builder');
      
      const templates = [
        'Document Intake & Processing',
        'Document Review & Approval',
        'Contract Management',
        'Invoice Processing',
        'Employee Onboarding',
        'Compliance Document Processing'
      ];
      
      for (const template of templates) {
        await page.click(`[data-testid="template-${template}"]`);
        
        // Verify template loaded
        await expect(page.locator('[data-testid="canvas"]')).toContainText('Start');
        await expect(page.locator('[data-testid="canvas"]')).toContainText('End');
        
        // Clear canvas for next template
        await page.click('[data-testid="clear-canvas"]');
        await page.click('[data-testid="confirm-clear"]');
      }
    });
  });

  // ========================================
  // SEARCH AND FILTERS
  // ========================================
  
  test.describe('Search Functionality', () => {
    test('should test all search scenarios', async () => {
      await loginAsAdmin(page);
      await page.goto('/');
      
      const searchQueries = [
        // Valid searches
        { query: 'document', expectedResults: true },
        { query: 'invoice 2024', expectedResults: true },
        { query: 'type:pdf', expectedResults: true },
        { query: 'author:"John Doe"', expectedResults: true },
        { query: 'size:>1MB', expectedResults: true },
        { query: 'created:2024-01-01..2024-12-31', expectedResults: true },
        
        // Special characters
        { query: 'test@email.com', expectedResults: true },
        { query: 'file-name_123.pdf', expectedResults: true },
        { query: '"exact phrase search"', expectedResults: true },
        
        // Edge cases
        { query: '', expectedResults: false },
        { query: 'a', expectedResults: true },
        { query: 'a'.repeat(1000), expectedResults: false },
        { query: "'; DROP TABLE documents;--", expectedResults: false },
        { query: '<script>alert("XSS")</script>', expectedResults: false },
        { query: '../../etc/passwd', expectedResults: false }
      ];
      
      for (const search of searchQueries) {
        await page.fill('[data-testid="search-input"]', search.query);
        await page.press('[data-testid="search-input"]', 'Enter');
        
        if (search.expectedResults) {
          await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
        } else {
          await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
        }
      }
    });

    test('should test advanced filters', async () => {
      await loginAsAdmin(page);
      await page.goto('/documents');
      await page.click('[data-testid="advanced-filters"]');
      
      // Test all filter combinations
      const filters = {
        fileType: ['pdf', 'docx', 'xlsx', 'png', 'all'],
        dateRange: ['today', 'week', 'month', 'year', 'custom'],
        size: ['<1MB', '1-10MB', '10-100MB', '>100MB'],
        status: ['draft', 'published', 'archived', 'all'],
        owner: ['me', 'team', 'all']
      };
      
      // Test each filter combination
      for (const fileType of filters.fileType) {
        for (const dateRange of filters.dateRange) {
          for (const size of filters.size) {
            for (const status of filters.status) {
              for (const owner of filters.owner) {
                // Apply filters
                await page.selectOption('[data-testid="filter-type"]', fileType);
                await page.selectOption('[data-testid="filter-date"]', dateRange);
                await page.selectOption('[data-testid="filter-size"]', size);
                await page.selectOption('[data-testid="filter-status"]', status);
                await page.selectOption('[data-testid="filter-owner"]', owner);
                
                await page.click('[data-testid="apply-filters"]');
                
                // Verify results updated
                await expect(page.locator('[data-testid="results-count"]')).toBeVisible();
                
                // Reset for next iteration
                await page.click('[data-testid="reset-filters"]');
              }
            }
          }
        }
      }
    });
  });

  // ========================================
  // RESPONSIVE DESIGN
  // ========================================
  
  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'iPad Pro', width: 1024, height: 1366 },
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: '4K', width: 3840, height: 2160 }
    ];
    
    for (const viewport of viewports) {
      test(`should work on ${viewport.name}`, async () => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await loginAsAdmin(page);
        
        // Test navigation
        await page.goto('/');
        
        // Mobile menu
        if (viewport.width < 768) {
          await page.click('[data-testid="mobile-menu-toggle"]');
          await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
        }
        
        // Test key pages
        const pages = ['/documents', '/workflow', '/sites', '/records'];
        for (const path of pages) {
          await page.goto(path);
          
          // Verify layout
          await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
          
          // Test interactions
          await page.click('[data-testid="first-item"]');
          await expect(page.locator('[data-testid="detail-view"]')).toBeVisible();
          
          // Back navigation
          if (viewport.width < 768) {
            await page.click('[data-testid="back-button"]');
          }
        }
      });
    }
  });

  // ========================================
  // ACCESSIBILITY
  // ========================================
  
  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async () => {
      await page.goto('/login');
      
      // Tab through all elements
      const elements = [
        'username-input',
        'password-input',
        'remember-me-checkbox',
        'login-button',
        'forgot-password-link',
        'register-link'
      ];
      
      for (const element of elements) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
        expect(focused).toBe(element);
      }
      
      // Test keyboard shortcuts
      await loginAsAdmin(page);
      await page.goto('/documents');
      
      // Ctrl+N for new document
      await page.keyboard.press('Control+N');
      await expect(page.locator('[data-testid="new-document-modal"]')).toBeVisible();
      await page.keyboard.press('Escape');
      
      // Ctrl+S for search
      await page.keyboard.press('Control+S');
      await expect(page.locator('[data-testid="search-input"]')).toBeFocused();
    });

    test('should work with screen readers', async () => {
      await page.goto('/');
      
      // Check ARIA labels
      const ariaElements = await page.$$('[aria-label]');
      expect(ariaElements.length).toBeGreaterThan(0);
      
      // Check heading hierarchy
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', 
        elements => elements.map(el => ({ tag: el.tagName, text: el.textContent }))
      );
      
      // Verify proper heading structure
      expect(headings.find(h => h.tag === 'H1')).toBeTruthy();
      
      // Check form labels
      const inputs = await page.$$('input:not([type="hidden"])');
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const label = await page.$(`label[for="${id}"]`);
        expect(label).toBeTruthy();
      }
    });
  });

  // ========================================
  // PERFORMANCE
  // ========================================
  
  test.describe('Performance', () => {
    test('should handle large datasets', async () => {
      await loginAsAdmin(page);
      await page.goto('/documents');
      
      // Load page with 10,000 documents
      await page.evaluate(() => {
        // Simulate large dataset
        window.testData = Array.from({ length: 10000 }, (_, i) => ({
          id: `doc_${i}`,
          title: `Document ${i}`,
          size: Math.floor(Math.random() * 10000000),
          created: new Date()
        }));
      });
      
      // Measure render time
      const startTime = Date.now();
      await page.click('[data-testid="load-all"]');
      await page.waitForSelector('[data-testid="document-9999"]');
      const renderTime = Date.now() - startTime;
      
      expect(renderTime).toBeLessThan(3000); // Should render within 3 seconds
      
      // Test scrolling performance
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.evaluate(() => window.scrollTo(0, 0));
      
      // Test search in large dataset
      await page.fill('[data-testid="search-input"]', 'Document 5555');
      await page.press('[data-testid="search-input"]', 'Enter');
      await expect(page.locator('[data-testid="document-5555"]')).toBeVisible();
    });

    test('should handle concurrent operations', async ({ browser }) => {
      // Create multiple browser contexts
      const contexts = await Promise.all(
        Array.from({ length: 10 }, () => browser.newContext())
      );
      
      const pages = await Promise.all(
        contexts.map(context => context.newPage())
      );
      
      // Simulate concurrent users
      await Promise.all(pages.map(async (p, index) => {
        await loginAsUser(p, `user${index}`);
        await p.goto('/documents');
        
        // Each user uploads a file
        await p.click('[data-testid="upload-button"]');
        await p.setInputFiles('[data-testid="file-input"]', {
          name: `file_${index}.pdf`,
          mimeType: 'application/pdf',
          buffer: Buffer.from(`Content ${index}`)
        });
        await p.click('[data-testid="upload-submit"]');
      }));
      
      // Verify all uploads succeeded
      for (let i = 0; i < 10; i++) {
        await pages[0].reload();
        await expect(pages[0].locator(`[data-testid="file_${i}.pdf"]`)).toBeVisible();
      }
      
      // Cleanup
      await Promise.all(contexts.map(c => c.close()));
    });
  });

  // ========================================
  // ERROR HANDLING
  // ========================================
  
  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      await loginAsAdmin(page);
      
      // Simulate offline
      await page.context().setOffline(true);
      
      await page.goto('/documents');
      await expect(page.locator('[data-testid="offline-banner"]')).toBeVisible();
      
      // Try to perform action
      await page.click('[data-testid="upload-button"]');
      await expect(page.locator('[data-testid="offline-error"]')).toBeVisible();
      
      // Go back online
      await page.context().setOffline(false);
      await page.reload();
      await expect(page.locator('[data-testid="online-banner"]')).toBeVisible();
    });

    test('should handle server errors', async () => {
      await loginAsAdmin(page);
      
      // Intercept and return errors
      await page.route('**/api/**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
      
      await page.goto('/documents');
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
      
      // Test retry
      await page.unroute('**/api/**');
      await page.click('[data-testid="retry-button"]');
      await expect(page.locator('[data-testid="document-list"]')).toBeVisible();
    });

    test('should handle validation errors', async () => {
      await loginAsAdmin(page);
      await page.goto('/documents/new');
      
      // Submit empty form
      await page.click('[data-testid="submit-button"]');
      
      // Check all validation messages
      await expect(page.locator('[data-testid="title-error"]')).toContainText('Title is required');
      await expect(page.locator('[data-testid="file-error"]')).toContainText('File is required');
      
      // Test field-level validation
      await page.fill('[data-testid="title-input"]', 'a'); // Too short
      await expect(page.locator('[data-testid="title-error"]')).toContainText('Minimum 3 characters');
      
      await page.fill('[data-testid="title-input"]', 'a'.repeat(256)); // Too long
      await expect(page.locator('[data-testid="title-error"]')).toContainText('Maximum 255 characters');
      
      // Test valid submission
      await page.fill('[data-testid="title-input"]', 'Valid Document Title');
      await page.setInputFiles('[data-testid="file-input"]', {
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('PDF content')
      });
      await page.click('[data-testid="submit-button"]');
      await expect(page).toHaveURL('/documents');
    });
  });
});

// ========================================
// HELPER FUNCTIONS
// ========================================

async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.fill('[data-testid="username-input"]', 'admin');
  await page.fill('[data-testid="password-input"]', 'admin123');
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
}

async function loginAsUser(page: Page, username: string) {
  await page.goto('/login');
  await page.fill('[data-testid="username-input"]', username);
  await page.fill('[data-testid="password-input"]', 'password');
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    png: 'image/png',
    jpg: 'image/jpeg',
    txt: 'text/plain',
    exe: 'application/x-executable'
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}