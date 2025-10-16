#!/bin/bash
# Script para corrigir todos os erros TypeScript de variáveis não usadas

# Remove imports não usados - React
sed -i "s/import React,/import/" src/components/Avaliacoes/AvaliacaoItem.tsx
sed -i "s/import React,/import/" src/components/Avaliacoes/AvaliacaoList.tsx
sed -i "s/import React, { /import { /" src/components/DatePicker.tsx

# Remove variáveis declaradas mas não usadas
sed -i "s/, id//" src/components/beneficiarios/BeneficiarioCard.tsx
sed -i "s/, id//" src/components/profissionais/ProfessionalCard.tsx

echo "✅ Correções aplicadas!"
