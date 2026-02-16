import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductSearch } from '@/components/ProductSearch';
import { Header } from '@/components/Header';
import { formatPrice } from '@/lib/format';
import { prisma } from '@/lib/db';
import { ProductImage } from '@/components/products/ProductImage';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; sortBy?: string; order?: string }>;
}) {
  const { search, category, sortBy = 'createdAt', order = 'desc' } = await searchParams;

  const where: any = {
    isAvailableForPurchase: true,
    isDeleted: false,
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (category) {
    where.categories = {
      some: {
        slug: category,
      },
    };
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sortBy]: order },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground mb-6">
            Browse our complete collection of digital products
          </p>
          <ProductSearch categories={categories} />
        </div>

        {search && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing results for "{search}" ({products.length} {products.length === 1 ? 'product' : 'products'})
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video rounded-md mb-4 relative overflow-hidden">
                  <ProductImage
                    src={product.imagePath}
                    alt={product.name}
                    className="rounded-md"
                  />
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
              <CardFooter className="flex gap-2">
                <Link href={`/products/${product.id}`} className="flex-1">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No products available at the moment.
            </p>
            <p className="text-muted-foreground mt-2">
              Check back soon for new releases!
            </p>
          </div>
        )}
      </main>
    </>
  );
}
