@echo off
echo ========================================
echo   APLICAR CORRECAO RLS DO CHAT
echo ========================================
echo.

REM Verificar se está no diretório correto
if not exist "supabase\migrations\20251024_fix_chat_rls_complete.sql" (
    echo ERRO: Arquivo de migration nao encontrado!
    echo Certifique-se de estar no diretorio raiz do projeto.
    pause
    exit /b 1
)

echo [1/3] Verificando CLI do Supabase...
supabase --version > nul 2>&1
if errorlevel 1 (
    echo ERRO: Supabase CLI nao instalado!
    echo.
    echo Instale com: npm install -g supabase
    pause
    exit /b 1
)

echo [2/3] Aplicando migration...
echo.
supabase db push

if errorlevel 1 (
    echo.
    echo =========================================
    echo   ERRO AO APLICAR MIGRATION
    echo =========================================
    echo.
    echo Tente aplicar manualmente:
    echo 1. Acesse: https://supabase.com/dashboard
    echo 2. Va em: SQL Editor
    echo 3. Cole o conteudo do arquivo: supabase\migrations\20251024_fix_chat_rls_complete.sql
    echo 4. Execute
    echo.
    pause
    exit /b 1
)

echo.
echo =========================================
echo   MIGRATION APLICADA COM SUCESSO!
echo =========================================
echo.
echo Proximos passos:
echo 1. Recarregue a aplicacao (Ctrl+R no navegador)
echo 2. Teste o chat entre dois usuarios
echo 3. Verifique se nao ha mais erros 403 no console
echo.

pause
