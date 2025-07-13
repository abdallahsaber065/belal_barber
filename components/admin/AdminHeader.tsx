import React from 'react'
import { Scissors, Menu, X } from 'lucide-react'

interface AdminHeaderProps {
  userEmail?: string
  onLogout: () => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  userEmail,
  onLogout,
  sidebarOpen,
  setSidebarOpen
}) => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and title */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Scissors className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                <span className="hidden sm:inline">لوحة التحكم الإدارية</span>
                <span className="sm:hidden">الإدارة</span>
              </h1>
            </div>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
              مرحباً، {userEmail}
            </span>
            <button
              onClick={onLogout}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
            >
              <span className="hidden sm:inline">تسجيل خروج</span>
              <span className="sm:hidden">خروج</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader 