#!/usr/bin/env node
// ABOUTME: CLI entry point for feedclaude — launches the Electron app
const { execFileSync } = require('child_process');
const path = require('path');

const electronPath = require('electron');
const appPath = path.resolve(__dirname, '..');

try {
  execFileSync(electronPath, [appPath], { stdio: 'inherit' });
} catch (e) {
  process.exit(e.status || 1);
}
