// File: app/api/products/[slug]/route.ts - USING 'any' TO BYPASS BUILD TYPE ERROR

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

// Use 'any' for the context parameter to bypass the stubborn build type error
export async function GET(
  request: NextRequest,
  context: any // Force bypass TypeScript check for params
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Attempt to access slug, assuming context.params might be a Promise or object
  let slug: string | undefined;
  try {
    // Check if params needs to be awaited (like in Turbopack dev)
    // or if it's already an object (like in standard build)
    const paramsObject = await context.params || context.params;
    slug = paramsObject?.slug;
  } catch (e) {
      console.error("Error accessing context.params in API route:", e);
      return NextResponse.json({ error: 'Internal server error processing request parameters' }, { status: 500 });
  }


  if (!slug) {
     console.error("API Route Error: Slug parameter could not be resolved.");
     return NextResponse.json({ error: 'Missing or invalid slug parameter' }, { status: 400 });
  }

  try {
    const { data, error, status } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

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

    return NextResponse.json({ product: data });

  } catch (err) {
      console.error(`API Route Critical Error for slug "${slug}":`, err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}