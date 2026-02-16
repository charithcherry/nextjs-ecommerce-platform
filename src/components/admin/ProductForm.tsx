'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    priceInCents: number;
    filePath: string;
    imagePath: string;
    description: string;
    isAvailableForPurchase: boolean;
    categories?: Category[];
  };
  categories?: Category[];
}

export function ProductForm({ product, categories = [] }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product?.categories?.map(c => c.id) || []
  );
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product ? (product.priceInCents / 100).toString() : '',
    filePath: product?.filePath || '',
    imagePath: product?.imagePath || '',
    description: product?.description || '',
    isAvailableForPurchase: product?.isAvailableForPurchase ?? true,
  });

  const handleFileUpload = async (file: File, type: 'image' | 'file') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const { url } = await response.json();

      setFormData((prev) => ({
        ...prev,
        [type === 'image' ? 'imagePath' : 'filePath']: url,
      }));

      toast({
        title: 'Upload successful',
        description: `${type === 'image' ? 'Image' : 'File'} uploaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceInCents = Math.round(parseFloat(formData.price) * 100);

      const body = {
        name: formData.name,
        priceInCents,
        filePath: formData.filePath,
        imagePath: formData.imagePath,
        description: formData.description,
        isAvailableForPurchase: formData.isAvailableForPurchase,
        categoryIds: selectedCategories,
      };

      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      toast({
        title: product ? 'Product updated' : 'Product created',
        description: `${formData.name} has been ${product ? 'updated' : 'created'} successfully.`,
      });

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Premium E-Book"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              placeholder="29.99"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Detailed product description..."
              rows={5}
            />
          </div>

          {categories.length > 0 && (
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="cursor-pointer font-normal"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Select one or more categories for this product
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="imageUpload">Product Image</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="imageUpload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'image');
                }}
                disabled={uploading}
              />
              {formData.imagePath && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Current:</span>
                  <span className="text-primary">{formData.imagePath}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Upload a product image (JPEG, PNG, or WebP, max 10MB)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUpload">Downloadable File</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="fileUpload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'file');
                }}
                disabled={uploading}
              />
              {formData.filePath && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Current:</span>
                  <span className="text-primary">{formData.filePath}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Upload the digital product file that customers will download
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailableForPurchase"
              checked={formData.isAvailableForPurchase}
              onChange={(e) => setFormData({ ...formData, isAvailableForPurchase: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="isAvailableForPurchase" className="cursor-pointer">
              Available for purchase
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || uploading}>
              {loading ? 'Saving...' : uploading ? 'Uploading...' : product ? 'Update Product' : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/products')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
