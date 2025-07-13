import React from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar,
  User
} from 'lucide-react'
import { Contact } from './AdminTypes'
import { formatDate } from '../../lib/utils'

interface ContactsViewProps {
  contacts: Contact[]
}

const ContactsView: React.FC<ContactsViewProps> = ({ contacts }) => {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 space-x-reverse mb-6">
        <MessageSquare className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">الرسائل الواردة</h2>
      </div>

      {/* Messages Count */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-800">إجمالي الرسائل</span>
          <span className="text-lg font-bold text-green-900">{contacts.length}</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            {/* Contact Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(contact.created_at)}</span>
                </div>
              </div>
              
              {/* Contact Actions */}
              <div className="flex gap-2">
                <a 
                  href={`tel:${contact.phone}`} 
                  className="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">اتصال</span>
                </a>
                {contact.email && (
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">بريد</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 gap-x-reverse">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">الهاتف:</span>
                  <span className="text-sm font-medium">{contact.phone}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2 gap-x-reverse">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">البريد الإلكتروني:</span>
                    <span className="text-sm font-medium">{contact.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Message Content */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2 gap-x-reverse mb-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">نص الرسالة:</span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {contact.message}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد رسائل</h3>
          <p className="text-gray-500">لم يتم استلام أي رسائل من العملاء بعد</p>
        </div>
      )}

      {/* Bulk Actions */}
      {contacts.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-sm text-gray-600">
              يمكنك الرد على الرسائل عبر الهاتف أو البريد الإلكتروني
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-colors">
                تصدير الرسائل
              </button>
              <button className="px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors">
                وضع علامة كمقروءة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactsView 