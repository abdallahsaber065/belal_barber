# مقص بلال – Barber & Spa

> موقع إلكتروني احترافي لصالون حلاقة وسبا رجالي في الإسكندرية

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-green?style=flat-square&logo=supabase)](https://supabase.com/)

## 🌟 المميزات

### 📱 تجربة مستخدم مميزة

- **تصميم متجاوب** - يعمل بسلاسة على جميع الأجهزة
- **دعم اللغة العربية** - تصميم RTL كامل مع خطوط Cairo & Inter
- **أنيميشن سلس** - باستخدام Framer Motion
- **سرعة فائقة** - مُحسن للأداء والسرعة

### 🎨 تصميم احترافي

- **ألوان موضوعية** - درجات البرتقالي والذهبي للحلاقة
- **أيكونات مخصصة** - رموز متعلقة بالحلاقة والسبا
- **تأثيرات بصرية** - ظلال وتدرجات احترافية
- **محمّلات مخصصة** - أنيميشن تحميل بثيم الحلاقة

### 🔧 وظائف متقدمة

- **إدارة الخدمات** - عرض وإدارة قائمة الخدمات
- **نموذج تواصل** - مع التحقق والحفظ في قاعدة البيانات
- **لوحة تحكم إدارية** - لإدارة الموقع والمحتوى
- **تكامل Supabase** - قاعدة بيانات سحابية موثوقة

## 🏗️ البنية التقنية

### التقنيات المستخدمة

#### Frontend

- **Next.js 14+** - إطار عمل React للتطبيقات الحديثة
- **TypeScript** - للكتابة الآمنة والخالية من الأخطاء
- **Tailwind CSS** - لتصميم سريع ومرن
- **Framer Motion** - للأنيميشن والحركات السلسة
- **React Hook Form** - لإدارة النماذج
- **React Hot Toast** - للإشعارات

#### Backend & Database

- **Supabase** - قاعدة بيانات PostgreSQL مع API جاهز
- **Supabase Auth** - نظام المصادقة
- **Row Level Security** - الأمان على مستوى الصفوف

#### Tools & Services

- **Lucide React** - مكتبة الأيقونات
- **clsx & tailwind-merge** - لدمج الـ CSS classes
- **PostCSS & Autoprefixer** - لمعالجة CSS

## 📁 هيكل المشروع

```bash
belal_barber/
├── components/          # المكونات القابلة لإعادة الاستخدام
│   ├── Header.tsx      # رأس الصفحة
│   ├── Footer.tsx      # تذييل الصفحة
│   ├── LoaderBarber.tsx # محمّلات مخصصة
│   └── ServiceCard.tsx  # بطاقة الخدمة
├── pages/              # صفحات الموقع
│   ├── index.tsx       # الصفحة الرئيسية
│   ├── services.tsx    # صفحة الخدمات
│   ├── contact.tsx     # صفحة التواصل
│   ├── admin-xyz123.tsx # لوحة التحكم الإدارية
│   ├── _app.tsx        # تطبيق Next.js الرئيسي
│   ├── _document.tsx   # هيكل HTML الأساسي
│   └── api/            # API Routes
│       ├── services.ts # إدارة الخدمات
│       └── contacts.ts # إدارة الرسائل
├── lib/                # المكتبات والوظائف المساعدة
│   ├── supabaseClient.ts # عميل Supabase
│   └── utils.ts        # وظائف مساعدة
├── styles/             # ملفات التصميم
│   └── globals.css     # التصميم العام
├── config.json         # إعدادات المحتوى
└── README.md          # هذا الملف
```

## 🚀 البدء السريع

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd belal_barber
```

### 2. تثبيت المتطلبات

```bash
npm install
# أو
yarn install
```

### 3. إعداد متغيرات البيئة

```bash
cp .env.local.example .env.local
```

قم بتحديث `.env.local` بمعلومات Supabase الخاصة بك:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Configuration
ADMIN_SECRET_ROUTE=admin-xyz123

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. إعداد قاعدة البيانات

قم بتشغيل SQL commands الموجودة في `lib/supabaseClient.ts` في Supabase SQL Editor:

```sql
-- إنشاء الجداول وإعدادات الأمان
-- موجود في ملف lib/supabaseClient.ts
```

### 5. تشغيل المشروع

```bash
npm run dev
# أو
yarn dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## 📊 قاعدة البيانات

### جداول قاعدة البيانات

#### Services (الخدمات)

- `id` - UUID (Primary Key)
- `title` - نص الخدمة
- `description` - وصف الخدمة
- `price` - السعر
- `duration` - المدة الزمنية
- `icon` - الأيقونة (emoji)
- `is_active` - حالة النشاط
- `created_at`, `updated_at` - أوقات الإنشاء والتحديث

#### Contacts (الرسائل)

- `id` - UUID (Primary Key)
- `name` - اسم المرسل
- `email` - البريد الإلكتروني (اختياري)
- `phone` - رقم الهاتف
- `message` - نص الرسالة
- `created_at` - وقت الإرسال

#### Reservations (الحجوزات)

- `id` - UUID (Primary Key)
- `name` - اسم العميل
- `phone` - رقم الهاتف
- `email` - البريد الإلكتروني (اختياري)
- `service_id` - معرف الخدمة
- `appointment_date` - تاريخ الموعد
- `appointment_time` - وقت الموعد
- `status` - حالة الحجز (pending, confirmed, cancelled)
- `created_at`, `updated_at` - أوقات الإنشاء والتحديث

## 🎨 التخصيص

### تخصيص المحتوى

كل محتوى الموقع قابل للتخصيص من خلال ملف `config.json`:

```json
{
  "site": {
    "name": "مقص بلال – Barber & Spa",
    "tagline": "استمتع بخدمة حلاقه و سبا رجالى مميزه صحيه 100٪"
  },
  "services": {
    "items": [
      {
        "id": "haircut",
        "title": "حلاقة احترافية",
        "description": "حلاقة عصرية بأحدث الأساليب",
        "price": "ابتداءً من 50 جنيه",
        "duration": "30 دقيقة",
        "icon": "✂️"
      }
    ]
  }
}
```

### تخصيص التصميم

#### الألوان

```javascript
// tailwind.config.js
colors: {
  primary: { /* درجات البرتقالي */ },
  secondary: { /* درجات الرمادي */ },
  gold: { /* درجات الذهبي */ }
}
```

#### الخطوط

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
```

## 🔐 لوحة التحكم الإدارية

### الوصول

- الرابط: `/admin-xyz123` (يمكن تغييره من متغيرات البيئة)
- بيانات الدخول الافتراضية:
  - البريد الإلكتروني: `admin@belalbarber.com`
  - كلمة المرور: `admin123`

### المميزات

- **لوحة المعلومات** - إحصائيات سريعة
- **إدارة الخدمات** - إضافة، تعديل، حذف الخدمات
- **إدارة الرسائل** - عرض رسائل العملاء
- **إدارة الحجوزات** - تأكيد أو إلغاء الحجوزات
- **الإعدادات** - عرض إعدادات النظام

## 📱 الصفحات

### 🏠 الصفحة الرئيسية (`/`)

- بانر ترحيبي مع CTA
- إحصائيات المشروع
- معاينة الخدمات المميزة
- آراء العملاء
- دعوة للعمل النهائية

### 📞 صفحة التواصل (`/contact`)

- معلومات التواصل
- نموذج اتصال متقدم
- خريطة (placeholder)
- أسئلة شائعة
- أزرار اتصال سريع

## 🚀 النشر

### نشر على Netlify

1. **دفع الكود إلى Git Repository**

    ```bash
    git add .
    git commit -m "Initial commit"
    git push origin main
    ```

2. **ربط Netlify بالـ Repository**

   - اذهب إلى [netlify.com](https://netlify.com)
   - اختر "New site from Git"
   - اختر repository الخاص بك

3. **إعدادات البناء**

    ```bash
    Build command: npm run build
    Publish directory: out
    ```

4. **إضافة متغيرات البيئة**

   - في Netlify Dashboard > Site settings > Environment variables
   - أضف جميع المتغيرات من `.env.local`

### نشر على Vercel

```bash
npx vercel
```

ثم اتبع التعليمات وأضف متغيرات البيئة.

## 🔒 الأمان

### إعدادات Supabase

- **Row Level Security** مفعل على جميع الجداول
- **المصادقة مطلوبة** للوصول لبيانات الإدارة
- **API Keys محمية** بمتغيرات البيئة

### أفضل الممارسات

- جميع API endpoints محمية بالتحقق
- تشفير كلمات المرور
- تحقق من صحة البيانات
- حماية من XSS و SQL Injection

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

#### خطأ في الاتصال بـ Supabase

```bash
Error: Invalid API key
```

**الحل:** تأكد من صحة المتغيرات في `.env.local`

#### خطأ في التصريحات

```bash
Error: Failed to load services
```

**الحل:** تأكد من تشغيل SQL setup في Supabase

#### مشكلة في الخطوط

```bash
Error loading Google Fonts
```

**الحل:** تحقق من الاتصال بالإنترنت أو استخدم خطوط محلية

## 📧 الدعم والتواصل

للدعم التقني أو الاستفسارات:

- **البريد الإلكتروني:** <info@belalbarber.com>
- **الهاتف:** +20 12 01353503
- **الموقع:** محافظة الإسكندرية - العامرية

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:

1. Fork المشروع
2. إنشاء branch للميزة الجديدة
3. Commit التغييرات
4. Push إلى البرانش
5. فتح Pull Request
