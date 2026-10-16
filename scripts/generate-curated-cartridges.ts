// admin-panel/scripts/generate-curated-cartridges.ts
import * as fs from 'fs';
import * as path from 'path';
import { curatedVarahaAgents } from '../src/lib/taxonomy/curated-varaha-agents';
import { compileCartridge } from '../src/lib/compiler/cartridge-compiler';

const DOMAIN_MEDALLION_COLORS: Record<string, string> = {
  'legal-dispute': '#f59e0b', // Amber
  'clinical-healthcare': '#10b981', // Emerald
  'agriculture-agronomy': '#84cc16', // Lime
  'taxation-customs': '#06b6d4', // Cyan
  'software-engineering': '#8b5cf6', // Violet
};

async function main() {
  console.log('=== Compiling Curated Varaha .haya Cartridge Packages ===\n');

  const adminCartridgesDir = path.resolve(__dirname, '../public/cartridges');
  const serverCartridgesDir = path.resolve(__dirname, '../../server/storage/hayagriva/cartridges');

  fs.mkdirSync(adminCartridgesDir, { recursive: true });
  fs.mkdirSync(serverCartridgesDir, { recursive: true });

  let compiledCount = 0;

  for (const agent of curatedVarahaAgents) {
    const slug = agent.slug;
    const medallionColor = DOMAIN_MEDALLION_COLORS[agent.domain] || '#f59e0b';
    
    // Extract prompt from manifest if present
    const promptFile = ((agent.manifest as any)?.files || []).find((f: any) => f.name === 'prompt.md' || f.name === 'prompt.txt');
    const systemPrompt = promptFile?.content || `# System Prompt for ${agent.name}\nYou are an air-gapped sovereign agent in the ${agent.domain} domain.`;

    const slashTrigger = (agent.tags || []).find((t: string) => t.startsWith('/')) || `/${slug}`;

    const buffer = await compileCartridge({
      name: agent.name,
      slug,
      description: agent.description,
      archetype: agent.archetype || 'sovereign-agent',
      version: '1.0.0',
      medallionColor,
      modelEngine: 'local_first',
      reasoningEffort: 'medium',
      allowSubagents: true,
      criticAgent: 'forms_agent',
      statutoryVaults: agent.statutoryVaults || [],
      slashTrigger,
      systemPrompt,
    });

    const targetAdminPath = path.join(adminCartridgesDir, `${slug}.haya`);
    const targetServerPath = path.join(serverCartridgesDir, `${slug}.haya`);

    fs.writeFileSync(targetAdminPath, buffer);
    fs.writeFileSync(targetServerPath, buffer);

    console.log(`✔ [${agent.domain}] Compiled: ${slug}.haya (${buffer.length} bytes)`);
    compiledCount++;
  }

  console.log(`\n🎉 Successfully generated ${compiledCount} .haya cartridges across both portals.`);
}

main().catch((err) => {
  console.error('Cartridge generation failed:', err);
  process.exit(1);
});
