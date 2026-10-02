// admin-panel/src/app/admin/users/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Users, UserPlus, RefreshCw, ShieldCheck } from 'lucide-react';
import { UsersTable } from '@/components/admin/users-table';
import { User } from '@/lib/db/schema';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Practitioner & User Directory</h1>
            <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full border border-primary/20">
              {users.length} Registered
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage advocate memberships, client estate accounts, role assignments, and soft deactivations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Users Datatable */}
      {loading && users.length === 0 ? (
        <div className="h-64 bg-card border border-border rounded-xl flex items-center justify-center text-xs text-muted-foreground">
          Loading users directory...
        </div>
      ) : (
        <UsersTable initialUsers={users} onRefresh={fetchUsers} />
      )}
    </div>
  );
}
