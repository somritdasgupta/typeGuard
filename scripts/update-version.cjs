/**
 * This script updates the version in version.ts to match package.json
 * Run this script during the build process to ensure versions stay in sync
 */

const fs = require('fs');
const path = require('path');

// Read the current version from package.json
const packagePath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

// Path to the version file
const versionFilePath = path.join(__dirname, '../src/version.ts');

// Read the current version file
let versionFileContent = fs.readFileSync(versionFilePath, 'utf8');

// Update the version number
versionFileContent = versionFileContent.replace(
  /current: ['"].*['"]/,
  `current: '${version}'`
);

// Write the updated content back to the file
fs.writeFileSync(versionFilePath, versionFileContent);

console.log(`Updated version to ${version} in version.ts`);
