import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Event {
  id: string
  title: string
  description?: string
  date: string
  time: string
  venue: string
  max_attendees: number
  ticket_price?: number
  category?: string
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  user_id: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Registration {
  id: string
  event_id: string
  user_id: string
  status: 'registered' | 'attended' | 'cancelled'
  created_at: string
}