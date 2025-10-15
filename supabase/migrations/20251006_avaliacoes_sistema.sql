-- Migration: Sistema de Avaliações
-- Criado em: 2025-10-06
-- Descrição: Tabelas e políticas para sistema de avaliações de profissionais

-- ================================================
-- 1. CRIAR TABELA DE AVALIAÇÕES (REVIEWS)
-- ================================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que um cliente só pode avaliar um profissional uma vez
    UNIQUE(professional_id, client_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_reviews_professional ON public.reviews(professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_client ON public.reviews(client_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- ================================================
-- 2. ADICIONAR CAMPOS DE RATING NO PERFIL PROFISSIONAL
-- ================================================

-- Adicionar campos se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professional_profiles' 
        AND column_name = 'average_rating'
    ) THEN
        ALTER TABLE public.professional_profiles 
        ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professional_profiles' 
        AND column_name = 'total_reviews'
    ) THEN
        ALTER TABLE public.professional_profiles 
        ADD COLUMN total_reviews INTEGER DEFAULT 0;
    END IF;
END $$;

-- ================================================
-- 3. CRIAR TABELA DE CONTRATOS (SE NÃO EXISTIR)
-- ================================================

CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    project_title TEXT NOT NULL,
    project_description TEXT,
    budget DECIMAL(10,2),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_contracts_client ON public.contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_professional ON public.contracts(professional_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);

-- ================================================
-- 4. FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contracts_updated_at ON public.contracts;
CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON public.contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 5. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ================================================

-- Habilitar RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Policies para REVIEWS

-- Todos podem ler avaliações
DROP POLICY IF EXISTS "Qualquer pessoa pode ler avaliações" ON public.reviews;
CREATE POLICY "Qualquer pessoa pode ler avaliações"
    ON public.reviews
    FOR SELECT
    USING (true);

-- Apenas clientes autenticados podem criar avaliações
DROP POLICY IF EXISTS "Clientes autenticados podem criar avaliações" ON public.reviews;
CREATE POLICY "Clientes autenticados podem criar avaliações"
    ON public.reviews
    FOR INSERT
    WITH CHECK (auth.uid() = client_id);

-- Clientes podem atualizar suas próprias avaliações
DROP POLICY IF EXISTS "Clientes podem atualizar suas próprias avaliações" ON public.reviews;
CREATE POLICY "Clientes podem atualizar suas próprias avaliações"
    ON public.reviews
    FOR UPDATE
    USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

-- Clientes podem deletar suas próprias avaliações
DROP POLICY IF EXISTS "Clientes podem deletar suas próprias avaliações" ON public.reviews;
CREATE POLICY "Clientes podem deletar suas próprias avaliações"
    ON public.reviews
    FOR DELETE
    USING (auth.uid() = client_id);

-- Policies para CONTRACTS

-- Todos podem ler contratos públicos (para verificar contratações)
DROP POLICY IF EXISTS "Usuários autenticados podem ler contratos" ON public.contracts;
CREATE POLICY "Usuários autenticados podem ler contratos"
    ON public.contracts
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Clientes podem criar contratos
DROP POLICY IF EXISTS "Clientes podem criar contratos" ON public.contracts;
CREATE POLICY "Clientes podem criar contratos"
    ON public.contracts
    FOR INSERT
    WITH CHECK (auth.uid() = client_id);

-- Clientes e profissionais podem atualizar contratos
DROP POLICY IF EXISTS "Participantes podem atualizar contratos" ON public.contracts;
CREATE POLICY "Participantes podem atualizar contratos"
    ON public.contracts
    FOR UPDATE
    USING (auth.uid() = client_id OR auth.uid() = professional_id)
    WITH CHECK (auth.uid() = client_id OR auth.uid() = professional_id);

-- ================================================
-- 6. FUNÇÃO PARA CALCULAR MÉDIA DE AVALIAÇÕES
-- ================================================

CREATE OR REPLACE FUNCTION calculate_professional_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    total_count INTEGER;
BEGIN
    -- Calcular média e total de avaliações
    SELECT 
        COALESCE(AVG(rating), 0),
        COUNT(*)
    INTO avg_rating, total_count
    FROM public.reviews
    WHERE professional_id = COALESCE(NEW.professional_id, OLD.professional_id);
    
    -- Atualizar perfil profissional
    UPDATE public.professional_profiles
    SET 
        average_rating = avg_rating,
        total_reviews = total_count
    WHERE id = COALESCE(NEW.professional_id, OLD.professional_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para recalcular rating após inserir/atualizar/deletar avaliação
DROP TRIGGER IF EXISTS trigger_update_professional_rating ON public.reviews;
CREATE TRIGGER trigger_update_professional_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION calculate_professional_rating();

-- ================================================
-- 7. COMENTÁRIOS E DOCUMENTAÇÃO
-- ================================================

COMMENT ON TABLE public.reviews IS 'Tabela de avaliações de profissionais por clientes';
COMMENT ON COLUMN public.reviews.rating IS 'Nota de 1 a 5 estrelas';
COMMENT ON COLUMN public.reviews.comment IS 'Comentário opcional do cliente';

COMMENT ON TABLE public.contracts IS 'Tabela de contratos entre clientes e profissionais';
COMMENT ON COLUMN public.contracts.status IS 'Status: pending, active, completed, cancelled';

-- ================================================
-- FIM DA MIGRATION
-- ================================================
