# ================================================
# VERIFICADOR DE DEPLOY - GSEED PORTAL
# Testa se tudo esta funcionando corretamente
# ================================================

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  VERIFICADOR DE DEPLOY" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$supabaseUrl = "https://xnwnwvhoulxxzxtxqmbr.supabase.co"
$siteUrl = "https://portal.gseed.com.br"

# ================================================
# Teste 1: Edge Function existe?
# ================================================
Write-Host "[1/4] Verificando Edge Function..." -ForegroundColor Yellow

try {
    $functions = supabase functions list 2>&1 | Out-String
    
    if ($functions -match "brevo-proxy") {
        Write-Host "OK Edge Function 'brevo-proxy' encontrada!" -ForegroundColor Green
    } else {
        Write-Host "ERRO: Edge Function 'brevo-proxy' nao encontrada!" -ForegroundColor Red
        Write-Host "Execute: supabase functions deploy brevo-proxy --no-verify-jwt" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERRO: Nao foi possivel verificar funcoes" -ForegroundColor Red
    Write-Host "Verifique se o Supabase CLI esta instalado" -ForegroundColor Yellow
}

Write-Host ""

# ================================================
# Teste 2: Secrets configurados?
# ================================================
Write-Host "[2/4] Verificando Secrets..." -ForegroundColor Yellow

try {
    $secrets = supabase secrets list 2>&1 | Out-String
    
    if ($secrets -match "BREVO_API_KEY") {
        Write-Host "OK BREVO_API_KEY configurada!" -ForegroundColor Green
    } else {
        Write-Host "ERRO: BREVO_API_KEY nao encontrada!" -ForegroundColor Red
        Write-Host "Execute: supabase secrets set BREVO_API_KEY='sua-chave'" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERRO: Nao foi possivel verificar secrets" -ForegroundColor Red
}

Write-Host ""

# ================================================
# Teste 3: Site acessivel?
# ================================================
Write-Host "[3/4] Verificando site em producao..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $siteUrl -Method Head -TimeoutSec 10 -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        Write-Host "OK Site acessivel em $siteUrl" -ForegroundColor Green
    } else {
        Write-Host "AVISO: Site retornou status $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERRO: Nao foi possivel acessar $siteUrl" -ForegroundColor Red
    Write-Host "Verifique se o deploy foi feito no Vercel/Netlify" -ForegroundColor Yellow
}

Write-Host ""

# ================================================
# Teste 4: Edge Function CORS
# ================================================
Write-Host "[4/4] Testando CORS da Edge Function..." -ForegroundColor Yellow

$edgeFunctionUrl = "$supabaseUrl/functions/v1/brevo-proxy"

try {
    # Teste OPTIONS (preflight CORS)
    $headers = @{
        "Origin" = $siteUrl
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "content-type"
    }
    
    $response = Invoke-WebRequest -Uri $edgeFunctionUrl -Method Options -Headers $headers -TimeoutSec 10 -ErrorAction Stop
    
    if ($response.StatusCode -eq 204) {
        Write-Host "OK CORS preflight funcionando (204 No Content)" -ForegroundColor Green
        
        # Verificar headers CORS
        $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
        if ($corsHeader) {
            Write-Host "   Access-Control-Allow-Origin: $corsHeader" -ForegroundColor Gray
        }
    } else {
        Write-Host "AVISO: CORS preflight retornou status $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERRO: Falha no teste CORS" -ForegroundColor Red
    Write-Host "Verifique se a Edge Function foi deployada corretamente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACAO CONCLUIDA" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para testar manualmente:" -ForegroundColor Yellow
Write-Host "1. Acesse: $siteUrl/cadastro" -ForegroundColor White
Write-Host "2. Crie uma conta de teste" -ForegroundColor White
Write-Host "3. Abra o console (F12) e verifique se nao ha erros CORS" -ForegroundColor White
Write-Host ""
Write-Host "Para ver logs em tempo real:" -ForegroundColor Yellow
Write-Host "supabase functions logs brevo-proxy --tail" -ForegroundColor White
Write-Host ""

pause
