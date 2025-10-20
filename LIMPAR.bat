@echo off
cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo Limpando histórico do commit problemático...
git filter-branch -f --index-filter "git rm --cached --ignore-unmatch .env.vercel RECRIAR_VARIAVEIS_VERCEL.md" --prune-empty -- --all

echo.
echo Forçando push limpo...
git push origin main --force

if errorlevel 1 (
    echo.
    echo Ainda bloqueado! Clique aqui para permitir:
    echo https://github.com/growthseed/gseed-portal/security/secret-scanning/unblock-secret/34B2HXWUpb6j9NYyXaPsm1dq12j
    echo.
    echo Depois execute: git push origin main --force
)

pause
