# ⭐ Sistema de Avaliações - README

## 📖 Visão Geral

O Sistema de Avaliações permite que clientes avaliem profissionais que contrataram através da plataforma Gseed Portal. O sistema garante autenticidade através de validações robustas e mantém automaticamente a média de avaliações atualizada.

---

## ✨ Funcionalidades

### Para Clientes
- ✅ Avaliar profissionais contratados (5 estrelas + comentário)
- ✅ Ver todas as avaliações de um profissional
- ✅ Ver média e distribuição de notas
- ✅ Apenas 1 avaliação por profissional

### Para Profissionais
- ✅ Receber avaliações de clientes
- ✅ Média atualizada automaticamente no perfil
- ✅ Contador de avaliações totais
- ✅ Visibilidade pública das avaliações

### Para Visitantes
- ✅ Ver todas as avaliações (público)
- ✅ Ver média e estatísticas
- ✅ Filtrar profissionais por avaliação

---

## 🏗️ Arquitetura

### Componentes (Frontend)

#### 1. AvaliacaoForm
**Localização**: `src/components/Avaliacoes/AvaliacaoForm.tsx`

Formulário para criar avaliações.

**Props**:
```typescript
interface AvaliacaoFormProps {
  professionalId: string;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  onCancel: () => void;
}
```

**Funcionalidades**:
- Sistema de 5 estrelas interativo
- Comentário opcional (máx 500 caracteres)
- Validação de rating obrigatório
- Loading state durante submit

#### 2. AvaliacaoItem
**Localização**: `src/components/Avaliacoes/AvaliacaoItem.tsx`

Card individual de avaliação.

**Props**:
```typescript
interface AvaliacaoItemProps {
  rating: number;
  comment: string;
  clientName: string;
  createdAt: string;
}
```

**Funcionalidades**:
- Exibe estrelas preenchidas
- Nome do cliente e data
- Comentário formatado

#### 3. AvaliacaoList
**Localização**: `src/components/Avaliacoes/AvaliacaoList.tsx`

Lista completa com estatísticas.

**Props**:
```typescript
interface AvaliacaoListProps {
  avaliacoes: Avaliacao[];
  averageRating: number;
  totalAvaliacoes: number;
}
```

**Funcionalidades**:
- Resumo com média geral
- Gráfico de distribuição de estrelas
- Lista de todas as avaliações
- Estado vazio customizado

### Serviço (Backend)

#### avaliacaoService
**Localização**: `src/services/avaliacaoService.ts`

Service completo para gerenciar avaliações.

**Métodos**:

```typescript
// Verificar se cliente contratou profissional
hasHiredProfessional(clientId: string, professionalId: string): Promise<boolean>

// Verificar se já avaliou
hasAlreadyReviewed(clientId: string, professionalId: string): Promise<boolean>

// Criar nova avaliação
createAvaliacao(data: CreateAvaliacaoData): Promise<Avaliacao | null>

// Buscar avaliações de um profissional
getAvaliacoesByProfessional(professionalId: string): Promise<Avaliacao[]>

// Calcular média
getProfessionalRating(professionalId: string): Promise<{ average: number; total: number }>
```

---

## 🗄️ Banco de Dados

### Tabela: reviews

```sql
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL,
    client_id UUID NOT NULL,
    client_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(professional_id, client_id)
);
```

**Índices**:
- `idx_reviews_professional` (professional_id)
- `idx_reviews_client` (client_id)
- `idx_reviews_created_at` (created_at DESC)
- `idx_reviews_rating` (rating)

### Tabela: contracts

```sql
CREATE TABLE public.contracts (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL,
    professional_id UUID NOT NULL,
    project_title TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    ...
);
```

### Campos Adicionados: professional_profiles

```sql
ALTER TABLE professional_profiles 
ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN total_reviews INTEGER DEFAULT 0;
```

### Trigger Automático

```sql
CREATE TRIGGER trigger_update_professional_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION calculate_professional_rating();
```

**Função**: Recalcula automaticamente `average_rating` e `total_reviews` após qualquer mudança em `reviews`.

---

## 🔒 Regras de Negócio

### Validações

1. **Autenticação Obrigatória**
   - Usuário deve estar autenticado para avaliar
   - Validado via RLS no Supabase

2. **Contratação Obrigatória**
   ```typescript
   // Cliente deve ter contratado o profissional
   const contract = await contracts
     .where({ client_id, professional_id, status: 'completed' })
     .first();
   
   if (!contract) throw new Error('Você precisa ter contratado este profissional');
   ```

3. **Avaliação Única**
   ```typescript
   // Cada cliente pode avaliar apenas 1x cada profissional
   const existing = await reviews
     .where({ client_id, professional_id })
     .first();
   
   if (existing) throw new Error('Você já avaliou este profissional');
   ```

4. **Rating Válido**
   - Deve estar entre 1 e 5
   - Validado no frontend e backend
   - Constraint no banco de dados

5. **Comentário Opcional**
   - Máximo de 500 caracteres
   - Pode ser vazio

### Políticas RLS

```sql
-- Todos podem LER
CREATE POLICY "read_reviews" ON reviews FOR SELECT USING (true);

-- Apenas autenticados podem CRIAR
CREATE POLICY "create_reviews" ON reviews 
FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Apenas dono pode ATUALIZAR
CREATE POLICY "update_reviews" ON reviews 
FOR UPDATE USING (auth.uid() = client_id);

-- Apenas dono pode DELETAR
CREATE POLICY "delete_reviews" ON reviews 
FOR DELETE USING (auth.uid() = client_id);
```

---

## 🔄 Fluxo de Uso

### 1. Cliente Acessa Perfil do Profissional

```
Usuário → ProfissionalDetalhes → Aba "Avaliações"
```

### 2. Sistema Verifica Permissões

```typescript
const canReview = 
  isAuthenticated &&
  await hasHiredProfessional(userId, professionalId) &&
  !await hasAlreadyReviewed(userId, professionalId);
```

### 3. Cliente Avalia (se permitido)

```
Clica em "Avaliar" → AvaliacaoForm → Preenche → Submit
```

### 4. Backend Processa

```typescript
// 1. Valida novamente
// 2. Busca nome do cliente
// 3. Insere no banco
// 4. Trigger atualiza médias
// 5. Retorna sucesso
```

### 5. Frontend Atualiza

```typescript
// 1. Fecha formulário
// 2. Recarrega avaliações
// 3. Atualiza estatísticas
// 4. Mostra sucesso
```

---

## 🧪 Como Testar

### 1. Preparar Ambiente

```sql
-- Criar usuário cliente
INSERT INTO auth.users (email, ...) VALUES ('cliente@test.com', ...);

-- Criar usuário profissional
INSERT INTO auth.users (email, ...) VALUES ('prof@test.com', ...);

-- Criar contrato completo
INSERT INTO contracts (client_id, professional_id, status) 
VALUES ('client_id', 'prof_id', 'completed');
```

### 2. Testar Criação

1. Login como cliente
2. Acesse perfil do profissional
3. Vá para aba "Avaliações"
4. Clique em "Avaliar Profissional"
5. Selecione 5 estrelas
6. Escreva comentário
7. Clique em "Enviar Avaliação"
8. Verifique sucesso

### 3. Testar Validações

```typescript
// Não autenticado → Não vê botão
// Não contratou → Não vê botão
// Já avaliou → Não vê botão
// Tentativa de avaliar 2x → Erro
```

### 4. Verificar Cálculos

```sql
-- Ver média calculada
SELECT 
    pp.id,
    pp.average_rating,
    pp.total_reviews,
    AVG(r.rating) as real_avg,
    COUNT(r.id) as real_count
FROM professional_profiles pp
LEFT JOIN reviews r ON r.professional_id = pp.id
GROUP BY pp.id;
```

---

## 🐛 Troubleshooting

### Botão "Avaliar" não aparece

**Causas possíveis**:
1. Usuário não autenticado
2. Não existe contrato `completed`
3. Usuário já avaliou

**Verificar**:
```sql
-- Checar contrato
SELECT * FROM contracts 
WHERE client_id = 'user_id' 
AND professional_id = 'prof_id' 
AND status = 'completed';

-- Checar se já avaliou
SELECT * FROM reviews 
WHERE client_id = 'user_id' 
AND professional_id = 'prof_id';
```

### Média não atualiza

**Solução**: Verificar trigger
```sql
-- Ver se trigger existe
SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_update_professional_rating';

-- Recriar se necessário
DROP TRIGGER IF EXISTS trigger_update_professional_rating ON reviews;
CREATE TRIGGER trigger_update_professional_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION calculate_professional_rating();
```

### Erro ao salvar avaliação

**Verificar**:
1. Políticas RLS ativas
2. Constraint UNIQUE não violado
3. Rating entre 1-5
4. professional_id existe

---

## 📊 Métricas e Analytics

### Queries Úteis

**Top profissionais por avaliação**:
```sql
SELECT 
    p.full_name,
    pp.average_rating,
    pp.total_reviews
FROM professional_profiles pp
JOIN profiles p ON p.id = pp.user_id
WHERE pp.total_reviews > 0
ORDER BY pp.average_rating DESC, pp.total_reviews DESC
LIMIT 10;
```

**Distribuição de notas**:
```sql
SELECT 
    rating,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM reviews
GROUP BY rating
ORDER BY rating DESC;
```

**Profissionais sem avaliação**:
```sql
SELECT 
    p.full_name,
    pp.id
FROM professional_profiles pp
JOIN profiles p ON p.id = pp.user_id
WHERE pp.total_reviews = 0;
```

---

## 🚀 Próximas Melhorias

### Curto Prazo
- [ ] Resposta do profissional à avaliação
- [ ] Editar avaliação (dentro de 7 dias)
- [ ] Notificação de nova avaliação

### Médio Prazo
- [ ] Denunciar avaliação inadequada
- [ ] Filtrar profissionais por rating mínimo
- [ ] Ordenar avaliações (mais úteis, mais recentes)

### Longo Prazo
- [ ] Sistema de badges (melhor avaliado, etc)
- [ ] Análise de sentimento nos comentários
- [ ] Relatório detalhado para profissionais

---

## 📚 Documentação Relacionada

- [GUIA_AVALIACOES.md](./GUIA_AVALIACOES.md) - Guia completo de implementação
- [RESUMO_SESSAO_06102025.md](./RESUMO_SESSAO_06102025.md) - Resumo da sessão
- [CRONOGRAMA.md](./CRONOGRAMA.md) - Roadmap do projeto

---

## 🤝 Contribuindo

Para adicionar melhorias ao sistema de avaliações:

1. Consulte o código em `src/components/Avaliacoes/`
2. Leia o service em `src/services/avaliacaoService.ts`
3. Entenda a migration em `supabase/migrations/`
4. Faça suas alterações
5. Teste completamente
6. Documente mudanças

---

## 📞 Suporte

Problemas? Consulte:
1. [GUIA_AVALIACOES.md](./GUIA_AVALIACOES.md) - Troubleshooting detalhado
2. [INDICE.md](./INDICE.md) - Índice geral
3. Issues do GitHub

---

**Versão**: 1.0.1  
**Data de Criação**: 06/10/2025  
**Última Atualização**: 25/10/2025  
**Status**: ✅ Produção

---

## 📝 Changelog

### v1.0.1 (25/10/2025)
- ✅ Corrigido erro TypeScript em AvaliacaoList.tsx
- ✅ Corrigido referências de `client.full_name` para `client.name`
- ✅ Corrigido campo `response_date` para `responded_at`
- ✅ Removido uso explícito de tipo `any` em avaliacaoService.ts
- 📚 Documentação completa em CORRECOES-AVALIACOES-25-OUT-2025.md

### v1.0.0 (06/10/2025)
- 🎉 Versão inicial do sistema de avaliações

---

*Sistema desenvolvido com ❤️ para o Gseed Portal*
