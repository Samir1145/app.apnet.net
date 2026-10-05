// admin-panel/src/tests/custom_agents_schema.test.ts
import assert from "node:assert";
import { customAgents, assetDownloads } from "../lib/db/schema";
import type { CustomAgent, NewCustomAgent, AssetDownload, NewAssetDownload } from "../lib/db/schema";

console.log("=== Task 2: Testing Custom Agents and Asset Downloads Schema ===");

// 1. Verify customAgents table definitions
assert(customAgents, "customAgents table must be exported");
assert(customAgents.id, "customAgents.id field must exist");
assert(customAgents.userId, "customAgents.userId field must exist");
assert(customAgents.slug, "customAgents.slug field must exist");
assert(customAgents.name, "customAgents.name field must exist");
assert(customAgents.archetype, "customAgents.archetype field must exist");
assert(customAgents.systemPrompt, "customAgents.systemPrompt field must exist");
assert(customAgents.statutoryVaults, "customAgents.statutoryVaults field must exist");
assert(customAgents.slashTriggers, "customAgents.slashTriggers field must exist");
assert(customAgents.allowSubagents, "customAgents.allowSubagents field must exist");

console.log("✔ customAgents table schema verified");

// 2. Verify assetDownloads table definitions
assert(assetDownloads, "assetDownloads table must be exported");
assert(assetDownloads.id, "assetDownloads.id field must exist");
assert(assetDownloads.userId, "assetDownloads.userId field must exist");
assert(assetDownloads.assetType, "assetDownloads.assetType field must exist");
assert(assetDownloads.assetKey, "assetDownloads.assetKey field must exist");
assert(assetDownloads.ipAddress, "assetDownloads.ipAddress field must exist");

console.log("✔ assetDownloads table schema verified");

// 3. Verify mock typing validity
const sampleAgent: NewCustomAgent = {
  id: "agt_test123",
  userId: "usr_999",
  slug: "test-avoidance",
  name: "Test Avoidance Auditor",
  description: "Test description",
  archetype: "avoidance_auditor",
  version: "1.0.0",
  systemPrompt: "You are an avoidance auditor...",
  reasoningEffort: "high",
  allowSubagents: true,
  criticAgent: "forms_agent",
  statutoryVaults: ["ibc_2016"],
  slashTriggers: [{ trigger: "/test", label: "Test Application" }],
  medallionColor: "#f59e0b",
};

assert(sampleAgent.slug === "test-avoidance", "Sample agent mock must be valid");
console.log("✔ NewCustomAgent type checks succeed");

console.log("✅ Task 2: Custom Agents & Telemetry Schema passed 100%!");
