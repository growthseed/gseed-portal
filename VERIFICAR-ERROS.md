# 🔍 VERIFICAÇÃO DE ERROS - GSEED PORTAL

## Comandos para Verificar Erros

### 1. **Verificação Completa Automática** ⭐
```bash
cd C:\Users\EFEITO DIGITAL\gseed-portal
.\verificar-erros.bat
```
Este script verifica TUDO automaticamente.

---

### 2. **Verificações Individuais**

#### TypeScript (erros de tipo)
```bash
npx tsc --noEmit
```
- ✅ Sem erros = TypeScript OK
- ❌ Com erros = Corrigir antes de deploy

#### ESLint (erros de código)
```bash
npm run lint
```
- ✅ Sem erros = Código limpo
- ⚠️ Warnings = Pode ignorar
- ❌ Erros = Corrigir

#### Build (testar compilação)
```bash
npm run build
```
- ✅ Build OK = Projeto compila
- ❌ Build falhou = Tem erro bloqueante

#### Dependências (pacotes faltando)
```bash
npm install
```
Instala/verifica todas dependências

---

## 🎯 Verificação Rápida (Manual)

Execute estes 3 comandos em sequência:

```bash
cd C:\Users\EFEITO DIGITAL\gseed-portal

# 1. Verificar TypeScript
npx tsc --noEmit

# 2. Testar build
npm run build

# 3. Verificar dependências
npm list --depth=0
```

Se todos passarem = ✅ **Projeto sem erros!**

---

## ❌ Erros Comuns e Como Resolver

### Erro: "Cannot find module '@/...'"
**Causa**: Path alias não configurado
**Solução**: 
```bash
# Já está correto no tsconfig.json
# Se der erro, restart do VS Code resolve
```

### Erro: "Property does not exist on type"
**Causa**: TypeScript strict mode
**Solução**: Já está com `strict: false` no tsconfig

### Erro: "Module not found"
**Causa**: Dependência não instalada
**Solução**:
```bash
npm install
```

### Erro no Build: "Vite error"
**Causa**: Arquivo .env faltando ou variáveis incorretas
**Solução**: Verificar se .env existe com:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_CLOUDINARY_CLOUD_NAME

---

## 📊 Status do Projeto GSeed

### Estrutura ✅
```
✅ src/main.tsx          - Entry point OK
✅ src/App.tsx           - Component principal OK
✅ src/index.css         - Estilos globais OK
✅ vite.config.ts        - Configuração Vite OK
✅ package.json          - Dependências OK
✅ tsconfig.json         - TypeScript configurado
```

### Configurações ✅
```
✅ TypeScript: Modo relaxado (strict: false)
✅ Path aliases: @/* configurado
✅ Vite: Configurado para React
✅ ESLint: Configurado
```

---

## 🚀 Comandos que Você DEVE Rodar

### Antes de cada Deploy:
```bash
npm run build
```
Se compilar sem erro = OK para deploy!

### Se mudar dependências:
```bash
npm install
```

### Se adicionar arquivos TypeScript:
```bash
npx tsc --noEmit
```

---

## 📝 Checklist de Verificação

Antes de fazer deploy, verifique:

- [ ] `npm run build` - Compila sem erros
- [ ] `npx tsc --noEmit` - Sem erros TypeScript
- [ ] `.env` existe com todas variáveis
- [ ] `node_modules` instalado
- [ ] Nenhum erro no console do navegador (F12)

---

## 🔧 Troubleshooting

### "Command not found: npx"
```bash
npm install -g npm
```

### "Permission denied"
```bash
# Executar terminal como Administrador
```

### Build muito lento
```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules
npm install
```

---

**Quer rodar a verificação completa agora?**

Execute:
```bash
.\verificar-erros.bat
```

Ou me diga qual tipo de erro específico você quer checar! 🔍
