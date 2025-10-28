// File: app/api/products/[slug]/route.ts - LET TYPESCRIPT INFER PARAMS

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server'; // Keep NextRequest for type safety on request object if needed later
import { Product } from '@/lib/types';

// REMOVED explicit type annotations for request and context
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    console.log("API Route GET handler invoked."); // Log start
    console.log("Received params object:", JSON.stringify(params, null, 2)); // Log the received params

    // --- Type Guard ---
    // Explicitly check if params and params.slug exist and are strings
    if (!params || typeof params.slug !== 'string') {
        console.error("API Route Error: Invalid or missing slug in params:", params);
        return NextResponse.json({ error: 'Invalid or missing slug parameter' }, { status: 400 });
    }
    // If the guard passes, we know params.slug is a string
    const slug: string = params.slug;
    console.log(`Extracted slug: "${slug}"`);

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