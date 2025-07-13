import React from 'react'
import Link from 'next/link'
import { Phone, MapPin, Clock, Mail, Facebook, Instagram, Twitter, Scissors } from 'lucide-react'
import config from '../config.json'

const Footer: React.FC = () => {
  const quickLinks = [
    { name: config.navigation.home, path: '/' },
    { name: config.navigation.services, path: '/services' },
    { name: config.navigation.contact, path: '/contact' },
  ]

  const services = config.services.items.slice(0, 4).map(service => ({
    name: service.title,
    path: `/services#${service.id}`
  }))

  const contactInfo = [
    { icon: Phone, text: config.contact.phone.value, href: `tel:${config.contact.phone.value}` },
    { icon: MapPin, text: config.contact.address.value, href: `https://maps.google.com/?q=${encodeURIComponent(config.contact.address.value)}` },
    { icon: Clock, text: config.contact.hours.value, href: null },
    { icon: Mail, text: 'info@belalbarber.com', href: 'mailto:info@belalbarber.com' },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ]

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Scissors className="w-8 h-8 text-gold-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{config.hero.title}</h3>
                <p className="text-sm text-gold-400 english">{config.hero.subtitle}</p>
              </div>
            </div>
            <p className="text-secondary-300 text-sm leading-relaxed">
              {config.about.description}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gold-400 mb-4">
              {config.footer.quickLinks}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.path}
                    className="text-secondary-300 hover:text-gold-400 transition-colors duration-300 block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gold-400 mb-4">
              {config.services.title}
            </h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    href={service.path}
                    className="text-secondary-300 hover:text-gold-400 transition-colors duration-300 block py-1"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gold-400 mb-4">
              {config.footer.contactInfo}
            </h4>
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <item.icon className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                  <div>
                    {item.href ? (
                      <a 
                        href={item.href}
                        className="text-secondary-300 hover:text-gold-400 transition-colors duration-300"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-secondary-300">{item.text}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features/Values */}
        <div className="mt-12 pt-8 border-t border-secondary-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.hero.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gold-400 rounded-full" />
                <span className="text-secondary-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter/CTA Section */}
        <div className="mt-12 pt-8 border-t border-secondary-700">
          <div className="text-center">
            <h4 className="text-xl font-semibold text-white mb-4">
              {config.hero.ctaText}
            </h4>
            <p className="text-secondary-300 mb-6">
              {config.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${config.contact.phone.value}`}
                className="btn-gold inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 ml-2" />
                {config.hero.ctaText}
              </a>
              <Link
                href="/services"
                className="btn-outline inline-flex items-center justify-center"
              >
                {config.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-700 bg-secondary-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-secondary-400 text-sm">
              {config.footer.copyright}
            </div>
            <div className="flex items-center space-x-6 text-secondary-400 text-sm">
              <Link href="/privacy" className="hover:text-gold-400 transition-colors">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="hover:text-gold-400 transition-colors">
                الشروط والأحكام
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>متاح الآن</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 