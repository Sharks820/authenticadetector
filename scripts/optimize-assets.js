const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let sharp;

try {
  sharp = require('sharp');
} catch (err) {
  console.error('Missing dependency: sharp. Run: pnpm add -D sharp');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const assetsDir = path.join(root, 'assets');
const manifestPath = path.join(assetsDir, 'manifest.json');
const manifestOnly = process.argv.includes('--manifest-only');
const imageExts = new Set(['.png', '.jpg', '.jpeg']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function maxWidthFor(file) {
  const normalized = file.replace(/\/g, '/');
  if (normalized.includes('/backgrounds/')) return 1920;
  if (normalized.includes('/sprites/') || normalized.includes('/bestiary/')) return 512;
  return 1024;
}

async function optimizeImages(files) {
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExts.has(ext)) continue;
    const maxWidth = maxWidthFor(file);
    const outFile = file.replace(ext, '.webp');
    await sharp(file)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outFile);
  }
}

function hashFile(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 12);
}

function buildManifest(files) {
  const output = {
    generatedAt: new Date().toISOString(),
    files: {}
  };

  for (const file of files) {
    const rel = path.relative(assetsDir, file).replace(/\/g, '/');
    output.files[rel] = hashFile(file);
  }

  fs.writeFileSync(manifestPath, JSON.stringify(output, null, 2));
}

(async () => {
  if (!fs.existsSync(assetsDir)) {
    console.error('assets directory not found.');
    process.exit(1);
  }

  const files = walk(assetsDir);
  if (!manifestOnly) {
    await optimizeImages(files);
  }
  const updatedFiles = walk(assetsDir);
  buildManifest(updatedFiles);
})();
