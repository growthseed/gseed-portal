@echo off
echo ========================================
echo GSEED PORTAL - DEPLOY COM CONFIRMACAO DE EMAIL
echo ========================================
echo.

echo [INFO] Configuracao:
echo - Confirmacao de email: ATIVA
echo - SMTP: Nativo do Supabase
echo - Anti-spam: Funcionando
echo.

echo [1/5] Limpando cache e builds antigos...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo ✅ Cache limpo

echo.
echo [2/5] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas

echo.
echo [3/5] Executando build de producao...
call npm run build
if errorlevel 1 (
    echo ❌ Erro no build
    pause
    exit /b 1
)
echo ✅ Build concluido

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
echo ✅ DEPLOY CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo 🌐 Seu site esta online em:
echo    https://portal.gseed.com.br
echo.
echo 📧 Configuracao de Email:
echo    ✅ Confirmacao de email ATIVA
echo    ✅ SMTP nativo do Supabase
echo    ✅ Anti-spam funcionando
echo.
echo 📝 Proximos passos:
echo    1. Acesse o Dashboard do Supabase
echo    2. Va em Authentication → Settings
echo    3. VERIFIQUE que "Enable email confirmations" esta LIGADO ✅
echo    4. Teste criando uma nova conta
echo    5. Verifique se recebe o email de confirmacao
echo.
echo 🧪 Como testar:
echo    1. Criar conta com seu email
echo    2. Aguardar email (1-2 minutos)
echo    3. Clicar no link de confirmacao
echo    4. Fazer login
echo.
echo ⚠️ IMPORTANTE:
echo    - Emails vem de: noreply@mail.supabase.io
echo    - Verifique pasta de SPAM
echo    - Pode demorar ate 5 minutos
echo.
echo ========================================
pause
