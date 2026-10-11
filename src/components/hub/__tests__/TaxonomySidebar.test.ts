import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  computeDomainBadges,
  filterTaxonomyTree,
  isSubdomainActive,
} from '../taxonomy-utils';
import { getMasterTaxonomy } from '../../../lib/taxonomy/types';

describe('TaxonomySidebar Utility & Tree Filtering', () => {
  const masterTree = getMasterTaxonomy();

  it('computes domain badges summing subdomains', () => {
    const mockDomain = {
      id: 'test-domain',
      name: 'Test Domain',
      icon: 'Scale',
      description: 'Test description',
      subdomains: [
        { id: 'sub-1', name: 'Sub 1', description: 'Desc 1', agentCount: 3, skillCount: 2, vaultCount: 1 },
        { id: 'sub-2', name: 'Sub 2', description: 'Desc 2', agentCount: 1, skillCount: 0, vaultCount: 2 },
      ],
    };

    const badges = computeDomainBadges(mockDomain as any);
    assert.strictEqual(badges.total, 9);
    assert.strictEqual(badges.agentCount, 4);
    assert.strictEqual(badges.skillCount, 2);
    assert.strictEqual(badges.vaultCount, 3);
  });

  it('filters taxonomy tree by search keyword matching subdomain name or description', () => {
    const filtered = filterTaxonomyTree(masterTree, 'insolvency');
    assert.ok(filtered.length > 0);
    const legalDomain = filtered.find((d) => d.id === 'legal-dispute');
    assert.ok(legalDomain);
    assert.ok(
      legalDomain.subdomains.some((s) => s.id === 'corporate-insolvency')
    );
  });

  it('correctly determines whether a subdomain is active', () => {
    assert.strictEqual(
      isSubdomainActive('legal-dispute', 'corporate-insolvency', 'legal-dispute', 'corporate-insolvency'),
      true
    );
    assert.strictEqual(
      isSubdomainActive('legal-dispute', 'arbitration', 'legal-dispute', 'corporate-insolvency'),
      false
    );
    assert.strictEqual(
      isSubdomainActive(null, null, 'legal-dispute', 'corporate-insolvency'),
      false
    );
  });
});
