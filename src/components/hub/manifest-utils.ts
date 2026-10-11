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
