# 🚀 GUIA DE DEPLOY - PRODUÇÃO

## ✅ CORREÇÕES APLICADAS

### 1. **Edge Function CORS Atualizada**
- ✅ Suporte para múltiplas origens (produção + dev)
- ✅ CORS dinâmico baseado na origem da requisição
- ✅ Produção: `https://portal.gseed.com.br`
- ✅ Dev: `http://localhost:3000` e `http://localhost:5173`

### 2. **brevoService.ts Corrigido**
- ✅ Removido `window.location` (não existe no servidor)
- ✅ URLs fixas para produção usando `VITE_SITE_URL`
- ✅ Fallback para produção se variável não configurada

### 3. **Arquivos .env Criados**
- ✅ `.env` → Desenvolvimento local
- ✅ `.env.production` → Produção

---

## 📋 PASSO A PASSO PARA DEPLOY

### **PASSO 1: Deploy da Edge Function**

```powershell
# Navegar até o projeto
cd "C:\Users\EFEITO DIGITAL\gseed-portal"

# Deployar função (OBRIGATÓRIO!)
supabase functions deploy brevo-proxy --no-verify-jwt
```

**Verificar se deployou:**
```powershell
supabase functions list
```

Deve aparecer:
```
┌──────────────┬─────────┬────────────────────────┐
│ NAME         │ STATUS  │ UPDATED                │
├──────────────┼─────────┼────────────────────────┤
│ brevo-proxy  │ ACTIVE  │ 2025-10-20 XX:XX:XX    │
└──────────────┴─────────┴────────────────────────┘
```

---

### **PASSO 2: Configurar Secrets no Supabase**

```powershell
# Configurar chave do Brevo na Edge Function
supabase secrets set BREVO_API_KEY="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"

# Verificar
supabase secrets list
```

---

### **PASSO 3: Build de Produção**

```powershell
# Build usando .env.production
npm run build
```

Isso irá criar a pasta `dist/` com os arquivos otimizados.

---

### **PASSO 4A: Deploy via Vercel (Recomendado)**

```powershell
# Se ainda não tem Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Configurar variáveis de ambiente no Vercel:**

Acesse: https://vercel.com/seu-projeto/settings/environment-variables

Adicionar:
```
VITE_SUPABASE_URL=https://xnwnwvhoulxxzxtxqmbr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SITE_URL=https://portal.gseed.com.br
VITE_OAUTH_REDIRECT_URL=https://portal.gseed.com.br/auth/callback
VITE_CLOUDINARY_CLOUD_NAME=dsgqx6ouw
VITE_CLOUDINARY_API_KEY=372535993552577
VITE_CLOUDINARY_API_SECRET=wuosPqmpCfUgmiZa5YOvJWTlya8
VITE_CLOUDINARY_UPLOAD_PRESET=gseed_uploads
```

**⚠️ IMPORTANTE:** Não adicionar `VITE_BREVO_API_KEY` no Vercel! Ela fica apenas no Supabase secrets.

---

### **PASSO 4B: Deploy via Git + GitHub**

```powershell
# Commit das alterações
git add .
git commit -m "Deploy: Correções CORS e produção configurada"
git push origin main
```

Se estiver usando **Vercel** ou **Netlify** conectado ao GitHub, o deploy será automático.

---

## 🧪 TESTAR EM PRODUÇÃO

### **1. Testar Edge Function**

Abrir DevTools (F12) no site em produção e executar:

```javascript
// No console do navegador em https://portal.gseed.com.br
const response = await fetch('https://xnwnwvhoulxxzxtxqmbr.supabase.co/functions/v1/brevo-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'sendEmail',
    params: {
      to: [{ email: 'seu-email@teste.com' }],
      subject: 'Teste Produção',
      htmlContent: '<h1>Teste OK!</h1>'
    }
  })
});

console.log(await response.json());
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": { "messageId": "..." }
}
```

---

### **2. Testar Cadastro Completo**

1. Ir para: https://portal.gseed.com.br/cadastro
2. Preencher formulário
3. Clicar em "Criar conta"
4. Verificar console (F12):
   - ✅ Sem erros CORS
   - ✅ Status 200 OK
   - ✅ Emails enviados

---

## 📊 VERIFICAR LOGS

### **Logs da Edge Function:**

```powershell
# Ver logs em tempo real
supabase functions logs brevo-proxy --tail

# Ver últimos 100 logs
supabase functions logs brevo-proxy --limit 100
```

**Logs esperados (sucesso):**
```
[Brevo Proxy] Action: sendEmail
[Brevo Proxy] Origin: https://portal.gseed.com.br
[Brevo Proxy] API Key presente: true
[Brevo Proxy] Status: 201
[Brevo Proxy] Response: {"messageId":"..."}
```

---

## 🔧 TROUBLESHOOTING

### **Erro: "CORS policy" ainda aparece**

**Solução:**
```powershell
# 1. Verificar se função foi deployada
supabase functions list

# 2. Redesenhar
supabase functions deploy brevo-proxy --no-verify-jwt

# 3. Limpar cache do navegador
# Ctrl+Shift+Delete → Limpar tudo
```

---

### **Erro: "BREVO_API_KEY não configurada"**

**Solução:**
```powershell
# Configurar secret
supabase secrets set BREVO_API_KEY="sua-chave-aqui"

# Verificar
supabase secrets list

# Redesenhar função
supabase functions deploy brevo-proxy --no-verify-jwt
```

---

### **Emails não chegam**

**Checklist:**
1. ✅ Edge Function deployada?
2. ✅ BREVO_API_KEY configurada?
3. ✅ Email remetente verificado no Brevo?
4. ✅ Conta Brevo tem créditos?

**Verificar no Brevo:**
- Acessar: https://app.brevo.com
- Ir em "Transactional" → "Logs"
- Ver se emails foram enviados

---

## 📞 SUPABASE DASHBOARD

### **Verificar função no painel:**

1. Acessar: https://app.supabase.com
2. Selecionar projeto `xnwnwvhoulxxzxtxqmbr`
3. Ir em **Edge Functions**
4. Verificar status de `brevo-proxy`: **ACTIVE**

### **Ver invocações:**

No painel, você pode ver:
- Número de invocações
- Taxa de erro
- Logs em tempo real

---

## ✅ CHECKLIST FINAL

Antes de considerar o deploy concluído:

- [ ] Edge Function `brevo-proxy` está ACTIVE no Supabase
- [ ] Secret `BREVO_API_KEY` está configurada
- [ ] Build de produção criado (`npm run build`)
- [ ] Deploy feito (Vercel/Netlify/Manual)
- [ ] Variáveis de ambiente configuradas no servidor
- [ ] Site acessível em https://portal.gseed.com.br
- [ ] Cadastro funciona sem erros CORS
- [ ] Emails sendo enviados e recebidos
- [ ] Console sem erros (F12)

---

## 🎯 COMANDOS RÁPIDOS

```powershell
# Deploy completo (recomendado)
.\DEPLOY-PRODUCTION.bat

# OU passo a passo:
supabase functions deploy brevo-proxy --no-verify-jwt
npm run build
vercel --prod
```

---

## 📚 DOCUMENTAÇÃO

- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Brevo API:** https://developers.brevo.com
- **Vercel Deploy:** https://vercel.com/docs

---

**Status:** ✅ Pronto para produção  
**Data:** 20/10/2025  
**Versão:** 1.0
