import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products...');

  // Get all categories
  const categories = await prisma.category.findMany();
  const categoryMap: { [key: string]: string } = {};
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  const products = [
    // E-Books
    {
      name: 'The Complete Guide to Web Development',
      priceInCents: 2999,
      description: 'Master web development from basics to advanced concepts. Includes HTML, CSS, JavaScript, React, and Node.js. Over 500 pages of in-depth tutorials, exercises, and real-world projects.',
      imagePath: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
      filePath: '/products/web-dev-guide.pdf',
      categories: [categoryMap['ebooks']],
    },
    {
      name: 'Python for Data Science',
      priceInCents: 3499,
      description: 'Learn Python programming for data analysis, machine learning, and visualization. Covers NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow with practical examples.',
      imagePath: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      filePath: '/products/python-data-science.pdf',
      categories: [categoryMap['ebooks']],
    },
    {
      name: 'Digital Marketing Mastery',
      priceInCents: 2499,
      description: 'Comprehensive guide to modern digital marketing strategies. Learn SEO, social media marketing, email campaigns, content marketing, and analytics to grow your business online.',
      imagePath: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      filePath: '/products/digital-marketing.pdf',
      categories: [categoryMap['ebooks']],
    },
    {
      name: 'Mastering UI/UX Design',
      priceInCents: 2799,
      description: 'Learn the principles of user interface and user experience design. Includes design thinking, wireframing, prototyping, and usability testing with industry best practices.',
      imagePath: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      filePath: '/products/ui-ux-design.pdf',
      categories: [categoryMap['ebooks']],
    },

    // Templates
    {
      name: 'Modern Landing Page Template Pack',
      priceInCents: 4900,
      description: '10 professionally designed landing page templates built with HTML, CSS, and JavaScript. Fully responsive, SEO-optimized, and easy to customize. Perfect for startups and businesses.',
      imagePath: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
      filePath: '/products/landing-pages.zip',
      categories: [categoryMap['templates']],
    },
    {
      name: 'E-Commerce Dashboard UI Kit',
      priceInCents: 5900,
      description: 'Complete admin dashboard template for e-commerce applications. Built with React and Tailwind CSS. Includes 50+ components, charts, tables, and ready-to-use pages.',
      imagePath: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      filePath: '/products/dashboard-kit.zip',
      categories: [categoryMap['templates']],
    },
    {
      name: 'Professional Email Templates',
      priceInCents: 3900,
      description: '25 responsive email templates for newsletters, promotions, transactional emails, and more. Compatible with all major email clients. Includes HTML and Mailchimp versions.',
      imagePath: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800',
      filePath: '/products/email-templates.zip',
      categories: [categoryMap['templates']],
    },
    {
      name: 'Resume & Portfolio Templates',
      priceInCents: 2900,
      description: '12 modern resume and portfolio templates in multiple formats (Word, PDF, HTML). Stand out from the crowd with professionally designed layouts for various industries.',
      imagePath: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
      filePath: '/products/resume-templates.zip',
      categories: [categoryMap['templates']],
    },

    // Software
    {
      name: 'Task Manager Pro',
      priceInCents: 7900,
      description: 'Powerful desktop task management application. Features include project tracking, team collaboration, time tracking, kanban boards, and calendar integration. Windows & macOS compatible.',
      imagePath: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
      filePath: '/products/task-manager.zip',
      categories: [categoryMap['software']],
    },
    {
      name: 'Photo Editor Studio',
      priceInCents: 8900,
      description: 'Professional photo editing software with advanced features. Includes filters, retouching tools, layer support, batch processing, and RAW file support. Lifetime license.',
      imagePath: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800',
      filePath: '/products/photo-editor.zip',
      categories: [categoryMap['software']],
    },
    {
      name: 'SEO Analyzer Tool',
      priceInCents: 5900,
      description: 'Comprehensive SEO analysis tool for websites. Check rankings, analyze keywords, audit site health, track backlinks, and get actionable recommendations. Desktop application.',
      imagePath: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800',
      filePath: '/products/seo-analyzer.zip',
      categories: [categoryMap['software']],
    },

    // Graphics
    {
      name: 'Icon Pack: 1000+ Modern Icons',
      priceInCents: 3900,
      description: 'Comprehensive icon collection with over 1000 modern, minimalist icons. Available in SVG, PNG, and icon font formats. Perfect for web and mobile applications.',
      imagePath: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800',
      filePath: '/products/icon-pack.zip',
      categories: [categoryMap['graphics']],
    },
    {
      name: 'Social Media Graphics Bundle',
      priceInCents: 4900,
      description: '500+ customizable social media templates for Instagram, Facebook, Twitter, and LinkedIn. Includes posts, stories, covers, and ads. Editable in Canva and Photoshop.',
      imagePath: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      filePath: '/products/social-media-bundle.zip',
      categories: [categoryMap['graphics']],
    },
    {
      name: 'Logo Templates Collection',
      priceInCents: 5900,
      description: '200 professional logo templates across various industries. Fully customizable vector files (AI, EPS, SVG). Perfect for startups, freelancers, and small businesses.',
      imagePath: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
      filePath: '/products/logo-templates.zip',
      categories: [categoryMap['graphics']],
    },
    {
      name: 'Premium Stock Photos Pack',
      priceInCents: 6900,
      description: '1000 high-resolution stock photos covering business, lifestyle, nature, and technology. Commercial license included. Perfect for websites, presentations, and marketing.',
      imagePath: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800',
      filePath: '/products/stock-photos.zip',
      categories: [categoryMap['graphics'], categoryMap['photos']],
    },

    // Courses
    {
      name: 'Full Stack Development Bootcamp',
      priceInCents: 12900,
      description: 'Complete 40-hour video course covering frontend and backend development. Learn React, Node.js, MongoDB, authentication, deployment, and build 5 real-world projects.',
      imagePath: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      filePath: '/products/fullstack-bootcamp.zip',
      categories: [categoryMap['courses'], categoryMap['video']],
    },
    {
      name: 'Machine Learning A-Z',
      priceInCents: 14900,
      description: '50+ hours of comprehensive machine learning training. Covers supervised & unsupervised learning, neural networks, deep learning, and AI with Python. Includes code templates.',
      imagePath: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
      filePath: '/products/ml-course.zip',
      categories: [categoryMap['courses'], categoryMap['video']],
    },
    {
      name: 'Adobe Photoshop Mastery Course',
      priceInCents: 9900,
      description: 'Learn professional photo editing and graphic design with Photoshop. 30+ hours of video tutorials covering tools, techniques, and advanced features. Beginner to advanced.',
      imagePath: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800',
      filePath: '/products/photoshop-course.zip',
      categories: [categoryMap['courses'], categoryMap['video']],
    },
    {
      name: 'Business Growth Strategy Course',
      priceInCents: 11900,
      description: 'Comprehensive business course for entrepreneurs. Learn strategy, marketing, sales, finance, and operations. 35 hours of content with worksheets, templates, and case studies.',
      imagePath: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      filePath: '/products/business-course.zip',
      categories: [categoryMap['courses'], categoryMap['video']],
    },

    // Music
    {
      name: 'Royalty-Free Music Pack Vol. 1',
      priceInCents: 4900,
      description: '50 high-quality royalty-free music tracks for videos, podcasts, and presentations. Various genres including corporate, ambient, upbeat, and cinematic. MP3 and WAV formats.',
      imagePath: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
      filePath: '/products/music-pack-1.zip',
      categories: [categoryMap['music']],
    },
    {
      name: 'Sound Effects Library',
      priceInCents: 3900,
      description: '500+ professional sound effects for video production, game development, and multimedia projects. Organized by category. High-quality WAV files with commercial license.',
      imagePath: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
      filePath: '/products/sound-effects.zip',
      categories: [categoryMap['music']],
    },
    {
      name: 'Lo-Fi Beats Collection',
      priceInCents: 5900,
      description: '100 chill lo-fi hip hop beats perfect for studying, working, or relaxing. All tracks are royalty-free with commercial license. Ideal for YouTube, Twitch, and podcasts.',
      imagePath: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800',
      filePath: '/products/lofi-beats.zip',
      categories: [categoryMap['music']],
    },

    // Video
    {
      name: 'YouTube Intro Templates',
      priceInCents: 3900,
      description: '25 professional YouTube intro templates. Fully customizable in After Effects and Premiere Pro. Includes music, sound effects, and step-by-step instructions. HD and 4K ready.',
      imagePath: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
      filePath: '/products/youtube-intros.zip',
      categories: [categoryMap['video']],
    },
    {
      name: 'Stock Video Footage Bundle',
      priceInCents: 7900,
      description: '200 high-quality stock video clips covering nature, business, technology, and lifestyle. 4K resolution with commercial license. Perfect for video editors and content creators.',
      imagePath: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800',
      filePath: '/products/stock-videos.zip',
      categories: [categoryMap['video']],
    },
    {
      name: 'Motion Graphics Templates',
      priceInCents: 6900,
      description: '100+ motion graphics templates for After Effects. Includes lower thirds, titles, transitions, and animated elements. Perfect for professional video production.',
      imagePath: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
      filePath: '/products/motion-graphics.zip',
      categories: [categoryMap['video'], categoryMap['graphics']],
    },

    // Photos
    {
      name: 'Minimalist Photography Bundle',
      priceInCents: 5900,
      description: '300 stunning minimalist photos perfect for websites, social media, and print. High resolution with commercial license. Curated collection of modern, clean aesthetics.',
      imagePath: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      filePath: '/products/minimalist-photos.zip',
      categories: [categoryMap['photos']],
    },
    {
      name: 'Food Photography Collection',
      priceInCents: 4900,
      description: '250 professional food photography images. Perfect for restaurants, food blogs, menus, and cookbooks. High-resolution images with commercial rights included.',
      imagePath: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      filePath: '/products/food-photos.zip',
      categories: [categoryMap['photos']],
    },
    {
      name: 'Nature & Landscape Photos',
      priceInCents: 6900,
      description: '400 breathtaking nature and landscape photographs from around the world. Mountains, forests, oceans, and more. Ultra HD quality with extended commercial license.',
      imagePath: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      filePath: '/products/nature-photos.zip',
      categories: [categoryMap['photos']],
    },
  ];

  for (const productData of products) {
    const { categories: productCategories, ...data } = productData;

    // Check if product already exists
    const existing = await prisma.product.findFirst({
      where: { name: data.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          ...data,
          categories: {
            connect: productCategories.map(id => ({ id })),
          },
        },
      });
      console.log(`Created: ${data.name}`);
    } else {
      console.log(`Skipped (already exists): ${data.name}`);
    }
  }

  console.log(`Successfully seeded ${products.length} products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
