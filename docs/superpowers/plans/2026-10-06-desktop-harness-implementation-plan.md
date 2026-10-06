# Desktop Harness (Eclipse Theia / Hayagriva IDE) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the native Eclipse Theia client extension (`@hayagriva/theia-agent-bridge`) that authenticates the desktop harness with the advocate's Master License Key, synchronizes activated `.haya` agents, statutory vaults, and BharatGen models, and binds them into the Theia AI runtime for 100% air-gapped courtroom execution.

**Architecture:** Eclipse Theia extension architecture utilizing Theia AI Framework (`@eclipse-theia/ai`), with background file synchronization to `~/.hayagriva/`, local SQLite-vec Bare Act querying, and local GGUF/llama.cpp inference binding.

**Tech Stack:** TypeScript, Eclipse Theia Extension API, Theia AI (`@eclipse-theia/ai`), Node.js (fs, crypto, http/https), SQLite3/better-sqlite3.

**Spec:** `docs/superpowers/specs/2026-10-06-ai-drip-resolution-content-simplification-design.md`

## Global Constraints
- 100% Air-Gapped Execution: Once initial assets are synced, the harness must function completely with Wi-Fi disabled.
- Single-Seat Enforcement: Pass the hardware fingerprint during initial handshake; gracefully handle `SEAT_TRANSFER_REQUIRED` with a direct link to the web portal.
- Large File Protection: BharatGen model downloads (2–5 GB) must have an explicit UI progress indicator and pause/resume capability so they never freeze the editor.
- Status Bar Indicator: Provide a persistent Green Shield status icon: `"100% Air-Gapped Ready"`.

## Review Focus
- Offline cold boot: Does the IDE open and respond to `@avoidance-auditor` commands with the internet cable disconnected?
- Network drop during sync: Does the model downloader cleanly resume from the last byte if Wi-Fi cuts out mid-download?
- Seat collision UX: If a user enters their license on a second laptop, does the error message provide clear, friendly instructions to click "Transfer Seat" on their web portal?
- Agent persona loading: Do custom agents created on the web appear in the Theia AI Chat dropdown with their exact system prompts and Bare Act constraints?
- Workspace file safety: Do agents propose edits through Theia's standard diff/review mechanism rather than overwriting open court petitions silently?

---

### Task 1: License Activation Handshake & Hardware Fingerprint Client
**Files:**
- Create: `packages/hayagriva-bridge/src/browser/license-handshake.ts`
- Create: `packages/hayagriva-bridge/src/node/hardware-fingerprint.ts`
- Create: `packages/hayagriva-bridge/src/node/license-backend.ts`
- Test: `packages/hayagriva-bridge/src/node/__tests__/license-handshake.test.ts`

**Interfaces:**
- Consumes: `POST /api/license/activate` on `app.apnet.net`
- Produces: `LicenseManagerService` with cached offline JWT token in `~/.hayagriva/license.token`

- [ ] **Step 1: Write test for hardware fingerprint generation**
Verify deterministic SHA256 generation combining CPU ID, primary MAC address, and hostname.
- [ ] **Step 2: Run test to confirm failure**
- [ ] **Step 3: Implement `generateHardwareFingerprint()`**
- [ ] **Step 4: Implement `LicenseHandshakeModal` in Theia browser layer**
Displays on first launch if `~/.hayagriva/license.token` is missing, prompting: *"Enter your Chamber License Key (HAYA-ENT-...)"*.
- [ ] **Step 5: Implement activation call and error handler for `SEAT_TRANSFER_REQUIRED`**
If seat is already active on another machine, show dialog: *"Seat bound to another machine. Transfer seat in your Web Portal [Transfer Seat on Web]"*.
- [ ] **Step 6: Run tests and verify token caching**
- [ ] **Step 7: Commit changes**

---

### Task 2: Chamber Asset Sync Pipeline & Large File Download Manager
**Files:**
- Create: `packages/hayagriva-bridge/src/node/sync-manager.ts`
- Create: `packages/hayagriva-bridge/src/browser/download-progress-widget.tsx`
- Create: `packages/hayagriva-bridge/src/node/vault-installer.ts`
- Test: `packages/hayagriva-bridge/src/node/__tests__/sync-manager.test.ts`

**Interfaces:**
- Consumes: `GET /api/sync/assets` endpoint from Admin Panel
- Produces: Populated `~/.hayagriva/agents/`, `~/.hayagriva/vaults/`, and verified `~/.hayagriva/models/`

- [ ] **Step 1: Write test for sync manifest parsing and local file storage**
- [ ] **Step 2: Run test to confirm failure**
- [ ] **Step 3: Implement `SyncManager`**
Pulls activated `.haya` manifests and Bare Act SQLite cartridges into local directory.
- [ ] **Step 4: Implement chunked, resumable model downloader for BharatGen GGUF weights**
Emits percentage progress events to Theia status bar and notification toast.
- [ ] **Step 5: Implement drag-and-drop `.haya` package installer**
Allows advocates to drop an exported agent file into the IDE window to instantly mount it.
- [ ] **Step 6: Run tests and verify download resume logic**
- [ ] **Step 7: Commit changes**

---

### Task 3: Theia AI Persona Injection & Air-Gap Status Indicator
**Files:**
- Create: `packages/hayagriva-bridge/src/browser/theia-ai-persona-provider.ts`
- Create: `packages/hayagriva-bridge/src/browser/airgap-status-bar.ts`
- Create: `packages/hayagriva-bridge/src/node/local-inference-broker.ts`
- Test: `packages/hayagriva-bridge/src/browser/__tests__/persona-provider.test.ts`

**Interfaces:**
- Consumes: `@eclipse-theia/ai` AgentRegistry and PromptRegistry
- Produces: Dynamic `@agent-name` personas in Theia AI chat and Green Shield status bar

- [ ] **Step 1: Write test verifying agent manifest maps to Theia AI Agent descriptor**
- [ ] **Step 2: Run test to confirm failure**
- [ ] **Step 3: Implement `TheiaAiPersonaProvider`**
Scans `~/.hayagriva/agents/*.haya`, registers each as an active agent persona with its slash triggers and Bare Act constraints in Theia AI Chat.
- [ ] **Step 4: Implement `LocalInferenceBroker`**
Routes prompt requests to local llama.cpp / GGUF runner on localhost, bypassing all external cloud APIs.
- [ ] **Step 5: Implement `AirGapStatusBarContribution`**
Displays green shield: `🟢 Sovereign Shield: 100% Air-Gapped Ready` when all assets are loaded locally.
- [ ] **Step 6: Run tests and verify UI integration**
- [ ] **Step 7: Commit changes**
