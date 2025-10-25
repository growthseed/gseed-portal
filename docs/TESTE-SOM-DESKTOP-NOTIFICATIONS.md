# 🧪 Guia de Testes - Som e Desktop Notifications

## 🎯 Objetivo
Testar e validar o funcionamento do sistema de notificações sonoras e desktop que foi implementado.

---

## 📋 Checklist de Testes

### ✅ Pré-requisitos
- [ ] Sistema rodando localmente (`npm run dev`)
- [ ] Usuário autenticado
- [ ] Navegador moderno (Chrome/Edge/Firefox)
- [ ] Som do computador ligado
- [ ] Duas abas/navegadores diferentes (para simular mensagens)

---

## 🔔 TESTE 1: Som de Notificação

### Passos:
1. **Abrir o sistema em 2 abas diferentes**
   - Aba 1: Usuário A (logado)
   - Aba 2: Usuário B (logado com outra conta)

2. **Na Aba 1 (Usuário A):**
   - Ir para qualquer página (NÃO a de mensagens)
   - Deixar a aba em **segundo plano** (fora de foco)

3. **Na Aba 2 (Usuário B):**
   - Ir para `/mensagens`
   - Enviar uma mensagem para o Usuário A

4. **Resultado Esperado:**
   - ✅ Aba 1 deve tocar um **som** (tríade C-E-G)
   - ✅ Som NÃO deve tocar se Aba 1 estiver em foco

### Validações:
```
✅ Som toca quando aba está em background
❌ Som NÃO toca quando aba está em foco
✅ Som é agradável (tríade musical)
✅ Volume ajustável (padrão 0.5)
```

### Debug:
Se não funcionar, abrir Console (F12) e verificar:
```javascript
// Verificar se som está habilitado
localStorage.getItem('notificationSoundEnabled')
// Deve retornar: "true"

// Verificar volume
localStorage.getItem('notificationSoundVolume')
// Deve retornar: "0.5" (padrão 50%)
```

---

## 🖥️ TESTE 2: Desktop Notifications

### 2.1 - Solicitar Permissão

1. **Ir para `/configuracoes`** (quando implementarmos)
   - Ou criar uma página de teste temporária

2. **Clicar em "Ativar Notificações Desktop"**

3. **Resultado Esperado:**
   - ✅ Navegador mostra popup pedindo permissão
   - ✅ Após aceitar, botão muda para "Desativar"
   - ✅ Status mostra "Ativado ✓"

### 2.2 - Testar Notificação Desktop

1. **Abrir sistema em 2 abas**
   - Aba 1: Usuário A (permissão concedida)
   - Aba 2: Usuário B

2. **Na Aba 1:**
   - Minimizar navegador ou mudar para outro app
   - Aba deve estar em **background**

3. **Na Aba 2:**
   - Enviar mensagem para Usuário A

4. **Resultado Esperado:**
   - ✅ Notificação desktop aparece no sistema operacional
   - ✅ Mostra título: "Nova mensagem de [Nome]"
   - ✅ Mostra preview da mensagem
   - ✅ Ícone/imagem apropriado
   - ✅ Auto-fecha após 5 segundos (exceto propostas aceitas)

### 2.3 - Tipos de Notificação

Testar cada tipo:

#### Mensagem Nova
```
Título: "Nova mensagem de João Silva"
Corpo: "Olá! Podemos conversar sobre..."
Comportamento: Auto-fecha em 5s
```

#### Proposta Recebida
```
Título: "Nova proposta recebida!"
Corpo: "João enviou proposta para 'Projeto X'"
Comportamento: Auto-fecha em 5s
```

#### Proposta Aceita 🎉
```
Título: "Proposta aceita! 🎉"
Corpo: "Sua proposta para 'Projeto X' foi aceita!"
Comportamento: Requer clique para fechar (importante!)
```

#### Proposta Recusada
```
Título: "Proposta recusada"
Corpo: "Sua proposta para 'Projeto X' foi recusada."
Comportamento: Auto-fecha em 5s
```

#### Novo Projeto
```
Título: "Novo projeto disponível! 💼"
Corpo: "Projeto X combina com suas habilidades"
Comportamento: Auto-fecha em 5s
```

### Validações:
```
✅ Notificação aparece no sistema operacional
✅ NÃO aparece se aba estiver em foco
✅ Ícone/imagem correto por tipo
✅ Título e mensagem claros
✅ Auto-fecha em 5s (exceto proposta aceita)
✅ Proposta aceita requer clique manual
✅ Clicar na notificação abre a aba do sistema
```

---

## 🎛️ TESTE 3: Configurações

### 3.1 - Toggle Som

1. **Ir para Configurações de Som**
2. **Desativar som**
3. **Receber notificação**
4. **Resultado:** ❌ Som NÃO deve tocar

5. **Reativar som**
6. **Receber notificação**
7. **Resultado:** ✅ Som deve tocar

### 3.2 - Controle de Volume

1. **Ajustar slider de volume para 100%**
2. **Clicar em "Testar Som"**
3. **Resultado:** ✅ Som mais alto

4. **Ajustar para 10%**
5. **Testar novamente**
6. **Resultado:** ✅ Som mais baixo

### 3.3 - Toggle Desktop

1. **Desativar Desktop Notifications**
2. **Receber notificação**
3. **Resultado:** ❌ Notificação desktop NÃO aparece

4. **Reativar**
5. **Receber notificação**
6. **Resultado:** ✅ Notificação desktop aparece

---

## 🔄 TESTE 4: Integração Completa

### Cenário Real:
1. **Usuário A:**
   - Som: Ativado (50% volume)
   - Desktop: Ativado com permissão
   - Navegador minimizado

2. **Usuário B:**
   - Envia mensagem para A

3. **Resultado Esperado:**
   - ✅ Som toca (50% volume)
   - ✅ Notificação desktop aparece
   - ✅ Badge de contador atualiza
   - ✅ Lista de notificações atualiza em realtime

---

## 🐛 Problemas Comuns e Soluções

### Som não toca
```javascript
// Verificar localStorage
localStorage.getItem('notificationSoundEnabled')
// Se null ou "false", ativar:
localStorage.setItem('notificationSoundEnabled', 'true')
localStorage.setItem('notificationSoundVolume', '0.5')
```

### Desktop notifications não aparecem

**1. Verificar permissão:**
```javascript
// No console do navegador:
console.log(Notification.permission)
// Deve ser: "granted"
```

**2. Se for "denied":**
- Chrome: Configurações → Privacidade → Notificações
- Firefox: Preferências → Privacidade → Permissões → Notificações
- Remover o site e conceder permissão novamente

**3. Verificar se está habilitado:**
```javascript
localStorage.getItem('desktopNotificationsEnabled')
// Deve retornar: "true"
```

### Notificação aparece mesmo com aba em foco

**Verificar:**
```javascript
// Este código detecta se página está visível
document.hidden
// Deve retornar: false (quando em foco)
// Deve retornar: true (quando em background)
```

Se sempre retorna `false`, pode ser problema do navegador.

---

## 📊 Checklist Final

### Som de Notificação
- [ ] Toca quando aba em background
- [ ] NÃO toca quando aba em foco
- [ ] Volume ajustável funciona
- [ ] Botão "Testar Som" funciona
- [ ] Toggle on/off funciona
- [ ] Configurações salvam no localStorage

### Desktop Notifications
- [ ] Solicita permissão corretamente
- [ ] Notificação aparece no SO
- [ ] NÃO aparece se aba em foco
- [ ] Todos os 5 tipos funcionam
- [ ] Proposta aceita requer clique
- [ ] Outros auto-fecham em 5s
- [ ] Clicar abre o sistema
- [ ] Toggle on/off funciona

### Integração
- [ ] Som + Desktop funcionam juntos
- [ ] Realtime atualiza corretamente
- [ ] Badge contador atualiza
- [ ] Lista de notificações atualiza

---

## 🚀 Teste de Produção

Após validar local, testar em produção:

1. **Deploy para produção**
2. **Testar com HTTPS** (necessário para notifications)
3. **Testar em diferentes navegadores:**
   - Chrome/Edge ✓
   - Firefox ✓
   - Safari ⚠️ (pode ter limitações)
4. **Testar em mobile:**
   - Notifications podem não funcionar em alguns mobiles
   - Som deve funcionar normalmente

---

## 📝 Relatório de Teste

Após testes, preencher:

```
Data: _____________
Testador: _____________

✅ Som de Notificação: [ ] OK  [ ] FALHOU
✅ Desktop Notifications: [ ] OK  [ ] FALHOU
✅ Configurações: [ ] OK  [ ] FALHOU
✅ Integração: [ ] OK  [ ] FALHOU

Observações:
_________________________________
_________________________________
_________________________________

Bugs encontrados:
_________________________________
_________________________________
_________________________________
```

---

**Criado:** 24/10/2025  
**Versão:** 1.0  
**Status:** Pronto para testes
