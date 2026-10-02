// admin-panel/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyRbacAccess } from './lib/auth/rbac';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/api/admin') || 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/api/user')
  ) {
    // Check auth cookie / header
    const token = request.cookies.get('hayagriva_admin_token')?.value;
    const sessionUserStr = request.cookies.get('hayagriva_user')?.value;

    let user = null;
    if (sessionUserStr) {
      try {
        user = JSON.parse(decodeURIComponent(sessionUserStr));
      } catch {
        user = null;
      }
    } else if (token) {
      // Default session mock for development
      user = {
        id: 'usr_superadmin_01',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        email: 'superadmin@hayagriva.app'
      };
    }

    const check = verifyRbacAccess(user, pathname);

    if (!check.allowed) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: check.reason || 'Unauthorized' },
          { status: check.status || 401 }
        );
      }
      return NextResponse.redirect(new URL(check.redirect || '/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/dashboard/:path*', '/api/user/:path*'],
};
