import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function updateVersions() {
  try {
    // Read the current version from package.json
    const packagePath = join(__dirname, '../package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    const version = packageJson.version;

    // Update version.ts
    const versionFilePath = join(__dirname, '../src/version.ts');
    let versionFileContent = readFileSync(versionFilePath, 'utf8');
    versionFileContent = versionFileContent.replace(
      /current: ['"].*['"]/,
      `current: '${version}'`
    );
    writeFileSync(versionFilePath, versionFileContent);
    console.log(`✓ Updated version to ${version} in version.ts`);

    // Update package-lock.json if it exists
    try {
      const packageLockPath = join(__dirname, '../package-lock.json');
      const packageLock = JSON.parse(readFileSync(packageLockPath, 'utf8'));
      packageLock.version = version;
      writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2));
      console.log(`✓ Updated version in package-lock.json`);
    } catch (e) {
      // package-lock.json may not exist, which is fine
    }

    console.log('✨ Version update complete!');
  } catch (error) {
    console.error('Error updating version:', error);
    process.exit(1);
  }
}

// Run the update
updateVersions();
