#!/usr/bin/env node

const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 3000,
  method: 'GET'
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Health check passed');
    process.exit(0);
  } else {
    console.log(`❌ Health check failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log(`❌ Health check failed: ${err.message}`);
  process.exit(1);
});

request.on('timeout', () => {
  console.log('❌ Health check timeout');
  request.destroy();
  process.exit(1);
});

request.end(); 