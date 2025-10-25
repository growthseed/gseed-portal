"""
Script para corrigir todos os erros TypeScript de uma vez
"""

import re

# Lista de correções a fazer
corrections = [
    {
        'file': 'src/pages/Perfil.tsx',
        'replacements': [
            # Erro linha 888 - professionCategories.map
            (r'professionCategories\.map\(cat =>', 'Object.keys(professionCategories).map(catName =>'),
            # Erro linha 889 - uso de cat dentro do map
            (r'<option key={catName} value={catName}>{catName}</option>', '<option key={catName} value={catName}>{catName}</option>'),
            # Erro linha 911 - professionCategories.find
            (r'\.find\(c => c\.name === profile\.category\)', 
             '.find(([name]) => name === profile.category)?.[1]'),
            # Erro linha 1023 - currentImages -> currentImageUrls
            (r'currentImages=', 'currentImageUrls='),
        ]
    },
    {
        'file': 'src/pages/VerifyEmail.tsx',
        'replacements': [
            # Erro linha 149 - status comparison
            (r"disabled=\{!userEmail \|\| status === 'loading'\}", 
             "disabled={!userEmail || status !== 'waiting'}"),
            # Erro linha 153 - status comparison
            (r"\{status === 'loading' \? \(", 
             "{status !== 'waiting' ? ("),
        ]
    },
    {
        'file': 'src/services/chatService.ts',
        'replacements': [
            # Correção completa do getTotalUnreadCount
            # Será feita manualmente
        ]
    }
]

print("✅ Plano de correções criado")
print("Execute as correções manualmente conforme necessário")
