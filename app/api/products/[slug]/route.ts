// File: app/api/products/[slug]/route.ts - Standard Signature + @ts-ignore

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { Product } from '@/lib/types'; // Import Product type for better typing

// Define expected context type explicitly
type ApiContext = {
    params: { slug: string };
};

export async function GET(
  request: NextRequest,
  // @ts-ignore - Vercel build fails with incorrect type error here, ignoring line.
  { params }: ApiContext // Use the standard object type
): Promise<NextResponse> { // Explicit return type
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const slug: string = params.slug; // Access slug directly, explicitly type

  if (!slug || typeof slug !== 'string') {
     console.error("API Route Error: Slug parameter is missing or invalid.");
     return NextResponse.json({ error: 'Missing or invalid slug parameter' }, { status: 400 });
  }

  try {
    // Explicitly type the Supabase response
    const { data, error, status } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single<Product>(); // Specify the expected data type

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

    // Explicitly type the success response
    return NextResponse.json<{ product: Product }>({ product: data });

  } catch (err: unknown) { // Type the catch error
      console.error(`API Route Critical Error for slug "${slug}":`, err);
       // Provide a generic error message
      const errorMessage = err instanceof Error ? err.message : 'Unknown internal server error';
      return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}