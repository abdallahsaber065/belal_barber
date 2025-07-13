import React from 'react'
import { Settings, Info, Users, Clock } from 'lucide-react'
import config from '../../config.json'

const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 space-x-reverse mb-6">
        <Settings className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">الإعدادات</h2>
      </div>
      
      {/* Business Information */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 space-x-reverse mb-4">
          <Info className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">معلومات الصالون</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الصالون
            </label>
            <input 
              type="text" 
              value={config.site.name} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" 
              readOnly 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <input 
              type="text" 
              value={config.contact.phone.value} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 number-ltr" 
              readOnly 
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الصالون
            </label>
            <textarea 
              value={config.site.description} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" 
              rows={3} 
              readOnly 
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان
            </label>
            <input 
              type="text" 
              value={config.contact.address.value} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" 
              readOnly 
            />
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            * يمكن تعديل هذه المعلومات من ملف config.json في مجلد المشروع
          </p>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 space-x-reverse mb-4">
          <Clock className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">ساعات العمل</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="text-center">
              <span className="text-sm text-green-800 block mb-1">أيام الأسبوع</span>
              <span className="text-lg font-bold text-green-900">9:00 ص - 9:00 م</span>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-center">
              <span className="text-sm text-blue-800 block mb-1">عطلة نهاية الأسبوع</span>
              <span className="text-lg font-bold text-blue-900">10:00 ص - 8:00 م</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 space-x-reverse mb-4">
          <Users className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">إجراءات سريعة</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 p-4 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>تحديث معلومات الصالون</span>
          </button>
          
          <button className="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors">
            <Clock className="w-5 h-5" />
            <span>تعديل ساعات العمل</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p className="font-medium">{config.site.name}</p>
        <p>نظام إدارة الصالون</p>
      </div>
    </div>
  )
}

export default SettingsView 