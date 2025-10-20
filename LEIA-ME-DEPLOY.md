# 🚀 DEPLOY AUTOMÁTICO - INSTRUÇÕES

## ✅ O QUE FOI FEITO

Todas as correções já foram aplicadas no código:
- ✅ Edge Function com CORS para produção
- ✅ brevoService.ts com URLs fixas
- ✅ Arquivos .env configurados
- ✅ Scripts de deploy criados

---

## 📋 COMO EXECUTAR O DEPLOY

### **PASSO 1: Executar Script de Deploy**

Abra o **PowerShell** como Administrador e execute:

```powershell
cd "C:\Users\EFEITO DIGITAL\gseed-portal"
.\EXECUTAR-DEPLOY.ps1
```

O script irá:
1. ✅ Deployar Edge Function `brevo-proxy`
2. ✅ Configurar secret `BREVO_API_KEY`
3. ✅ Fazer build de produção
4. ✅ Verificar se tudo está OK

---

### **PASSO 2: Deploy no Vercel (Recomendado)**

Após o script acima, escolha **uma** das opções:

#### **OPÇÃO A: Vercel CLI (Mais Rápido)**

```powershell
# Instalar Vercel CLI (se ainda não tem)
npm install -g vercel

# Deploy
vercel --prod
```

#### **OPÇÃO B: Git + Vercel (Automático)**

```powershell
git add .
git commit -m "Deploy: Correções CORS produção"
git push origin main
```

Se o projeto está conectado ao Vercel, o deploy será automático!

---

### **PASSO 3: Configurar Variáveis no Vercel**

Acesse: https://vercel.com/seu-projeto/settings/environment-variables

Adicionar estas variáveis:

```
VITE_SUPABASE_URL=https://xnwnwvhoulxxzxtxqmbr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhud253dmhvdWx4eHp4dHhxbWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyODM3NTksImV4cCI6MjA3NDg1OTc1OX0.pkUvsUewzAwI3e-Pl5H0mfNtnEcvPaDX4iji36C4Axw
VITE_SITE_URL=https://portal.gseed.com.br
VITE_OAUTH_REDIRECT_URL=https://portal.gseed.com.br/auth/callback
VITE_CLOUDINARY_CLOUD_NAME=dsgqx6ouw
VITE_CLOUDINARY_API_KEY=372535993552577
VITE_CLOUDINARY_API_SECRET=wuosPqmpCfUgmiZa5YOvJWTlya8
VITE_CLOUDINARY_UPLOAD_PRESET=gseed_uploads
```

⚠️ **IMPORTANTE:** **NÃO** adicionar `VITE_BREVO_API_KEY` no Vercel!

---

### **PASSO 4: Verificar se Tudo Funciona**

Execute o verificador:

```powershell
.\VERIFICAR-DEPLOY.ps1
```

---

## 🧪 TESTAR EM PRODUÇÃO

### **Teste 1: Cadastro**
1. Acesse: https://portal.gseed.com.br/cadastro
2. Preencha o formulário
3. Crie uma conta
4. Abra o Console (F12)
5. ✅ Verificar: **SEM erros CORS**

### **Teste 2: Email**
Verificar se chegou:
- Email de verificação
- Email de boas-vindas

---

## 📊 MONITORAMENTO

### **Ver logs da Edge Function:**
```powershell
supabase functions logs brevo-proxy --tail
```

### **Verificar status:**
```powershell
supabase functions list
```

---

## 🔧 TROUBLESHOOTING

### **Erro: "supabase não é reconhecido"**
```powershell
npm install -g supabase
```

### **Erro: "vercel não é reconhecido"**
```powershell
npm install -g vercel
```

### **Ainda tem CORS?**
```powershell
# Redesenhar função
supabase functions deploy brevo-proxy --no-verify-jwt

# Limpar cache do navegador
# Ctrl+Shift+Delete → Limpar tudo
```

### **Emails não chegam?**
```powershell
# Verificar secret
supabase secrets list

# Se não tem BREVO_API_KEY, configurar:
supabase secrets set BREVO_API_KEY="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"

# Redesenhar função
supabase functions deploy brevo-proxy --no-verify-jwt
```

---

## 📁 ARQUIVOS CRIADOS

✅ **EXECUTAR-DEPLOY.ps1** - Script principal de deploy  
✅ **VERIFICAR-DEPLOY.ps1** - Verificador de status  
✅ **DEPLOY-GUIA-PRODUCAO.md** - Guia completo  
✅ **RESUMO-DEPLOY.md** - Resumo executivo  
✅ **.env.production** - Variáveis de produção

---

## ✅ CHECKLIST

- [ ] Executei `.\EXECUTAR-DEPLOY.ps1`
- [ ] Edge Function deployada (sem erros)
- [ ] Build concluído (pasta dist/ criada)
- [ ] Deploy feito (Vercel/Git)
- [ ] Variáveis configuradas no Vercel
- [ ] Executei `.\VERIFICAR-DEPLOY.ps1`
- [ ] Site acessível em https://portal.gseed.com.br
- [ ] Testei cadastro (sem erros CORS)
- [ ] Emails chegando

---

## 🎯 COMANDOS RÁPIDOS

```powershell
# Deploy completo
.\EXECUTAR-DEPLOY.ps1

# Verificar status
.\VERIFICAR-DEPLOY.ps1

# Ver logs
supabase functions logs brevo-proxy --tail

# Redesenhar função
supabase functions deploy brevo-proxy --no-verify-jwt

# Build + Deploy Vercel
npm run build && vercel --prod
```

---

## 📞 SUPORTE

Se precisar de ajuda, verifique:

1. **DEPLOY-GUIA-PRODUCAO.md** - Guia completo de 4800+ linhas
2. **TROUBLESHOOTING-COMPLETO.md** - Solução de problemas
3. **Console (F12)** - Erros no navegador
4. **Logs do Supabase** - `supabase functions logs brevo-proxy`

---

**Status:** ✅ Pronto para executar  
**Data:** 20/10/2025  
**Versão:** 1.0
