@echo off
echo ========================================
echo   GSEED PORTAL - DEPLOY TO VERCEL
echo ========================================
echo.

echo [1/5] Verificando status do Git...
git status
echo.

echo [2/5] Adicionando arquivos modificados...
git add .
echo.

echo [3/5] Criando commit...
git commit -m "fix: corrigir erros TypeScript no build - ChatMessage e avaliacaoService"
echo.

echo [4/5] Enviando para GitHub...
git push origin main
echo.

echo [5/5] Deploy concluido!
echo.
echo O Vercel detectara automaticamente o push e iniciara o deploy.
echo Acesse: https://vercel.com/growthseed/gseed-portal
echo.
pause
