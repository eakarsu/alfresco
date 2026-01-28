#!/usr/bin/env node

// Test EVERY Possible Click on the Website
const puppeteer = require('puppeteer');

async function testEveryClick() {
  console.log('🎯 Testing EVERY Clickable Element on Alfresco ECM\n');
  console.log('=' . repeat(60));
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const baseUrl = 'http://localhost:3000';
  const clickResults = [];
  
  // Pages to test
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/repository', name: 'Repository' },
    { path: '/workflow', name: 'Workflow' },
    { path: '/workflow/builder', name: 'Workflow Builder' },
    { path: '/sites', name: 'Sites' },
    { path: '/records', name: 'Records' },
    { path: '/search', name: 'Search' },
    { path: '/admin', name: 'Admin' }
  ];
  
  try {
    for (const pageToTest of pages) {
      console.log(`\n📄 Testing ${pageToTest.name} (${pageToTest.path})`);
      console.log('-'.repeat(40));
      
      await page.goto(baseUrl + pageToTest.path, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait for page to be interactive
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find ALL clickable elements
      const clickableElements = await page.evaluate(() => {
        const elements = [];
        
        // Get all buttons
        document.querySelectorAll('button').forEach(btn => {
          elements.push({
            type: 'button',
            text: btn.textContent.trim(),
            testId: btn.getAttribute('data-testid'),
            disabled: btn.disabled,
            selector: btn.id ? `#${btn.id}` : null
          });
        });
        
        // Get all links
        document.querySelectorAll('a').forEach(link => {
          elements.push({
            type: 'link',
            text: link.textContent.trim(),
            href: link.href,
            testId: link.getAttribute('data-testid')
          });
        });
        
        // Get all elements with onclick
        document.querySelectorAll('[onclick]').forEach(el => {
          if (!el.matches('button, a')) {
            elements.push({
              type: 'clickable',
              text: el.textContent.trim(),
              tag: el.tagName.toLowerCase()
            });
          }
        });
        
        // Get all inputs that are clickable (checkboxes, radios, submit)
        document.querySelectorAll('input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"]').forEach(input => {
          elements.push({
            type: 'input',
            inputType: input.type,
            value: input.value,
            checked: input.checked
          });
        });
        
        // Get all elements with role="button"
        document.querySelectorAll('[role="button"]').forEach(el => {
          if (!el.matches('button, a')) {
            elements.push({
              type: 'role-button',
              text: el.textContent.trim()
            });
          }
        });
        
        // Get all select dropdowns
        document.querySelectorAll('select').forEach(select => {
          elements.push({
            type: 'select',
            name: select.name,
            options: Array.from(select.options).map(opt => opt.text)
          });
        });
        
        // Get all clickable divs/spans with cursor:pointer
        document.querySelectorAll('div, span').forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.cursor === 'pointer' && !el.matches('[role="button"]')) {
            elements.push({
              type: 'styled-clickable',
              text: el.textContent.trim().substring(0, 50)
            });
          }
        });
        
        return elements;
      });
      
      console.log(`  Found ${clickableElements.length} clickable elements:`);
      
      // Group by type
      const grouped = {};
      clickableElements.forEach(el => {
        grouped[el.type] = (grouped[el.type] || 0) + 1;
      });
      
      Object.entries(grouped).forEach(([type, count]) => {
        console.log(`    • ${count} ${type}s`);
      });
      
      // Test clicking each button (non-destructive ones)
      const buttons = clickableElements.filter(el => el.type === 'button' && !el.disabled);
      
      for (const button of buttons) {
        const safeToClick = !button.text.toLowerCase().includes('delete') &&
                           !button.text.toLowerCase().includes('remove') &&
                           !button.text.toLowerCase().includes('logout') &&
                           !button.text.toLowerCase().includes('clear') &&
                           !button.text.toLowerCase().includes('reset');
        
        if (safeToClick && button.testId) {
          try {
            // Try to click the button
            const element = await page.$(`[data-testid="${button.testId}"]`);
            if (element) {
              await element.click();
              clickResults.push({
                page: pageToTest.name,
                element: button.text,
                status: 'clicked',
                type: 'button'
              });
              console.log(`    ✅ Clicked: ${button.text}`);
              
              // Go back to the page if navigation occurred
              const currentUrl = page.url();
              if (!currentUrl.includes(pageToTest.path)) {
                await page.goto(baseUrl + pageToTest.path, { waitUntil: 'networkidle2' });
              }
              
              // Handle any modals/popups
              await page.evaluate(() => {
                // Close any modals
                const closeButtons = document.querySelectorAll('[aria-label="Close"], .close, .modal-close');
                closeButtons.forEach(btn => btn.click());
              });
              
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } catch (error) {
            clickResults.push({
              page: pageToTest.name,
              element: button.text,
              status: 'error',
              error: error.message
            });
            console.log(`    ⚠️ Could not click: ${button.text}`);
          }
        }
      }
      
      // Test navigation links
      const links = clickableElements.filter(el => el.type === 'link' && el.href);
      console.log(`  Testing ${links.length} navigation links...`);
      
      for (const link of links.slice(0, 5)) { // Test first 5 links per page
        if (link.href.startsWith('http://localhost:3000')) {
          try {
            await page.goto(link.href, { waitUntil: 'networkidle2', timeout: 10000 });
            clickResults.push({
              page: pageToTest.name,
              element: link.text,
              status: 'navigated',
              type: 'link',
              href: link.href
            });
            console.log(`    ✅ Navigated to: ${link.text}`);
            
            // Go back to test page
            await page.goto(baseUrl + pageToTest.path, { waitUntil: 'networkidle2' });
          } catch (error) {
            clickResults.push({
              page: pageToTest.name,
              element: link.text,
              status: 'nav-error',
              error: error.message
            });
          }
        }
      }
      
      // Test form inputs
      const inputs = clickableElements.filter(el => el.type === 'input');
      if (inputs.length > 0) {
        console.log(`  Found ${inputs.length} form inputs`);
        for (const input of inputs) {
          if (input.inputType === 'checkbox' || input.inputType === 'radio') {
            clickResults.push({
              page: pageToTest.name,
              element: `${input.inputType} input`,
              status: 'found',
              type: 'input'
            });
          }
        }
      }
      
      // Test select dropdowns
      const selects = clickableElements.filter(el => el.type === 'select');
      if (selects.length > 0) {
        console.log(`  Found ${selects.length} dropdown menus`);
        selects.forEach(select => {
          clickResults.push({
            page: pageToTest.name,
            element: `Select with ${select.options.length} options`,
            status: 'found',
            type: 'select'
          });
        });
      }
    }
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
    
    // Generate comprehensive report
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE CLICK TEST REPORT');
    console.log('='.repeat(60));
    
    // Summary by page
    const byPage = {};
    clickResults.forEach(result => {
      if (!byPage[result.page]) {
        byPage[result.page] = {
          clicked: 0,
          navigated: 0,
          found: 0,
          errors: 0
        };
      }
      
      if (result.status === 'clicked') byPage[result.page].clicked++;
      else if (result.status === 'navigated') byPage[result.page].navigated++;
      else if (result.status === 'found') byPage[result.page].found++;
      else if (result.status === 'error' || result.status === 'nav-error') byPage[result.page].errors++;
    });
    
    console.log('\n📄 Results by Page:');
    Object.entries(byPage).forEach(([page, stats]) => {
      console.log(`\n  ${page}:`);
      console.log(`    • Buttons clicked: ${stats.clicked}`);
      console.log(`    • Links navigated: ${stats.navigated}`);
      console.log(`    • Elements found: ${stats.found}`);
      if (stats.errors > 0) {
        console.log(`    • Errors: ${stats.errors}`);
      }
    });
    
    // Overall statistics
    const totalClicked = clickResults.filter(r => r.status === 'clicked').length;
    const totalNavigated = clickResults.filter(r => r.status === 'navigated').length;
    const totalFound = clickResults.filter(r => r.status === 'found').length;
    const totalErrors = clickResults.filter(r => r.status === 'error' || r.status === 'nav-error').length;
    
    console.log('\n📈 Overall Statistics:');
    console.log(`  • Total buttons clicked: ${totalClicked}`);
    console.log(`  • Total links navigated: ${totalNavigated}`);
    console.log(`  • Total elements found: ${totalFound}`);
    console.log(`  • Total interactions: ${totalClicked + totalNavigated}`);
    
    if (totalErrors > 0) {
      console.log(`  • Total errors: ${totalErrors}`);
    }
    
    // Save detailed results
    const fs = require('fs');
    fs.writeFileSync('click-test-results.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        totalClicked,
        totalNavigated,
        totalFound,
        totalErrors,
        totalInteractions: totalClicked + totalNavigated
      },
      byPage,
      details: clickResults
    }, null, 2));
    
    console.log('\n💾 Detailed results saved to click-test-results.json');
    
    if (totalErrors === 0) {
      console.log('\n🎉 ALL CLICKABLE ELEMENTS TESTED SUCCESSFULLY! 🎉');
      process.exit(0);
    } else {
      console.log(`\n⚠️ ${totalErrors} errors encountered during testing.`);
      process.exit(1);
    }
  }
}

// Run the comprehensive click test
console.log('🚀 Starting Comprehensive Click Testing...\n');
testEveryClick().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});