import React from 'react'
import { motion } from 'framer-motion'
import { 
  Scissors, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  ExternalLink,
  Users,
  Activity
} from 'lucide-react'
import { AdminStats } from './AdminTypes'

interface DashboardViewProps {
  stats: AdminStats
}

const DashboardView: React.FC<DashboardViewProps> = ({ stats }) => {
  const statCards = [
    { 
      label: 'إجمالي الخدمات', 
      value: stats.totalServices, 
      icon: Scissors, 
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      label: 'إجمالي الرسائل', 
      value: stats.totalContacts, 
      icon: MessageSquare, 
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    { 
      label: 'إجمالي الحجوزات', 
      value: stats.totalReservations, 
      icon: Calendar, 
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    { 
      label: 'حجوزات اليوم', 
      value: stats.todayReservations, 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
  ]

  const quickStats = [
    { label: 'الخدمات النشطة', value: stats.totalServices },
    { label: 'الرسائل الجديدة', value: stats.totalContacts },
    { label: 'الحجوزات المؤكدة', value: stats.totalReservations },
  ]

  const quickLinks = [
    { label: 'عرض الموقع الرئيسي', href: '/' },
    { label: 'عرض صفحة التواصل', href: '/contact' },
    { label: 'صفحة الحجز', href: '/#services' },
  ]

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 space-x-reverse mb-6">
        <Activity className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">لوحة المعلومات</h2>
      </div>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">
                  {stat.label}
                </p>
                <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 sm:p-4 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center space-x-2 space-x-reverse mb-4">
            <Users className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">إحصائيات سريعة</h3>
          </div>
          <div className="space-y-4">
            {quickStats.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-b-0">
                <span className="text-sm sm:text-base text-gray-600">{item.label}</span>
                <span className="text-lg font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center space-x-2 space-x-reverse mb-4">
            <ExternalLink className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">روابط سريعة</h3>
          </div>
          <div className="space-y-3">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 group"
              >
                <span className="text-sm sm:text-base text-gray-700 group-hover:text-primary-700">
                  {link.label}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-primary-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الأداء</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {stats.totalServices}
            </div>
            <div className="text-sm text-gray-600">خدمات متاحة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalReservations}
            </div>
            <div className="text-sm text-gray-600">إجمالي الحجوزات</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.todayReservations}
            </div>
            <div className="text-sm text-gray-600">حجوزات اليوم</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardView 