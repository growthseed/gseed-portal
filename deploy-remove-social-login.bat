@echo off
echo ========================================
echo  REMOVER LOGIN SOCIAL - Deploy
echo ========================================
echo.

cd "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/3] Adicionando arquivos...
git add src/pages/Login.tsx
echo.

echo [2/3] Criando commit...
git commit -m "remove: botoes de login social (Google, LinkedIn, Facebook) - manter apenas login tradicional com email"
echo.

echo [3/3] Enviando para GitHub...
git push origin main
echo.

echo ========================================
echo  DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Aguarde 2-3 minutos para o Vercel fazer o deploy.
echo.
echo Teste em: https://portal.gseed.com.br/login
echo.
pause
