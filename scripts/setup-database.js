const { neon } = require('@neondatabase/serverless')
const bcrypt = require('bcryptjs')
require('dotenv').config()

async function setupDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    console.log('🚀 Setting up database...')
    
    const sql = neon(process.env.DATABASE_URL)
    
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price TEXT NOT NULL,
        duration TEXT NOT NULL,
        icon TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    await sql`
      CREATE TABLE IF NOT EXISTS offers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        discount_percentage INTEGER NOT NULL,
        valid_until DATE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    await sql`
      CREATE TABLE IF NOT EXISTS reservations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        service_id UUID REFERENCES services(id),
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);`
    await sql`CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(appointment_date);`
    await sql`CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);`
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`
    
    // Insert default services
    await sql`
      INSERT INTO services (title, description, price, duration, icon, is_active) VALUES
      ('حلاقة احترافية', 'حلاقة عصرية بأحدث الأساليب والتقنيات مع استخدام أدوات عالية الجودة', 'ابتداءً من 50 جنيه', '30 دقيقة', '✂️', true),
      ('مساج استرخاء', 'جلسات مساج متخصصة للاسترخاء وتجديد النشاط باستخدام زيوت طبيعية', 'ابتداءً من 100 جنيه', '45 دقيقة', '💆‍♂️', true),
      ('تنظيف بشرة', 'تنظيف عميق للبشرة وإزالة الشوائب مع استخدام منتجات طبيعية آمنة', 'ابتداءً من 80 جنيه', '60 دقيقة', '🧴', true),
      ('ساونا', 'جلسات ساونا منعشة للاسترخاء والتخلص من التوتر في بيئة آمنة ونظيفة', 'ابتداءً من 70 جنيه', '20 دقيقة', '🌡️', true),
      ('حمام مغربي', 'تجربة حمام مغربي أصيل للتنظيف العميق والاسترخاء التام', 'ابتداءً من 120 جنيه', '90 دقيقة', '🛁', true),
      ('حمام تركي', 'حمام تركي تقليدي للاسترخاء والتنظيف العميق مع مساج منعش', 'ابتداءً من 130 جنيه', '75 دقيقة', '🏛️', true)
      ON CONFLICT DO NOTHING;
    `
    
    // Insert default admin user with hashed password
    const adminPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    await sql`
      INSERT INTO users (id, email, password, role) VALUES 
      ('admin-user-id', 'admin@belalbarber.com', ${hashedPassword}, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `
    
    console.log('✅ Database setup completed successfully!')
    console.log('📊 Default services have been inserted')
    console.log('👤 Default admin user created: admin@belalbarber.com')
    console.log('🔑 Default admin password: admin123')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
setupDatabase() 