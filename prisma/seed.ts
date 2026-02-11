import * as bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/db';

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log('Admin user created:', admin.email);

  // Create sample products
  const products = [
    {
      name: 'Premium E-Book: Web Development Guide',
      priceInCents: 2999,
      filePath: '/products/files/web-dev-guide.pdf',
      imagePath: '/products/images/web-dev.jpg',
      description: 'Complete guide to modern web development with React, Next.js, and TypeScript. Includes 300+ pages of content, code examples, and best practices.',
      isAvailableForPurchase: true,
    },
    {
      name: 'Video Course: JavaScript Mastery',
      priceInCents: 4999,
      filePath: '/products/files/js-mastery-course.zip',
      imagePath: '/products/images/js-course.jpg',
      description: '10 hours of comprehensive JavaScript training covering ES6+, async programming, and modern frameworks. Perfect for intermediate developers.',
      isAvailableForPurchase: true,
    },
    {
      name: 'UI Design Templates Pack',
      priceInCents: 1999,
      filePath: '/products/files/ui-templates.zip',
      imagePath: '/products/images/ui-templates.jpg',
      description: '50+ professional UI templates for Figma and Sketch. Includes landing pages, dashboards, and mobile app designs.',
      isAvailableForPurchase: true,
    },
    {
      name: 'Python Data Science Bundle',
      priceInCents: 5999,
      filePath: '/products/files/python-ds-bundle.zip',
      imagePath: '/products/images/python-ds.jpg',
      description: 'Complete data science package including Jupyter notebooks, datasets, and video tutorials. Covers pandas, NumPy, and machine learning.',
      isAvailableForPurchase: true,
    },
    {
      name: 'Stock Photo Collection',
      priceInCents: 999,
      filePath: '/products/files/stock-photos.zip',
      imagePath: '/products/images/stock-photos.jpg',
      description: '100 high-resolution stock photos for commercial use. Perfect for websites, presentations, and marketing materials.',
      isAvailableForPurchase: true,
    },
    {
      name: 'Coming Soon: Advanced TypeScript',
      priceInCents: 3999,
      filePath: '/products/files/typescript-advanced.pdf',
      imagePath: '/products/images/typescript.jpg',
      description: 'Deep dive into TypeScript advanced features, generics, decorators, and type manipulation. Release date: Next month.',
      isAvailableForPurchase: false,
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  console.log(`Created ${products.length} sample products`);

  // Create a sample customer user
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      isAdmin: false,
    },
  });

  console.log('Sample customer created:', customer.email);

  // Create a sample order
  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.order.create({
      data: {
        pricePaidInCents: firstProduct.priceInCents,
        userId: customer.id,
        productId: firstProduct.id,
      },
    });
    console.log('Sample order created');
  }

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
