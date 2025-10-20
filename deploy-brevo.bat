@echo off
echo ========================================
echo   Deploy Brevo Proxy - Gseed Portal
echo ========================================
echo.

echo [1/4] Verificando Supabase CLI...
where supabase >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Supabase CLI nao encontrado!
    echo Instale com: choco install supabase
    echo Ou baixe em: https://github.com/supabase/cli/releases
    pause
    exit /b 1
)
echo OK - Supabase CLI instalado
echo.

echo [2/4] Fazendo login no Supabase...
supabase status
if %errorlevel% neq 0 (
    echo Fazendo login...
    supabase login
)
echo.

echo [3/4] Linkando projeto...
supabase link --project-ref xnwnwvhoulxxzxtxqmbr
echo.

echo [4/4] Configurando API Key do Brevo...
echo IMPORTANTE: Adicione a BREVO_API_KEY como secret
echo.
echo Execute este comando:
echo supabase secrets set BREVO_API_KEY=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
echo.
echo Ou configure pelo dashboard em:
echo https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/settings/functions
echo.

set /p continue="Configurou a API Key? (s/n): "
if /i "%continue%" neq "s" (
    echo Deploy cancelado.
    pause
    exit /b 0
)
echo.

echo [Deploy] Enviando Edge Function...
supabase functions deploy brevo-proxy --no-verify-jwt
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo   DEPLOY CONCLUIDO COM SUCESSO!
    echo ========================================
    echo.
    echo URL da funcao:
    echo https://xnwnwvhoulxxzxtxqmbr.supabase.co/functions/v1/brevo-proxy
    echo.
    echo Testar:
    echo curl -X POST https://xnwnwvhoulxxzxtxqmbr.supabase.co/functions/v1/brevo-proxy ^
    echo   -H "Content-Type: application/json" ^
    echo   -d "{\"action\":\"getAccount\",\"params\":{}}"
) else (
    echo ========================================
    echo   ERRO NO DEPLOY!
    echo ========================================
    echo Verifique os logs acima para mais detalhes.
)
echo.

echo Pressione qualquer tecla para ver os logs...
pause >nul
supabase functions logs brevo-proxy

pause
