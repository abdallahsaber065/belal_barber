# Belal Barber – Barber & Spa

> A professional website for a men’s barbershop and spa in Alexandria

&#x20; &#x20;

## 🌟 Features

### 📱 User Experience

* **Responsive design** – Works smoothly across all devices
* **Arabic support** – Full RTL layout with Cairo & Inter fonts
* **Smooth animations** – Powered by Framer Motion
* **Optimized performance** – Fast and lightweight

### 🎨 Professional Design

* **Themed colors** – Orange & gold palette for barbershop branding
* **Custom icons** – Barber and spa related visuals
* **Visual effects** – Shadows, gradients, and transitions
* **Custom loaders** – Themed barber animations

### 🔧 Advanced Functionality

* **Service management** – View and manage services list
* **Contact form** – Validated and saved to database
* **Admin dashboard** – Manage site and content
* **Supabase integration** – Reliable cloud database

## 🏗️ Tech Stack

### Frontend

* **Next.js 14+** – Modern React framework
* **TypeScript** – Type-safe development
* **Tailwind CSS** – Utility-first styling
* **Framer Motion** – Animations
* **React Hook Form** – Form handling
* **React Hot Toast** – Notifications

### Backend & Database

* **Supabase** – PostgreSQL with auto API
* **Supabase Auth** – Authentication system
* **Row Level Security** – Data security

### Tools & Services

* **Lucide React** – Icon library
* **clsx & tailwind-merge** – CSS class utilities
* **PostCSS & Autoprefixer** – CSS processing

## 📁 Project Structure

```bash
belal_barber/
├── components/          # Reusable components
│   ├── Header.tsx      # Header
│   ├── Footer.tsx      # Footer
│   ├── LoaderBarber.tsx # Custom loaders
│   └── ServiceCard.tsx  # Service card
├── pages/              # Site pages
│   ├── index.tsx       # Home
│   ├── services.tsx    # Services
│   ├── contact.tsx     # Contact
│   ├── admin-xyz123.tsx # Admin dashboard
│   ├── _app.tsx        # Next.js app entry
│   ├── _document.tsx   # Base HTML
│   └── api/            # API routes
│       ├── services.ts # Services API
│       └── contacts.ts # Contacts API
├── lib/                # Utilities
│   ├── supabaseClient.ts # Supabase client
│   └── utils.ts        # Helper functions
├── styles/             # Styling
│   └── globals.css     # Global styles
├── config.json         # Content settings
└── README.md
```

## 🚀 Quick Start

### 1. Clone the project

```bash
git clone <repository-url>
cd belal_barber
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup environment variables

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SECRET_ROUTE=admin-xyz123
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Setup database

Run the SQL commands from `lib/supabaseClient.ts` in the Supabase SQL editor.

### 5. Run the project

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Services

* `id` – UUID (Primary Key)
* `title`, `description`, `price`, `duration`, `icon`
* `is_active`
* `created_at`, `updated_at`

### Contacts

* `id`, `name`, `email`, `phone`, `message`
* `created_at`

### Reservations

* `id`, `name`, `phone`, `email`
* `service_id`, `appointment_date`, `appointment_time`
* `status` (pending, confirmed, cancelled)
* `created_at`, `updated_at`

## 🎨 Customization

### Content

Editable via `config.json`:

```json
{
  "site": {
    "name": "Belal Barber – Barber & Spa",
    "tagline": "Enjoy a premium and healthy grooming experience"
  },
  "services": {
    "items": [
      {
        "id": "haircut",
        "title": "Professional Haircut",
        "description": "Modern styles with expert precision",
        "price": "From 50 EGP",
        "duration": "30 min",
        "icon": "✂️"
      }
    ]
  }
}
```

### Styling

* Colors configured in `tailwind.config.js`
* Fonts imported in `globals.css` (Cairo & Inter)

## 🔐 Admin Dashboard

### Access

* Route: `/admin-xyz123` (customizable via env vars)
* Default login:

  * Email: `admin@belalbarber.com`
  * Password: `admin123`

### Features

* Dashboard overview
* Service management
* Contact management
* Reservation management
* System settings

## 📱 Pages

* **Home** (`/`) – Hero, services preview, testimonials
* **Services** (`/services`) – List of services
* **Contact** (`/contact`) – Contact info, form, FAQ, map
* **Admin** (`/admin-xyz123`) – Admin dashboard

## 🚀 Deployment

### Netlify

* Build command: `npm run build`
* Publish directory: `out`
* Add env vars in Netlify dashboard

### Vercel

```bash
npx vercel
```

Follow the setup and add environment variables.

## 🔒 Security

* Supabase Row Level Security enabled
* Auth required for admin routes
* API keys stored in env vars
* Data validation & sanitization

