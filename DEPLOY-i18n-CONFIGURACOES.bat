@echo off
echo ========================================
echo   DEPLOY i18n CONFIGURACOES
echo ========================================
echo.

echo [1/5] Verificando status do Git...
git status

echo.
echo [2/5] Adicionando arquivos modificados...
git add src/i18n/locales/pt-BR.json
git add src/i18n/locales/en-US.json
git add src/i18n/locales/es-ES.json
git add src/i18n/locales/ro-RO.json
git add src/pages/Configuracoes.tsx
git add IMPLEMENTACAO-i18n-CONFIGURACOES-COMPLETA.md

echo.
echo [3/5] Criando commit...
git commit -m "feat(i18n): Implementar internacionalizacao na pagina de Configuracoes - Adicionar 67 chaves de traducao em 4 idiomas (pt-BR, en-US, es-ES, ro-RO) - Converter Configuracoes.tsx para usar react-i18next - Traduzir todas as 3 abas: Geral, Privacidade e Notificacoes - Incluir traducoes de validacoes e mensagens de erro - Manter 100%% da funcionalidade existente - Interface agora suporta troca de idioma em tempo real"

echo.
echo [4/5] Enviando para GitHub...
git push origin main

echo.
echo [5/5] Deploy automatico no Vercel sera iniciado...
echo.
echo ========================================
echo   DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Acesse: https://portal.gseed.com.br
echo.
echo Verificacoes:
echo 1. Acesse /configuracoes
echo 2. Teste troca de idioma no LanguageSwitcher
echo 3. Verifique se toda pagina traduz corretamente
echo.
pause
