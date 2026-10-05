// admin-panel/src/app/api/v1/agents/build/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { compileCartridge } from '@/lib/compiler/cartridge-compiler';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body || !body.name || !body.archetype) {
      return NextResponse.json({ error: 'Missing required agent fields' }, { status: 400 });
    }

    const zipBuffer = await compileCartridge(body);
    const filename = `${body.slug || 'agent'}-v${body.version || '1.0.0'}.haya`;

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Cartridge-Filename': filename,
      },
    });
  } catch (error: any) {
    console.error('Cartridge build error:', error);
    return NextResponse.json({ error: error.message || 'Internal build error' }, { status: 500 });
  }
}
