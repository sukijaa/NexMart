// File: app/api/products/route.ts
// THIS CODE IS CORRECT

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest

// Use NextRequest for consistency
export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  console.log("Fetching all products in /api/products"); // Optional log

  try {
    const { data, error, status } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error fetching all products:", status, error);
      return NextResponse.json({ error: error.message || 'Database error fetching products' }, { status: 500 });
    }

    console.log(`Successfully fetched ${data?.length || 0} products.`);
    // Ensure data is an array, even if empty
    return NextResponse.json({ products: data ?? [] });

  } catch (err: unknown) {
      console.error("API Route Critical Error in /api/products:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown internal server error';
      return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
