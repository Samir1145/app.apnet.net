import { TaxonomyDomain, TaxonomySubdomain } from '../../lib/taxonomy/types';

export interface DomainBadges {
  total: number;
  agentCount: number;
  skillCount: number;
  vaultCount: number;
}

export function computeDomainBadges(domain: TaxonomyDomain): DomainBadges {
  let agentCount = 0;
  let skillCount = 0;
  let vaultCount = 0;

  for (const sub of domain.subdomains || []) {
    agentCount += sub.agentCount || 0;
    skillCount += sub.skillCount || 0;
    vaultCount += sub.vaultCount || 0;
  }

  const total = agentCount + skillCount + vaultCount;
  return { total, agentCount, skillCount, vaultCount };
}

export function filterTaxonomyTree(
  domains: TaxonomyDomain[],
  query: string
): TaxonomyDomain[] {
  if (!query || !query.trim()) return domains;
  const q = query.trim().toLowerCase();

  return domains
    .map((domain) => {
      const domainMatches =
        domain.name.toLowerCase().includes(q) ||
        (domain.description && domain.description.toLowerCase().includes(q));

      const matchingSubdomains = (domain.subdomains || []).filter((sub) => {
        return (
          domainMatches ||
          sub.name.toLowerCase().includes(q) ||
          (sub.description && sub.description.toLowerCase().includes(q)) ||
          (sub.jurisdiction && sub.jurisdiction.toLowerCase().includes(q))
        );
      });

      if (matchingSubdomains.length > 0 || domainMatches) {
        return {
          ...domain,
          subdomains:
            matchingSubdomains.length > 0 ? matchingSubdomains : domain.subdomains,
        };
      }
      return null;
    })
    .filter(Boolean) as TaxonomyDomain[];
}

export function isSubdomainActive(
  activeDomain: string | null | undefined,
  activeSubdomain: string | null | undefined,
  domainId: string,
  subdomainId: string
): boolean {
  return Boolean(
    activeDomain &&
      activeSubdomain &&
      activeDomain === domainId &&
      activeSubdomain === subdomainId
  );
}
