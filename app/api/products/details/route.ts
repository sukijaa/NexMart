// File: app/api/products/details/route.ts - USING QUERY PARAMETER

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { Product } from '@/lib/types';

export async function GET(
  request: NextRequest // Only need the request object
): Promise<NextResponse> {
  console.log("API Route GET /details handler invoked.");

  // --- Extract slug from query parameter ---
  const slug = request.nextUrl.searchParams.get('slug');
  console.log(`Extracted slug from query: "${slug}"`);

  if (!slug || typeof slug !== 'string') {
     console.error("API Route Error: Slug query parameter is missing or invalid.");
     return NextResponse.json({ error: 'Missing or invalid slug query parameter' }, { status: 400 });
  }

  // --- Database logic remains the same ---
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    console.log(`Querying Supabase for slug: "${slug}"`);
    const { data, error, status } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single<Product>();

    if (error) {
      console.error(`Supabase error fetching slug "${slug}": ${status}`, error);
      if (status === 406 || error.code === 'PGRST116') {
           return NextResponse.json({ error: 'Product not found' }, { status: 404 });
       }
       return NextResponse.json({ error: 'Database error fetching product' }, { status: 500 });
    }

    if (!data) {
       console.error(`API Route Error: Product data null for slug "${slug}"`);
       return NextResponse.json({ error: 'Product data not found' }, { status: 404 });
    }

    console.log(`Successfully fetched product for slug "${slug}"`);
    return NextResponse.json<{ product: Product }>({ product: data });

  } catch (err: unknown) {
      console.error(`API Route Critical Error for slug "${slug}":`, err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown internal server error';
      return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}