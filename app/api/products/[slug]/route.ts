// File: app/api/products/[slug]/route.ts - STANDARD SIGNATURE

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

// Standard App Router API Route Signature
export async function GET(
  request: NextRequest, // Use NextRequest
  { params }: { params: { slug: string } } // params is a plain object
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const slug = params.slug; // Access slug directly

  if (!slug) {
     console.error("API Route Error: Slug parameter is missing.");
     return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const { data, error, status } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
       // Log the specific Supabase error
      console.error(`Supabase error fetching slug "${slug}": ${status}`, error);
       // Distinguish between actual not found and other DB errors
      if (status === 406 || error.code === 'PGRST116') { // PGRST116 = row not found from .single()
           return NextResponse.json({ error: 'Product not found' }, { status: 404 });
       }
       // Other potential database errors
       return NextResponse.json({ error: 'Database error fetching product' }, { status: 500 });
    }

    if (!data) {
       console.error(`API Route Error: Product data is unexpectedly null for slug "${slug}" even without Supabase error.`);
       return NextResponse.json({ error: 'Product data not found' }, { status: 404 });
    }

    return NextResponse.json({ product: data });

  } catch (err) {
      console.error(`API Route Critical Error for slug "${slug}":`, err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}