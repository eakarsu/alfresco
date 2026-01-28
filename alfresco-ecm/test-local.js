#!/usr/bin/env node

/**
 * Test script to verify local development setup
 */

const http = require('http');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if a port is responding
function checkPort(port, timeout = 5000) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/health',
      method: 'GET',
      timeout: timeout
    };
    
    const req = http.request(options, (res) => {
      resolve({ success: true, statusCode: res.statusCode });
    });
    
    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
    
    req.end();
  });
}

// Check Docker services
async function checkDocker() {
  log('\n🐳 Checking Docker Services...', 'blue');
  
  const services = [
    { name: 'PostgreSQL', port: 5432 },
    { name: 'MongoDB', port: 27017 },
    { name: 'Elasticsearch', port: 9200 },
    { name: 'Redis', port: 6379 },
    { name: 'MinIO', port: 9000 }
  ];
  
  for (const service of services) {
    try {
      // Use a simple TCP check for databases
      const net = require('net');
      const client = new net.Socket();
      
      const result = await new Promise((resolve) => {
        client.setTimeout(2000);
        
        client.connect(service.port, 'localhost', () => {
          client.destroy();
          resolve(true);
        });
        
        client.on('error', () => {
          resolve(false);
        });
        
        client.on('timeout', () => {
          client.destroy();
          resolve(false);
        });
      });
      
      if (result) {
        log(`  ✅ ${service.name} is running on port ${service.port}`, 'green');
      } else {
        log(`  ❌ ${service.name} is not responding on port ${service.port}`, 'red');
      }
    } catch (error) {
      log(`  ❌ ${service.name}: ${error.message}`, 'red');
    }
  }
}

// Check local services
async function checkLocalServices() {
  log('\n📦 Checking Local Services...', 'blue');
  
  const services = [
    { name: 'Auth Service', port: 3001 },
    { name: 'Document Service', port: 3002 },
    { name: 'Workflow Service', port: 3003 },
    { name: 'Web Application', port: 3000 }
  ];
  
  for (const service of services) {
    const result = await checkPort(service.port, 2000);
    if (result.success) {
      log(`  ✅ ${service.name} is running on port ${service.port}`, 'green');
    } else {
      log(`  ⚠️  ${service.name} is not running on port ${service.port}`, 'yellow');
    }
  }
}

// Check Node.js and npm
async function checkNode() {
  log('\n🟢 Checking Node.js Environment...', 'blue');
  
  try {
    const { stdout: nodeVersion } = await execAsync('node --version');
    log(`  ✅ Node.js ${nodeVersion.trim()}`, 'green');
    
    const { stdout: npmVersion } = await execAsync('npm --version');
    log(`  ✅ npm ${npmVersion.trim()}`, 'green');
  } catch (error) {
    log(`  ❌ Error checking Node.js: ${error.message}`, 'red');
  }
}

// Check file structure
function checkFileStructure() {
  log('\n📁 Checking Project Structure...', 'blue');
  
  const fs = require('fs');
  const requiredPaths = [
    'package.json',
    'docker-compose.yml',
    'services/auth/package.json',
    'services/document/package.json',
    'apps/web/package.json',
    'init-scripts/postgres/01-init-database.sql'
  ];
  
  let allExists = true;
  for (const path of requiredPaths) {
    if (fs.existsSync(path)) {
      log(`  ✅ ${path}`, 'green');
    } else {
      log(`  ❌ Missing: ${path}`, 'red');
      allExists = false;
    }
  }
  
  return allExists;
}

// Main test function
async function runTests() {
  log('========================================', 'blue');
  log('  Alfresco ECM Local Development Test', 'blue');
  log('========================================', 'blue');
  
  await checkNode();
  const structureOk = checkFileStructure();
  await checkDocker();
  await checkLocalServices();
  
  log('\n========================================', 'blue');
  if (structureOk) {
    log('  ✅ Setup is ready for local development!', 'green');
    log('\n  To start services:', 'blue');
    log('    • Start all: ./start-local.sh', 'yellow');
    log('    • Interactive: node dev.js', 'yellow');
    log('    • Manual: cd services/[name] && npm run dev', 'yellow');
  } else {
    log('  ⚠️  Some components are missing', 'yellow');
    log('  Run: npm install', 'yellow');
  }
  log('========================================', 'blue');
}

// Run tests
runTests().catch(console.error);