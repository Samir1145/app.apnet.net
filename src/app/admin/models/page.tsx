'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  DownloadCloud, 
  HardDrive, 
  Plus, 
  Check, 
  Copy, 
  Terminal, 
  ShieldCheck,
  FolderOpen,
  Search,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers,
  FileCode,
  AlertCircle
} from 'lucide-react';

interface ManagedModel {
  id: string;
  name: string;
  architecture: string;
  format: 'GGUF' | 'ONNX';
  parameters: string;
  quantization: string;
  fileSize: string;
  recommendedRam: string;
  recommendedFor: string;
  destinationPath: string;
  sha256: string;
  downloadsCount: number;
  status: 'Active' | 'Beta' | 'Deprecated';
  releasedAt: string;
}

const initialModels: ManagedModel[] = [
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
    downloadsCount: 1482,
    status: 'Active',
    releasedAt: '2026-09-15',
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
    downloadsCount: 2894,
    status: 'Active',
    releasedAt: '2026-09-20',
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
    downloadsCount: 3740,
    status: 'Active',
    releasedAt: '2026-09-10',
  },
];

export default function AdminModelsRegistryPage() {
  const [models, setModels] = useState<ManagedModel[]>(initialModels);
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'GGUF' | 'ONNX'>('ALL');
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Form states for new registration
  const [newName, setNewName] = useState('');
  const [newArch, setNewArch] = useState('');
  const [newFormat, setNewFormat] = useState<'GGUF' | 'ONNX'>('GGUF');
  const [newQuant, setNewQuant] = useState('Q4_K_M');
  const [newSize, setNewSize] = useState('');
  const [newSha, setNewSha] = useState('');

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSha(id);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newEntry: ManagedModel = {
      id: `custom-${Date.now()}`,
      name: newName,
      architecture: newArch || 'Transformer',
      format: newFormat,
      parameters: 'Custom',
      quantization: newQuant,
      fileSize: newSize || '2.0 GB',
      recommendedRam: '8 GB RAM',
      recommendedFor: 'Custom In-Chamber Legal Specialist',
      destinationPath: `~/.hayagriva/models/${newName.toLowerCase().replace(/\s+/g, '-')}.${newFormat.toLowerCase()}`,
      sha256: newSha || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      downloadsCount: 0,
      status: 'Beta',
      releasedAt: new Date().toISOString().split('T')[0],
    };
    setModels([newEntry, ...models]);
    setIsRegisterOpen(false);
    setNewName('');
    setNewArch('');
    setNewSize('');
    setNewSha('');
  };

  const filteredModels = models.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.architecture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.quantization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = formatFilter === 'ALL' || m.format === formatFilter;
    return matchesSearch && matchesFormat;
  });

  const totalDownloads = models.reduce((acc, m) => acc + m.downloadsCount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
              DISTRIBUTION & GOVERNANCE
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
              GGUF & ONNX Serving
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-500" />
            AI Reasoning & Embeddings Registry
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Govern pre-quantized in-chamber LLM weights and vector embedding artifacts provisioned to the desktop client.
          </p>
        </div>

        <button 
          onClick={() => setIsRegisterOpen(!isRegisterOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          Register New Model
        </button>
      </div>

      {/* Distribution Telemetry Header */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-500" />
          Distribution Telemetry
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase font-medium">Total Registered Models</span>
              <Layers className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">{models.length}</div>
            <div className="text-xs text-muted-foreground mt-1">2 GGUF Engines, 1 ONNX Vector</div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase font-medium">Total Model Deliveries</span>
              <DownloadCloud className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">{totalDownloads.toLocaleString()}</div>
            <div className="text-xs text-emerald-500/80 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +18.4% this week
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase font-medium">Chamber Storage Payload</span>
              <HardDrive className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">6.83 GB</div>
            <div className="text-xs text-muted-foreground mt-1">Optimized Q4_K_M footprint</div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase font-medium">Client Verification</span>
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-500 mt-2">SHA-256</div>
            <div className="text-xs text-muted-foreground mt-1">Immutable integrity checks</div>
          </div>
        </div>
      </div>

      {/* Registration Slide-over / Modal */}
      {isRegisterOpen && (
        <form onSubmit={handleRegister} className="p-6 rounded-xl bg-slate-900 border border-amber-500/30 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              Register New GGUF/ONNX Model Weight
            </h3>
            <button 
              type="button" 
              onClick={() => setIsRegisterOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Model Name</label>
              <input 
                type="text" 
                placeholder="e.g. Qwen2.5-Coder-7B-Legal" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Architecture</label>
              <input 
                type="text" 
                placeholder="e.g. Qwen 2.5 / DeepSeek R1" 
                value={newArch} 
                onChange={(e) => setNewArch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Format</label>
              <select 
                value={newFormat} 
                onChange={(e) => setNewFormat(e.target.value as 'GGUF' | 'ONNX')}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:border-amber-500"
              >
                <option value="GGUF">GGUF (Llamafile / Llama.cpp)</option>
                <option value="ONNX">ONNX (Dense Vector Embeddings)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Quantization</label>
              <input 
                type="text" 
                placeholder="e.g. Q4_K_M / Q8_0 / FP32" 
                value={newQuant} 
                onChange={(e) => setNewQuant(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">File Size</label>
              <input 
                type="text" 
                placeholder="e.g. 4.68 GB" 
                value={newSize} 
                onChange={(e) => setNewSize(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">SHA-256 Checksum</label>
              <input 
                type="text" 
                placeholder="64-character hash" 
                value={newSha} 
                onChange={(e) => setNewSha(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm transition-all"
            >
              Confirm Model Registration
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by model name, architecture, quantization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {(['ALL', 'GGUF', 'ONNX'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                formatFilter === fmt
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {fmt === 'ALL' ? 'All Models' : `${fmt} Engines`}
            </button>
          ))}
        </div>
      </div>

      {/* Models Master Table / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredModels.map((model) => (
          <div 
            key={model.id}
            className="p-5 rounded-xl bg-card border border-border hover:border-amber-500/40 transition-all space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                    {model.format}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    {model.quantization}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold">
                    {model.status}
                  </span>
                  <span className="text-xs text-muted-foreground">Released: {model.releasedAt}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{model.name}</h3>
                <p className="text-xs text-muted-foreground">{model.recommendedFor}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  {model.downloadsCount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Chamber Installs</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-y border-border/50 text-xs">
              <div>
                <span className="text-muted-foreground block mb-0.5">Architecture</span>
                <span className="font-semibold text-foreground">{model.architecture}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">Parameters</span>
                <span className="font-semibold text-foreground">{model.parameters}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">File Size</span>
                <span className="font-semibold text-foreground">{model.fileSize}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">Memory Ceiling</span>
                <span className="font-semibold text-foreground">{model.recommendedRam}</span>
              </div>
            </div>

            {/* Destination path & SHA-256 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1 font-mono">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                  Target Path: {model.destinationPath}
                </span>
                <span className="text-muted-foreground font-mono">
                  SHA-256: {model.sha256.substring(0, 16)}...
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-border text-xs font-mono">
                <span className="text-muted-foreground truncate select-all">{model.sha256}</span>
                <button
                  onClick={() => copyText(model.id, model.sha256)}
                  className="ml-2 flex items-center gap-1 px-2 py-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-all shrink-0"
                >
                  {copiedSha === model.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy SHA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
