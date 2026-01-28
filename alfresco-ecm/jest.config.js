// Jest Configuration for Comprehensive Testing
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  
  // Test match patterns
  testMatch: [
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.test.ts',
    '**/__tests__/**/*.ts'
  ],
  
  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@fixtures/(.*)$': '<rootDir>/tests/fixtures/$1'
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Transform files
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Coverage path ignore patterns
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/dist/',
    '.d.ts$'
  ],
  
  // Projects for different test types
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: ['**/tests/unit/**/*.spec.ts'],
      testEnvironment: 'node'
    },
    {
      displayName: 'Integration Tests',
      testMatch: ['**/tests/integration/**/*.spec.ts'],
      testEnvironment: 'node',
      globalSetup: '<rootDir>/tests/integration/setup.ts',
      globalTeardown: '<rootDir>/tests/integration/teardown.ts'
    },
    {
      displayName: 'E2E Tests',
      testMatch: ['**/tests/e2e/**/*.spec.ts'],
      preset: 'jest-playwright-preset',
      testEnvironment: 'jest-playwright-preset'
    }
  ],
  
  // Timeouts
  testTimeout: 30000, // 30 seconds for each test
  
  // Reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }],
    ['jest-html-reporters', {
      publicPath: 'test-results/html',
      filename: 'report.html',
      openReport: false,
      pageTitle: 'Alfresco ECM Test Report',
      logoImgPath: './logo.png',
      hideIcon: false,
      expand: false
    }]
  ],
  
  // Globals
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  
  // Max workers for parallel execution
  maxWorkers: '50%',
  
  // Fail fast
  bail: false,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};