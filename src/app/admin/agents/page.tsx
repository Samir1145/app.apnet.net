'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  DownloadCloud, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  FileCode, 
  Eye, 
  X, 
  ArrowUpRight, 
  Layers, 
  Scale, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Activity,
  Check,
  AlertTriangle,
  UploadCloud,
  ShieldAlert,
  FileSpreadsheet,
  Fingerprint,
  FileDown,
  Lock,
  Terminal,
  ChevronRight,
  Copy,
  Clock,
  ExternalLink,
  Shield
} from 'lucide-react';

interface CustomAgentAdmin {
  id: string;
  name: string;
  slug: string;
  version: string;
  author: string;
  firm: string;
  chamberId: string;
  archetype: 'avoidance_forensic_auditor' | 'commercial_injunction_drafter' | 'ibc_claim_verifier' | 'sec29a_eligibility_inquest' | 'custom_coworker';
  archetypeLabel: string;
  status: 'Official' | 'Community' | 'Under Review';
  modelTarget: string;
  boundVaults: string[];
  downloadsCount: number;
  adoptionPercentage: number;
  riskTier: 'READ_ONLY' | 'WRITE_LOCAL';
  airGapSovereign: boolean;
  createdAt: string;
  manifest: {
    name: string;
    version: string;
    description: string;
    triggers: string[];
    allowSubagents: boolean;
    systemPromptSnippet: string;
    rulesList: string[];
  };
}

const initialAgents: CustomAgentAdmin[] = [
  {
    id: 'agent-1',
    name: 'Section 43/66 Avoidance Inquest Auditor',
    slug: 'avoidance-inquest-auditor',
    version: '1.4.0',
    author: 'Adv. Atul Grover',
    firm: 'Grover & Associates Chamber',
    chamberId: 'CHAMBER-DL-089',
    archetype: 'avoidance_forensic_auditor',
    archetypeLabel: 'Avoidance Forensic Auditor',
    status: 'Official',
    modelTarget: 'DeepSeek-R1-7B (Local Q4_K_M)',
    boundVaults: ['ibc_2016', 'cpc_1908'],
    downloadsCount: 1240,
    adoptionPercentage: 82,
    riskTier: 'WRITE_LOCAL',
    airGapSovereign: true,
    createdAt: '2026-09-12',
    manifest: {
      name: 'Section 43/66 Avoidance Inquest Auditor',
      version: '1.4.0',
      description: 'Air-gapped forensic cash flow reconciliation and preferential/fraudulent transaction inquest under Sections 43, 45, 50, and 66 of IBC 2016.',
      triggers: ['/avoidance-audit', '/lookback-reconcile', '/contra-sweep'],
      allowSubagents: true,
      rulesList: [
        'IBC_SEC43_LOOKBACK: Enforce statutory 2-year lookback for related parties, 1-year for others',
        'FORENSIC_DOUBLE_ENTRY: Disallow single-entry unverified journal entries',
        'AIR_GAP_ZERO_NET: Strictly prohibit external HTTP telemetry outside localhost'
      ],
      systemPromptSnippet: `You are the Senior Avoidance Forensic Auditor for the Resolution Professional in CIRP proceedings under the Insolvency and Bankruptcy Code, 2016.
Your primary role is to audit multi-bank ledgers, cash flows, and contra-sweeps across statutory look-back periods to identify:
1. Preferential Transactions (Section 43)
2. Undervalued Transactions (Section 45)
3. Extortionate Credit Transactions (Section 50)
4. Fraudulent Trading or Avoidance (Section 66)

Produce court-ready avoiding inquest affidavits formatted for NCLT Principal Bench.`,
    }
  },
  {
    id: 'agent-2',
    name: 'Order 39 Urgent Injunction Drafter',
    slug: 'order39-injunction-drafter',
    version: '2.1.0',
    author: 'K. S. Narayanan, Senior Counsel',
    firm: 'Commercial Bar Chambers, Delhi',
    chamberId: 'CHAMBER-DHC-014',
    archetype: 'commercial_injunction_drafter',
    archetypeLabel: 'Commercial Injunction Drafter',
    status: 'Official',
    modelTarget: 'Llama-3.2-3B (High Velocity)',
    boundVaults: ['cpc_1908', 'commercial_courts_2015', 'specific_relief_1963'],
    downloadsCount: 980,
    adoptionPercentage: 65,
    riskTier: 'WRITE_LOCAL',
    airGapSovereign: true,
    createdAt: '2026-09-18',
    manifest: {
      name: 'Order 39 Urgent Injunction Drafter',
      version: '2.1.0',
      description: 'Commercial Courts Act Order 39 interim stay motions with 3-prong test (prima facie case, balance of convenience, irreparable injury) and Rule 3 compliance undertaking.',
      triggers: ['/cpc-order39', '/cca-interim-relief', '/stay-motion'],
      allowSubagents: false,
      rulesList: [
        'CPC_O39_PRONG: Mandatory articulation of the 3-Prong equitable injunction test',
        'ORDER39_RULE3_UNDERTAKING: Formulate explicit undertaking to deliver copies within 24 hours',
        'STATEMENT_OF_TRUTH: Append Section 63 BSA / 65B EA electronic evidence affirmation'
      ],
      systemPromptSnippet: `You are an elite Commercial Litigation Associate drafting Urgent Interim Injunction Applications under CPC Order 39 Rules 1 & 2 read with Section 151 and Commercial Courts Act, 2015.
Structure every filing strictly with:
- Part A: Brief facts establishing urgent irreparable injury
- Part B: The 3-Prong Equitable Test
- Part C: Order 39 Rule 3 Compliance Undertaking
- Part D: Interim Prayer and Ex-Parte Injunction`,
    }
  },
  {
    id: 'agent-3',
    name: 'IBC Form C Financial Creditor Claim Verifier',
    slug: 'ibc-form-c-claim-verifier',
    version: '1.2.0',
    author: 'Priya Sharma, IP',
    firm: 'Resolution Partners LLP',
    chamberId: 'CHAMBER-MUM-042',
    archetype: 'ibc_claim_verifier',
    archetypeLabel: 'IBC Creditor Claim Auditor',
    status: 'Official',
    modelTarget: 'Llama-3.2-3B (High Velocity)',
    boundVaults: ['ibc_2016', 'contract_act_1872'],
    downloadsCount: 840,
    adoptionPercentage: 58,
    riskTier: 'READ_ONLY',
    airGapSovereign: true,
    createdAt: '2026-09-22',
    manifest: {
      name: 'IBC Form C Financial Creditor Claim Verifier',
      version: '1.2.0',
      description: 'Automated claim admission ledger, compound interest recalculation, and formal disallowance memo generation.',
      triggers: ['/claim-verify', '/interest-recalc', '/disallowance-memo'],
      allowSubagents: true,
      rulesList: [
        'CIRP_REG_13: Calculate admitted vs disallowed claim within 7 days of receipt',
        'PENAL_INTEREST_CAP: Recalculate and strip uncontracted penal compounding',
        'VOTING_SHARE_FORMULA: Update CoC voting share dynamically upon admission changes'
      ],
      systemPromptSnippet: `You are the IBC Claims Adjudication Specialist.
Audit incoming Form C creditor filings against sanction letters, promissory notes, and NeSL record of default.
Enforce strict separation between:
1. Principal debt claimed vs verified
2. Contractual interest vs uncontracted penal compounding
3. Security interest charge registration under Section 77 Companies Act, 2013`,
    }
  },
  {
    id: 'agent-4',
    name: 'Section 29A 10-Gate Statutory Eligibility Inquest',
    slug: 'sec29a-eligibility-inquest',
    version: '1.0.4',
    author: 'Forensic Legal Bureau',
    firm: 'National Chamber Network',
    chamberId: 'CHAMBER-IN-101',
    archetype: 'sec29a_eligibility_inquest',
    archetypeLabel: 'Section 29A Eligibility Inquest',
    status: 'Community',
    modelTarget: 'DeepSeek-R1-7B (Local Q4_K_M)',
    boundVaults: ['ibc_2016', 'companies_act_2013'],
    downloadsCount: 520,
    adoptionPercentage: 35,
    riskTier: 'READ_ONLY',
    airGapSovereign: true,
    createdAt: '2026-09-28',
    manifest: {
      name: 'Section 29A 10-Gate Statutory Eligibility Inquest',
      version: '1.0.4',
      description: 'Resolution applicant multi-registry due diligence across MCA-21, CIBIL/CRILC defaulters, and connected persons corporate topology.',
      triggers: ['/sec29a-audit', '/connected-persons', '/wilful-defaulter'],
      allowSubagents: true,
      rulesList: [
        'SEC29A_10_GATES: Sequentially audit clauses (a) through (j) with zero omitted gates',
        'CONNECTED_PERSON_TRAIL: Traverse holding, subsidiary, associate, and joint ventures',
        'DISQUALIFICATION_CERT: Emit formal Section 29A Compliance Audit Dossier'
      ],
      systemPromptSnippet: `You are the Section 29A Statutory Inquest Officer.
Audit prospective resolution applicants against the 10 statutory disqualification gates of Section 29A IBC:
(a) Undischarged insolvent
(b) Wilful defaulter (RBI guidelines)
(c) NPA classification > 1 year
(d) Convicted of offences >= 2 years
(e) Disqualified director under Section 164 Companies Act
(f) Prohibited by SEBI
(g) Avoidance transaction promoter
(h) Enforceable guarantee guarantor
(i) Subject to disability under foreign law
(j) Connected person to any of clauses (a)-(i)`,
    }
  },
  {
    id: 'agent-5',
    name: 'NCLAT Appeal Memo Drafter',
    slug: 'nclat-appeal-drafter',
    version: '0.9.2',
    author: 'Adv. Rajesh Mehra',
    firm: 'Mehra & Co. Advocates',
    chamberId: 'CHAMBER-DL-033',
    archetype: 'custom_coworker',
    archetypeLabel: 'Custom Legal Coworker',
    status: 'Under Review',
    modelTarget: 'DeepSeek-R1-7B (Local Q4_K_M)',
    boundVaults: ['ibc_2016', 'cpc_1908'],
    downloadsCount: 65,
    adoptionPercentage: 8,
    riskTier: 'WRITE_LOCAL',
    airGapSovereign: true,
    createdAt: '2026-10-02',
    manifest: {
      name: 'NCLAT Appeal Memo Drafter',
      version: '0.9.2',
      description: 'Section 61 Appellate Tribunal appeal grounds formatting with strict limitation period calculation and condonation of delay petitions.',
      triggers: ['/nclat-appeal', '/limitation-memo', '/delay-condonation'],
      allowSubagents: false,
      rulesList: [
        'NCLAT_LIMITATION: 30 days statutory limitation from date of impugned order',
        'CONDONATION_WINDOW: Strictly flag beyond 15-day condonable extension window (§ 61(2))',
        'GROUNDS_SUBSTANTIAL_QUESTION: Frame questions of law distinguishing findings of fact'
      ],
      systemPromptSnippet: `Draft Form NCLAT-1 memorandum of appeal under Section 61 IBC against the impugned order of the Adjudicating Authority (NCLT).
Include standard index, dates and events synopsis, questions of law, grounds of appeal, and verification affidavit.`,
    }
  },
];

export default function AdminAgentsDirectoryPage() {
  const [agents, setAgents] = useState<CustomAgentAdmin[]>(initialAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [archetypeFilter, setArchetypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedAgent, setSelectedAgent] = useState<CustomAgentAdmin | null>(null);
  const [activeTab, setActiveTab] = useState<'manifest' | 'prompt' | 'rules' | 'vaults'>('manifest');
  
  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copiedTrigger, setCopiedTrigger] = useState<string | null>(null);

  const togglePromote = (id: string) => {
    setAgents(agents.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Official' ? 'Community' : 'Official';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const handleDownloadCartridge = (agent: CustomAgentAdmin) => {
    const payload = JSON.stringify(agent.manifest, null, 2);
    const blob = new Blob([payload], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agent.slug}-v${agent.version}.haya`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTrigger(text);
    setTimeout(() => setCopiedTrigger(null), 1800);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArchetype = archetypeFilter === 'ALL' || agent.archetype === archetypeFilter;
    const matchesStatus = statusFilter === 'ALL' || agent.status === statusFilter;
    return matchesSearch && matchesArchetype && matchesStatus;
  });

  const totalDownloads = agents.reduce((acc, a) => acc + a.downloadsCount, 0);
  const officialCount = agents.filter(a => a.status === 'Official').length;

  const getArchetypeConfig = (arch: string) => {
    switch (arch) {
      case 'avoidance_forensic_auditor':
        return {
          icon: ShieldAlert,
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          badge: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30'
        };
      case 'commercial_injunction_drafter':
        return {
          icon: Scale,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          badge: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30'
        };
      case 'ibc_claim_verifier':
        return {
          icon: FileSpreadsheet,
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          badge: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
        };
      case 'sec29a_eligibility_inquest':
        return {
          icon: Fingerprint,
          color: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          badge: 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30'
        };
      default:
        return {
          icon: Bot,
          color: 'text-yellow-600 dark:text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          badge: 'bg-yellow-50 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30'
        };
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
              AGENT FOUNDRY GOVERNANCE
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
              In-Chamber Cartridge Ecosystem
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Air-Gap Sandboxed
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-amber-500" />
            Agent Cartridges & Foundry Moderation
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Govern custom legal coworkers, audit .haya cartridge manifests, enforce statutory prompt rules, and promote community agents to Official Chamber Templates.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>+ Upload .haya Cartridge</span>
          </button>
        </div>
      </div>

      {/* 4 Sovereign Foundry Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border hover:border-amber-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Total Agent Cartridges</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-foreground mt-2">{agents.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Across 5 Court Archetypes</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border hover:border-emerald-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Official Chamber Cartridges</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{officialCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Pre-installed in Desktop Harness</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border hover:border-blue-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Total .haya Deliveries</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <DownloadCloud className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-foreground mt-2">{totalDownloads.toLocaleString()}</div>
          <div className="text-xs text-emerald-500/80 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            +24.1% monthly adoption
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border hover:border-purple-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Most Active Archetype</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-foreground mt-2 truncate">Avoidance Auditor</div>
          <div className="text-xs text-muted-foreground mt-1">1,240 Chamber Installs (82%)</div>
        </div>
      </div>

      {/* Unified Filter Strip & Archetype Switcher */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by agent name, author, firm, or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 shadow-sm"
            />
          </div>

          {/* Status Tab Group */}
          <div className="flex items-center gap-1.5 bg-card border border-border p-1.5 rounded-xl self-start lg:self-auto shadow-sm">
            {(['ALL', 'Official', 'Community', 'Under Review'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Archetype Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setArchetypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all border ${
              archetypeFilter === 'ALL'
                ? 'bg-foreground text-background border-foreground font-bold'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            All 5 Court Archetypes
          </button>

          <button
            onClick={() => setArchetypeFilter('avoidance_forensic_auditor')}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
              archetypeFilter === 'avoidance_forensic_auditor'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            Avoidance Forensic Auditor
          </button>

          <button
            onClick={() => setArchetypeFilter('commercial_injunction_drafter')}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
              archetypeFilter === 'commercial_injunction_drafter'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-bold'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            Commercial Injunction Drafter
          </button>

          <button
            onClick={() => setArchetypeFilter('ibc_claim_verifier')}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
              archetypeFilter === 'ibc_claim_verifier'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            IBC Creditor Claim Auditor
          </button>

          <button
            onClick={() => setArchetypeFilter('sec29a_eligibility_inquest')}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
              archetypeFilter === 'sec29a_eligibility_inquest'
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 font-bold'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
            Section 29A Eligibility Inquest
          </button>

          <button
            onClick={() => setArchetypeFilter('custom_coworker')}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
              archetypeFilter === 'custom_coworker'
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 font-bold'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-yellow-400" />
            Custom Coworker
          </button>
        </div>
      </div>

      {/* Agents Master Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-muted/50 border-b border-border text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-4 min-w-[280px]">Agent & .haya Cartridge</th>
                <th className="px-5 py-4 min-w-[170px]">Author & Chamber</th>
                <th className="px-5 py-4 min-w-[180px]">Archetype & Security</th>
                <th className="px-5 py-4 min-w-[130px]">Bound Vaults</th>
                <th className="px-5 py-4 min-w-[120px]">Adoption</th>
                <th className="px-5 py-4 min-w-[100px]">Status</th>
                <th className="px-5 py-4 min-w-[200px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAgents.map((agent) => {
                const arch = getArchetypeConfig(agent.archetype);
                const IconComponent = arch.icon;
                return (
                  <tr key={agent.id} className="hover:bg-muted/20 transition-colors group">
                    {/* Column 1: Agent & Cartridge */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl ${arch.bg} border ${arch.border} flex items-center justify-center shrink-0 shadow-sm mt-0.5`}>
                          <IconComponent className={`w-5 h-5 ${arch.color}`} />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground hover:text-amber-500 transition-colors cursor-pointer" onClick={() => setSelectedAgent(agent)}>
                              {agent.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                              v{agent.version}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                              .{agent.slug}.haya Cartridge
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
                              {agent.modelTarget.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Author & Chamber */}
                    <td className="px-5 py-3.5">
                      <div className="text-xs font-semibold text-foreground">{agent.author}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{agent.firm}</div>
                      <div className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">{agent.chamberId}</div>
                    </td>

                    {/* Column 3: Archetype & Security */}
                    <td className="px-5 py-3.5">
                      <div className="space-y-1.5">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 font-semibold border ${arch.badge}`}>
                          <IconComponent className="w-3 h-3" />
                          {agent.archetypeLabel}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                            Air-Gap Sovereign
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                            {agent.riskTier}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 4: Bound Vaults */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {agent.boundVaults.map(v => (
                          <span key={v} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Column 5: Adoption */}
                    <td className="px-5 py-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-foreground">{agent.downloadsCount.toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground">{agent.adoptionPercentage}%</span>
                        </div>
                        <div className="w-24 bg-muted h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full rounded-full transition-all"
                            style={{ width: `${agent.adoptionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Column 6: Status */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border ${
                        agent.status === 'Official' 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : agent.status === 'Community'
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {agent.status === 'Official' && <Award className="w-3 h-3" />}
                        {agent.status === 'Under Review' && <Clock className="w-3 h-3" />}
                        {agent.status}
                      </span>
                    </td>

                    {/* Column 7: Moderation Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownloadCartridge(agent)}
                          title="Download .haya Cartridge"
                          className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-all border border-border"
                        >
                          <FileDown className="w-3.5 h-3.5 text-amber-500" />
                        </button>

                        <button
                          onClick={() => setSelectedAgent(agent)}
                          className="px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1 transition-all border border-border"
                        >
                          <Eye className="w-3 h-3 text-blue-400" />
                          <span>Inspect Manifest</span>
                        </button>

                        <button
                          onClick={() => togglePromote(agent.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                            agent.status === 'Official'
                              ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700'
                              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                          }`}
                        >
                          <Award className="w-3 h-3" />
                          <span>{agent.status === 'Official' ? 'Demote to Community' : 'Promote to Official Template'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Cartridge Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <UploadCloud className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Import .haya Cartridge</h3>
                  <p className="text-xs text-muted-foreground">Upload and audit an in-chamber agent bundle</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                dragActive 
                  ? 'border-amber-500 bg-amber-500/5' 
                  : 'border-border hover:border-amber-500/50 bg-muted/20'
              }`}
            >
              <FileDown className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <div className="text-sm font-semibold text-foreground">Drag and drop your .haya file here</div>
              <div className="text-xs text-muted-foreground mt-1">Must contain manifest.json, system_prompt.md, and rules.json</div>
              <button className="mt-4 px-4 py-2 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 border border-border">
                Browse Files
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-border/80 text-xs space-y-1.5 font-mono">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Cloud Exfiltration Verification: Guaranteed</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Integrity: SHA-256 Checksum Computed upon Ingest</span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Demo: Cartridge uploaded and verified into chamber foundry.');
                  setIsUploadOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold"
              >
                Publish to Chamber Foundry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Dossier / Manifest Inspector */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-end p-0">
          <div className="bg-card border-l border-border w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slideLeft overflow-hidden">
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3.5">
                {(() => {
                  const arch = getArchetypeConfig(selectedAgent.archetype);
                  const Icon = arch.icon;
                  return (
                    <div className={`w-12 h-12 rounded-xl ${arch.bg} border ${arch.border} flex items-center justify-center shadow-md`}>
                      <Icon className={`w-6 h-6 ${arch.color}`} />
                    </div>
                  );
                })()}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground">{selectedAgent.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      v{selectedAgent.version}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {selectedAgent.manifest.name} • {selectedAgent.chamberId}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-3 gap-2 px-6 py-3 bg-muted/40 border-b border-border text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Author</span>
                <span className="font-semibold text-foreground truncate block">{selectedAgent.author}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Model Target</span>
                <span className="font-semibold text-foreground truncate block">{selectedAgent.modelTarget.split(' ')[0]}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Status</span>
                <span className="font-semibold text-emerald-400 block">{selectedAgent.status}</span>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-border px-6 bg-muted/20 text-xs">
              <button
                onClick={() => setActiveTab('manifest')}
                className={`py-3 px-3 font-semibold border-b-2 transition-all ${
                  activeTab === 'manifest'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Manifest (JSON)
              </button>
              <button
                onClick={() => setActiveTab('prompt')}
                className={`py-3 px-3 font-semibold border-b-2 transition-all ${
                  activeTab === 'prompt'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                System Directive & Skeletons
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`py-3 px-3 font-semibold border-b-2 transition-all ${
                  activeTab === 'rules'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Rules & Guardrails
              </button>
              <button
                onClick={() => setActiveTab('vaults')}
                className={`py-3 px-3 font-semibold border-b-2 transition-all ${
                  activeTab === 'vaults'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Statutory Vaults
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {activeTab === 'manifest' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                      manifest.json
                    </span>
                    <button
                      onClick={() => copyText(JSON.stringify(selectedAgent.manifest, null, 2))}
                      className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      {copiedTrigger === JSON.stringify(selectedAgent.manifest, null, 2) ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-border font-mono text-[11px] text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre">
                    {JSON.stringify(selectedAgent.manifest, null, 2)}
                  </pre>
                </div>
              )}

              {activeTab === 'prompt' && (
                <div className="space-y-3">
                  <div className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-500" />
                    <span>Primary Directive & Skeleton Prompt</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-border font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedAgent.manifest.systemPromptSnippet}
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-3">
                  <div className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Statutory Audit Rules (rules.json)</span>
                  </div>
                  <div className="space-y-2">
                    {selectedAgent.manifest.rulesList.map((r, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-border font-mono text-xs text-foreground flex items-start gap-2">
                        <span className="w-4 h-4 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <div className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider mb-2">
                      Registered Monaco Slash Triggers
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.manifest.triggers.map(trig => (
                        <span key={trig} className="px-2.5 py-1 rounded bg-slate-950 border border-amber-500/30 text-amber-400 font-mono text-xs">
                          {trig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vaults' && (
                <div className="space-y-3">
                  <div className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                    Bound India Code Bare Act Vaults
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedAgent.boundVaults.map(v => (
                      <div key={v} className="p-3 rounded-lg bg-slate-950 border border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-500" />
                          <span className="font-mono text-xs text-foreground font-bold">{v}.cartridge.enc</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          AES-256 Chambered
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-border bg-muted/20 flex items-center justify-between">
              <button
                onClick={() => handleDownloadCartridge(selectedAgent)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Download .haya Cartridge</span>
              </button>

              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
