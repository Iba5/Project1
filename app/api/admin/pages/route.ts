import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pages = await db.pageSection.findMany({ orderBy: { section: 'asc' } });
  return NextResponse.json({ pages });
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { section, title, subtitle, content, imageUrl } = body;

  if (!section) {
    return NextResponse.json({ error: 'Section required' }, { status: 400 });
  }

  const page = await db.pageSection.upsert({
    where: { section },
    update: { title, subtitle, content, imageUrl },
    create: { section, title: title || '', subtitle: subtitle || '', content: content || '', imageUrl: imageUrl || '' },
  });

  return NextResponse.json({ page });
}