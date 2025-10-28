// File: app/api/products/[slug]/route.ts

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // FIX FOR TURBOPACK BUG:
  // The 'params' object is being sent as a Promise. We await it here.
  const resolvedParams = await params;
  const slug = resolvedParams.slug; // Use the resolved slug

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug) // Use the fixed slug variable
    .single();

  if (error) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product: data });
}