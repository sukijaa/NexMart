// File: components/AddToCartButton.tsx

'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

import React from 'react';

interface AddToCartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  product: Product;
}

export default function AddToCartButton({
  product,
  ...props // Pass other button props like size, className
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  // toggleCart removed as it wasn't used in the handle function
  // const toggleCart = useCartStore((state) => state.toggleCart);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Button onClick={handleAddToCart} {...props}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}