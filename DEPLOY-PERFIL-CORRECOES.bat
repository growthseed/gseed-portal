@echo off
echo ========================================
echo   GSEED PORTAL - DEPLOY CORRECOES PERFIL
echo ========================================
echo.
echo Subindo correcoes do perfil profissional:
echo - Toggle ativar perfil profissional
echo - Campos obrigatorios marcados com *
echo - Validacao completa
echo - Sistema de salvamento corrigido
echo - Remocao filtro Membro ASDRM
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/5] Verificando status...
git status

echo.
echo [2/5] Adicionando arquivos...
git add .

echo.
echo [3/5] Fazendo commit...
git commit -m "feat: Correcoes completas do perfil profissional - Toggle ativar perfil - Campos obrigatorios com validacao - Sistema de salvamento corrigido - Remocao filtro Membro ASDRM"

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
