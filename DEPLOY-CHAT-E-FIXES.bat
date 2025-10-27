@echo off
echo ========================================
echo  DEPLOY COMPLETO - CHAT E FIXES
echo ========================================
echo.
echo [!] ATENCAO: Este deploy inclui:
echo     1. Correcao do loop infinito (ProjetosPage/ProfissionaisPage)
echo     2. Logs de debug no sistema de chat
echo     3. Melhorias de performance
echo.
echo [!] SEGURANCA:
echo     - Usuarios existentes serao mantidos
echo     - Nenhuma alteracao em dados do banco
echo     - Apenas codigo frontend sera atualizado
echo.
pause

echo.
echo ========================================
echo  PASSO 1: VERIFICAR STATUS
echo ========================================
echo.

git status

echo.
echo Verificando arquivos modificados...
echo.

REM Verificar se há mudanças não commitadas
git diff --stat

echo.
echo ========================================
echo  PASSO 2: ADICIONAR ARQUIVOS
echo ========================================
echo.

echo [1/4] Adicionando correcoes de loop infinito...
git add src/pages/ProjetosPage.tsx
git add src/pages/ProfissionaisPage.tsx

echo [2/4] Adicionando melhorias no chat...
git add src/services/chatService.ts
git add src/components/Chat/FloatingChat.tsx

echo [3/4] Verificando outros arquivos modificados...
REM Adicionar outros arquivos tsx/ts modificados (se houver)
git add src/**/*.tsx 2>nul
git add src/**/*.ts 2>nul

echo [4/4] Verificando o que sera commitado...
git status

echo.
echo ========================================
echo  PASSO 3: CRIAR COMMIT
echo ========================================
echo.

git commit -m "fix: corrigir loop infinito e adicionar logs de debug no chat - Corrigido loop infinito em ProjetosPage e ProfissionaisPage - Substituido useMemo+useEffect por useCallback com deps explicitas - Adicionados logs de debug no chatService para diagnostico - Adicionados logs detalhados no FloatingChat - Melhorado tratamento de erros no sistema de chat - Performance e estabilidade melhoradas"

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha ao criar commit!
    echo Verifique se ha arquivos para commitar.
    pause
    exit /b 1
)

echo.
echo [OK] Commit criado com sucesso!

echo.
echo ========================================
echo  PASSO 4: PUSH PARA GITHUB
echo ========================================
echo.

echo Enviando para GitHub...
git push origin main

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha ao fazer push!
    echo Verifique sua conexao e credenciais do GitHub.
    pause
    exit /b 1
)

echo.
echo [OK] Push realizado com sucesso!

echo.
echo ========================================
echo  PASSO 5: VERIFICAR DEPLOY NA VERCEL
echo ========================================
echo.

echo Deploy automatico iniciado na Vercel!
echo.
echo Acesse para acompanhar:
echo https://vercel.com/dashboard
echo.
echo Aguarde aproximadamente 2-3 minutos para o deploy completar.
echo.

echo ========================================
echo  PROXIMOS PASSOS
echo ========================================
echo.
echo 1. Acesse https://vercel.com/dashboard
echo 2. Aguarde build completar (Status: Ready)
echo 3. Acesse https://portal.gseed.com.br
echo 4. Execute os testes:
echo.
echo    TESTE 1 - Loop Infinito:
echo    - Abrir pagina principal
echo    - Abrir console (F12)
echo    - Verificar que carrega APENAS 1 vez
echo.
echo    TESTE 2 - Chat:
echo    - Fazer login
echo    - Abrir chat
echo    - Enviar mensagem
echo    - Verificar logs no console
echo    - Fechar e reabrir chat
echo    - Verificar se mensagens persistem
echo.
echo    TESTE 3 - Usuarios:
echo    - Fazer login
echo    - Verificar perfil carrega
echo    - Verificar nenhum dado foi perdido
echo.

echo ========================================
echo  ROLLBACK (Se necessario)
echo ========================================
echo.
echo Se algo der errado:
echo    git revert HEAD
echo    git push origin main
echo.

echo ========================================
echo  DEPLOY COMPLETO
echo ========================================
echo.
echo [OK] Todas as etapas foram executadas!
echo [OK] Deploy automatico em andamento na Vercel
echo.
echo Aguarde 2-3 minutos e teste em:
echo https://portal.gseed.com.br
echo.

pause
