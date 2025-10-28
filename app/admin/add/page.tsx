// File: app/admin/add/page.tsx

import ProductForm from '@/components/ProductForm';
import { createProduct } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddProductPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm action={createProduct} />
        </CardContent>
      </Card>
    </div>
  );
}