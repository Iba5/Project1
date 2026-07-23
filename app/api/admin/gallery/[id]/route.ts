import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const body = await request.json();
  const { title, description, imageUrl, sortOrder } = body;
  const image = await db.galleryImage.update({
    where: { id },
    data: { title, description, imageUrl, sortOrder },
  });

  return NextResponse.json({ image });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  await db.galleryImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}