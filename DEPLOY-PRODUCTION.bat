@echo off
echo ==========================================
echo   DEPLOY GSEED PORTAL - PRODUCAO
echo ==========================================
echo.

REM 1. Deploy Edge Function
echo [1/4] Deployando Edge Function brevo-proxy...
supabase functions deploy brevo-proxy --no-verify-jwt
if errorlevel 1 (
    echo ERRO: Falha ao deployar Edge Function!
    pause
    exit /b 1
)
echo OK Edge Function deployada com sucesso!
echo.

REM 2. Verificar secrets
echo [2/4] Verificando secrets do Supabase...
supabase secrets list
echo.

REM 3. Build para producao
echo [3/4] Fazendo build de producao...
npm run build
if errorlevel 1 (
    echo ERRO: Falha no build!
    pause
    exit /b 1
)
echo OK Build concluido com sucesso!
echo.

REM 4. Instrucoes finais
echo [4/4] Proximos passos:
echo.
echo OK Edge Function deployada
echo OK Build de producao criado (pasta dist/)
echo.
echo IMPORTANTE: Agora voce precisa:
echo 1. Fazer upload da pasta dist/ para seu servidor
echo 2. OU fazer deploy via Vercel/Netlify
echo.
echo Comandos uteis:
echo   - Vercel: vercel --prod
echo   - Git: git add . e git commit -m Deploy production e git push
echo.
echo ==========================================
echo   DEPLOY CONCLUIDO!
echo ==========================================
pause
