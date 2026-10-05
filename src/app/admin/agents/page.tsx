'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  DownloadCloud, 
  Search, 
  Filter, 
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
  AlertTriangle
} from 'lucide-react';

interface CustomAgentAdmin {
  id: string;
  name: string;
  slug: string;
  version: string;
  author: string;
  firm: string;
  archetype: 'avoidance_forensic_auditor' | 'commercial_injunction_drafter' | 'ibc_claim_verifier' | 'sec29a_eligibility_inquest' | 'custom_coworker';
  archetypeLabel: string;
  status: 'Official' | 'Community' | 'Under Review';
  modelTarget: string;
  boundVaults: string[];
  downloadsCount: number;
  rating: number;
  createdAt: string;
  manifest: {
    name: string;
    version: string;
    description: string;
    triggers: string[];
    allowSubagents: boolean;
    systemPromptSnippet: string;
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
    archetype: 'avoidance_forensic_auditor',
    archetypeLabel: 'Avoidance Forensic Auditor',
    status: 'Official',
    modelTarget: 'DeepSeek-R1-7B (Local Q4_K_M)',
    boundVaults: ['ibc_2016', 'cpc_1908'],
    downloadsCount: 1240,
    rating: 4.9,
    createdAt: '2026-09-12',
    manifest: {
      name: 'Section 43/66 Avoidance Inquest Auditor',
      version: '1.4.0',
      description: 'Air-gapped forensic cash flow reconciliation and preferential/fraudulent transaction inquest.',
      triggers: ['/avoidance-audit', '/lookback-reconcile'],
      allowSubagents: true,
      systemPromptSnippet: 'You are the Avoidance Audit Specialist for in-chamber IBC proceedings. Audit bank statements and ledger trails for lookback period transactions (§§ 43, 45, 50, 66)...',
    }
  },
  {
    id: 'agent-2',
    name: 'Order 39 Urgent Injunction Drafter',
    slug: 'order39-injunction-drafter',
    version: '2.1.0',
    author: 'K. S. Narayanan, Senior Counsel',
    firm: 'Commercial Bar Chambers, Delhi',
    archetype: 'commercial_injunction_drafter',
    archetypeLabel: 'Commercial Injunction Drafter',
    status: 'Official',
    modelTarget: 'Llama-3.2-3B (High Velocity)',
    boundVaults: ['cpc_1908', 'commercial_courts_2015', 'specific_relief_1963'],
    downloadsCount: 980,
    rating: 4.8,
    createdAt: '2026-09-18',
    manifest: {
      name: 'Order 39 Urgent Injunction Drafter',
      version: '2.1.0',
      description: 'Commercial Courts Act Order 39 interim stay motions with 3-prong test and Rule 3 compliance.',
      triggers: ['/cpc-order39', '/cca-interim-relief'],
      allowSubagents: false,
      systemPromptSnippet: 'You are an elite Commercial Litigation Associate drafting Urgent Interim Injunction Applications under CPC Order 39 Rules 1 & 2...',
    }
  },
  {
    id: 'agent-3',
    name: 'IBC Form C Financial Creditor Claim Verifier',
    slug: 'ibc-form-c-claim-verifier',
    version: '1.2.0',
    author: 'Priya Sharma, IP',
    firm: 'Resolution Partners LLP',
    archetype: 'ibc_claim_verifier',
    archetypeLabel: 'IBC Creditor Claim Auditor',
    status: 'Official',
    modelTarget: 'Llama-3.2-3B (High Velocity)',
    boundVaults: ['ibc_2016', 'contract_act_1872'],
    downloadsCount: 840,
    rating: 4.9,
    createdAt: '2026-09-22',
    manifest: {
      name: 'IBC Form C Financial Creditor Claim Verifier',
      version: '1.2.0',
      description: 'Automated claim admission ledger, interest recalculation, and disallowance notes.',
      triggers: ['/claim-verify', '/interest-recalc'],
      allowSubagents: true,
      systemPromptSnippet: 'You are the IBC Claims Adjudication Assistant. Audit incoming Form C filings against loan sanction letters and ledger balances...',
    }
  },
  {
    id: 'agent-4',
    name: 'Section 29A 10-Gate Statutory Eligibility Inquest',
    slug: 'sec29a-eligibility-inquest',
    version: '1.0.4',
    author: 'Forensic Legal Bureau',
    firm: 'National Chamber Network',
    archetype: 'sec29a_eligibility_inquest',
    archetypeLabel: 'Section 29A Eligibility Inquest',
    status: 'Community',
    modelTarget: 'DeepSeek-R1-7B (Local Q4_K_M)',
    boundVaults: ['ibc_2016', 'companies_act_2013'],
    downloadsCount: 520,
    rating: 4.7,
    createdAt: '2026-09-28',
    manifest: {
      name: 'Section 29A 10-Gate Statutory Eligibility Inquest',
      version: '1.0.4',
      description: 'Resolution applicant multi-registry due diligence across MCA, CIBIL, and SEBI debarment.',
      triggers: ['/sec29a-audit', '/connected-persons'],
      allowSubagents: true,
      systemPromptSnippet: 'You are the Section 29A Compliance Officer. Execute the 10 statutory disqualification gates (clauses a through j)...',
    }
  },
  {
    id: 'agent-5',
    name: 'NCLAT Appeal Memo Drafter',
    slug: 'nclat-appeal-drafter',
    version: '0.9.2',
    author: 'Rajesh Mehra',
    firm: 'Mehra & Co.',
    archetype: 'custom_coworker',
    archetypeLabel: 'Custom Legal Coworker',
    status: 'Under Review',
    modelTarget: 'DeepSeek-R1-7B (Local Q4_K_M)',
    boundVaults: ['ibc_2016', 'nclat_rules'],
    downloadsCount: 65,
    rating: 4.5,
    createdAt: '2026-10-02',
    manifest: {
      name: 'NCLAT Appeal Memo Drafter',
      version: '0.9.2',
      description: 'Section 61 Appellate Tribunal appeal grounds formatting with limitation period calculation.',
      triggers: ['/nclat-appeal', '/limitation-memo'],
      allowSubagents: false,
      systemPromptSnippet: 'Draft Form NCLAT-1 memorandum of appeal under Section 61 IBC...',
    }
  },
];

export default function AdminAgentsDirectoryPage() {
  const [agents, setAgents] = useState<CustomAgentAdmin[]>(initialAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [archetypeFilter, setArchetypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedAgent, setSelectedAgent] = useState<CustomAgentAdmin | null>(null);

  const togglePromote = (id: string) => {
    setAgents(agents.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Official' ? 'Community' : 'Official';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.firm.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArchetype = archetypeFilter === 'ALL' || agent.archetype === archetypeFilter;
    const matchesStatus = statusFilter === 'ALL' || agent.status === statusFilter;
    return matchesSearch && matchesArchetype && matchesStatus;
  });

  const totalDownloads = agents.reduce((acc, a) => acc + a.downloadsCount, 0);
  const officialCount = agents.filter(a => a.status === 'Official').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
              AGENT FOUNDRY GOVERNANCE
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/15 text-purple-400">
              In-Chamber Cartridge Ecosystem
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bot className="w-6 h-6 text-amber-500" />
            Agent Cartridges & Foundry Moderation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Govern custom legal coworkers, audit `.haya` cartridge manifests, and promote community agents to Official Chamber Templates.
          </p>
        </div>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-medium">Total Agent Cartridges</span>
            <Bot className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{agents.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Across 5 Court Archetypes</div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-medium">Official Chamber Cartridges</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{officialCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Pre-installed in Desktop Harness</div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-medium">Total .haya Deliveries</span>
            <DownloadCloud className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{totalDownloads.toLocaleString()}</div>
          <div className="text-xs text-emerald-500/80 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +24.1% monthly adoption
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-medium">Most Active Archetype</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-foreground mt-2 truncate">Avoidance Auditor</div>
          <div className="text-xs text-muted-foreground mt-1">1,240 Chamber Installs</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search agents by name, author, or law firm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-lg">
            {(['ALL', 'Official', 'Community', 'Under Review'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>

          {/* Archetype dropdown */}
          <select
            value={archetypeFilter}
            onChange={(e) => setArchetypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All 5 Court Archetypes</option>
            <option value="avoidance_forensic_auditor">Avoidance Forensic Auditor</option>
            <option value="commercial_injunction_drafter">Commercial Injunction Drafter</option>
            <option value="ibc_claim_verifier">IBC Creditor Claim Auditor</option>
            <option value="sec29a_eligibility_inquest">Section 29A Eligibility Inquest</option>
            <option value="custom_coworker">Custom Legal Coworker</option>
          </select>
        </div>
      </div>

      {/* Agents Master Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
              <tr>
                <th className="px-6 py-3.5">Agent Name & Version</th>
                <th className="px-6 py-3.5">Author & Firm</th>
                <th className="px-6 py-3.5">Archetype</th>
                <th className="px-6 py-3.5">Bound Vaults</th>
                <th className="px-6 py-3.5">Downloads</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          {agent.name}
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            v{agent.version}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                          .{agent.slug}.haya Cartridge
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-foreground">{agent.author}</div>
                    <div className="text-[11px] text-muted-foreground">{agent.firm}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {agent.archetypeLabel}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {agent.boundVaults.map(v => (
                        <span key={v} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {v}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-mono text-xs text-foreground font-semibold">
                    {agent.downloadsCount.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      agent.status === 'Official' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : agent.status === 'Community'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {agent.status === 'Official' && <Award className="w-3 h-3" />}
                      {agent.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-foreground text-xs font-medium flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect Manifest
                      </button>

                      <button
                        onClick={() => togglePromote(agent.id)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                          agent.status === 'Official'
                            ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        {agent.status === 'Official' ? 'Demote to Community' : 'Promote to Official Template'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manifest Inspection Drawer / Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{selectedAgent.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    Cartridge Manifest (.haya) • Author: {selectedAgent.author} ({selectedAgent.firm})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-muted/40 border border-border">
                  <span className="text-muted-foreground block mb-1">Target AI Engine</span>
                  <span className="font-semibold text-foreground">{selectedAgent.modelTarget}</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 border border-border">
                  <span className="text-muted-foreground block mb-1">Subagent Delegation</span>
                  <span className="font-semibold text-foreground">
                    {selectedAgent.manifest.allowSubagents ? 'Enabled (FormsAgent / Auditor)' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Registered Monaco Slash Triggers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.manifest.triggers.map(trig => (
                    <span key={trig} className="px-2.5 py-1 rounded-md bg-slate-900 border border-amber-500/30 text-amber-400 font-mono text-xs">
                      {trig}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-amber-500" />
                  System Prompt Directive (Primary Skeleton)
                </h4>
                <div className="p-4 rounded-xl bg-slate-950 border border-border font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedAgent.manifest.systemPromptSnippet}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Bound Bare Act Vaults
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.boundVaults.map(v => (
                    <span key={v} className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono">
                      {v}.cartridge.enc
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Integrity: SHA-256 Validated • Format: ZIP (.haya)
              </span>
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-all"
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
