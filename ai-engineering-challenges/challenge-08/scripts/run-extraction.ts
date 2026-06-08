import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { documentDefinitions } from '../src/data/documentDefinitions.js';
import { extractDocument } from '../src/pipeline/extractDocument.js';
import { resolveProvider } from '../src/llm/visionClient.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const samplesDir = resolve(__dirname, '../documents/samples');
const outputDir = resolve(__dirname, '../output');

mkdirSync(outputDir, { recursive: true });

const processAll = process.argv.includes('--all');
const provider = resolveProvider();

console.log(`LLM provider: ${provider}`);

async function run() {
  const sampleFiles = readdirSync(samplesDir).filter((file) => file.endsWith('.png'));

  if (sampleFiles.length === 0) {
    console.error('No sample PNG files found. Run: npm run setup-docs');
    process.exit(1);
  }

  const filesToProcess = processAll
    ? sampleFiles
    : sampleFiles.slice(0, 1);

  const results = [];

  for (const file of filesToProcess) {
    const filePath = resolve(samplesDir, file);
    const docId = documentDefinitions.find((doc) => file.startsWith(doc.filename))?.id;

    console.log(`\nExtracting: ${file} ...`);
    const result = await extractDocument(filePath, { documentId: docId });
    results.push(result);

    console.log(`  Type: ${result.document_type} (${(result.confidence * 100).toFixed(0)}%)`);
    console.log(`  Fields: ${Object.keys(result.fields).length}`);
    console.log(`  Validation errors: ${result.validation_errors.length}`);
  }

  const outputPath = resolve(outputDir, 'extraction-results.json');
  writeFileSync(outputPath, JSON.stringify({ provider, results }, null, 2), 'utf-8');
  console.log(`\nWrote ${results.length} result(s) to ${outputPath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
