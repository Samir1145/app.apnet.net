// admin-panel/src/app/dashboard/agents/builder/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  DownloadCloud, 
  Save, 
  Sparkles, 
  Bot, 
  Check, 
  Layers
} from 'lucide-react';
import { courtArchetypes } from '@/components/agents/archetypes';
import { BuilderAccordion, AgentBuilderState } from '@/components/agents/BuilderAccordion';
import { SandboxCanvas } from '@/components/agents/SandboxCanvas';

function BuilderContent() {
  const searchParams = useSearchParams();
  const archetypeKey = searchParams.get('archetype') || 'custom_chamber';

  const selectedArchetype = courtArchetypes.find(a => a.key === archetypeKey) || courtArchetypes[4];

  const [state, setState] = useState<AgentBuilderState>({
    name: selectedArchetype.title,
    slug: selectedArchetype.key.replace(/_/g, '-'),
    description: selectedArchetype.description,
    archetype: selectedArchetype.key,
    version: '1.0.0',
    medallionColor: '#f59e0b',
    modelEngine: 'local_llama_r1',
    reasoningEffort: 'high',
    verbosity: 'standard',
    allowSubagents: selectedArchetype.subagentsEnabled,
    criticAgent: selectedArchetype.criticAgent || 'forms_agent',
    maxCritiqueTurns: 2,
    statutoryVaults: selectedArchetype.defaultVaults,
    slashTrigger: selectedArchetype.slashTrigger,
    systemPrompt: selectedArchetype.systemPrompt,
    templateSkeleton: selectedArchetype.templateSkeleton,
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleUpdate = (updates: Partial<AgentBuilderState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleCompileAndDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/v1/agents/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      if (!res.ok) {
        throw new Error('Build failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.slug || 'agent'}-v${state.version}.haya`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      alert(`Compilation error: ${err}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Action Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/agents"
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {state.name}
              </h1>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                v{state.version}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configuring Sovereign Agent Cartridge • Archetype: <span className="font-mono text-amber-400">{state.archetype}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => alert('Agent draft state saved locally.')}
            className="px-3.5 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs flex items-center gap-1.5 border border-border transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleCompileAndDownload}
            disabled={isDownloading}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm shadow-amber-500/20"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Downloaded .haya!</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4" />
                <span>{isDownloading ? 'Compiling Cartridge...' : 'Compile & Download .haya'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Split-Screen Studio Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Configuration Accordion */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cartridge Parameters
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {state.statutoryVaults.length} Vaults Selected
            </span>
          </div>
          <BuilderAccordion state={state} onChange={handleUpdate} />
        </div>

        {/* Right Column: Sandbox Canvas */}
        <div className="h-[750px] sticky top-6">
          <SandboxCanvas state={state} />
        </div>
      </div>
    </div>
  );
}

export default function AgentBuilderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Sovereign Agent Studio...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
