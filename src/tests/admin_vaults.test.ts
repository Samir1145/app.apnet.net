// admin-panel/src/tests/admin_vaults.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== Task 3: Testing Admin Statutory Bare Act Vaults Governance ===");

const vaultsPage = path.join(process.cwd(), "src/app/admin/vaults/page.tsx");
assert(fs.existsSync(vaultsPage), "Admin vaults page must exist");

const content = fs.readFileSync(vaultsPage, "utf8");
assert(content.includes("Statutory") && content.includes("Vaults"), "Page must feature Statutory Vaults governance");
assert(content.includes("India Code") || content.includes("indiacode"), "Must reference India Code legislative mirror");
assert(content.includes("bare_ibc.vault") || content.includes("IBC 2016"), "Must manage IBC vault");
assert(content.includes("AES-256"), "Must show AES-256 encryption status");
assert(content.includes("Re-Sync") || content.includes("Sync"), "Must feature re-sync action");

console.log("✔ Admin Statutory Vaults governance verified");
console.log("✅ Task 3: Admin Vaults passed 100%!");
