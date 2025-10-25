# ✅ CHECKLIST PRÉ-DEPLOY

Execute este checklist ANTES de fazer o deploy:

## 1. Arquivos Críticos ✅

- [x] `src/services/authService.ts` - Atualizado com auto-confirm
- [x] `supabase/auto-confirm-users.sql` - Script SQL documentado  
- [x] `.env.production` - Variáveis corretas
- [x] `DEPLOY-FINAL-FIX.bat` - Script pronto

## 2. Banco de Dados ✅

- [x] Trigger `auto_confirm_user()` criado
- [x] Trigger `on_auth_user_created_auto_confirm` ativo

Verificar com:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created_auto_confirm';
```

## 3. Variáveis de Ambiente ✅

`.env.production`:
- [x] `VITE_SUPABASE_URL` = https://xnwnwvhoulxxzxtxqmbr.supabase.co
- [x] `VITE_SUPABASE_ANON_KEY` = [chave presente]
- [x] `VITE_SITE_URL` = https://portal.gseed.com.br
- [x] `VITE_OAUTH_REDIRECT_URL` = https://portal.gseed.com.br/auth/callback

## 4. Configuração Supabase ⚠️

**PENDENTE - VOCÊ PRECISA FAZER:**

1. Acessar: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr
2. Ir em: Authentication → Settings
3. Encontrar: "Enable email confirmations"
4. **DESABILITAR** (toggle para OFF)

## 5. Scripts de Deploy 📦

Escolha um:

### Opção A: Script Automático (Recomendado)
```batch
DEPLOY-FINAL-FIX.bat
```

### Opção B: Manual
```batch
npm run build
vercel --prod
```

## 6. Pós-Deploy ✅

Após deploy concluído:

1. [ ] Acessar https://portal.gseed.com.br
2. [ ] Clicar em "Criar Conta"
3. [ ] Preencher formulário de cadastro
4. [ ] Verificar se NÃO há erro 500
5. [ ] Verificar se pode fazer login imediatamente
6. [ ] Testar navegação no dashboard

## 7. Testes Completos 🧪

### Teste 1: Cadastro Novo Usuário
- [ ] Preencher nome, email, senha
- [ ] Clicar em "Criar Conta"
- [ ] **Resultado esperado:** "Conta criada com sucesso!"
- [ ] **SEM erro 500**

### Teste 2: Login Imediato
- [ ] Usar mesmo email/senha do cadastro
- [ ] Clicar em "Entrar"
- [ ] **Resultado esperado:** Redireciona para dashboard

### Teste 3: Login com Usuário Existente
- [ ] Email: grupo@gseed.com.br
- [ ] Senha: [sua senha]
- [ ] **Resultado esperado:** Login bem-sucedido

## 8. Logs e Monitoramento 📊

Verificar logs:
- [ ] Vercel Dashboard: https://vercel.com/your-org/gseed-portal
- [ ] Console do navegador (F12)
- [ ] Supabase Dashboard → Logs

## 9. Se Algo Der Errado 🚨

### Erro 500 ainda aparece?
1. Verificar se desabilitou email confirmations
2. Limpar cache do navegador
3. Testar em modo anônimo

### Build falha?
```batch
rmdir /s /q dist
rmdir /s /q node_modules
npm install
npm run build
```

### Deploy falha?
```batch
vercel --prod --debug
```

## 10. Confirmação Final ✅

Quando tudo estiver funcionando:

- [ ] Site acessível em https://portal.gseed.com.br
- [ ] Cadastro funcionando sem erro 500
- [ ] Login funcionando
- [ ] Dashboard carregando
- [ ] Nenhum erro no console

---

## 🎯 AÇÃO IMEDIATA

**AGORA EXECUTE:**

```batch
cd C:\Users\EFEITO DIGITAL\gseed-portal
DEPLOY-FINAL-FIX.bat
```

Depois vá ao Supabase Dashboard e desabilite "Email confirmations"!

---

**Data:** 23/10/2025
**Status:** ⏳ Aguardando execução
