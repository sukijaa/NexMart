// File: app/api/products/[slug]/route.ts

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: { slug: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { slug } = context.params; // ✅ no await here

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product: data });
}
