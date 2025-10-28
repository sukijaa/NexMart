// File: app/api/products/[slug]/route.ts - FORCING VERCEL's INCORRECT PROMISE SIGNATURE

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { Product } from '@/lib/types';

// Define the incorrect type that Vercel's build seems to demand
type VercelBuildContext = {
    params: Promise<{ slug: string }>; // Explicitly using Promise here
};

export async function GET(
  request: NextRequest,
  context: VercelBuildContext // Using the incorrect type Vercel expects
): Promise<NextResponse> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let slug: string | undefined;
  try {
      // Await the params object because we typed context with a Promise
      const params = await context.params;
      slug = params.slug;
  } catch (e) {
      console.error("API Route Error: Failed awaiting context.params:", e);
      return NextResponse.json({ error: 'Internal server error processing request parameters' }, { status: 500 });
  }


  if (!slug || typeof slug !== 'string') {
     console.error("API Route Error: Slug parameter is missing or invalid after await.");
     return NextResponse.json({ error: 'Missing or invalid slug parameter' }, { status: 400 });
  }

  try {
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

    return NextResponse.json<{ product: Product }>({ product: data });

  } catch (err: unknown) {
      console.error(`API Route Critical Error for slug "${slug}":`, err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown internal server error';
      return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}