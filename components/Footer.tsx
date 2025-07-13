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
      <div className="container mx-auto px-4 pt-12 pb-4 md:pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="rtl-flex reverse flex justify-center items-center">
              <div className="relative">
                <Scissors className="w-8 h-8 text-gold-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold text-white">{config.hero.title}</h3>
                <p className="text-sm text-gold-400 english">{config.hero.subtitle}</p>
              </div>
            </div>
            <p className="text-secondary-300 text-sm leading-relaxed">
              {config.about.description}
            </p>
            <div className="flex gap-4">
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
          {/* Contact Info */}
          <div className="space-y-4 md:space-y-0 md:flex md:flex-col md:justify-between h-full">
            <div>
              <h4 className="text-lg font-semibold text-gold-400 mb-4">
                {config.footer.contactInfo}
              </h4>
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <div key={index} className="rtl-flex items-start">
                    <item.icon className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                    <div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className={`text-secondary-300 hover:text-gold-400 transition-colors duration-300 ${item.icon === Phone ? 'number-ltr' : ''}`}
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span className={`text-secondary-300 ${item.icon === Phone ? 'number-ltr' : ''}`}>
                          {item.text}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div >
            <h4 className="text-lg font-semibold text-gold-400 mb-4">
              {config.footer.quickLinks}
            </h4>
            <ul className="flex flex-row flex-wrap gap-4 sm:space-y-2 sm:flex-col">
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
          <div>
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
        </div>
      </div>

      {/* Copyright -*/}
      <div className="border-t md:border-t-0 border-secondary-700 bg-secondary-900">
        <div className="container mx-auto px-4 py-5 md:pt-0">
          <div className="flex flex-col justify-between items-center space-y-4 md:space-y-0">
            <div className="text-secondary-400 text-sm text-center">
              <span>جميع الحقوق محفوظة - </span>
              <a
                href="https://www.linkedin.com/in/abdallahsaber065"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400"
              >
                Abdallah Saber &copy;  {new Date().getFullYear()}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 