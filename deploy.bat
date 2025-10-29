@echo off
echo ========================================
echo  GSEED PORTAL - DEPLOY AUTOMATICO
echo ========================================
echo.

echo [1/3] Adicionando alteracoes ao Git...
git add .

echo.
echo [2/3] Criando commit...
git commit -m "fix: adicionar campo professional_bio obrigatorio e novos campos profissionais - Sistema completo de skills, valores por hora, disponibilidade e bio profissional"

echo.
echo [3/3] Enviando para o GitHub...
git push

echo.
echo ========================================
echo  DEPLOY CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo O Vercel vai detectar as mudancas e fazer o deploy automatico.
echo Acompanhe em: https://vercel.com/
echo.
pause
