@echo off
cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo Removendo arquivos com chaves...
git rm --cached .env.vercel 2>nul
git rm --cached RECRIAR_VARIAVEIS_VERCEL.md 2>nul
del .env.vercel 2>nul
del RECRIAR_VARIAVEIS_VERCEL.md 2>nul

echo.
echo Atualizando .gitignore...
echo .env.vercel >> .gitignore
echo RECRIAR_VARIAVEIS_VERCEL.md >> .gitignore

echo.
echo Commit...
git add .
git commit -m "fix: subir todas as correções"

echo.
echo Push...
git push origin main --force

echo.
echo PRONTO! ✅
pause
