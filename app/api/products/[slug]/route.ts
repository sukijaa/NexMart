// File: app/api/products/[slug]/route.ts - EXPLICIT HANDLER TYPING

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { Product } from '@/lib/types';

// Define the expected context type for dynamic routes
type ParamsContext = {
    params: { slug: string };
};

// Define the expected function signature for a GET Route Handler
type GetHandler = (
    request: NextRequest,
    context: ParamsContext
) => Promise<NextResponse>;


// Apply the explicit type to the exported GET function
export const GET: GetHandler = async (request, { params }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const slug: string = params.slug; // Access slug directly

  if (!slug || typeof slug !== 'string') {
     console.error("API Route Error: Slug parameter is missing or invalid.");
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
};