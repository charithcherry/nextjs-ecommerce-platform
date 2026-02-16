'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface BuyNowButtonProps {
  product: {
    id: string;
    name: string;
    priceInCents: number;
    imagePath: string;
  };
}

export function BuyNowButton({ product }: BuyNowButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleBuyNow = () => {
    // Add to cart
    addItem({
      id: product.id,
      name: product.name,
      priceInCents: product.priceInCents,
      imagePath: product.imagePath,
    });

    // Show toast
    toast({
      title: 'Added to cart',
      description: 'Redirecting to checkout...',
    });

    // Redirect to checkout after a brief delay
    setTimeout(() => {
      router.push('/checkout');
    }, 500);
  };

  return (
    <Button
      onClick={handleBuyNow}
      className="w-full"
      size="lg"
      variant="outline"
    >
      Buy Now
    </Button>
  );
}
