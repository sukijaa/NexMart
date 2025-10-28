// File: app/dashboard/page.tsx

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// This is the key to forcing Server-Side Rendering (SSR)
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch all products to calculate stats
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    return <p className="container p-8">Error loading data.</p>;
  }

  // --- Calculate Stats ---

  // 1. Total Products
  const totalProducts = products.length;

  // 2. Low Stock Items (e.g., inventory < 20)
  const lowStockThreshold = 20;
  const lowStockItems = products.filter(
    (product) => product.inventory < lowStockThreshold
  );
  const lowStockCount = lowStockItems.length;

  // 3. Total Inventory Value
  const totalInventoryValue = products.reduce(
    (acc, product) => acc + product.price * product.inventory,
    0
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
        <Button asChild>
          <Link href="/admin">Go to Admin Panel</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card: Total Products */}
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>

        {/* Stat Card: Low Stock */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{lowStockCount}</p>
            <p className="text-sm text-gray-500">
              (Threshold: &lt; {lowStockThreshold} units)
            </p>
          </CardContent>
        </Card>

        {/* Stat Card: Inventory Value */}
        <Card>
          <CardHeader>
            <CardTitle>Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              ${totalInventoryValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* List of Low Stock Items */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">
          Items Running Low
        </h2>
        <Card>
          <CardContent className="pt-6">
            {lowStockCount > 0 ? (
              <ul className="divide-y divide-gray-200">
                {lowStockItems.map((product) => (
                  <li
                    key={product.id}
                    className="flex justify-between items-center py-3"
                  >
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.category}
                      </p>
                    </div>
                    <span className="font-bold text-red-600">
                      Only {product.inventory} left
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">
                All products are well-stocked!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}