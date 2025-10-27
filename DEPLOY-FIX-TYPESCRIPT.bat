@echo off
echo ========================================
echo   GSEED PORTAL - FIX TYPESCRIPT ERROR
echo ========================================
echo.
echo Corrigindo erro de tipo no ProfessionalsPage
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/5] Verificando status...
git status

echo.
echo [2/5] Adicionando arquivos...
git add .

echo.
echo [3/5] Fazendo commit...
git commit -m "fix: Corrige tipo do FilterSidebar em ProfessionalsPage - type professionals para profissionais"

echo.
echo [4/5] Enviando para repositorio...
git push origin main

echo.
echo [5/5] Deploy concluido!
echo.
echo ========================================
echo   Aguarde o Vercel processar o deploy
echo   Acesse: https://portal.gseed.com.br
echo ========================================
echo.
pause
