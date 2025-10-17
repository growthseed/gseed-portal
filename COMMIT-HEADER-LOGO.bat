@echo off
echo ====================================
echo COMMIT: Padronizar Logo Gseed Works
echo ====================================
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/4] Adicionando arquivos...
git add .

echo.
echo [2/4] Fazendo commit...
git commit -m "fix: padronizar logo Gseed Works em todos os headers

- Removido círculo com G do PublicHeader
- Logo Gseed Works com gradiente em todos os headers
- Usa /logo-dark.png e /logo-light.png
- Header AppHeader e PublicHeader agora idênticos
- Texto 'Works' com gradiente verde gseed-600/400
"

echo.
echo [3/4] Enviando para GitHub...
git push origin main

echo.
echo [4/4] CONCLUÍDO!
echo ====================================
echo Deploy automático no Vercel iniciado
echo Acesse: https://vercel.com para acompanhar
echo ====================================
echo.
pause
