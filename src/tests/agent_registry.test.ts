// admin-panel/src/tests/agent_registry.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { courtArchetypes } from "../components/agents/archetypes";

console.log("=== Task 5: Testing Agent Registry & 5 Court Archetypes ===");

// 1. Verify archetypes module definitions
assert(courtArchetypes, "courtArchetypes must be exported");
assert(Array.isArray(courtArchetypes), "courtArchetypes must be an array");
assert(courtArchetypes.length >= 5, "Must have at least 5 archetypes");

const keys = courtArchetypes.map(a => a.key);
assert(keys.includes("avoidance_auditor"), "Must include avoidance_auditor");
assert(keys.includes("commercial_pleading"), "Must include commercial_pleading");
assert(keys.includes("claim_adjudicator"), "Must include claim_adjudicator");
assert(keys.includes("sec29a_inquest"), "Must include sec29a_inquest");
assert(keys.includes("custom_chamber"), "Must include custom_chamber");
console.log("✔ 5 Court Archetypes verified:", keys.join(", "));

// 2. Verify ArchetypeCard component file exists
const cardFile = path.join(process.cwd(), "src/components/agents/ArchetypeCard.tsx");
assert(fs.existsSync(cardFile), "ArchetypeCard.tsx must exist");

// 3. Verify Agents page file exists
const agentsPage = path.join(process.cwd(), "src/app/dashboard/agents/page.tsx");
assert(fs.existsSync(agentsPage), "Agents page must exist");

const pageContent = fs.readFileSync(agentsPage, "utf8");
assert(pageContent.includes("Agent Studio"), "Page must feature Agent Studio title");
assert(pageContent.includes("Starter Archetypes"), "Page must feature Starter Archetypes section");
console.log("✔ Agent registry page content verified");

console.log("✅ Task 5: Agent Registry & Archetypes passed 100%!");
