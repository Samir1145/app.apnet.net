import { describe, it } from "node:test";
import assert from "node:assert";
import { extractManifestFiles, formatInstallCommand } from "../manifest-utils";

describe("ItemDetailModal & Manifest Helpers", () => {
  it("extracts readme, handler, and plugin from manifest files", () => {
    const manifest = {
      files: [
        { name: "README.md", content: "# Sovereign Skill\nDetails here." },
        { name: "handler.js", content: "module.exports = async () => {};" },
        { name: "plugin.json", content: '{"name": "Skill", "hubId": "skl_01"}' },
      ],
    };

    const files = extractManifestFiles(manifest);
    assert.strictEqual(files.readme, "# Sovereign Skill\nDetails here.");
    assert.strictEqual(files.handler, "module.exports = async () => {};");
    assert.strictEqual(files.plugin, '{"name": "Skill", "hubId": "skl_01"}');
  });

  it("formats AnythingLLM install CLI command", () => {
    const cmd = formatInstallCommand("allm-skill-ibc-scrutiny");
    assert.strictEqual(cmd, "allm install allm-skill-ibc-scrutiny");
  });
});
