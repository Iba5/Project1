import { db } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const images = await db.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ images });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, description, imageUrl, sortOrder } = body;

  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL required' }, { status: 400 });
  }

  const image = await db.galleryImage.create({
    data: {
      title: title || '',
      description: description || '',
      imageUrl,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json({ image });
}