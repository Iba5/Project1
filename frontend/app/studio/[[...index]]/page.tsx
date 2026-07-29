// app/studio/[[...index]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  // Add this temporary diagnostic log:
  console.log("MY PROJECT ID IS:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

  return <NextStudio config={config} />
}
