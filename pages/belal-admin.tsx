import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { BarberLoader } from '../components/LoaderBarber'
import config from '../config.json'

// Import admin components
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from '../components/admin/AdminSidebar'
import LoginForm from '../components/admin/LoginForm'
import DashboardView from '../components/admin/DashboardView'
import ServicesView from '../components/admin/ServicesView'
import ContactsView from '../components/admin/ContactsView'
import ReservationsView from '../components/admin/ReservationsView'
import SettingsView from '../components/admin/SettingsView'

// Import types
import { 
  AdminStats, 
  Service, 
  Contact, 
  Reservation, 
  ActiveTab 
} from '../components/admin/AdminTypes'

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    
  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

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

  const handleSidebarClose = () => {
    setSidebarOpen(false)
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
        <AdminHeader
          userEmail={session.user?.email || undefined}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex flex-1">
          {/* Sidebar */}
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
          />

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto bg-gray-50">
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
            </div>
          </main>
        </div>
      </div>
    </>
  )
} 