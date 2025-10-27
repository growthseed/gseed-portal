-- ==============================================================================
-- CORREÇÃO COMPLETA DO SISTEMA DE CHAT - RLS E PERMISSÕES
-- ==============================================================================
-- Este arquivo corrige todos os problemas de RLS que estão impedindo o chat de funcionar
-- Execução: Aplicar via Supabase Dashboard ou CLI
-- ==============================================================================

-- 1. REMOVER TODAS AS POLÍTICAS EXISTENTES
-- ==============================================================================

DROP POLICY IF EXISTS "conversations_view_policy" ON conversations;
DROP POLICY IF EXISTS "conversations_create_policy" ON conversations;
DROP POLICY IF EXISTS "conversations_update_policy" ON conversations;
DROP POLICY IF EXISTS "chat_messages_view_policy" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_create_policy" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_update_policy" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_delete_policy" ON chat_messages;

-- 2. DESABILITAR RLS TEMPORARIAMENTE
-- ==============================================================================

ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

-- 3. REABILITAR RLS
-- ==============================================================================

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS PARA CONVERSATIONS - SIMPLIFICADAS E FUNCIONAIS
-- ==============================================================================

-- Visualizar conversas onde o usuário é participante
CREATE POLICY "conversations_select_policy"
ON conversations
FOR SELECT
TO authenticated
USING (
  participant_1_id = auth.uid() 
  OR participant_2_id = auth.uid()
);

-- Criar conversas (qualquer usuário autenticado pode criar)
CREATE POLICY "conversations_insert_policy"
ON conversations
FOR INSERT
TO authenticated
WITH CHECK (
  participant_1_id = auth.uid() 
  OR participant_2_id = auth.uid()
);

-- Atualizar conversas onde o usuário é participante
CREATE POLICY "conversations_update_policy"
ON conversations
FOR UPDATE
TO authenticated
USING (
  participant_1_id = auth.uid() 
  OR participant_2_id = auth.uid()
)
WITH CHECK (
  participant_1_id = auth.uid() 
  OR participant_2_id = auth.uid()
);

-- 5. POLÍTICAS PARA CHAT_MESSAGES - SIMPLIFICADAS E FUNCIONAIS
-- ==============================================================================

-- Visualizar mensagens de conversas onde o usuário é participante
CREATE POLICY "chat_messages_select_policy"
ON chat_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = chat_messages.conversation_id
    AND (
      conversations.participant_1_id = auth.uid()
      OR conversations.participant_2_id = auth.uid()
    )
  )
);

-- Enviar mensagens em conversas onde o usuário é participante
CREATE POLICY "chat_messages_insert_policy"
ON chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  -- O sender_id deve ser o usuário autenticado
  sender_id = auth.uid()
  AND
  -- E o usuário deve ser participante da conversa
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = chat_messages.conversation_id
    AND (
      conversations.participant_1_id = auth.uid()
      OR conversations.participant_2_id = auth.uid()
    )
  )
);

-- Atualizar mensagens (marcar como lida)
CREATE POLICY "chat_messages_update_policy"
ON chat_messages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = chat_messages.conversation_id
    AND (
      conversations.participant_1_id = auth.uid()
      OR conversations.participant_2_id = auth.uid()
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = chat_messages.conversation_id
    AND (
      conversations.participant_1_id = auth.uid()
      OR conversations.participant_2_id = auth.uid()
    )
  )
);

-- Deletar mensagens (apenas o remetente pode deletar)
CREATE POLICY "chat_messages_delete_policy"
ON chat_messages
FOR DELETE
TO authenticated
USING (
  sender_id = auth.uid()
);

-- 6. CRIAR FUNÇÃO OTIMIZADA PARA BUSCAR CONVERSAS (SE NÃO EXISTIR)
-- ==============================================================================

CREATE OR REPLACE FUNCTION get_user_conversations_optimized(user_uuid UUID)
RETURNS TABLE (
  conversation_id UUID,
  other_user_id UUID,
  other_user_name TEXT,
  other_user_avatar TEXT,
  project_id UUID,
  last_message TEXT,
  last_message_time TIMESTAMPTZ,
  unread_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH user_conversations AS (
    SELECT 
      c.id as conv_id,
      CASE 
        WHEN c.participant_1_id = user_uuid THEN c.participant_2_id
        ELSE c.participant_1_id
      END as other_id,
      c.project_id,
      c.last_message_at
    FROM conversations c
    WHERE c.participant_1_id = user_uuid 
       OR c.participant_2_id = user_uuid
  ),
  last_messages AS (
    SELECT DISTINCT ON (cm.conversation_id)
      cm.conversation_id,
      cm.content as msg_content,
      cm.created_at as msg_time
    FROM chat_messages cm
    INNER JOIN user_conversations uc ON uc.conv_id = cm.conversation_id
    ORDER BY cm.conversation_id, cm.created_at DESC
  ),
  unread_counts AS (
    SELECT 
      cm.conversation_id,
      COUNT(*) as unread
    FROM chat_messages cm
    INNER JOIN user_conversations uc ON uc.conv_id = cm.conversation_id
    WHERE cm.sender_id != user_uuid
      AND cm.read = FALSE
    GROUP BY cm.conversation_id
  )
  SELECT
    uc.conv_id,
    uc.other_id,
    p.full_name,
    p.avatar_url,
    uc.project_id,
    lm.msg_content,
    lm.msg_time,
    COALESCE(unr.unread, 0)
  FROM user_conversations uc
  LEFT JOIN profiles p ON p.id = uc.other_id
  LEFT JOIN last_messages lm ON lm.conversation_id = uc.conv_id
  LEFT JOIN unread_counts unr ON unr.conversation_id = uc.conv_id
  ORDER BY COALESCE(lm.msg_time, uc.last_message_at, NOW()) DESC;
END;
$$;

-- 7. ADICIONAR ÍNDICES PARA PERFORMANCE
-- ==============================================================================

-- Índices para conversas
CREATE INDEX IF NOT EXISTS idx_conversations_participant_1 ON conversations(participant_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2 ON conversations(participant_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- Índices para mensagens
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_unread ON chat_messages(conversation_id, read) WHERE read = FALSE;

-- 8. GARANTIR QUE REALTIME ESTÁ HABILITADO
-- ==============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- 9. VERIFICAÇÕES FINAIS
-- ==============================================================================

DO $$
BEGIN
  -- Verificar se as tabelas existem
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'conversations') THEN
    RAISE EXCEPTION 'Tabela conversations não encontrada!';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chat_messages') THEN
    RAISE EXCEPTION 'Tabela chat_messages não encontrada!';
  END IF;

  -- Verificar se RLS está ativo
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'conversations' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS não está ativo em conversations!';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'chat_messages' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS não está ativo em chat_messages!';
  END IF;

  RAISE NOTICE '✅ Migration aplicada com sucesso!';
  RAISE NOTICE '✅ RLS configurado corretamente';
  RAISE NOTICE '✅ Políticas criadas';
  RAISE NOTICE '✅ Índices otimizados';
  RAISE NOTICE '✅ Realtime habilitado';
END $$;
