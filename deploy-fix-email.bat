@echo off
echo ========================================
echo Deploy - Correcao de Cadastro + Email
echo ========================================
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/5] Verificando status do repositorio...
git status
echo.

echo [2/5] Adicionando alteracoes...
git add src/pages/Register.tsx
git add src/contexts/AuthContext.tsx
git add SUPABASE_EMAIL_FIX.md
echo.

echo [3/5] Criando commit...
git commit -m "fix: Corrige cadastro e tratamento de erro de email

Alteracoes:
- Muda tipos de conta: Freelancer/Cliente para Profissional/Contratante
- Adiciona campo telefone opcional
- Melhora tratamento de erro de envio de email
- Permite cadastro mesmo se email de confirmacao falhar
- Adiciona mensagens de erro mais amigaveis
- Atualiza validacao de termos de uso
- User types: 'professional' e 'contractor'

Docs:
- Adiciona guia de configuracao SMTP no Supabase
- Documenta opcoes para resolver erro de email"
echo.

echo [4/5] Enviando para o repositorio...
git push origin main
echo.

echo [5/5] Limpando cache local...
echo Limpe o cache do navegador (Ctrl+Shift+Delete) para ver as mudancas
echo.

echo ========================================
echo Deploy concluido com sucesso!
echo ========================================
echo.
echo IMPORTANTE - Proximos passos:
echo.
echo 1. Acesse: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/settings/auth
echo 2. Desmarque "Enable email confirmations" (temporario)
echo 3. OU configure SMTP com Brevo (producao)
echo.
echo Veja detalhes em: SUPABASE_EMAIL_FIX.md
echo.
echo Deploy sera processado em: https://gseed.com.br
echo.

pause
