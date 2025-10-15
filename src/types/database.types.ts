// Types baseados no schema do Supabase

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  date_of_birth: string;
  gender?: 'male' | 'female';
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed';
  city?: string;
  state?: string;
  region?: string;
  church?: string;
  church_role?: string;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  subscription_tier?: 'free' | 'basic' | 'premium' | 'enterprise';
  subscription_status?: 'active' | 'canceled' | 'expired' | 'trial';
  subscription_started_at?: string;
  subscription_expires_at?: string;
  kiwify_customer_id?: string;
  circle_member_id?: string;
  cnpj?: string;
  company_name?: string;
  is_cnpj_verified?: boolean;
  total_points?: number;
  level?: number;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
  deleted_at?: string;
  is_asdrm_member?: boolean;
  
  // Campos estendidos do perfil profissional (via JOIN)
  professional_title?: string;
  professional_bio?: string;
  skills?: string[];
  services?: string[];
  portfolio?: string[];
  hourly_rate?: number;
  availability?: 'full_time' | 'part_time' | 'freelance' | 'unavailable';
  is_available?: boolean;
  views_count?: number;
  rating?: number;
  reviews_count?: number;
  completed_projects?: number;
  response_time?: string;
  success_rate?: number;
  availability_hours?: number;
  website?: string;
  
  // Campos calculados
  full_name?: string;
  location_city?: string;
  location_state?: string;
  company_segment?: string;
  company_description?: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  required_profession: string;
  required_skills?: string[];
  budget_type: string;
  budget_min?: number;
  budget_max?: number;
  budget_value?: number;
  deadline_type: string;
  deadline_date?: string;
  deadline_days?: number;
  location_type: 'remote' | 'onsite' | 'hybrid';
  location_city?: string;
  location_state?: string;
  status: 'open' | 'closed' | 'in_progress' | 'completed';
  is_urgent?: boolean;
  attachments?: string[];
  views_count?: number;
  proposals_count?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  closed_at?: string;
  requisitos?: string[];
  beneficios?: string[];
  
  // Dados do cliente (via JOIN)
  client?: Profile;
  
  // Campos calculados/formatados
  requirements?: string;
  benefits?: string;
  work_model?: 'remote' | 'onsite' | 'hybrid';
  estimated_duration?: string;
  deadline?: string;
}

export interface ProfessionalProfile {
  id: string;
  user_id: string;
  title: string;
  professional_bio: string;
  skills?: string[];
  categories?: string[];
  portfolio_links?: any[];
  portfolio_images?: string[];
  availability: 'full_time' | 'part_time' | 'freelance' | 'unavailable';
  hourly_rate?: number;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  whatsapp?: string;
  email_public?: string;
  show_phone?: boolean;
  show_email?: boolean;
  years_of_experience?: number;
  is_active?: boolean;
  is_featured?: boolean;
  views_count?: number;
  contacts_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Proposal {
  id: string;
  project_id: string;
  professional_id?: string;
  user_id: string;
  message: string;
  proposed_value: number;
  proposed_deadline: string;
  attachments?: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  is_viewed?: boolean;
  viewed_at?: string;
  responded_at?: string;
  response_message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  is_anonymous?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Conversation {
  id: string;
  project_id?: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message_at?: string;
  created_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments?: string[];
  is_read?: boolean;
  read_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  data?: any;
  is_read?: boolean;
  read_at?: string;
  created_at?: string;
}

export interface ProductListing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  thumbnail_url?: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  condition: 'new' | 'used' | 'like_new';
  location_city: string;
  location_state: string;
  whatsapp_contact: string;
  show_phone?: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'removed' | 'sold';
  moderation_notes?: string;
  moderated_by?: string;
  moderated_at?: string;
  views_count?: number;
  contacts_count?: number;
  is_featured?: boolean;
  featured_until?: string;
  created_at?: string;
  updated_at?: string;
  sold_at?: string;
}

export interface Diagnostic {
  id: string;
  user_id: string;
  dimension_scores: any;
  total_score: number;
  recommendations?: any[];
  is_completed?: boolean;
  created_at?: string;
  completed_at?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  badge_type: 'first_login' | 'profile_complete' | 'first_job_post' | 'first_product_post' | 'helper' | 'mentor' | 'active_member' | 'premium_member';
  points?: number;
  earned_at?: string;
}
