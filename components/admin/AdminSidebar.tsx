import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3,
  Scissors, 
  MessageSquare, 
  Calendar,
  Settings
} from 'lucide-react'
import { ActiveTab } from './AdminTypes'

interface AdminSidebarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  isOpen: boolean
  onClose: () => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'لوحة المعلومات', icon: BarChart3 },
    { id: 'services', label: 'إدارة الخدمات', icon: Scissors },
    { id: 'contacts', label: 'الرسائل', icon: MessageSquare },
    { id: 'reservations', label: 'الحجوزات', icon: Calendar },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ] as const

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId)
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`
          fixed top-16 right-0 md:static md:top-0 z-50 w-64 h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]
          bg-white shadow-lg md:shadow-sm border-l border-gray-200
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id as ActiveTab)}
              className={`
                w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-right transition-all duration-200
                ${activeTab === item.id
                  ? 'bg-primary-100 text-primary-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            مقص بلال - لوحة التحكم
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar 