// File: components/ProductCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-300 group-hover:scale-105"
              // ADD THIS LINE:
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold leading-tight mb-1">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {product.category}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}