// Shared types for admin components

export interface AdminStats {
  totalServices: number
  totalContacts: number
  totalReservations: number
  todayReservations: number
}

export interface Service {
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

export interface Contact {
  id: string
  name: string
  email: string | null
  phone: string
  message: string
  created_at: string
}

export interface Reservation {
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

export type ActiveTab = 'dashboard' | 'services' | 'contacts' | 'reservations' | 'settings' 