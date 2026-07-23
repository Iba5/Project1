import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const body = await request.json();
  const { name, slug, description, imageUrl, featured, active, sortOrder } = body;
  const product = await db.product.update({
    where: { id },
    data: { name, slug, description, imageUrl, featured, active, sortOrder },
  });

  return NextResponse.json({ product });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}