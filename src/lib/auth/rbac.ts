// admin-panel/src/lib/auth/rbac.ts

export interface AuthUser {
  id: string;
  role: string;
  status: string;
  email: string;
  isDeleted?: boolean;
}

export interface RbacCheckResult {
  allowed: boolean;
  status?: number;
  redirect?: string;
  reason?: string;
}

export function verifyRbacAccess(user: AuthUser | null | undefined, path: string): RbacCheckResult {
  const isAdminRoute = path.startsWith('/admin') || path.startsWith('/api/admin');
  const isClientRoute = path.startsWith('/dashboard') || path.startsWith('/api/user');

  if (!isAdminRoute && !isClientRoute) {
    return { allowed: true };
  }

  // 1. Unauthenticated check
  if (!user) {
    return {
      allowed: false,
      status: 401,
      redirect: '/login',
      reason: 'Authentication required'
    };
  }

  // 2. Active status check
  if (user.status !== 'ACTIVE' || user.isDeleted) {
    return {
      allowed: false,
      status: 403,
      reason: 'Account is suspended or deactivated'
    };
  }

  // 3. Admin routes require SUPER_ADMIN or ADMIN
  if (isAdminRoute) {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      return { allowed: true };
    }
    return {
      allowed: false,
      status: 403,
      reason: 'Insufficient permissions. Super Admin or Admin role required.'
    };
  }

  // 4. Client routes (/dashboard/*) allow any active authenticated role
  return { allowed: true };
}
