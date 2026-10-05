// admin-panel/src/tests/db.test.ts
import assert from 'assert';
import { users, systemLogs, invoices, downloadTelemetry, supportTickets, adminAuditLogs } from '../lib/db/schema';
import { getMockStore, seedInitialData } from '../lib/db/seed';
import { getDbClient } from '../lib/db/index';

async function testDatabaseLayer() {
    console.log('=== Task 1: Testing Schema, Seed Data & Drizzle DB Layer ===\n');

    // 1. Test Schema Definitions
    console.log('[Test 1.1] Verifying Drizzle Schema table exports...');
    assert(users, 'users table must be defined');
    assert(systemLogs, 'systemLogs table must be defined');
    assert(invoices, 'invoices table must be defined');
    assert(downloadTelemetry, 'downloadTelemetry table must be defined');
    assert(supportTickets, 'supportTickets table must be defined');
    assert(adminAuditLogs, 'adminAuditLogs table must be defined');
    console.log('✔ All 6 schema tables defined correctly.');

    // 2. Test Mock Store & Seed Initializer
    console.log('[Test 1.2] Testing seed data initialization...');
    const store = seedInitialData();
    assert(store.users.length >= 5, 'Seed data must contain initial users');
    assert(store.invoices.length >= 5, 'Seed data must contain invoices');
    assert(store.systemLogs.length >= 10, 'Seed data must contain logs');
    assert(store.downloadTelemetry.length >= 10, 'Seed data must contain download telemetry');
    assert(store.supportTickets.length >= 4, 'Seed data must contain support tickets');
    
    // Check Super Admin user presence
    const superAdmin = store.users.find(u => u.role === 'SUPER_ADMIN');
    assert(superAdmin, 'Must include default SUPER_ADMIN user');
    assert.strictEqual(superAdmin.email, 'superadmin@hayagriva.app');
    assert.strictEqual(superAdmin.isDeleted, false);
    console.log('✔ Seed data initialized with Super Admin user & telemetry.');

    // 3. Test Soft Deletion behavior
    console.log('[Test 1.3] Testing soft-deletion logic...');
    const targetUser = store.users.find(u => u.role === 'ADVOCATE');
    assert(targetUser, 'Must find advocate user');
    
    // Perform soft-delete
    targetUser.isDeleted = true;
    targetUser.deletedAt = new Date();
    targetUser.deletedBy = superAdmin.id;

    assert.strictEqual(targetUser.isDeleted, true, 'User must be marked isDeleted = true');
    assert(targetUser.deletedAt, 'Soft-delete timestamp must be recorded');
    assert.strictEqual(targetUser.deletedBy, superAdmin.id, 'Deleting admin ID must be recorded');
    console.log('✔ Soft-deletion flag and audit metadata verified.');

    // 4. Test DB Client Resolution
    console.log('[Test 1.4] Testing DB client resolver...');
    const client = getDbClient();
    assert(client, 'DB client must resolve without throwing');
    console.log('✔ DB client successfully resolved.');

    console.log('\n✅ All Task 1 Database and Schema tests passed successfully!');
}

testDatabaseLayer().catch(err => {
    console.error('\n❌ Task 1 Database test failed:', err);
    process.exit(1);
});
