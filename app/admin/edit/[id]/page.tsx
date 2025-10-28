// File: app/admin/edit/[id]/page.tsx

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Product } from '@/lib/types';
import ProductForm from '@/components/ProductForm';
import { updateProduct } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type EditPageProps = {
  params: { id: string };
};

export default async function EditProductPage({ params }: EditPageProps) {
  // FIX FOR TURBOPACK BUG:
  const resolvedParams = await params;
  const { id } = resolvedParams; // Use the resolved params

  // 1. Fetch the product data on the server
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const product: Product = data;

  // 2. This is the "next-level" part.
  // We bind the 'id' to the server action *here on the server*.
  // The client-side form will just call this function,
  // without ever knowing the product's ID.
  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Edit: {product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 3. We pass the action and the default data to the client form */}
          <ProductForm
            action={updateProductWithId}
            defaultValues={product}
          />
        </CardContent>
      </Card>
    </div>
  );
}