import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateTaxonomyUrn,
  getMasterTaxonomy,
  findSubdomain,
  parseTaxonomyUrn,
} from '../types';

describe('Agent Taxonomy Dictionary & URN Validation', () => {
  it('validates well-formed taxonomy URNs', () => {
    assert.strictEqual(
      validateTaxonomyUrn('agent:legal-dispute:corporate-insolvency:avoidance-auditor:1.2.0'),
      true
    );
    assert.strictEqual(
      validateTaxonomyUrn('skill:legal-dispute:corporate-insolvency:sec66-fraud-tracer:1.0.0'),
      true
    );
    assert.strictEqual(
      validateTaxonomyUrn('vault:legal-dispute:corporate-insolvency:ibc-2016:1.0.0'),
      true
    );
  });

  it('rejects malformed taxonomy URNs', () => {
    assert.strictEqual(validateTaxonomyUrn(''), false);
    assert.strictEqual(validateTaxonomyUrn('agent:invalid'), false);
    assert.strictEqual(validateTaxonomyUrn('random_string'), false);
    assert.strictEqual(validateTaxonomyUrn('tool:a:b:c'), false); // invalid category prefix
  });

  it('parses valid URN into components', () => {
    const parsed = parseTaxonomyUrn('agent:legal-dispute:corporate-insolvency:avoidance-auditor:1.2.0');
    assert.deepStrictEqual(parsed, {
      kind: 'agent',
      domain: 'legal-dispute',
      subdomain: 'corporate-insolvency',
      slug: 'avoidance-auditor',
      version: '1.2.0',
    });
  });

  it('returns master taxonomy domains with populated subdomains', () => {
    const domains = getMasterTaxonomy();
    assert.ok(Array.isArray(domains));
    assert.ok(domains.length >= 4);

    const legal = domains.find((d) => d.id === 'legal-dispute');
    assert.ok(legal);
    assert.strictEqual(legal?.name, 'Legal & Dispute Resolution');
    assert.ok(legal?.subdomains.some((s) => s.id === 'corporate-insolvency'));

    const insolvency = findSubdomain('legal-dispute', 'corporate-insolvency');
    assert.ok(insolvency);
    assert.strictEqual(insolvency?.name, 'Corporate Insolvency (IBC)');
  });
});
