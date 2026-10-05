// admin-panel/src/tests/admin_harness.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== Task 2: Testing Admin Desktop Harness Release Manager ===");

const harnessPage = path.join(process.cwd(), "src/app/admin/harness/page.tsx");
assert(fs.existsSync(harnessPage), "Admin harness page must exist");

const content = fs.readFileSync(harnessPage, "utf8");
assert(content.includes("Release Manager") || content.includes("Harness Releases"), "Page must feature Release Manager header");
assert(content.includes("Apple Silicon"), "Must manage Apple Silicon release");
assert(content.includes("Windows"), "Must manage Windows release");
assert(content.includes("Linux"), "Must manage Linux release");
assert(content.includes("SHA-256"), "Must show SHA-256 checksums");

console.log("✔ Admin Harness Release Manager verified");
console.log("✅ Task 2: Admin Harness passed 100%!");
