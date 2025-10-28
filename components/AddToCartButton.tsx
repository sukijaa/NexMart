// File: components/AddToCartButton.tsx - FINAL FIX

'use client';

import React from 'react';
// Import the underlying Button and its variants definition
import { Button, buttonVariants } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority'; // Import VariantProps
import { useCartStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

// Combine standard button attributes (excluding onClick) and Shadcn variant props
interface AddToCartButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
          VariantProps<typeof buttonVariants> {
  product: Product;
}

export default function AddToCartButton({
  product,
  variant, // Explicitly get variant
  size,    // Explicitly get size
  className, // Explicitly get className
  disabled, // Explicitly get disabled
  ...props // Pass the rest
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    // Pass the explicit props down to the Shadcn Button
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
      {...props}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}

