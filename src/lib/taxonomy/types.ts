// admin-panel/src/lib/taxonomy/types.ts
import domainsData from './domains.json';

export interface TaxonomySubdomain {
  id: string;
  name: string;
  description: string;
  jurisdiction?: string;
  agentCount?: number;
  skillCount?: number;
  vaultCount?: number;
}

export interface TaxonomyDomain {
  id: string;
  name: string;
  icon: string;
  description: string;
  subdomains: TaxonomySubdomain[];
}

export interface ParsedTaxonomyUrn {
  kind: 'agent' | 'skill' | 'vault' | 'command';
  domain: string;
  subdomain: string;
  slug: string;
  version: string;
}

export interface AgentCognition {
  role: string;
  goal: string;
  reasoningEffort?: 'low' | 'medium' | 'high';
  systemPrompt?: string;
  allowSubagents?: boolean;
  criticAgent?: string;
}

export interface AgentManifest {
  urn?: string;
  identity?: {
    name: string;
    slug: string;
    version: string;
  };
  taxonomy?: {
    domain: string;
    subdomain: string;
    archetype?: string;
    tags?: string[];
  };
  cognition?: AgentCognition;
  capabilities?: {
    skills?: string[];
    statutoryVaults?: string[];
    slashCommands?: string[];
  };
  files?: Array<{
    name: string;
    content: string;
    language?: string;
  }>;
}

const URN_REGEX = /^(agent|skill|vault|command):([a-z0-9-]+):([a-z0-9-]+):([a-z0-9-]+):(\d+\.\d+\.\d+(?:-[a-z0-9.]+)?)$/i;

export function validateTaxonomyUrn(urn: string): boolean {
  if (!urn || typeof urn !== 'string') return false;
  return URN_REGEX.test(urn.trim());
}

export function parseTaxonomyUrn(urn: string): ParsedTaxonomyUrn | null {
  if (!validateTaxonomyUrn(urn)) return null;
  const match = urn.trim().match(URN_REGEX);
  if (!match) return null;

  return {
    kind: match[1].toLowerCase() as ParsedTaxonomyUrn['kind'],
    domain: match[2].toLowerCase(),
    subdomain: match[3].toLowerCase(),
    slug: match[4].toLowerCase(),
    version: match[5],
  };
}

export function getMasterTaxonomy(): TaxonomyDomain[] {
  return domainsData as TaxonomyDomain[];
}

export function findDomain(domainId: string): TaxonomyDomain | undefined {
  return getMasterTaxonomy().find((d) => d.id === domainId);
}

export function findSubdomain(
  domainId: string,
  subdomainId: string
): TaxonomySubdomain | undefined {
  const domain = findDomain(domainId);
  return domain?.subdomains.find((s) => s.id === subdomainId);
}
