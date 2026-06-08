import { mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlDir = resolve(__dirname, '../documents/html');
const samplesDir = resolve(__dirname, '../documents/samples');

mkdirSync(samplesDir, { recursive: true });

const htmlFiles = readdirSync(htmlDir).filter((file) => file.endsWith('.html'));

if (htmlFiles.length === 0) {
  console.error('No HTML files found. Run: npm run generate-docs');
  process.exit(1);
}

const browser = await puppeteer.launch({ headless: true });

for (const file of htmlFiles) {
  const htmlPath = resolve(htmlDir, file);
  const baseName = file.replace(/\.html$/, '');
  const pngPath = resolve(samplesDir, `${baseName}.png`);
  const pdfPath = resolve(samplesDir, `${baseName}.pdf`);

  const page = await browser.newPage();
  await page.setViewport({ width: 820, height: 1100, deviceScaleFactor: 2 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: pngPath, fullPage: true });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
  });
  await page.close();

  console.log(`Rendered ${baseName} -> PNG + PDF`);
}

await browser.close();
console.log(`\nRendered ${htmlFiles.length} documents to documents/samples/`);
