// File: app/api/products/[slug]/route.ts - REPLACE WITH THIS

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest

// Standard signature for App Router API routes
export async function GET(
  request: NextRequest, // Use NextRequest
  { params }: { params: { slug: string } } // params IS an object here
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // NO 'await params' - params is already the object
  const slug = params.slug;

  if (!slug) {
     return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching product with slug "${slug}":`, error); // Log for Vercel
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  if (!data) {
     return NextResponse.json({ error: 'Product data is unexpectedly null' }, { status: 404 });
  }

  return NextResponse.json({ product: data });
}

// REMOVED: export const dynamic = "force-dynamic"; (Not typically needed for GET routes unless bypassing cache)