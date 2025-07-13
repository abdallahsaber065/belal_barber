import React from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Phone,
  User,
  Clock,
  Scissors,
  Filter
} from 'lucide-react'
import { Reservation } from './AdminTypes'
import { formatDate, formatTime } from '../../lib/utils'

interface ReservationsViewProps {
  reservations: Reservation[]
  onUpdateStatus: (id: string, status: string) => void
}

const ReservationsView: React.FC<ReservationsViewProps> = ({ 
  reservations, 
  onUpdateStatus 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          text: 'مؤكد',
          className: 'bg-green-100 text-green-800',
          icon: CheckCircle
        }
      case 'cancelled':
        return {
          text: 'ملغي',
          className: 'bg-red-100 text-red-800',
          icon: XCircle
        }
      default:
        return {
          text: 'في الانتظار',
          className: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        }
    }
  }

  const pendingCount = reservations.filter(r => r.status === 'pending').length
  const todayCount = reservations.filter(r => {
    const today = new Date().toISOString().split('T')[0]
    return r.appointment_date.startsWith(today)
  }).length

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 space-x-reverse mb-6">
        <Calendar className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">إدارة الحجوزات</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-800">إجمالي الحجوزات</span>
            <span className="text-lg font-bold text-purple-900">{reservations.length}</span>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-yellow-800">في الانتظار</span>
            <span className="text-lg font-bold text-yellow-900">{pendingCount}</span>
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-800">حجوزات اليوم</span>
            <span className="text-lg font-bold text-orange-900">{todayCount}</span>
          </div>
        </div>
      </div>

      {/* Reservations Grid - Mobile */}
      <div className="block lg:hidden space-y-4">
        {reservations.map((reservation, index) => {
          const statusConfig = getStatusConfig(reservation.status)
          const StatusIcon = statusConfig.icon
          
          return (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            >
              {/* Reservation Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 space-x-reverse mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{reservation.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>{reservation.phone}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${statusConfig.className} flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.text}
                </span>
              </div>

              {/* Service and Date Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 gap-x-reverse text-sm">
                  <Scissors className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{reservation.service?.title || 'خدمة محذوفة'}</span>
                </div>
                <div className="flex items-center gap-2 gap-x-reverse text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{formatDate(reservation.appointment_date)}</span>
                </div>
                <div className="flex items-center gap-2 gap-x-reverse text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{formatTime(reservation.appointment_time)}</span>
                </div>
              </div>

              {/* Notes */}
              {reservation.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{reservation.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                {reservation.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => onUpdateStatus(reservation.id, 'confirmed')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      تأكيد
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(reservation.id, 'cancelled')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      إلغاء
                    </button>
                  </>
                )}
                <a 
                  href={`tel:${reservation.phone}`} 
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  اتصال
                </a>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Reservations Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الخدمة
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ والوقت
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
              {reservations.map((reservation, index) => {
                const statusConfig = getStatusConfig(reservation.status)
                const StatusIcon = statusConfig.icon
                
                return (
                  <motion.tr
                    key={reservation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                        <div className="text-sm text-gray-500">{reservation.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.service?.title || 'خدمة محذوفة'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{formatDate(reservation.appointment_date)}</div>
                        <div className="text-sm text-gray-500">
                          {formatTime(reservation.appointment_time)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.className} flex items-center gap-1 w-fit`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {reservation.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => onUpdateStatus(reservation.id, 'confirmed')}
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                              title="تأكيد الحجز"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => onUpdateStatus(reservation.id, 'cancelled')}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                              title="إلغاء الحجز"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <a 
                          href={`tel:${reservation.phone}`} 
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="اتصال بالعميل"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {reservations.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد حجوزات</h3>
          <p className="text-gray-500">لم يتم استلام أي حجوزات بعد</p>
        </div>
      )}
    </div>
  )
}

export default ReservationsView 