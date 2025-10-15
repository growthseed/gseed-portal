-- =====================================================
-- GSEED JOBS - DATABASE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & PROFILES
-- =====================================================

-- Tabela de perfis profissionais
CREATE TABLE IF NOT EXISTS professional_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Informações básicas
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  cover_photo_url TEXT,
  bio TEXT,
  
  -- Profissão e habilidades
  categoria TEXT NOT NULL,
  especialidade TEXT NOT NULL,
  habilidades TEXT[] NOT NULL DEFAULT '{}',
  
  -- Contato
  whatsapp TEXT,
  email TEXT,
  
  -- Localização
  cidade TEXT,
  estado TEXT,
  
  -- Portfolio
  portfolio_images TEXT[] DEFAULT '{}',
  portfolio_links TEXT[] DEFAULT '{}',
  
  -- Estatísticas
  total_projetos INTEGER DEFAULT 0,
  projetos_concluidos INTEGER DEFAULT 0,
  avaliacao_media DECIMAL(3,2) DEFAULT 0,
  total_avaliacoes INTEGER DEFAULT 0,
  
  -- Status e verificação
  is_verificado BOOLEAN DEFAULT FALSE,
  is_talento_ascensao BOOLEAN DEFAULT FALSE,
  is_novo BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Tabela de perfis de contratantes
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Informações básicas
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  company_name TEXT,
  bio TEXT,
  
  -- Contato
  whatsapp TEXT,
  email TEXT,
  
  -- Localização
  cidade TEXT,
  estado TEXT,
  
  -- Estatísticas
  total_projetos_criados INTEGER DEFAULT 0,
  projetos_ativos INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- =====================================================
-- PROJETOS
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES client_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Informações básicas
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  
  -- Requisitos
  profissao_necessaria TEXT NOT NULL,
  habilidades_necessarias TEXT[] DEFAULT '{}',
  nivel_experiencia TEXT,
  
  -- Orçamento
  orcamento_tipo TEXT NOT NULL,
  orcamento_min INTEGER,
  orcamento_max INTEGER,
  
  -- Prazo
  prazo_tipo TEXT NOT NULL,
  prazo_data DATE,
  prazo_descricao TEXT,
  
  -- Localização
  is_remoto BOOLEAN DEFAULT TRUE,
  cidade TEXT,
  estado TEXT,
  
  -- Status
  status TEXT DEFAULT 'aberto',
  is_urgente BOOLEAN DEFAULT FALSE,
  
  -- Anexos
  anexos TEXT[] DEFAULT '{}',
  
  -- Estatísticas
  total_propostas INTEGER DEFAULT 0,
  total_visualizacoes INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- =====================================================
-- PROPOSTAS
-- =====================================================

CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES professional_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Conteúdo da proposta
  mensagem TEXT NOT NULL,
  valor_proposto INTEGER NOT NULL,
  prazo_proposto TEXT NOT NULL,
  
  -- Anexos
  portfolio_links TEXT[] DEFAULT '{}',
  anexos TEXT[] DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'pendente',
  visualizada BOOLEAN DEFAULT FALSE,
  visualizada_em TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, professional_id)
);

-- =====================================================
-- AVALIAÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reviewer_type TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comentario TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, reviewer_id, reviewee_id)
);

-- =====================================================
-- CHAT & MENSAGENS
-- =====================================================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  participant_1 UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  participant_2 UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1, participant_2),
  CHECK (participant_1 < participant_2)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  attachment_url TEXT,
  attachment_name TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICAÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_type TEXT,
  link_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_professional_profiles_user_id ON professional_profiles(user_id);
CREATE INDEX idx_professional_profiles_especialidade ON professional_profiles(especialidade);
CREATE INDEX idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_proposals_project_id ON proposals(project_id);
CREATE INDEX idx_proposals_professional_id ON proposals(professional_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis profissionais públicos" ON professional_profiles FOR SELECT USING (true);
CREATE POLICY "Usuários criam próprio perfil" ON professional_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários atualizam próprio perfil" ON professional_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Projetos públicos" ON projects FOR SELECT USING (true);
CREATE POLICY "Clientes criam projetos" ON projects FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM client_profiles WHERE user_id = auth.uid() AND id = client_id));

CREATE POLICY "Propostas visíveis para envolvidos" ON proposals FOR SELECT USING (
  professional_id IN (SELECT id FROM professional_profiles WHERE user_id = auth.uid())
  OR project_id IN (SELECT p.id FROM projects p JOIN client_profiles cp ON cp.id = p.client_id WHERE cp.user_id = auth.uid())
);
