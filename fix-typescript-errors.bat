@echo off
echo ========================================
echo Corrigindo erros TypeScript no projeto
echo ========================================
echo.

echo [1/6] SignUpForm.tsx - JA CORRIGIDO
echo.

echo [2/6] Corrigindo useNotifications.ts...
powershell -Command "(Get-Content 'src\hooks\useNotifications.ts') -replace \"case 'new_proposal':\", \"case 'proposal_received':\" | Set-Content 'src\hooks\useNotifications.ts'"
echo      OK - Tipo de notificacao corrigido
echo.

echo [3/6] Corrigindo Perfil.tsx...
powershell -Command "$content = Get-Content 'src\pages\Perfil.tsx' -Raw; $content = $content -replace 'professionCategories\.map\(cat =>', 'Object.entries(professionCategories).map(([catName, cat]) =>'; $content = $content -replace '\.find\(c => c\.name === profile\.category\)', '.find(([name]) => name === profile.category)?.[1]'; $content = $content -replace 'currentImages=', 'currentImageUrls='; Set-Content 'src\pages\Perfil.tsx' -Value $content"
echo      OK - professionCategories corrigido
echo.

echo [4/6] Corrigindo VerifyEmail.tsx...
powershell -Command "$content = Get-Content 'src\pages\VerifyEmail.tsx' -Raw; $content = $content -replace \"disabled=\{!userEmail \|\| status === 'loading'\}\", \"disabled={!userEmail || status === 'waiting'}\"; $content = $content -replace \"\{status === 'loading' \? \(\", \"{status === 'waiting' ? (\"; Set-Content 'src\pages\VerifyEmail.tsx' -Value $content"
echo      OK - Comparacao de status corrigida
echo.

echo [5/6] Corrigindo chatService.ts...
powershell -Command "$content = Get-Content 'src\services\chatService.ts' -Raw; $content = $content -replace \"return Array\.isArray\(\[\s*supabase[\s\S]*?\]\) \? data\.length : 0;\", \"const { data, error } = await supabase.from('conversations').select('id', { count: 'exact', head: true }).or(\`participant_1_id.eq.\${userId},participant_2_id.eq.\${userId}\`); if (error) throw error; return data?.length || 0;\"; Set-Content 'src\services\chatService.ts' -Value $content"
echo      OK - Query SQL corrigida
echo.

echo [6/6] Verificando build...
call npm run build:check

echo.
echo ========================================
echo Correcoes finalizadas!
echo ========================================
pause
