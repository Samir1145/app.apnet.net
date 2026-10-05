// admin-panel/src/tests/agent_builder.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== Task 6: Testing Split-Pane Agent Studio Builder ===");

const accordionFile = path.join(process.cwd(), "src/components/agents/BuilderAccordion.tsx");
const canvasFile = path.join(process.cwd(), "src/components/agents/SandboxCanvas.tsx");
const builderPage = path.join(process.cwd(), "src/app/dashboard/agents/builder/page.tsx");

// 1. Verify file existence
assert(fs.existsSync(accordionFile), "BuilderAccordion.tsx must exist");
assert(fs.existsSync(canvasFile), "SandboxCanvas.tsx must exist");
assert(fs.existsSync(builderPage), "Builder page must exist");

// 2. Verify Accordion Content
const accordionContent = fs.readFileSync(accordionFile, "utf8");
assert(accordionContent.includes("Sovereign Identity"), "Must contain Sovereign Identity section");
assert(accordionContent.includes("Model & Reasoning"), "Must contain Model & Reasoning section");
assert(accordionContent.includes("Subagents & Delegation"), "Must contain Subagents & Delegation section");
assert(accordionContent.includes("Statutory Bare Act Vaults"), "Must contain Statutory Vaults section");
console.log("✔ BuilderAccordion components verified");

// 3. Verify Canvas Content
const canvasContent = fs.readFileSync(canvasFile, "utf8");
assert(canvasContent.includes("Live Simulator") || canvasContent.includes("Live Sandbox"), "Canvas must have Live Simulator tab");
assert(canvasContent.includes("Cartridge Manifest") || canvasContent.includes("manifest.json"), "Canvas must have Manifest inspector tab");
console.log("✔ SandboxCanvas dual-tab inspector verified");

// 4. Verify Builder Page Layout
const pageContent = fs.readFileSync(builderPage, "utf8");
assert(pageContent.includes("BuilderAccordion"), "Builder page must mount BuilderAccordion");
assert(pageContent.includes("SandboxCanvas"), "Builder page must mount SandboxCanvas");
assert(pageContent.includes("Compile & Download"), "Builder page must feature compile CTA");
console.log("✔ Split-pane Builder Page verified");

console.log("✅ Task 6: Split-Pane Agent Studio Builder passed 100%!");
