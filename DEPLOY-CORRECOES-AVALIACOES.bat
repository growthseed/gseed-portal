@echo off
echo ====================================
echo  CORRIGIR E FAZER DEPLOY
echo ====================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando erros de TypeScript...
call npm run type-check
if errorlevel 1 (
    echo.
    echo ❌ ERRO: Ainda existem erros de TypeScript!
    echo Verifique o arquivo CORRECOES-AVALIACOES-25-OUT-2025.md
    pause
    exit /b 1
)

echo.
echo [2/5] Compilando projeto...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ ERRO: Build falhou!
    pause
    exit /b 1
)

echo.
echo [3/5] Adicionando arquivos ao Git...
git add .

echo.
echo [4/5] Fazendo commit...
git commit -m "fix: corrigir erros TypeScript no sistema de avaliacoes - usar client.name ao inves de client.full_name"

echo.
echo [5/5] Fazendo push para o repositorio...
git push origin main

echo.
echo ====================================
echo  ✅ DEPLOY CONCLUIDO COM SUCESSO!
echo ====================================
echo.
echo O Vercel detectara o push e fara deploy automatico
echo.
echo Acesse: https://portal.gseed.com.br
echo.
pause
