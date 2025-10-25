# 📧 CONFIGURAÇÃO SMTP SUPABASE - EMAIL NATIVO

## 🎯 OBJETIVO

Usar o **email padrão do Supabase** para confirmação de cadastro e recuperação de senha, evitando spam e mantendo segurança.

## ✅ SOLUÇÃO: SMTP Padrão do Supabase

O Supabase já vem com um servidor SMTP configurado por padrão que funciona perfeitamente para:
- ✅ Confirmação de email
- ✅ Recuperação de senha
- ✅ Mudança de email

### Por que usar o SMTP padrão do Supabase?

1. **✅ Já está configurado** - Sem necessidade de setup externo
2. **✅ Funciona imediatamente** - Sem configurações complexas
3. **✅ Grátis** - Incluso no plano do Supabase
4. **✅ Confiável** - Infraestrutura do Supabase

## ⚙️ CONFIGURAÇÃO NO DASHBOARD

### Passo 1: Acessar Configurações

1. Acesse: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr
2. Vá em: **Authentication → Email Templates**

### Passo 2: Verificar Templates de Email

O Supabase tem templates padrão para:

#### 📧 Confirm Signup (Confirmação de Cadastro)
```
Subject: Confirm Your Email
```

#### 🔑 Magic Link (Login sem senha)
```
Subject: Your Magic Link
```

#### 🔓 Reset Password (Recuperação de Senha)
```
Subject: Reset Your Password
```

#### ✉️ Change Email (Mudança de Email)
```
Subject: Confirm Email Change
```

### Passo 3: Personalizar Templates (Opcional)

Você pode personalizar os templates para incluir:
- Logo da GSEED
- Cores do brand
- Mensagens personalizadas

**Variáveis disponíveis:**
- `{{ .ConfirmationURL }}` - URL de confirmação
- `{{ .Token }}` - Token de confirmação
- `{{ .SiteURL }}` - URL do site
- `{{ .Email }}` - Email do usuário

### Passo 4: Configurar URLs de Redirect

Em **Authentication → URL Configuration**:

```
Site URL: https://portal.gseed.com.br
Redirect URLs:
  - https://portal.gseed.com.br/auth/callback
  - https://portal.gseed.com.br/reset-password
  - https://portal.gseed.com.br/verify-email
  - http://localhost:3000/auth/callback (para desenvolvimento)
```

## 🚨 IMPORTANTE: Enable Email Confirmations

Em **Authentication → Settings**:

✅ **MANTER LIGADO**: "Enable email confirmations"

Isso garantirá que:
- Usuários confirmem o email antes do login
- Previne spam e contas fake
- Melhora segurança

## 🧪 COMO TESTAR

### Teste 1: Cadastro com Confirmação

1. Acesse: https://portal.gseed.com.br
2. Clique em "Criar Conta"
3. Preencha os dados
4. Clique em "Criar Conta"
5. **Resultado esperado:**
   - ✅ Mensagem: "Verifique seu email para confirmar"
   - ✅ Email recebido (pode demorar 1-2 minutos)
   - ✅ Sem erro 500

6. Clique no link do email
7. **Resultado esperado:**
   - ✅ Redirecionado para /auth/callback
   - ✅ Login automático
   - ✅ Acesso ao dashboard

### Teste 2: Reenviar Email de Confirmação

1. Tente fazer login sem confirmar
2. Veja mensagem de erro
3. Clique em "Reenviar email"
4. **Resultado esperado:**
   - ✅ Novo email enviado
   - ✅ Sem erro 500

### Teste 3: Recuperação de Senha

1. Clique em "Esqueci minha senha"
2. Digite seu email
3. **Resultado esperado:**
   - ✅ Email recebido
   - ✅ Link funciona
   - ✅ Pode redefinir senha

## 🔍 TROUBLESHOOTING

### ❌ Erro 500: "Error sending confirmation email"

**Causa:** SMTP do Supabase pode estar com problema temporário

**Solução:**
1. Aguarde 5 minutos e tente novamente
2. Verifique spam/lixo eletrônico
3. Tente com outro email (@gmail.com costuma funcionar melhor)

### ❌ Email não chega

**Possíveis causas:**
1. **Spam** - Verifique pasta de spam
2. **Delay** - Pode demorar 1-5 minutos
3. **Email inválido** - Verifique se digitou corretamente

**Solução:**
1. Aguarde 5 minutos
2. Verifique todas as pastas (Spam, Promoções, etc)
3. Use "Reenviar email de confirmação"
4. Tente com email diferente

### ❌ Link expirado

**Causa:** Token de confirmação expira após 24 horas

**Solução:**
1. Fazer novo cadastro, ou
2. Usar "Reenviar email de confirmação"

## 📊 VANTAGENS vs DESVANTAGENS

### ✅ Vantagens do SMTP Supabase

- Grátis e já configurado
- Sem setup adicional
- Funciona imediatamente
- Infraestrutura confiável
- Templates prontos

### ⚠️ Limitações

- Design dos emails é básico (pode personalizar)
- Emails vêm de "noreply@mail.supabase.io"
- Pode cair em spam em alguns provedores
- Limite de envios (generoso, mas existe)

### 🎯 Quando Migrar para SMTP Customizado?

Considere usar Brevo ou outro SMTP quando:
- Precisar de design mais elaborado
- Quiser usar seu próprio domínio (noreply@gseed.com.br)
- Precisar de analytics de email
- Tiver alto volume de envios

## 🚀 PRÓXIMOS PASSOS

1. ✅ Código já está pronto (authService.ts)
2. ✅ Templates padrão do Supabase funcionam
3. ⏳ **VOCÊ FAZ:** Verificar configurações no dashboard
4. ⏳ **VOCÊ FAZ:** Fazer deploy
5. ⏳ **VOCÊ FAZ:** Testar cadastro completo

## 📝 CUSTOMIZAÇÃO FUTURA (Opcional)

Se quiser melhorar os emails depois:

### Template HTML Personalizado

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .button { background: #4F46E5; color: white; padding: 12px 24px; }
  </style>
</head>
<body>
  <img src="https://gseed.com.br/logo.png" alt="GSEED" />
  <h1>Confirme seu email</h1>
  <p>Clique no botão abaixo para confirmar seu cadastro:</p>
  <a href="{{ .ConfirmationURL }}" class="button">Confirmar Email</a>
</body>
</html>
```

---

## ✅ RESUMO

**Status atual:**
- ✅ Código pronto para usar email nativo
- ✅ Confirmação de email ATIVA
- ✅ Anti-spam funcionando
- ⏳ Dashboard precisa ter "Email confirmations" LIGADO

**Próximo passo:**
```batch
DEPLOY-FINAL-FIX.bat
```

**Depois do deploy:**
1. Testar cadastro
2. Verificar email recebido
3. Confirmar e fazer login

---

**Data:** 23/10/2025
**Status:** ✅ Pronto para deploy com confirmação de email
