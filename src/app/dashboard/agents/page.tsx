// admin-panel/src/app/dashboard/agents/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  DownloadCloud, 
  Plus, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Code2
} from 'lucide-react';
import { courtArchetypes } from '@/components/agents/archetypes';
import { ArchetypeCard } from '@/components/agents/ArchetypeCard';

const mockExistingAgents = [
  {
    id: 'agt_001',
    name: 'Section 43 Avoidance Auditor',
    archetype: 'avoidance_auditor',
    version: '1.0.0',
    vaults: ['bare_ibc.vault', 'cirp_regs.vault'],
    slashTrigger: '/avoidance-inquest',
    downloads: 14,
    updatedAt: '2 hours ago',
    status: 'ACTIVE',
  },
  {
    id: 'agt_002',
    name: 'Commercial Injunction Drafter',
    archetype: 'commercial_pleading',
    version: '1.1.0',
    vaults: ['commercial_courts.vault', 'cpc_1908.vault'],
    slashTrigger: '/cpc-order39',
    downloads: 8,
    updatedAt: 'Yesterday',
    status: 'ACTIVE',
  },
];

export default function AgentRegistryPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
              AGENT STUDIO
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
              Harness Dockable (.haya)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Agent Studio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build, configure, and compile autonomous legal agents into portable <code className="text-amber-500">.haya</code> packages that dock directly into your sovereign desktop harness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/agents/builder?archetype=custom_chamber"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Agent</span>
          </Link>
        </div>
      </div>

      {/* Section 1: Starter Archetypes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Chamber Starter Archetypes
            </h2>
            <p className="text-xs text-muted-foreground">
              Select an archetype to pre-load statutory prompts, bare act vaults, and Monaco slash triggers into the builder.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courtArchetypes.map((archetype) => (
            <ArchetypeCard key={archetype.key} archetype={archetype} />
          ))}
        </div>
      </div>

      {/* Section 2: Active Chamber Agents */}
      <div className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-500" />
            Active Chamber Agents
            <span className="text-xs font-normal text-muted-foreground">({mockExistingAgents.length} Agents Configured)</span>
          </h2>
          <Link href="/dashboard/my-assets" className="text-xs text-amber-500 hover:underline">
            View All in Sovereign Inventory →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Agent Name</th>
                <th className="pb-3 font-semibold">Archetype</th>
                <th className="pb-3 font-semibold">Slash Trigger</th>
                <th className="pb-3 font-semibold">Vaults</th>
                <th className="pb-3 font-semibold">Downloads</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {mockExistingAgents.map((agt) => (
                <tr key={agt.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[10px]">
                        🪙
                      </div>
                      <span>{agt.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                        v{agt.version}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground font-mono">{agt.archetype}</td>
                  <td className="py-3 text-amber-400 font-mono">{agt.slashTrigger}</td>
                  <td className="py-3">
                    <div className="flex gap-1 flex-wrap">
                      {agt.vaults.map((v) => (
                        <span key={v} className="text-[10px] font-mono bg-secondary px-1.5 py-0.5 rounded text-foreground">
                          {v.replace('.vault', '')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground font-mono">{agt.downloads} downloads</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/agents/builder?edit=${agt.id}`}
                        className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors"
                      >
                        Edit in Studio
                      </Link>
                      <button
                        onClick={() => alert(`Downloading ${agt.name} .haya cartridge`)}
                        className="p-1 rounded hover:bg-secondary text-amber-500 transition-colors"
                        title="Download .haya package"
                      >
                        <DownloadCloud className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
