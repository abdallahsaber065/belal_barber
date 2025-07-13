import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Public client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for backend operations with elevated permissions
// Only create if service role key is available (server-side only)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Database types
export interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: string
  icon: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Offer {
  id: string
  title: string
  description: string
  discount_percentage: number
  valid_until: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  message: string
  created_at: string
}

export interface Reservation {
  id: string
  name: string
  phone: string
  email?: string
  service_id: string
  appointment_date: string
  appointment_time: string
  notes?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

// Helper functions
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()
    
    if (error) return false
    return data?.role === 'admin'
  } catch {
    return false
  }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// SQL for database setup (run these in Supabase SQL editor)
export const databaseSetupSQL = `
-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create tables
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount_percentage INTEGER NOT NULL,
  valid_until DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create policies
CREATE POLICY "Public read access on services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access on services" ON services FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public read access on offers" ON offers FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access on offers" ON offers FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public insert on contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read access on contacts" ON contacts FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Public insert on reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access on reservations" ON reservations FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin access on users" ON users FOR ALL USING (auth.role() = 'service_role');

-- Insert default admin user (replace with your email)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@belalbarber.com', crypt('admin123', gen_salt('bf')), now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@belalbarber.com', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Insert default services
INSERT INTO services (title, description, price, duration, icon, is_active) VALUES
('حلاقة احترافية', 'حلاقة عصرية بأحدث الأساليب والتقنيات مع استخدام أدوات عالية الجودة', 'ابتداءً من 50 جنيه', '30 دقيقة', '✂️', true),
('مساج استرخاء', 'جلسات مساج متخصصة للاسترخاء وتجديد النشاط باستخدام زيوت طبيعية', 'ابتداءً من 100 جنيه', '45 دقيقة', '💆‍♂️', true),
('تنظيف بشرة', 'تنظيف عميق للبشرة وإزالة الشوائب مع استخدام منتجات طبيعية آمنة', 'ابتداءً من 80 جنيه', '60 دقيقة', '🧴', true),
('ساونا', 'جلسات ساونا منعشة للاسترخاء والتخلص من التوتر في بيئة آمنة ونظيفة', 'ابتداءً من 70 جنيه', '20 دقيقة', '🌡️', true),
('حمام مغربي', 'تجربة حمام مغربي أصيل للتنظيف العميق والاسترخاء التام', 'ابتداءً من 120 جنيه', '90 دقيقة', '🛁', true),
('حمام تركي', 'حمام تركي تقليدي للاسترخاء والتنظيف العميق مع مساج منعش', 'ابتداءً من 130 جنيه', '75 دقيقة', '🏛️', true)
ON CONFLICT DO NOTHING;
` 