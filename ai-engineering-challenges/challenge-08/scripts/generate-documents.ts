import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { documentDefinitions } from '../src/data/documentDefinitions.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlDir = resolve(__dirname, '../documents/html');
const groundTruthDir = resolve(__dirname, '../documents/ground-truth');

mkdirSync(htmlDir, { recursive: true });
mkdirSync(groundTruthDir, { recursive: true });

for (const doc of documentDefinitions) {
  const htmlPath = resolve(htmlDir, `${doc.filename}.html`);
  const groundTruthPath = resolve(groundTruthDir, `${doc.id}.json`);

  writeFileSync(htmlPath, doc.html, 'utf-8');
  writeFileSync(
    groundTruthPath,
    JSON.stringify(
      {
        id: doc.id,
        filename: doc.filename,
        document_type: doc.document_type,
        fields: doc.fields,
      },
      null,
      2,
    ),
    'utf-8',
  );

  console.log(`Generated ${doc.id} -> ${htmlPath}`);
}

console.log(`\nCreated ${documentDefinitions.length} HTML documents and ground-truth files.`);
