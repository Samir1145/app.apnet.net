import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GET } from '../taxonomy/route';
import { getHubItems } from '../../../../../lib/db/queries/hub';

describe('/api/v1/hub/taxonomy tree & filter queries', () => {
  it('returns master taxonomy tree populated with item counts', async () => {
    const req = new Request('http://localhost:3300/api/v1/hub/taxonomy');
    const res = await GET(req);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.domains));
    assert.ok(data.domains.length >= 4);

    const legalDomain = data.domains.find((d: any) => d.id === 'legal-dispute');
    assert.ok(legalDomain);
    const insolvency = legalDomain.subdomains.find(
      (s: any) => s.id === 'corporate-insolvency'
    );
    assert.ok(insolvency);
    assert.ok(
      (insolvency.skillCount || 0) +
        (insolvency.agentCount || 0) +
        (insolvency.vaultCount || 0) >
        0
    );
  });

  it('filters hub items by domain and subdomain', async () => {
    const result = await getHubItems({
      domain: 'legal-dispute',
      subdomain: 'corporate-insolvency',
    });
    assert.strictEqual(result.items.length > 0, true);
    assert.strictEqual(
      result.items.every(
        (i) => i.domain === 'legal-dispute' && i.subdomain === 'corporate-insolvency'
      ),
      true
    );
  });

  it('returns empty list for non-existent domain without error', async () => {
    const result = await getHubItems({
      domain: 'non-existent-domain',
    });
    assert.strictEqual(result.items.length, 0);
    assert.strictEqual(result.total, 0);
  });
});
