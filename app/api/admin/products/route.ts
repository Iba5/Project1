import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const products = await db.product.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, slug, description, imageUrl, featured, active, sortOrder } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
  }

  const product = await db.product.create({
    data: {
      name,
      slug,
      description: description || '',
      imageUrl: imageUrl || '',
      featured: featured ?? false,
      active: active ?? true,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json({ product });
}