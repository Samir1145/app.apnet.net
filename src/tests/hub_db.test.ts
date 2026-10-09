// admin-panel/src/tests/hub_db.test.ts
import assert from 'assert';
// @ts-ignore
import { hubItems } from '../lib/db/schema';
// @ts-ignore
import { seedHubData, getHubStore } from '../lib/db/seed-hub';

async function testHubDatabase() {
    console.log('=== Task 1: Testing hub_items Schema & Hub Seed Layer ===\n');

    // 1. Schema Definition Test
    console.log('[Test 1.1] Verifying hubItems table schema export...');
    assert(hubItems, 'hubItems table must be defined and exported in schema.ts');
    console.log('✔ hubItems schema table defined.');

    // 2. Hub Seed Initialization Test
    console.log('[Test 1.2] Testing Hub Seed Initialization with scraped community dataset...');
    const store = seedHubData();
    assert(store.hubItems, 'Hub store must contain hubItems array');
    assert(store.hubItems.length >= 100, `Expected at least 100 seeded items, found ${store.hubItems.length}`);
    console.log(`✔ Hub store initialized with ${store.hubItems.length} items.`);

    // 3. Public vs Private Chamber Visibility Check
    console.log('[Test 1.3] Testing Public vs Private Chamber visibility flags...');
    const publicItems = store.hubItems.filter(i => i.visibility === 'PUBLIC');
    const privateItems = store.hubItems.filter(i => i.visibility === 'PRIVATE_CHAMBER');
    
    assert(publicItems.length > 0, 'Must have public items');
    assert(privateItems.length > 0, 'Must have private chamber items seeded for confidential chambers');
    
    const samplePublic = publicItems[0];
    assert(samplePublic.manifest, 'Item must contain manifest JSON');
    assert(samplePublic.itemType, 'Item must specify valid itemType');

    const samplePrivate = privateItems[0];
    assert(samplePrivate.orgId, 'Private chamber item must have an orgId attached');
    console.log(`✔ Found ${publicItems.length} public items and ${privateItems.length} private chamber items.`);

    // 4. Verification & Tags
    console.log('[Test 1.4] Testing item structure, tags, and manifests...');
    const skillItem = store.hubItems.find(i => i.itemType === 'agent-skill');
    assert(skillItem, 'Must contain agent-skill items');
    assert(Array.isArray(skillItem.tags), 'Tags must be an array');
    assert(typeof skillItem.downloads === 'number', 'Downloads must be numeric');
    console.log('✔ Schema attributes verified.');

    console.log('\n✅ All Task 1 Schema and Seed tests passed successfully!');
}

testHubDatabase().catch(err => {
    console.error('❌ Task 1 Test Failed:', err);
    process.exit(1);
});
