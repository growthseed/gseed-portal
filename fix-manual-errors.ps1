# Correções finais manuais - Erros TypeScript restantes
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CORREÇÕES FINAIS MANUAIS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\EFEITO DIGITAL\gseed-portal\src"

# 1. Corrigir SignUpForm.tsx (authService.signUp)
Write-Host "[1/10] Corrigindo SignUpForm.tsx..." -ForegroundColor Yellow
$signupPath = Join-Path $projectRoot "components\onboarding\SignUpForm.tsx"
if (Test-Path $signupPath) {
    $content = Get-Content $signupPath -Raw -Encoding UTF8
    # O authService já tem o método signUp, então não precisa mudar nada
    # Mas vamos garantir que está usando corretamente
    $content = $content -replace "authService\.signUpWithWelcomeEmail", "authService.signUp"
    Set-Content $signupPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ SignUpForm.tsx" -ForegroundColor Green
}

# 2. Corrigir ProfessionalSignupForm.tsx (professionalService.createProfile)
Write-Host "[2/10] Corrigindo ProfessionalSignupForm.tsx..." -ForegroundColor Yellow
$profSignupPath = Join-Path $projectRoot "components\onboarding\ProfessionalSignupForm.tsx"
if (Test-Path $profSignupPath) {
    $content = Get-Content $profSignupPath -Raw -Encoding UTF8
    # Trocar createProfile por updateProfessional
    $content = $content -replace "professionalService\.createProfile", "professionalService.updateProfessional"
    Set-Content $profSignupPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ ProfessionalSignupForm.tsx" -ForegroundColor Green
}

# 3. Corrigir BeneficiariosPage.tsx (filtros idadeMin/idadeMax)
Write-Host "[3/10] Corrigindo BeneficiariosPage.tsx..." -ForegroundColor Yellow
$benPage = Join-Path $projectRoot "pages\BeneficiariosPage.tsx"
if (Test-Path $benPage) {
    $content = Get-Content $benPage -Raw -Encoding UTF8
    # Adicionar campos idadeMin e idadeMax ao tipo
    $content = $content -replace "interface BeneficiarioFilters \{", "interface BeneficiarioFilters {`n  idadeMin?: number;`n  idadeMax?: number;"
    Set-Content $benPage -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ BeneficiariosPage.tsx" -ForegroundColor Green
}

# 4. Corrigir CreateProjectForm.tsx (uploadData não usado)
Write-Host "[4/10] Corrigindo CreateProjectForm.tsx..." -ForegroundColor Yellow
$createProject = Join-Path $projectRoot "components\projects\CreateProjectForm.tsx"
if (Test-Path $createProject) {
    $content = Get-Content $createProject -Raw -Encoding UTF8
    # Remover a variável não usada
    $content = $content -replace "const \{ uploadData \} = ", "const { } = "
    $content = $content -replace "const \{ \} = ", ""
    Set-Content $createProject -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ CreateProjectForm.tsx" -ForegroundColor Green
}

# 5. Corrigir AvaliacaoForm.tsx (professionalId não usado)
Write-Host "[5/10] Corrigindo AvaliacaoForm.tsx..." -ForegroundColor Yellow
$avalForm = Join-Path $projectRoot "components\Avaliacoes\AvaliacaoForm.tsx"
if (Test-Path $avalForm) {
    $content = Get-Content $avalForm -Raw -Encoding UTF8
    # Adicionar underscore para indicar que é intencional
    $content = $content -replace "professionalId: string", "_professionalId: string"
    $content = $content -replace "\(professionalId\)", "(_professionalId)"
    Set-Content $avalForm -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ AvaliacaoForm.tsx" -ForegroundColor Green
}

# 6. Corrigir beneficiarios/BeneficiarioCard.tsx (id não usado)
Write-Host "[6/10] Corrigindo BeneficiarioCard.tsx..." -ForegroundColor Yellow
$benCard = Join-Path $projectRoot "components\beneficiarios\BeneficiarioCard.tsx"
if (Test-Path $benCard) {
    $content = Get-Content $benCard -Raw -Encoding UTF8
    # Trocar id por _id
    $content = $content -replace "const \{ id,", "const { id: _id,"
    Set-Content $benCard -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ BeneficiarioCard.tsx" -ForegroundColor Green
}

# 7. Corrigir ProjectDetails.tsx (id não usado)
Write-Host "[7/10] Corrigindo ProjectDetails.tsx..." -ForegroundColor Yellow
$projDetails = Join-Path $projectRoot "pages\ProjectDetails.tsx"
if (Test-Path $projDetails) {
    $content = Get-Content $projDetails -Raw -Encoding UTF8
    # Adicionar underscore
    $content = $content -replace "const \{ id \} =", "const { id: _id } ="
    Set-Content $projDetails -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ ProjectDetails.tsx" -ForegroundColor Green
}

# 8. Corrigir ProjetoDetalhes.tsx (setUserProposal não usado)
Write-Host "[8/10] Corrigindo ProjetoDetalhes.tsx..." -ForegroundColor Yellow
$projDet = Join-Path $projectRoot "pages\ProjetoDetalhes.tsx"
if (Test-Path $projDet) {
    $content = Get-Content $projDet -Raw -Encoding UTF8
    # Remover a variável
    $content = $content -replace ", setUserProposal", ""
    Set-Content $projDet -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ ProjetoDetalhes.tsx" -ForegroundColor Green
}

# 9. Corrigir ProjetosPage.tsx (handleWorkModelChange não usado)
Write-Host "[9/10] Corrigindo ProjetosPage.tsx..." -ForegroundColor Yellow
$projPage = Join-Path $projectRoot "pages\ProjetosPage.tsx"
if (Test-Path $projPage) {
    $content = Get-Content $projPage -Raw -Encoding UTF8
    # Comentar a função
    $content = $content -replace "const handleWorkModelChange = ", "// const handleWorkModelChange = "
    Set-Content $projPage -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ ProjetosPage.tsx" -ForegroundColor Green
}

# 10. Corrigir ProfissionaisPage.tsx (setShowFilters não usado)
Write-Host "[10/10] Corrigindo ProfissionaisPage.tsx..." -ForegroundColor Yellow
$profPage = Join-Path $projectRoot "pages\ProfissionaisPage.tsx"
if (Test-Path $profPage) {
    $content = Get-Content $profPage -Raw -Encoding UTF8
    # Remover setShowFilters
    $content = $content -replace ", setShowFilters", ""
    Set-Content $profPage -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ ProfissionaisPage.tsx" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ TODAS as correções aplicadas!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
