// admin-panel/src/lib/services/users.ts
import { AdminStore } from '../db/seed';
import { User, AdminAuditLog } from '../db/schema';

export interface UsersQueryParams {
  search?: string;
  role?: string;
  status?: string;
  includeDeleted?: boolean;
}

export function queryUsersList(store: AdminStore, params: UsersQueryParams) {
  let filtered = store.users.filter(u => params.includeDeleted ? true : !u.isDeleted);

  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) ||
      (u.org && u.org.toLowerCase().includes(q))
    );
  }

  if (params.role && params.role !== 'ALL') {
    filtered = filtered.filter(u => u.role === params.role);
  }

  if (params.status && params.status !== 'ALL') {
    filtered = filtered.filter(u => u.status === params.status);
  }

  return {
    users: filtered,
    total: filtered.length
  };
}

export function softDeleteUser(
  store: AdminStore,
  userId: string,
  adminId: string,
  adminEmail: string,
  reason?: string
) {
  const user = store.users.find(u => u.id === userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (user.role === 'SUPER_ADMIN') {
    return { success: false, error: 'Cannot delete primary SUPER_ADMIN' };
  }

  const previousState = { ...user };
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.deletedBy = adminId;
  user.updatedAt = new Date();

  // Create immutable audit log entry
  const auditLog: AdminAuditLog = {
    id: store.adminAuditLogs.length + 1,
    adminId,
    adminEmail,
    action: 'USER_SOFT_DELETED',
    targetUserId: userId,
    previousState,
    newState: { isDeleted: true, reason: reason || 'Admin initiated soft deletion' },
    ipAddress: '127.0.0.1',
    createdAt: new Date()
  };

  store.adminAuditLogs.push(auditLog);

  return { success: true, user };
}

export function updateUser(
  store: AdminStore,
  userId: string,
  updates: Partial<Pick<User, 'name' | 'role' | 'status' | 'plan' | 'org'>>,
  adminId: string,
  adminEmail: string
) {
  const user = store.users.find(u => u.id === userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const previousState = { ...user };

  if (updates.name !== undefined) user.name = updates.name;
  if (updates.role !== undefined) user.role = updates.role;
  if (updates.status !== undefined) user.status = updates.status;
  if (updates.plan !== undefined) user.plan = updates.plan;
  if (updates.org !== undefined) user.org = updates.org;
  user.updatedAt = new Date();

  // Create audit log
  const auditLog: AdminAuditLog = {
    id: store.adminAuditLogs.length + 1,
    adminId,
    adminEmail,
    action: 'USER_UPDATED',
    targetUserId: userId,
    previousState,
    newState: updates,
    ipAddress: '127.0.0.1',
    createdAt: new Date()
  };

  store.adminAuditLogs.push(auditLog);

  return { success: true, user };
}
