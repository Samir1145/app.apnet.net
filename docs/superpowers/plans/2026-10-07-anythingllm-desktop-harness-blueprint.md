# Hayagriva Sovereign Desktop Harness — Strategic Blueprint & Implementation Spec
**Date:** October 7, 2026  
**Status:** Approved Architectural Pivot (Replaces Eclipse Theia with AnythingLLM Foundation)  
**Author:** Pair-Programming Session with Atul Grover & Antigravity  

---

## 1. Executive Summary & The Architectural Pivot

### What We Decided & Why:
1. **The Web Portal (`admin-panel` @ `app.apnet.net`)**:
   - **Remains the SaaS & Commercial Hub**: Handles 1-seat cryptographic licensing, 1-click machine hardware transfers, GST invoices, Razorpay billing, and KYC support tickets.
   - **Hosts the Agent Studio**: The visual, zero-jargon builder where legal practitioners configure domain agents (e.g. *Section 43 Avoidance Auditor*, *Form 2 Plan Reviewer*) and download/sync compiled `.haya` manifests.
   - **Status**: Task 1 (1-Seat Licensing & Transfer Engine) is 100% complete and pushed to GitHub (`acf028b`).

2. **The Desktop Harness Pivot**:
   - **Deprecated**: Eclipse Theia is deprecated for this project. Theia was built in 2017 for software engineers compiling Java/C++; fighting its rigid Phosphor widget system to build document ingestion and rich legal drafting creates excessive maintenance overhead.
   - **Selected Base**: **AnythingLLM** (`/Users/atulgrover/Desktop/GITHUB CODES/Agentic Framework/anything-llm`).
     - **Why**: AnythingLLM already provides 80% of what an advocate needs:
       - **Matter Workspaces**: Isolated dossier folders for legal cases (e.g., *"NCLT - ABC Steels CIRP"*).
       - **Battle-Tested Document Collector (`collector/`)**: Out-of-the-box parsing of 400-page scanned court PDFs, OCR, Word docs, and Excel bank ledgers.
       - **Embedded Airgapped Vector DB**: LanceDB / SQLite-vec running locally with zero Docker overhead.
       - **Local LLM Connectors**: Native 1-click hooks to local Ollama / BharatGen (`127.0.0.1:11434`).
       - **Pure Node/React Stack**: Zero Python runtime conflicts; standard React + Tailwind + Express.
   - **Transplants from OpenHands & VS Code**:
     - **From OpenHands Desktop**: The Electron app supervisor (`electron/main.mjs`), native splash screen (`loading.html`), zero-egress loopback policy, and cross-platform packaging (`electron-builder.config.mjs`).
     - **From OpenHands / Monaco**: `@monaco-editor/react` for structured legal template editing.
     - **From VS Code / Monaco LSP**: The `CompletionItemProvider` for instant typing-time Bare Act section autocompletions (`Sec 43` $\rightarrow$ full bare act text).
     - **New Addition**: **Milkdown** (WYSIWYG Markdown) for distraction-free, rich legal drafting without code markup.

---

## 2. Target 3-Pane Workstation Architecture

When an advocate opens the **Hayagriva Desktop Harness**, they see a purpose-built legal environment:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        HAYAGRIVA SOVEREIGN DESKTOP HARNESS                             │
├────────────────────┬───────────────────────────────────┬───────────────────────────────┤
│ 1. MATTER DOSSIER  │ 2. DRAFTING CANVAS                │ 3. SOVEREIGN AGENT & AUDIT    │
│ (AnythingLLM Core) │ (Milkdown WYSIWYG + Monaco)       │ (AnythingLLM + OpenHands)     │
├────────────────────┼───────────────────────────────────┼───────────────────────────────┤
│ Case: ABC Steels   │ [ WYSIWYG Draft | Monaco Code ]   │ Active: Section 43 Auditor    │
│                    │                                   │ Model: BharatGen Local (8B)   │
│ 📁 Petitions       │ IN THE NATIONAL COMPANY LAW...    │                               │
│  - sec7_filing.pdf │                                   │ > Running PUFE inquest...     │
│                    │ Application under Section 43      │ [Step 1] Reading Ledger C     │
│ 📁 Financials      │ read with Section 66 of IBC...    │ [Step 2] Found ₹4.2 Cr link   │
│  - ledger_fy24.xlsx│                                   │ [Step 3] Schedule drafted     │
│  - bank_stmt.pdf   │ *Typing 'Sec 43' triggers in-RAM* │                               │
│                    │ *Statutory Vault autocompletion*  │ [ Insert Citation into Draft ]│
│ [Drag & Drop Files]│                                   │ [ Download Report (.pdf) ]    │
└────────────────────┴───────────────────────────────────┴───────────────────────────────┘
```

---

## 3. The 4 Engineering Tasks for AnythingLLM

When you open `agy` inside the `anything-llm` repository, here is the ordered, step-by-step roadmap:

### Phase 1: Re-Skinning & Single-Seat License Guard
- Re-brand the application shell to **Hayagriva Sovereign Harness**.
- Change "Workspaces" terminology to **"Chamber Matters & Dossiers"**.
- Add an initialization license check that requests the **Master License Key** and verifies it against `https://app.apnet.net/api/user/licenses` or generates a cached offline hardware token.

### Phase 2: The Drafting Canvas Integration (Milkdown + Monaco)
- Inside the Matter view, add a second tab/split view: **"Drafting Canvas"**.
- Embed **Milkdown** (`@milkdown/core`, `@milkdown/react`, `@milkdown/preset-commonmark`) for rich, distraction-free markdown petition drafting.
- Add a toggle to switch to **Monaco Editor** for structured pleading templates.

### Phase 3: In-RAM Statutory Vaults & Monaco Autocomplete
- Bundle local Bare Act JSON/SQLite cartridges in `~/.hayagriva/vaults/`:
  - `bare_ibc.vault` (Insolvency & Bankruptcy Code 2016)
  - `companies_act.vault` (Companies Act 2013)
  - `commercial_courts.vault` (Commercial Courts Act 2015)
  - `cpc_1908.vault` (Code of Civil Procedure 1908)
- Register a Monaco / Milkdown completion provider so typing `Sec <number>` or legal triggers pops up an instant bare act citation widget.

### Phase 4: `.haya` Agent Dock & Electron Packaging
- Add an **"Import / Dock Agent"** handler that reads `.haya` agent manifest files exported from the Admin Panel.
- Use the Electron packaging pattern from OpenHands (`electron-builder.config.mjs`) to produce standalone `.dmg` (macOS) and `.exe` (Windows) installers with zero Docker requirements.

---

## 4. How to Resume Work Tomorrow Morning

When you open your terminal or IDE tomorrow:

1. Open `agy` in:
   ```bash
   cd "/Users/atulgrover/Desktop/GITHUB CODES/Agentic Framework/anything-llm"
   agy
   ```
2. **Give Antigravity this exact kick-off prompt:**
   > *"Read `HAYAGRIVA_DESKTOP_HARNESS_SPEC.md` at the root of this folder. We have finalized our architecture: we are forking AnythingLLM as the foundation for the Hayagriva Desktop Harness. Let's begin Phase 1: setup the environment, inspect the workspace structure, and plan the re-skinning and license guard."*

---

*Document created and committed on 2026-10-07.*
