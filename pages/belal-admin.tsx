import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Users, 
  MessageSquare, 
  Settings, 
  Scissors, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  TrendingUp,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate, formatTime } from '../lib/utils'

// Type definitions
interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: string
  icon: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Contact {
  id: string
  name: string
  email: string | null
  phone: string
  message: string
  created_at: string
}

interface Reservation {
  id: string
  name: string
  phone: string
  email?: string | null
  service_id: string
  appointment_date: string
  appointment_time: string
  notes?: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
  service?: {
    title: string
  }
}
import { BarberLoader } from '../components/LoaderBarber'
import config from '../config.json'

interface AdminStats {
  totalServices: number
  totalContacts: number
  totalReservations: number
  todayReservations: number
}

type ActiveTab = 'dashboard' | 'services' | 'contacts' | 'reservations' | 'settings'

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [stats, setStats] = useState<AdminStats>({
    totalServices: 0,
    totalContacts: 0,
    totalReservations: 0,
    todayReservations: 0
  })

  // Data states
  const [services, setServices] = useState<Service[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (session) {
      loadDashboardData()
    }
  }, [session, activeTab])

  const loadDashboardData = async () => {
    try {
      // Load stats - we'll need to fetch from different endpoints
      const [servicesRes, contactsRes, reservationsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/contacts'),
        fetch('/api/reservations')
      ])

      const services = servicesRes.ok ? (await servicesRes.json()).data : []
      const contacts = contactsRes.ok ? (await contactsRes.json()).data : []
      const reservations = reservationsRes.ok ? (await reservationsRes.json()).data : []

      // Calculate stats
      const today = new Date().toISOString().split('T')[0]
      const todayReservations = reservations.filter((r: any) => 
        r.appointment_date.startsWith(today)
      ).length

      setStats({
        totalServices: services.length,
        totalContacts: contacts.length,
        totalReservations: reservations.length,
        todayReservations
      })

      // Load data based on active tab
      if (activeTab === 'services') await loadServices()
      if (activeTab === 'contacts') await loadContacts()
      if (activeTab === 'reservations') await loadReservations()
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const loadServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const result = await response.json()
        setServices(result.data || [])
      } else {
        throw new Error('Failed to fetch services')
      }
    } catch (error) {
      console.error('Error loading services:', error)
      toast.error('خطأ في تحميل الخدمات')
    }
  }

  const loadContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      if (response.ok) {
        const result = await response.json()
        setContacts(result.data || [])
      } else {
        throw new Error('Failed to fetch contacts')
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
      toast.error('خطأ في تحميل الرسائل')
    }
  }

  const loadReservations = async () => {
    try {
      const response = await fetch('/api/reservations')
      if (response.ok) {
        const result = await response.json()
        setReservations(result.data || [])
      } else {
        throw new Error('Failed to fetch reservations')
      }
    } catch (error) {
      console.error('Error loading reservations:', error)
      toast.error('خطأ في تحميل الحجوزات')
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return
    
    try {
      const response = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('تم حذف الخدمة بنجاح')
        loadServices()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('خطأ في حذف الخدمة')
    }
  }

  const updateReservationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/reservations?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        toast.success('تم تحديث حالة الحجز')
        loadReservations()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update reservation')
      }
    } catch (error) {
      console.error('Error updating reservation:', error)
      toast.error('خطأ في تحديث الحجز')
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      
      if (result?.error) {
        toast.error('خطأ في تسجيل الدخول')
      } else {
        toast.success('تم تسجيل الدخول بنجاح')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('خطأ في تسجيل الدخول')
    }
  }

  const handleLogout = async () => {
    await signOut()
    toast.success('تم تسجيل الخروج')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BarberLoader type="scissor" size="lg" text="جاري تحميل لوحة التحكم..." />
      </div>
    )
  }

  if (!session) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <>
      <Head>
        <title>لوحة التحكم الإدارية - {config.site.name}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Scissors className="w-8 h-8 text-primary-500" />
                <h1 className="text-xl font-bold text-gray-900">لوحة التحكم الإدارية</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">مرحباً، {session.user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  تسجيل خروج
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-4">
              <div className="space-y-2">
                {[
                  { id: 'dashboard', label: 'لوحة المعلومات', icon: BarChart3 },
                  { id: 'services', label: 'إدارة الخدمات', icon: Scissors },
                  { id: 'contacts', label: 'الرسائل', icon: MessageSquare },
                  { id: 'reservations', label: 'الحجوزات', icon: Calendar },
                  { id: 'settings', label: 'الإعدادات', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-right transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {activeTab === 'dashboard' && <DashboardView stats={stats} />}
            {activeTab === 'services' && (
              <ServicesView 
                services={services} 
                onDelete={deleteService}
                onRefresh={loadServices}
              />
            )}
            {activeTab === 'contacts' && <ContactsView contacts={contacts} />}
            {activeTab === 'reservations' && (
              <ReservationsView 
                reservations={reservations}
                onUpdateStatus={updateReservationStatus}
              />
            )}
            {activeTab === 'settings' && <SettingsView />}
          </main>
        </div>
      </div>
    </>
  )
}

// Login Form Component
function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await onLogin(email, password)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Scissors className="mx-auto h-12 w-12 text-primary-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            تسجيل دخول الإدارة
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {config.site.name}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@belalbarber.com"
              required
            />
          </div>
          <div>
            <label className="form-label">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Dashboard View Component
function DashboardView({ stats }: { stats: AdminStats }) {
  const statCards = [
    { label: 'إجمالي الخدمات', value: stats.totalServices, icon: Scissors, color: 'bg-blue-500' },
    { label: 'إجمالي الرسائل', value: stats.totalContacts, icon: MessageSquare, color: 'bg-green-500' },
    { label: 'إجمالي الحجوزات', value: stats.totalReservations, icon: Calendar, color: 'bg-purple-500' },
    { label: 'حجوزات اليوم', value: stats.todayReservations, icon: TrendingUp, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">لوحة المعلومات</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="admin-card"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 number-ltr">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <h3 className="text-lg font-semibold mb-4">إحصائيات سريعة</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الخدمات النشطة</span>
              <span className="font-semibold number-ltr">{stats.totalServices}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الرسائل الجديدة</span>
              <span className="font-semibold number-ltr">{stats.totalContacts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الحجوزات المؤكدة</span>
              <span className="font-semibold number-ltr">{stats.totalReservations}</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
          <div className="space-y-3">
            <a href="/" className="block text-primary-600 hover:text-primary-700">
              عرض الموقع الرئيسي
            </a>
            <a href="/services" className="block text-primary-600 hover:text-primary-700">
              عرض صفحة الخدمات
            </a>
            <a href="/contact" className="block text-primary-600 hover:text-primary-700">
              عرض صفحة التواصل
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Services View Component
function ServicesView({ 
  services, 
  onDelete, 
  onRefresh 
}: { 
  services: Service[]
  onDelete: (id: string) => void
  onRefresh: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إدارة الخدمات</h2>
        <button className="btn-primary" onClick={onRefresh}>
          <Plus className="w-4 h-4 ml-2" />
          تحديث القائمة
        </button>
      </div>

      <div className="admin-card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th>الخدمة</th>
                <th>السعر</th>
                <th>المدة</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {services.map((service) => (
                <tr key={service.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <div className="font-medium">{service.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {service.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-medium number-ltr">{service.price}</td>
                  <td className="table-cell number-ltr">{service.duration}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      service.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button className="admin-button-secondary">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(service.id)}
                        className="admin-button-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Contacts View Component
function ContactsView({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">الرسائل الواردة</h2>

      <div className="grid gap-6">
        {contacts.map((contact) => (
          <div key={contact.id} className="admin-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{contact.name}</h3>
                <p className="text-sm text-gray-600">
                  {formatDate(contact.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${contact.phone}`} className="admin-button">
                  <Phone className="w-4 h-4" />
                </a>
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="admin-button">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <strong>الهاتف:</strong> {contact.phone}
              </p>
              {contact.email && (
                <p className="text-sm">
                  <strong>البريد الإلكتروني:</strong> {contact.email}
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">{contact.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Reservations View Component
function ReservationsView({ 
  reservations, 
  onUpdateStatus 
}: { 
  reservations: Reservation[]
  onUpdateStatus: (id: string, status: string) => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">إدارة الحجوزات</h2>

      <div className="admin-card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th>العميل</th>
                <th>الخدمة</th>
                <th>التاريخ والوقت</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="table-row">
                  <td className="table-cell">
                    <div>
                      <div className="font-medium">{reservation.name}</div>
                      <div className="text-sm text-gray-500">{reservation.phone}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    {reservation.service?.title || 'خدمة محذوفة'}
                  </td>
                  <td className="table-cell">
                    <div>
                      <div>{formatDate(reservation.appointment_date)}</div>
                      <div className="text-sm text-gray-500">
                        {formatTime(reservation.appointment_time)}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status === 'confirmed' ? 'مؤكد' : 
                       reservation.status === 'cancelled' ? 'ملغي' : 'في الانتظار'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      {reservation.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => onUpdateStatus(reservation.id, 'confirmed')}
                            className="admin-button text-xs"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(reservation.id, 'cancelled')}
                            className="admin-button-danger text-xs"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <a href={`tel:${reservation.phone}`} className="admin-button text-xs">
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Settings View Component
function SettingsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">الإعدادات</h2>
      
      <div className="admin-card">
        <h3 className="text-lg font-semibold mb-4">معلومات النظام</h3>
        <div className="space-y-4">
          <div>
            <label className="form-label">اسم الموقع</label>
            <input type="text" value={config.site.name} className="input-field" readOnly />
          </div>
          <div>
            <label className="form-label">وصف الموقع</label>
            <textarea value={config.site.description} className="input-field" rows={3} readOnly />
          </div>
          <div>
            <label className="form-label">رقم الهاتف</label>
            <input type="text" value={config.contact.phone.value} className="input-field" readOnly />
          </div>
          <div>
            <label className="form-label">العنوان</label>
            <input type="text" value={config.contact.address.value} className="input-field" readOnly />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          * يمكن تعديل هذه المعلومات من ملف config.json
        </p>
      </div>
    </div>
  )
} 