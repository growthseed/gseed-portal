# 📋 MAPEAMENTO COMPLETO DE CAMPOS - GSEED

## 🎯 PROJETOS

### ✅ Campos que JÁ EXISTEM no Supabase

| Campo no Frontend | Campo no Supabase | Tipo | Observação |
|-------------------|-------------------|------|------------|
| `id` | `id` | UUID | ✅ OK |
| `titulo` | `titulo` | TEXT | ✅ OK |
| `descricao` | `descricao` | TEXT | ✅ OK |
| `categoria` | `categoria` | TEXT | ✅ OK |
| `nivel` | `nivel_experiencia` | TEXT | ✅ OK |
| `habilidades` | `habilidades_necessarias` | TEXT[] | ✅ OK |
| `status` | `status` | TEXT | ✅ OK |
| `publicadoEm` | `created_at` | TIMESTAMP | ✅ OK |
| `candidatos` | `total_propostas` | INTEGER | ✅ OK |
| `cidade` | `cidade` | TEXT | ✅ OK |
| `estado` | `estado` | TEXT | ✅ OK |
| `isRemoto` | `is_remoto` | BOOLEAN | ✅ OK |
| `isUrgente` | `is_urgente` | BOOLEAN | ✅ OK |
| `anexos` | `anexos` | TEXT[] | ✅ OK |

### ⚠️ Campos que PRECISAM SER CALCULADOS

| Campo no Frontend | Como Calcular | Observação |
|-------------------|---------------|------------|
| `empresa` | `JOIN client_profiles.company_name` | Buscar via `client_id` |
| `logo` | `JOIN client_profiles.avatar_url` | Buscar via `client_id` |
| `localizacao` | `cidade + ', ' + estado` | Concatenar campos |
| `tipo` | `is_remoto ? 'Remoto' : 'Presencial'` | Converter boolean |
| `valor` | `'R$ ' + orcamento_min + ' - R$ ' + orcamento_max` | Formatar valores |
| `prazo` | Depende de `prazo_tipo` | Ver lógica abaixo |

**Lógica do Prazo:**
```javascript
if (prazo_tipo === 'data') {
  prazo = formatDate(prazo_data)
} else if (prazo_tipo === 'descricao') {
  prazo = prazo_descricao
}
```

### ❌ Campos que NÃO EXISTEM no Supabase (FALTAM!)

| Campo no Frontend | Sugestão | Ação Necessária |
|-------------------|----------|-----------------|
| `requisitos` | `requisitos TEXT[]` | ⚠️ ADICIONAR COLUNA |
| `beneficios` | `beneficios TEXT[]` | ⚠️ ADICIONAR COLUNA |

---

## 👤 PROFISSIONAIS

### ✅ Campos que JÁ EXISTEM no Supabase

| Campo no Frontend | Campo no Supabase | Tipo | Observação |
|-------------------|-------------------|------|------------|
| `id` | `id` | UUID | ✅ OK |
| `nome` | `full_name` | TEXT | ✅ OK |
| `avatar` | `avatar_url` | TEXT | ✅ OK |
| `capa` | `cover_photo_url` | TEXT | ✅ OK |
| `bio` | `bio` | TEXT | ✅ OK |
| `categoria` | `categoria` | TEXT | ✅ OK |
| `especialidade` | `especialidade` | TEXT | ✅ OK |
| `habilidades` | `habilidades` | TEXT[] | ✅ OK |
| `whatsapp` | `whatsapp` | TEXT | ✅ OK |
| `email` | `email` | TEXT | ✅ OK |
| `cidade` | `cidade` | TEXT | ✅ OK |
| `estado` | `estado` | TEXT | ✅ OK |
| `portfolioImages` | `portfolio_images` | TEXT[] | ✅ OK |
| `portfolioLinks` | `portfolio_links` | TEXT[] | ✅ OK |
| `totalProjetos` | `total_projetos` | INTEGER | ✅ OK |
| `projetosConcluidos` | `projetos_concluidos` | INTEGER | ✅ OK |
| `avaliacaoMedia` | `avaliacao_media` | DECIMAL | ✅ OK |
| `totalAvaliacoes` | `total_avaliacoes` | INTEGER | ✅ OK |
| `isVerificado` | `is_verificado` | BOOLEAN | ✅ OK |
| `isTalentoAscensao` | `is_talento_ascensao` | BOOLEAN | ✅ OK |
| `isNovo` | `is_novo` | BOOLEAN | ✅ OK |

### ⚠️ Campos que PRECISAM SER CALCULADOS

| Campo no Frontend | Como Calcular | Observação |
|-------------------|---------------|------------|
| `localizacao` | `cidade + ', ' + estado` | Concatenar campos |

### ❌ Campos que podem estar no MOCK mas não no banco

| Campo no Mock | Existe no Banco? | Observação |
|---------------|------------------|------------|
| `experiencias[]` | ❌ NÃO | Precisa de tabela separada `professional_experiences` |
| `educacao[]` | ❌ NÃO | Precisa de tabela separada `professional_education` |
| `certificacoes[]` | ❌ NÃO | Precisa de tabela separada `professional_certifications` |
| `depoimentos[]` | ❌ NÃO | Usar tabela `reviews` existente |

---

## 🔧 AÇÕES NECESSÁRIAS

### 1. ⚠️ ADICIONAR COLUNAS FALTANTES NO BANCO

Execute este SQL no Supabase:

```sql
-- Adicionar requisitos e benefícios aos projetos
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS requisitos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS beneficios TEXT[] DEFAULT '{}';

-- Criar tabela de experiências profissionais
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

-- Criar tabela de educação
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

-- Criar tabela de certificações
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

-- Indexes
CREATE INDEX idx_professional_experiences ON professional_experiences(professional_id);
CREATE INDEX idx_professional_education ON professional_education(professional_id);
CREATE INDEX idx_professional_certifications ON professional_certifications(professional_id);
```

### 2. ✅ CRIAR SERVICES PARA BUSCAR DADOS

Precisamos criar ou atualizar:

- ✅ `src/services/projectService.ts` - Buscar projetos com JOIN de client_profiles
- ✅ `src/services/professionalService.ts` - Buscar profissionais com experiências/educação
- ✅ `src/services/proposalService.ts` - Já existe! ✅

### 3. 🔄 ATUALIZAR PÁGINAS PARA USAR DADOS REAIS

**Páginas que usam MOCK e precisam ser atualizadas:**

1. ❌ `ProjetoDetalhes.tsx` - Linha 27: `const projeto = { ... }` (MOCK)
2. ❌ `ProjetosPage.tsx` - Linha XX: `const projetosMock = [ ... ]` (MOCK)
3. ❌ `ProfissionalDetalhes.tsx` - Linha XX: `const profissional = { ... }` (MOCK)
4. ❌ `ProfissionaisPage.tsx` - Linha XX: `const profissionaisMock = [ ... ]` (MOCK)
5. ❌ `Dashboard.tsx` - Estatísticas mockadas
6. ❌ `MeusProjetos.tsx` - Lista mockada
7. ❌ `MinhasPropostas.tsx` - Já usa dados reais! ✅

---

## 📝 PRÓXIMOS PASSOS RECOMENDADOS

### 🔴 CRÍTICO (Fazer AGORA)

1. ✅ **Adicionar colunas faltantes no Supabase**
   - `requisitos` e `beneficios` na tabela `projects`
   - Tabelas de `experiences`, `education`, `certifications`

2. ✅ **Criar/Atualizar Services**
   - `projectService.getProjectById()` - com JOIN
   - `projectService.getAllProjects()` - com filtros
   - `professionalService.getProfessionalById()` - com experiências
   - `professionalService.getAllProfessionals()` - com filtros

3. ✅ **Atualizar Páginas**
   - Remover MOCK de ProjetoDetalhes
   - Remover MOCK de ProjetosPage
   - Remover MOCK de ProfissionalDetalhes
   - Remover MOCK de ProfissionaisPage

### 🟡 IMPORTANTE (Fazer DEPOIS)

4. ✅ **Sistema de Upload**
   - Configurar Supabase Storage
   - Upload de avatares
   - Upload de portfolio
   - Upload de anexos

5. ✅ **Dashboard Funcional**
   - Buscar estatísticas reais
   - Últimos projetos do usuário
   - Últimas propostas

### 🟢 MELHORIAS (Futuro)

6. ✅ **Sistema de Busca**
   - Filtros funcionais
   - Ordenação
   - Paginação

---

## 📊 RESUMO DO ESTADO ATUAL

| Componente | Usa Dados Reais? | Precisa Atualizar? |
|------------|------------------|-------------------|
| MinhasPropostas | ✅ SIM | ❌ NÃO |
| ProjetoDetalhes | ❌ NÃO (MOCK) | ✅ SIM |
| ProjetosPage | ❌ NÃO (MOCK) | ✅ SIM |
| ProfissionalDetalhes | ❌ NÃO (MOCK) | ✅ SIM |
| ProfissionaisPage | ❌ NÃO (MOCK) | ✅ SIM |
| Dashboard | ❌ NÃO (MOCK) | ✅ SIM |
| MeusProjetos | ❌ NÃO (MOCK) | ✅ SIM |
| CriarProjeto | ✅ SIM | ❌ NÃO |
| CriarVaga | ✅ SIM | ❌ NÃO |

---

## ✅ CHECKLIST FINAL

Antes de remover os templates (MOCKS), certifique-se de que:

- [ ] Todas as colunas necessárias existem no Supabase
- [ ] Services estão implementados e testados
- [ ] Páginas estão buscando dados do banco
- [ ] Upload de imagens está funcionando
- [ ] Validações estão corretas
- [ ] Dark mode está aplicado em tudo
- [ ] Não há erros no console

**Quando todos os ✅ estiverem marcados, podemos remover os MOCKs!** 🎉
