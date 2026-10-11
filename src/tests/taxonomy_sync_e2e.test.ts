import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { GET as getTaxonomy } from '../app/api/v1/hub/taxonomy/route';
import { GET as getSync } from '../app/api/v1/hub/sync/route';
import { getHubItems } from '../lib/db/queries/hub';

describe('E2E Taxonomy Dictionary & Workstation Fleet Sync Roundtrip', () => {
  let tempSyncDir: string;

  beforeEach(() => {
    tempSyncDir = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e_taxonomy_sync_'));
  });

  afterEach(() => {
    if (fs.existsSync(tempSyncDir)) {
      fs.rmSync(tempSyncDir, { recursive: true, force: true });
    }
  });

  it('verifies full taxonomy tree, domain filtering, and fleet sync unpacking', async () => {
    // 1. Query taxonomy route
    const taxReq = new Request('http://localhost:3300/api/v1/hub/taxonomy');
    const taxRes = await getTaxonomy(taxReq);
    assert.strictEqual(taxRes.status, 200);

    const taxData = await taxRes.json();
    assert.strictEqual(taxData.success, true);
    assert.ok(taxData.domains.length >= 4);

    // 2. Query filtered hub items for legal-dispute / corporate-insolvency
    const { items: insolvencyItems } = await getHubItems({
      domain: 'legal-dispute',
      subdomain: 'corporate-insolvency',
    });
    assert.ok(insolvencyItems.length > 0);
    assert.ok(
      insolvencyItems.every(
        (i) => i.domain === 'legal-dispute' && i.subdomain === 'corporate-insolvency'
      )
    );

    // 3. Query sync route with chamber license and hardware fingerprint
    const syncReq = new Request('http://localhost:3300/api/v1/hub/sync', {
      headers: {
        'x-hayagriva-license': 'HAYA-ENT-8F92-K4X9-98QA',
        'x-hayagriva-fingerprint': 'a3f89e21bc047de193021fa4b732e91048a6df29c48e01934ba7109283f619a0',
      },
    });
    const syncRes = await getSync(syncReq);
    assert.strictEqual(syncRes.status, 200);

    const syncData = await syncRes.json();
    assert.strictEqual(syncData.success, true);
    assert.ok(Array.isArray(syncData.items));

    // 4. Test fleet sync unpacking into domain hierarchy using HubSyncManager
    const { HubSyncManager } = require('../../../server/utils/hayagriva/hubSyncManager');
    const manager = new HubSyncManager({
      fetchFn: async () => ({
        ok: true,
        status: 200,
        json: async () => syncData,
      }),
    });

    const fleetResult = await manager.syncFleet({
      portalUrl: 'http://localhost:3300',
      licenseKey: 'HAYA-ENT-8F92-K4X9-98QA',
      targetDir: tempSyncDir,
    });

    assert.strictEqual(fleetResult.success, true);
    assert.ok(fleetResult.installedCount > 0);

    // Check on-disk existence of IBC avoidance auditor under domain hierarchy
    const expectedAgentDir = path.join(
      tempSyncDir,
      'domains',
      'legal-dispute',
      'corporate-insolvency',
      'agents',
      'ibc-sec66-forensic-auditor'
    );
    assert.strictEqual(fs.existsSync(expectedAgentDir), true);
    assert.strictEqual(fs.existsSync(path.join(expectedAgentDir, 'handler.js')), true);
    assert.strictEqual(fs.existsSync(path.join(expectedAgentDir, '.hayagriva_sync.json')), true);

    const receipt = JSON.parse(
      fs.readFileSync(path.join(expectedAgentDir, '.hayagriva_sync.json'), 'utf8')
    );
    assert.strictEqual(receipt.domain, 'legal-dispute');
    assert.strictEqual(receipt.subdomain, 'corporate-insolvency');
  });
});
