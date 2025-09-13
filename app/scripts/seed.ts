
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user account (hidden credentials)
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      partnerOneName: 'John',
      partnerTwoName: 'Jane',
      name: 'John & Jane',
    },
  });

  // Seed vendor categories
  const vendorCategories = [
    { name: 'Venues', description: 'Wedding venues and reception halls', icon: 'building' },
    { name: 'Photography', description: 'Wedding photographers and videographers', icon: 'camera' },
    { name: 'Catering', description: 'Food and beverage services', icon: 'utensils' },
    { name: 'Flowers & Decor', description: 'Florists and decoration services', icon: 'flower' },
    { name: 'Music & Entertainment', description: 'DJs, bands, and entertainment', icon: 'music' },
    { name: 'Transportation', description: 'Wedding transport services', icon: 'car' },
    { name: 'Beauty & Wellness', description: 'Hair, makeup, and spa services', icon: 'sparkles' },
    { name: 'Fashion & Attire', description: 'Bridal wear and formal attire', icon: 'shirt' },
    { name: 'Stationery', description: 'Invitations and wedding stationery', icon: 'mail' },
    { name: 'Cakes & Desserts', description: 'Wedding cakes and dessert services', icon: 'cake' },
  ];

  for (const category of vendorCategories) {
    await prisma.vendorCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Seed wedding templates
  const invitationTemplates = [
    {
      type: 'invitation',
      title: 'Classic Formal Invitation',
      content: `Together with our families,
[Partner One Name] & [Partner Two Name]
request the honour of your presence
at their wedding celebration

[Date]
at [Time]
[Venue Name]
[Venue Address]

Reception to follow

RSVP by [RSVP Date]
[Contact Information]`,
      style: 'formal',
      category: 'invitation',
      tags: ['traditional', 'formal', 'classic'],
    },
    {
      type: 'invitation',
      title: 'Romantic Garden Invitation',
      content: `Love is in bloom...

[Partner One Name] & [Partner Two Name]
invite you to share in their joy
as they say "I Do"

[Date] at [Time]
[Venue Name]
[Venue Address]

Dinner and dancing to follow
Garden party attire suggested

Please RSVP by [RSVP Date]`,
      style: 'romantic',
      category: 'invitation',
      tags: ['romantic', 'garden', 'casual'],
    },
    {
      type: 'vows',
      title: 'Traditional Wedding Vows',
      content: `I, [Your Name], take you, [Partner's Name], to be my [wife/husband],
to have and to hold from this day forward,
for better, for worse,
for richer, for poorer,
in sickness and in health,
to love and to cherish,
till death do us part,
according to God's holy ordinance;
and thereto I pledge you my faith.`,
      style: 'traditional',
      category: 'vows',
      tags: ['traditional', 'religious', 'classic'],
    },
    {
      type: 'vows',
      title: 'Personal Modern Vows',
      content: `[Partner's Name],
today I choose you to be my partner in life.
I promise to love you unconditionally,
to support your dreams and ambitions,
to laugh with you in times of joy,
and to comfort you in times of sorrow.
I promise to grow alongside you,
to be your biggest cheerleader,
and your most loyal friend.
With this ring, I give you my heart,
and promise to love you for all the days of my life.`,
      style: 'modern',
      category: 'vows',
      tags: ['modern', 'personal', 'heartfelt'],
    },
  ];

  for (const template of invitationTemplates) {
    await prisma.weddingTemplate.create({
      data: template,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
