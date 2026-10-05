// admin-panel/src/components/agents/BuilderAccordion.tsx
'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Bot, 
  Cpu, 
  GitFork, 
  Database, 
  FileCode, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export interface AgentBuilderState {
  name: string;
  slug: string;
  description: string;
  archetype: string;
  version: string;
  medallionColor: string;
  modelEngine: string;
  reasoningEffort: string;
  verbosity: string;
  allowSubagents: boolean;
  criticAgent: string;
  maxCritiqueTurns: number;
  statutoryVaults: string[];
  slashTrigger: string;
  systemPrompt: string;
  templateSkeleton: string;
}

interface BuilderAccordionProps {
  state: AgentBuilderState;
  onChange: (updates: Partial<AgentBuilderState>) => void;
}

const availableVaults = [
  { id: 'bare_ibc.vault', name: 'Insolvency and Bankruptcy Code, 2016' },
  { id: 'cirp_regs.vault', name: 'IBBI CIRP Regulations, 2016' },
  { id: 'commercial_courts.vault', name: 'Commercial Courts Act, 2015' },
  { id: 'cpc_1908.vault', name: 'Code of Civil Procedure, 1908' },
  { id: 'companies_act.vault', name: 'Companies Act, 2013' },
  { id: 'ni_act.vault', name: 'Negotiable Instruments Act, 1881' },
];

export function BuilderAccordion({ state, onChange }: BuilderAccordionProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    identity: true,
    model: true,
    delegation: true,
    vaults: true,
    template: true,
  });

  const toggle = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleVaultToggle = (vaultId: string) => {
    const current = state.statutoryVaults;
    if (current.includes(vaultId)) {
      onChange({ statutoryVaults: current.filter(v => v !== vaultId) });
    } else {
      onChange({ statutoryVaults: [...current, vaultId] });
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Sovereign Identity */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('identity')}
          className="w-full p-4 flex items-center justify-between font-semibold text-foreground hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-500" />
            <span>1. Sovereign Identity & Medallion</span>
          </div>
          {openSections.identity ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.identity && (
          <div className="p-4 pt-0 space-y-3 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">Agent Name</label>
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/30 text-foreground focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Avoidance Inquest Auditor"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">Handle / Slug</label>
                <input
                  type="text"
                  value={state.slug}
                  onChange={(e) => onChange({ slug: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/30 text-foreground font-mono focus:outline-none focus:border-amber-500"
                  placeholder="e.g. avoidance-inquest"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">Chamber Description</label>
              <input
                type="text"
                value={state.description}
                onChange={(e) => onChange({ description: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/30 text-foreground focus:outline-none focus:border-amber-500"
                placeholder="Brief summary of agent's jurisdiction and capabilities"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Medallion Accent Color</span>
              <div className="flex items-center gap-2">
                {[
                  { color: '#f59e0b', name: 'Amber Gold' },
                  { color: '#10b981', name: 'Emerald' },
                  { color: '#3b82f6', name: 'Sapphire' },
                  { color: '#ef4444', name: 'Ruby' },
                  { color: '#a855f7', name: 'Amethyst' },
                ].map(c => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => onChange({ medallionColor: c.color })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${state.medallionColor === c.color ? 'scale-110 border-white' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Model & Reasoning Profile */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('model')}
          className="w-full p-4 flex items-center justify-between font-semibold text-foreground hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-500" />
            <span>2. Model & Reasoning Profile</span>
          </div>
          {openSections.model ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.model && (
          <div className="p-4 pt-0 space-y-3 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">Execution Engine</label>
                <select
                  value={state.modelEngine}
                  onChange={(e) => onChange({ modelEngine: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/30 text-foreground focus:outline-none focus:border-amber-500"
                >
                  <option value="local_llama_r1">Local Llamafile / DeepSeek-R1-7B (Sovereign)</option>
                  <option value="local_llama_3b">Local Llama-3.2-3B (Fast Drafter)</option>
                  <option value="cloud_byok_openai">Cloud BYOK: OpenAI GPT-4o / Astra</option>
                  <option value="cloud_byok_anthropic">Cloud BYOK: Claude 3.5 Sonnet</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">Reasoning Effort</label>
                <select
                  value={state.reasoningEffort}
                  onChange={(e) => onChange({ reasoningEffort: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/30 text-foreground focus:outline-none focus:border-amber-500"
                >
                  <option value="low">Low (Direct Drafting)</option>
                  <option value="medium">Medium (Standard Verification)</option>
                  <option value="high">High (Deep Forensic CoT & Statutory Inquest)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">System Instructions (Mandate)</label>
              <textarea
                rows={4}
                value={state.systemPrompt}
                onChange={(e) => onChange({ systemPrompt: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-border bg-secondary/30 text-foreground font-mono text-[11px] focus:outline-none focus:border-amber-500"
                placeholder="Define role, statutory bounds, and drafting behavior..."
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Subagents & Delegation */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('delegation')}
          className="w-full p-4 flex items-center justify-between font-semibold text-foreground hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-amber-500" />
            <span>3. Subagents & Delegation Loop</span>
          </div>
          {openSections.delegation ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.delegation && (
          <div className="p-4 pt-0 space-y-3 border-t border-border/50">
            <div className="flex items-center justify-between mt-3 p-3 rounded-lg bg-secondary/40 border border-border/60">
              <div>
                <span className="font-semibold text-foreground block">Allow Subagent Delegation</span>
                <span className="text-[11px] text-muted-foreground">
                  Let this agent delegate draft auditing and compliance checks to specialized subagents.
                </span>
              </div>
              <input
                type="checkbox"
                checked={state.allowSubagents}
                onChange={(e) => onChange({ allowSubagents: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {state.allowSubagents && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">Critic Auditor Agent</label>
                  <select
                    value={state.criticAgent}
                    onChange={(e) => onChange({ criticAgent: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/30 text-foreground focus:outline-none focus:border-amber-500"
                  >
                    <option value="forms_agent">FormsAgent (Statutory Compliance Audit)</option>
                    <option value="document_agent">DocumentAgent (Court Structure & Skeletons)</option>
                    <option value="advisor_agent">AdvisorAgent (Precedent & Case Law)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">Max Critique Turns</label>
                  <select
                    value={state.maxCritiqueTurns}
                    onChange={(e) => onChange({ maxCritiqueTurns: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/30 text-foreground focus:outline-none focus:border-amber-500"
                  >
                    <option value={1}>1 Pass (Fast Audit)</option>
                    <option value={2}>2 Passes (Deep Refinement)</option>
                    <option value={3}>3 Passes (Exhaustive Judicial Review)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Statutory Bare Act Vaults */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('vaults')}
          className="w-full p-4 flex items-center justify-between font-semibold text-foreground hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" />
            <span>4. Statutory Bare Act Vaults</span>
          </div>
          {openSections.vaults ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.vaults && (
          <div className="p-4 pt-0 space-y-2 border-t border-border/50">
            <p className="text-[11px] text-muted-foreground mt-3 mb-2">
              Select Bare Act Cartridges to bind to this agent's in-RAM memory:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableVaults.map((vault) => {
                const isSelected = state.statutoryVaults.includes(vault.id);
                return (
                  <label
                    key={vault.id}
                    onClick={() => handleVaultToggle(vault.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${isSelected ? 'bg-amber-500/10 border-amber-500/40 text-foreground' : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50'}`}
                  >
                    <div className="truncate mr-2">
                      <span className="font-semibold block truncate">{vault.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{vault.id}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-3.5 h-3.5 accent-amber-500 rounded"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. Practice Templates & Monaco Triggers */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('template')}
          className="w-full p-4 flex items-center justify-between font-semibold text-foreground hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-500" />
            <span>5. Practice Templates & Monaco Triggers</span>
          </div>
          {openSections.template ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.template && (
          <div className="p-4 pt-0 space-y-3 border-t border-border/50">
            <div className="mt-3">
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">Monaco Slash Trigger</label>
              <input
                type="text"
                value={state.slashTrigger}
                onChange={(e) => onChange({ slashTrigger: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-secondary/30 text-amber-400 font-mono focus:outline-none focus:border-amber-500"
                placeholder="/trigger-name"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">Court Skeleton Markdown</label>
              <textarea
                rows={5}
                value={state.templateSkeleton}
                onChange={(e) => onChange({ templateSkeleton: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-border bg-secondary/30 text-foreground font-mono text-[11px] focus:outline-none focus:border-amber-500"
                placeholder="Markdown drafting skeleton with {{PLACEHOLDERS}}..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
