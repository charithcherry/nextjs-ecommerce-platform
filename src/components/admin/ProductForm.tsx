'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    priceInCents: number;
    filePath: string;
    imagePath: string;
    description: string;
    isAvailableForPurchase: boolean;
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product ? (product.priceInCents / 100).toString() : '',
    filePath: product?.filePath || '',
    imagePath: product?.imagePath || '',
    description: product?.description || '',
    isAvailableForPurchase: product?.isAvailableForPurchase ?? true,
  });

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

          <div className="space-y-2">
            <Label htmlFor="imagePath">Image Path</Label>
            <Input
              id="imagePath"
              value={formData.imagePath}
              onChange={(e) => setFormData({ ...formData, imagePath: e.target.value })}
              required
              placeholder="/products/images/product.jpg"
            />
            <p className="text-sm text-muted-foreground">
              Path to the product image (for now, use placeholder paths)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filePath">File Path</Label>
            <Input
              id="filePath"
              value={formData.filePath}
              onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
              required
              placeholder="/products/files/product.pdf"
            />
            <p className="text-sm text-muted-foreground">
              Path to the downloadable file (for now, use placeholder paths)
            </p>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
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
