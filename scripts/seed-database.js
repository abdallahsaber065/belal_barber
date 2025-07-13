const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const services = [
  {
    title: 'حلاقة احترافية',
    description: 'حلاقة عصرية بأحدث الأساليب والتقنيات مع استخدام أدوات عالية الجودة',
    price: 'ابتداءً من 50 جنيه',
    duration: '30 دقيقة',
    icon: '✂️',
    is_active: true
  },
  {
    title: 'مساج استرخاء',
    description: 'جلسات مساج متخصصة للاسترخاء وتجديد النشاط باستخدام زيوت طبيعية',
    price: 'ابتداءً من 100 جنيه',
    duration: '45 دقيقة',
    icon: '💆‍♂️',
    is_active: true
  },
  {
    title: 'تنظيف بشرة',
    description: 'تنظيف عميق للبشرة وإزالة الشوائب مع استخدام منتجات طبيعية آمنة',
    price: 'ابتداءً من 80 جنيه',
    duration: '60 دقيقة',
    icon: '🧴',
    is_active: true
  },
  {
    title: 'ساونا',
    description: 'جلسات ساونا منعشة للاسترخاء والتخلص من التوتر في بيئة آمنة ونظيفة',
    price: 'ابتداءً من 70 جنيه',
    duration: '20 دقيقة',
    icon: '🌡️',
    is_active: true
  },
  {
    title: 'حمام مغربي',
    description: 'تجربة حمام مغربي أصيل للتنظيف العميق والاسترخاء التام',
    price: 'ابتداءً من 120 جنيه',
    duration: '90 دقيقة',
    icon: '🛁',
    is_active: true
  },
  {
    title: 'حمام تركي',
    description: 'حمام تركي تقليدي للاسترخاء والتنظيف العميق مع مساج منعش',
    price: 'ابتداءً من 130 جنيه',
    duration: '75 دقيقة',
    icon: '🏛️',
    is_active: true
  }
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create services
  console.log('Creating services...')
  for (const service of services) {
    try {
      await prisma.service.create({
        data: service
      })
    } catch (error) {
      // Service might already exist, skip
      console.log(`Service "${service.title}" already exists, skipping...`)
    }
  }

  // Create admin user
  console.log('Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  await prisma.user.upsert({
    where: { email: 'admin@belalbarber.com' },
    update: {
      password: hashedPassword,
      role: 'admin'
    },
    create: {
      email: 'admin@belalbarber.com',
      password: hashedPassword,
      role: 'admin'
    }
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 