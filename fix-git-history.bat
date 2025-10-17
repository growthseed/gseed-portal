@echo off
echo ========================================
echo   LIMPANDO HISTÓRICO DO GIT
echo ========================================
echo.
echo ATENÇÃO: Isso vai reescrever o histórico!
echo Pressione qualquer tecla para continuar...
pause

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo.
echo [1/6] Removendo arquivos sensíveis...
git rm --cached .env.vercel 2>nul
git rm --cached RECRIAR_VARIAVEIS_VERCEL.md 2>nul

echo.
echo [2/6] Criando templates sem chaves...
(
echo # .env.vercel - TEMPLATE
echo # Configure as variáveis no Vercel Dashboard
echo.
echo VITE_SUPABASE_URL=your_supabase_url
echo VITE_SUPABASE_ANON_KEY=your_anon_key
echo VITE_SITE_URL=your_site_url
echo VITE_OAUTH_REDIRECT_URL=your_redirect_url
echo VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
echo VITE_CLOUDINARY_API_KEY=your_api_key
echo VITE_CLOUDINARY_API_SECRET=your_api_secret
echo VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
echo VITE_BREVO_API_KEY=your_brevo_key
) > .env.vercel.template

(
echo # Variáveis de Ambiente - Vercel
echo.
echo Configure estas variáveis no Vercel Dashboard:
echo Settings ^> Environment Variables
echo.
echo ^> VITE_SUPABASE_URL
echo ^> VITE_SUPABASE_ANON_KEY
echo ^> VITE_SITE_URL
echo ^> VITE_OAUTH_REDIRECT_URL
echo ^> VITE_CLOUDINARY_CLOUD_NAME
echo ^> VITE_CLOUDINARY_API_KEY
echo ^> VITE_CLOUDINARY_API_SECRET
echo ^> VITE_CLOUDINARY_UPLOAD_PRESET
echo ^> VITE_BREVO_API_KEY
) > VARIAVEIS_VERCEL.md

echo.
echo [3/6] Atualizando .gitignore...
(
echo .env
echo .env.local
echo .env.vercel
echo RECRIAR_VARIAVEIS_VERCEL.md
echo node_modules/
echo dist/
echo .vercel
) > .gitignore

echo.
echo [4/6] Deletando arquivos antigos...
if exist .env.vercel del .env.vercel
if exist RECRIAR_VARIAVEIS_VERCEL.md del RECRIAR_VARIAVEIS_VERCEL.md

echo.
echo [5/6] Fazendo commit limpo...
git add .gitignore .env.vercel.template VARIAVEIS_VERCEL.md
git commit -m "security: remover chaves de API e criar templates

- Removido .env.vercel com chaves reais
- Removido RECRIAR_VARIAVEIS_VERCEL.md com chaves
- Criado .env.vercel.template (sem chaves)
- Criado VARIAVEIS_VERCEL.md (instruções sem chaves)
- Atualizado .gitignore para proteger arquivos sensíveis

Todas as chaves já estão configuradas no Vercel Dashboard.
"

echo.
echo [6/6] Limpando histórico antigo com filter-branch...
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env.vercel RECRIAR_VARIAVEIS_VERCEL.md" --prune-empty --tag-name-filter cat -- --all

echo.
echo ========================================
echo   ✅ HISTÓRICO LIMPO!
echo ========================================
echo.
echo Agora force push:
echo git push origin main --force
echo.
pause
