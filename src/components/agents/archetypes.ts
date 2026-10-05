// admin-panel/src/components/agents/archetypes.ts

export interface CourtArchetype {
  key: string;
  title: string;
  domain: string;
  badge: string;
  badgeColor: string;
  description: string;
  icon: string;
  systemPrompt: string;
  defaultVaults: string[];
  subagentsEnabled: boolean;
  criticAgent: string;
  slashTrigger: string;
  templateSkeleton: string;
}

export const courtArchetypes: CourtArchetype[] = [
  {
    key: 'avoidance_auditor',
    title: 'Insolvency Avoidance & Forensic Auditor',
    domain: 'IBC §§ 43, 45, 50, 66',
    badge: 'Statutory Forensic',
    badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30',
    description: 'Audits multi-bank ledgers, eliminates contra-sweeps, computes statutory look-back periods (1-yr general, 2-yr related party), and drafts avoidance applications.',
    icon: 'ShieldAlert',
    systemPrompt: 'You are the Avoidance & Forensic Inquest Auditor for the Insolvency Resolution Professional. Your sovereign mandate is to scrutinize corporate debtor transactions under Sections 43 (Preferential), 45 (Undervalued), 50 (Extortionate), and 66 (Fraudulent/Trading) of the Insolvency and Bankruptcy Code, 2016. Verify look-back dates from the CIRP admission order, isolate contra-sweeps, and produce court-ready avoidance inquest pleadings.',
    defaultVaults: ['bare_ibc.vault', 'cirp_regs.vault'],
    subagentsEnabled: true,
    criticAgent: 'forms_agent',
    slashTrigger: '/avoidance-inquest',
    templateSkeleton: `IN THE NATIONAL COMPANY LAW TRIBUNAL, BENCH AT {{BENCH}}
IA NO. ___ OF 2026 IN CP(IB) NO. ___/2026

IN THE MATTER OF: SECTION 43/45/50/66 OF IBC, 2016

APPLICATION FOR AVOIDANCE OF TRANSACTIONS...`,
  },
  {
    key: 'commercial_pleading',
    title: 'Commercial Injunction & Interlocutory Drafter',
    domain: 'CPC 1908 & Commercial Courts Act',
    badge: 'Commercial Litigation',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    description: 'Generates urgent interlocutory relief petitions under Order 38 Rule 5, Order 39 Rules 1 & 2 (3-prong test), Order VI Rule 15A Statement of Truth, and Section 12A PIMS non-starter applications.',
    icon: 'Scale',
    systemPrompt: 'You are the Senior Commercial Courts Pleading Drafter. You operate strictly under the Commercial Courts Act, 2015 and the Code of Civil Procedure, 1908 as amended. Ensure all applications satisfy the 3-prong test (prima facie case, balance of convenience, irreparable injury), include statutory Order 39 Rule 3 undertakings, and attach a compliant Statement of Truth under Order VI Rule 15A.',
    defaultVaults: ['commercial_courts.vault', 'cpc_1908.vault'],
    subagentsEnabled: true,
    criticAgent: 'document_agent',
    slashTrigger: '/cpc-order39',
    templateSkeleton: `IN THE COMMERCIAL COURT / HIGH COURT OF JUDICATURE AT {{CITY}}
COMMERCIAL SUIT NO. ___ OF 2026

APPLICATION UNDER ORDER XXXIX RULES 1 & 2 READ WITH SECTION 151 CPC FOR AD-INTERIM EX-PARTE TEMPORARY INJUNCTION...`,
  },
  {
    key: 'claim_adjudicator',
    title: 'Creditor Claim Verifier & Adjudicator',
    domain: 'IBC Claims (Forms B, C, CA, D)',
    badge: 'Claims & Waterfall',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'Ingests Form B/C/CA creditor proofs, verifies loan sanction letters, recalculates penal interest vs contractual rates, and generates admitted vs disallowed verification memos.',
    icon: 'ReceiptCheck',
    systemPrompt: 'You are the Claims Verification Officer for the Resolution Professional. Ingest creditor claim submissions (Form B for Operational Creditors, Form C for Financial Creditors, Form CA for Class Creditors). Reconcile bank statements against sanction letters, recalculate interest, flag non-admissible interest as disallowed, and output the Section 21 CoC voting share list.',
    defaultVaults: ['bare_ibc.vault', 'cirp_regs.vault'],
    subagentsEnabled: false,
    criticAgent: 'forms_agent',
    slashTrigger: '/claim-verify',
    templateSkeleton: `MEMORANDUM OF VERIFICATION OF CLAIM (REGULATION 13 OF CIRP REGULATIONS, 2016)

CLAIMANT: {{CLAIMANT_NAME}}
CLAIM AMOUNT: INR {{CLAIM_AMOUNT}}
ADMITTED AMOUNT: INR {{ADMITTED_AMOUNT}}
DISALLOWED AMOUNT: INR {{DISALLOWED_AMOUNT}}
REASONS FOR DISALLOWANCE: {{DISALLOWANCE_REASONS}}`,
  },
  {
    key: 'sec29a_inquest',
    title: 'Section 29A Multi-Registry Due Diligence Inquest',
    domain: 'Resolution Applicant Eligibility',
    badge: 'Eligibility Audit',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    description: 'Audits resolution applicants across the 10 statutory disqualification gates of Section 29A (clauses a–j), including NPA account tracking, connected persons, and wilful defaulter lists.',
    icon: 'UserX',
    systemPrompt: 'You are the Section 29A Eligibility Compliance Auditor. Your mandate is to rigorously verify that prospective Resolution Applicants, connected persons, and promoters are not disqualified under clauses (a) through (j) of Section 29A of the Insolvency and Bankruptcy Code, 2016. Cross-reference DIN filings, RBI wilful defaulter gazettes, and Section 29A Affidavits.',
    defaultVaults: ['bare_ibc.vault', 'companies_act.vault'],
    subagentsEnabled: true,
    criticAgent: 'advisor_agent',
    slashTrigger: '/sec29a-cert',
    templateSkeleton: `SECTION 29A ELIGIBILITY DUE DILIGENCE REPORT

PROSPECTIVE RESOLUTION APPLICANT: {{APPLICANT_NAME}}
STATUTORY AUDIT AGAINST CLAUSES (A) THROUGH (J):
1. UNDISCHARGED INSOLVENT (§ 29A(a)): CLEARED
2. WILFUL DEFAULTER (§ 29A(b)): CLEARED
3. NPA ACCOUNT IN EXCESS OF 1 YEAR (§ 29A(c)): ...`,
  },
  {
    key: 'custom_chamber',
    title: 'Custom Sovereign Chamber Coworker',
    domain: 'Chamber Specific / Blank Canvas',
    badge: 'Custom Builder',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    description: 'Build a bespoke legal agent from scratch: define your own system prompts, bind bare act cartridges, select local or cloud models, and configure Monaco slash triggers.',
    icon: 'Sparkles',
    systemPrompt: 'You are a sovereign legal assistant configured for specialized in-chamber practice. Adhere strictly to the practitioner directives and attached bare act vaults.',
    defaultVaults: ['bare_ibc.vault'],
    subagentsEnabled: false,
    criticAgent: '',
    slashTrigger: '/custom-agent',
    templateSkeleton: `CHAMBER DRAFTING TEMPLATE

MATTER: {{MATTER_NAME}}
DATE: {{DATE}}

...`,
  },
];
