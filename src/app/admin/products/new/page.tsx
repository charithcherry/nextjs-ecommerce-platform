import { ProductForm } from '@/components/admin/ProductForm';
import { prisma } from '@/lib/db';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your catalog
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
