import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [settings, sections, products, gallery] = await Promise.all([
      db.siteSetting.findMany(),
      db.pageSection.findMany({ orderBy: { section: 'asc' } }),
      db.product.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
      db.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);

    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({ settings: settingsMap, sections, products, gallery });
  } catch {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}