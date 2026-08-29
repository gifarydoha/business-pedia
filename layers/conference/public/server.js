// server.js — Nuxt 3 / Nitro entry point for Phusion Passenger (Hostinger)
// Place this file in your layer's public/ folder so it gets copied to
// .output/public/server.js during `npm run build`.
//
// IMPORTANT: This file must be pure ESM (no require/module.exports) because
// .output/server/package.json declares "type": "module".

import { appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logFile = join(__dirname, 'stderr.log');

// Log errors to stderr.log for debugging — visible via FileZilla
const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { appendFileSync(logFile, line); } catch {}
  console.error(line);
};

process.on('uncaughtException', (err) => {
  log('uncaughtException: ' + err.message + '\n' + err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log('unhandledRejection: ' + (reason?.message ?? String(reason)) + '\n' + (reason?.stack ?? ''));
  process.exit(1);
});

// Import the Nitro server.
// Passenger sets cwd to PassengerAppRoot, so server/ is a sibling of server.js.
import('./server/index.mjs').catch((err) => {
  log('Failed to import server/index.mjs: ' + err.message + '\n' + err.stack);
  process.exit(1);
});
