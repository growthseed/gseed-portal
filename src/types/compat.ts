export interface UserSummary {
  id: string;
  name?: string;
  avatar_url?: string | null;
}

export interface ConversationCompat {
  id: string;
  project_id?: string | null;
  participant_1_id?: string;
  participant_2_id?: string;
  last_message_at?: string | null;
  created_at?: string;
  updated_at?: string;
  // compatibility fields used in UI
  participant?: UserSummary;
  other_user?: UserSummary;
  last_message?: { content?: string; created_at?: string } | null;
  unread_count?: number;
}

export interface ChatMessageCompat {
  id: string;
  conversation_id?: string;
  sender_id?: string;
  content?: string;
  type?: string;
  file_url?: string | null;
  file_name?: string | null;
  read?: boolean;
  created_at?: string;
  updated_at?: string;
  sender?: UserSummary;
}
