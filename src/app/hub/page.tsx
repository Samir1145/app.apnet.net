// admin-panel/src/app/hub/page.tsx
import { redirect } from 'next/navigation';

export default function HubPage() {
  redirect('/dashboard/agents?tab=bazaar');
}
