// admin-panel/src/components/agents/SandboxCanvas.tsx
'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Code2, 
  Send, 
  UploadCloud, 
  FileText, 
  Check, 
  Copy, 
  Bot, 
  User, 
  Play,
  Sparkles
} from 'lucide-react';
import { AgentBuilderState } from './BuilderAccordion';

interface SandboxCanvasProps {
  state: AgentBuilderState;
}

interface Message {
  role: 'user' | 'agent';
  content: string;
}

export function SandboxCanvas({ state }: SandboxCanvasProps) {
  const [activeTab, setActiveTab] = useState<'simulator' | 'manifest'>('simulator');
  const [sampleDoc, setSampleDoc] = useState<string>('demo_nclt_admission.pdf');
  const [inputPrompt, setInputPrompt] = useState<string>('Audit the financial ledgers for contra-sweeps and preferentials during the look-back window.');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      content: `🏛️ Sovereign Agent "${state.name}" initialized. Bound to ${state.statutoryVaults.length} bare act vaults. Drop a case file or run a simulation prompt below.`,
    }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);

  const manifestJson = JSON.stringify({
    "$schema": "https://hayagriva.legal/schemas/cartridge-v1.json",
    "id": `agent-${state.slug || 'custom'}-v${state.version}`,
    "slug": state.slug,
    "name": state.name,
    "version": state.version,
    "archetype": state.archetype,
    "icon": {
      "type": "svg",
      "color": state.medallionColor,
      "background": "#18181b"
    },
    "runtime": {
      "engine": state.modelEngine,
      "reasoningEffort": state.reasoningEffort,
      "contextBudgetTokens": 8192
    },
    "statutoryVaults": state.statutoryVaults,
    "delegation": {
      "allowSubagents": state.allowSubagents,
      "criticSubagent": state.criticAgent,
      "maxCritiqueTurns": state.maxCritiqueTurns
    },
    "editorTriggers": [
      {
        "trigger": state.slashTrigger,
        "label": state.name,
        "template": "templates/primary_skeleton.md"
      }
    ],
    "compiledAt": new Date().toISOString()
  }, null, 2);

  const copyManifest = () => {
    navigator.clipboard.writeText(manifestJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSimulation = () => {
    if (!inputPrompt.trim() || isSimulating) return;

    const userText = inputPrompt;
    setInputPrompt('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsSimulating(true);

    setTimeout(() => {
      let agentReply = '';
      if (state.archetype === 'avoidance_auditor') {
        agentReply = `[Forensic Analysis via ${state.statutoryVaults.join(', ')}]:\n\n1. Analyzed ${sampleDoc} against Section 43 look-back boundary (T-0: 2026-03-15).\n2. Contra-Sweep Flag: Identified 2 high-velocity circular transfers totalling ₹3.45 Crore to M/s Shanti Logistics on 2026-01-10.\n3. Statutory Breach: Satisfies Section 43(2)(a) preference criteria.\n\n[Subagent Critique: ${state.criticAgent}]: Verified look-back calculation. Generating draft avoidance application under trigger ${state.slashTrigger}.`;
      } else if (state.archetype === 'commercial_pleading') {
        agentReply = `[Commercial Courts Analysis]:\n\n1. Prima Facie Case established under Order XXXIX Rules 1 & 2.\n2. Urgency established: Defendant attempting dissipation of mortgaged asset.\n3. Drafted interim restraining injunction petition attaching compliant Statement of Truth under Order VI Rule 15A.`;
      } else {
        agentReply = `[Agent Simulation Output]:\n\nSuccessfully evaluated prompt against ${state.name} directive.\nSystem instruction executed with reasoning effort: ${state.reasoningEffort}.`;
      }

      setMessages(prev => [...prev, { role: 'agent', content: agentReply }]);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col rounded-xl border border-border bg-card overflow-hidden text-xs shadow-sm">
      {/* Top Tab Bar */}
      <div className="p-3 border-b border-border bg-secondary/30 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${activeTab === 'simulator' ? 'bg-amber-500 text-black shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Live Sandbox Simulator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manifest')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${activeTab === 'manifest' ? 'bg-amber-500 text-black shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Cartridge Manifest (.haya)</span>
          </button>
        </div>

        {activeTab === 'manifest' && (
          <button
            type="button"
            onClick={copyManifest}
            className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground font-mono text-[11px] flex items-center gap-1 border border-border transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        )}
      </div>

      {/* Tab 1: Simulator */}
      {activeTab === 'simulator' && (
        <div className="flex-1 flex flex-col p-4 justify-between space-y-4 overflow-hidden">
          {/* File Mock Ingestion Header */}
          <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-muted-foreground text-[11px]">Mock Ingest:</span>
              <span className="font-semibold text-foreground font-mono text-[11px] truncate">{sampleDoc}</span>
            </div>
            <select
              value={sampleDoc}
              onChange={(e) => setSampleDoc(e.target.value)}
              className="text-[11px] px-2 py-0.5 rounded bg-secondary border border-border text-foreground focus:outline-none"
            >
              <option value="demo_nclt_admission.pdf">demo_nclt_admission.pdf</option>
              <option value="bank_ledger_sbi_axis.xlsx">bank_ledger_sbi_axis.xlsx</option>
              <option value="commercial_contract_exhibit_a.docx">commercial_contract_exhibit_a.docx</option>
            </select>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'agent' && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 shadow-sm"
                    style={{ backgroundColor: state.medallionColor, color: '#000' }}
                  >
                    🪙
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[85%] whitespace-pre-line leading-relaxed text-xs shadow-sm ${m.role === 'user' ? 'bg-amber-500/15 border border-amber-500/30 text-foreground' : 'bg-secondary/60 border border-border text-foreground font-mono text-[11px]'}`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-[10px] shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {isSimulating && (
              <div className="flex items-center gap-2 text-xs text-amber-500 font-mono animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulating agent reasoning & subagent audit loop...</span>
              </div>
            )}
          </div>

          {/* Input Prompt Box */}
          <div className="pt-2 border-t border-border flex items-center gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendSimulation()}
              placeholder="Ask this agent to analyze facts, audit, or draft..."
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-secondary/30 text-foreground text-xs focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleSendSimulation}
              disabled={isSimulating}
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Test</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Cartridge Manifest */}
      {activeTab === 'manifest' && (
        <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] bg-secondary/20">
          <pre className="text-amber-400 leading-relaxed whitespace-pre-wrap">
            {manifestJson}
          </pre>
        </div>
      )}
    </div>
  );
}
