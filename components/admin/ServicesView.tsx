import React from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Scissors
} from 'lucide-react'
import { Service } from './AdminTypes'
import toast from 'react-hot-toast'

interface ServicesViewProps {
  services: Service[]
  onDelete: (id: string) => void
  onRefresh: () => void
}

const ServicesView: React.FC<ServicesViewProps> = ({ 
  services, 
  onDelete, 
  onRefresh 
}) => {
  const handleDelete = (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف خدمة "${title}"؟`)) {
      onDelete(id)
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Scissors className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">إدارة الخدمات</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">تحديث</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">إضافة خدمة</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>
      </div>

      {/* Services Count */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">إجمالي الخدمات</span>
          <span className="text-lg font-bold text-blue-900">{services.length}</span>
        </div>
      </div>

      {/* Services Grid - Mobile */}
      <div className="block lg:hidden space-y-4">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            {/* Service Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 space-x-reverse flex-1">
                <span className="text-2xl">{service.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{service.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                service.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {service.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>

            {/* Service Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">السعر:</span>
                <div className="font-medium">{service.price}</div>
              </div>
              <div>
                <span className="text-gray-500">المدة:</span>
                <div className="font-medium">{service.duration}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
                تعديل
              </button>
              <button 
                onClick={() => handleDelete(service.id, service.title)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                حذف
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Services Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الخدمة
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المدة
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service, index) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {service.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      service.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id, service.title)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-12">
          <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد خدمات</h3>
          <p className="text-gray-500 mb-4">ابدأ بإضافة خدمة جديدة</p>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            إضافة خدمة جديدة
          </button>
        </div>
      )}
    </div>
  )
}

export default ServicesView 