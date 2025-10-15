# 📋 MAPEAMENTO COMPLETO - GSEED PORTAL

**Data de Atualização:** 15/10/2025  
**Status:** ✅ Conectado e Funcional

---

## 🎯 VISÃO GERAL

O Gseed Portal é uma plataforma que conecta profissionais a projetos/vagas. O sistema suporta múltiplas categorias profissionais incluindo:
- 💻 Tecnologia
- 🎨 Design e Criativos
- 📈 Marketing e Vendas
- ⚖️ Jurídico e Contabilidade
- 🏗️ Arquitetura e Engenharia
- 🎵 Música e Arte
- 💪 Saúde e Bem-estar
- 🎓 Educação e Treinamento
- E mais...

---

## 📊 ESTRUTURA DO BANCO DE DADOS

### **Tabelas Principais:**

#### 1. **profiles** (Perfil do Usuário)
```sql
- id (UUID, PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- phone (VARCHAR)
- bio (TEXT)
- avatar_url (TEXT) → Cloudinary
- cover_url (TEXT) → Cloudinary
- city, state (VARCHAR)
- is_asdrm_member (BOOLEAN)
- website, company_segment, company_description (TEXT)
```

#### 2. **professional_profiles** (Perfil Profissional)
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- title (VARCHAR) → Ex: "Advogado Especialista em Direito Digital"
- professional_bio (TEXT)
- skills (TEXT[]) → Ex: ['React', 'Node.js', 'TypeScript']
- categories (TEXT[]) → Ex: ['Programação e Tecnologia']
- portfolio_images (TEXT[]) → URLs do Cloudinary
- availability (ENUM) → 'full_time', 'part_time', 'freelance', 'unavailable'
- hourly_rate (NUMERIC)
- hourly_rate_min, hourly_rate_max (NUMERIC)
- years_of_experience (INTEGER)
- custom_profession (TEXT) → Para profissões personalizadas
```

#### 3. **projects** (Projetos/Vagas)
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- title, description (TEXT)
- category (VARCHAR) → Categoria do projeto
- required_profession (VARCHAR)
- required_skills (TEXT[])
- budget_type (VARCHAR) → 'fixed', 'range', 'hourly'
- budget_min, budget_max, budget_value (NUMERIC)
- deadline_type (VARCHAR) → 'date', 'days', 'flexible'
- deadline_date (DATE)
- deadline_days (INTEGER)
- location_type (VARCHAR) → 'remote', 'onsite', 'hybrid'
- location_city, location_state (VARCHAR)
- status (VARCHAR) → 'open', 'closed', 'in_progress', 'completed'
- is_urgent (BOOLEAN)
- requisitos, beneficios (TEXT[])
```

#### 4. **proposals** (Propostas)
```sql
- id (UUID, PK)
- project_id (UUID, FK → projects)
- professional_id (UUID, FK → professional_profiles)
- user_id (UUID, FK → profiles)
- message (TEXT)
- proposed_value (NUMERIC)
- proposed_deadline (VARCHAR)
- status (VARCHAR) → 'pending', 'accepted', 'rejected', 'withdrawn'
- is_viewed (BOOLEAN)
```

#### 5. **reviews** (Avaliações)
```sql
- id (UUID, PK)
- project_id (UUID, FK → projects)
- reviewer_id (UUID, FK → profiles)
- reviewed_id (UUID, FK → profiles)
- rating (INTEGER) → 1-5
- comment (TEXT)
```

#### 6. **conversations & messages** (Chat)
```sql
conversations:
- id (UUID, PK)
- project_id (UUID, FK)
- participant_1_id, participant_2_id (UUID, FK → profiles)

messages:
- id (UUID, PK)
- conversation_id (UUID, FK)
- sender_id (UUID, FK → profiles)
- content (TEXT)
- is_read (BOOLEAN)
```

---

## 🎨 CATEGORIAS DE PROFISSÕES

### **1. Design e Criativos** 🎨
**Especialidades:**
- Designer Gráfico, Designer UX/UI, Motion Designer, Ilustrador(a), 3D Artist

**Habilidades:**
- Photoshop, Illustrator, Figma, Sketch, Adobe XD, After Effects, Canva, Blender

---

### **2. Programação e Tecnologia** 💻
**Especialidades:**
- Programador(a), Desenvolvedor(a) Web/Mobile, Dados & Analytics, DevOps, QA/Tester

**Habilidades:**
- JavaScript, TypeScript, React, Vue.js, Node.js, Python, Java, SQL, AWS, Docker

---

### **3. Marketing e Vendas** 📈
**Especialidades:**
- Gestor(a) de tráfego, Marketing Digital, Social Media, SEO, Copywriter

**Habilidades:**
- Google Ads, Facebook Ads, SEO, Analytics, Copywriting, Funil de vendas

---

### **4. Jurídico e Contabilidade** ⚖️
**Especialidades:**
- Advogado(a), Contador(a), Consultor(a) Jurídico, Consultor(a) de Investimentos

**Habilidades:**
- Direito Digital, LGPD, Contratos, Contabilidade, Planejamento Tributário, Investimentos

---

### **5. Arquitetura e Engenharia** 🏗️
**Especialidades:**
- Arquiteto(a), Engenheiro(a) Civil, Designer de Interiores

**Habilidades:**
- AutoCAD, SketchUp, Revit, Projeto Arquitetônico, BIM

---

### **6. Música e Arte** 🎵
**Especialidades:**
- Músico, Produtor Musical, Professor(a) de Música, Cantor(a), DJ

**Habilidades:**
- Violão, Piano, Bateria, Canto, Produção Musical, Logic Pro, Ableton

---

### **7. Saúde e Bem-estar** 💪
**Especialidades:**
- Personal Trainer, Nutricionista, Psicólogo(a), Terapeuta, Fisioterapeuta

**Habilidades:**
- Musculação, Nutrição, Psicoterapia, Yoga, Pilates, Mindfulness

---

### **8. Treinamento e Educação** 🎓
**Especialidades:**
- Professor(a), Coach, Mentor(a), Palestrante, Tutor(a)

**Habilidades:**
- Didática, Coaching, Oratória, EAD, Design Instrucional

---

## 🔌 INTEGRAÇÕES EXTERNAS

### **1. Cloudinary** (Upload de Imagens)
```javascript
// Configuração
VITE_CLOUDINARY_CLOUD_NAME=dsgqx6ouw
VITE_CLOUDINARY_UPLOAD_PRESET=gseed_uploads

// Serviço: src/services/cloudinaryService.ts
uploadToCloudinary(file, folder='avatars')
getImageUrl(url, { width, height, quality })
```

**Uso:**
- Avatar de usuários
- Fotos de capa
- Portfólio de profissionais
- Anexos de projetos

---

### **2. Supabase** (Backend & Auth)
```javascript
// Configuração
VITE_SUPABASE_URL=https://xnwnwvhoulxxzxtxqmbr.supabase.co
VITE_SUPABASE_ANON_KEY=[chave]

// Cliente: src/lib/supabase.ts
import { supabase } from '@/lib/supabase'
```

**Recursos Habilitados:**
- ✅ Autenticação (Email/Password)
- ✅ OAuth (Google, LinkedIn) → Configurar
- ✅ Database com RLS
- ✅ Storage (via Cloudinary)
- ✅ Realtime (Chat)

---

### **3. Brevo (E-mail Marketing)**
```javascript
VITE_BREVO_API_KEY=[chave]
// Serviço: src/services/brevoService.ts
```

**E-mails Automatizados:**
- Boas-vindas
- Recuperação de senha
- Notificações de propostas
- Atualizações de projetos

---

## 📁 ESTRUTURA DE ARQUIVOS

```
gseed-portal/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── FilterSidebar.tsx       ✅ Filtros laterais
│   │   │   ├── PublicHeader.tsx        ✅ Header público
│   │   │   └── ChatPanel.tsx           ✅ Chat em tempo real
│   │   └── ui/                         ✅ Componentes base
│   │
│   ├── pages/
│   │   ├── ProfissionaisPage.tsx       ✅ Listagem de profissionais
│   │   ├── ProfissionalDetalhes.tsx    ✅ Detalhes do profissional
│   │   ├── ProjetosPage.tsx            ✅ Listagem de projetos
│   │   ├── ProjetoDetalhes.tsx         ✅ Detalhes do projeto
│   │   ├── CriarProjetoPage.tsx        ✅ Criar novo projeto
│   │   ├── CriarVagaPage.tsx           ✅ Criar nova vaga
│   │   ├── MinhasPropostas.tsx         ✅ Propostas enviadas
│   │   ├── PropostasRecebidas.tsx      ✅ Propostas recebidas
│   │   ├── Perfil.tsx                  ✅ Editar perfil
│   │   └── Chat.tsx                    ✅ Mensagens
│   │
│   ├── services/
│   │   ├── professionalService.ts      ✅ CRUD profissionais
│   │   ├── projectService.ts           ✅ CRUD projetos
│   │   ├── proposalService.ts          ✅ CRUD propostas
│   │   ├── cloudinaryService.ts        ✅ Upload de imagens
│   │   ├── chatService.ts              ✅ Chat em tempo real
│   │   └── authService.ts              ✅ Autenticação
│   │
│   ├── data/
│   │   └── professions.ts              ✅ Categorias e habilidades
│   │
│   ├── constants/
│   │   └── professions.ts              ✅ Lista de profissões
│   │
│   └── types/
│       └── database.types.ts           ✅ TypeScript types
│
├── supabase/
│   ├── schema.sql                      ✅ Schema completo
│   └── migrations/                     ✅ Migrações
│
└── .env                                ✅ Variáveis de ambiente
```

---

## 🚀 FLUXOS PRINCIPAIS

### **1. Fluxo do Profissional**
```
1. Cadastro → Login
2. Completar perfil profissional
   - Categoria e especialidade
   - Habilidades
   - Valor/hora
   - Portfólio
3. Buscar projetos
4. Enviar proposta
5. Chat com cliente
6. Executar projeto
7. Receber avaliação
```

### **2. Fluxo do Cliente/Contratante**
```
1. Cadastro → Login
2. Criar projeto/vaga
   - Categoria
   - Descrição detalhada
   - Orçamento
   - Prazo
   - Habilidades necessárias
3. Receber propostas
4. Avaliar profissionais
5. Contratar
6. Chat com profissional
7. Avaliar trabalho
```

---

## 🔧 FUNCIONALIDADES IMPLEMENTADAS

### ✅ **Autenticação**
- Login/Registro por email
- OAuth (Google, LinkedIn) → Pendente configuração final
- Recuperação de senha
- Perfis separados (Cliente/Profissional)

### ✅ **Perfis Profissionais**
- Busca e filtros avançados
- Categorização por profissão
- Filtro por habilidades
- Portfolio de imagens
- Avaliações e reviews

### ✅ **Projetos/Vagas**
- Criação e edição
- Filtros por categoria, orçamento, prazo
- Status tracking
- Anexos de arquivos

### ✅ **Sistema de Propostas**
- Envio de propostas
- Gestão de propostas (aceitar/rejeitar)
- Histórico de propostas

### ✅ **Chat em Tempo Real**
- Conversas 1-1
- Indicador de mensagens não lidas
- Anexos de arquivos
- Notificações

### ✅ **Notificações**
- Sistema de notificações in-app
- E-mails automatizados (Brevo)

### ✅ **Upload de Arquivos**
- Imagens via Cloudinary
- Otimização automática
- Múltiplos formatos

---

## 🎯 PRÓXIMOS PASSOS

### **Fase 1: Validação e Testes** (Esta semana)
- [x] Criar dados de teste
- [x] Validar filtros
- [ ] Testar upload de imagens
- [ ] Validar criação de projetos
- [ ] Testar envio de propostas
- [ ] Validar chat em tempo real

### **Fase 2: OAuth e Autenticação** (Próxima semana)
- [ ] Configurar OAuth Google
- [ ] Configurar OAuth LinkedIn
- [ ] Testar fluxos de autenticação
- [ ] Validar recuperação de senha

### **Fase 3: Refinamentos** (Depois)
- [ ] Adicionar mais filtros avançados
- [ ] Sistema de favoritos
- [ ] Notificações push
- [ ] Dashboard de analytics
- [ ] Sistema de pagamentos

---

## 📞 SUPORTE

Para dúvidas ou problemas:
- Email: grupo@gseed.com.br
- Documentação: Este arquivo + código comentado

---

**Última atualização:** 15/10/2025  
**Versão do Sistema:** 1.0.0  
**Mantido por:** Gseed Team
