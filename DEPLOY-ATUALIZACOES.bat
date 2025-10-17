@echo off
echo ========================================
echo   GSEED PORTAL - DEPLOY ATUALIZACOES
echo ========================================
echo.
echo Subindo todas as correções para produção:
echo - Proteção de rotas e autenticação
echo - Logo Gseed Works padronizada
echo - Perfil profissional completo
echo - Correções TypeScript
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/4] Verificando status...
git status

echo.
echo [2/4] Adicionando arquivos...
git add .

echo.
echo [3/4] Criando commit...
git commit -m "fix: subir correções de segurança, autenticação e logo

SEGURANÇA E AUTENTICAÇÃO:
- Protegidas rotas de detalhes (projetos e profissionais)
- Botões de ação verificam login antes de executar
- Redirecionamento para login com returnTo
- Dados reais do Supabase em vez de mock

LOGO E IDENTIDADE:
- Logo Gseed Works padronizada em todos headers
- Removido círculo com G
- Gradiente verde consistente
- Tema claro/escuro funcionando

PERFIL PROFISSIONAL:
- Toggle ativar perfil profissional
- Validação de campos obrigatórios
- Sistema de serviços
- Portfólio de imagens
- Abas condicionais

CORREÇÕES TÉCNICAS:
- Imports não usados removidos
- Variáveis não utilizadas corrigidas
- Tipos TypeScript ajustados
"

echo.
echo [4/4] Enviando para GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo ❌ ERRO no push!
    echo.
    echo Possíveis causas:
    echo - Sem internet
    echo - Credenciais Git não configuradas
    echo - Conflito com versão remota
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ SUCESSO!
echo ========================================
echo.
echo Deploy automático iniciado no Vercel!
echo.
echo Acompanhe em:
echo https://vercel.com/growthseed/gseed-portal
echo.
echo O site estará atualizado em 2-3 minutos.
echo Acesse: https://portal.gseed.com.br
echo.
pause
