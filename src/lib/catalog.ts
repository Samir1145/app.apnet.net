// Central Asset Distribution Catalog (Migrated from VARAHA to GARUDA)
export interface CatalogItem {
  id: string;
  r2Key: string;
  category: 'app' | 'model' | 'agent' | 'vault';
  name: string;
  price: number;
  size: string;
  description: string;
}

export const ASSET_CATALOG: CatalogItem[] = [
  // 1. Desktop App Installers
  { id: 'hayagriva-mac-x64.dmg', r2Key: 'builds/hayagriva-mac-x64.dmg', category: 'app', name: 'Hayagriva Desktop IDE — macOS (Intel / Apple Silicon)', price: 0, size: '120 MB', description: 'Native Electron IDE bundle with pre-bundled InLegal-SBERT & Starter Demo Pack.' },
  { id: 'hayagriva-win-x64.exe', r2Key: 'builds/hayagriva-win-x64.exe', category: 'app', name: 'Hayagriva Desktop IDE — Windows 10 / 11 (64-bit)', price: 0, size: '140 MB', description: 'Native Standalone Windows Setup Installer with pre-bundled InLegal-SBERT & Starter Kit.' },
  { id: 'hayagriva-linux-x64.AppImage', r2Key: 'builds/hayagriva-linux-x64.AppImage', category: 'app', name: 'Hayagriva Desktop IDE — Linux (AppImage / x64)', price: 0, size: '130 MB', description: 'Portable Linux binary package with pre-bundled InLegal-SBERT & Starter Kit.' },

  // 2. Offline LLM AI Engines (.gguf)
  { id: 'legalparam-2.9b.gguf', r2Key: 'models/legalparam-2.9b.gguf', category: 'model', name: 'LegalParam 2.9B LLM (Q4_K_M)', price: 499, size: '1.70 GB', description: 'Quantized LLM fine-tuned on Indian law, IBC 2016, court precedents & legal drafting.' },
  { id: 'financeparam-2.9b.gguf', r2Key: 'models/financeparam-2.9b.gguf', category: 'model', name: 'FinanceParam 2.9B LLM (Q4_K_M)', price: 499, size: '1.70 GB', description: 'Quantized LLM fine-tuned on financial auditing, voting shares & CIRP claim calculations.' },
  { id: 'param-1-2.9b-instruct.gguf', r2Key: 'models/param-1-2.9b-instruct.gguf', category: 'model', name: 'Param-1 2.9B Instruct LLM (Q4_K_M)', price: 399, size: '1.70 GB', description: 'Quantized multilingual instruction LLM for general legal assistant & Hindi-English translation.' },

  // 3. Embedding Vector Engines (ONNX 768-Dim)
  { id: 'inlegal-sbert.onnx', r2Key: 'models/inlegal-sbert.onnx', category: 'model', name: 'InLegal-SBERT (768-Dim Default Canonical Embedder)', price: 0, size: '120 MB', description: 'Pre-bundled 768-dim vector engine for legal prose, case files, PDFs, & 14 Data Vaults.' },
  { id: 'finance-embeddings.onnx', r2Key: 'models/finance-embeddings.onnx', category: 'model', name: 'Finance-Embeddings (768-Dim Optional Tabular Embedder)', price: 199, size: '120 MB', description: 'Optional 768-dim tabular vector engine for raw numerical Excel ledgers & balance sheets.' },

  // 4. Agent Packs (.vlt)
  { id: 'legal_agents.vlt', r2Key: 'agent_packs/legal_agents.vlt', category: 'agent', name: 'Legal Subagents Pack (21 Specialists)', price: 399, size: '10 MB', description: '21 specialized subagents including @advisor, @document, @forms, @coc, @evaluator, @nclt, & @avoidance.' },
  { id: 'finance_agents.vlt', r2Key: 'agent_packs/finance_agents.vlt', category: 'agent', name: 'Finance Subagents Pack', price: 399, size: '10 MB', description: 'Forensic audit, bank reconciliation, claim admission, & financial analysis subagents.' },
  { id: 'coding_agents.vlt', r2Key: 'agent_packs/coding_agents.vlt', category: 'agent', name: 'Coding Subagents Pack', price: 399, size: '10 MB', description: 'IDE extension development, custom skill creation & debugger subagents.' },

  // 5. Encrypted 768-Dimension Domain Vaults (.vlt / .zip)
  { id: 'laws_vault_2026-W31.zip', r2Key: 'vaults/laws_vault_2026-W31.zip', category: 'vault', name: 'Statutory Laws & Regulations Vault (768-Dim)', price: 199, size: '35.2 MB', description: 'AES-256 encrypted vector index of IBC 2016, Companies Act 2013, Competition Act, & Rules.' },
  { id: 'cases_vault_2026-W31.zip', r2Key: 'vaults/cases_vault_2026-W31.zip', category: 'vault', name: 'Supreme Court & NCLAT Cases Vault (768-Dim)', price: 299, size: '139.3 MB', description: 'Indexed 768-dim vector precedent database of 37,978 NCLAT and Supreme Court judgements.' },
  { id: 'ibc_vaults.zip', r2Key: 'vaults/ibc_vaults.zip', category: 'vault', name: 'Insolvency & Bankruptcy Code Case Law Vault (768-Dim)', price: 249, size: '81.5 MB', description: 'Comprehensive case law database for NCLT, NCLAT, High Court, & Supreme Court IBC rulings.' },
  { id: 'general_vaults.zip', r2Key: 'vaults/general_vaults.zip', category: 'vault', name: 'High Court & Supreme Court General Jurisprudence Vault', price: 249, size: '73.0 MB', description: 'Full text vector index of civil, constitutional, & commercial law precedents.' },
  { id: 'acord_clauses_vault_2026-W32.zip', r2Key: 'vaults/acord_clauses_vault_2026-W32.zip', category: 'vault', name: 'ACORD Standard Clause Vault (126k Rated Clauses)', price: 299, size: '34.1 MB', description: '126,000+ attorney-rated contract clauses & M&A dealpoint benchmarks.' },
  { id: 'rera_vaults.zip', r2Key: 'vaults/rera_vaults.zip', category: 'vault', name: 'RERA Real Estate Regulation Act Vault (768-Dim)', price: 149, size: '8.8 MB', description: 'Real estate regulatory authority judgments, orders, & homebuyer precedence.' },
  { id: 'debt_recovery_vaults.zip', r2Key: 'vaults/debt_recovery_vaults.zip', category: 'vault', name: 'DRT & DRAT Debt Recovery Proceedings Vault', price: 149, size: '7.9 MB', description: 'Debt Recovery Tribunal rulings, SARFAESI Act precedents, & recovery proceedings.' },
  { id: 'documents_corporate_vault_2026-W31.zip', r2Key: 'vaults/documents_corporate_vault_2026-W31.zip', category: 'vault', name: 'Corporate Contracts & M&A Dealpoints Vault', price: 199, size: '6.1 MB', description: 'Commercial contracts, board resolutions, M&A agreements, & corporate compendiums.' },
  { id: 'documents_tax_conveyancing_vault_2026-W31.zip', r2Key: 'vaults/documents_tax_conveyancing_vault_2026-W31.zip', category: 'vault', name: 'Tax Appeals & Conveyancing Deeds Vault', price: 149, size: '5.0 MB', description: 'Tax appeal skeletons, property title conveyancing deeds, & lease agreements.' },
  { id: 'documents_pleadings_vault_2026-W31.zip', r2Key: 'vaults/documents_pleadings_vault_2026-W31.zip', category: 'vault', name: 'Petitions, Writs & Plaints Skeletons Vault', price: 199, size: '3.9 MB', description: 'Standard court petition skeletons, writ petitions, plaints, & written statements.' },
  { id: 'documents_ibc_vault_2026-W31.zip', r2Key: 'vaults/documents_ibc_vault_2026-W31.zip', category: 'vault', name: 'CIRP Petitions & Information Memorandum Vault', price: 199, size: '2.6 MB', description: 'Section 7/9/10 CIRP applications, Information Memorandum templates, & VDR dossiers.' },
  { id: 'forms_vault_2026-W31.zip', r2Key: 'vaults/forms_vault_2026-W31.zip', category: 'vault', name: 'Statutory IBBI & MCA Prescribed Forms Vault', price: 149, size: '1.5 MB', description: 'Statutory IBBI Forms (A-F), MCA filings, Regulation 39(4) Form H, & voting ballots.' },
  { id: 'arbitration_vaults.zip', r2Key: 'vaults/arbitration_vaults.zip', category: 'vault', name: 'Commercial Arbitration & Conciliation Vault', price: 149, size: '1.1 MB', description: 'Arbitration awards, Section 9/11/34 applications, & dispute resolution precedents.' },
  { id: 'cuad_benchmark.zip', r2Key: 'vaults/cuad_benchmark.zip', category: 'vault', name: 'CUAD & MAUD Contract Risk Benchmark Vault', price: 199, size: '18.0 MB', description: 'Atticus Project CUAD 510 contracts risk benchmark & MAUD 152 dealpoints index.' }
];
