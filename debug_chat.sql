-- ==============================================================================
-- DEBUG: VERIFICAR STATUS DO CHAT
-- ==============================================================================
-- Execute este arquivo no SQL Editor do Supabase para diagnosticar o problema
-- ==============================================================================

-- 1. VERIFICAR POLÍTICAS RLS
-- ==============================================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('conversations', 'chat_messages')
ORDER BY tablename, policyname;

-- Resultado esperado: 7 políticas (3 conversations + 4 chat_messages)

-- 2. VERIFICAR SE RLS ESTÁ ATIVO
-- ==============================================================================
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('conversations', 'chat_messages');

-- Resultado esperado: ambas com rls_enabled = true

-- 3. TESTAR INSERT DIRETO (substituir USER_ID pelos IDs reais)
-- ==============================================================================
-- Substitua pelos IDs dos seus usuários de teste:
-- USER_A: cffbef13-e1d0-4a52-a8ad-94844ac8421b
-- USER_B: b69e6f6c-944e-448e-b74e-a78d1b27de6c
-- CONVERSATION_ID: 1e1748f0-2ad0-4cf2-8ee9-974e52046bb3

-- Teste de INSERT (ajuste os IDs):
/*
INSERT INTO chat_messages (
  conversation_id,
  sender_id,
  content,
  type,
  read
) VALUES (
  '1e1748f0-2ad0-4cf2-8ee9-974e52046bb3',
  'cffbef13-e1d0-4a52-a8ad-94844ac8421b',
  'Teste manual de mensagem',
  'text',
  false
) RETURNING *;
*/

-- 4. VERIFICAR MENSAGENS EXISTENTES
-- ==============================================================================
SELECT 
  cm.id,
  cm.conversation_id,
  cm.sender_id,
  cm.content,
  cm.created_at,
  cm.read,
  p.full_name as sender_name
FROM chat_messages cm
LEFT JOIN profiles p ON p.id = cm.sender_id
WHERE cm.conversation_id = '1e1748f0-2ad0-4cf2-8ee9-974e52046bb3'
ORDER BY cm.created_at DESC
LIMIT 20;

-- 5. VERIFICAR CONVERSA
-- ==============================================================================
SELECT 
  c.*,
  p1.full_name as participant_1_name,
  p2.full_name as participant_2_name
FROM conversations c
LEFT JOIN profiles p1 ON p1.id = c.participant_1_id
LEFT JOIN profiles p2 ON p2.id = c.participant_2_id
WHERE c.id = '1e1748f0-2ad0-4cf2-8ee9-974e52046bb3';

-- 6. VERIFICAR LOGS DE ERRO
-- ==============================================================================
-- Execute no terminal/console do navegador enquanto tenta enviar mensagem:
-- Verifique a aba Network (F12 > Network) e procure por:
-- - Requisições POST para /rest/v1/chat_messages
-- - Status 403 ou 201
-- - Response body com detalhes do erro

-- 7. TESTAR PERMISSÕES COM USUÁRIO AUTENTICADO
-- ==============================================================================
-- No console do navegador (com usuário logado), execute:
/*
const { data, error } = await supabase.auth.getUser();
console.log('User ID:', data?.user?.id);

const { data: msg, error: msgError } = await supabase
  .from('chat_messages')
  .insert({
    conversation_id: '1e1748f0-2ad0-4cf2-8ee9-974e52046bb3',
    sender_id: data.user.id,
    content: 'Teste via console',
    type: 'text',
    read: false
  })
  .select()
  .single();

console.log('Mensagem:', msg);
console.log('Erro:', msgError);
*/

-- 8. VERIFICAR SE FUNÇÃO OTIMIZADA EXISTE
-- ==============================================================================
SELECT 
  proname as function_name,
  prosecdef as security_definer
FROM pg_proc 
WHERE proname = 'get_user_conversations_optimized';

-- 9. FORÇAR APLICAÇÃO DAS POLÍTICAS (SE NECESSÁRIO)
-- ==============================================================================
-- Caso as políticas não estejam criadas, descomente e execute:
/*
-- Remover políticas antigas
DROP POLICY IF EXISTS "chat_messages_select_policy" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert_policy" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_update_policy" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_delete_policy" ON chat_messages;

-- Recriar políticas
CREATE POLICY "chat_messages_select_policy"
ON chat_messages FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = chat_messages.conversation_id
    AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
  )
);

CREATE POLICY "chat_messages_insert_policy"
ON chat_messages FOR INSERT TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = chat_messages.conversation_id
    AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
  )
);

CREATE POLICY "chat_messages_update_policy"
ON chat_messages FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = chat_messages.conversation_id
    AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = chat_messages.conversation_id
    AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
  )
);

CREATE POLICY "chat_messages_delete_policy"
ON chat_messages FOR DELETE TO authenticated
USING (sender_id = auth.uid());
*/

-- ==============================================================================
-- ANÁLISE DOS RESULTADOS
-- ==============================================================================
-- 
-- ✅ Se as políticas aparecem → RLS está configurado
-- ✅ Se RLS está ativo → Tabelas protegidas
-- ✅ Se INSERT funciona no SQL Editor → Problema é de autenticação/permissão
-- ❌ Se INSERT falha → Problema é de RLS
-- 
-- Próximos passos baseados nos resultados:
-- - Se políticas faltando → Aplicar migration
-- - Se INSERT funciona aqui mas não no app → Problema de token/sessão
-- - Se SELECT retorna mensagens → Elas estão sendo salvas
-- - Se SELECT vazio → Mensagens não estão persistindo
-- ==============================================================================
