# 📧 Configuração SMTP Supabase + Brevo - GSeed Portal

## ✅ STATUS ATUAL

### Templates Criados no Brevo:

#### 🔐 **Templates de Autenticação (Supabase Auth)**
- **ID 14** - Confirmação de Email (`confirm signup`)
- **ID 15** - Recuperação de Senha (`reset password`)

#### 🎓 **Templates de Onboarding (Sequência Automática)**
- **ID 7** - Bem-vindo ao Gseed Works
- **ID 8** - Complete seu Perfil  
- **ID 9** - Crie seu Primeiro Projeto
- **ID 10** - Como Encontrar Profissionais
- **ID 12** - Dicas para Propostas Efetivas
- **ID 13** - Cases de Sucesso

---

## 🔧 PASSO 1: Configurar SMTP do Brevo no Supabase

### 1.1 - Obter Credenciais SMTP do Brevo

Acesse: https://app.brevo.com/settings/keys/smtp

Você verá:
```
SMTP Server: smtp-relay.brevo.com
Port: 587
Login: grupo@gseed.com.br  
SMTP Key: (sua chave SMTP)
```

### 1.2 - Configurar no Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/settings/auth

2. Role até **"SMTP Settings"** e clique em **"Enable Custom SMTP"**

3. Preencha:
```
SMTP Host: smtp-relay.brevo.com
SMTP Port: 587
SMTP Username: grupo@gseed.com.br
SMTP Password: [SUA_CHAVE_SMTP_DO_BREVO]
Sender Email: grupo@gseed.com.br
Sender Name: GSeed Portal
```

4. Clique em **"Save"**

---

## 📧 PASSO 2: Configurar Templates de Email no Supabase

### 2.1 - Habilitar Templates Personalizados

Ainda em **Auth Settings**, role até **"Email Templates"**

Você verá 4 templates:
- ✅ Confirm signup
- ✅ Invite user
- ✅ Magic Link
- ✅ Change Email Address

### 2.2 - Configurar "Confirm Signup" 

Clique em **"Confirm signup"** e cole o HTML abaixo:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden">
                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 20px;text-align:center">
                            <h1 style="color:#ffffff;margin:0;font-size:28px">Bem-vindo ao GSeed Portal! 🌱</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding:40px 30px">
                            <p style="color:#333333;font-size:16px;line-height:1.6;margin-top:0">
                                Olá! Estamos felizes em ter você conosco.
                            </p>
                            
                            <p style="color:#333333;font-size:16px;line-height:1.6">
                                Para confirmar seu email e ativar sua conta, clique no botão abaixo:
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0">
                                <tr>
                                    <td align="center">
                                        <a href="{{ .ConfirmationURL }}" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;padding:15px 40px;text-decoration:none;border-radius:5px;font-weight:bold;display:inline-block">
                                            Confirmar Email
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color:#666666;font-size:14px;line-height:1.6">
                                Se o botão não funcionar, copie e cole este link no seu navegador:
                            </p>
                            <p style="color:#667eea;font-size:12px;word-break:break-all">
                                {{ .ConfirmationURL }}
                            </p>
                            
                            <hr style="border:none;border-top:1px solid #eeeeee;margin:30px 0">
                            
                            <p style="color:#999999;font-size:12px;line-height:1.6;margin-bottom:0">
                                Se você não criou esta conta, pode ignorar este email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f8f9fa;padding:20px 30px;text-align:center">
                            <p style="color:#999999;font-size:12px;margin:0">
                                © 2025 GSeed Portal - Conectando profissionais cristãos
                            </p>
                            <p style="color:#999999;font-size:12px;margin:10px 0 0 0">
                                <a href="https://portal.gseed.com.br" style="color:#667eea;text-decoration:none">portal.gseed.com.br</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

**⚠️ IMPORTANTE:**
- Deixe o **Subject** como está: `Confirm Your Signup`
- O Supabase usa variáveis Go Template: `{{ .ConfirmationURL }}`

### 2.3 - Configurar "Reset Password"

Clique em **"Reset Password"** e cole:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden">
                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);padding:40px 20px;text-align:center">
                            <h1 style="color:#ffffff;margin:0;font-size:28px">Recuperação de Senha 🔐</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding:40px 30px">
                            <p style="color:#333333;font-size:16px;line-height:1.6;margin-top:0">
                                Recebemos uma solicitação para redefinir sua senha.
                            </p>
                            
                            <p style="color:#333333;font-size:16px;line-height:1.6">
                                Clique no botão abaixo para criar uma nova senha:
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0">
                                <tr>
                                    <td align="center">
                                        <a href="{{ .ConfirmationURL }}" style="background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:#ffffff;padding:15px 40px;text-decoration:none;border-radius:5px;font-weight:bold;display:inline-block">
                                            Redefinir Senha
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color:#666666;font-size:14px;line-height:1.6">
                                Este link expira em 1 hora.
                            </p>
                            
                            <hr style="border:none;border-top:1px solid #eeeeee;margin:30px 0">
                            
                            <p style="color:#999999;font-size:12px;line-height:1.6;margin-bottom:0">
                                Se você não solicitou isso, ignore este email. Sua senha permanecerá a mesma.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f8f9fa;padding:20px 30px;text-align:center">
                            <p style="color:#999999;font-size:12px;margin:0">
                                © 2025 GSeed Portal
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

**⚠️ IMPORTANTE:**
- Deixe o **Subject** como está: `Reset Your Password`

---

## 🔗 PASSO 3: Configurar Redirect URLs

No mesmo painel do Supabase Auth, role até **"URL Configuration"**:

```
Site URL: https://portal.gseed.com.br

Redirect URLs:
  https://portal.gseed.com.br/verify-email
  https://portal.gseed.com.br/auth/callback
  https://portal.gseed.com.br/reset-password
  http://localhost:3000/verify-email
  http://localhost:3000/auth/callback
  http://localhost:3000/reset-password
```

---

## 🔄 PASSO 4: Atualizar IDs dos Templates no Código

Edite: `src/services/email/emailSequenceService.ts`

Localize a linha:
```typescript
const BREVO_TEMPLATE_IDS = {
  welcome: 1,              // ❌ ANTIGO
  completeProfile: 2,      // ❌ ANTIGO
  // ...
}
```

Atualize para:
```typescript
const BREVO_TEMPLATE_IDS = {
  welcome: 7,              // ✅ ID correto
  completeProfile: 8,      // ✅ ID correto
  firstProject: 9,         // ✅ ID correto
  findProfessionals: 10,   // ✅ ID correto
  effectiveProposals: 12,  // ✅ ID correto
  successCases: 13         // ✅ ID correto
} as const;
```

---

## 🧪 PASSO 5: Testar

### Teste 1: Confirmação de Email
1. Crie uma nova conta em: https://portal.gseed.com.br/signup
2. Verifique sua caixa de entrada
3. Clique no link de confirmação

### Teste 2: Reset de Senha
1. Acesse: https://portal.gseed.com.br/forgot-password
2. Digite seu email
3. Verifique sua caixa de entrada
4. Clique no link de reset

### Teste 3: Sequência de Onboarding
```typescript
// No código após signup bem-sucedido:
await EmailSequenceService.startOnboardingSequence({
  userId: user.id,
  userEmail: user.email,
  userName: user.full_name || 'Amigo'
});
```

---

## 📊 Monitoramento

### Ver templates no Brevo:
https://app.brevo.com/camp/lists/template

### Ver estatísticas de envio:
https://app.brevo.com/statistics/email

### Verificar logs do Supabase:
https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/logs/explorer

---

## ⚠️ TROUBLESHOOTING

### Emails não chegam?

1. **Verifique spam/lixeira**
2. **Teste email direto no Brevo**: https://app.brevo.com/camp/lists/template
3. **Veja logs do Supabase**: Settings > Logs
4. **Confirme SMTP**: Settings > Auth > SMTP Settings (deve estar "Enabled")

### Template não aparece bonito?

- Teste visualização no Brevo antes de salvar no Supabase
- Certifique-se de copiar TODO o HTML (sem faltar nada)
- Alguns clientes de email não suportam gradientes CSS

---

## ✅ CHECKLIST FINAL

- [ ] SMTP do Brevo configurado no Supabase
- [ ] Template "Confirm Signup" atualizado
- [ ] Template "Reset Password" atualizado
- [ ] Redirect URLs configuradas
- [ ] IDs dos templates atualizados no código
- [ ] Teste de criação de conta funcionando
- [ ] Teste de reset de senha funcionando
- [ ] Sequência de onboarding testada

---

## 📚 Referências

- Documentação Supabase Auth: https://supabase.com/docs/guides/auth
- Documentação Brevo SMTP: https://developers.brevo.com/docs/smtp-send-email
- Templates do Brevo: https://app.brevo.com/camp/lists/template
