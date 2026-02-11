import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your catalog
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
