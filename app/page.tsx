// File: app/page.tsx

import { createClient } from '@/lib/supabase/server';
import ProductList from '@/components/ProductList';
import { Product } from '@/lib/types';
import { cookies } from 'next/headers'; // <-- 1. Import cookies

export default async function HomePage() {
  const cookieStore = cookies(); // <-- 2. Call cookies()
  const supabase = createClient(cookieStore); // <-- 3. Pass it in

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return <p>Error loading products.</p>;
  }
  // ... (rest of the file is fine) ...
  const products: Product[] = data || [];

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Our Product Catalog
      </h1>
      <ProductList products={products} />
    </main>
  );
}