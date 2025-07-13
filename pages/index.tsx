import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, Star, CheckCircle, ArrowLeft, Sparkles, Users, Award, Clock } from 'lucide-react'
import { ServiceGrid, FeaturedServiceCard } from '../components/ServiceCard'
import { BarberLoader } from '../components/LoaderBarber'
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

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [featuredService, setFeaturedService] = useState<Service | null>(null)

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
        .limit(6)

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
        setServices(configServices.slice(0, 6))
        setFeaturedService(configServices[0])
      } else {
        setServices(supabaseServices || [])
        setFeaturedService(supabaseServices?.[0] || null)
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
      setServices(configServices.slice(0, 6))
      setFeaturedService(configServices[0])
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { icon: Users, value: '500+', label: 'عميل راضٍ' },
    { icon: Award, value: '2+', label: 'سنوات خبرة' },
    { icon: Clock, value: '12+', label: 'ساعة عمل يومياً' },
  ]

  const testimonials = [
    {
      name: 'أحمد محمد',
      rating: 5,
      comment: 'خدمة ممتازة واحترافية عالية. أنصح بشدة بزيارة مقص بلال.',
      service: 'حلاقة احترافية'
    },
    {
      name: 'محمد علي',
      rating: 5,
      comment: 'تجربة رائعة في الحمام المغربي. النظافة والجودة ممتازة.',
      service: 'حمام مغربي'
    },
    {
      name: 'عمر حسن',
      rating: 5,
      comment: 'أفضل صالون في المنطقة. الخدمة سريعة والسعر مناسب.',
      service: 'مساج استرخاء'
    },
  ]

  return (
    <>
      <Head>
        <title>{config.site.name} - {config.site.tagline}</title>
        <meta name="description" content={config.site.description} />
        <meta name="keywords" content={config.site.keywords} />
      </Head>

      {/* Hero Section */}
      <section className="hero-background min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gold-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-bounce-gentle" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              
              <img 
                src="/logo.png"
                alt={config.hero.title}
                width={400}
                height={120}
                className="mx-auto"
              />
              
              <p className="text-xl md:text-2xl text-gold-400 mb-2 english font-medium">
                {config.hero.subtitle}
              </p>
              
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                {config.hero.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <a
                href={`tel:${config.contact.phone.value}`}
                className="btn-gold text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 ml-2" />
                {config.hero.ctaText}
              </a>
              
              <Link
                href="/services"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center border-white text-white hover:bg-white hover:text-secondary-900"
              >
                {config.hero.ctaSecondary}
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {config.hero.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-gold-400" />
                    <span className="text-white text-sm font-medium">{feature}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-500" />
                </div>
                <div className="text-3xl font-bold text-secondary-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-secondary-600 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Service */}
      {featuredService && (
        <section className="py-20 bg-secondary-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                الخدمة المميزة
              </h2>
              <div className="section-divider" />
              <p className="text-secondary-600 max-w-2xl mx-auto">
                خدمة مميزة نقدمها بأعلى مستوى من الجودة والاحترافية
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <FeaturedServiceCard service={featuredService} />
            </div>
          </div>
        </section>
      )}

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {config.services.title}
            </h2>
            <div className="section-divider" />
            <p className="text-secondary-600 max-w-2xl mx-auto">
              {config.services.subtitle}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex justify-center">
                  <BarberLoader type="scissor" size="md" />
                </div>
              ))}
            </div>
          ) : (
            <ServiceGrid services={services} />
          )}

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              عرض جميع الخدمات
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              آراء عملائنا
            </h2>
            <div className="section-divider" />
            <p className="text-secondary-300 max-w-2xl mx-auto">
              نفتخر بثقة عملائنا وآرائهم الإيجابية حول خدماتنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-4 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="border-t border-white/20 pt-4">
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-gold-400 text-sm">
                    {testimonial.service}
                  </div>
                </div>
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
              احجز موعدك الآن
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              {config.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${config.contact.phone.value}`}
                className="btn-gold text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 ml-2" />
                {config.hero.ctaText}
              </a>
              <Link
                href="/contact"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-500 text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                {config.navigation.contact}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 