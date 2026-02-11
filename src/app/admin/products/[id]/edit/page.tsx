import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { prisma } from '@/lib/db';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">
          Update product details
        </p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
