# GSEED PORTAL - DEPLOY RÁPIDO

## ✅ O que foi corrigido:
1. RLS Policies para avaliacoes e contracts (agora públicas)
2. Query de avaliacoes corrigida (profiles!client_id)
3. Validação de perfil profissional em professionalService
4. incrementViews agora não quebra se perfil não existir

## 🚀 Para fazer deploy, execute:

```bash
cd C:\Users\EFEITO DIGITAL\gseed-portal
git add .
git commit -m "Fix: Corrigido erros 406 RLS policies e queries"
git push origin main
```

## Ou execute o script:
```bash
.\deploy.bat
```

O Vercel vai detectar o push e fazer o deploy automaticamente.

## ⚠️ IMPORTANTE:
- O erro acontecia porque usuário Jean Coutinho não é profissional
- Código agora valida isso antes de fazer queries
- Limpe o cache do navegador após deploy: Ctrl+Shift+R

## 📊 Status das migrations:
- ✅ fix_rls_policies_avaliacoes_contracts - Aplicada com sucesso
