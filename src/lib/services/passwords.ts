// admin-panel/src/lib/services/passwords.ts
import { AdminStore } from '../db/seed';
import { AdminAuditLog } from '../db/schema';
import crypto from 'crypto';

export function generateTemporaryPassword(
  store: AdminStore,
  userId: string,
  adminId: string,
  adminEmail: string
) {
  const user = store.users.find(u => u.id === userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  // Generate secure 16-character temporary password
  const tempPassword = `Haya_${crypto.randomBytes(6).toString('hex')}!`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  // Record audit log
  const auditLog: AdminAuditLog = {
    id: store.adminAuditLogs.length + 1,
    adminId,
    adminEmail,
    action: 'PASSWORD_RESET_GENERATED',
    targetUserId: userId,
    previousState: null,
    newState: { tempPasswordSent: true, expiresAt },
    ipAddress: '127.0.0.1',
    createdAt: new Date()
  };

  store.adminAuditLogs.push(auditLog);

  return {
    success: true,
    tempPassword,
    expiresAt,
    user: { id: user.id, email: user.email, name: user.name }
  };
}
