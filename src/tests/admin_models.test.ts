import fs from 'fs';
import path from 'path';

console.log('=== Task 4: Testing Admin AI Models Registry Governance ===');

const modelsPagePath = path.join(process.cwd(), 'src/app/admin/models/page.tsx');
if (!fs.existsSync(modelsPagePath)) {
  console.error('❌ /admin/models/page.tsx does not exist');
  process.exit(1);
}

const content = fs.readFileSync(modelsPagePath, 'utf8');

const requiredTokens = [
  'AI Reasoning & Embeddings Registry',
  'DeepSeek-R1-Distill-Qwen-7B',
  'Llama-3.2-3B-Instruct',
  'BGE-Small-EN-v1.5',
  'Q4_K_M',
  'GGUF',
  'ONNX',
  'sha256',
  'Register New Model',
  'Distribution Telemetry'
];

for (const token of requiredTokens) {
  if (!content.includes(token)) {
    console.error(`❌ Missing token in /admin/models/page.tsx: ${token}`);
    process.exit(1);
  }
}

console.log('✔ Admin AI Models registry governance verified');
console.log('✅ Task 4: Admin Models passed 100%!');
