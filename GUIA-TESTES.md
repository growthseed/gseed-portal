# 🧪 GUIA RÁPIDO DE TESTES - GSEED WORKS

## ⚡ **TESTE EM 15 MINUTOS**

### **Pré-requisitos:**
- [ ] Servidor rodando: `npm run dev`
- [ ] 2 navegadores diferentes (Chrome + Edge) OU 2 abas anônimas
- [ ] Limpar cache: `Ctrl + Shift + Delete`

---

## 📝 **TESTE 1: HEADER INTELIGENTE (3 min)**

### **Etapa 1: Usuário Deslogado**
1. Abrir `http://localhost:3000`
2. ✅ **Verificar:** Aparecem botões "Entrar" e "Criar Conta"
3. ✅ **Verificar:** Logo Gseed Works clicável
4. ✅ **Verificar:** Links "Projetos" e "Profissionais"

### **Etapa 2: Fazer Login**
1. Clicar em "Entrar"
2. Fazer login com: `grupo@gseed.com.br` / senha
3. ✅ **Verificar:** Redirecionou para `/perfil`
4. ✅ **Verificar:** Header agora mostra: Criar Projeto, Notificações, Chat, Perfil
5. ✅ **Verificar:** Logo continua clicável

### **Etapa 3: Navegação**
1. Clicar em "Projetos"
2. ✅ **Verificar:** Header permanece igual
3. Clicar em "Profissionais"
4. ✅ **Verificar:** Header permanece igual
5. Voltar para "/"
6. ✅ **Verificar:** Header continua com menu completo (não volta para Entrar/Criar Conta)

✅ **SE PASSOU EM TODOS:** Header está funcionando!

---

## 💬 **TESTE 2: CHAT (5 min)**

### **Setup:**
- **Navegador 1:** Login com `grupo@gseed.com.br`
- **Navegador 2:** Login com outro usuário OU criar novo usuário

### **Teste Envio:**
1. **Nav 1:** Clicar no ícone de chat
2. ✅ **Verificar:** Painel abre pela direita
3. ✅ **Verificar:** Mostra "Nenhuma conversa ainda" (se for primeira vez)

### **Criar Conversa (via Proposta):**
> *Nota: Por enquanto, conversas são criadas automaticamente ao enviar propostas*

**OU criar manualmente no banco:**
```sql
-- No Supabase SQL Editor:
INSERT INTO conversations (participant_1_id, participant_2_id)
VALUES (
  'cffbef13-e1d0-4a52-a8ad-94844ac8421b', -- User 1
  'OUTRO-USER-ID' -- User 2
);
```

### **Teste Chat Real:**
1. **Nav 1:** Abrir conversa
2. **Nav 1:** Digitar mensagem "Olá!" e enviar
3. **Nav 2:** ⏱️ **Aguardar 2 segundos**
4. ✅ **Verificar Nav 2:** Contador de chat aumentou
5. **Nav 2:** Abrir chat
6. ✅ **Verificar Nav 2:** Mensagem "Olá!" apareceu
7. ✅ **Verificar Nav 2:** Contador zerou
8. **Nav 2:** Responder "Oi, tudo bem?"
9. **Nav 1:** ✅ **Verificar:** Mensagem chegou instantaneamente

✅ **SE PASSOU:** Chat real-time funcionando!

---

## 🔔 **TESTE 3: NOTIFICAÇÕES (4 min)**

### **Teste Automático:**
1. **Nav 2:** Enviar proposta para um projeto do **Nav 1**
2. **Nav 1:** ⏱️ **Aguardar 3 segundos**
3. ✅ **Verificar Nav 1:** Contador de notificações aumentou
4. **Nav 1:** Clicar no ícone de notificações
5. ✅ **Verificar:** Aparece "Nova Proposta Recebida"
6. **Nav 1:** Clicar na notificação
7. ✅ **Verificar:** Navega para página de propostas
8. ✅ **Verificar:** Contador diminuiu

### **Teste Marcar Todas:**
1. **Nav 1:** Clicar em notificações novamente
2. Clicar em "Marcar todas como lida"
3. ✅ **Verificar:** Contador zerou
4. ✅ **Verificar:** Notificações ainda aparecem (mas sem bolinha)

✅ **SE PASSOU:** Notificações automáticas funcionando!

---

## 🎯 **TESTE 4: INTEGRAÇÃO COMPLETA (3 min)**

### **Fluxo Completo:**
1. **Nav 2:** Enviar mensagem no chat
2. **Nav 1:** ✅ Contador de notificações +1
3. **Nav 1:** ✅ Contador de chat +1
4. **Nav 1:** Abrir notificações
5. **Nav 1:** Clicar em "Nova Mensagem"
6. ✅ **Verificar:** Abre o chat automaticamente
7. ✅ **Verificar:** Mensagem está lá
8. ✅ **Verificar:** Ambos contadores zeraram

✅ **SE PASSOU:** Integração perfeita!

---

## 📱 **TESTE 5: RESPONSIVIDADE (2 min)**

### **Desktop (>1024px):**
1. ✅ Header com todos itens horizontais
2. ✅ Chat abre em painel lateral

### **Tablet (768px - 1024px):**
1. Redimensionar janela
2. ✅ Header ajusta mas mantém itens principais
3. ✅ Chat ainda em painel lateral

### **Mobile (<768px):**
1. Redimensionar para mobile
2. ✅ Aparece menu hambúrguer
3. Clicar no hambúrguer
4. ✅ Menu mobile abre
5. ✅ Chat ocupa tela inteira

---

## 🐛 **TROUBLESHOOTING**

### **❌ Chat não mostra conversas:**
```bash
# Terminal
npm cache clean --force
rm -rf node_modules/.vite
npm run dev
```

### **❌ Contador não atualiza:**
- F5 (refresh)
- Verificar console do navegador por erros
- Verificar se Supabase está online

### **❌ Notificações não aparecem:**
```sql
-- Verificar se triggers existem no Supabase:
SELECT * FROM pg_trigger 
WHERE tgname LIKE 'trigger_notify%';
```

### **❌ "Error 406" ou "Error 400":**
- Verificar se RLS está correto
- Verificar se user está autenticado
- Limpar cache e relogar

---

## ✅ **RESULTADO ESPERADO**

Após concluir todos os testes:

- ✅ Header muda automaticamente com login/logout
- ✅ Chat funciona em tempo real
- ✅ Notificações são criadas automaticamente
- ✅ Contadores funcionam corretamente
- ✅ Navegação entre notificações funciona
- ✅ Tudo responsivo

---

## 📸 **CAPTURAS DE TELA**

### **Header Deslogado:**
```
[Logo Gseed Works] [Projetos] [Profissionais] ... [🌙] [Entrar] [Criar Conta]
```

### **Header Logado:**
```
[Logo Gseed Works] [Projetos] [Profissionais] ... [🌙] [+ Criar Projeto] [🔔 2] [💬 3] [👤]
```

### **Chat Aberto:**
```
┌─────────────────────────────┐
│ 💬 Mensagens            [X] │
├─────────────────────────────┤
│ 🔍 Buscar conversas...      │
├─────────────────────────────┤
│ [👤] João Silva      10:30  │
│     Olá! Gostaria de...  [2]│
├─────────────────────────────┤
│ [👤] Maria Santos    Ontem  │
│     Obrigado pelo...        │
└─────────────────────────────┘
```

---

## 🎉 **SUCESSO!**

Se todos os testes passaram, o **Gseed Works está 100% funcional** e pronto para:

1. ✅ Receber usuários reais
2. ✅ Processar conversas
3. ✅ Enviar notificações
4. ✅ Escalar para próximas funcionalidades

**Próximo passo:** Deploy em produção ou integração com Gseed Market/Business!

---

**Tempo Total:** ~15 minutos  
**Nível de Dificuldade:** ⭐⭐ (Fácil)  
**Suporte:** Consultar `FASE-1-COMPLETA.md`
