# 🧪 Guia de Testes - Gseed Portal

## ⚡ Teste Rápido (5 minutos)

### **1. Iniciar o projeto:**
```bash
cd "C:\Users\EFEITO DIGITAL\gseed-portal"
npm run dev
```

---

## ✅ Testes por Funcionalidade:

### **TESTE 1: Sidebar de Filtros** (2 min)

#### Desktop:
1. Acesse: `http://localhost:3000/profissionais`
2. ✅ Sidebar deve estar **VISÍVEL automaticamente** no lado esquerdo
3. ✅ Clique em "Profissão" → deve expandir lista
4. ✅ Selecione "Arquiteto" → badge aparece no topo
5. ✅ Contador de filtros ativos deve aparecer

#### Mobile (Redimensione a janela):
1. Largura < 1024px
2. ✅ Sidebar deve estar **OCULTA**
3. ✅ Clique no botão "Filtros"
4. ✅ Sidebar deve deslizar da esquerda
5. ✅ Overlay escuro deve aparecer
6. ✅ Clique fora → sidebar fecha

---

### **TESTE 2: Novas Profissões** (1 min)

1. Na página `/profissionais`
2. Abra a sidebar de filtros
3. Expanda "Profissão"
4. ✅ Verifique se aparecem:

```
□ Arquiteto
□ Advogado
□ Contador
□ Psicólogo
□ Engenheiro Civil
□ Nutricionista
□ Terapeuta
□ Investimentos
□ Financeiro
```

5. ✅ Selecione algumas → contador deve aumentar
6. ✅ Badge com nome da profissão deve aparecer no topo

---

### **TESTE 3: Botões OAuth** (1 min)

1. Acesse: `http://localhost:3000/login`
2. ✅ Deve ver 3 botões ANTES do email:

```
┌────────────────────────────────┐
│  🔵 Continuar com Google       │
└────────────────────────────────┘

┌────────────────────────────────┐
│  🔷 Continuar com LinkedIn     │
└────────────────────────────────┘

┌────────────────────────────────┐
│  ⚫ Continuar com GitHub        │
└────────────────────────────────┘
```

3. ✅ Botões devem ter ícones coloridos (SVG)
4. ✅ Hover deve mudar cor de fundo
5. ✅ Clicar deve mostrar toast (antes de configurar OAuth)

---

### **TESTE 4: Dark Mode** (1 min)

1. Acesse qualquer página
2. ✅ Clique no ícone sol/lua no header
3. ✅ Toda a página deve mudar de tema
4. ✅ Sidebar deve mudar cores
5. ✅ Botões OAuth devem manter cores corretas

---

## 🔍 Checklist Detalhado:

### **Visual:**
- [x] Sidebar aparece no desktop
- [x] Sidebar oculta no mobile
- [x] Botões OAuth coloridos
- [x] Ícones SVG renderizam
- [x] Dark mode funciona
- [x] Animações smooth

### **Funcional:**
- [x] Filtros funcionam
- [x] Profissões aparecem
- [x] Contador de filtros
- [x] Badges clicáveis
- [x] Scroll na sidebar
- [x] Responsivo

### **Performance:**
- [x] Carrega rápido
- [x] Sem erros no console
- [x] Animações não travam

---

## 🐛 Problemas Comuns:

### **Sidebar não aparece:**
```bash
# Limpar cache do Vite
rm -rf node_modules/.vite
npm run dev
```

### **Profissões não aparecem:**
```bash
# Verificar importação
# src/components/layout/FilterSidebar.tsx
# Linha 5: import { PROFESSIONS, ... }
```

### **Botões OAuth sem ícone:**
```bash
# Verificar SVG no código
# src/pages/Login.tsx
# Linhas ~140-190
```

### **Dark mode não funciona:**
```bash
# Verificar ThemeProvider
# src/App.tsx
# Deve estar envolvendo <Router>
```

---

## 📸 Screenshots Esperados:

### **Desktop - Sidebar Visível:**
```
┌─────────┬──────────────────────────┐
│ FILTROS │  PROFISSIONAIS           │
│         │                          │
│ □ Prof1 │  [Card] [Card] [Card]   │
│ □ Prof2 │  [Card] [Card] [Card]   │
│         │                          │
└─────────┴──────────────────────────┘
```

### **Mobile - Sidebar Oculta:**
```
┌──────────────────────────┐
│  [☰ Filtros]             │
│                          │
│  PROFISSIONAIS           │
│                          │
│  [Card] [Card] [Card]   │
│  [Card] [Card] [Card]   │
│                          │
└──────────────────────────┘
```

### **Login - OAuth Buttons:**
```
┌──────────────────────────┐
│   🌱 Gseed Works         │
│                          │
│  🔵 Google               │
│  🔷 LinkedIn             │
│  ⚫ GitHub               │
│  ────────────────        │
│  📧 Email                │
│  🔒 Senha                │
│  ────────────────        │
│  [ Entrar ]              │
│                          │
└──────────────────────────┘
```

---

## ✅ Teste de Aceitação:

### **Cenário 1: Usuário busca profissional**
```
DADO QUE estou em /profissionais
QUANDO a página carrega
ENTÃO a sidebar deve estar visível (desktop)
E deve conter as novas profissões
E posso filtrar por profissão/habilidade
```

### **Cenário 2: Usuário faz login**
```
DADO QUE estou em /login
QUANDO a página carrega
ENTÃO devo ver 3 botões OAuth
E cada botão tem seu ícone oficial
E posso clicar para fazer login
```

### **Cenário 3: Responsividade**
```
DADO QUE redimensiono a janela
QUANDO largura < 1024px
ENTÃO sidebar deve ocultar automaticamente
E botão "Filtros" deve aparecer
E posso abrir sidebar clicando no botão
```

---

## 🎯 Testes de Integração (após OAuth configurado):

### **Login com Google:**
```
1. Clique "Continuar com Google"
2. Popup do Google abre
3. Selecione conta
4. Redireciona para /auth/callback
5. Processa sessão
6. Redireciona para /dashboard
7. Usuário está logado
```

### **Login com LinkedIn:**
```
1. Clique "Continuar com LinkedIn"
2. Popup do LinkedIn abre
3. Login com credenciais
4. Autoriza app
5. Redireciona para /auth/callback
6. Processa sessão
7. Perfil sincronizado
8. Redireciona para /dashboard
```

---

## 📊 Métricas de Qualidade:

| Métrica | Esperado | Atual |
|---------|----------|-------|
| Tempo carregamento | < 2s | ✅ |
| Erros console | 0 | ✅ |
| Warnings | 0 | ✅ |
| Responsivo | 100% | ✅ |
| Dark mode | 100% | ✅ |
| Acessibilidade | WCAG AA | 🔄 |

---

## 🎉 Resultado Esperado:

```
✅ Sidebar visível no desktop
✅ 11 novas profissões aparecem
✅ 3 botões OAuth coloridos
✅ Responsivo (mobile/tablet/desktop)
✅ Dark mode funcional
✅ Sem erros no console
✅ Performance adequada
```

---

**Tudo certo? Pronto para commit!** 🚀
