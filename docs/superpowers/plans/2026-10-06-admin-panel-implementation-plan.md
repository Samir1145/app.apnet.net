# Admin Panel (admin-panel / app.apnet.net) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 1-seat per license enforcement with 1-click machine transfer, build the `/api/sync/assets` desktop synchronization pipeline, and enhance the web-based Agent Studio as the flagship `.haya` compiler for legal practitioners.

**Architecture:** Next.js 15 App Router with Drizzle ORM (Neon PostgreSQL / in-memory mock store fallback). Secure cookie session authentication (`hayagriva_user`, `hayagriva_admin_token`) and license key hardware-binding APIs.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Drizzle ORM, Lucide React, Node.js crypto.

**Spec:** `docs/superpowers/specs/2026-10-06-ai-drip-resolution-content-simplification-design.md`

## Global Constraints
- 1 License = 1 Active Machine Seat at any time (`maxDevices = 1`).
- Provide 1-click "Transfer Seat / Rebind Hardware" action on `/dashboard/licenses`.
- Serve declarative agent definitions via authenticated `/api/sync/assets` and `/api/user/agents/[id]/export` endpoints.
- Preserve zero developer jargon on advocate-facing views; keep all TypeScript checks passing (`npx tsc --noEmit`).

## Review Focus
- Hardware seat collision: What happens when an advocate enters their key on a second machine? (Must cleanly report `SEAT_TRANSFER_REQUIRED` and link to portal).
- Instant machine transfer: When an advocate clicks "Transfer Seat", the old machine must immediately deactivate and the new one must activate.
- Air-gap manifest completeness: Does the exported `.haya` package contain everything needed for offline execution (prompts, rules, vault references, model requirements)?
- Responsive UI: Do the Agent Studio and Licenses page work cleanly on laptop and tablet viewports?
- Backward compatibility: Ensure existing seed data and regression tests pass without data loss.

---

### Task 1: 1-Seat Licensing & 1-Click Hardware Transfer Engine
**Files:**
- Modify: `src/lib/services/licensing.ts`
- Modify: `src/app/api/user/licenses/route.ts`
- Create: `src/app/api/user/licenses/transfer/route.ts`
- Modify: `src/app/dashboard/licenses/page.tsx`
- Test: `src/tests/licensing_single_seat.test.ts`

**Interfaces:**
- Consumes: `License`, `Activation` schema from `src/lib/db/schema.ts`
- Produces: 1-seat enforcement and `POST /api/user/licenses/transfer` endpoint

- [ ] **Step 1: Write test for single-seat enforcement and transfer**
Verify that a 2nd machine activation fails with `SEAT_TRANSFER_REQUIRED` when 1 seat is active, and succeeds after transferring.
- [ ] **Step 2: Run test to confirm it fails on current 3-seat logic**
Run: `npx tsx src/tests/licensing_single_seat.test.ts`
- [ ] **Step 3: Update `licensing.ts` to enforce `maxDevices = 1` and add `transferSeat(store, licenseId, newFingerprint)`**
- [ ] **Step 4: Create `POST /api/user/licenses/transfer` API route**
- [ ] **Step 5: Update `/dashboard/licenses` UI**
Show single active device seat badge (`1 / 1 Seat Bound`) and add prominent `"Transfer Seat to New Machine"` button with confirmation modal.
- [ ] **Step 6: Run test to verify it passes**
Run: `npx tsx src/tests/licensing_single_seat.test.ts`
- [ ] **Step 7: Commit changes**

---

### Task 2: Build Desktop Sync & Agent Export Pipeline
**Files:**
- Create: `src/app/api/sync/assets/route.ts`
- Create: `src/app/api/user/agents/[id]/export/route.ts`
- Modify: `src/lib/services/agent_registry.ts`
- Test: `src/tests/sync_assets_pipeline.test.ts`

**Interfaces:**
- Consumes: Authenticated `licenseKey` & `hardwareFingerprint`
- Produces: JSON sync manifest (`{ agents: HayaAgent[], vaults: string[], model: string, licenseStatus: string }`)

- [ ] **Step 1: Write test for `/api/sync/assets` endpoint**
Test valid license key returns active `.haya` agents, vault IDs, and model specs; test invalid or expired key returns 403.
- [ ] **Step 2: Run test to confirm 404**
- [ ] **Step 3: Implement `GET /api/sync/assets`**
Authenticate request using license key and hardware fingerprint; return array of compiled declarative agent packages, active vault cartridges, and BharatGen model references.
- [ ] **Step 4: Implement `GET /api/user/agents/[id]/export`**
Serve downloadable `.haya` manifest package file for direct offline import.
- [ ] **Step 5: Run test to verify passes**
Run: `npx tsx src/tests/sync_assets_pipeline.test.ts`
- [ ] **Step 6: Commit changes**

---

### Task 3: Elevate Agent Studio with Instant `.haya` Compilation
**Files:**
- Modify: `src/app/dashboard/agents/page.tsx`
- Modify: `src/components/agents/ArchetypeCard.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: `/api/user/agents/[id]/export`
- Produces: 1-click `.haya` bundle downloads from Agent Studio & Dashboard

- [ ] **Step 1: Update Agent Studio page to trigger direct `.haya` JSON bundle generation on "Download"**
- [ ] **Step 2: Add quick-preview modal showing the declarative structure (prompts, Bare Act vaults, slash command) before download**
- [ ] **Step 3: Run TypeScript and UI build check**
Run: `npx tsc --noEmit`
- [ ] **Step 4: Commit changes**
