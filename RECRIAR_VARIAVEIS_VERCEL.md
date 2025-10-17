# GUIA: Recriar Variáveis de Ambiente no Vercel

## ⚠️ USE ESTE GUIA APENAS SE AS OUTRAS OPÇÕES NÃO FUNCIONAREM

### PASSO 1: Deletar TODAS as variáveis antigas

1. Vá em Settings → Environment Variables
2. Para CADA variável:
   - Clique nos 3 pontinhos ⋮
   - Clique em "Remove"
   - Confirme

### PASSO 2: Adicionar novamente uma por uma

**⚠️ ATENÇÃO: Certifique-se de marcar "Production" em CADA uma!**

```
Nome: VITE_SUPABASE_URL
Valor: https://xnwnwvhoulxxzxtxqmbr.supabase.co
Ambientes: ✅ Production ✅ Preview ✅ Development
```

```
Nome: VITE_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhud253dmhvdWx4eHp4dHhxbWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyODM3NTksImV4cCI6MjA3NDg1OTc1OX0.pkUvsUewzAwI3e-Pl5H0mfNtnEcvPaDX4iji36C4Axw
Ambientes: ✅ Production ✅ Preview ✅ Development
```

```
Nome: VITE_SITE_URL
Valor: https://gseed.com.br
Ambientes: ✅ Production ✅ Preview ✅ Development
```

```
Nome: VITE_OAUTH_REDIRECT_URL
Valor: https://gseed.com.br/auth/callback
Ambientes: ✅ Production ✅ Preview ✅ Development
```

```
Nome: VITE_CLOUDINARY_CLOUD_NAME
Valor: dsgqx6ouw
Ambientes: ✅ Production ✅ Preview ✅ Development
```

```
Nome: VITE_CLOUDINARY_API_KEY
Valor: 372535993552577
Ambientes: ✅ Production ✅ Preview ✅ Development
```

```
Nome: VITE_CLOUDINARY_API_SECRET
Valor: wuosPqmpCfUgmiZa5YOvJWTlya8
Ambientes: ✅ Production ✅ Preview ✅ Development
```

```
Nome: VITE_CLOUDINARY_UPLOAD_PRESET
Valor: gseed_uploads
Ambientes: ✅ Production ✅ Preview ✅ Development
```

```
Nome: VITE_BREVO_API_KEY
Valor: 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
Ambientes: ✅ Production ✅ Preview ✅ Development
```

### PASSO 3: Redeploy com Clear Cache

1. Deployments
2. 3 pontinhos ⋮
3. Redeploy
4. ✅ Marcar "Clear Build Cache"
5. Confirmar

### PASSO 4: Aguardar 3-5 minutos

O build precisa rodar completamente limpo.
