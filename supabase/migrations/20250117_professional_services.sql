-- Criar tabela de serviços profissionais
CREATE TABLE IF NOT EXISTS public.professional_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índice para busca rápida por profissional
CREATE INDEX IF NOT EXISTS professional_services_professional_id_idx ON public.professional_services(professional_id);

-- RLS Policies
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer um pode ver serviços
CREATE POLICY "Serviços são publicamente visíveis"
  ON public.professional_services
  FOR SELECT
  USING (true);

-- Policy: Profissional pode criar seus serviços
CREATE POLICY "Profissional pode criar seus serviços"
  ON public.professional_services
  FOR INSERT
  WITH CHECK (auth.uid() = professional_id);

-- Policy: Profissional pode atualizar seus serviços
CREATE POLICY "Profissional pode atualizar seus serviços"
  ON public.professional_services
  FOR UPDATE
  USING (auth.uid() = professional_id);

-- Policy: Profissional pode deletar seus serviços
CREATE POLICY "Profissional pode deletar seus serviços"
  ON public.professional_services
  FOR DELETE
  USING (auth.uid() = professional_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_professional_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER professional_services_updated_at
  BEFORE UPDATE ON public.professional_services
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_professional_services_updated_at();
