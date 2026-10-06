# Website (apnet_website) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform all remaining product, catalog, and agent subpages on `apnet_website` from developer jargon into plain-English "AI Drip Resolution" and sovereign legal workflows, with clear 1-seat chamber licensing and desktop harness installation guidance.

**Architecture:** Static HTML5/CSS/Vanilla JS architecture with shared modular headers and footers (`header.html`, `footer.html`, `js/header.js`, `js/footer.js`). Content is organized around the 4 core pillars: WORKBENCH, INTELLIGENCE, IBC AGENTS, and COMMUNITY.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Python HTTP server for local verification.

**Spec:** `docs/superpowers/specs/2026-10-06-ai-drip-resolution-content-simplification-design.md`

## Global Constraints
- Absolute ban on developer jargon: No Monaco, AST, ONNX, GGUF, token counts, FTS5, vector embeddings, or MCP bearer tokens in advocate-facing copy.
- Positioning: Emphasize "AI Drip Resolution" (background ingestion as data arrives, zero missed statutory deadlines, courtroom liability shield).
- Licensing: Clearly communicate 1-seat chamber licensing per practitioner with 1-click machine transfer.
- Navigation sync: Retain strict 4-pillar header mega-menu and balanced 4-column footer.

## Review Focus
- Advocate comprehension: Does a non-technical Resolution Professional immediately understand what the product does within 5 seconds?
- Clear download doorway: Does the user know that the Desktop Harness is downloaded once, while custom agents are crafted on the web?
- Mobile responsiveness: Do all 4-pillar subpages render legibly on mobile screens without horizontal scroll?
- Broken link prevention: Ensure all cross-links point to valid `.html` pages or `https://app-apnet-net.onrender.com/login`.
- Performance: Ensure zero heavy external JS dependencies blocking initial paint.

---

### Task 1: Overhaul Workbench & Desktop Engine Pages
**Files:**
- Modify: `apnet_website/harness_haya_workbench.html`
- Modify: `apnet_website/harness_haya_engine.html`
- Test: Python smoke test verifying HTTP 200 and zero forbidden jargon strings

**Interfaces:**
- Consumes: `header.html`, `footer.html`
- Produces: Plain-English Chamber Workspace & Forensic Engine landing pages

- [ ] **Step 1: Write test to verify absence of developer jargon**
Verify that terms like `Monaco`, `AST`, and `GGUF` do not appear in user-facing headings or body paragraphs.
- [ ] **Step 2: Run test to confirm current pages contain deprecated jargon**
- [ ] **Step 3: Rewrite `harness_haya_workbench.html` as "Courtroom Legal Drafting Studio"**
Highlight split-pane petition drafting, live statutory citations, and automatic IBC deadline chronologies.
- [ ] **Step 4: Rewrite `harness_haya_engine.html` as "Offline Forensic Resolution Engine"**
Highlight 100% air-gapped machine execution, ledger cross-examination, and bank statement audit inquests.
- [ ] **Step 5: Run verification script to confirm 200 OK and clean copy**
- [ ] **Step 6: Commit changes to `apnet_website` git repo**

---

### Task 2: Overhaul Sovereign Catalogs (BharatGen Models & Statutory Vaults)
**Files:**
- Modify: `apnet_website/models_domain_slms.html`
- Modify: `apnet_website/harness_haya_vaults.html`
- Test: Python smoke test verifying copy accuracy and link integrity

**Interfaces:**
- Consumes: Reference specs from admin-panel catalog
- Produces: "BharatGen Certified SLMs" and "Air-Gapped Statutory Vaults" pages

- [ ] **Step 1: Write test checking for "BharatGen" and "In-Harness Auto-Sync" copy**
- [ ] **Step 2: Run test to confirm failures on existing pages**
- [ ] **Step 3: Rewrite `models_domain_slms.html` as "BharatGen Sovereign Models"**
Explain that legal models sync automatically into the desktop harness and never phone home to external clouds.
- [ ] **Step 4: Rewrite `harness_haya_vaults.html` as "Chamber Statutory Vaults"**
Highlight official India Code Bare Act memory cartridges (IBC, Companies Act, Commercial Courts, CPC) pre-indexed for instant offline query.
- [ ] **Step 5: Run tests and verify in browser**
- [ ] **Step 6: Commit changes to `apnet_website` git repo**

---

### Task 3: Overhaul IBC Agents & Process Foundry Pages
**Files:**
- Modify: `apnet_website/agents_insolvency.html`
- Modify: `apnet_website/agents_process_agents.html`
- Test: Link checker verifying all CTA buttons point to `/login` or `/register`

**Interfaces:**
- Consumes: Agent archetypes defined in Agent Studio
- Produces: "Autonomous IBC Agents" and "Chamber Agent Foundry" pages

- [ ] **Step 1: Write link and content verification script**
- [ ] **Step 2: Run script to verify old content**
- [ ] **Step 3: Rewrite `agents_insolvency.html` focusing on Section 43 Avoidance, Section 66 Fraud, and CIRP Claim Verification**
- [ ] **Step 4: Rewrite `agents_process_agents.html` showcasing the Agent Studio workflow (create on web $\rightarrow$ download `.haya` $\rightarrow$ dock into desktop IDE)**
- [ ] **Step 5: Run tests and verify layout**
- [ ] **Step 6: Commit changes to `apnet_website` git repo**
