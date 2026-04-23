import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const libraryPackagePath = path.join(repoRoot, 'projects', 'media-viewer', 'package.json');
const distPackagePath = path.join(repoRoot, 'dist', 'media-viewer', 'package.json');

const libraryPackage = readJson(libraryPackagePath);
const distPackage = readJson(distPackagePath);

distPackage.dependencies = sortObject({
  ...(distPackage.dependencies || {}),
  ...(libraryPackage.dependencies || {}),
});

distPackage.peerDependencies = sortObject({
  ...(distPackage.peerDependencies || {}),
  ...(libraryPackage.peerDependencies || {}),
});

delete distPackage.devDependencies;

writeJson(distPackagePath, distPackage);

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function sortObject(value) {
  return Object.keys(value)
    .sort()
    .reduce((result, key) => {
      result[key] = value[key];
      return result;
    }, {});
}
