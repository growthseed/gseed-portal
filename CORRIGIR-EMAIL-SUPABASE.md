# 🔧 Guia: Corrigir Template de Email no Supabase

## ❌ Problema Identificado

O erro `Error sending confirmation email` está acontecendo porque:
1. O template HTML customizado pode estar com sintaxe incorreta
2. O Supabase não consegue processar as variáveis do template
3. Pode haver erro no HTML que impede o envio

## ✅ Solução: Resetar ou Corrigir Template

### Opção 1: USAR TEMPLATE PADRÃO DO SUPABASE (RECOMENDADO)

1. Acesse: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/auth/templates

2. Clique em **"Confirm signup"** (email de confirmação)

3. Clique em **"Revert to default"** ou **"Reset to default template"**

4. O template padrão do Supabase é testado e confiável

5. Clique em **Save**

6. Teste o cadastro novamente

### Opção 2: CORRIGIR TEMPLATE CUSTOMIZADO

Se você quiser manter o template customizado bonito do GSeed:

1. Acesse: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/auth/templates

2. Clique em **"Confirm signup"**

3. **Verifique as variáveis disponíveis:**
   - `{{ .ConfirmationURL }}` - Link de confirmação
   - `{{ .Token }}` - Token de confirmação
   - `{{ .TokenHash }}` - Hash do token
   - `{{ .SiteURL }}` - URL do site
   - `{{ .Email }}` - Email do usuário

4. **IMPORTANTE:** O Supabase usa sintaxe Go Template: `{{ .NomeDaVariavel }}`

5. Cole o template do arquivo: `gseed-email-templates-supabase.html`

6. Clique em **Save**

### Opção 3: TEMPLATE SIMPLIFICADO PARA TESTE

Use este template minimalista para testar se o problema é no HTML:

```html
<h2>Confirme seu email</h2>
<p>Clique no link abaixo para confirmar sua conta:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
<p>Link: {{ .ConfirmationURL }}</p>
```

## 🧪 Como Testar

1. Após aplicar a correção, aguarde 1-2 minutos

2. Tente criar uma nova conta com um email de teste

3. Verifique:
   - ✅ Não aparece erro 500
   - ✅ Você recebe o email de confirmação
   - ✅ O link funciona

4. Se ainda não funcionar:
   - Verifique a aba **Logs** no Supabase
   - Procure por erros relacionados a email

## 🔍 Verificações Adicionais

### 1. Verificar Rate Limiting

O Supabase limita emails no plano free:
- 4 emails/hora no plano free
- Se você testou muito, pode ter atingido o limite
- Aguarde 1 hora e teste novamente

### 2. Verificar Email Provider

1. Vá em: **Project Settings** → **Authentication**
2. Em **SMTP Settings**, verifique:
   - ✅ Deve estar vazio (usar padrão do Supabase)
   - ❌ Se tiver configuração SMTP customizada, remova

### 3. Verificar Confirmação de Email Habilitada

1. Vá em: **Authentication** → **Providers** → **Email**
2. Certifique-se que está marcado:
   - ✅ **Enable email provider**
   - ✅ **Enable email confirmations**
   - ❌ **Double confirm email changes** (deixe desmarcado)

### 4. Verificar URL de Redirecionamento

1. Vá em: **Authentication** → **URL Configuration**
2. Adicione em **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://gseed.com.br/auth/callback
   https://portal.gseed.com.br/auth/callback
   ```

## 📋 Checklist de Solução

- [ ] Resetar template de email para padrão
- [ ] Verificar SMTP Settings (deve estar vazio)
- [ ] Confirmar que email confirmation está habilitado
- [ ] Adicionar URLs de redirecionamento
- [ ] Aguardar 2 minutos após mudanças
- [ ] Testar com novo email
- [ ] Verificar logs do Supabase

## 🎯 Próximos Passos

Depois que funcionar com o template padrão:

1. ✅ Template padrão funcionando
2. 🎨 Customizar template gradualmente
3. 🧪 Testar cada mudança
4. 📧 Adicionar email personalizado do GSeed

## 🆘 Se Ainda Não Funcionar

1. Vá em **Authentication** → **Logs** no Supabase
2. Procure por erros de email
3. Copie o erro e me envie
4. Podemos investigar mais a fundo

## 💡 Dica

Para desenvolvimento, você pode usar o **Supabase Inbucket** (email de teste):
- Não requer configuração
- Emails de teste aparecem no dashboard
- Útil para testar fluxo sem depender de email real

Acesse: **Authentication** → **Email Templates** → **Enable Inbucket**
