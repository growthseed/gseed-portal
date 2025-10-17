@echo off
echo ========================================
echo  GSEED PORTAL - Setup GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando Git...
git --version
if errorlevel 1 (
    echo ERRO: Git nao esta instalado!
    echo Instale em: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo.
echo [2/5] Inicializando repositorio Git...
git init
if errorlevel 1 (
    echo AVISO: Repositorio ja existe
)

echo.
echo [3/5] Adicionando arquivos...
git add .

echo.
echo [4/5] Fazendo commit inicial...
git commit -m "🎉 Initial commit - Gseed Portal v1.0"
if errorlevel 1 (
    echo AVISO: Commit pode ja existir
)

echo.
echo [5/5] Conectando ao GitHub...
git remote add origin https://github.com/growthseed/gseed-portal.git
if errorlevel 1 (
    echo AVISO: Remote origin ja existe, removendo...
    git remote remove origin
    git remote add origin https://github.com/growthseed/gseed-portal.git
)

echo.
echo ========================================
echo  Configuracao concluida!
echo ========================================
echo.
echo PROXIMO PASSO:
echo 1. Crie o repositorio em: https://github.com/organizations/growthseed/repositories/new
echo    - Nome: gseed-portal
echo    - Visibilidade: Private ou Public
echo    - NAO marque nenhuma opcao adicional
echo.
echo 2. Depois execute: push-to-github.bat
echo.
pause
