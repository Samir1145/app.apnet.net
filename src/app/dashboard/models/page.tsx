// admin-panel/src/app/dashboard/models/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  DownloadCloud, 
  HardDrive, 
  Sparkles, 
  Check, 
  Copy, 
  Terminal, 
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  architecture: string;
  format: string;
  parameters: string;
  quantization: string;
  fileSize: string;
  recommendedRam: string;
  recommendedFor: string;
  destinationPath: string;
  sha256: string;
}

const models: AIModel[] = [
  {
    id: 'deepseek-r1-7b-q4',
    name: 'DeepSeek-R1-Distill-Qwen-7B (Sovereign Legal)',
    architecture: 'Qwen 2.5 / DeepSeek R1',
    format: 'GGUF',
    parameters: '7.6 Billion',
    quantization: 'Q4_K_M',
    fileSize: '4.68 GB',
    recommendedRam: '16 GB Unified Memory (or 8 GB with metal offload)',
    recommendedFor: 'Forensic Inquests, Section 43/66 Avoidance Analysis, Chain-of-Thought Auditing',
    destinationPath: '~/.hayagriva/models/DeepSeek-R1-7B-Q4_K_M.gguf',
    sha256: 'e8b31a529f0e4c1973b88e210a47bc3921ea029471b63ef19f2a4b88e10c73d4',
  },
  {
    id: 'llama-3.2-3b-q4',
    name: 'Llama-3.2-3B-Instruct (High Velocity Drafter)',
    architecture: 'Llama 3.2',
    format: 'GGUF',
    parameters: '3.2 Billion',
    quantization: 'Q4_K_M',
    fileSize: '2.02 GB',
    recommendedRam: '8 GB RAM',
    recommendedFor: 'Routine Chamber Notices, CoC Minutes Drafting, Form A Announcements',
    destinationPath: '~/.hayagriva/models/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
  },
  {
    id: 'bge-small-onnx',
    name: 'BGE-Small-EN-v1.5 Dense Embeddings',
    architecture: 'BERT Dense Vector',
    format: 'ONNX',
    parameters: '33 Million',
    quantization: 'FP32 / Quantized',
    fileSize: '133 MB',
    recommendedRam: '< 500 MB RAM',
    recommendedFor: 'Semantic Search, Legal Document Chunk Clustering & Vector Memory',
    destinationPath: '~/.hayagriva/models/bge-small-en-v1.5.onnx',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
  },
];

export default function ModelsHubPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
              BHARATGEN SOVEREIGN MODELS
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
              In-Harness Auto-Sync
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            BharatGen Models & Certified SLMs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Certified sovereign reasoning models and dense embedding weights that sync automatically inside your offline desktop harness.
          </p>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {models.map((model) => (
          <div 
            key={model.id}
            className="p-6 rounded-xl border border-border bg-card hover:border-amber-500/40 transition-all space-y-4 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-secondary text-amber-500">
                    {model.format} • {model.quantization}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {model.parameters}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {model.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  <strong>Best for: </strong>{model.recommendedFor}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-bold text-foreground font-mono block">
                  {model.fileSize}
                </span>
                <span className="text-xs text-muted-foreground">
                  Requires {model.recommendedRam}
                </span>
              </div>
            </div>

            {/* Destination Placement Pill */}
            <div className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 truncate mr-2">
                <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-foreground font-semibold">Drop Path: </span>
                <span className="text-amber-400 truncate">{model.destinationPath}</span>
              </div>
              <button
                onClick={() => copyText(model.id + '-path', model.destinationPath)}
                className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                title="Copy directory path"
              >
                {copiedId === model.id + '-path' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono truncate max-w-md">
                SHA-256: {model.sha256}
              </span>
              <button
                onClick={() => alert(`Initiating download for ${model.name} (${model.fileSize})`)}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm shadow-amber-500/20"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Download Model File</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
