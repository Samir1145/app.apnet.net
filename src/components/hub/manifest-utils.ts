export interface ManifestExtractedFiles {
  readme: string;
  handler: string;
  plugin: string;
}

export function extractManifestFiles(manifest: any): ManifestExtractedFiles {
  if (!manifest) {
    return {
      readme: "No README documentation provided.",
      handler: "// No handler.js found",
      plugin: "{}",
    };
  }

  const files: any[] = Array.isArray(manifest.files) ? manifest.files : [];
  const readmeFile = files.find((f: any) => f.name?.toLowerCase() === "readme.md");
  const handlerFile = files.find((f: any) => f.name?.toLowerCase() === "handler.js");
  const pluginFile = files.find((f: any) => f.name?.toLowerCase() === "plugin.json");

  return {
    readme: readmeFile?.content || manifest.description || "No README documentation provided.",
    handler: handlerFile?.content || "// handler.js source not provided in manifest",
    plugin: pluginFile?.content || JSON.stringify(manifest, null, 2),
  };
}

export function formatInstallCommand(importIdOrSlug: string): string {
  return `allm install ${importIdOrSlug}`;
}

export interface CognitiveContract {
  urn: string | null;
  domain: string;
  subdomain: string;
  archetype: string | null;
  role?: string;
  goal?: string;
  reasoningEffort?: string;
  criticAgent?: string;
  allowSubagents?: boolean;
  requiredSkills: string[];
  statutoryVaults: string[];
}

export function extractCognitiveContract(item: any): CognitiveContract {
  const manifest = item?.manifest || {};
  const cognition = manifest.cognition || {};

  const requiredSkills = Array.isArray(item?.requiredSkills)
    ? item.requiredSkills
    : Array.isArray(manifest.capabilities?.skills)
    ? manifest.capabilities.skills
    : [];

  const statutoryVaults = Array.isArray(item?.statutoryVaults)
    ? item.statutoryVaults
    : Array.isArray(manifest.capabilities?.statutoryVaults)
    ? manifest.capabilities.statutoryVaults
    : [];

  return {
    urn: item?.urn || manifest.urn || null,
    domain: item?.domain || manifest.taxonomy?.domain || 'general-enterprise',
    subdomain: item?.subdomain || manifest.taxonomy?.subdomain || 'operations-workflows',
    archetype: item?.archetype || manifest.taxonomy?.archetype || null,
    role: cognition.role || manifest.role,
    goal: cognition.goal || manifest.goal,
    reasoningEffort: cognition.reasoningEffort || manifest.reasoningEffort,
    criticAgent: cognition.criticAgent || manifest.criticAgent,
    allowSubagents: cognition.allowSubagents ?? manifest.allowSubagents,
    requiredSkills,
    statutoryVaults,
  };
}
