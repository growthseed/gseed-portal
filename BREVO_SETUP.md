# 📧 CONFIGURAÇÃO DO BREVO (SENDINBLUE)

## 🎯 O QUE FOI CONFIGURADO

O sistema agora usa **Brevo** (antigo Sendinblue) para enviar:
- ✅ E-mails de confirmação de cadastro
- ✅ E-mails de recuperação de senha  
- ✅ E-mails de boas-vindas
- ✅ Notificações de propostas

**O Supabase NÃO envia mais e-mails automáticos** - tudo passa pelo Brevo!

---

## 📋 PASSO A PASSO - CONFIGURAÇÃO

### **1. Criar Conta no Brevo** (GRATUITO)

1. Acesse: https://www.brevo.com/
2. Clique em "Sign up free"
3. Preencha seus dados:
   - Nome
   - E-mail
   - Senha
4. **Confirme seu e-mail** (importante!)
5. Complete o perfil da empresa

**PLANO GRATUITO:**
- ✅ 300 e-mails por dia
- ✅ E-mails transacionais ilimitados
- ✅ Templates personalizados
- ✅ Suficiente para testar!

---

### **2. Obter sua API Key**

1. Faça login no Brevo
2. No menu superior direito, clique no seu **nome**
3. Vá em **"SMTP & API"**
4. Na seção **"API Keys"**, clique em **"Create a new API key"**
5. Dê um nome: `Gseed Works - Production`
6. **Copie a API key** (ela aparece apenas UMA vez!)

**Exemplo de API key:**
```
xkeysib-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz-AbCdEfGhIj
```

---

### **3. Configurar no Projeto**

**Abra o arquivo `.env` e adicione:**

```env
VITE_BREVO_API_KEY=sua_api_key_aqui
```

**Exemplo completo do .env:**
```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui

# Brevo
VITE_BREVO_API_KEY=xkeysib-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz-AbCdEfGhIj

# Cloudinary (se usar)
VITE_CLOUDINARY_CLOUD_NAME=seu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=seu_preset
```

---

### **4. Verificar Domínio de Envio (IMPORTANTE!)**

Para os e-mails não irem para SPAM:

1. No Brevo, vá em **"Senders"** → **"Domains"**
2. Clique em **"Add a domain"**
3. Digite seu domínio: `gseedworks.com.br`
4. Siga as instruções para **adicionar registros DNS**:
   - **DKIM** - Autenticação
   - **SPF** - Validação
   - **DMARC** - Política

**Exemplo de registros DNS (você precisa adicionar no seu provedor):**
```
Tipo: TXT
Nome: mail._domainkey.gseedworks.com.br
Valor: [fornecido pelo Brevo]

Tipo: TXT  
Nome: @
Valor: v=spf1 include:spf.sendinblue.com ~all
```

---

### **5. Configurar E-mail Remetente Padrão**

1. No Brevo, vá em **"Senders"** → **"Senders & IP"**
2. Clique em **"Add a sender"**
3. Preencha:
   - **Name**: Gseed Works
   - **Email**: noreply@gseedworks.com.br
4. **Confirme o e-mail** (Brevo envia link)

---

### **6. Testar Envio**

**No seu projeto, rode:**

```bash
npm run dev
```

**Teste o fluxo:**

1. **Cadastro:**
   - Acesse `/register`
   - Preencha o formulário
   - Clique em "Criar Conta"
   - ✅ Você deve receber 2 e-mails:
     - E-mail de confirmação
     - E-mail de boas-vindas

2. **Recuperação de Senha:**
   - Vá em `/login`
   - Clique em "Esqueci minha senha"
   - Digite seu e-mail
   - ✅ Você deve receber e-mail de recuperação

---

## 🎨 TEMPLATES ATUAIS (HTML Inline)

Os e-mails já estão com **HTML customizado** e funcionam **SEM precisar criar templates no Brevo**.

Você pode visualizar os templates em:
- `src/services/brevoService.ts`

**Se quiser personalizar:**
1. Abra `brevoService.ts`
2. Procure por `htmlContent`
3. Edite o HTML/CSS diretamente

---

## 📊 MONITORAMENTO

### **Ver Estatísticas no Brevo:**

1. Acesse o Dashboard do Brevo
2. Vá em **"Statistics"** → **"Email"**
3. Você verá:
   - ✅ E-mails enviados
   - ✅ Taxa de abertura
   - ✅ Taxa de cliques
   - ⚠️ Bounces (rejeitados)
   - ❌ Spam

### **Ver Logs de Envio:**

1. Vá em **"Transactional"** → **"Logs"**
2. Você verá TODOS os e-mails enviados
3. Pode filtrar por:
   - Data
   - Destinatário
   - Status (enviado, aberto, clicado, bounce)

---

## ⚠️ DESABILITAR E-MAILS DO SUPABASE

**IMPORTANTE:** Para evitar e-mails duplicados:

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication** → **Email Templates**
3. **Desabilite** todos os templates:
   - ❌ Confirm signup
   - ❌ Magic Link
   - ❌ Change Email Address
   - ❌ Reset Password

OU configure para **NÃO enviar**:

1. Authentication → Settings
2. Em **"Email Settings"**
3. Desmarque **"Enable email confirmations"**

---

## 🐛 TROUBLESHOOTING

### **Problema: E-mails não estão sendo enviados**

**Verificar:**
1. ✅ API Key está correta no `.env`?
2. ✅ Arquivo `.env` foi salvo?
3. ✅ Servidor foi reiniciado após adicionar API Key?
4. ✅ Console do navegador mostra erros?

**Solução:**
```bash
# Parar o servidor
Ctrl + C

# Verificar .env
cat .env | grep BREVO

# Reiniciar
npm run dev
```

---

### **Problema: E-mails vão para SPAM**

**Causas:**
- ❌ Domínio não verificado
- ❌ Registros DNS não configurados
- ❌ E-mail remetente não confirmado

**Solução:**
1. Verifique o domínio (passo 4)
2. Configure DNS (SPF, DKIM, DMARC)
3. Confirme o e-mail remetente
4. Aguarde 24-48h para propagação DNS

---

### **Problema: Erro "API key not found"**

**Causa:** Variável de ambiente não carregada

**Solução:**
```bash
# Verificar se existe
echo $VITE_BREVO_API_KEY

# Se não aparecer nada, adicionar no .env
nano .env

# Adicionar:
VITE_BREVO_API_KEY=sua_chave_aqui

# Salvar e reiniciar servidor
npm run dev
```

---

## 📝 CHECKLIST DE PRODUÇÃO

Antes de subir para produção:

- [ ] API Key configurada
- [ ] Domínio verificado no Brevo
- [ ] DNS configurado (SPF, DKIM, DMARC)
- [ ] E-mail remetente confirmado
- [ ] Testado cadastro (recebe e-mail?)
- [ ] Testado recuperação de senha (recebe e-mail?)
- [ ] E-mails do Supabase desabilitados
- [ ] Verificar se não vão para SPAM

---

## 💰 LIMITES DO PLANO GRATUITO

**Brevo Free:**
- ✅ 300 e-mails por dia
- ✅ E-mails transacionais ilimitados
- ✅ 1 usuário
- ✅ Templates ilimitados

**Se precisar mais:**
- **Lite**: $25/mês - 10.000 e-mails/mês
- **Premium**: $65/mês - 20.000 e-mails/mês + marketing

**Para projeto inicial:** Plano gratuito é suficiente! 🎉

---

## 🎉 TUDO PRONTO!

Agora seu sistema está configurado para:
- ✅ Enviar e-mails de confirmação via Brevo
- ✅ Enviar e-mails de recuperação de senha via Brevo
- ✅ E-mails bonitos com HTML customizado
- ✅ Monitoramento completo de envios
- ✅ Evitar SPAM

**Próximos passos:**
1. Configure sua API Key
2. Teste o cadastro
3. Verifique se recebeu os e-mails
4. Configure o domínio (opcional, mas recomendado)

---

**Dúvidas?** Verifique a documentação oficial: https://developers.brevo.com/
