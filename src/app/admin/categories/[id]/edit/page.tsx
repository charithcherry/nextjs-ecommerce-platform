import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { prisma } from '@/lib/db';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground">
          Update category details
        </p>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
