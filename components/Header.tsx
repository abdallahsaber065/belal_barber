import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X, Phone, Clock, MapPin, Scissors } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import config from '../config.json'

interface HeaderProps {
  isFixed?: boolean
}

const Header: React.FC<HeaderProps> = ({ isFixed = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const isActiveRoute = (path: string) => {
    return router.pathname === path
  }

  const navigationItems = [
    { name: config.navigation.home, path: '/', icon: '' },
    { name: config.navigation.contact, path: '/contact', icon: '' },
  ]



  return (
    <>

      {/* Main header */}
      <header
        className={`${
          isFixed ? 'sticky top-0' : 'relative'
        } z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-secondary-900'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="rtl-flex reverse group">
              <div className={`relative transition-all duration-300 ${
                isScrolled ? 'text-primary-500' : 'text-gold-400'
              }`}>
                <Scissors className="w-8 h-8 group-hover:animate-scissor-cut" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-secondary-900' : 'text-white'
                }`}>
                  {config.hero.title}
                </h1>
                <p className={`text-sm english transition-colors duration-300 ${
                  isScrolled ? 'text-secondary-600' : 'text-gold-400'
                }`}>
                  {config.hero.subtitle}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-link px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActiveRoute(item.path)
                      ? isScrolled
                        ? 'bg-primary-500 text-white'
                        : 'bg-gold-400 text-secondary-900'
                      : isScrolled
                      ? 'text-secondary-700 hover:text-primary-500'
                      : 'text-white hover:text-gold-400'
                  }`}
                >
                  <span className="ml-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href={`tel:${config.contact.phone.value}`}
                className={`btn-primary ${
                  isScrolled 
                    ? 'bg-primary-500 hover:bg-primary-600' 
                    : 'bg-gold-500 hover:bg-gold-600'
                }`}
              >
                {config.hero.ctaText}
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? 'text-secondary-700 hover:bg-secondary-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu md:hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-300 ${
                      isActiveRoute(item.path)
                        ? 'bg-gold-400 text-secondary-900'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-lg font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="mt-6">
                <a
                  href={`tel:${config.contact.phone.value}`}
                  className="btn-gold w-full text-center block"
                  onClick={closeMobileMenu}
                >
                  {config.hero.ctaText}
                  <Phone className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Header 