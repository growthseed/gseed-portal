# 🔧 GUIA DE TROUBLESHOOTING - GSEED PORTAL

## ✅ CORREÇÕES APLICADAS

### 1. **Edge Function CORS** (`supabase/functions/brevo-proxy/index.ts`)
- ✅ Preflight OPTIONS retorna `204 No Content` (padrão correto)
- ✅ Headers CORS completos: Origin, Methods, Headers, Max-Age
- ✅ CORS configurável via `ALLOWED_ORIGIN` (env)
- ✅ Suporte a múltiplos headers (x-requested-with, etc)

### 2. **brevoService.ts** (`src/services/brevoService.ts`)
- ✅ Verifica `response.ok` ANTES de parsear JSON
- ✅ Logs detalhados: `[Brevo] Chamando ação`, `Status`, `Sucesso`
- ✅ Tratamento de erros HTTP com mensagem legível

### 3. **ProfessionalSignupForm.tsx**
- ✅ Usa `getSession()` ao invés de `getUser()` após signup
- ✅ Verifica `session?.user` antes de criar perfil
- ✅ Mensagem de erro clara se sessão não existir

### 4. **SignUpForm.tsx**
- ✅ Usa `signUpWithWelcomeEmail` (envia emails via Brevo)
- ✅ Log de sucesso: `✅ Usuário criado com sucesso: {id}`
- ✅ Tratamento de erros com `result.message`

---

## 🚀 DEPLOY

### **PowerShell (Windows)**
```powershell
# 1. Executar script automático
.\DEPLOY-CORRECOES.ps1

# 2. OU manualmente:
supabase functions deploy brevo-proxy --no-verify-jwt
```

### **Bash (Linux/Mac)**
```bash
# Deploy manual
supabase functions deploy brevo-proxy --no-verify-jwt
```

---

## 🧪 COMO TESTAR

### **1. Ambiente Local**
```powershell
# Iniciar dev server
npm run dev
```

### **2. Abrir DevTools**
- Pressione `F12` ou `Ctrl+Shift+I`
- Vá em **Console** e **Network**

### **3. Fazer Cadastro Completo**
1. Acesse `http://localhost:3000/cadastro`
2. Escolha tipo: **Profissional** ou **Contratante**
3. Preencha formulário e clique em **Criar conta**
4. Complete perfil (categoria, habilidades, bio)

### **4. Verificar Console**
Você deve ver:
```
🔵 Iniciando cadastro... { email, name, siteUrl }
[Brevo] Chamando ação: sendVerificationEmail
[Brevo] Status: 200 OK
[Brevo] Sucesso em sendVerificationEmail
[Brevo] Chamando ação: sendWelcomeEmail
[Brevo] Status: 200 OK
[Brevo] Sucesso em sendWelcomeEmail
✅ Usuário criado com sucesso: abc123...
```

### **5. Verificar Network**
- **OPTIONS** → `204 No Content` (preflight CORS)
- **POST** → `200 OK` (requisição real)
- Sem erros vermelhos (CORS blocked)

---

## ❌ PROBLEMAS COMUNS

### **Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"**

**Causa:** Edge Function não foi deployada com as correções.

**Solução:**
```powershell
# Redesenhar a função
supabase functions deploy brevo-proxy --no-verify-jwt

# Verificar deploy
supabase functions list
```

---

### **Erro: "Usuário não autenticado" ao criar perfil**

**Causa:** `getUser()` não retorna sessão imediatamente após signup.

**Solução:** ✅ JÁ CORRIGIDO! Agora usa `getSession()`.

**Como verificar:**
```javascript
// Abrir Console do navegador após signup
const { data } = await window.supabase.auth.getSession();
console.log(data.session?.user); // Deve mostrar o usuário
```

---

### **Erro: "Erro 400" ou "Erro 500" do Brevo**

**Causa:** Resposta não-OK não era tratada antes de parsear JSON.

**Solução:** ✅ JÁ CORRIGIDO! Agora verifica `response.ok`.

**Como verificar logs:**
```powershell
# Ver logs da função em tempo real
supabase functions logs brevo-proxy --tail
```

---

### **Erro: "BREVO_API_KEY não configurada"**

**Causa:** Edge Function não tem acesso à chave do Brevo.

**Solução:**
```powershell
# Configurar secret no Supabase
supabase secrets set BREVO_API_KEY="sua_chave_aqui"

# Verificar secrets
supabase secrets list
```

---

### **Emails não estão sendo enviados**

**Checklist:**
1. ✅ `BREVO_API_KEY` está configurada?
2. ✅ Função `brevo-proxy` foi deployada?
3. ✅ Email remetente está verificado no Brevo?
4. ✅ Conta Brevo tem créditos/emails disponíveis?

**Como testar manualmente:**
```javascript
// No Console do navegador (após fazer login)
const response = await fetch('https://<PROJECT>.supabase.co/functions/v1/brevo-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'sendEmail',
    params: {
      to: [{ email: 'seuemail@teste.com' }],
      subject: 'Teste',
      htmlContent: '<h1>Teste</h1>'
    }
  })
});
console.log(await response.json());
```

---

## 📊 LOGS E MONITORAMENTO

### **Ver logs da Edge Function**
```powershell
# Logs em tempo real
supabase functions logs brevo-proxy --tail

# Últimos 100 logs
supabase functions logs brevo-proxy --limit 100
```

### **Logs esperados (sucesso)**
```
[Brevo Proxy] Action: sendEmail
[Brevo Proxy] API Key presente: true
[Brevo Proxy] Chamando: https://api.brevo.com/v3/smtp/email
[Brevo Proxy] Status: 201
[Brevo Proxy] Response: {"messageId":"..."}
```

---

## 🔐 CONFIGURAÇÃO DE PRODUÇÃO

### **1. Configurar CORS para domínio específico**
```powershell
# Exemplo para Vercel
supabase secrets set ALLOWED_ORIGIN="https://seuapp.vercel.app"

# Redesenhar função
supabase functions deploy brevo-proxy --no-verify-jwt
```

### **2. Verificar variáveis de ambiente (Vercel)**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL` (para redirect emails)

### **3. Testar em produção**
```javascript
// No Console do site em produção
console.log(import.meta.env.VITE_SUPABASE_URL); // Deve estar correto
```

---

## ✅ CHECKLIST DE ACEITAÇÃO

### **Edge Function**
- [ ] OPTIONS retorna `204` com headers CORS
- [ ] POST retorna `200` ou `201` (sucesso)
- [ ] Logs mostram `[Brevo] Status: 200 OK`
- [ ] Sem erros "CORS blocked" no DevTools

### **Fluxo de Signup**
- [ ] Formulário envia dados corretamente
- [ ] `signUpWithWelcomeEmail` é chamado
- [ ] Sessão existe após signup (`getSession()`)
- [ ] Perfil é criado com sucesso
- [ ] Emails são enviados via Brevo

### **Emails**
- [ ] Email de verificação chega na caixa de entrada
- [ ] Email de boas-vindas chega na caixa de entrada
- [ ] Links nos emails funcionam corretamente
- [ ] Remetente é `noreply@gseedworks.com.br`

---

## 🆘 SUPORTE

### **Se nada funcionar:**

1. **Limpar cache do navegador**
   - `Ctrl+Shift+Delete` → Limpar tudo
   - Ou usar aba Anônima/Incógnita

2. **Verificar versão do Supabase CLI**
   ```powershell
   supabase --version  # Deve ser >= 1.50.0
   ```

3. **Redesenhar TUDO**
   ```powershell
   # Limpar cache local
   Remove-Item -Recurse -Force .supabase

   # Redesenhar função
   supabase functions deploy brevo-proxy --no-verify-jwt
   
   # Resetar servidor local
   npm run dev
   ```

4. **Ver erros detalhados**
   ```powershell
   # Logs da função
   supabase functions logs brevo-proxy --limit 200
   
   # Logs do servidor local
   npm run dev 2>&1 | Tee-Object -FilePath debug.log
   ```

---

## 📞 CONTATO

Se precisar de ajuda adicional:
- 📧 Email: suporte@gseedworks.com.br
- 📱 WhatsApp: (61) 9999-9999
- 🌐 Documentação: https://docs.gseedworks.com.br

---

**Versão:** 1.0  
**Data:** 19/10/2025  
**Status:** ✅ Produção
