export interface CategoryConfig {
  label: string;
  colorClass: string;
  iconName: string;
}

export function getItemCategoryConfig(type: string): CategoryConfig {
  switch (type) {
    case "agent-skill":
      return {
        label: "Agent Skill",
        colorClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        iconName: "Zap",
      };
    case "custom-agent":
    case "agent":
      return {
        label: "Autonomous Agent",
        colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        iconName: "Bot",
      };
    case "legal-vault":
    case "bare-act-vault":
      return {
        label: "Statutory Vault",
        colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        iconName: "Database",
      };
    case "ai-model":
    case "slm-model":
      return {
        label: "AI Model",
        colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        iconName: "Cpu",
      };
    case "slash-command":
      return {
        label: "Slash Command",
        colorClass: "text-sky-400 bg-sky-500/10 border-sky-500/20",
        iconName: "Command",
      };
    default:
      return {
        label: "Sovereign Tool",
        colorClass: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
        iconName: "Package",
      };
  }
}

export function formatItemVersion(version?: string): string {
  if (!version) return "v1.0.0";
  return version.startsWith("v") ? version : `v${version}`;
}
