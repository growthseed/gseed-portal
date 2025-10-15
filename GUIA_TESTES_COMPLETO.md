# 🧪 GUIA DE TESTES - GSEED PORTAL

**Data:** 15/10/2025  
**Objetivo:** Validar todas as funcionalidades conectadas ao Supabase

---

## ✅ DADOS DE TESTE CRIADOS

### **Perfis Profissionais:**

1. **Desenvolvedor Full Stack**
   - Email: grupo@gseed.com.br
   - Categoria: Programação e Tecnologia
   - Habilidades: React, Node.js, TypeScript, Supabase, Tailwind CSS
   - Valor: R$ 150/hora
   - Disponibilidade: Freelance

2. **Advogado Especialista em Direito Digital**
   - Email: johnasdmr@gmail.com
   - Categoria: Jurídico e Contabilidade
   - Habilidades: Direito Digital, LGPD, Contratos
   - Valor: R$ 250/hora
   - Disponibilidade: Part-time

### **Projetos Criados:**

1. **Desenvolvimento de Sistema de Gestão**
   - Categoria: Programação e Tecnologia
   - Orçamento: R$ 15.000 - R$ 25.000
   - Prazo: 90 dias
   - Status: Aberto

2. **Consultoria Jurídica para Startup**
   - Categoria: Jurídico e Contabilidade
   - Orçamento: R$ 5.000 - R$ 10.000
   - Prazo: 30 dias
   - Status: Aberto (URGENTE)

3. **Criação de banner para o Carnaval 2026**
   - Categoria: Designer
   - Orçamento: até R$ 1.000
   - Status: Aberto

---

## 🧪 ROTEIRO DE TESTES

### **TESTE 1: Visualizar Profissionais**

**Objetivo:** Validar listagem de profissionais

**Passos:**
1. Abrir o navegador em `http://localhost:5173`
2. Navegar para `/profissionais`
3. Verificar se aparecem 2 profissionais

**Resultado Esperado:**
- ✅ Deve mostrar os 2 profissionais
- ✅ Cards com foto, nome, título, habilidades
- ✅ Valor/hora visível
- ✅ Status de disponibilidade

**SQL de Verificação:**
```sql
SELECT 
  p.name,
  pp.title,
  pp.skills,
  pp.hourly_rate,
  pp.availability
FROM profiles p
JOIN professional_profiles pp ON pp.user_id = p.id;
```

---

### **TESTE 2: Filtros de Profissionais**

**Objetivo:** Validar sistema de filtros lateral

**Passos:**
1. Na página `/profissionais`
2. Abrir filtro lateral (se fechado)
3. Selecionar categoria "Jurídico e Contabilidade"
4. Verificar profissões disponíveis
5. Selecionar habilidade "LGPD"

**Resultado Esperado:**
- ✅ Deve mostrar apenas o Advogado
- ✅ Contador de filtros ativos deve aparecer
- ✅ Botão "Limpar filtros" deve funcionar

---

### **TESTE 3: Visualizar Projetos**

**Objetivo:** Validar listagem de projetos

**Passos:**
1. Navegar para `/projetos`
2. Verificar se aparecem os 3 projetos

**Resultado Esperado:**
- ✅ Deve mostrar 3 projetos
- ✅ Badge "URGENTE" no projeto da consultoria jurídica
- ✅ Informações de orçamento visíveis
- ✅ Habilidades necessárias listadas

**SQL de Verificação:**
```sql
SELECT 
  title,
  category,
  required_skills,
  budget_min,
  budget_max,
  is_urgent,
  status
FROM projects
WHERE status = 'open'
ORDER BY created_at DESC;
```

---

### **TESTE 4: Filtros de Projetos**

**Objetivo:** Validar filtros de projetos

**Passos:**
1. Na página `/projetos`
2. Filtrar por categoria "Programação e Tecnologia"
3. Verificar se mostra apenas o projeto correto

**Resultado Esperado:**
- ✅ Deve mostrar apenas "Desenvolvimento de Sistema de Gestão"
- ✅ Filtros devem atualizar a listagem em tempo real

---

### **TESTE 5: Detalhes do Profissional**

**Objetivo:** Validar página de detalhes

**Passos:**
1. Na página `/profissionais`
2. Clicar em um profissional
3. Verificar se carrega a página de detalhes

**Resultado Esperado:**
- ✅ Foto de perfil e capa
- ✅ Biografia completa
- ✅ Lista de habilidades
- ✅ Portfólio (se houver)
- ✅ Botão "Entrar em contato"
- ✅ Valor/hora e disponibilidade

**Rota:** `/profissionais/:id`

---

### **TESTE 6: Detalhes do Projeto**

**Objetivo:** Validar página de detalhes do projeto

**Passos:**
1. Na página `/projetos`
2. Clicar em um projeto
3. Verificar informações completas

**Resultado Esperado:**
- ✅ Título e descrição completa
- ✅ Orçamento e prazo
- ✅ Requisitos (se houver)
- ✅ Benefícios (se houver)
- ✅ Habilidades necessárias
- ✅ Informações do cliente
- ✅ Botão "Enviar Proposta"

**Rota:** `/projetos/:id`

---

### **TESTE 7: Upload de Imagem (Cloudinary)**

**Objetivo:** Testar upload de avatar

**Passos:**
1. Fazer login
2. Ir para `/perfil`
3. Clicar em "Alterar foto"
4. Selecionar uma imagem
5. Verificar se faz upload

**Resultado Esperado:**
- ✅ Loading durante upload
- ✅ Imagem aparece após upload
- ✅ URL salva no banco (cloudinary.com)

**Código para verificar:**
```javascript
// src/services/cloudinaryService.ts
await uploadToCloudinary(file, 'avatars')
```

---

### **TESTE 8: Criar Projeto**

**Objetivo:** Validar formulário de criação

**Passos:**
1. Fazer login como cliente
2. Navegar para `/criar-projeto`
3. Preencher todos os campos:
   - Título: "Teste de Projeto"
   - Categoria: "Design e Criativos"
   - Descrição completa
   - Profissão necessária
   - Habilidades
   - Orçamento
   - Prazo
4. Clicar em "Publicar Projeto"

**Resultado Esperado:**
- ✅ Validação de campos obrigatórios
- ✅ Projeto criado com sucesso
- ✅ Redirecionamento para detalhes
- ✅ Projeto aparece na listagem

**SQL para verificar:**
```sql
SELECT * FROM projects 
WHERE title = 'Teste de Projeto';
```

---

### **TESTE 9: Enviar Proposta**

**Objetivo:** Validar envio de proposta

**Passos:**
1. Fazer login como profissional
2. Navegar para um projeto
3. Clicar em "Enviar Proposta"
4. Preencher:
   - Mensagem personalizada
   - Valor proposto
   - Prazo proposto
5. Enviar

**Resultado Esperado:**
- ✅ Proposta enviada com sucesso
- ✅ Notificação para o cliente
- ✅ Proposta aparece em "Minhas Propostas"
- ✅ Cliente vê em "Propostas Recebidas"

**SQL para verificar:**
```sql
SELECT 
  pr.message,
  pr.proposed_value,
  pr.status,
  p.name as professional_name,
  proj.title as project_title
FROM proposals pr
JOIN profiles p ON p.id = pr.user_id
JOIN projects proj ON proj.id = pr.project_id
ORDER BY pr.created_at DESC;
```

---

### **TESTE 10: Chat em Tempo Real**

**Objetivo:** Validar sistema de chat

**Passos:**
1. Abrir 2 navegadores (ou anônimo)
2. Fazer login com usuários diferentes em cada um
3. Usuário 1: Entrar em contato com Usuário 2
4. Enviar mensagem
5. Verificar se aparece em tempo real no outro navegador

**Resultado Esperado:**
- ✅ Mensagem aparece instantaneamente
- ✅ Contador de não lidas atualiza
- ✅ Indicador de "digitando" (se implementado)
- ✅ Notificação de nova mensagem

---

## 🐛 TROUBLESHOOTING

### **Problema: Profissionais não aparecem**

**Solução:**
```sql
-- Verificar se há perfis profissionais
SELECT COUNT(*) FROM professional_profiles;

-- Se não houver, criar dados de teste
-- (usar o SQL fornecido no início deste documento)
```

---

### **Problema: Erro ao fazer upload**

**Verificar:**
1. Variáveis de ambiente do Cloudinary estão corretas
2. Upload preset existe no Cloudinary
3. Formato do arquivo é suportado

**Logs:**
```javascript
console.log('CLOUDINARY_CLOUD_NAME:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log('UPLOAD_PRESET:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
```

---

### **Problema: Erro de permissão (RLS)**

**Solução:**
```sql
-- Verificar policies de RLS
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Se necessário, desabilitar temporariamente para teste
ALTER TABLE professional_profiles DISABLE ROW LEVEL SECURITY;
-- ⚠️ Lembrar de reativar depois!
```

---

## 📊 QUERIES ÚTEIS PARA DEBUG

### **Ver todos os profissionais com detalhes:**
```sql
SELECT 
  p.id,
  p.name,
  p.email,
  pp.title,
  pp.skills,
  pp.categories,
  pp.hourly_rate,
  pp.availability,
  pp.created_at
FROM profiles p
LEFT JOIN professional_profiles pp ON pp.user_id = p.id
ORDER BY pp.created_at DESC;
```

### **Ver todos os projetos com cliente:**
```sql
SELECT 
  proj.id,
  proj.title,
  proj.category,
  proj.status,
  proj.budget_min,
  proj.budget_max,
  proj.is_urgent,
  p.name as client_name,
  p.email as client_email,
  proj.created_at
FROM projects proj
JOIN profiles p ON p.id = proj.user_id
ORDER BY proj.created_at DESC;
```

### **Ver propostas com detalhes:**
```sql
SELECT 
  prop.id,
  prop.message,
  prop.proposed_value,
  prop.status,
  prof.name as professional_name,
  proj.title as project_title,
  client.name as client_name,
  prop.created_at
FROM proposals prop
JOIN profiles prof ON prof.id = prop.user_id
JOIN projects proj ON proj.id = prop.project_id
JOIN profiles client ON client.id = proj.user_id
ORDER BY prop.created_at DESC;
```

### **Ver conversas ativas:**
```sql
SELECT 
  c.id,
  p1.name as participant_1,
  p2.name as participant_2,
  c.last_message_at,
  COUNT(m.id) as message_count
FROM conversations c
JOIN profiles p1 ON p1.id = c.participant_1_id
JOIN profiles p2 ON p2.id = c.participant_2_id
LEFT JOIN messages m ON m.conversation_id = c.id
GROUP BY c.id, p1.name, p2.name, c.last_message_at
ORDER BY c.last_message_at DESC;
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

### **Backend (Supabase):**
- [x] Tabelas criadas corretamente
- [x] RLS policies ativas
- [x] Dados de teste inseridos
- [ ] Triggers funcionando (se houver)
- [ ] Functions executando (se houver)

### **Frontend:**
- [ ] Páginas carregando sem erro
- [ ] Filtros funcionando
- [ ] Upload de imagens OK
- [ ] Formulários validando
- [ ] Chat em tempo real
- [ ] Notificações aparecendo

### **Integrações:**
- [x] Supabase conectado
- [x] Cloudinary configurado
- [ ] Cloudinary testado
- [x] Brevo configurado
- [ ] Brevo testado (e-mails)
- [ ] OAuth Google (pendente)
- [ ] OAuth LinkedIn (pendente)

---

**Próximo Passo:** Executar todos os testes acima e marcar como concluído ✅

**Dúvidas?** Verifique o arquivo MAPEAMENTO_COMPLETO.md
