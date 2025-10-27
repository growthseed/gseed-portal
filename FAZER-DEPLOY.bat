@echo off
echo.
echo ========================================
echo   GSEED PORTAL - DEPLOY AUTOMATICO
echo ========================================
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [PASSO 1] Adicionando arquivos ao Git...
git add src/services/avaliacaoService.ts
git add src/services/professionalService.ts
echo Arquivos adicionados!
echo.

echo [PASSO 2] Fazendo commit...
git commit -m "Fix: Corrigido erros 406 RLS policies e queries - Criadas policies publicas para avaliacoes e contracts - Corrigido join em avaliacaoService - Validacao de perfil profissional em professionalService - incrementViews falha silenciosamente se perfil nao existir"
echo Commit realizado!
echo.

echo [PASSO 3] Enviando para GitHub...
git push origin main
echo.

if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERRO NO DEPLOY!
    echo ========================================
    echo.
    echo Se o erro for sobre token/credenciais:
    echo 1. Abra o terminal e execute: git config --global credential.helper wincred
    echo 2. Execute novamente: git push origin main
    echo 3. Digite suas credenciais quando solicitado
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOY CONCLUIDO COM SUCESSO! 🚀
echo ========================================
echo.
echo O Vercel detectara o push automaticamente
echo e fara o deploy em alguns minutos.
echo.
echo Acompanhe o deploy em:
echo https://vercel.com/dashboard
echo.
echo Depois do deploy, acesse:
echo https://portal.gseed.com.br
echo.
echo IMPORTANTE: Limpe o cache com Ctrl+Shift+R
echo.
pause
