# 🌱 Gseed Portal

> Plataforma de conexão entre profissionais e projetos cristãos

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/growthseed/gseed-portal)

---

## 📋 Sobre o Projeto

O **Gseed Portal** é uma plataforma que conecta profissionais cristãos qualificados com projetos e oportunidades dentro da comunidade ASDRM (Adventistas do Sétimo Dia da Reforma Mundial).

### ✨ Principais Funcionalidades

- 🔐 **Autenticação Segura** - Sistema completo de login e cadastro
- 👤 **Perfis Completos** - Perfis de usuário e profissional personalizáveis
- 📋 **Gestão de Projetos** - Criação e gerenciamento de projetos e vagas
- 💼 **Sistema de Propostas** - Envio e recebimento de propostas
- 💬 **Chat em Tempo Real** - Comunicação direta entre usuários
- 🔔 **Notificações** - Sistema completo de notificações
- 🎨 **Tema Claro/Escuro** - Interface adaptável
- 📱 **Totalmente Responsivo** - Funciona em todos os dispositivos

---

## 🚀 Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** TailwindCSS + Radix UI
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Upload:** Cloudinary
- **Deploy:** Vercel
- **Email:** Brevo (Sendinblue)

---

## 📦 Estrutura do Projeto

```
gseed-portal/
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços e integrações
│   ├── contexts/       # Contextos React (Auth, Theme)
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Configurações e utilitários
│   └── types/          # Tipos TypeScript
├── supabase/
│   └── schema.sql      # Schema do banco de dados
└── public/             # Assets estáticos
```

---

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Cloudinary

### Instalação

```bash
# Clone o repositório
git clone https://github.com/growthseed/gseed-portal.git
cd gseed-portal

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
VITE_SUPABASE_URL=seu_supabase_url
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=seu_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset

# Brevo (opcional)
VITE_BREVO_API_KEY=sua_brevo_api_key
```

### Desenvolvimento

```bash
# Rodar em modo desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## 🗄️ Banco de Dados

O schema do banco está em `supabase/schema.sql`.

Para aplicar o schema:

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Cole o conteúdo de `schema.sql`
4. Execute

---

## 🚀 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/growthseed/gseed-portal)

1. Clique no botão acima
2. Configure as variáveis de ambiente
3. Deploy!

### Manual

```bash
# Build
npm run build

# A pasta dist/ contém os arquivos para deploy
```

---

## 📱 Funcionalidades Detalhadas

### 🔐 Autenticação
- Login com email/senha
- Cadastro com validação
- Recuperação de senha
- Proteção de rotas

### 👤 Perfis
- Perfil pessoal completo
- Perfil profissional público
- Upload de avatar e capa
- Portfolio de imagens
- Habilidades e serviços

### 📋 Projetos
- Criação de projetos e vagas
- Filtros avançados
- Busca por texto
- Sistema de categorias

### 💼 Propostas
- Enviar propostas para projetos
- Ver propostas enviadas
- Receber e gerenciar propostas
- Aceitar/Rejeitar propostas

### 💬 Chat
- Chat em tempo real (Supabase Realtime)
- Notificações de novas mensagens
- Lista de conversas
- Histórico completo

---

## 🎨 Design System

O projeto utiliza:
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones
- **Tema claro/escuro** nativo

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é propriedade da **GrowthSeed / ASDRM**.

---

## 📞 Suporte

- **Website:** [gseed.works](https://gseed.works) (em breve)
- **Email:** contato@gseed.com.br
- **Issues:** [GitHub Issues](https://github.com/growthseed/gseed-portal/issues)

---

## 🗺️ Roadmap

### ✅ Fase 1 - MVP (Concluído)
- [x] Sistema de autenticação
- [x] Perfis de usuário
- [x] Gestão de projetos
- [x] Sistema de propostas
- [x] Chat em tempo real
- [x] Notificações

### 🔄 Fase 2 - Melhorias (Em andamento)
- [ ] Sistema de avaliações
- [ ] Dashboard de analytics
- [ ] Filtros avançados
- [ ] Notificações por email

### 🔮 Fase 3 - Gseed Connect (Planejado)
- [ ] Integração Google Calendar
- [ ] Sistema de pagamentos (Stripe)
- [ ] Integração WhatsApp Business
- [ ] API pública
- [ ] Webhooks
- [ ] Dashboard avançado

---

## 👥 Time

Desenvolvido com ❤️ pela equipe **GrowthSeed**

---

## 🙏 Agradecimentos

- Comunidade ASDRM
- Todos os beta testers
- Contribuidores do projeto

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!**

---

*Última atualização: Outubro 2025*
