'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  priceInCents: number;
  imagePath: string;
}

export function AddToCartButton({ product }: { product: Product }) {
  const { toast } = useToast();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      priceInCents: product.priceInCents,
      imagePath: product.imagePath,
    });

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Button onClick={handleAddToCart} className="w-full" size="lg">
      <ShoppingCart className="w-5 h-5 mr-2" />
      Add to Cart
    </Button>
  );
}
