// admin-panel/src/tests/cartridge_compiler.test.ts
import assert from "node:assert";
import JSZip from "jszip";
import { compileCartridge } from "../lib/compiler/cartridge-compiler";

console.log("=== Task 7: Testing Sovereign .haya Cartridge Compiler ===");

async function runTest() {
  const sampleAgent = {
    name: "Section 43 Avoidance Auditor",
    slug: "avoidance-inquest",
    description: "Audits bank ledgers for contra-sweeps and preferentials",
    archetype: "avoidance_auditor",
    version: "1.0.0",
    medallionColor: "#f59e0b",
    modelEngine: "local_llama_r1",
    reasoningEffort: "high",
    verbosity: "standard",
    allowSubagents: true,
    criticAgent: "forms_agent",
    maxCritiqueTurns: 2,
    statutoryVaults: ["bare_ibc.vault", "cirp_regs.vault"],
    slashTrigger: "/avoidance-inquest",
    systemPrompt: "You are the Avoidance & Forensic Inquest Auditor for the RP...",
    templateSkeleton: "IN THE NATIONAL COMPANY LAW TRIBUNAL... {{BENCH}}",
  };

  const zipBuffer = await compileCartridge(sampleAgent);
  assert(Buffer.isBuffer(zipBuffer), "Compiler must return a Buffer");
  assert(zipBuffer.length > 500, "Cartridge zip buffer must not be empty");

  // Read the generated zip file
  const zip = await JSZip.loadAsync(zipBuffer);
  
  // Verify mandatory cartridge files
  assert(zip.file("manifest.json"), "Archive must contain manifest.json");
  assert(zip.file("system_prompt.md"), "Archive must contain system_prompt.md");
  assert(zip.file("rules.json"), "Archive must contain rules.json");
  assert(zip.file("medallion.svg"), "Archive must contain medallion.svg");
  assert(zip.file("templates/primary_skeleton.md"), "Archive must contain templates/primary_skeleton.md");

  // Verify manifest contents
  const manifestRaw = await zip.file("manifest.json")!.async("string");
  const manifest = JSON.parse(manifestRaw);
  assert(manifest.slug === "avoidance-inquest", "Manifest slug must match");
  assert(manifest.name === "Section 43 Avoidance Auditor", "Manifest name must match");
  assert(manifest.statutoryVaults.includes("bare_ibc.vault"), "Manifest must list bare_ibc.vault");
  assert(manifest.delegation.allowSubagents === true, "Manifest delegation must be true");
  assert(manifest.editorTriggers[0].trigger === "/avoidance-inquest", "Manifest trigger must match");
  assert(manifest.hash && manifest.hash.startsWith("sha256-"), "Manifest must contain SHA-256 hash");

  console.log("✔ manifest.json parsed and verified");

  // Verify SVG medallion
  const svgContent = await zip.file("medallion.svg")!.async("string");
  assert(svgContent.includes("<svg"), "medallion.svg must be valid SVG");
  assert(svgContent.includes("#f59e0b"), "medallion.svg must include accent color");
  console.log("✔ medallion.svg coin icon verified");

  console.log("✅ Task 7: .haya Cartridge Compiler passed 100%!");
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
