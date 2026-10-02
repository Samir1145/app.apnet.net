// admin-panel/src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { registerPractitioner } from '@/lib/services/registration';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await registerPractitioner(body);

    const response = NextResponse.json({
      success: true,
      message: result.message,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        plan: result.user.plan,
        org: result.user.org,
      },
      license: result.license,
    });

    // Set auto-login session cookies
    response.cookies.set({
      name: 'hayagriva_user',
      value: encodeURIComponent(JSON.stringify({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        status: result.user.status,
        plan: result.user.plan,
        org: result.user.org,
      })),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    response.cookies.set({
      name: 'hayagriva_admin_token',
      value: `tok_adv_${Date.now()}`,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    response.cookies.set({
      name: 'hayagriva_session',
      value: result.sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    const status = error.code === 'EMAIL_ALREADY_EXISTS' ? 409 : 400;
    return NextResponse.json(
      {
        success: false,
        error: error.code || 'REGISTRATION_FAILED',
        message: error.message || 'Registration failed. Please check your inputs.',
      },
      { status }
    );
  }
}
