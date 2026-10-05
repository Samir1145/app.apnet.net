// admin-panel/src/lib/compiler/cartridge-compiler.ts
import JSZip from 'jszip';
import crypto from 'node:crypto';

export interface AgentCompileInput {
  name: string;
  slug: string;
  description?: string;
  archetype: string;
  version?: string;
  medallionColor?: string;
  modelEngine?: string;
  reasoningEffort?: string;
  verbosity?: string;
  allowSubagents?: boolean;
  criticAgent?: string;
  maxCritiqueTurns?: number;
  statutoryVaults?: string[];
  slashTrigger?: string;
  systemPrompt?: string;
  templateSkeleton?: string;
}

export async function compileCartridge(input: AgentCompileInput): Promise<Buffer> {
  const zip = new JSZip();

  const slug = input.slug || 'custom-agent';
  const version = input.version || '1.0.0';
  const color = input.medallionColor || '#f59e0b';

  // 1. Generate SVG Medallion (32px circular gold coin)
  const medallionSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <circle cx="16" cy="16" r="14.5" fill="#18181b" stroke="${color}" stroke-width="1.5" />
  <circle cx="16" cy="16" r="12" fill="none" stroke="${color}" stroke-width="0.5" stroke-dasharray="1 1" opacity="0.6" />
  <path d="M11 20 C11 15, 14 11, 16 9 C18 11, 21 15, 21 20 C19 21.5, 13 21.5, 11 20 Z" fill="${color}" opacity="0.9" />
  <circle cx="16" cy="13" r="1.5" fill="#ffffff" />
</svg>`;

  // 2. Generate Rules JSON
  const rulesJson = JSON.stringify({
    schemaVersion: "1.0",
    archetype: input.archetype,
    validationRules: [
      {
        id: "RULE_01_STATUTORY_BOUNDS",
        description: "Drafts must cite statutory sections without hallucinatory provisos."
      },
      {
        id: "RULE_02_SUBAGENT_CRITIQUE",
        description: input.allowSubagents ? "Audit pass required before emitting final draft." : "Direct pass."
      }
    ]
  }, null, 2);

  // 3. Generate Primary Skeleton Template
  const templateSkeleton = input.templateSkeleton || `COURT DRAFTING SKELETON FOR ${input.name.toUpperCase()}

MATTER: {{MATTER_NAME}}
CORAM: {{HONBLE_BENCH}}
DATE: {{DATE}}

1. BRIEF FACTS:
{{BRIEF_FACTS}}

2. STATUTORY RELIEF PRAYED FOR:
{{RELIEF_PRAYERS}}`;

  // 4. Generate System Prompt Markdown
  const systemPrompt = input.systemPrompt || `# System Instructions for ${input.name}
You are a sovereign legal agent designed for in-chamber practice.`;

  // 5. Pre-compute hash from content
  const hashPayload = input.name + slug + version + (input.systemPrompt || '') + (input.statutoryVaults || []).join(',');
  const sha256Hash = 'sha256-' + crypto.createHash('sha256').update(hashPayload).digest('hex');

  // 6. Generate Manifest JSON
  const manifest = {
    "$schema": "https://hayagriva.legal/schemas/cartridge-v1.json",
    "id": `agent-${slug}-v${version}`,
    "slug": slug,
    "name": input.name,
    "description": input.description || "",
    "version": version,
    "archetype": input.archetype,
    "icon": {
      "type": "svg",
      "path": "medallion.svg",
      "color": color,
      "background": "#18181b"
    },
    "runtime": {
      "engine": input.modelEngine || "local_first",
      "reasoningEffort": input.reasoningEffort || "medium",
      "contextBudgetTokens": 8192
    },
    "statutoryVaults": input.statutoryVaults || [],
    "delegation": {
      "allowSubagents": Boolean(input.allowSubagents),
      "criticSubagent": input.criticAgent || "forms_agent",
      "maxCritiqueTurns": input.maxCritiqueTurns || 2
    },
    "editorTriggers": [
      {
        "trigger": input.slashTrigger || `/${slug}`,
        "label": input.name,
        "template": "templates/primary_skeleton.md"
      }
    ],
    "hash": sha256Hash,
    "compiledAt": new Date().toISOString()
  };

  // Add files to zip
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  zip.file("system_prompt.md", systemPrompt);
  zip.file("rules.json", rulesJson);
  zip.file("medallion.svg", medallionSvg);
  zip.file("templates/primary_skeleton.md", templateSkeleton);

  // Generate buffer
  const nodeBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  return nodeBuffer;
}
