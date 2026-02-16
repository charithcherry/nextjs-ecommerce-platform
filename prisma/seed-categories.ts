import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories...');

  const categories = [
    { name: 'E-Books', slug: 'ebooks' },
    { name: 'Templates', slug: 'templates' },
    { name: 'Software', slug: 'software' },
    { name: 'Graphics', slug: 'graphics' },
    { name: 'Courses', slug: 'courses' },
    { name: 'Music', slug: 'music' },
    { name: 'Video', slug: 'video' },
    { name: 'Photos', slug: 'photos' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
