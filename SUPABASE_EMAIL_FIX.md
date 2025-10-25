# 🔧 Correção - Erro de Email no Cadastro

## ❌ Problema
```
Error sending confirmation email
AuthApiError: Error sending confirmation email
```

## 🎯 Causa
O Supabase está configurado para exigir confirmação de email, mas o serviço de email não está configurado corretamente.

## ✅ Soluções

### Opção 1: Desabilitar Confirmação de Email (RECOMENDADO PARA DESENVOLVIMENTO)

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione o projeto: `xnwnwvhoulxxzxtxqmbr`
3. Vá em **Authentication** → **Settings** → **Auth Providers**
4. Desmarque **Enable email confirmations**
5. Clique em **Save**

### Opção 2: Configurar SMTP Customizado (RECOMENDADO PARA PRODUÇÃO)

#### Usando Brevo (Sendinblue)
Você já tem a chave API do Brevo configurada. Para usar com Supabase:

1. Acesse o Supabase Dashboard
2. Vá em **Project Settings** → **Authentication** → **SMTP Settings**
3. Configure:
   ```
   Host: smtp-relay.brevo.com
   Port: 587
   User: (seu email Brevo)
   Password: (sua senha SMTP Brevo - NÃO é a API key)
   Sender Email: noreply@gseed.com.br
   Sender Name: GSeed Portal
   ```

4. Teste o envio de email

### Opção 3: Usar Email Padrão do Supabase (TEMPORÁRIO)

O Supabase oferece 4 emails por hora no plano free. Para habilitar:

1. No Supabase Dashboard
2. **Authentication** → **Email Templates**
3. Verifique se os templates estão ativos
4. **Project Settings** → **Authentication**
5. Em **SMTP Settings**, deixe em branco (usar padrão)

## 🚀 Solução Imediata

Vou atualizar o código para permitir cadastro SEM confirmação de email obrigatória:

```typescript
// AuthContext.tsx - Método signUp atualizado
const signUp = async (email: string, password: string, metadata?: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) throw error
    
    // Verificar se precisa de confirmação
    if (data.user && !data.session) {
      toast.info('Cadastro realizado! Verifique seu email para confirmar.')
    } else {
      toast.success('Cadastro realizado com sucesso!')
    }
  } catch (error: any) {
    // Tratamento específico para erro de email
    if (error.message?.includes('sending confirmation email')) {
      toast.warning('Conta criada mas não foi possível enviar email de confirmação. Entre em contato com o suporte.')
      // Não bloquear o cadastro
      return
    }
    toast.error(error.message || 'Erro ao fazer cadastro')
    throw error
  }
}
```

## ⚙️ Configuração Recomendada para Produção

1. **Desabilitar confirmação de email** no Supabase durante desenvolvimento
2. **Habilitar confirmação de email** em produção com SMTP customizado (Brevo)
3. **Configurar templates de email** personalizados no Supabase

## 📝 Próximos Passos

1. [ ] Desabilitar confirmação de email no Supabase (temporário)
2. [ ] Configurar SMTP Brevo no Supabase
3. [ ] Criar templates de email personalizados
4. [ ] Testar fluxo completo de cadastro
5. [ ] Reabilitar confirmação de email em produção

## 🔗 Links Úteis

- Supabase Dashboard: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/settings/auth
- Brevo SMTP: https://app.brevo.com/settings/keys/smtp
- Documentação Supabase Auth: https://supabase.com/docs/guides/auth/auth-smtp
