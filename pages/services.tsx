import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, Phone, Star } from 'lucide-react'
import { ServiceGrid, FeaturedServiceCard, CompactServiceCard } from '../components/ServiceCard'
import { BarberLoader, ServiceCardSkeleton } from '../components/LoaderBarber'
import { supabase } from '../lib/supabaseClient'
import config from '../config.json'

interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: string
  icon: string
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      // Try to fetch from Supabase first
      const { data: supabaseServices, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) {
        console.log('Using config services as fallback')
        // Fallback to config services
        const configServices = config.services.items.map(service => ({
          id: service.id,
          title: service.title,
          description: service.description,
          price: service.price,
          duration: service.duration,
          icon: service.icon
        }))
        setServices(configServices)
      } else {
        setServices(supabaseServices || [])
      }
    } catch (error) {
      console.error('Error loading services:', error)
      // Fallback to config services
      const configServices = config.services.items.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration,
        icon: service.icon
      }))
      setServices(configServices)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'جميع الخدمات', icon: '🏠' },
    { id: 'haircut', name: 'خدمات الحلاقة', icon: '✂️' },
    { id: 'spa', name: 'خدمات السبا', icon: '🧴' },
    { id: 'massage', name: 'خدمات المساج', icon: '💆‍♂️' },
    { id: 'bath', name: 'خدمات الحمام', icon: '🛁' },
  ]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
                           service.id.includes(selectedCategory) ||
                           (selectedCategory === 'haircut' && service.id === 'haircut') ||
                           (selectedCategory === 'spa' && (service.id === 'facial' || service.id === 'sauna')) ||
                           (selectedCategory === 'massage' && service.id === 'massage') ||
                           (selectedCategory === 'bath' && (service.id === 'moroccan-bath' || service.id === 'turkish-bath'))
    
    return matchesSearch && matchesCategory
  })

  const featuredServices = services.slice(0, 3)

  return (
    <>
      <Head>
        <title>{config.services.title} - {config.site.name}</title>
        <meta name="description" content={config.services.subtitle} />
        <meta name="keywords" content="خدمات حلاقة, سبا, مساج, حمام مغربي, حمام تركي, تنظيف بشرة, الإسكندرية" />
      </Head>

      {/* Hero Section */}
      <section className="hero-background py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
                {config.services.title}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                {config.services.subtitle}
              </p>
              <div className="section-divider bg-gradient-to-r from-gold-400 to-gold-600" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              الخدمات المميزة
            </h2>
            <div className="section-divider" />
            <p className="text-secondary-600 max-w-2xl mx-auto">
              أبرز خدماتنا المتخصصة التي نقدمها بأعلى مستوى من الجودة
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex justify-center">
                  <BarberLoader type="sparkles" size="lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => (
                <FeaturedServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Listing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="ابحث عن خدمة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pr-10"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-secondary-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-primary-500 shadow-sm' 
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-primary-500 shadow-sm' 
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Services Grid/List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <ServiceCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <ServiceGrid services={filteredServices} />
              ) : (
                <div className="space-y-4">
                  {filteredServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CompactServiceCard service={service} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                لا توجد خدمات متاحة
              </h3>
              <p className="text-secondary-600 mb-4">
                جرب البحث بكلمات مختلفة أو اختر فئة أخرى
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="btn-primary"
              >
                إعادة تعيين البحث
              </button>
            </div>
          )}

          {/* Results Summary */}
          {!loading && filteredServices.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-secondary-600">
                عرض {filteredServices.length} من {services.length} خدمة
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              لماذا تختار مقص بلال؟
            </h2>
            <div className="section-divider" />
            <p className="text-secondary-300 max-w-2xl mx-auto">
              {config.about.mission}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {config.about.values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{value}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              جاهز لتجربة خدماتنا؟
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              احجز موعدك الآن واستمتع بتجربة فريدة في أفضل صالون للرجال
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${config.contact.phone.value}`}
                className="btn-gold text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 ml-2" />
                {config.hero.ctaText}
              </a>
              <a
                href={`https://wa.me/${config.contact.phone.value.replace(/\D/g, '')}`}
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-500 text-lg px-8 py-4 inline-flex items-center justify-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 