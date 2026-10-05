// admin-panel/src/tests/my_assets_page.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== Task 4: Testing My Sovereign Inventory & Billing Alignment ===");

const assetsPage = path.join(process.cwd(), "src/app/dashboard/my-assets/page.tsx");
const billingPage = path.join(process.cwd(), "src/app/dashboard/billing/page.tsx");

// 1. Verify existence
assert(fs.existsSync(assetsPage), "My Assets page must exist");
assert(fs.existsSync(billingPage), "Billing page must exist");

// 2. Verify Assets Page Content
const assetsContent = fs.readFileSync(assetsPage, "utf8");
assert(assetsContent.includes("Hardware Seats") || assetsContent.includes("Active Devices"), "Assets page must show hardware seats");
assert(assetsContent.includes("Vault Cartridges") || assetsContent.includes("Statutory Vaults"), "Assets page must show vault cartridges");
assert(assetsContent.includes("AI Models"), "Assets page must show installed models");
assert(assetsContent.includes("Agent Packages") || assetsContent.includes(".haya"), "Assets page must show .haya agent packages");
console.log("✔ My Assets page inventory sections verified");

// 3. Verify Billing Page Content
const billingContent = fs.readFileSync(billingPage, "utf8");
assert(billingContent.includes("Invoice") || billingContent.includes("Tax Invoices"), "Billing page must show invoices");
console.log("✔ Billing page commercial focus verified");

console.log("✅ Task 4: My Sovereign Inventory & Billing passed 100%!");
