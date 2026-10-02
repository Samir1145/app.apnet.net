// admin-panel/src/app/api/admin/invoices/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { filterInvoices } from '@/lib/services/modules';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'ALL';
    const search = searchParams.get('search') || '';

    const store = getMockStore();
    const invoices = filterInvoices(store, { status, search });

    const totalRevenueInr = invoices
      .filter(i => i.status === 'PAID')
      .reduce((acc, i) => acc + parseFloat(i.amountInr), 0);

    return NextResponse.json({
      invoices,
      total: invoices.length,
      totalRevenueInr,
    }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to list invoices' }, { status: 500 });
  }
}
