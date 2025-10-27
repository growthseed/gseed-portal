@echo off
echo ========================================
echo  DIAGNOSTICO CHAT - MENSAGENS NAO PERSISTEM
echo ========================================
echo.

echo [1/4] Verificando estrutura do banco...
echo.

REM Criar arquivo SQL temporário para diagnóstico
echo -- Diagnostic queries > temp_diagnostic.sql
echo SELECT 'RLS Status' as check_type, tablename, rowsecurity FROM pg_tables WHERE tablename = 'chat_messages'; >> temp_diagnostic.sql
echo SELECT 'Policies Count' as check_type, COUNT(*)::text as value FROM pg_policies WHERE tablename = 'chat_messages'; >> temp_diagnostic.sql
echo SELECT 'Messages Count' as check_type, COUNT(*)::text as value FROM chat_messages WHERE conversation_id = '1e1748f0-2ad0-4cf2-8ee9-974e52046bb3'; >> temp_diagnostic.sql
echo SELECT 'Latest Message' as check_type, content, created_at::text FROM chat_messages WHERE conversation_id = '1e1748f0-2ad0-4cf2-8ee9-974e52046bb3' ORDER BY created_at DESC LIMIT 1; >> temp_diagnostic.sql

echo [2/4] Abrindo arquivo de teste no navegador...
start "" "TEST_CHAT_DIRECT.html"

echo.
echo [3/4] INSTRUCOES:
echo.
echo 1. Faca login no portal se ainda nao estiver logado
echo 2. Verifique a pagina TEST_CHAT_DIRECT.html que abriu
echo 3. Veja se as mensagens aparecem
echo.
echo [4/4] Aguardando... (Pressione qualquer tecla apos verificar)
pause > nul

echo.
echo ========================================
echo  PROXIMOS PASSOS
echo ========================================
echo.
echo SE MENSAGENS APARECERAM:
echo   - Problema no componente FloatingChat
echo   - Execute: code src\components\Chat\FloatingChat.tsx
echo.
echo SE MENSAGENS NAO APARECERAM:
echo   - Problema no RLS ou Auth
echo   - Abra o console (F12) e execute os testes manuais
echo   - Veja CHAT-SOLUCAO-FINAL.md para mais detalhes
echo.
echo ========================================

REM Limpar arquivo temporário
if exist temp_diagnostic.sql del temp_diagnostic.sql

pause
