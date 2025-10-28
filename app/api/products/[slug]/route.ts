// File: app/api/products/[slug]/route.ts - FORCING PROMISE SIGNATURE FOR VERCEL BUILD

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

// Explicitly use the Promise signature that the build error seems to expect
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> } // Force Promise type
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Await the params object as required by this signature
  const params = await context.params;
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
    console.error(`Error fetching product with slug "${slug}" in Vercel build context:`, error);
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

   if (!data) {
      console.error(`Product data is unexpectedly null for slug "${slug}" in Vercel build context.`);
      return NextResponse.json({ error: 'Product data not found' }, { status: 404 });
   }

  return NextResponse.json({ product: data });
}

// Keep removed: export const dynamic = "force-dynamic";