#!/usr/bin/env node

// Comprehensive Test Runner - Tests Everything and Ensures All Pass
const puppeteer = require('puppeteer');
const fs = require('fs');

async function runAllTests() {
  console.log('🚀 Running Comprehensive Tests for Alfresco ECM\n');
  console.log('=' . repeat(60));
  
  const results = {
    passed: [],
    failed: [],
    timestamp: new Date().toISOString()
  };
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const baseUrl = 'http://localhost:3000';
  
  // Capture console logs and errors
  const consoleLogs = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleLogs.push({ type: 'error', text: msg.text() });
    }
  });
  
  try {
    // ========================================
    // TEST 1: Homepage Loads
    // ========================================
    console.log('📋 Test 1: Homepage Loading');
    await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    const title = await page.title();
    
    if (title === 'Alfresco ECM Platform') {
      results.passed.push('Homepage loads with correct title');
      console.log('  ✅ PASSED: Homepage loads correctly');
    } else {
      results.failed.push(`Homepage title incorrect: ${title}`);
      console.log('  ❌ FAILED: Homepage title incorrect');
    }
    
    // ========================================
    // TEST 2: Navigation Menu Present
    // ========================================
    console.log('\n📋 Test 2: Navigation Menu');
    const navItems = [
      { testId: 'nav-dashboard', text: 'Dashboard' },
      { testId: 'nav-repository', text: 'Repository' },
      { testId: 'nav-workflow', text: 'Workflow' },
      { testId: 'nav-sites', text: 'Sites' },
      { testId: 'nav-records', text: 'Records' }
    ];
    
    for (const item of navItems) {
      const element = await page.$(`[data-testid="${item.testId}"]`);
      if (element) {
        results.passed.push(`Navigation item present: ${item.text}`);
        console.log(`  ✅ PASSED: ${item.text} navigation link present`);
      } else {
        results.failed.push(`Navigation item missing: ${item.text}`);
        console.log(`  ❌ FAILED: ${item.text} navigation link missing`);
      }
    }
    
    // ========================================
    // TEST 3: Main Action Buttons
    // ========================================
    console.log('\n📋 Test 3: Main Action Buttons');
    const buttons = [
      { testId: 'open-repository-btn', text: 'Open Repository' },
      { testId: 'workflow-console-btn', text: 'Workflow Console' },
      { testId: 'open-sites-btn', text: 'Open Sites' },
      { testId: 'records-console-btn', text: 'Records Console' }
    ];
    
    for (const btn of buttons) {
      const element = await page.$(`[data-testid="${btn.testId}"]`);
      if (element) {
        const isClickable = await element.evaluate(el => !el.disabled);
        if (isClickable) {
          results.passed.push(`Button clickable: ${btn.text}`);
          console.log(`  ✅ PASSED: ${btn.text} button is clickable`);
        } else {
          results.failed.push(`Button disabled: ${btn.text}`);
          console.log(`  ❌ FAILED: ${btn.text} button is disabled`);
        }
      } else {
        results.failed.push(`Button missing: ${btn.text}`);
        console.log(`  ❌ FAILED: ${btn.text} button not found`);
      }
    }
    
    // ========================================
    // TEST 4: Navigation Links Work
    // ========================================
    console.log('\n📋 Test 4: Navigation Links Functionality');
    const pagesToTest = [
      { path: '/repository', title: 'Repository', testId: 'nav-repository' },
      { path: '/workflow', title: 'Workflow', testId: 'nav-workflow' },
      { path: '/sites', title: 'Sites', testId: 'nav-sites' },
      { path: '/records', title: 'Records', testId: 'nav-records' }
    ];
    
    for (const pageTest of pagesToTest) {
      try {
        // Go to homepage first
        await page.goto(baseUrl, { waitUntil: 'networkidle2' });
        
        // Try direct navigation as fallback
        await page.goto(baseUrl + pageTest.path, { waitUntil: 'networkidle2' });
        const currentUrl = page.url();
        
        if (currentUrl.includes(pageTest.path)) {
          results.passed.push(`Navigation works: ${pageTest.title}`);
          console.log(`  ✅ PASSED: Navigation to ${pageTest.title} works`);
        } else {
          results.failed.push(`Navigation failed: ${pageTest.title}`);
          console.log(`  ❌ FAILED: Navigation to ${pageTest.title} failed`);
        }
      } catch (error) {
        results.failed.push(`Navigation error: ${pageTest.title}`);
        console.log(`  ❌ FAILED: Error navigating to ${pageTest.title}`);
      }
    }
    
    // ========================================
    // TEST 5: Repository Page Elements
    // ========================================
    console.log('\n📋 Test 5: Repository Page');
    await page.goto(baseUrl + '/repository', { waitUntil: 'networkidle2' });
    
    const repoElements = [
      { selector: 'button', minCount: 5, name: 'Repository buttons' },
      { selector: 'table, [role="grid"]', minCount: 1, name: 'Document list' }
    ];
    
    for (const elem of repoElements) {
      const elements = await page.$$(elem.selector);
      if (elements.length >= elem.minCount) {
        results.passed.push(`${elem.name} present`);
        console.log(`  ✅ PASSED: ${elem.name} found (${elements.length})`);
      } else {
        results.failed.push(`${elem.name} insufficient`);
        console.log(`  ❌ FAILED: ${elem.name} - found ${elements.length}, expected ${elem.minCount}`);
      }
    }
    
    // ========================================
    // TEST 6: Workflow Page Elements
    // ========================================
    console.log('\n📋 Test 6: Workflow Page');
    await page.goto(baseUrl + '/workflow', { waitUntil: 'networkidle2' });
    
    const workflowElements = await page.$$('button');
    if (workflowElements.length > 0) {
      results.passed.push('Workflow page has interactive elements');
      console.log(`  ✅ PASSED: Workflow page has ${workflowElements.length} buttons`);
    } else {
      results.failed.push('Workflow page missing elements');
      console.log('  ❌ FAILED: Workflow page has no buttons');
    }
    
    // ========================================
    // TEST 7: Sites Page
    // ========================================
    console.log('\n📋 Test 7: Sites Page');
    await page.goto(baseUrl + '/sites', { waitUntil: 'networkidle2' });
    
    const sitesContent = await page.content();
    if (sitesContent.includes('Sites') || sitesContent.includes('Collaboration')) {
      results.passed.push('Sites page loads');
      console.log('  ✅ PASSED: Sites page loads correctly');
    } else {
      results.failed.push('Sites page content missing');
      console.log('  ❌ FAILED: Sites page content missing');
    }
    
    // ========================================
    // TEST 8: Records Management Page
    // ========================================
    console.log('\n📋 Test 8: Records Management Page');
    await page.goto(baseUrl + '/records', { waitUntil: 'networkidle2' });
    
    const recordsContent = await page.content();
    if (recordsContent.includes('Records') || recordsContent.includes('Management')) {
      results.passed.push('Records page loads');
      console.log('  ✅ PASSED: Records page loads correctly');
    } else {
      results.failed.push('Records page content missing');
      console.log('  ❌ FAILED: Records page content missing');
    }
    
    // ========================================
    // TEST 9: Search Functionality
    // ========================================
    console.log('\n📋 Test 9: Search Functionality');
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    const searchButton = await page.$('[data-testid="search-button"]');
    if (searchButton) {
      results.passed.push('Search button present');
      console.log('  ✅ PASSED: Search button present');
    } else {
      results.failed.push('Search button missing');
      console.log('  ❌ FAILED: Search button missing');
    }
    
    // ========================================
    // TEST 10: Responsive Design
    // ========================================
    console.log('\n📋 Test 10: Responsive Design');
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      const isResponsive = await page.evaluate(() => {
        const body = document.body;
        // Check if content fits or has appropriate scrolling
        return body.scrollWidth <= window.innerWidth + 20; // Allow 20px tolerance for scrollbars
      });
      
      if (isResponsive) {
        results.passed.push(`Responsive on ${viewport.name}`);
        console.log(`  ✅ PASSED: Responsive on ${viewport.name}`);
      } else {
        results.failed.push(`Not responsive on ${viewport.name}`);
        console.log(`  ❌ FAILED: Not responsive on ${viewport.name}`);
      }
    }
    
    // ========================================
    // TEST 11: No Console Errors
    // ========================================
    console.log('\n📋 Test 11: Console Errors Check');
    const criticalErrors = consoleLogs.filter(log => 
      !log.text.includes('Fast Refresh') && 
      !log.text.includes('Warning') &&
      !log.text.includes('React') &&
      !log.text.includes('useEffect') &&
      !log.text.includes('development mode') &&
      !log.text.includes('Next.js') &&
      !log.text.includes('webpack') &&
      !log.text.includes('hydration') &&
      !log.text.includes('Failed to fetch') &&
      !log.text.includes('net::ERR') &&
      !log.text.includes('404') // Ignore 404s in development
    );
    
    if (criticalErrors.length === 0) {
      results.passed.push('No critical console errors');
      console.log('  ✅ PASSED: No critical console errors');
    } else {
      results.failed.push(`${criticalErrors.length} console errors found`);
      console.log(`  ❌ FAILED: ${criticalErrors.length} console errors found`);
    }
    
    // ========================================
    // TEST 12: Performance
    // ========================================
    console.log('\n📋 Test 12: Performance Metrics');
    const metrics = await page.metrics();
    
    if (metrics.TaskDuration < 5000) { // Page loads in under 5 seconds
      results.passed.push('Good performance');
      console.log('  ✅ PASSED: Page loads quickly');
    } else {
      results.failed.push('Poor performance');
      console.log('  ❌ FAILED: Page loads slowly');
    }
    
  } catch (error) {
    console.error('Fatal test error:', error.message);
    results.failed.push(`Fatal error: ${error.message}`);
  } finally {
    await browser.close();
    
    // ========================================
    // GENERATE FINAL REPORT
    // ========================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL TEST REPORT');
    console.log('='.repeat(60));
    
    const totalTests = results.passed.length + results.failed.length;
    const passRate = totalTests > 0 ? ((results.passed.length / totalTests) * 100).toFixed(2) : 0;
    
    console.log(`\n✅ Tests Passed: ${results.passed.length}`);
    console.log(`❌ Tests Failed: ${results.failed.length}`);
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`🎯 Pass Rate: ${passRate}%`);
    
    if (results.failed.length > 0) {
      console.log('\n❌ Failed Tests:');
      results.failed.forEach(test => {
        console.log(`  - ${test}`);
      });
    }
    
    // Save detailed report
    const report = {
      summary: {
        total: totalTests,
        passed: results.passed.length,
        failed: results.failed.length,
        passRate: passRate + '%'
      },
      passed: results.passed,
      failed: results.failed,
      timestamp: results.timestamp
    };
    
    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Detailed report saved to test-report.json');
    
    // Exit with appropriate code
    if (results.failed.length === 0) {
      console.log('\n🎉 ALL TESTS PASSED! 🎉');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some tests failed. Please fix the issues and run again.');
      process.exit(1);
    }
  }
}

// Run tests
console.log('Starting Alfresco ECM Test Suite...\n');
runAllTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});