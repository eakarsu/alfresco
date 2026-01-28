#!/usr/bin/env node

/**
 * Alfresco ECM Development Runner
 * Helps run services locally for development
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Service configurations
const services = {
  auth: { port: 3001, path: 'services/auth', name: 'Authentication Service' },
  document: { port: 3002, path: 'services/document', name: 'Document Service' },
  workflow: { port: 3003, path: 'services/workflow', name: 'Workflow Service' },
  search: { port: 3004, path: 'services/search', name: 'Search Service' },
  transformation: { port: 3005, path: 'services/transformation', name: 'Transformation Service' },
  cmis: { port: 3006, path: 'services/cmis', name: 'CMIS Service' },
  protocols: { port: 3007, path: 'services/protocols', name: 'Protocols Service' },
  office: { port: 3008, path: 'services/office', name: 'Office Integration Service' },
  email: { port: 3009, path: 'services/email', name: 'Email Service' },
  'smart-folders': { port: 3010, path: 'services/smart-folders', name: 'Smart Folders Service' },
  replication: { port: 3011, path: 'services/replication', name: 'Replication Service' },
  forms: { port: 3012, path: 'services/forms', name: 'Forms Service' },
  analytics: { port: 3013, path: 'services/analytics', name: 'Analytics Service' },
  ai: { port: 3014, path: 'services/ai', name: 'AI Service' },
  dam: { port: 3015, path: 'services/dam', name: 'Digital Asset Management' },
  web: { port: 3000, path: 'apps/web', name: 'Web Application' }
};

// Running processes
const runningProcesses = new Map();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logService(service, message, color = 'reset') {
  console.log(`${colors.cyan}[${service}]${colors.reset} ${colors[color]}${message}${colors.reset}`);
}

// Check if port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

// Start a service
async function startService(serviceName) {
  const service = services[serviceName];
  
  if (!service) {
    log(`Unknown service: ${serviceName}`, 'red');
    return false;
  }
  
  if (runningProcesses.has(serviceName)) {
    log(`${service.name} is already running`, 'yellow');
    return false;
  }
  
  const servicePath = path.join(__dirname, service.path);
  
  if (!fs.existsSync(servicePath)) {
    log(`Service path not found: ${servicePath}`, 'red');
    return false;
  }
  
  // Check if port is available
  const portAvailable = await checkPort(service.port);
  if (!portAvailable) {
    log(`Port ${service.port} is already in use`, 'red');
    return false;
  }
  
  log(`Starting ${service.name} on port ${service.port}...`, 'green');
  
  // Start the service
  const env = { ...process.env, PORT: service.port };
  const child = spawn('npm', ['run', 'dev'], {
    cwd: servicePath,
    env,
    shell: true
  });
  
  // Handle output
  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => logService(serviceName, line));
  });
  
  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => logService(serviceName, line, 'yellow'));
  });
  
  child.on('error', (error) => {
    logService(serviceName, `Error: ${error.message}`, 'red');
  });
  
  child.on('exit', (code) => {
    logService(serviceName, `Exited with code ${code}`, code === 0 ? 'green' : 'red');
    runningProcesses.delete(serviceName);
  });
  
  runningProcesses.set(serviceName, child);
  return true;
}

// Stop a service
function stopService(serviceName) {
  const child = runningProcesses.get(serviceName);
  
  if (!child) {
    log(`${serviceName} is not running`, 'yellow');
    return false;
  }
  
  log(`Stopping ${services[serviceName].name}...`, 'yellow');
  child.kill('SIGTERM');
  runningProcesses.delete(serviceName);
  return true;
}

// Stop all services
function stopAllServices() {
  log('Stopping all services...', 'yellow');
  runningProcesses.forEach((child, name) => {
    child.kill('SIGTERM');
  });
  runningProcesses.clear();
}

// List services
function listServices() {
  log('\nAvailable Services:', 'bright');
  Object.entries(services).forEach(([key, service]) => {
    const running = runningProcesses.has(key);
    const status = running ? `${colors.green}● RUNNING${colors.reset}` : `${colors.red}○ STOPPED${colors.reset}`;
    console.log(`  ${colors.cyan}${key.padEnd(15)}${colors.reset} ${status}  Port: ${service.port}  ${service.name}`);
  });
  console.log();
}

// Show help
function showHelp() {
  log('\nAlfresco ECM Development Runner', 'bright');
  log('================================\n');
  log('Commands:', 'cyan');
  console.log('  start <service>    Start a service');
  console.log('  stop <service>     Stop a service');
  console.log('  restart <service>  Restart a service');
  console.log('  start-all          Start all services');
  console.log('  stop-all           Stop all services');
  console.log('  list               List all services');
  console.log('  status             Show service status');
  console.log('  logs <service>     Show service logs');
  console.log('  help               Show this help');
  console.log('  exit               Exit the runner');
  console.log('\nServices:', 'cyan');
  Object.entries(services).forEach(([key, service]) => {
    console.log(`  ${key.padEnd(15)} ${service.name}`);
  });
  console.log();
}

// Interactive mode
async function interactiveMode() {
  showHelp();
  
  const prompt = () => {
    rl.question(`${colors.bright}alfresco> ${colors.reset}`, async (input) => {
      const [command, ...args] = input.trim().split(' ');
      
      switch (command) {
        case 'start':
          if (args[0]) {
            if (args[0] === 'all' || args[0] === '-all') {
              for (const service of Object.keys(services)) {
                await startService(service);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait between starts
              }
            } else {
              await startService(args[0]);
            }
          } else {
            log('Usage: start <service>', 'yellow');
          }
          break;
          
        case 'stop':
          if (args[0]) {
            if (args[0] === 'all' || args[0] === '-all') {
              stopAllServices();
            } else {
              stopService(args[0]);
            }
          } else {
            log('Usage: stop <service>', 'yellow');
          }
          break;
          
        case 'restart':
          if (args[0]) {
            stopService(args[0]);
            setTimeout(() => startService(args[0]), 1000);
          } else {
            log('Usage: restart <service>', 'yellow');
          }
          break;
          
        case 'start-all':
          for (const service of Object.keys(services)) {
            await startService(service);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          break;
          
        case 'stop-all':
          stopAllServices();
          break;
          
        case 'list':
        case 'ls':
          listServices();
          break;
          
        case 'status':
          listServices();
          break;
          
        case 'help':
        case '?':
          showHelp();
          break;
          
        case 'exit':
        case 'quit':
          stopAllServices();
          log('Goodbye!', 'green');
          process.exit(0);
          break;
          
        case '':
          break;
          
        default:
          log(`Unknown command: ${command}`, 'red');
          log('Type "help" for available commands', 'yellow');
      }
      
      prompt();
    });
  };
  
  prompt();
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n\nShutting down...', 'yellow');
  stopAllServices();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAllServices();
  process.exit(0);
});

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length > 0) {
  // Command line mode
  const [command, ...commandArgs] = args;
  
  switch (command) {
    case 'start':
      if (commandArgs[0]) {
        startService(commandArgs[0]).then(() => {
          setTimeout(() => process.exit(0), 5000);
        });
      }
      break;
      
    case 'start-all':
      (async () => {
        for (const service of Object.keys(services)) {
          await startService(service);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      })();
      break;
      
    case 'list':
      listServices();
      process.exit(0);
      break;
      
    case 'help':
      showHelp();
      process.exit(0);
      break;
      
    default:
      log(`Unknown command: ${command}`, 'red');
      showHelp();
      process.exit(1);
  }
} else {
  // Interactive mode
  interactiveMode();
}