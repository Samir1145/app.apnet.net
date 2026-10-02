// admin-panel/src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { getMockStore } from './seed';

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDbClient() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (databaseUrl && !databaseUrl.includes('placeholder')) {
    if (!dbInstance) {
      const sql = neon(databaseUrl);
      dbInstance = drizzle(sql, { schema });
    }
    return dbInstance;
  }

  // Fallback in-memory driver interface for offline development / test execution
  return {
    isMock: true,
    store: getMockStore(),
    query: {
      users: {
        findMany: async () => getMockStore().users.filter(u => !u.isDeleted),
        findFirst: async ({ where }: any = {}) => getMockStore().users[0],
      }
    }
  };
}

export const db = getDbClient();
export { schema };
