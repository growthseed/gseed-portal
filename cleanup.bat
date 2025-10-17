@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   Limpeza de Arquivos - Gseed Portal
echo ============================================
echo.

echo [INFO] Removendo diretorios...
echo.

if exist "src\components\Avaliacoes" (
    rmdir /s /q "src\components\Avaliacoes"
    echo [OK] Removido: src\components\Avaliacoes
) else (
    echo [AVISO] Nao encontrado: src\components\Avaliacoes
)

if exist "src\components\beneficiarios" (
    rmdir /s /q "src\components\beneficiarios"
    echo [OK] Removido: src\components\beneficiarios
) else (
    echo [AVISO] Nao encontrado: src\components\beneficiarios
)

echo.
echo [INFO] Removendo arquivos...
echo.

if exist "src\components\DatePicker.tsx" (
    del /f /q "src\components\DatePicker.tsx"
    echo [OK] Removido: src\components\DatePicker.tsx
) else (
    echo [AVISO] Nao encontrado: src\components\DatePicker.tsx
)

if exist "src\pages\Beneficiaries.tsx" (
    del /f /q "src\pages\Beneficiaries.tsx"
    echo [OK] Removido: src\pages\Beneficiaries.tsx
) else (
    echo [AVISO] Nao encontrado: src\pages\Beneficiaries.tsx
)

if exist "src\pages\BeneficiaryDetail.tsx" (
    del /f /q "src\pages\BeneficiaryDetail.tsx"
    echo [OK] Removido: src\pages\BeneficiaryDetail.tsx
) else (
    echo [AVISO] Nao encontrado: src\pages\BeneficiaryDetail.tsx
)

if exist "src\pages\BeneficiariosPage.tsx" (
    del /f /q "src\pages\BeneficiariosPage.tsx"
    echo [OK] Removido: src\pages\BeneficiariosPage.tsx
) else (
    echo [AVISO] Nao encontrado: src\pages\BeneficiariosPage.tsx
)

if exist "src\pages\MentorDetail.tsx" (
    del /f /q "src\pages\MentorDetail.tsx"
    echo [OK] Removido: src\pages\MentorDetail.tsx
) else (
    echo [AVISO] Nao encontrado: src\pages\MentorDetail.tsx
)

if exist "src\pages\Mentors.tsx" (
    del /f /q "src\pages\Mentors.tsx"
    echo [OK] Removido: src\pages\Mentors.tsx
) else (
    echo [AVISO] Nao encontrado: src\pages\Mentors.tsx
)

if exist "src\pages\ContentLibrary.tsx" (
    del /f /q "src\pages\ContentLibrary.tsx"
    echo [OK] Removido: src\pages\ContentLibrary.tsx
) else (
    echo [AVISO] Nao encontrado: src\pages\ContentLibrary.tsx
)

if exist "src\pages\Reports.tsx" (
    del /f /q "src\pages\Reports.tsx"
    echo [OK] Removido: src\pages\Reports.tsx
) else (
    echo [AVISO] Nao encontrado: src\pages\Reports.tsx
)

if exist "src\pages\Settings.tsx" (
    del /f /q "src\pages\Settings.tsx"
    echo [OK] Removido: src\pages\Settings.tsx
) else (
    echo [AVISO] Nao encontrado: src\pages\Settings.tsx
)

echo.
echo ============================================
echo   Limpeza concluida!
echo ============================================
echo.
echo Proximos passos:
echo   1. git add .
echo   2. git commit -m "fix: remove arquivos nao relacionados"
echo   3. git push
echo   4. npm run build (para testar localmente)
echo.
pause
