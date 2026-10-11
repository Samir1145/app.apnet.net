import { describe, it } from "node:test";
import assert from "node:assert";
import { getItemCategoryConfig, formatItemVersion } from "../card-utils.ts";

describe("ItemCard Utility & Category Helpers", () => {
  it("resolves correct category config for agent skills", () => {
    const config = getItemCategoryConfig("agent-skill");
    assert.strictEqual(config.label, "Agent Skill");
    assert.strictEqual(config.colorClass.includes("cyan"), true);
  });

  it("resolves correct category config for legal vaults and models", () => {
    const vaultConfig = getItemCategoryConfig("legal-vault");
    assert.strictEqual(vaultConfig.label, "Statutory Vault");

    const modelConfig = getItemCategoryConfig("ai-model");
    assert.strictEqual(modelConfig.label, "AI Model");
  });

  it("formats semantic versions and defaults to 1.0.0", () => {
    assert.strictEqual(formatItemVersion("2.1.0"), "v2.1.0");
    assert.strictEqual(formatItemVersion(undefined), "v1.0.0");
  });
});
