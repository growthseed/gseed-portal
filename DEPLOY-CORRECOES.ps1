# ====================================================================
# 🚀 DEPLOY DAS CORREÇÕES - GSEED PORTAL
# ====================================================================
# Executa deploy da Edge Function com correções CORS e testa localmente
# ====================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 DEPLOY DAS CORREÇÕES CORS + AUTH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Supabase CLI está instalado
Write-Host "🔍 Verificando Supabase CLI..." -ForegroundColor Yellow
$supabaseVersion = supabase --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Supabase CLI não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📦 Instale com:" -ForegroundColor Yellow
    Write-Host "   npm install -g supabase" -ForegroundColor White
    Write-Host ""
    exit 1
}
Write-Host "✅ Supabase CLI instalado: $supabaseVersion" -ForegroundColor Green
Write-Host ""

# Verificar se está logado
Write-Host "🔐 Verificando autenticação..." -ForegroundColor Yellow
$authCheck = supabase projects list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Não autenticado no Supabase!" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔑 Faça login com:" -ForegroundColor Yellow
    Write-Host "   supabase login" -ForegroundColor White
    Write-Host ""
    exit 1
}
Write-Host "✅ Autenticado no Supabase" -ForegroundColor Green
Write-Host ""

# Deploy da Edge Function
Write-Host "📦 Fazendo deploy da função 'brevo-proxy'..." -ForegroundColor Yellow
Write-Host ""

$deployOutput = supabase functions deploy brevo-proxy --no-verify-jwt 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no deploy!" -ForegroundColor Red
    Write-Host $deployOutput
    Write-Host ""
    exit 1
}

Write-Host "✅ Deploy realizado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host $deployOutput
Write-Host ""

# Resumo das correções
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✨ CORREÇÕES APLICADAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. ✅ CORS configurável (env ALLOWED_ORIGIN)" -ForegroundColor Green
Write-Host "2. ✅ Preflight OPTIONS retorna 204 (padrão)" -ForegroundColor Green
Write-Host "3. ✅ Headers CORS completos com Max-Age" -ForegroundColor Green
Write-Host "4. ✅ brevoService verifica response.ok" -ForegroundColor Green
Write-Host "5. ✅ SignUp usa signUpWithWelcomeEmail" -ForegroundColor Green
Write-Host "6. ✅ ProfessionalSignupForm usa getSession()" -ForegroundColor Green
Write-Host ""

# Instruções de teste
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🧪 COMO TESTAR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Inicie o servidor local:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2. Abra o DevTools (F12) > Console + Network" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Faça um cadastro completo:" -ForegroundColor Yellow
Write-Host "   - Vá em /cadastro" -ForegroundColor White
Write-Host "   - Escolha tipo (profissional/contratante)" -ForegroundColor White
Write-Host "   - Preencha formulário e finalize" -ForegroundColor White
Write-Host ""
Write-Host "4. Verifique no Console:" -ForegroundColor Yellow
Write-Host "   ✅ '[Brevo] Chamando ação: sendEmail'" -ForegroundColor Green
Write-Host "   ✅ '[Brevo] Status: 200 OK'" -ForegroundColor Green
Write-Host "   ✅ '[Brevo] Sucesso em sendEmail'" -ForegroundColor Green
Write-Host ""
Write-Host "5. Verifique no Network:" -ForegroundColor Yellow
Write-Host "   ✅ Requisição OPTIONS retorna 204" -ForegroundColor Green
Write-Host "   ✅ Requisição POST retorna 200" -ForegroundColor Green
Write-Host "   ✅ Sem erros CORS (vermelho)" -ForegroundColor Green
Write-Host ""

# Checklist
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ CHECKLIST DE ACEITAÇÃO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "☐ OPTIONS retorna 204 com headers CORS" -ForegroundColor White
Write-Host "☐ POST para brevo-proxy retorna 200" -ForegroundColor White
Write-Host "☐ Sem erros CORS no DevTools Console" -ForegroundColor White
Write-Host "☐ Após signup, sessão existe (getSession)" -ForegroundColor White
Write-Host "☐ Perfil criado com sucesso" -ForegroundColor White
Write-Host "☐ Emails enviados via Brevo (verificar logs)" -ForegroundColor White
Write-Host ""

# Próximos passos
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📋 PRÓXIMOS PASSOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure ALLOWED_ORIGIN em produção:" -ForegroundColor Yellow
Write-Host "   supabase secrets set ALLOWED_ORIGIN=https://seudominio.com" -ForegroundColor White
Write-Host ""
Write-Host "2. Teste em produção (após deploy Vercel)" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Monitore logs da função:" -ForegroundColor Yellow
Write-Host "   supabase functions logs brevo-proxy" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 DEPLOY CONCLUÍDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
