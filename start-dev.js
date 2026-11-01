const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('🚀 Starting Vizhop Full-Stack E-Commerce Platform...');
console.log('====================================================');

// Start backend server
const server = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

// Start frontend client
const client = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true,
});

// Handle graceful exit
process.on('SIGINT', () => {
  server.kill();
  client.kill();
  process.exit();
});

