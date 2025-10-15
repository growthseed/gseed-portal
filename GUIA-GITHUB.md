# 🎯 GUIA VISUAL - 3 PASSOS PARA SUBIR NO GITHUB

## 📍 PASSO 1: Execute o Script de Setup

1. **Abra a pasta do projeto:**
   ```
   C:\Users\EFEITO DIGITAL\gseed-portal
   ```

2. **Dê duplo clique em:**
   ```
   setup-github.bat
   ```

3. **Aguarde a execução** (leva 5 segundos)

4. **Aparecerá uma mensagem** dizendo o que fazer a seguir

✅ **Feito!** O Git está configurado localmente.

---

## 📍 PASSO 2: Crie o Repositório no GitHub

1. **Abra seu navegador**

2. **Acesse:**
   ```
   https://github.com/organizations/growthseed/repositories/new
   ```
   
   **OU se growthseed for sua conta pessoal:**
   ```
   https://github.com/new
   ```

3. **Preencha o formulário:**

   **Repository name:**
   ```
   gseed-portal
   ```

   **Description (opcional):**
   ```
   Plataforma de conexão entre profissionais e projetos cristãos
   ```

   **Visibilidade:**
   - ⚪ Public (qualquer um pode ver)
   - 🔘 Private (só você e colaboradores)

   **⚠️ IMPORTANTE - NÃO marque nenhuma das opções abaixo:**
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license

4. **Clique no botão verde:**
   ```
   Create repository
   ```

✅ **Feito!** Repositório criado no GitHub.

---

## 📍 PASSO 3: Envie o Código

1. **Volte para a pasta do projeto:**
   ```
   C:\Users\EFEITO DIGITAL\gseed-portal
   ```

2. **Dê duplo clique em:**
   ```
   push-to-github.bat
   ```

3. **Aguarde o upload** (pode levar 30-60 segundos)

4. **Você verá:**
   ```
   ========================================
    SUCESSO!
   ========================================
   
   Seu código está no GitHub!
   Acesse: https://github.com/growthseed/gseed-portal
   ```

✅ **PRONTO! CÓDIGO NO GITHUB! 🎉**

---

## 🚀 PRÓXIMO PASSO: DEPLOY NA VERCEL

Agora que o código está no GitHub, você pode fazer deploy:

1. **Acesse:**
   ```
   https://vercel.com
   ```

2. **Clique em:**
   ```
   Sign Up / Login with GitHub
   ```

3. **Clique em:**
   ```
   Add New Project
   ```

4. **Selecione:**
   ```
   gseed-portal
   ```

5. **Configure as variáveis de ambiente** (copie do arquivo `.env`)

6. **Clique em:**
   ```
   Deploy
   ```

7. **Aguarde 2-3 minutos...**

8. **🎉 SITE NO AR!**

---

## ❓ PROBLEMAS COMUNS

### Problema: "git is not recognized"
**Solução:** Instale o Git:
1. Acesse: https://git-scm.com/download/win
2. Baixe e instale
3. Execute os scripts novamente

---

### Problema: "Repository not found"
**Solução:** 
1. Verifique se criou o repositório no GitHub (Passo 2)
2. Verifique se o nome está correto: `gseed-portal`
3. Execute o script novamente

---

### Problema: "Permission denied"
**Solução:**
1. Verifique se o token do GitHub está correto
2. Verifique se o token tem permissão de `repo`
3. Crie um novo token se necessário

---

## 📞 PRECISA DE AJUDA?

Se algo der errado:

1. **Tire um print da tela do erro**
2. **Me envie aqui no chat**
3. **Eu te ajudo a resolver!**

---

## ✅ CHECKLIST RÁPIDO

- [ ] Executei `setup-github.bat`
- [ ] Criei o repositório no GitHub
- [ ] Executei `push-to-github.bat`
- [ ] Vi a mensagem de sucesso
- [ ] Acessei o repositório no GitHub e o código está lá
- [ ] Pronto para deploy na Vercel!

---

**Última atualização:** 15/10/2025  
**Dificuldade:** 🟢 Super Fácil  
**Tempo:** ⏱️ 5 minutos
