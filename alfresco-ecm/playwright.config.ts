// Playwright Configuration for E2E Testing
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Parallel execution
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  
  // Retry configuration
  retries: process.env.CI ? 2 : 0,
  
  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // Shared settings
  use: {
    // Base URL
    baseURL: 'http://localhost:3000',
    
    // Trace configuration
    trace: 'on-first-retry',
    
    // Screenshot configuration
    screenshot: 'only-on-failure',
    
    // Video configuration
    video: 'retain-on-failure',
    
    // Action timeout
    actionTimeout: 15000,
    
    // Navigation timeout
    navigationTimeout: 30000,
    
    // Test artifacts
    testIdAttribute: 'data-testid'
  },
  
  // Project configuration for different browsers
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] }
    },
    
    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    },
    {
      name: 'iPhone SE',
      use: { ...devices['iPhone SE'] }
    },
    {
      name: 'iPad',
      use: { ...devices['iPad (gen 7)'] }
    },
    {
      name: 'iPad Pro',
      use: { ...devices['iPad Pro 11'] }
    },
    
    // Different viewport sizes
    {
      name: '4K',
      use: {
        viewport: { width: 3840, height: 2160 },
        deviceScaleFactor: 2
      }
    },
    {
      name: 'Full HD',
      use: {
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'HD',
      use: {
        viewport: { width: 1280, height: 720 }
      }
    },
    
    // Accessibility testing
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
        reducedMotion: 'reduce',
        forcedColors: 'active'
      }
    }
  ],
  
  // Global setup
  globalSetup: './tests/e2e/global-setup.ts',
  
  // Global teardown
  globalTeardown: './tests/e2e/global-teardown.ts',
  
  // Timeout configuration
  timeout: 60000, // 60 seconds per test
  expect: {
    timeout: 10000 // 10 seconds for assertions
  },
  
  // Web server configuration
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI
  },
  
  // Output folder
  outputDir: 'test-results/test-artifacts',
  
  // Preserve output
  preserveOutput: 'failures-only',
  
  // Quiet mode
  quiet: false,
  
  // Update snapshots
  updateSnapshots: 'missing',
  
  // Ignore snapshots
  ignoreSnapshots: false,
  
  // Max failures
  maxFailures: process.env.CI ? 10 : undefined
});