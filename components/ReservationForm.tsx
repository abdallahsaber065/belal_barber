import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { supabase, Service } from '../lib/supabaseClient'
import { validatePhone, getTimeSlots, addDays } from '../lib/utils'
import { BarberLoader } from './LoaderBarber'
import config from '../config.json'

interface ReservationFormData {
  name: string
  phone: string
  email?: string
  service_id: string
  appointment_date: string
  appointment_time: string
  notes?: string
}

interface ReservationFormProps {
  services?: Service[]
  isOpen: boolean
  onClose: () => void
  selectedService?: Service
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  services = [],
  isOpen,
  onClose,
  selectedService
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ReservationFormData>()

  const watchedDate = watch('appointment_date')

  React.useEffect(() => {
    if (selectedService) {
      setValue('service_id', selectedService.id)
    }
  }, [selectedService, setValue])

  React.useEffect(() => {
    if (watchedDate) {
      loadAvailableSlots(watchedDate)
    }
  }, [watchedDate])

  const loadAvailableSlots = async (date: string) => {
    try {
      // Get all time slots
      const allSlots = getTimeSlots(9, 22)
      
      // Get existing reservations for this date
      const { data: reservations } = await supabase
        .from('reservations')
        .select('appointment_time')
        .eq('appointment_date', date)
        .neq('status', 'cancelled')

      // Filter out booked slots
      const bookedSlots = reservations?.map(r => r.appointment_time) || []
      const available = allSlots.filter(slot => !bookedSlots.includes(slot))
      
      setAvailableSlots(available)
    } catch (error) {
      console.error('Error loading available slots:', error)
      setAvailableSlots(getTimeSlots(9, 22))
    }
  }

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true)

    try {
      // Validate phone number
      if (!validatePhone(data.phone)) {
        toast.error('رقم الهاتف غير صحيح')
        return
      }

      // Check if the time slot is still available
      const { data: existing } = await supabase
        .from('reservations')
        .select('id')
        .eq('appointment_date', data.appointment_date)
        .eq('appointment_time', data.appointment_time)
        .neq('status', 'cancelled')
        .single()

      if (existing) {
        toast.error('هذا الموعد محجوز بالفعل، يرجى اختيار موعد آخر')
        return
      }

      // Submit reservation
      const { error } = await supabase
        .from('reservations')
        .insert([{
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email?.trim() || null,
          service_id: data.service_id,
          appointment_date: data.appointment_date,
          appointment_time: data.appointment_time,
          notes: data.notes?.trim() || null,
          status: 'pending'
        }])

      if (error) {
        console.error('Error creating reservation:', error)
        toast.error('خطأ في حجز الموعد')
        return
      }

      toast.success('تم حجز الموعد بنجاح! سنتواصل معك قريباً للتأكيد')
      reset()
      onClose()
    } catch (error) {
      console.error('Reservation error:', error)
      toast.error('خطأ في حجز الموعد')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate next 30 days
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(new Date(), i + 1)
    return date.toISOString().split('T')[0]
  })

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const period = hour >= 12 ? 'م' : 'ص'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${period}`
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="modal-content max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-xl font-bold text-secondary-900">
            حجز موعد جديد
          </h2>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Selection */}
            <div className="form-group">
              <label className="form-label">
                <MessageSquare className="w-4 h-4 inline ml-2" />
                اختر الخدمة *
              </label>
              <select
                {...register('service_id', { required: 'يرجى اختيار خدمة' })}
                className="input-field"
              >
                <option value="">-- اختر خدمة --</option>
                {(services.length > 0 ? services : config.services.items).map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.icon} {service.title} - {service.price}
                  </option>
                ))}
              </select>
              {errors.service_id && (
                <p className="form-error">{errors.service_id.message}</p>
              )}
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">
                  <User className="w-4 h-4 inline ml-2" />
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  {...register('name', { 
                    required: 'الاسم مطلوب',
                    minLength: { value: 2, message: 'الاسم يجب أن يكون حرفين على الأقل' }
                  })}
                  className="input-field"
                  placeholder="اسمك الكامل"
                />
                {errors.name && (
                  <p className="form-error">{errors.name.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone className="w-4 h-4 inline ml-2" />
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'رقم الهاتف مطلوب',
                    validate: (value) => validatePhone(value) || 'رقم الهاتف غير صحيح'
                  })}
                  className="input-field"
                  placeholder="+20 12 01234567"
                />
                {errors.phone && (
                  <p className="form-error">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail className="w-4 h-4 inline ml-2" />
                البريد الإلكتروني (اختياري)
              </label>
              <input
                type="email"
                {...register('email')}
                className="input-field"
                placeholder="example@email.com"
              />
            </div>

            {/* Date Selection */}
            <div className="form-group">
              <label className="form-label">
                <Calendar className="w-4 h-4 inline ml-2" />
                اختر التاريخ *
              </label>
              <select
                {...register('appointment_date', { required: 'يرجى اختيار تاريخ' })}
                className="input-field"
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="">-- اختر تاريخ --</option>
                {availableDates.map((date) => {
                  const dateObj = new Date(date)
                  const dayName = dateObj.toLocaleDateString('ar-EG', { weekday: 'long' })
                  const formattedDate = dateObj.toLocaleDateString('ar-EG', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                  return (
                    <option key={date} value={date}>
                      {dayName} - {formattedDate}
                    </option>
                  )
                })}
              </select>
              {errors.appointment_date && (
                <p className="form-error">{errors.appointment_date.message}</p>
              )}
            </div>

            {/* Time Selection */}
            {watchedDate && (
              <div className="form-group">
                <label className="form-label">
                  <Clock className="w-4 h-4 inline ml-2" />
                  اختر الوقت *
                </label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <label
                        key={slot}
                        className="flex items-center justify-center p-3 border border-secondary-300 rounded-lg cursor-pointer hover:bg-primary-50 hover:border-primary-500 transition-colors"
                      >
                        <input
                          type="radio"
                          {...register('appointment_time', { required: 'يرجى اختيار وقت' })}
                          value={slot}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">
                          {formatTime(slot)}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-600 text-center py-4 bg-secondary-50 rounded-lg">
                    لا توجد مواعيد متاحة في هذا التاريخ
                  </p>
                )}
                {errors.appointment_time && (
                  <p className="form-error">{errors.appointment_time.message}</p>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">ملاحظات إضافية</label>
              <textarea
                {...register('notes')}
                className="input-field min-h-[80px]"
                placeholder="أي ملاحظات أو طلبات خاصة..."
                rows={3}
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <BarberLoader type="scissor" size="sm" />
                <span>جاري الحجز...</span>
              </div>
            ) : (
              'تأكيد الحجز'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ReservationForm 