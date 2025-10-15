export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'mentor' | 'viewer'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Beneficiary {
  id: string
  full_name: string
  email?: string
  phone?: string
  birth_date?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  city?: string
  state?: string
  zip_code?: string
  photo_url?: string
  status: 'active' | 'inactive' | 'pending'
  enrollment_date: string
  mentor_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Mentor {
  id: string
  user_id: string
  specialties?: string[]
  max_beneficiaries?: number
  active_beneficiaries_count?: number
  bio?: string
  experience_years?: number
  certifications?: string[]
  availability_schedule?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Meeting {
  id: string
  beneficiary_id: string
  mentor_id: string
  scheduled_date: string
  duration_minutes: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  meeting_type: 'individual' | 'group' | 'online' | 'in_person'
  location?: string
  meeting_url?: string
  notes?: string
  attendance_notes?: string
  created_at: string
  updated_at: string
}

export interface Content {
  id: string
  title: string
  description?: string
  content_type: 'video' | 'article' | 'document' | 'audio' | 'image'
  file_url?: string
  thumbnail_url?: string
  duration_minutes?: number
  category?: string
  tags?: string[]
  visibility: 'public' | 'mentors_only' | 'private'
  created_by: string
  view_count?: number
  created_at: string
  updated_at: string
}

export interface Progress {
  id: string
  beneficiary_id: string
  metric_type: string
  metric_value: number
  recorded_date: string
  notes?: string
  recorded_by: string
  created_at: string
}

export interface Comment {
  id: string
  beneficiary_id: string
  author_id: string
  content: string
  is_private: boolean
  created_at: string
  updated_at: string
}
