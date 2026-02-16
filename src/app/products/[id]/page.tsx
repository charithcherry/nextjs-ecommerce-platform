import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { BuyNowButton } from '@/components/products/BuyNowButton';
import { ProductImage } from '@/components/products/ProductImage';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { prisma } from '@/lib/db';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square rounded-md relative overflow-hidden">
                  <ProductImage
                    src={product.imagePath}
                    alt={product.name}
                    className="rounded-md"
                    priority
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={product.isAvailableForPurchase ? 'default' : 'secondary'}>
                  {product.isAvailableForPurchase ? 'Available' : 'Unavailable'}
                </Badge>
                {product._count.orders > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {product._count.orders} {product._count.orders === 1 ? 'sale' : 'sales'}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mb-6">
                {formatPrice(product.priceInCents)}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="space-y-3">
              {product.isAvailableForPurchase ? (
                <>
                  <AddToCartButton product={product} />
                  <BuyNowButton product={product} />
                </>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Currently Unavailable
                </Button>
              )}
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">What's Included:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Instant digital download</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Lifetime access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Commercial use license</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
