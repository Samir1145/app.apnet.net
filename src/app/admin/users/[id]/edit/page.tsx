// admin-panel/src/app/admin/users/[id]/edit/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { UserEditForm } from '@/components/admin/user-edit-form';
import { User } from '@/lib/db/schema';

export default function UserEditPage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (!res.ok) {
          throw new Error('User not found');
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err: any) {
        setError(err.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
        Loading practitioner account details...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 bg-card border border-border rounded-xl text-center space-y-2">
        <h2 className="text-base font-bold text-foreground">User Not Found</h2>
        <p className="text-xs text-muted-foreground">{error || 'The requested practitioner record does not exist.'}</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <UserEditForm user={user} />
    </div>
  );
}
