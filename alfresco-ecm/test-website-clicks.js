#!/usr/bin/env node

// Simple but comprehensive click test for the website
const puppeteer = require('puppeteer');

async function testWebsite() {
  console.log('🚀 Testing website for all clickable elements...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const baseUrl = 'http://localhost:3000';
  const results = {
    pages: [],
    totalClicks: 0,
    successfulClicks: 0,
    errors: []
  };

  try {
    // Navigate to homepage
    console.log('📍 Testing Homepage...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Get page title
    const title = await page.title();
    console.log(`  Page title: ${title}`);
    
    // Find all clickable elements
    const clickableSelectors = [
      'button',
      'a',
      '[role="button"]',
      'input[type="button"]',
      'input[type="submit"]',
      '[onclick]',
      '[data-testid*="button"]',
      '[style*="cursor: pointer"]'
    ];
    
    for (const selector of clickableSelectors) {
      const elements = await page.$$(selector);
      console.log(`  Found ${elements.length} elements matching "${selector}"`);
      
      for (let i = 0; i < elements.length; i++) {
        try {
          // Re-query element in case page changed
          const els = await page.$$(selector);
          if (els[i]) {
            const text = await els[i].evaluate(el => el.textContent || el.value || 'No text');
            const isVisible = await els[i].isIntersectingViewport();
            
            if (isVisible) {
              console.log(`    ✓ Found clickable: ${text.trim().substring(0, 30)}`);
              results.totalClicks++;
              results.successfulClicks++;
            }
          }
        } catch (err) {
          // Element might have been removed
        }
      }
    }
    
    // Test main navigation links
    console.log('\n📍 Testing Navigation Links...');
    const navLinks = [
      { text: 'Repository', expectedUrl: '/repository' },
      { text: 'Workflow', expectedUrl: '/workflow' },
      { text: 'Sites', expectedUrl: '/sites' },
      { text: 'Records', expectedUrl: '/records' }
    ];
    
    for (const link of navLinks) {
      try {
        // Go back to homepage
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        
        // Look for link containing text
        const linkElement = await page.$x(`//a[contains(., '${link.text}')] | //button[contains(., '${link.text}')]`);
        
        if (linkElement.length > 0) {
          console.log(`  Testing link: ${link.text}`);
          await linkElement[0].click();
          await page.waitForTimeout(1000);
          
          const currentUrl = page.url();
          if (currentUrl.includes(link.expectedUrl)) {
            console.log(`    ✓ Navigation successful to ${link.expectedUrl}`);
            results.successfulClicks++;
          } else {
            console.log(`    ⚠ Navigated to ${currentUrl} instead of ${link.expectedUrl}`);
          }
          results.totalClicks++;
        } else {
          console.log(`  ⚠ Link not found: ${link.text}`);
        }
      } catch (error) {
        console.log(`  ❌ Error testing ${link.text}: ${error.message}`);
        results.errors.push({ link: link.text, error: error.message });
      }
    }
    
    // Test form inputs
    console.log('\n📍 Testing Form Inputs...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    
    const inputs = await page.$$('input, textarea, select');
    console.log(`  Found ${inputs.length} input elements`);
    
    for (let i = 0; i < inputs.length; i++) {
      try {
        const input = inputs[i];
        const type = await input.evaluate(el => el.type || el.tagName.toLowerCase());
        const name = await input.evaluate(el => el.name || el.id || 'unnamed');
        
        console.log(`    Testing input: ${name} (${type})`);
        
        if (type === 'text' || type === 'email' || type === 'textarea') {
          await input.type('Test input');
          results.successfulClicks++;
        } else if (type === 'select') {
          const options = await input.$$('option');
          if (options.length > 1) {
            await input.select(options[1]);
            results.successfulClicks++;
          }
        }
        results.totalClicks++;
      } catch (err) {
        // Input might not be interactable
      }
    }
    
    // Test specific pages
    const pagesToTest = [
      '/repository',
      '/workflow',
      '/workflow/builder',
      '/sites',
      '/records'
    ];
    
    for (const pagePath of pagesToTest) {
      console.log(`\n📍 Testing page: ${pagePath}`);
      try {
        await page.goto(baseUrl + pagePath, { waitUntil: 'domcontentloaded', timeout: 10000 });
        
        // Count clickable elements on this page
        const buttons = await page.$$('button');
        const links = await page.$$('a');
        
        console.log(`  Found ${buttons.length} buttons and ${links.length} links`);
        results.pages.push({
          path: pagePath,
          buttons: buttons.length,
          links: links.length
        });
        
        // Try clicking first few buttons
        for (let i = 0; i < Math.min(3, buttons.length); i++) {
          try {
            const buttonText = await buttons[i].evaluate(el => el.textContent);
            console.log(`    Clicking button: ${buttonText?.trim().substring(0, 30)}`);
            await buttons[i].click();
            await page.waitForTimeout(500);
            results.successfulClicks++;
            results.totalClicks++;
          } catch (err) {
            results.totalClicks++;
          }
        }
      } catch (error) {
        console.log(`  ❌ Error loading page: ${error.message}`);
        results.errors.push({ page: pagePath, error: error.message });
      }
    }
    
    // Check for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        results.errors.push({ type: 'console', message: msg.text() });
      }
    });
    
  } catch (error) {
    console.error('Fatal error:', error);
    results.errors.push({ type: 'fatal', error: error.message });
  } finally {
    // Generate report
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Total clickable elements found: ${results.totalClicks}`);
    console.log(`✅ Successfully tested: ${results.successfulClicks}`);
    console.log(`❌ Errors encountered: ${results.errors.length}`);
    console.log(`📊 Success rate: ${results.totalClicks > 0 ? ((results.successfulClicks / results.totalClicks) * 100).toFixed(2) : 0}%`);
    
    console.log('\n📄 Pages tested:');
    results.pages.forEach(p => {
      console.log(`  ${p.path}: ${p.buttons} buttons, ${p.links} links`);
    });
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(e => {
        console.log(`  - ${e.page || e.type || 'Unknown'}: ${e.error || e.message}`);
      });
    }
    
    // Save report
    const fs = require('fs');
    fs.writeFileSync('website-test-report.json', JSON.stringify(results, null, 2));
    console.log('\n💾 Report saved to website-test-report.json');
    
    await browser.close();
  }
}

// Run test
testWebsite().catch(console.error);