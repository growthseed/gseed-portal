#!/bin/bash

# Script para reconfigurar Facebook OAuth no Supabase
# Execute este script se o erro 400 persistir

echo "=========================================="
echo " RECONFIGURAR FACEBOOK OAUTH NO SUPABASE"
echo "=========================================="
echo ""

echo "PASSO 1: Acesse o Supabase Dashboard"
echo "URL: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/auth/providers"
echo ""
echo "PASSO 2: Procure 'Facebook' e DESABILITE (toggle OFF)"
echo "AGUARDE 10 SEGUNDOS"
echo ""
echo "PASSO 3: HABILITE novamente (toggle ON)"
echo ""
echo "PASSO 4: Preencha:"
echo "  - Facebook Client ID: [App ID do Facebook]"
echo "  - Facebook Secret: [App Secret do Facebook]"
echo ""
echo "PASSO 5: Clique em SAVE"
echo ""
echo "PASSO 6: Teste novamente em:"
echo "  https://portal.gseed.com.br/login"
echo ""
echo "=========================================="

# Informações do App do Facebook
echo ""
echo "SUAS CREDENCIAIS DO FACEBOOK:"
echo ""
echo "1. Acesse: https://developers.facebook.com/apps"
echo "2. Clique no app 'GSeed Portal'"
echo "3. Vá em: Configurações do app > Básico"
echo "4. Copie:"
echo "   - App ID (Client ID)"
echo "   - Chave secreta do app (Secret) - clique em 'Mostrar'"
echo ""
echo "=========================================="

read -p "Pressione ENTER após configurar..."

echo ""
echo "TESTANDO..."
echo "Abra: https://portal.gseed.com.br/login"
echo "Clique em 'Continuar com Facebook'"
echo ""
