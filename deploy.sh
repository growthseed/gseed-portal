#!/bin/bash
# GSEED Portal - Deploy Commands

echo "Executando deploy..."
cd "C:\Users\EFEITO DIGITAL\gseed-portal"

# Add files
git add src/types/database.types.ts src/services/avaliacaoService.ts src/components/Chat/FloatingChat.tsx

# Commit
git commit -m "fix: corrigir erros TypeScript no build

- Adicionar tipo ChatMessage exportado em database.types.ts
- Corrigir mapeamento de profiles em avaliacaoService.ts
- Adicionar suporte para campos read e is_read em ChatMessage
- Garantir compatibilidade total com FloatingChat component

Resolvidos 4 erros de compilação TypeScript"

# Push
git push origin main

echo "Deploy enviado para GitHub/Vercel!"
