// server.js — Diagnostic version
// This file will attempt to write a log BEFORE importing Nuxt,
// so we can confirm whether Passenger is actually starting Node.js at all.

import { appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logFile = join(__dirname, 'startup.log');

const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { appendFileSync(logFile, line); } catch (e) {}
  console.error(line);
};

// --- Write startup info immediately ---
log('=== SERVER.JS STARTED ===');
log('Node.js version: ' + process.version);
log('__dirname: ' + __dirname);
log('process.cwd(): ' + process.cwd());
log('process.env.PORT: ' + process.env.PORT);
log('process.env.NODE_ENV: ' + process.env.NODE_ENV);

process.on('uncaughtException', (err) => {
  log('CRASH uncaughtException: ' + err.message + '\n' + err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log('CRASH unhandledRejection: ' + (reason?.message ?? String(reason)) + '\n' + (reason?.stack ?? ''));
  process.exit(1);
});

log('Attempting to import ./server/index.mjs ...');

import('./server/index.mjs').then(() => {
  log('SUCCESS: server/index.mjs loaded and running');
}).catch((err) => {
  log('FAILED to import server/index.mjs: ' + err.message + '\n' + err.stack);
  process.exit(1);
});
