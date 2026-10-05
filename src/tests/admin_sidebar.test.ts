// admin-panel/src/tests/admin_sidebar.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== Task 1: Testing Admin Sidebar Segregated Navigation ===");

const sidebarFile = path.join(process.cwd(), "src/components/admin/sidebar.tsx");
assert(fs.existsSync(sidebarFile), "Admin sidebar file must exist");

const content = fs.readFileSync(sidebarFile, "utf8");

const requiredHrefs = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/harness",
  "/admin/vaults",
  "/admin/models",
  "/admin/downloads",
  "/admin/agents",
  "/admin/invoices",
  "/admin/logs",
  "/admin/support",
  "/admin/profile",
];

for (const href of requiredHrefs) {
  assert(
    content.includes("'" + href + "'") || content.includes('"' + href + '"'),
    "Admin sidebar must contain route: " + href
  );
  console.log("✔ Found admin route: " + href);
}

const requiredHeaders = [
  "Control Center",
  "Distribution & Assets",
  "Agent Foundry",
  "Commercial & Governance",
];

for (const header of requiredHeaders) {
  assert(
    content.toLowerCase().includes(header.toLowerCase()),
    "Admin sidebar must contain section header: " + header
  );
  console.log("✔ Found admin header: " + header);
}

console.log("✅ Task 1: Admin Sidebar Segregation verified successfully!");
