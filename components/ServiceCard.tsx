import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Tag, ArrowLeft, Phone } from 'lucide-react'
import config from '../config.json'

// Service type definition
interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: string
  icon: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

interface ServiceCardProps {
  service: Service | {
    id: string
    title: string
    description: string
    price: string
    duration: string
    icon: string
  }
  index?: number
  showBookButton?: boolean
  className?: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  index = 0, 
  showBookButton = true,
  className = '' 
}) => {
  const handleBookService = () => {
    // TODO: Implement booking functionality
    window.location.href = `tel:${config.contact.phone.value}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`service-card card card-hover group ${className}`}
    >
      {/* Service Icon */}
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl mb-4 mx-auto">
        <span className="text-2xl">{service.icon}</span>
      </div>

      {/* Service Title */}
      <h3 className="text-xl font-bold text-secondary-900 mb-2 text-center">
        {service.title}
      </h3>

      {/* Service Description */}
      <p className="text-secondary-600 text-sm leading-relaxed mb-4 text-center">
        {service.description}
      </p>

      {/* Service Details */}
      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="rtl-flex reverse">
            <Tag className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-secondary-600">السعر</span>
          </div>
          <span className="text-lg font-semibold text-primary-600 number-ltr">
            {service.price}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="rtl-flex reverse">
            <Clock className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-secondary-600">المدة</span>
          </div>
          <span className="text-sm text-secondary-700 number-ltr">
            {service.duration}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3 mt-auto">
        {showBookButton && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBookService}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <span>{config.services.bookText}</span>
            <Phone className="w-4 h-4" />
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-outline w-full flex items-center justify-center gap-2"
        >
          <span>{config.services.ctaText}</span>
          <ArrowLeft className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    </motion.div>
  )
}

// Service Grid Component
export const ServiceGrid: React.FC<{ 
  services: Service[] | any[]
  className?: string
}> = ({ services, className = '' }) => {
  // Handle loading state or invalid data
  if (!services || !Array.isArray(services)) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        <div className="col-span-full text-center py-8">
          <p className="text-secondary-500">جاري تحميل الخدمات...</p>
        </div>
      </div>
    )
  }

  // Handle empty services array
  if (services.length === 0) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        <div className="col-span-full text-center py-8">
          <p className="text-secondary-500">لا توجد خدمات متاحة حالياً</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {services.map((service, index) => (
        <ServiceCard 
          key={service.id} 
          service={service} 
          index={index}
        />
      ))}
    </div>
  )
}

// Featured Service Card (larger variant)
export const FeaturedServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  index = 0,
  className = '' 
}) => {
  const handleBookService = () => {
    window.location.href = `tel:${config.contact.phone.value}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`service-card card card-hover group relative overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full -translate-y-16 translate-x-16 opacity-30" />
      
      {/* Service Icon */}
      <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 mx-auto shadow-lg">
        <span className="text-3xl">{service.icon}</span>
      </div>

      {/* Service Title */}
      <h3 className="text-2xl font-bold text-secondary-900 mb-3 text-center">
        {service.title}
      </h3>

      {/* Service Description */}
      <p className="text-secondary-600 leading-relaxed mb-6 text-center">
        {service.description}
      </p>

      {/* Service Details */}
      <div className="bg-secondary-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="rtl-flex reverse">
            <Tag className="w-5 h-5 text-primary-500" />
            <span className="font-medium text-secondary-700">السعر</span>
          </div>
          <span className="text-xl font-bold text-primary-600 number-ltr">
            {service.price}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="rtl-flex reverse">
            <Clock className="w-5 h-5 text-primary-500" />
            <span className="font-medium text-secondary-700">المدة</span>
          </div>
          <span className="text-secondary-700 number-ltr">
            {service.duration}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBookService}
        className="btn-gold w-full flex items-center justify-center gap-2 text-lg py-4"
      >
        <span>{config.services.bookText}</span>
        <Phone className="w-5 h-5" />
      </motion.button>
    </motion.div>
  )
}

// Compact Service Card (for sidebar or smaller spaces)
export const CompactServiceCard: React.FC<ServiceCardProps> = ({ 
  service,
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
          <span className="text-lg">{service.icon}</span>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-secondary-900 truncate">
          {service.title}
        </h4>
        <p className="text-sm text-secondary-600 truncate">
          {service.description}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-medium text-primary-600 number-ltr">
            {service.price}
          </span>
          <span className="text-xs text-secondary-500 number-ltr">
            {service.duration}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard 