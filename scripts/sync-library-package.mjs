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

syncDependencySection('dependencies');
syncDependencySection('peerDependencies');
syncDependencySection('optionalDependencies');

writeJson(distPackagePath, distPackage);

function syncDependencySection(sectionName) {
  const dependencies = libraryPackage[sectionName];

  if (!dependencies) {
    delete distPackage[sectionName];
    return;
  }

  distPackage[sectionName] = sortObject(dependencies);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function sortObject(value) {
  return Object.keys(value)
    .sort()
    .reduce((sortedValue, key) => {
      sortedValue[key] = value[key];
      return sortedValue;
    }, {});
}
