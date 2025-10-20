# 🚀 Guia de Deploy - Edge Function Brevo Proxy

## 📋 O que foi feito

Criamos uma **Edge Function** no Supabase que atua como proxy para a API do Brevo. Isso resolve os seguintes problemas:

1. ❌ **CORS** - Requisições diretas do navegador são bloqueadas
2. ❌ **Restrição de IP** - Brevo pode ter restrições de IP ativadas
3. ❌ **API Key exposta** - A chave não fica exposta no front-end
4. ✅ **Centralização** - Todas as chamadas passam pelo backend do Supabase

## 🛠️ Passos para Deploy

### 1. Instalar Supabase CLI

```bash
# Windows (com Chocolatey)
choco install supabase

# macOS (com Homebrew)
brew install supabase/tap/supabase

# Ou baixar direto:
# https://github.com/supabase/cli/releases
```

### 2. Login no Supabase

```bash
supabase login
```

### 3. Linkar o projeto

```bash
cd "C:\Users\EFEITO DIGITAL\gseed-portal"
supabase link --project-ref xnwnwvhoulxxzxtxqmbr
```

### 4. Configurar a API Key do Brevo

Você precisa adicionar a chave do Brevo como variável de ambiente no Supabase:

```bash
# Via CLI
supabase secrets set BREVO_API_KEY=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

# Ou via Dashboard do Supabase:
# 1. Acesse: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/settings/functions
# 2. Vá em "Edge Functions" > "Manage secrets"
# 3. Adicione: BREVO_API_KEY = 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
```

### 5. Deploy da Edge Function

```bash
supabase functions deploy brevo-proxy
```

### 6. Testar a Edge Function

```bash
# Teste básico
curl -X POST https://xnwnwvhoulxxzxtxqmbr.supabase.co/functions/v1/brevo-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getAccount",
    "params": {}
  }'
```

## 🔍 Verificar se está funcionando

### No Console do Navegador:

```javascript
// Abra o console (F12) na aplicação e execute:
const response = await fetch('https://xnwnwvhoulxxzxtxqmbr.supabase.co/functions/v1/brevo-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'getAccount',
    params: {}
  })
});
const data = await response.json();
console.log(data);
```

### Resposta esperada (sucesso):

```json
{
  "success": true,
  "data": {
    "email": "[email protected]",
    "firstName": "...",
    "lastName": "...",
    "companyName": "Gseed Works",
    "plan": [...]
  }
}
```

## ⚠️ Problemas Comuns

### 1. API Key não habilitada

**Erro:** `"API Key is not enabled"` ou `401 Unauthorized`

**Soluções:**

1. **Verificar conta Brevo:**
   - Acesse https://app.brevo.com
   - Verifique se a conta está ativa e verificada
   - Confirme o e-mail da conta se necessário

2. **Gerar nova API Key:**
   - Vá em: https://app.brevo.com/settings/keys/api
   - Delete a chave antiga
   - Crie uma nova chave
   - Atualize no Supabase: `supabase secrets set BREVO_API_KEY=nova-chave-aqui`
   - Faça deploy novamente: `supabase functions deploy brevo-proxy`

3. **Desabilitar restrições de IP:**
   - Acesse: https://app.brevo.com/settings/keys/api
   - Edite a API Key
   - Desmarque "Restrict API key usage by IP"
   - Salve

### 2. CORS Error

**Erro:** `Access to fetch at '...' from origin '...' has been blocked by CORS`

**Solução:** Já está resolvido na Edge Function com headers CORS corretos.

### 3. Edge Function não encontrada

**Erro:** `404 Not Found` ao chamar a function

**Soluções:**
- Verifique se fez o deploy: `supabase functions list`
- Redeploy: `supabase functions deploy brevo-proxy`

## 📊 Logs e Debug

### Ver logs da Edge Function:

```bash
# Logs em tempo real
supabase functions logs brevo-proxy

# Ou no Dashboard:
# https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/logs/edge-functions
```

### Debug no código:

Adicione `console.log()` na Edge Function e veja os logs:

```typescript
console.log('Debug:', { action, params });
```

## 🔐 Segurança

✅ **API Key não fica exposta** no front-end  
✅ **Todas as requisições passam pelo backend** do Supabase  
✅ **CORS configurado corretamente**  
✅ **Logs de todas as operações**

## 📞 Suporte

Se ainda houver problemas:

1. Verifique os logs: `supabase functions logs brevo-proxy`
2. Teste a API Key diretamente: https://developers.brevo.com/reference/getting-started
3. Suporte Brevo: https://help.brevo.com
4. Suporte Supabase: https://supabase.com/docs

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. ✅ Testar cadastro de usuário
2. ✅ Verificar envio de emails
3. ✅ Confirmar logs no Supabase
4. ✅ Monitorar uso da API Brevo

## 📝 Notas

- A Edge Function usa Deno (não Node.js)
- O deploy pode levar alguns minutos
- As secrets são criptografadas
- Logs ficam disponíveis por 7 dias no plano gratuito
