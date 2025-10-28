// File: app/api/products/[slug]/route.ts - ULTRA SIMPLE TEST

import { NextResponse, NextRequest } from 'next/server';

// Standard App Router API Route Signature
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } } // Using the standard signature
): Promise<NextResponse> {

  const slug = params.slug; // Access slug directly

  // Just return the slug to confirm it was accessed
  return NextResponse.json({ receivedSlug: slug });
}