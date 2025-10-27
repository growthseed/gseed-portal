# 🤝 GSEED CONNECT - PLANO DE IMPLEMENTAÇÃO ESTRUTURADO
**Data:** 25 de Outubro de 2025  
**Status:** 📋 **EM PLANEJAMENTO**

---

## 🎯 VISÃO GERAL

O **Gseed Connect** é a rede social cristã do ecossistema Gseed, complementando o Works (marketplace de serviços) e o futuro Market (e-commerce).

**Objetivo:** Conectar cristãos para networking, eventos, relacionamentos e comunidade.

---

## 📊 ESTRUTURA DO ECOSSISTEMA GSEED

```
GSEED PLATFORM
├─ 📁 WORKS (Portal atual - 85% completo)
│  └─ Marketplace de serviços profissionais
│
├─ 🤝 CONNECT (Foco atual - 0%)
│  └─ Rede social cristã
│
├─ 🛒 MARKET (Futuro - 0%)
│  └─ E-commerce de produtos/serviços
│
└─ 💼 BUSINESS (Futuro - 15%)
   └─ CRM e gestão empresarial
```

---

## 🏗️ ARQUITETURA DO CONNECT

### **MÓDULOS PRINCIPAIS**

```
CONNECT
├─ 👤 PERFIL SOCIAL
│  ├─ Bio estendida e interesses
│  ├─ Ministério e dons espirituais
│  ├─ Fotos e álbuns
│  ├─ Timeline pessoal
│  └─ Configurações de privacidade
│
├─ 📰 FEED/TIMELINE
│  ├─ Posts (texto, imagem, vídeo, link)
│  ├─ Reações (curtir, orar, amém, celebrar)
│  ├─ Comentários (com menções)
│  ├─ Compartilhamentos
│  └─ Stories (24h)
│
├─ 👥 CONEXÕES
│  ├─ Amigos/Seguindo/Seguidores
│  ├─ Solicitações de amizade
│  ├─ Sugestões de conexão (AI-powered)
│  ├─ Busca avançada de pessoas
│  └─ Comunidades cristãs
│
├─ 📅 EVENTOS
│  ├─ Criar eventos (cultos, conferências, células)
│  ├─ Buscar e filtrar eventos
│  ├─ RSVP e confirmação de presença
│  ├─ Check-in em eventos
│  ├─ Galeria de fotos do evento
│  └─ Eventos de igrejas parceiras
│
├─ 🏛️ GRUPOS/COMUNIDADES
│  ├─ Grupos públicos e privados
│  ├─ Tipos: Ministério, Estudo, Oração, Hobby
│  ├─ Discussões e tópicos
│  ├─ Recursos compartilhados
│  ├─ Calendário de eventos do grupo
│  └─ Sistema de moderação
│
├─ 💬 MENSAGENS PRIVADAS
│  ├─ Chat 1:1 (já existe no Works)
│  ├─ Grupos de conversa
│  ├─ Compartilhamento de mídia
│  ├─ Chamadas de voz/vídeo (futuro)
│  └─ Mensagens de oração
│
├─ 🔔 NOTIFICAÇÕES
│  ├─ Atividade social (curtidas, comentários)
│  ├─ Novos seguidores
│  ├─ Convites de eventos
│  ├─ Atividade de grupos
│  └─ Menções e tags
│
└─ 🔍 BUSCA & DESCOBERTA
   ├─ Busca de pessoas por interesses
   ├─ Busca de eventos próximos
   ├─ Trending topics
   ├─ Hashtags cristãs
   └─ Recomendações personalizadas
```

---

## 📂 ESTRUTURA DE PASTAS (A CRIAR)

```
src/
├─ pages/
│  └─ connect/
│     ├─ ConnectHome.tsx         # Feed principal
│     ├─ ConnectProfile.tsx      # Perfil social
│     ├─ ConnectEvents.tsx       # Listagem de eventos
│     ├─ ConnectEventDetails.tsx # Detalhes do evento
│     ├─ ConnectGroups.tsx       # Listagem de grupos
│     ├─ ConnectGroupDetails.tsx # Detalhes do grupo
│     └─ ConnectConnections.tsx  # Amigos e conexões
│
├─ components/
│  └─ connect/
│     ├─ feed/
│     │  ├─ PostCard.tsx
│     │  ├─ PostComposer.tsx
│     │  ├─ CommentSection.tsx
│     │  └─ ReactionBar.tsx
│     │
│     ├─ profile/
│     │  ├─ SocialProfileHeader.tsx
│     │  ├─ ProfileAbout.tsx
│     │  ├─ ProfilePhotos.tsx
│     │  └─ ProfileTimeline.tsx
│     │
│     ├─ events/
│     │  ├─ EventCard.tsx
│     │  ├─ EventCreator.tsx
│     │  └─ EventRSVP.tsx
│     │
│     ├─ groups/
│     │  ├─ GroupCard.tsx
│     │  ├─ GroupCreator.tsx
│     │  ├─ GroupDiscussion.tsx
│     │  └─ GroupMembers.tsx
│     │
│     └─ connections/
│        ├─ ConnectionCard.tsx
│        ├─ FriendRequest.tsx
│        └─ Suggestions.tsx
│
├─ services/
│  └─ connect/
│     ├─ postService.ts
│     ├─ eventService.ts
│     ├─ groupService.ts
│     ├─ connectionService.ts
│     └─ reactionService.ts
│
└─ types/
   └─ connect/
      ├─ post.ts
      ├─ event.ts
      ├─ group.ts
      └─ connection.ts
```

---

## 🗄️ SCHEMA DO BANCO DE DADOS

### **TABELAS PRINCIPAIS (A CRIAR)**

```sql
-- PERFIL SOCIAL (Extensão do profiles existente)
CREATE TABLE connect_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  bio_extended TEXT,
  ministry VARCHAR(100),
  spiritual_gifts TEXT[],
  church_role VARCHAR(100),
  interests TEXT[],
  cover_photo_url TEXT,
  location JSONB, -- { city, state, country }
  privacy_settings JSONB, -- Configurações de privacidade
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POSTS
CREATE TABLE connect_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id),
  content TEXT,
  media_urls TEXT[], -- URLs de imagens/vídeos
  post_type VARCHAR(20) DEFAULT 'text', -- text, image, video, link, poll
  visibility VARCHAR(20) DEFAULT 'public', -- public, friends, private
  hashtags TEXT[],
  mentions UUID[], -- IDs de usuários mencionados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REAÇÕES
CREATE TABLE connect_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES connect_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  reaction_type VARCHAR(20), -- like, pray, amen, celebrate
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- COMENTÁRIOS
CREATE TABLE connect_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES connect_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES connect_comments(id),
  mentions UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EVENTOS
CREATE TABLE connect_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES profiles(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_type VARCHAR(50), -- culto, conferencia, celula, estudo, retiro
  location JSONB, -- { address, city, state, lat, lng }
  online_link TEXT,
  is_online BOOLEAN DEFAULT false,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  cover_image_url TEXT,
  max_attendees INTEGER,
  visibility VARCHAR(20) DEFAULT 'public',
  church_id UUID, -- Futura integração com igrejas
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVP DE EVENTOS
CREATE TABLE connect_event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES connect_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'going', -- going, interested, not_going
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GRUPOS/COMUNIDADES
CREATE TABLE connect_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  group_type VARCHAR(50), -- ministerio, estudo, oracao, hobby
  privacy VARCHAR(20) DEFAULT 'public', -- public, private, secret
  cover_image_url TEXT,
  creator_id UUID REFERENCES profiles(id),
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEMBROS DE GRUPOS
CREATE TABLE connect_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES connect_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  role VARCHAR(20) DEFAULT 'member', -- admin, moderator, member
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONEXÕES/AMIZADES
CREATE TABLE connect_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  connected_user_id UUID REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, connected_user_id)
);
```

---

## 🎯 FASES DE IMPLEMENTAÇÃO

### **FASE 1: FUNDAÇÃO (1-2 semanas)**
- [ ] Criar estrutura de pastas
- [ ] Criar schema do banco (migrations)
- [ ] Criar tipos TypeScript
- [ ] Criar serviços básicos
- [ ] Criar rotas principais

### **FASE 2: PERFIL SOCIAL (1 semana)**
- [ ] Estender perfil com dados sociais
- [ ] Timeline pessoal
- [ ] Configurações de privacidade
- [ ] Álbum de fotos

### **FASE 3: FEED & POSTS (2 semanas)**
- [ ] Composer de posts
- [ ] Exibição de posts
- [ ] Sistema de reações
- [ ] Comentários
- [ ] Compartilhamentos

### **FASE 4: CONEXÕES (1 semana)**
- [ ] Sistema de amizade
- [ ] Solicitações
- [ ] Sugestões de conexão
- [ ] Busca de pessoas

### **FASE 5: EVENTOS (1-2 semanas)**
- [ ] Criação de eventos
- [ ] Listagem e busca
- [ ] RSVP
- [ ] Check-in

### **FASE 6: GRUPOS (2 semanas)**
- [ ] Criação de grupos
- [ ] Gestão de membros
- [ ] Discussões
- [ ] Recursos

### **FASE 7: NOTIFICAÇÕES SOCIAIS (1 semana)**
- [ ] Notificações de atividades
- [ ] Real-time com Supabase
- [ ] Push notifications

### **FASE 8: POLIMENTO (1 semana)**
- [ ] UX/UI refinements
- [ ] Performance optimization
- [ ] Testes
- [ ] Documentação

**TOTAL ESTIMADO: 10-12 semanas**

---

## 📋 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ i18n implementado (COMPLETO)
2. 🎯 **Criar migrations do banco**
3. 🎯 **Criar tipos TypeScript**
4. 🎯 **Criar estrutura de pastas**
5. 🎯 **Implementar Fase 1 (Fundação)**

---

## 💡 DECISÕES TÉCNICAS

### **Tecnologias**
- React + TypeScript (já em uso)
- Supabase (já em uso)
- Cloudinary para mídia (já em uso)
- TailwindCSS (já em uso)
- Lucide Icons (já em uso)

### **Real-time**
- Supabase Realtime para:
  - Notificações
  - Reações em tempo real
  - Comentários ao vivo
  - Status online de usuários

### **Performance**
- Infinite scroll para feed
- Lazy loading de imagens
- Cache de dados frequentes
- Paginação otimizada

### **Privacidade**
- Configurações granulares
- RLS (Row Level Security) no Supabase
- Controle de visibilidade de posts
- Bloqueio de usuários

---

## 🚀 PRONTO PARA COMEÇAR!

Com a base do Works funcionando e o i18n implementado, estamos prontos para iniciar o Connect de forma estruturada e profissional.

**Próximo chat:** Implementar Fase 1 (Fundação)
