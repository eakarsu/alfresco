#!/usr/bin/env node

// Comprehensive Click Testing Script
// Tests EVERY clickable element on the website

const puppeteer = require('puppeteer');

async function testAllClicks() {
  console.log('🚀 Starting comprehensive click testing...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  const baseUrl = 'http://localhost:3000';
  const clickResults = [];
  const errors = [];
  
  // Track console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({
        url: page.url(),
        error: msg.text(),
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Track page errors
  page.on('pageerror', error => {
    errors.push({
      url: page.url(),
      error: error.message,
      timestamp: new Date().toISOString()
    });
  });

  try {
    // ========================================
    // TEST HOMEPAGE
    // ========================================
    console.log('📍 Testing Homepage...');
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Get all clickable elements
    const homepageElements = await page.evaluate(() => {
      const elements = [];
      // Find all clickable elements
      const clickables = document.querySelectorAll('a, button, [role="button"], [onclick], input[type="submit"], input[type="button"], [data-testid*="button"], [data-testid*="link"], .clickable, [style*="cursor: pointer"]');
      
      clickables.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) { // Only visible elements
          elements.push({
            index,
            tag: el.tagName,
            text: el.textContent?.trim().substring(0, 50),
            href: el.href,
            id: el.id,
            className: el.className,
            testId: el.getAttribute('data-testid'),
            isVisible: rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
          });
        }
      });
      return elements;
    });
    
    console.log(`Found ${homepageElements.length} clickable elements on homepage`);
    
    // Test each clickable element
    for (const element of homepageElements) {
      try {
        await page.goto(baseUrl, { waitUntil: 'networkidle2' });
        
        // Find and click the element
        const selector = element.id ? `#${element.id}` : 
                        element.testId ? `[data-testid="${element.testId}"]` :
                        `${element.tag.toLowerCase()}:nth-of-type(${element.index + 1})`;
        
        const elementHandle = await page.$(selector);
        if (elementHandle) {
          // Check if element is clickable
          const isClickable = await page.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && !el.disabled;
          }, elementHandle);
          
          if (isClickable) {
            console.log(`  ✓ Clicking: ${element.text || element.tag} (${selector})`);
            
            // Click and wait for navigation or action
            await Promise.race([
              elementHandle.click(),
              page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }),
              page.waitForTimeout(1000)
            ]).catch(() => {});
            
            // Record result
            clickResults.push({
              page: 'homepage',
              element: element.text || element.tag,
              selector,
              newUrl: page.url(),
              success: true,
              timestamp: new Date().toISOString()
            });
            
            // Check for modals or popups
            const hasModal = await page.evaluate(() => {
              return document.querySelector('[role="dialog"], .modal, .popup, [data-testid*="modal"]') !== null;
            });
            
            if (hasModal) {
              console.log('    → Modal detected, closing...');
              // Try to close modal
              await page.keyboard.press('Escape');
              await page.waitForTimeout(500);
            }
          }
        }
      } catch (error) {
        clickResults.push({
          page: 'homepage',
          element: element.text || element.tag,
          success: false,
          error: error.message
        });
      }
    }
    
    // ========================================
    // TEST ALL MAIN PAGES
    // ========================================
    const mainPages = [
      { path: '/repository', name: 'Repository' },
      { path: '/workflow', name: 'Workflow' },
      { path: '/workflow/builder', name: 'Workflow Builder' },
      { path: '/sites', name: 'Sites' },
      { path: '/records', name: 'Records Management' },
      { path: '/search', name: 'Search' },
      { path: '/admin', name: 'Admin' }
    ];
    
    for (const pageInfo of mainPages) {
      console.log(`\n📍 Testing ${pageInfo.name} page...`);
      
      try {
        await page.goto(baseUrl + pageInfo.path, { waitUntil: 'networkidle2', timeout: 10000 });
        
        // Get all clickable elements on this page
        const pageElements = await page.evaluate(() => {
          const elements = [];
          const clickables = document.querySelectorAll('a, button, [role="button"], [onclick], input[type="submit"], [data-testid*="button"], [data-testid*="link"]');
          
          clickables.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              elements.push({
                index,
                tag: el.tagName,
                text: el.textContent?.trim().substring(0, 50),
                testId: el.getAttribute('data-testid'),
                className: el.className
              });
            }
          });
          return elements;
        });
        
        console.log(`Found ${pageElements.length} clickable elements on ${pageInfo.name}`);
        
        // Test clicks on this page
        for (const element of pageElements) {
          try {
            // Re-navigate to page
            await page.goto(baseUrl + pageInfo.path, { waitUntil: 'networkidle2', timeout: 10000 });
            
            const selector = element.testId ? `[data-testid="${element.testId}"]` :
                           `${element.tag.toLowerCase()}:nth-of-type(${element.index + 1})`;
            
            const elementHandle = await page.$(selector);
            if (elementHandle) {
              console.log(`  ✓ Clicking: ${element.text || element.tag}`);
              
              await Promise.race([
                elementHandle.click(),
                page.waitForTimeout(1000)
              ]).catch(() => {});
              
              clickResults.push({
                page: pageInfo.name,
                element: element.text || element.tag,
                success: true
              });
            }
          } catch (error) {
            clickResults.push({
              page: pageInfo.name,
              element: element.text || element.tag,
              success: false,
              error: error.message
            });
          }
        }
      } catch (error) {
        console.log(`  ❌ Error loading ${pageInfo.name}: ${error.message}`);
        errors.push({
          page: pageInfo.name,
          error: error.message
        });
      }
    }
    
    // ========================================
    // TEST FORMS AND INPUTS
    // ========================================
    console.log('\n📍 Testing Forms and Inputs...');
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Find all forms
    const forms = await page.evaluate(() => {
      const formElements = [];
      document.querySelectorAll('form, [data-testid*="form"]').forEach((form, index) => {
        const inputs = form.querySelectorAll('input, textarea, select');
        formElements.push({
          index,
          inputCount: inputs.length,
          action: form.action,
          method: form.method
        });
      });
      return formElements;
    });
    
    console.log(`Found ${forms.length} forms to test`);
    
    // Test each form
    for (const form of forms) {
      console.log(`  Testing form ${form.index} with ${form.inputCount} inputs`);
      
      // Fill and submit each form
      try {
        // Fill text inputs
        await page.evaluate((formIndex) => {
          const form = document.querySelectorAll('form')[formIndex];
          if (form) {
            form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]').forEach(input => {
              input.value = 'test@example.com';
            });
            form.querySelectorAll('textarea').forEach(textarea => {
              textarea.value = 'Test content';
            });
            form.querySelectorAll('select').forEach(select => {
              if (select.options.length > 1) {
                select.selectedIndex = 1;
              }
            });
          }
        }, form.index);
        
        clickResults.push({
          type: 'form',
          index: form.index,
          success: true
        });
      } catch (error) {
        clickResults.push({
          type: 'form',
          index: form.index,
          success: false,
          error: error.message
        });
      }
    }
    
    // ========================================
    // TEST DROPDOWNS AND MENUS
    // ========================================
    console.log('\n📍 Testing Dropdowns and Menus...');
    
    const dropdowns = await page.evaluate(() => {
      const elements = [];
      document.querySelectorAll('select, [role="combobox"], [data-testid*="dropdown"], [data-testid*="select"]').forEach((el, index) => {
        elements.push({
          index,
          tag: el.tagName,
          id: el.id,
          optionsCount: el.options?.length || 0
        });
      });
      return elements;
    });
    
    console.log(`Found ${dropdowns.length} dropdowns to test`);
    
    for (const dropdown of dropdowns) {
      try {
        const selector = dropdown.id ? `#${dropdown.id}` : `${dropdown.tag.toLowerCase()}:nth-of-type(${dropdown.index + 1})`;
        
        // Test each option in dropdown
        for (let i = 0; i < dropdown.optionsCount; i++) {
          await page.select(selector, { index: i });
          console.log(`  ✓ Selected option ${i} in dropdown ${dropdown.index}`);
        }
        
        clickResults.push({
          type: 'dropdown',
          index: dropdown.index,
          success: true
        });
      } catch (error) {
        clickResults.push({
          type: 'dropdown',
          index: dropdown.index,
          success: false,
          error: error.message
        });
      }
    }
    
    // ========================================
    // TEST KEYBOARD NAVIGATION
    // ========================================
    console.log('\n📍 Testing Keyboard Navigation...');
    
    // Tab through all elements
    let tabCount = 0;
    let previousElement = null;
    
    while (tabCount < 100) { // Limit to prevent infinite loop
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          id: el?.id,
          className: el?.className,
          text: el?.textContent?.trim().substring(0, 50)
        };
      });
      
      if (JSON.stringify(focusedElement) === JSON.stringify(previousElement)) {
        break; // We've cycled through all elements
      }
      
      previousElement = focusedElement;
      tabCount++;
      
      // Try pressing Enter on focused element
      if (focusedElement.tag === 'BUTTON' || focusedElement.tag === 'A') {
        console.log(`  ✓ Tab to: ${focusedElement.text || focusedElement.tag}`);
      }
    }
    
    console.log(`  Tabbed through ${tabCount} elements`);
    
    // ========================================
    // GENERATE REPORT
    // ========================================
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    
    const successCount = clickResults.filter(r => r.success).length;
    const failureCount = clickResults.filter(r => !r.success).length;
    
    console.log(`✅ Successful clicks: ${successCount}`);
    console.log(`❌ Failed clicks: ${failureCount}`);
    console.log(`⚠️  Page errors: ${errors.length}`);
    console.log(`📊 Total elements tested: ${clickResults.length}`);
    console.log(`🎯 Success rate: ${((successCount / clickResults.length) * 100).toFixed(2)}%`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.forEach(error => {
        console.log(`  - ${error.page || error.url}: ${error.error}`);
      });
    }
    
    if (failureCount > 0) {
      console.log('\n❌ Failed clicks:');
      clickResults.filter(r => !r.success).forEach(result => {
        console.log(`  - ${result.page} > ${result.element}: ${result.error}`);
      });
    }
    
    // Save detailed report
    const fs = require('fs');
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTested: clickResults.length,
        successful: successCount,
        failed: failureCount,
        errors: errors.length,
        successRate: ((successCount / clickResults.length) * 100).toFixed(2) + '%'
      },
      details: clickResults,
      errors: errors
    };
    
    fs.writeFileSync('click-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to click-test-report.json');
    
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testAllClicks().catch(console.error);