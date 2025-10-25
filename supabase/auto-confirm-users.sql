-- =====================================================
-- GSEED PORTAL - CONFIGURAÇÃO DE AUTO-CONFIRMAÇÃO
-- =====================================================
-- Este script configura o Supabase para auto-confirmar
-- usuários sem necessidade de email de confirmação

-- 1. Criar função para auto-confirmar usuários
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o usuário não está confirmado, confirmar automaticamente
  IF NEW.confirmed_at IS NULL THEN
    NEW.confirmed_at = NOW();
    NEW.email_confirmed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Criar trigger para auto-confirmar na criação
DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();

-- 3. Confirmar todos os usuários existentes que ainda não foram confirmados
UPDATE auth.users
SET 
  confirmed_at = COALESCE(confirmed_at, created_at),
  email_confirmed_at = COALESCE(email_confirmed_at, created_at)
WHERE 
  confirmed_at IS NULL 
  OR email_confirmed_at IS NULL;

-- 4. Verificar resultado
SELECT 
  id,
  email,
  confirmed_at,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ Não confirmado'
  END as status
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- INSTRUÇÕES ADICIONAIS
-- =====================================================
-- 
-- IMPORTANTE: Além deste script, você precisa:
--
-- 1. Ir ao Dashboard do Supabase:
--    https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr
--
-- 2. Navegar para Authentication > Settings
--
-- 3. Desabilitar "Enable email confirmations"
--    Isso fará com que novos usuários sejam auto-confirmados
--
-- 4. Ou configurar um servidor SMTP válido em:
--    Authentication > Settings > SMTP Settings
--
-- Com o auto-confirm ativado:
-- ✅ Usuários podem fazer login imediatamente após cadastro
-- ✅ Não há necessidade de configurar SMTP/Brevo
-- ✅ Sem erros 500 de envio de email
--
-- =====================================================
