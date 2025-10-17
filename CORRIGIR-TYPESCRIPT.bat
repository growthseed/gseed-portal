@echo off
echo ========================================
echo   GSEED - Corrigindo TypeScript
echo ========================================
echo.

cd /d "%~dp0"

echo Executando correções...
echo.

powershell -ExecutionPolicy Bypass -File "fix-typescript-errors.ps1"

echo.
echo ========================================
echo   Fazendo commit das correções...
echo ========================================
echo.

git add .
git commit -m "fix: corrige todos os erros TypeScript sistematicamente"

echo.
echo Enviando para GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo ❌ ERRO no push!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ SUCESSO! Erros corrigidos!
echo ========================================
echo.
echo Agora vamos reativar o strict mode
echo gradualmente para manter qualidade.
echo.
pause
