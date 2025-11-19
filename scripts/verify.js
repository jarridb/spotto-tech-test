#!/usr/bin/env node

import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

let errors = [];
let warnings = [];

// Check Node.js version
function checkNodeVersion() {
  const currentVersion = process.version.replace('v', '');
  const majorVersion = parseInt(currentVersion.split('.')[0], 10);

  if (majorVersion < 20) {
    errors.push(`Node.js version too old: Expected v20.x or higher, got ${process.version}`);
  } else {
    console.log(`✓ Node.js version: ${process.version}`);
  }
}

// Check workspace structure
function checkWorkspaceStructure() {
  const workspaces = ['frontend', 'backend', 'types'];

  for (const workspace of workspaces) {
    const workspacePath = join(rootDir, workspace);
    const packageJsonPath = join(workspacePath, 'package.json');
    const tsconfigPath = join(workspacePath, 'tsconfig.json');

    if (!existsSync(workspacePath)) {
      errors.push(`Missing workspace directory: ${workspace}/`);
    } else if (!existsSync(packageJsonPath)) {
      errors.push(`Missing package.json in workspace: ${workspace}/`);
    } else if (!existsSync(tsconfigPath)) {
      errors.push(`Missing tsconfig.json in workspace: ${workspace}/`);
    } else {
      console.log(`✓ Workspace structure: ${workspace}/`);
    }
  }
}

// Check dependencies installation
function checkDependencies() {
  const rootNodeModules = join(rootDir, 'node_modules');

  if (!existsSync(rootNodeModules)) {
    errors.push('Dependencies not installed: Run npm install');
    return;
  }

  console.log('✓ Dependencies installed (hoisted to root)');
}

// Main verification
console.log('Verifying project setup...\n');

checkNodeVersion();
checkWorkspaceStructure();
checkDependencies();

console.log('');

if (warnings.length > 0) {
  console.log('Warnings:');
  warnings.forEach((warning) => console.log(`  ⚠ ${warning}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('Errors:');
  errors.forEach((error) => console.log(`  ✗ ${error}`));
  console.log('');
  process.exit(1);
}

console.log('✓ All checks passed!');
process.exit(0);
