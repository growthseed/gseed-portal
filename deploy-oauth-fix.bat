@echo off
echo ========================================
echo  FIX: OAuth URLs - Deploy para Vercel
echo ========================================
echo.

cd "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/4] Verificando status do Git...
git status
echo.

echo [2/4] Adicionando arquivos alterados...
git add src/services/oauthService.ts
git add COMMIT_OAUTH_FIX.md
echo.

echo [3/4] Criando commit...
git commit -m "fix: forcar URLs corretas do portal.gseed.com.br para OAuth - resolver erro 400/500 em logins sociais"
echo.

echo [4/4] Enviando para GitHub (vai triggar deploy automatico no Vercel)...
git push origin main
echo.

echo ========================================
echo  DEPLOY INICIADO!
echo ========================================
echo.
echo O Vercel vai fazer o deploy automatico em 2-3 minutos.
echo.
echo Acompanhe em: https://vercel.com/
echo.
echo Apos o deploy, teste os logins em:
echo https://portal.gseed.com.br/login
echo.
pause
