import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('hayagriva_admin_token')?.value;
  const userCookie = cookieStore.get('hayagriva_user')?.value;

  if (!token && !userCookie) {
    redirect('/login');
  }

  let user: any = null;
  if (userCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie));
    } catch {
      user = null;
    }
  }

  if (user?.role === 'SUPER_ADMIN') {
    redirect('/admin/dashboard');
  }

  redirect('/hub');
}
