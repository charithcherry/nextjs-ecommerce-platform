import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, priceInCents, filePath, imagePath, description, isAvailableForPurchase, categoryIds } = body;

    // Handle category updates separately if provided
    const categoryUpdate = categoryIds !== undefined ? {
      set: [], // First disconnect all
      connect: categoryIds.map((catId: string) => ({ id: catId })), // Then connect new ones
    } : undefined;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(priceInCents && { priceInCents: parseInt(priceInCents) }),
        ...(filePath && { filePath }),
        ...(imagePath && { imagePath }),
        ...(description && { description }),
        ...(typeof isAvailableForPurchase === 'boolean' && { isAvailableForPurchase }),
        ...(categoryUpdate && { categories: categoryUpdate }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Soft-delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if product has orders
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Soft-delete the product to preserve order history
    await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({
      message: 'Product deleted successfully',
      hasOrders: product._count.orders > 0,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
