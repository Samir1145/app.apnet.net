// admin-panel/src/tests/downloads_hub.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== Task 3: Testing Sovereign Downloads Hub Pages ===");

const harnessPage = path.join(process.cwd(), "src/app/dashboard/harness/page.tsx");
const vaultsPage = path.join(process.cwd(), "src/app/dashboard/vaults/page.tsx");
const modelsPage = path.join(process.cwd(), "src/app/dashboard/models/page.tsx");

// 1. Verify file existence
assert(fs.existsSync(harnessPage), "Harness download page must exist");
assert(fs.existsSync(vaultsPage), "Statutory vaults page must exist");
assert(fs.existsSync(modelsPage), "AI models hub page must exist");

// 2. Verify Harness Page content
const harnessContent = fs.readFileSync(harnessPage, "utf8");
assert(harnessContent.includes("Apple Silicon"), "Harness page must support Apple Silicon");
assert(harnessContent.includes("Windows"), "Harness page must support Windows");
assert(harnessContent.includes("Linux"), "Harness page must support Linux");
assert(harnessContent.includes("SHA-256"), "Harness page must show checksums");
console.log("✔ Harness page metadata verified");

// 3. Verify Vaults Page content
const vaultsContent = fs.readFileSync(vaultsPage, "utf8");
assert(vaultsContent.includes("bare_ibc.vault") || vaultsContent.includes("IBC"), "Vaults page must list IBC");
assert(vaultsContent.includes("Commercial Courts"), "Vaults page must list Commercial Courts");
assert(vaultsContent.includes("AES-256"), "Vaults page must show encryption status");
console.log("✔ Vaults page metadata verified");

// 4. Verify Models Page content
const modelsContent = fs.readFileSync(modelsPage, "utf8");
assert(modelsContent.includes("DeepSeek") || modelsContent.includes("deepseek"), "Models page must list DeepSeek");
assert(modelsContent.includes("GGUF"), "Models page must list GGUF format");
assert(modelsContent.includes("~/.hayagriva/models"), "Models page must specify destination path");
console.log("✔ Models hub page metadata verified");

console.log("✅ Task 3: Sovereign Downloads Hub pages verified successfully!");
