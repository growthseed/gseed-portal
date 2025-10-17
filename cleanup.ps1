# Script de Limpeza - Gseed Portal
# Remove arquivos que não fazem parte do projeto

Write-Host "🗑️  Iniciando limpeza de arquivos..." -ForegroundColor Yellow

# Diretórios para remover
$directories = @(
    "src\components\Avaliacoes",
    "src\components\beneficiarios"
)

# Arquivos para remover  
$files = @(
    "src\components\DatePicker.tsx",
    "src\pages\Beneficiaries.tsx",
    "src\pages\BeneficiaryDetail.tsx",
    "src\pages\BeneficiariosPage.tsx",
    "src\pages\MentorDetail.tsx",
    "src\pages\Mentors.tsx",
    "src\pages\ContentLibrary.tsx",
    "src\pages\Reports.tsx",
    "src\pages\Settings.tsx"
)

# Remover diretórios
Write-Host "`n📁 Removendo diretórios..." -ForegroundColor Cyan
foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force
        Write-Host "   ✅ Removido: $dir" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Não encontrado: $dir" -ForegroundColor Yellow
    }
}

# Remover arquivos
Write-Host "`n📄 Removendo arquivos..." -ForegroundColor Cyan
foreach ($file in $files) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "   ✅ Removido: $file" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Não encontrado: $file" -ForegroundColor Yellow
    }
}

Write-Host "`n✨ Limpeza concluída!" -ForegroundColor Green
Write-Host "`n📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. git add ."
Write-Host "   2. git commit -m 'fix: remove arquivos não relacionados ao projeto'"
Write-Host "   3. git push"
Write-Host "   4. npm run build (para testar localmente)" -ForegroundColor Cyan
