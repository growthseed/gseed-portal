@echo off
echo ========================================
echo Deploy - Atualizacao Register Page
echo ========================================
echo.

cd /d "C:\Users\EFEITO DIGITAL\gseed-portal"

echo [1/4] Verificando status do repositorio...
git status
echo.

echo [2/4] Adicionando alteracoes...
git add src/pages/Register.tsx
echo.

echo [3/4] Criando commit...
git commit -m "feat: Atualiza tipos de conta para Profissional e Contratante

- Altera 'Freelancer' para 'Profissional'
- Altera 'Cliente' para 'Contratante'
- Adiciona campo de telefone opcional
- Melhora validacao de termos de uso
- Mantem todas as integracoes com Supabase
- User type agora usa 'professional' e 'contractor'"
echo.

echo [4/4] Enviando para o repositorio...
git push origin main
echo.

echo ========================================
echo Deploy concluido com sucesso!
echo ========================================
echo.
echo A Vercel ira detectar automaticamente e fazer o deploy.
echo Aguarde alguns instantes e verifique em: https://gseed-portal.vercel.app
echo.

pause
