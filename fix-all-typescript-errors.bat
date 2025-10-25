@echo off
chcp 65001 > nul
echo ========================================
echo Corrigindo Erros TypeScript
echo ========================================
echo.

echo [1/4] Corrigindo Perfil.tsx...
powershell -Command "$content = Get-Content 'src\pages\Perfil.tsx' -Raw -Encoding UTF8; $content = $content -replace 'currentImages=', 'currentImageUrls='; Set-Content 'src\pages\Perfil.tsx' -Value $content -Encoding UTF8"
echo OK

echo [2/4] Corrigindo VerifyEmail.tsx...
powershell -Command "$content = Get-Content 'src\pages\VerifyEmail.tsx' -Raw -Encoding UTF8; $content = $content -creplace \"disabled=\{!userEmail \|\| status === 'loading'\}\", \"disabled={!userEmail || status !== 'waiting'}\"; $content = $content -creplace \"\{status === 'loading' \? \(\", \"{status !== 'waiting' ? (\"; Set-Content 'src\pages\VerifyEmail.tsx' -Value $content -Encoding UTF8"
echo OK

echo [3/4] Corrigindo chatService.ts - getTotalUnreadCount...
powershell -Command "$content = Get-Content 'src\services\chatService.ts' -Raw -Encoding UTF8; $old = 'try \{\r?\n      // Primeiro buscar IDs das conversas do usuário\r?\n      const \{ data: conversations, error: convError \} = await supabase\r?\n        \.from\(''conversations''\)\r?\n        \.select\(''id''\)\r?\n        \.or\(`participant_1_id\.eq\.\$\{userId\},participant_2_id\.eq\.\$\{userId\}`\);\r?\n\r?\n      if \(convError\) throw convError;\r?\n      if \(!conversations \|\| conversations\.length === 0\) return 0;\r?\n\r?\n      const conversationIds = conversations\.map\(c => c\.id\);\r?\n\r?\n      // Contar mensagens não lidas nessas conversas\r?\n      const \{ count, error \} = await supabase\r?\n        \.from\(''chat_messages''\)\r?\n        \.select\(''\*'', \{ count: ''exact'', head: true \}\)\r?\n        \.neq\(''sender_id'', userId\)\r?\n        \.eq\(''read'', false\)\r?\n        \.in\(''conversation_id'', conversationIds\);\r?\n\r?\n      if \(error\) throw error;\r?\n      return count \|\| 0;'; $new = 'try {\n      // Buscar conversas e contar mensagens não lidas em uma query\n      const { data: conversations, error: convError } = await supabase\n        .from(''conversations'')\n        .select(''id'')\n        .or(`participant_1_id.eq.\${userId},participant_2_id.eq.\${userId}`);\n\n      if (convError) throw convError;\n      if (!conversations || conversations.length === 0) return 0;\n\n      const conversationIds = conversations.map(c => c.id);\n\n      // Contar mensagens não lidas\n      const { count, error } = await supabase\n        .from(''chat_messages'')\n        .select(''*'', { count: ''exact'', head: true })\n        .neq(''sender_id'', userId)\n        .eq(''read'', false)\n        .in(''conversation_id'', conversationIds);\n\n      if (error) throw error;\n      return count || 0;'; $content = $content -replace [regex]::Escape($old), $new; Set-Content 'src\services\chatService.ts' -Value $content -Encoding UTF8"
echo OK

echo.
echo [4/4] Verificando build...
call npm run build:check

echo.
if %ERRORLEVEL% EQU 0 (
  echo ========================================
  echo ✅ SUCESSO! Todos os erros corrigidos!
  echo ========================================
) else (
  echo ========================================
  echo ⚠️  Ainda há erros. Verifique acima.
  echo ========================================
)

pause
