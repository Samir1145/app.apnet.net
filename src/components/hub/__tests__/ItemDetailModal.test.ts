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

  it("extracts cognitive contract and taxonomy details from HubItem", async () => {
    const { extractCognitiveContract } = await import("../manifest-utils");
    const mockItem = {
      id: "hub_01",
      urn: "agent:legal-dispute:corporate-insolvency:avoidance-auditor:1.0.0",
      domain: "legal-dispute",
      subdomain: "corporate-insolvency",
      archetype: "forensic-inquest",
      requiredSkills: ["skill:legal-dispute:corporate-insolvency:ledger-tracer:1.0.0"],
      statutoryVaults: ["vault:legal-dispute:corporate-insolvency:ibc-2016-vault:1.0.0"],
      manifest: {
        cognition: {
          role: "IBC Forensic Auditor",
          goal: "Audit general ledgers for Section 66 siphoning",
          reasoningEffort: "high",
          criticAgent: "sec29a-scrutineer",
        },
      },
    } as any;

    const contract = extractCognitiveContract(mockItem);
    assert.strictEqual(contract.urn, "agent:legal-dispute:corporate-insolvency:avoidance-auditor:1.0.0");
    assert.strictEqual(contract.domain, "legal-dispute");
    assert.strictEqual(contract.subdomain, "corporate-insolvency");
    assert.strictEqual(contract.archetype, "forensic-inquest");
    assert.strictEqual(contract.role, "IBC Forensic Auditor");
    assert.strictEqual(contract.reasoningEffort, "high");
    assert.strictEqual(contract.criticAgent, "sec29a-scrutineer");
    assert.strictEqual(contract.requiredSkills.length, 1);
    assert.strictEqual(contract.statutoryVaults.length, 1);
  });
});
