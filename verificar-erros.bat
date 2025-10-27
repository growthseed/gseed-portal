@echo off
echo ========================================
echo   GSEED PORTAL - VERIFICACAO COMPLETA
echo ========================================
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/6] Verificando erros de TypeScript...
echo.
call npx tsc --noEmit
if errorlevel 1 (
    echo ❌ ERROS DE TYPESCRIPT ENCONTRADOS
    echo.
) else (
    echo ✅ Nenhum erro de TypeScript
    echo.
)

echo ========================================
echo.

echo [2/6] Verificando erros de ESLint...
echo.
call npm run lint
if errorlevel 1 (
    echo ❌ ERROS DE ESLINT ENCONTRADOS
    echo.
) else (
    echo ✅ Nenhum erro de ESLint
    echo.
)

echo ========================================
echo.

echo [3/6] Testando build do projeto...
echo.
call npm run build
if errorlevel 1 (
    echo ❌ ERRO NO BUILD
    echo.
    echo O build falhou! Verifique os erros acima.
    pause
    exit /b 1
) else (
    echo ✅ Build concluido com sucesso
    echo.
)

echo ========================================
echo.

echo [4/6] Verificando dependencias...
echo.
call npm list --depth=0 2>&1 | findstr /C:"UNMET" /C:"missing"
if errorlevel 1 (
    echo ✅ Todas dependencias instaladas
) else (
    echo ❌ Dependencias faltando
)
echo.

echo ========================================
echo.

echo [5/6] Verificando arquivos importantes...
echo.

if exist "src\main.tsx" (
    echo ✅ main.tsx encontrado
) else (
    echo ❌ main.tsx NAO encontrado
)

if exist "src\App.tsx" (
    echo ✅ App.tsx encontrado
) else (
    echo ❌ App.tsx NAO encontrado
)

if exist ".env" (
    echo ✅ .env encontrado
) else (
    echo ⚠️  .env NAO encontrado - variaveis de ambiente podem estar faltando
)

if exist "vite.config.ts" (
    echo ✅ vite.config.ts encontrado
) else (
    echo ❌ vite.config.ts NAO encontrado
)

if exist "package.json" (
    echo ✅ package.json encontrado
) else (
    echo ❌ package.json NAO encontrado
)

echo.
echo ========================================
echo.

echo [6/6] Verificando variaveis de ambiente...
echo.
if exist ".env" (
    findstr "VITE_SUPABASE_URL" .env >nul
    if errorlevel 1 (
        echo ❌ VITE_SUPABASE_URL faltando
    ) else (
        echo ✅ VITE_SUPABASE_URL configurada
    )
    
    findstr "VITE_SUPABASE_ANON_KEY" .env >nul
    if errorlevel 1 (
        echo ❌ VITE_SUPABASE_ANON_KEY faltando
    ) else (
        echo ✅ VITE_SUPABASE_ANON_KEY configurada
    )
    
    findstr "VITE_CLOUDINARY_CLOUD_NAME" .env >nul
    if errorlevel 1 (
        echo ⚠️  VITE_CLOUDINARY_CLOUD_NAME faltando
    ) else (
        echo ✅ VITE_CLOUDINARY_CLOUD_NAME configurada
    )
) else (
    echo ⚠️  Arquivo .env nao encontrado
)

echo.
echo ========================================
echo   VERIFICACAO CONCLUIDA!
echo ========================================
echo.
echo Resumo:
echo - TypeScript: Verificado
echo - ESLint: Verificado
echo - Build: Verificado
echo - Dependencias: Verificado
echo - Arquivos: Verificado
echo - Variaveis de ambiente: Verificado
echo.
pause
