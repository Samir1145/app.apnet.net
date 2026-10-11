import { describe, it } from 'node:test';
import assert from 'node:assert';
import { seedHubData } from '../../seed-hub';
import { validateTaxonomyUrn } from '../../../taxonomy/types';

describe('Taxonomy Schema & Seed Data Validation', () => {
  const { hubItems } = seedHubData();

  it('ensures all hub items contain domain, subdomain, and valid taxonomy URN', () => {
    assert.ok(hubItems.length > 0);
    for (const item of hubItems) {
      assert.ok(item.domain, `Item ${item.id} missing domain`);
      assert.ok(item.subdomain, `Item ${item.id} missing subdomain`);
      assert.ok(item.urn, `Item ${item.id} missing urn`);
      assert.strictEqual(
        validateTaxonomyUrn(item.urn),
        true,
        `Item ${item.id} has invalid URN: ${item.urn}`
      );
      assert.ok(Array.isArray(item.requiredSkills), `Item ${item.id} requiredSkills must be an array`);
      assert.ok(Array.isArray(item.statutoryVaults), `Item ${item.id} statutoryVaults must be an array`);
    }
  });

  it('populates correct legal insolvency taxonomy for flagship IBC forensic tools', () => {
    const sec66Tool = hubItems.find((i) => i.id === 'priv_rao_ibc_sec66');
    assert.ok(sec66Tool);
    assert.strictEqual(sec66Tool?.domain, 'legal-dispute');
    assert.strictEqual(sec66Tool?.subdomain, 'corporate-insolvency');
    assert.strictEqual(sec66Tool?.archetype, 'forensic-inquest');
  });
});
