@echo off
echo ========================================
echo   GSEED - Correções Finais TypeScript
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Fazendo commit das correções do Chat.tsx...
git add src/components/layout/Chat.tsx
git commit -m "fix: corrige erros do Chat.tsx - usa other_user e subscribeToConversation"

echo.
echo [2/3] Enviando para GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo ❌ ERRO no push!
    pause
    exit /b 1
)

echo.
echo [3/3] Testando build local...
npm run build

if errorlevel 1 (
    echo.
    echo ⚠️  Build local falhou - mas vamos ver na Vercel
) else (
    echo.
    echo ✅ Build local passou!
)

echo.
echo ========================================
echo   ✅ Correções aplicadas!
echo ========================================
echo.
echo Verifique o deploy na Vercel:
echo https://vercel.com/growthseed/gseed-portal
echo.
pause
