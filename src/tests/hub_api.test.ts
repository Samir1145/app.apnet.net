// admin-panel/src/tests/hub_api.test.ts
import assert from 'assert';
// @ts-ignore
import { GET as getItemsRoute } from '../app/api/v1/hub/items/route';
// @ts-ignore
import { GET as getSyncRoute } from '../app/api/v1/hub/sync/route';
// @ts-ignore
import { POST as postPublishRoute } from '../app/api/v1/hub/publish/route';

async function testHubApi() {
  console.log('=== Task 2: Testing Hub REST & Fleet Sync APIs ===\n');

  // 1. Test Public Discovery (/api/v1/hub/items)
  console.log('[Test 2.1] Testing GET /api/v1/hub/items discovery endpoint...');
  {
    const req = new Request('http://localhost:3300/api/v1/hub/items?limit=10&page=1');
    const res = await getItemsRoute(req);
    assert.strictEqual(res.status, 200, 'Public items route should return 200');
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(Array.isArray(data.items), 'data.items must be an array');
    assert.strictEqual(data.items.length, 10, 'Expected page size of 10');
    assert(data.total >= 100, `Expected at least 100 total items, got ${data.total}`);

    // Verify zero private items leaked in public discovery
    const leakedPrivate = data.items.filter((i: any) => i.visibility !== 'PUBLIC');
    assert.strictEqual(leakedPrivate.length, 0, 'Zero private chamber items must be returned in public discovery');
    console.log('✔ Public items discovery and strict privacy check passed.');
  }

  // 2. Test Category and Query Filtering
  console.log('[Test 2.2] Testing category and query filtering in discovery...');
  {
    const req = new Request('http://localhost:3300/api/v1/hub/items?category=agent-skill&q=Calendar');
    const res = await getItemsRoute(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.items.length > 0, 'Should find Calendar item');
    assert(data.items[0].name.toLowerCase().includes('calendar'));
    assert.strictEqual(data.items[0].itemType, 'agent-skill');
    console.log('✔ Category and search filters functioning properly.');
  }

  // 3. Test Fleet Sync License Authentication (/api/v1/hub/sync)
  console.log('[Test 2.3] Testing GET /api/v1/hub/sync unauthorized scenarios...');
  {
    // Scenario A: Missing header
    const reqNoAuth = new Request('http://localhost:3300/api/v1/hub/sync');
    const resNoAuth = await getSyncRoute(reqNoAuth);
    assert.strictEqual(resNoAuth.status, 401, 'Missing license must return 401');

    // Scenario B: Invalid license
    const reqBadAuth = new Request('http://localhost:3300/api/v1/hub/sync', {
      headers: { 'x-hayagriva-license': 'INVALID-LICENSE-XYZ' }
    });
    const resBadAuth = await getSyncRoute(reqBadAuth);
    assert.strictEqual(resBadAuth.status, 401, 'Invalid license must return 401');
    console.log('✔ Unauthorized and invalid requests rejected with 401.');
  }

  // 4. Test Authorized Chamber Sync & Multi-Tenant Isolation
  console.log('[Test 2.4] Testing authorized sync and chamber tenant isolation...');
  {
    // Advocate Rao's license: 'HAYA-ENT-8F92-K4X9-98QA' (Org: 'Rao & Partners Insolvency Advocates')
    const reqRao = new Request('http://localhost:3300/api/v1/hub/sync', {
      headers: { 'x-hayagriva-license': 'HAYA-ENT-8F92-K4X9-98QA' }
    });
    const resRao = await getSyncRoute(reqRao);
    assert.strictEqual(resRao.status, 200);
    const dataRao = await resRao.json();
    assert.strictEqual(dataRao.success, true);
    assert.strictEqual(dataRao.chamber.org, 'Rao & Partners Insolvency Advocates');

    // Verify Rao receives all public items PLUS Rao's private chamber tools
    const raoPrivates = dataRao.items.filter((i: any) => i.visibility === 'PRIVATE_CHAMBER');
    assert(raoPrivates.length >= 3, `Expected at least 3 Rao chamber tools, found ${raoPrivates.length}`);
    
    // Crucial check: Singhania's private tools must NOT be present in Rao's sync payload
    const singhaniaLeak = raoPrivates.find((i: any) => i.orgId === 'Singhania & Co. Insolvency Resolution');
    assert(!singhaniaLeak, 'Cross-chamber leakage detected! Singhania private tools must never be sent to Rao');
    console.log('✔ Rao chamber sync passed with zero cross-chamber leakage.');

    // Advocate Pooja Singhania's license: 'HAYA-PRO-7X9K-4M2P-9Q8A'
    const reqPooja = new Request('http://localhost:3300/api/v1/hub/sync', {
      headers: { 'x-hayagriva-license': 'HAYA-PRO-7X9K-4M2P-9Q8A' }
    });
    const resPooja = await getSyncRoute(reqPooja);
    assert.strictEqual(resPooja.status, 200);
    const dataPooja = await resPooja.json();
    assert.strictEqual(dataPooja.chamber.org, 'Singhania & Co. Insolvency Resolution');
    const poojaPrivates = dataPooja.items.filter((i: any) => i.visibility === 'PRIVATE_CHAMBER');
    assert(poojaPrivates.length >= 1);
    const raoLeak = poojaPrivates.find((i: any) => i.orgId === 'Rao & Partners Insolvency Advocates');
    assert(!raoLeak, 'Cross-chamber leakage detected! Rao private tools must never be sent to Singhania');
    console.log('✔ Singhania chamber sync passed with reciprocal isolation.');
  }

  // 5. Test Hub Asset Publishing (/api/v1/hub/publish)
  console.log('[Test 2.5] Testing POST /api/v1/hub/publish...');
  {
    // A: Public publish
    const pubReq = new Request('http://localhost:3300/api/v1/hub/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'IBC Section 9 Operational Debt Validator',
        itemType: 'agent-skill',
        description: 'Verifies demand notice under Section 8 IBC and checks for pre-existing disputes.',
        visibility: 'PUBLIC',
        tags: ['ibc', 'section-9', 'operational-debt'],
        manifest: {
          files: [{ name: 'handler.js', path: 'sec9/handler.js', size: 120, content: 'module.exports = {};' }]
        },
        authorName: 'Community Contributor'
      })
    });
    const pubRes = await postPublishRoute(pubReq);
    assert.strictEqual(pubRes.status, 201);
    const pubData = await pubRes.json();
    assert.strictEqual(pubData.success, true);
    assert.strictEqual(pubData.item.visibility, 'PUBLIC');
    console.log('✔ Public item published successfully.');

    // B: Private chamber publish
    const privReq = new Request('http://localhost:3300/api/v1/hub/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hayagriva-license': 'HAYA-ENT-8F92-K4X9-98QA'
      },
      body: JSON.stringify({
        name: 'Confidential NCLT Principal Bench Evidence Vault',
        itemType: 'agent-flow',
        description: 'Chamber internal evidentiary compilation flow.',
        visibility: 'PRIVATE_CHAMBER',
        tags: ['chamber-private'],
        manifest: { files: [] }
      })
    });
    const privRes = await postPublishRoute(privReq);
    assert.strictEqual(privRes.status, 201);
    const privData = await privRes.json();
    assert.strictEqual(privData.success, true);
    assert.strictEqual(privData.item.visibility, 'PRIVATE_CHAMBER');
    assert.strictEqual(privData.item.orgId, 'Rao & Partners Insolvency Advocates');
    console.log('✔ Private chamber asset published and bound to chamber org.');
  }

  console.log('\n✅ All Task 2 REST Discovery and Fleet Sync API tests passed successfully!');
}

testHubApi().catch(err => {
  console.error('❌ Task 2 Test Failed:', err);
  process.exit(1);
});
