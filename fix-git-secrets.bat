@echo off
echo ========================================
echo   REMOVENDO ARQUIVOS SENSÍVEIS DO GIT
echo ========================================
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/4] Removendo .env.vercel do Git...
git rm --cached .env.vercel
del .env.vercel

echo.
echo [2/4] Removendo RECRIAR_VARIAVEIS_VERCEL.md do Git...
git rm --cached RECRIAR_VARIAVEIS_VERCEL.md
del RECRIAR_VARIAVEIS_VERCEL.md

echo.
echo [3/4] Atualizando .gitignore...
echo .env.vercel >> .gitignore
echo RECRIAR_VARIAVEIS_VERCEL.md >> .gitignore

echo.
echo [4/4] Fazendo commit da correção...
git add .gitignore
git commit -m "fix: remover chaves de API do repositório

- Removido .env.vercel (chaves já estão no Vercel)
- Removido RECRIAR_VARIAVEIS_VERCEL.md (não necessário)
- Atualizado .gitignore para ignorar arquivos sensíveis
"

echo.
echo ========================================
echo   ✅ PRONTO PARA PUSH SEGURO!
echo ========================================
echo.
echo Agora execute: git push origin main
echo.
pause
