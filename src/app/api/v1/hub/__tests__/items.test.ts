import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GET } from '../items/route';

describe('/api/v1/hub/items route handler', () => {
  it('returns items successfully with pagination metadata', async () => {
    const req = new Request('http://localhost:3300/api/v1/hub/items?page=1&limit=5');
    const res = await GET(req);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(Array.isArray(data.items), true);
    assert.ok(data.items.length <= 5);
    assert.strictEqual(data.page, 1);
    assert.strictEqual(data.limit, 5);
    assert.ok(data.total >= 0);
  });

  it('filters by category when specified', async () => {
    const req = new Request('http://localhost:3300/api/v1/hub/items?category=agent-skill');
    const res = await GET(req);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(
      data.items.every((i: any) => i.itemType === 'agent-skill'),
      true
    );
  });
});
