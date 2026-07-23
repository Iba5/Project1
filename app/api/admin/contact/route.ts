import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const submissions = await db.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ submissions });
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, read } = body;

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await db.contactSubmission.update({
    where: { id },
    data: { read: read ?? true },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await db.contactSubmission.delete({ where: { id } });
  return NextResponse.json({ success: true });
}