# ================================================
# SCRIPT DE DEPLOY - GSEED PORTAL PRODUCAO
# Execute estes comandos no PowerShell
# ================================================

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY GSEED PORTAL - PRODUCAO" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
Set-Location "C:\Users\EFEITO DIGITAL\gseed-portal"

# ================================================
# PASSO 1: Deploy da Edge Function
# ================================================
Write-Host "[1/5] Deployando Edge Function brevo-proxy..." -ForegroundColor Yellow
Write-Host ""

supabase functions deploy brevo-proxy --no-verify-jwt

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Edge Function deployada com sucesso!" -ForegroundColor Green
} else {
    Write-Host "ERRO: Falha ao deployar Edge Function!" -ForegroundColor Red
    Write-Host "Verifique se o Supabase CLI esta instalado: npm install -g supabase" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""

# ================================================
# PASSO 2: Verificar Secrets
# ================================================
Write-Host "[2/5] Verificando secrets do Supabase..." -ForegroundColor Yellow
Write-Host ""

supabase secrets list

Write-Host ""
Write-Host "Verificando se BREVO_API_KEY existe..." -ForegroundColor Yellow

$secretsList = supabase secrets list 2>&1
if ($secretsList -match "BREVO_API_KEY") {
    Write-Host "OK BREVO_API_KEY ja configurada!" -ForegroundColor Green
} else {
    Write-Host "ATENCAO: BREVO_API_KEY nao encontrada!" -ForegroundColor Red
    Write-Host "Configurando agora..." -ForegroundColor Yellow
    
    $apiKey = "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"
    supabase secrets set BREVO_API_KEY="$apiKey"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK BREVO_API_KEY configurada com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "ERRO ao configurar secret!" -ForegroundColor Red
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
    Write-Host "Cache anterior removido" -ForegroundColor Gray
}

npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Build concluido com sucesso!" -ForegroundColor Green
} else {
    Write-Host "ERRO: Falha no build!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""

# ================================================
# PASSO 4: Verificacoes
# ================================================
Write-Host "[4/5] Executando verificacoes..." -ForegroundColor Yellow
Write-Host ""

# Verificar se dist existe
if (Test-Path "dist/index.html") {
    Write-Host "OK Pasta dist/ criada com sucesso" -ForegroundColor Green
} else {
    Write-Host "ERRO: Pasta dist/ nao foi criada!" -ForegroundColor Red
    exit 1
}

# Verificar tamanho do build
$distSize = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Tamanho do build: $([math]::Round($distSize, 2)) MB" -ForegroundColor Gray

Write-Host ""

# ================================================
# PASSO 5: Instrucoes Finais
# ================================================
Write-Host "[5/5] Proximos passos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "OK Edge Function deployada" -ForegroundColor Green
Write-Host "OK Secrets configurados" -ForegroundColor Green
Write-Host "OK Build de producao criado (pasta dist/)" -ForegroundColor Green
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  ESCOLHA COMO FAZER O DEPLOY:" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPCAO A - Deploy via Vercel (Recomendado):" -ForegroundColor Yellow
Write-Host "  1. Instalar Vercel CLI: npm install -g vercel" -ForegroundColor White
Write-Host "  2. Deploy: vercel --prod" -ForegroundColor White
Write-Host "  3. Configurar variaveis de ambiente no painel" -ForegroundColor White
Write-Host ""
Write-Host "OPCAO B - Deploy via Git:" -ForegroundColor Yellow
Write-Host "  1. git add ." -ForegroundColor White
Write-Host "  2. git commit -m 'Deploy: Correcoes CORS producao'" -ForegroundColor White
Write-Host "  3. git push origin main" -ForegroundColor White
Write-Host "  (Deploy automatico se conectado ao Vercel/Netlify)" -ForegroundColor Gray
Write-Host ""
Write-Host "OPCAO C - Deploy Manual:" -ForegroundColor Yellow
Write-Host "  1. Fazer upload da pasta dist/ para seu servidor" -ForegroundColor White
Write-Host "  2. Configurar servidor web (nginx/apache)" -ForegroundColor White
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "VARIAVEIS DE AMBIENTE PARA CONFIGURAR:" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "VITE_SUPABASE_URL=https://xnwnwvhoulxxzxtxqmbr.supabase.co" -ForegroundColor White
Write-Host "VITE_SUPABASE_ANON_KEY=eyJhbGci..." -ForegroundColor White
Write-Host "VITE_SITE_URL=https://portal.gseed.com.br" -ForegroundColor White
Write-Host "VITE_OAUTH_REDIRECT_URL=https://portal.gseed.com.br/auth/callback" -ForegroundColor White
Write-Host "VITE_CLOUDINARY_CLOUD_NAME=dsgqx6ouw" -ForegroundColor White
Write-Host "VITE_CLOUDINARY_API_KEY=372535993552577" -ForegroundColor White
Write-Host "VITE_CLOUDINARY_API_SECRET=wuosPqmpCfUgmiZa5YOvJWTlya8" -ForegroundColor White
Write-Host "VITE_CLOUDINARY_UPLOAD_PRESET=gseed_uploads" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANTE: NAO adicionar VITE_BREVO_API_KEY no Vercel!" -ForegroundColor Red
Write-Host "Ela ja esta configurada no Supabase Secrets" -ForegroundColor Yellow
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY LOCAL CONCLUIDO!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentacao completa: DEPLOY-GUIA-PRODUCAO.md" -ForegroundColor Gray
Write-Host ""

pause
