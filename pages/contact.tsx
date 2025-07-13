import { useState } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Phone, MapPin, Clock, Mail, MessageCircle, Send, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import { validateEmail, validatePhone } from '../lib/utils'
import { BarberLoader } from '../components/LoaderBarber'
import config from '../config.json'

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Validate phone number
      if (!validatePhone(data.phone)) {
        toast.error('رقم الهاتف غير صحيح')
        return
      }

      // Submit to Supabase
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: data.name,
          email: data.email || null,
          phone: data.phone,
          message: data.message
        }])

      if (error) {
        console.error('Error submitting contact form:', error)
        toast.error(config.contact.form.errorMessage)
      } else {
        toast.success(config.contact.form.successMessage)
        reset()
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast.error(config.contact.form.errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: config.contact.phone.title,
      value: config.contact.phone.value,
      href: `tel:${config.contact.phone.value}`,
      color: 'text-green-600'
    },
    {
      icon: MapPin,
      title: config.contact.address.title,
      value: config.contact.address.value,
      href: `https://maps.google.com/?q=${encodeURIComponent(config.contact.address.value)}`,
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: config.contact.hours.title,
      value: config.contact.hours.value,
      href: null,
      color: 'text-orange-600'
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'info@belalbarber.com',
      href: 'mailto:info@belalbarber.com',
      color: 'text-purple-600'
    }
  ]

  return (
    <>
      <Head>
        <title>{config.contact.title} - {config.site.name}</title>
        <meta name="description" content={config.contact.subtitle} />
        <meta name="keywords" content="تواصل معنا, رقم هاتف صالون حلاقة, عنوان مقص بلال, الإسكندرية" />
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
                {config.contact.title}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                {config.contact.subtitle}
              </p>
              <div className="section-divider bg-gradient-to-r from-gold-400 to-gold-600" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 ${item.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  {item.title}
                </h3>
                {item.href ? (
                  <a
                    href={item.href}
                    className={`${item.color} hover:underline transition-colors duration-300`}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-secondary-600">{item.value}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href={`tel:${config.contact.phone.value}`}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 ml-2" />
              اتصل الآن
            </a>
            <a
              href={`https://wa.me/${config.contact.phone.value.replace(/\D/g, '')}`}
              className="btn-gold text-lg px-8 py-4 inline-flex items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              واتساب
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="card">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                  {config.contact.form.title}
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="form-group">
                    <label className="form-label">
                      {config.contact.form.namePlaceholder} *
                    </label>
                    <input
                      type="text"
                      {...register('name', { 
                        required: 'الاسم مطلوب',
                        minLength: { value: 2, message: 'الاسم يجب أن يكون حرفين على الأقل' }
                      })}
                      className="input-field"
                      placeholder={config.contact.form.namePlaceholder}
                    />
                    {errors.name && (
                      <p className="form-error">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {config.contact.form.emailPlaceholder}
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        validate: (value) => {
                          if (value && !validateEmail(value)) {
                            return 'البريد الإلكتروني غير صحيح'
                          }
                          return true
                        }
                      })}
                      className="input-field"
                      placeholder={config.contact.form.emailPlaceholder}
                    />
                    {errors.email && (
                      <p className="form-error">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {config.contact.form.phonePlaceholder} *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { 
                        required: 'رقم الهاتف مطلوب',
                        validate: (value) => validatePhone(value) || 'رقم الهاتف غير صحيح'
                      })}
                      className="input-field"
                      placeholder={config.contact.form.phonePlaceholder}
                    />
                    {errors.phone && (
                      <p className="form-error">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {config.contact.form.messagePlaceholder} *
                    </label>
                    <textarea
                      {...register('message', { 
                        required: 'الرسالة مطلوبة',
                        minLength: { value: 10, message: 'الرسالة يجب أن تكون 10 أحرف على الأقل' }
                      })}
                      className="input-field min-h-[120px] resize-vertical"
                      placeholder={config.contact.form.messagePlaceholder}
                      rows={5}
                    />
                    {errors.message && (
                      <p className="form-error">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <BarberLoader type="scissor" size="sm" />
                        <span>جاري الإرسال...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>{config.contact.form.submitText}</span>
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map & Location Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Map Placeholder */}
                <div className="card overflow-hidden">
                  <div className="mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="w-6 h-6 text-primary-500 ml-2" />
                      <h3 className="font-semibold text-secondary-700">موقعنا على الخريطة</h3>
                    </div>
                    <p className="text-secondary-600 text-center">{config.contact.address.value}</p>
                  </div>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <iframe 
                      src={config.contact.map.embed_link} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                    />
                  </div>
                </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              أسئلة شائعة
            </h2>
            <div className="section-divider" />
            <p className="text-secondary-600 max-w-2xl mx-auto">
              إجابات على الأسئلة الأكثر شيوعاً حول خدماتنا
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'هل يمكنني الحجز مسبقاً؟',
                answer: 'نعم، يمكنك الحجز مسبقاً عن طريق الاتصال أو الواتساب. نحن نحرص على توفير الوقت المناسب لك.'
              },
              {
                question: 'ما هي طرق الدفع المتاحة؟',
                answer: 'نقبل الدفع نقداً وعبر محافظ الدفع الإلكترونية المختلفة لراحتك.'
              },
              {
                question: 'هل تتوفر خدمات للأطفال؟',
                answer: 'نعم، نقدم خدمات حلاقة متخصصة للأطفال في بيئة مريحة وآمنة.'
              },
              {
                question: 'كم يستغرق الحمام المغربي؟',
                answer: 'يستغرق الحمام المغربي حوالي 90 دقيقة، ويشمل التنظيف العميق والاسترخاء.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <h3 className="font-semibold text-secondary-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-secondary-600">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              تحتاج خدمة عاجلة؟
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              نحن متاحون لخدمتك - اتصل بنا الآن للحصول على موعد سريع
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${config.contact.phone.value}`}
                className="btn-gold text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 ml-2" />
                اتصل فوراً
              </a>
              <a
                href={`https://wa.me/${config.contact.phone.value.replace(/\D/g, '')}`}
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-500 text-lg px-8 py-4 inline-flex items-center justify-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                واتساب سريع
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 