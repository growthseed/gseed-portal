@echo off
echo ========================================
echo   GSEED PORTAL - CORRECOES CRITICAS
echo ========================================
echo.
echo Correcoes aplicadas:
echo 1. Emails confirmados manualmente (Rejane e Davi)
echo 2. Cliente Supabase aprimorado com logs e config
echo 3. Fix de tipo em ProfessionalsPage
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/5] Verificando status...
git status

echo.
echo [2/5] Adicionando arquivos...
git add .

echo.
echo [3/5] Fazendo commit...
git commit -m "fix: Correcoes criticas - Emails confirmados - Cliente Supabase aprimorado - Fix tipo ProfessionalsPage"

echo.
echo [4/5] Enviando para repositorio...
git push origin main

echo.
echo [5/5] Deploy concluido!
echo.
echo ========================================
echo   USUARIOS AGORA DEVEM CONSEGUIR:
echo   - Rejane: fazer login no celular
echo   - Davi: fazer login no celular
echo   - Thyago: salvar perfil profissional
echo ========================================
echo.
pause
