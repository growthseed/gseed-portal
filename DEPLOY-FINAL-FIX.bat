@echo off
echo ========================================
echo GSEED PORTAL - DEPLOY FINAL
echo ========================================
echo.

echo [1/5] Limpando cache e builds antigos...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo ✅ Cache limpo

echo.
echo [2/5] Instalando dependências...
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)
echo ✅ Dependências instaladas

echo.
echo [3/5] Executando build de produção...
call npm run build
if errorlevel 1 (
    echo ❌ Erro no build
    pause
    exit /b 1
)
echo ✅ Build concluído

echo.
echo [4/5] Fazendo deploy para Vercel...
call vercel --prod
if errorlevel 1 (
    echo ❌ Erro no deploy
    pause
    exit /b 1
)
echo ✅ Deploy realizado

echo.
echo [5/5] Verificando status...
call vercel ls
echo.

echo ========================================
echo ✅ DEPLOY CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo 🌐 Seu site está online em:
echo    https://portal.gseed.com.br
echo.
echo 📝 Próximos passos:
echo    1. Acesse o Dashboard do Supabase
echo    2. Desabilite "Email confirmations" em Authentication → Settings
echo    3. Teste criando uma nova conta
echo.
echo ========================================
pause
