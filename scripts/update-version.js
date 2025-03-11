/**
 * This script updates the version in version.ts to match package.json
 * Run this script during the build process to ensure versions stay in sync
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the current version from package.json
const packagePath = join(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

// Path to the version file
const versionFilePath = join(__dirname, '../src/version.ts');

// Read the current version file
let versionFileContent = readFileSync(versionFilePath, 'utf8');

// Update the version number
versionFileContent = versionFileContent.replace(
  /current: ['"].*['"]/,
  `current: '${version}'`
);

// Write the updated content back to the file
writeFileSync(versionFilePath, versionFileContent);

console.log(`Updated version to ${version} in version.ts`);
