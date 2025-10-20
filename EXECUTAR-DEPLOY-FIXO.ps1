# ================================================
# SCRIPT DE DEPLOY - GSEED PORTAL PRODUCAO (VERSAO FIXA)
# Execute este script que usa npx para garantir funcionamento
# ================================================

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY GSEED PORTAL - PRODUCAO" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
Set-Location "C:\Users\EFEITO DIGITAL\gseed-portal"

# ================================================
# PASSO 0: Verificar Node e NPM
# ================================================
Write-Host "[0/5] Verificando requisitos..." -ForegroundColor Yellow
Write-Host ""

$nodeVersion = node --version 2>&1
$npmVersion = npm --version 2>&1

if ($nodeVersion -match "v\d+") {
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Instale Node.js em: https://nodejs.org" -ForegroundColor Yellow
    pause
    exit 1
}

if ($npmVersion -match "\d+") {
    Write-Host "✓ NPM instalado: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ NPM não encontrado!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""

# ================================================
# PASSO 1: Deploy da Edge Function
# ================================================
Write-Host "[1/5] Deployando Edge Function brevo-proxy..." -ForegroundColor Yellow
Write-Host "Usando npx para garantir compatibilidade..." -ForegroundColor Gray
Write-Host ""

# Usar npx em vez de comando direto
npx supabase functions deploy brevo-proxy --no-verify-jwt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Edge Function deployada com sucesso!" -ForegroundColor Green
} else {
    Write-Host "✗ ERRO: Falha ao deployar Edge Function!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis causas:" -ForegroundColor Yellow
    Write-Host "1. Não está logado no Supabase - Execute: npx supabase login" -ForegroundColor White
    Write-Host "2. Projeto não linkado - Execute: npx supabase link --project-ref xnwnwvhoulxxzxtxqmbr" -ForegroundColor White
    Write-Host "3. Arquivo da função não existe - Verifique: supabase/functions/brevo-proxy/index.ts" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

Write-Host ""

# ================================================
# PASSO 2: Verificar Secrets
# ================================================
Write-Host "[2/5] Verificando secrets do Supabase..." -ForegroundColor Yellow
Write-Host ""

npx supabase secrets list

Write-Host ""
Write-Host "Verificando se BREVO_API_KEY existe..." -ForegroundColor Yellow

$secretsList = npx supabase secrets list 2>&1 | Out-String
if ($secretsList -match "BREVO_API_KEY") {
    Write-Host "✓ BREVO_API_KEY já configurada!" -ForegroundColor Green
} else {
    Write-Host "⚠ BREVO_API_KEY não encontrada!" -ForegroundColor Red
    Write-Host "Configurando agora..." -ForegroundColor Yellow
    
    $apiKey = "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"
    npx supabase secrets set BREVO_API_KEY="$apiKey"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ BREVO_API_KEY configurada com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "✗ ERRO ao configurar secret!" -ForegroundColor Red
    }
}

Write-Host ""

# ================================================
# PASSO 3: Build de Producao
# ================================================
Write-Host "[3/5] Fazendo build de producao..." -ForegroundColor Yellow
Write-Host ""

# Limpar cache anterior
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✓ Cache anterior removido" -ForegroundColor Gray
}

npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build concluído com sucesso!" -ForegroundColor Green
} else {
    Write-Host "✗ ERRO: Falha no build!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""

# ================================================
# PASSO 4: Verificacoes
# ================================================
Write-Host "[4/5] Executando verificações..." -ForegroundColor Yellow
Write-Host ""

# Verificar se dist existe
if (Test-Path "dist/index.html") {
    Write-Host "✓ Pasta dist/ criada com sucesso" -ForegroundColor Green
} else {
    Write-Host "✗ ERRO: Pasta dist/ não foi criada!" -ForegroundColor Red
    exit 1
}

# Verificar tamanho do build
$distSize = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "✓ Tamanho do build: $([math]::Round($distSize, 2)) MB" -ForegroundColor Gray

Write-Host ""

# ================================================
# PASSO 5: Instrucoes Finais
# ================================================
Write-Host "[5/5] Próximos passos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "✓ Edge Function deployada" -ForegroundColor Green
Write-Host "✓ Secrets configurados" -ForegroundColor Green
Write-Host "✓ Build de produção criado (pasta dist/)" -ForegroundColor Green
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  ESCOLHA COMO FAZER O DEPLOY:" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPÇÃO A - Deploy via Vercel CLI (Recomendado):" -ForegroundColor Yellow
Write-Host "  1. npm install -g vercel" -ForegroundColor White
Write-Host "  2. vercel --prod" -ForegroundColor White
Write-Host "  3. Configurar variáveis de ambiente no painel" -ForegroundColor White
Write-Host ""
Write-Host "OPÇÃO B - Deploy via Git + Vercel/Netlify:" -ForegroundColor Yellow
Write-Host "  1. git add ." -ForegroundColor White
Write-Host "  2. git commit -m 'Deploy: Correções CORS produção'" -ForegroundColor White
Write-Host "  3. git push origin main" -ForegroundColor White
Write-Host "  (Deploy automático se conectado ao Vercel/Netlify)" -ForegroundColor Gray
Write-Host ""
Write-Host "OPÇÃO C - Deploy Manual:" -ForegroundColor Yellow
Write-Host "  1. Fazer upload da pasta dist/ para seu servidor" -ForegroundColor White
Write-Host "  2. Configurar servidor web (nginx/apache)" -ForegroundColor White
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "VARIÁVEIS DE AMBIENTE PARA VERCEL:" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "VITE_SUPABASE_URL=https://xnwnwvhoulxxzxtxqmbr.supabase.co" -ForegroundColor White
Write-Host "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhud253dmhvdWx4eHp4dHhxbWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyODM3NTksImV4cCI6MjA3NDg1OTc1OX0.pkUvsUewzAwI3e-Pl5H0mfNtnEcvPaDX4iji36C4Axw" -ForegroundColor White
Write-Host "VITE_SITE_URL=https://portal.gseed.com.br" -ForegroundColor White
Write-Host "VITE_OAUTH_REDIRECT_URL=https://portal.gseed.com.br/auth/callback" -ForegroundColor White
Write-Host "VITE_CLOUDINARY_CLOUD_NAME=dsgqx6ouw" -ForegroundColor White
Write-Host "VITE_CLOUDINARY_API_KEY=372535993552577" -ForegroundColor White
Write-Host "VITE_CLOUDINARY_API_SECRET=wuosPqmpCfUgmiZa5YOvJWTlya8" -ForegroundColor White
Write-Host "VITE_CLOUDINARY_UPLOAD_PRESET=gseed_uploads" -ForegroundColor White
Write-Host ""
Write-Host "⚠ IMPORTANTE: NÃO adicionar VITE_BREVO_API_KEY no Vercel!" -ForegroundColor Red
Write-Host "Ela já está configurada no Supabase Secrets" -ForegroundColor Yellow
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY LOCAL CONCLUÍDO!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentação completa: DEPLOY-GUIA-PRODUCAO.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🔍 Para testar a Edge Function:" -ForegroundColor Yellow
Write-Host "   npx supabase functions serve brevo-proxy" -ForegroundColor White
Write-Host ""
Write-Host "📊 Para ver logs em produção:" -ForegroundColor Yellow
Write-Host "   npx supabase functions logs brevo-proxy --tail" -ForegroundColor White
Write-Host ""

pause
