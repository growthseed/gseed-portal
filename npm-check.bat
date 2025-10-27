@echo off
echo ========================================
echo   GSEED PORTAL - NPM CHECK
echo ========================================
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/5] Verificando pacotes desatualizados...
echo.
npm outdated
echo.
echo ========================================
echo.

echo [2/5] Verificando vulnerabilidades...
echo.
npm audit
echo.
echo ========================================
echo.

echo [3/5] Verificando dependencias instaladas...
echo.
npm list --depth=0
echo.
echo ========================================
echo.

echo [4/5] Verificando configuracao do npm...
echo.
npm doctor
echo.
echo ========================================
echo.

echo [5/5] Resumo do projeto...
echo.
echo Projeto: GSeed Portal
echo Node version:
node --version
echo.
echo NPM version:
npm --version
echo.
echo Package.json:
type package.json | findstr "name version"
echo.

echo ========================================
echo   VERIFICACAO CONCLUIDA!
echo ========================================
echo.
echo Deseja corrigir vulnerabilidades? (s/n)
set /p resposta=
if /i "%resposta%"=="s" (
    echo.
    echo Corrigindo vulnerabilidades...
    npm audit fix
    echo.
    echo Vulnerabilidades corrigidas!
)

echo.
pause
