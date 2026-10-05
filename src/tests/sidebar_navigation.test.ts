// admin-panel/src/tests/sidebar_navigation.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== Task 1: Testing Sidebar Information Architecture Segregation ===");

const sidebarPath = path.join(process.cwd(), "src/components/client/sidebar.tsx");
assert(fs.existsSync(sidebarPath), "Sidebar file must exist");

const content = fs.readFileSync(sidebarPath, "utf-8");

const requiredHrefs = [
  "/dashboard",
  "/dashboard/harness",
  "/dashboard/vaults",
  "/dashboard/models",
  "/dashboard/agents",
  "/dashboard/my-assets",
  "/dashboard/licenses",
  "/dashboard/billing",
  "/dashboard/profile",
  "/dashboard/support",
];

for (const href of requiredHrefs) {
  assert(
    content.includes("'" + href + "'") || content.includes('"' + href + '"'),
    "Sidebar must contain navigation link to " + href
  );
  console.log("✔ Found route: " + href);
}

const requiredGroups = [
  "Sovereign Assets",
  "Agent Foundry",
  "Governance & Accounting",
];

for (const group of requiredGroups) {
  assert(
    content.toLowerCase().includes(group.toLowerCase()),
    "Sidebar must contain section header: " + group
  );
  console.log("✔ Found group header: " + group);
}

console.log("✅ Task 1: Sidebar Information Architecture verified successfully!");
