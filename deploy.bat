@echo off
echo ======================================
echo   DEPLOY GSEED PORTAL - VERCEL
echo ======================================
echo.

echo [1/5] Verificando status do Git...
git status
echo.

echo [2/5] Adicionando arquivos...
git add .
echo.

echo [3/5] Criando commit...
git commit -m "fix: corrigir erros TypeScript e alinhar categorias de projetos com profissoes"
echo.

echo [4/5] Enviando para GitHub...
git push origin main
echo.

echo [5/5] Deploy concluido!
echo O Vercel detectara automaticamente e fara o deploy.
echo Acompanhe em: https://vercel.com/growthseeds-projects/gseed-portal
echo.

echo ======================================
echo   DEPLOY FINALIZADO COM SUCESSO!
echo ======================================
pause
