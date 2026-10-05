// admin-panel/src/lib/db/seed-neon.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { seedInitialData } from './seed';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required. Please set it in .env.local');
}

async function main() {
  console.log('Connecting to Neon PostgreSQL database...');
  const sql = neon(DATABASE_URL || "");
  const db = drizzle(sql, { schema });

  const seedData = seedInitialData();

  console.log('Seeding Users...');
  for (const user of seedData.users) {
    try {
      await db.insert(schema.users).values(user).onConflictDoNothing();
    } catch (e: any) {
      console.warn(`User ${user.email} notice:`, e.message);
    }
  }

  console.log('Seeding Licenses...');
  for (const license of seedData.licenses) {
    try {
      await db.insert(schema.licenses).values(license).onConflictDoNothing();
    } catch (e: any) {
      console.warn(`License ${license.licenseKey} notice:`, e.message);
    }
  }

  console.log('Seeding Activations...');
  for (const activation of seedData.activations) {
    try {
      await db.insert(schema.activations).values(activation).onConflictDoNothing();
    } catch (e: any) {
      console.warn(`Activation ${activation.id} notice:`, e.message);
    }
  }

  console.log('Seeding API Keys...');
  for (const apiKey of seedData.apiKeys) {
    try {
      await db.insert(schema.apiKeys).values(apiKey).onConflictDoNothing();
    } catch (e: any) {
      console.warn(`API Key ${apiKey.name} notice:`, e.message);
    }
  }

  console.log('Seeding Invoices...');
  for (const invoice of seedData.invoices) {
    try {
      await db.insert(schema.invoices).values(invoice).onConflictDoNothing();
    } catch (e: any) {
      console.warn(`Invoice ${invoice.id} notice:`, e.message);
    }
  }

  console.log('Seeding System Logs...');
  for (const log of seedData.systemLogs) {
    try {
      await db.insert(schema.systemLogs).values(log).onConflictDoNothing();
    } catch (e: any) {
      console.warn(`Log notice:`, e.message);
    }
  }

  console.log('Seeding Support Tickets...');
  for (const ticket of seedData.supportTickets) {
    try {
      await db.insert(schema.supportTickets).values(ticket).onConflictDoNothing();
    } catch (e: any) {
      console.warn(`Ticket ${ticket.id} notice:`, e.message);
    }
  }

  console.log('Seeding Download Releases...');
  for (const release of seedData.downloadTelemetry) {
    try {
      await db.insert(schema.downloadTelemetry).values(release).onConflictDoNothing();
    } catch (e: any) {
      console.warn(`Download release notice:`, e.message);
    }
  }

  console.log('✅ Neon PostgreSQL Database successfully hydrated with initial production data!');
}

main().catch(console.error);
