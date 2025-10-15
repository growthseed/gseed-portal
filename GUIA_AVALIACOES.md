# 🎯 GUIA DE IMPLEMENTAÇÃO - SISTEMA DE AVALIAÇÕES

## 📋 RESUMO
Este documento contém instruções passo-a-passo para implementar e testar o sistema de avaliações completo no Gseed Portal.

---

## ✅ O QUE FOI IMPLEMENTADO

### 1. Componentes React
- **AvaliacaoForm.tsx**: Formulário para criar avaliações (5 estrelas + comentário)
- **AvaliacaoItem.tsx**: Card individual de avaliação
- **AvaliacaoList.tsx**: Lista completa com estatísticas e distribuição

### 2. Serviço Backend
- **avaliacaoService.ts**: Lógica completa de negócio
  - Verificar se usuário contratou profissional
  - Verificar se já avaliou
  - Criar avaliação
  - Buscar avaliações
  - Calcular média

### 3. Banco de Dados
- **Tabela `reviews`**: Armazena avaliações
- **Tabela `contracts`**: Armazena contratos (necessária para validação)
- **Trigger automático**: Atualiza média de rating no perfil profissional
- **Políticas RLS**: Segurança e permissões

### 4. Integração
- **ProfissionalDetalhes.tsx**: Página atualizada com sistema de avaliações integrado

---

## 🚀 PASSO A PASSO PARA DEPLOYMENT

### PASSO 1: Executar Migration no Supabase

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto Gseed Portal
3. Vá em **SQL Editor**
4. Clique em **New Query**
5. Copie o conteúdo do arquivo:
   ```
   C:\Users\EFEITO DIGITAL\gseed-portal\supabase\migrations\20251006_avaliacoes_sistema.sql
   ```
6. Cole na query
7. Clique em **Run** (ou pressione Ctrl+Enter)
8. Aguarde a execução (deve mostrar "Success")

### PASSO 2: Verificar Tabelas Criadas

Execute no SQL Editor:
```sql
-- Verificar tabela reviews
SELECT * FROM public.reviews LIMIT 5;

-- Verificar tabela contracts
SELECT * FROM public.contracts LIMIT 5;

-- Verificar se campos foram adicionados em professional_profiles
SELECT id, average_rating, total_reviews 
FROM public.professional_profiles 
LIMIT 5;
```

### PASSO 3: Testar Localmente

1. Abra o terminal no diretório do projeto
2. Execute:
   ```bash
   npm run dev
   ```
3. Acesse: http://localhost:5173

### PASSO 4: Fluxo de Teste Completo

#### 4.1 Criar Usuário Cliente (se não existir)
1. Acesse /register
2. Crie uma conta como **Cliente/Contratante**
3. Complete o onboarding

#### 4.2 Criar Usuário Profissional (se não existir)
1. Em aba anônima, acesse /register
2. Crie uma conta como **Profissional**
3. Complete o perfil profissional

#### 4.3 Simular Contratação (via SQL)
Como o sistema de contratação ainda está em desenvolvimento, simule manualmente:

```sql
-- Copie os IDs dos usuários
SELECT id, email, full_name FROM auth.users;

-- Insira um contrato completo
INSERT INTO public.contracts (
    client_id,
    professional_id,
    project_title,
    project_description,
    budget,
    status,
    start_date,
    end_date
) VALUES (
    'ID_DO_CLIENTE',        -- Substitua pelo ID real
    'ID_DO_PROFISSIONAL',   -- Substitua pelo ID real do professional_profile
    'Projeto Teste',
    'Descrição do projeto de teste',
    1000.00,
    'completed',            -- IMPORTANTE: deve ser 'completed'
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '1 day'
);
```

#### 4.4 Testar Avaliação
1. Faça login com o usuário **Cliente**
2. Acesse a página do profissional: `/profissionais/:id`
3. Clique na aba **Avaliações**
4. Deve aparecer o botão **"Avaliar Profissional"**
5. Clique e preencha:
   - Selecione 5 estrelas
   - Escreva um comentário
   - Clique em **Enviar Avaliação**
6. Verifique se:
   - Avaliação aparece na lista
   - Média é calculada corretamente
   - Botão "Avaliar" desaparece (já avaliou)

#### 4.5 Testar Restrições
1. Tente criar outra avaliação → Deve bloquear com mensagem
2. Faça logout e acesse como visitante → Deve ver avaliações mas não avaliar
3. Faça login com outro usuário que não contratou → Não deve ver botão de avaliar

---

## 🧪 TESTES DE VALIDAÇÃO

### Teste 1: Usuário Não Autenticado
- **Ação**: Acessar página do profissional sem login
- **Esperado**: Ver avaliações, mas não conseguir avaliar

### Teste 2: Usuário Que Não Contratou
- **Ação**: Fazer login com usuário sem contratação
- **Esperado**: Ver avaliações, mas não ver botão de avaliar

### Teste 3: Usuário Que Contratou
- **Ação**: Fazer login com usuário que tem contrato "completed"
- **Esperado**: Ver botão "Avaliar Profissional"

### Teste 4: Criar Avaliação
- **Ação**: Submeter formulário de avaliação
- **Esperado**: 
  - Sucesso ao salvar
  - Avaliação aparece na lista
  - Média atualizada
  - Botão desaparece

### Teste 5: Dupla Avaliação
- **Ação**: Tentar avaliar novamente
- **Esperado**: Erro "Você já avaliou este profissional"

### Teste 6: Cálculo de Média
- **Ação**: Criar múltiplas avaliações de diferentes usuários
- **Esperado**: Média calculada corretamente (soma / total)

---

## 🔍 TROUBLESHOOTING

### Erro: "Tabela reviews não existe"
**Solução**: Execute novamente a migration do Passo 1

### Erro: "RLS policies violadas"
**Solução**: Verifique se as políticas foram criadas:
```sql
SELECT * FROM pg_policies WHERE tablename IN ('reviews', 'contracts');
```

### Erro: "professional_profiles não tem average_rating"
**Solução**: Execute manualmente:
```sql
ALTER TABLE public.professional_profiles 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;

ALTER TABLE public.professional_profiles 
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
```

### Botão "Avaliar" não aparece
**Verificações**:
1. Usuário está autenticado?
2. Existe contrato com status "completed"?
3. Usuário já avaliou?

```sql
-- Verificar contratos do usuário
SELECT * FROM public.contracts 
WHERE client_id = 'SEU_USER_ID' 
AND status = 'completed';

-- Verificar se já avaliou
SELECT * FROM public.reviews 
WHERE client_id = 'SEU_USER_ID' 
AND professional_id = 'ID_DO_PROFISSIONAL';
```

### Média não atualiza automaticamente
**Solução**: Verifique se o trigger existe:
```sql
SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_update_professional_rating';
```

Se não existir, execute:
```sql
CREATE TRIGGER trigger_update_professional_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION calculate_professional_rating();
```

---

## 📊 QUERIES ÚTEIS

### Ver todas avaliações de um profissional
```sql
SELECT 
    r.*,
    u.email as client_email
FROM public.reviews r
JOIN auth.users u ON u.id = r.client_id
WHERE r.professional_id = 'ID_DO_PROFISSIONAL'
ORDER BY r.created_at DESC;
```

### Ver média e total de avaliações
```sql
SELECT 
    pp.id,
    pp.user_id,
    p.full_name,
    pp.average_rating,
    pp.total_reviews,
    COUNT(r.id) as count_reviews,
    AVG(r.rating) as calculated_avg
FROM public.professional_profiles pp
JOIN public.profiles p ON p.id = pp.user_id
LEFT JOIN public.reviews r ON r.professional_id = pp.id
GROUP BY pp.id, pp.user_id, p.full_name, pp.average_rating, pp.total_reviews;
```

### Ver contratos completados de um usuário
```sql
SELECT 
    c.*,
    p.full_name as professional_name
FROM public.contracts c
JOIN public.professional_profiles pp ON pp.id = c.professional_id
JOIN public.profiles p ON p.id = pp.user_id
WHERE c.client_id = 'ID_DO_CLIENTE'
AND c.status = 'completed';
```

### Recriar dados de teste
```sql
-- Deletar avaliações de teste
DELETE FROM public.reviews WHERE comment LIKE '%teste%';

-- Deletar contratos de teste
DELETE FROM public.contracts WHERE project_title LIKE '%teste%';

-- Resetar contadores
UPDATE public.professional_profiles 
SET average_rating = 0, total_reviews = 0;
```

---

## ✅ CHECKLIST FINAL

Antes de considerar completo, verifique:

- [ ] Migration executada com sucesso
- [ ] Tabelas `reviews` e `contracts` criadas
- [ ] Campos `average_rating` e `total_reviews` adicionados
- [ ] Políticas RLS funcionando
- [ ] Triggers criados e funcionais
- [ ] Componentes renderizando corretamente
- [ ] Formulário de avaliação funcional
- [ ] Lista de avaliações exibindo dados
- [ ] Validações funcionando:
  - [ ] Só pode avaliar quem contratou
  - [ ] Não pode avaliar duas vezes
  - [ ] Precisa estar autenticado
- [ ] Média calculando automaticamente
- [ ] Distribuição de estrelas correta
- [ ] Responsividade mobile OK
- [ ] Dark mode funcionando

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Verifique logs do Supabase
3. Execute as queries de troubleshooting
4. Revise os passos deste guia

---

## 🎉 PRÓXIMOS PASSOS

Após confirmar que o sistema de avaliações está funcionando:

1. [ ] Implementar notificações de novas avaliações
2. [ ] Adicionar resposta do profissional à avaliação
3. [ ] Sistema de denúncia de avaliações inadequadas
4. [ ] Filtrar avaliações por rating
5. [ ] Exportar relatório de avaliações

---

*Documento criado em: 06/10/2025*  
*Última atualização: 06/10/2025*
