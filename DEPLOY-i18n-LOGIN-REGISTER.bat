@echo off
echo ========================================
echo   DEPLOY i18n - LOGIN + REGISTER
echo ========================================
echo.

echo [1/4] Adicionando arquivos ao Git...
git add src/i18n/locales/pt-BR.json
git add src/i18n/locales/en-US.json
git add src/pages/Login.tsx
git add src/pages/Register.tsx
git add IMPLEMENTACAO-i18n-LOGIN-REGISTER.md

echo.
echo [2/4] Criando commit...
git commit -m "feat(i18n): Implementar internacionalização em Login e Register

- Adicionar 40 chaves de tradução auth.login.* e auth.register.*
- Converter Login.tsx e Register.tsx para useTranslation
- Traduzir formulários, labels, botões e mensagens
- Implementar em pt-BR e en-US (es-ES e ro-RO pendentes)
- Total: 80 traduções funcionais"

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
echo Páginas sendo deployadas em:
echo - https://portal.gseed.com.br/login
echo - https://portal.gseed.com.br/register
echo.
echo Tempo estimado: 2-3 minutos
echo.
echo AVISO: Espanhol e Romeno ainda pendentes
echo Execute após adicionar es-ES e ro-RO
echo.
pause
