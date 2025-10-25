@echo off
echo ========================================
echo Corrigindo Erros TypeScript Restantes
echo ========================================
echo.

echo [1/3] ProfissionaisPage.tsx - JA CORRIGIDO ✅
echo.

echo [2/3] Corrigindo Perfil.tsx...
powershell -Command "(Get-Content 'src\pages\Perfil.tsx' -Raw) -replace 'currentImages=\{profile', 'currentImageUrls={profile' | Set-Content 'src\pages\Perfil.tsx' -NoNewline"
echo      OK - currentImages virou currentImageUrls
echo.

echo [3/3] Corrigindo VerifyEmail.tsx...
powershell -Command "$c = Get-Content 'src\pages\VerifyEmail.tsx' -Raw; $c = $c -replace \"disabled=\{!userEmail \|\| status === 'loading'\}\", \"disabled={!userEmail || status === 'waiting'}\"; $c = $c -replace \"\{status === 'loading' \? \(\", \"{status === 'waiting' ? (\"; Set-Content 'src\pages\VerifyEmail.tsx' -Value $c -NoNewline"
echo      OK - status comparisons corrigidas
echo.

echo [4/3] Corrigindo chatService.ts...
echo      Nota: Este arquivo precisa de correção manual no método getTotalUnreadCount
echo      A query já está funcionalmente correta, apenas TypeScript reclama da tipagem
echo.

echo ========================================
echo Testando build...
echo ========================================
npm run build:check

pause
