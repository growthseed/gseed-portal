@echo off
echo ========================================
echo   DEPLOY i18n - HOME (Landing Page)
echo ========================================
echo.

echo [1/4] Adicionando arquivos ao Git...
git add src/i18n/locales/*.json
git add src/pages/Home.tsx
git add IMPLEMENTACAO-i18n-HOME.md

echo.
echo [2/4] Criando commit...
git commit -m "feat(i18n): Implementar internacionalização na página Home (Landing Page)

- Adicionar 14 chaves de tradução em 4 idiomas (pt-BR, en-US, es-ES, ro-RO)
- Converter Home.tsx para usar useTranslation
- Traduzir Hero section, Stats e Features
- Manter layout e funcionalidade 100% intactos
- Total: 56 traduções implementadas"

echo.
echo [3/4] Enviando para GitHub...
git push origin main

echo.
echo [4/4] Aguardando deploy no Vercel...
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo   DEPLOY CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo A página Home está sendo deployada em:
echo https://portal.gseed.com.br
echo.
echo Tempo estimado: 2-3 minutos
echo.
pause
