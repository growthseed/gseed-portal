# GSEED Portal - Deploy Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   GSEED PORTAL - DEPLOY TO VERCEL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Mudar para o diretório do projeto
Set-Location "C:\Users\EFEITO DIGITAL\gseed-portal"

Write-Host "[1/5] Verificando status do Git..." -ForegroundColor Yellow
git status --short
Write-Host ""

Write-Host "[2/5] Adicionando arquivos modificados..." -ForegroundColor Yellow
git add src/types/database.types.ts
git add src/services/avaliacaoService.ts
git add src/components/Chat/FloatingChat.tsx
Write-Host "✓ Arquivos adicionados" -ForegroundColor Green
Write-Host ""

Write-Host "[3/5] Criando commit..." -ForegroundColor Yellow
$commitMessage = @"
fix: corrigir erros TypeScript no build

- Adicionar tipo ChatMessage exportado em database.types.ts
- Corrigir mapeamento de profiles em avaliacaoService.ts
- Adicionar suporte para campos read e is_read em ChatMessage
- Garantir compatibilidade total com FloatingChat component

Resolvidos 4 erros de compilação TypeScript:
✅ FloatingChat.tsx - ChatMessage type not found
✅ avaliacaoService.ts - Property access errors
"@

git commit -m $commitMessage
Write-Host "✓ Commit criado" -ForegroundColor Green
Write-Host ""

Write-Host "[4/5] Enviando para GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Push realizado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "[5/5] Deploy iniciado!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "O Vercel detectará automaticamente o push e iniciará o deploy." -ForegroundColor Cyan
    Write-Host "Acompanhe o progresso em: https://vercel.com/growthseed/gseed-portal" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✗ Erro ao fazer push!" -ForegroundColor Red
    Write-Host "Verifique sua conexão e tente novamente." -ForegroundColor Red
}

Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
