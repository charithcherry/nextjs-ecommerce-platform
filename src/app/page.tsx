import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { prisma } from '@/lib/db';

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to E-Shop
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover amazing digital products and resources to boost your productivity and creativity
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Featured Products</h2>
                <p className="text-muted-foreground">
                  Check out our latest and most popular items
                </p>
              </div>
              <Link href="/products">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="flex flex-col">
                  <CardHeader>
                    <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground">Product Image</span>
                    </div>
                    <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-2xl font-bold">
                      {formatPrice(product.priceInCents)}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/products/${product.id}`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {featuredProducts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No products available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground text-xl">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">Instant Download</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant access to your purchases immediately after checkout
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground text-xl">🔒</span>
                </div>
                <h3 className="font-semibold mb-2">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment information is always safe and secure
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground text-xl">💎</span>
                </div>
                <h3 className="font-semibold mb-2">Quality Products</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment information is always safe and secure
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
