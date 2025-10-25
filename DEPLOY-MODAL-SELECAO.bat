@echo off
echo ========================================
echo  DEPLOY GSEED PORTAL - MODAL DE SELECAO
echo ========================================
echo.
echo Este script vai fazer deploy da nova versao com modal de selecao ANTES do cadastro
echo.
echo Backup salvo em: BACKUP-23-OUT-2025\
echo.
pause

echo.
echo [1/5] Verificando mudancas...
git status

echo.
echo [2/5] Adicionando arquivos...
git add .

echo.
echo [3/5] Fazendo commit...
git commit -m "fix: Adiciona modal de selecao de tipo de usuario ANTES do formulario de cadastro"

echo.
echo [4/5] Enviando para repositorio...
git push origin main

echo.
echo [5/5] CONCLUIDO!
echo.
echo ========================================
echo  DEPLOY INICIADO!
echo ========================================
echo.
echo O Vercel vai fazer o deploy automaticamente.
echo Aguarde 2-3 minutos e acesse: portal.gseed.com.br
echo.
echo TESTE O FLUXO:
echo 1. Clique em "Criar Conta"
echo 2. Verifique se o modal aparece ANTES do formulario
echo 3. Escolha Profissional ou Contratante
echo 4. Preencha o formulario
echo 5. Finalize o cadastro
echo.
pause
