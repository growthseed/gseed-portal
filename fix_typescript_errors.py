"""
Script para corrigir todos os erros de TypeScript do projeto gseed-portal
"""

import os
import re

PROJECT_ROOT = r"C:\Users\EFEITO DIGITAL\gseed-portal\src"

# Correções a serem aplicadas
FIXES = {
    # 1. Remover imports não usados
    "unused_imports": [
        (r"import React from ['\"]react['\"];\n", ""),
        (r"import \{ React \} from ['\"]react['\"];\n", ""),
    ],
    
    # 2. Corrigir imports de Layout
    "layout_imports": [
        (r"import \{ Layout \} from ['\"]@/components/layout/Layout['\"]", 
         "import Layout from '@/components/layout/Layout'"),
    ],
    
    # 3. Adicionar tipos any onde necessário
    "add_any_types": [
        (r"Parameter '(\w+)' implicitly has an 'any' type", r"\1: any"),
    ],
}

def fix_file(filepath):
    """Corrige um arquivo específico"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Aplicar correções
        for fix_type, patterns in FIXES.items():
            for pattern, replacement in patterns:
                content = re.sub(pattern, replacement, content)
        
        # Se houve mudanças, salvar
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Corrigido: {filepath}")
            return True
        
        return False
        
    except Exception as e:
        print(f"❌ Erro em {filepath}: {e}")
        return False

def main():
    """Função principal"""
    print("🔧 Iniciando correções automáticas...\n")
    
    fixed_count = 0
    
    # Percorrer todos os arquivos .ts e .tsx
    for root, dirs, files in os.walk(PROJECT_ROOT):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    fixed_count += 1
    
    print(f"\n✅ Total de arquivos corrigidos: {fixed_count}")

if __name__ == "__main__":
    main()
