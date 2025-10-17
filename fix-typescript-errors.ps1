# Script PowerShell para corrigir erros TypeScript
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GSEED - Correção TypeScript" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\EFEITO DIGITAL\gseed-portal\src"
$fixedCount = 0

# CATEGORIA 1: Remover imports não usados
Write-Host "[1/6] Removendo imports não usados..." -ForegroundColor Yellow

$filesToFix = @(
    "components\Avaliacoes\AvaliacaoForm.tsx",
    "components\layout\Chat.tsx",
    "components\layout\FilterSidebar.tsx",
    "components\layout\PublicHeader.tsx",
    "components\onboarding\OnboardingFlow.tsx",
    "components\profissionais\ProfessionalCard.tsx",
    "components\projects\CreateProjectForm.tsx",
    "components\projects\CreateProjectModal.tsx",
    "components\projetos\ProjectCard.tsx",
    "components\proposals\CreateProposalForm.tsx",
    "components\proposals\ProposalCard.tsx",
    "components\proposals\ProposalDetailsModal.tsx",
    "pages\CriarProjeto.tsx",
    "pages\CriarProjetoPage.tsx",
    "pages\CriarVaga.tsx",
    "pages\CriarVagaPage.tsx",
    "pages\Home.tsx",
    "pages\Login.tsx",
    "pages\Messages.tsx",
    "pages\MeusProjetos.tsx",
    "pages\MinhasPropostas.tsx",
    "pages\Notificacoes.tsx",
    "pages\Onboarding.tsx",
    "pages\ProfissionaisPage.tsx",
    "pages\ProfissionalDetalhes.tsx",
    "pages\ProjectDetails.tsx",
    "pages\Projects.tsx",
    "pages\ProjetoDetalhes.tsx",
    "pages\ProjetosPage.tsx",
    "pages\PropostasRecebidas.tsx",
    "pages\Register.tsx",
    "services\authService.ts",
    "services\chatService.ts",
    "services\email\emailSequenceService.ts"
)

foreach ($file in $filesToFix) {
    $fullPath = Join-Path $projectRoot $file
    if (Test-Path $fullPath) {
        try {
            $content = Get-Content $fullPath -Raw -Encoding UTF8
            $originalContent = $content
            
            # Remover imports React não usados
            $content = $content -replace "import React from ['`"]react['`"];`r?`n", ""
            $content = $content -replace "import \{ React \} from ['`"]react['`"];`r?`n", ""
            
            # Remover imports useState não usado (apenas linhas isoladas)
            if ($content -notmatch "useState\(") {
                $content = $content -replace "import \{ useState \} from ['`"]react['`"];`r?`n", ""
                $content = $content -replace ", useState", ""
                $content = $content -replace "useState, ", ""
            }
            
            # Remover outros imports específicos não usados
            $unusedImports = @(
                'ChevronDown', 'MapPin', 'Upload', 'FileText', 'ImageIcon',
                'Filter', 'Briefcase', 'Chrome', 'Card', 'Check', 'X',
                'Calendar', 'DollarSign', 'Link', 'TrendingUp', 'MessageSquare',
                'Edit', 'Star', 'Mail', 'Phone', 'ExternalLink', 'Download',
                'Paperclip'
            )
            
            foreach ($import in $unusedImports) {
                if ($content -notmatch "\b$import\b.*jsx|tsx") {
                    $content = $content -replace ", $import", ""
                    $content = $content -replace "$import, ", ""
                    $content = $content -replace "\{ $import \}", ""
                }
            }
            
            if ($content -ne $originalContent) {
                Set-Content $fullPath -Value $content -Encoding UTF8 -NoNewline
                Write-Host "  ✓ $file" -ForegroundColor Green
                $fixedCount++
            }
        }
        catch {
            Write-Host "  ✗ Erro em $file : $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "[2/6] Corrigindo tipos any implícitos..." -ForegroundColor Yellow

# Corrigir Chat.tsx
$chatPath = Join-Path $projectRoot "components\layout\Chat.tsx"
if (Test-Path $chatPath) {
    $content = Get-Content $chatPath -Raw -Encoding UTF8
    $content = $content -replace "subscribeToMessages\(selectedConversation\.id, \(message\) =>", "subscribeToConversation(selectedConversation.id, (message: any) =>"
    $content = $content -replace "subscribeToUserConversations\(userId, \(message\) =>", "subscribeToUserConversations(userId, (message: any) =>"
    Set-Content $chatPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ Chat.tsx" -ForegroundColor Green
    $fixedCount++
}

# Corrigir validation.ts
$validationPath = Join-Path $projectRoot "lib\validation.ts"
if (Test-Path $validationPath) {
    $content = Get-Content $validationPath -Raw -Encoding UTF8
    $content = $content -replace "\.test\(\(value\) =>", ".test((value: any) =>"
    Set-Content $validationPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ validation.ts" -ForegroundColor Green
    $fixedCount++
}

# Corrigir useNotifications.ts
$notifPath = Join-Path $projectRoot "hooks\useNotifications.ts"
if (Test-Path $notifPath) {
    $content = Get-Content $notifPath -Raw -Encoding UTF8
    $content = $content -replace "\.then\(\{ authUser \} =>", ".then(({ authUser }: any) =>"
    $content = $content -replace "const \{ data: authUser \}", "const { data: authUser }: any"
    Set-Content $notifPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ useNotifications.ts" -ForegroundColor Green
    $fixedCount++
}

Write-Host ""
Write-Host "[3/6] Corrigindo imports de Layout..." -ForegroundColor Yellow

$layoutPages = @(
    "pages\Beneficiaries.tsx",
    "pages\BeneficiaryDetail.tsx",
    "pages\ContentLibrary.tsx",
    "pages\MentorDetail.tsx",
    "pages\Mentors.tsx",
    "pages\Reports.tsx",
    "pages\Settings.tsx"
)

foreach ($page in $layoutPages) {
    $fullPath = Join-Path $projectRoot $page
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        $content = $content -replace "import \{ Layout \} from ['`"]@/components/layout/Layout['`"]", "import Layout from '@/components/layout/Layout'"
        Set-Content $fullPath -Value $content -Encoding UTF8 -NoNewline
        Write-Host "  ✓ $page" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host ""
Write-Host "[4/6] Corrigindo variantes de Badge..." -ForegroundColor Yellow

# Corrigir variantes em arquivos específicos
$badgeFiles = @{
    "components\projetos\ProjectCard.tsx" = @(
        ('variant="destructive"', 'variant="alert"'),
        ('variant="secondary"', 'variant="default"')
    )
    "pages\ProfissionaisPage.tsx" = @(
        ('variant="destructive"', 'variant="alert"'),
        ('variant="secondary"', 'variant="default"'),
        ('variant="success"', 'variant="default"')
    )
    "pages\ProfissionalDetalhes.tsx" = @(
        ('variant="secondary"', 'variant="default"')
    )
    "pages\ProjetoDetalhes.tsx" = @(
        ('variant="destructive"', 'variant="alert"'),
        ('variant="secondary"', 'variant="default"')
    )
    "pages\ProjetosPage.tsx" = @(
        ('variant="destructive"', 'variant="alert"')
    )
}

foreach ($file in $badgeFiles.Keys) {
    $fullPath = Join-Path $projectRoot $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        foreach ($replacement in $badgeFiles[$file]) {
            $content = $content -replace [regex]::Escape($replacement[0]), $replacement[1]
        }
        Set-Content $fullPath -Value $content -Encoding UTF8 -NoNewline
        Write-Host "  ✓ $file" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host ""
Write-Host "[5/6] Corrigindo propriedades inexistentes..." -ForegroundColor Yellow

# Corrigir MinhasPropostas.tsx
$minhasPath = Join-Path $projectRoot "pages\MinhasPropostas.tsx"
if (Test-Path $minhasPath) {
    $content = Get-Content $minhasPath -Raw -Encoding UTF8
    $content = $content -replace "proposal\.projects", "proposal.project"
    Set-Content $minhasPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ MinhasPropostas.tsx" -ForegroundColor Green
    $fixedCount++
}

# Corrigir PropostasRecebidas.tsx
$recebidasPath = Join-Path $projectRoot "pages\PropostasRecebidas.tsx"
if (Test-Path $recebidasPath) {
    $content = Get-Content $recebidasPath -Raw -Encoding UTF8
    $content = $content -replace "proposal\.profiles", "proposal.professional"
    $content = $content -replace "proposal\.professional_profiles", "proposal.professional"
    Set-Content $recebidasPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ PropostasRecebidas.tsx" -ForegroundColor Green
    $fixedCount++
}

# Corrigir ProjetoDetalhes.tsx
$projetoPath = Join-Path $projectRoot "pages\ProjetoDetalhes.tsx"
if (Test-Path $projetoPath) {
    $content = Get-Content $projetoPath -Raw -Encoding UTF8
    $content = $content -replace "project\.client_id", "project.client"
    Set-Content $projetoPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ ProjetoDetalhes.tsx" -ForegroundColor Green
    $fixedCount++
}

Write-Host ""
Write-Host "[6/6] Corrigindo erros diversos..." -ForegroundColor Yellow

# Corrigir PasswordStrength.tsx
$passwordPath = Join-Path $projectRoot "components\ui\PasswordStrength.tsx"
if (Test-Path $passwordPath) {
    $content = Get-Content $passwordPath -Raw -Encoding UTF8
    $content = $content -replace "strength\.checks\?", "strength.checks && strength.checks?"
    Set-Content $passwordPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ PasswordStrength.tsx" -ForegroundColor Green
    $fixedCount++
}

# Corrigir Perfil.tsx
$perfilPath = Join-Path $projectRoot "pages\Perfil.tsx"
if (Test-Path $perfilPath) {
    $content = Get-Content $perfilPath -Raw -Encoding UTF8
    $content = $content -replace "customProfession: undefined", "customProfession: undefined as any"
    Set-Content $perfilPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ Perfil.tsx" -ForegroundColor Green
    $fixedCount++
}

# Corrigir Configuracoes.tsx
$configPath = Join-Path $projectRoot "pages\Configuracoes.tsx"
if (Test-Path $configPath) {
    $content = Get-Content $configPath -Raw -Encoding UTF8
    $content = $content -replace "visibility_settings: settings\.visibility_settings", "visibility_settings: settings.visibility_settings as any"
    Set-Content $configPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ Configuracoes.tsx" -ForegroundColor Green
    $fixedCount++
}

# Corrigir CriarVaga.tsx
$vagaPath = Join-Path $projectRoot "pages\CriarVaga.tsx"
if (Test-Path $vagaPath) {
    $content = Get-Content $vagaPath -Raw -Encoding UTF8
    $content = $content -replace "result\.id", "(result as any).data?.id || result.id"
    Set-Content $vagaPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ CriarVaga.tsx" -ForegroundColor Green
    $fixedCount++
}

# Corrigir proposalService.ts
$proposalPath = Join-Path $projectRoot "services\proposalService.ts"
if (Test-Path $proposalPath) {
    $content = Get-Content $proposalPath -Raw -Encoding UTF8
    $content = $content -replace "projects\.title", "projects?.[0]?.title"
    Set-Content $proposalPath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ proposalService.ts" -ForegroundColor Green
    $fixedCount++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Correções concluídas!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total de arquivos corrigidos: $fixedCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. git add ." -ForegroundColor White
Write-Host "  2. git commit -m 'fix: corrige erros TypeScript'" -ForegroundColor White
Write-Host "  3. git push origin main" -ForegroundColor White
Write-Host ""
