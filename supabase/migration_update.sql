-- =====================================================
-- GSEED JOBS - ATUALIZAÇÃO DO SCHEMA
-- Adicionar campos faltantes
-- =====================================================

-- =====================================================
-- 1. ADICIONAR REQUISITOS E BENEFÍCIOS AOS PROJETOS
-- =====================================================

ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS requisitos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS beneficios TEXT[] DEFAULT '{}';

COMMENT ON COLUMN projects.requisitos IS 'Lista de requisitos do projeto';
COMMENT ON COLUMN projects.beneficios IS 'Lista de benefícios oferecidos';

-- =====================================================
-- 2. CRIAR TABELA DE EXPERIÊNCIAS PROFISSIONAIS
-- =====================================================

CREATE TABLE IF NOT EXISTS professional_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professional_profiles(id) ON DELETE CASCADE NOT NULL,
  cargo TEXT NOT NULL,
  empresa TEXT NOT NULL,
  periodo TEXT NOT NULL,
  descricao TEXT,
  is_atual BOOLEAN DEFAULT FALSE,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_professional_experiences ON professional_experiences(professional_id);

COMMENT ON TABLE professional_experiences IS 'Experiências profissionais dos usuários';

-- =====================================================
-- 3. CRIAR TABELA DE EDUCAÇÃO
-- =====================================================

CREATE TABLE IF NOT EXISTS professional_education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professional_profiles(id) ON DELETE CASCADE NOT NULL,
  instituicao TEXT NOT NULL,
  curso TEXT NOT NULL,
  periodo TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_professional_education ON professional_education(professional_id);

COMMENT ON TABLE professional_education IS 'Formação acadêmica dos profissionais';

-- =====================================================
-- 4. CRIAR TABELA DE CERTIFICAÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS professional_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professional_profiles(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  emissor TEXT NOT NULL,
  data_emissao DATE,
  data_validade DATE,
  credencial_url TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_professional_certifications ON professional_certifications(professional_id);

COMMENT ON TABLE professional_certifications IS 'Certificações e cursos dos profissionais';

-- =====================================================
-- 5. RLS POLICIES PARA NOVAS TABELAS
-- =====================================================

ALTER TABLE professional_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_certifications ENABLE ROW LEVEL SECURITY;

-- Experiências visíveis publicamente
CREATE POLICY "Experiências públicas" ON professional_experiences 
  FOR SELECT USING (true);

CREATE POLICY "Usuários gerenciam próprias experiências" ON professional_experiences 
  FOR ALL USING (
    professional_id IN (SELECT id FROM professional_profiles WHERE user_id = auth.uid())
  );

-- Educação visível publicamente
CREATE POLICY "Educação pública" ON professional_education 
  FOR SELECT USING (true);

CREATE POLICY "Usuários gerenciam própria educação" ON professional_education 
  FOR ALL USING (
    professional_id IN (SELECT id FROM professional_profiles WHERE user_id = auth.uid())
  );

-- Certificações visíveis publicamente
CREATE POLICY "Certificações públicas" ON professional_certifications 
  FOR SELECT USING (true);

CREATE POLICY "Usuários gerenciam próprias certificações" ON professional_certifications 
  FOR ALL USING (
    professional_id IN (SELECT id FROM professional_profiles WHERE user_id = auth.uid())
  );

-- =====================================================
-- 6. ADICIONAR COMPANY_NAME EM CLIENT_PROFILES (se não existir)
-- =====================================================

-- Já existe no schema original, apenas garantindo
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'client_profiles' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE client_profiles ADD COLUMN company_name TEXT;
  END IF;
END $$;
