// File: app/products/[slug]/page.tsx

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
// Button removed as it's replaced by AddToCartButton
import { Product } from '@/lib/types';
import { cookies } from 'next/headers';
import AddToCartButton from '@/components/AddToCartButton'; // Correctly imported

// Use SSR to avoid Turbopack caching/params bug
export const dynamic = 'force-dynamic';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fix for Turbopack bug: await params
  const resolvedParams = await params;

  const { data: product } = (await supabase
    .from('products')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()) as { data: Product | null };

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Image Column */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
          <Image
            // Use key prop with image_url to force re-render if URL changes
            key={product.image_url}
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority // Prioritize loading image on product page
          />
        </div>

        {/* Details Column */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-3xl font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-lg text-gray-700">{product.description || 'No description available.'}</p>

          <div>
            {product.inventory > 0 ? (
              <span className="text-green-600 font-semibold">
                In Stock ({product.inventory} available)
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>

          <AddToCartButton
            product={product}
            size="lg"
            className="w-full md:w-auto"
            disabled={product.inventory === 0}
          />
        </div>
      </div>
    </main>
  );
}