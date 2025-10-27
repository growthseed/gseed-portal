# Correção dos Erros na Página de Perfil

## 🐛 Problemas Identificados

### 1. **Adicionar Serviços NÃO Funciona**
**Linha 513 (`addService` function)**

**Problema**: Está usando `profile?.id` que é o ID da tabela `profiles`, mas a FK `professional_id` em `professional_services` aponta para `professional_profiles.id`.

**Código Atual (ERRADO)**:
```typescript
const { data, error } = await supabase
  .from('professional_services')
  .insert({
    professional_id: profile?.id,  // ❌ ERRADO! Usando profiles.id
    title: newService.title,
    description: newService.description,
    price: newService.price
  })
```

**Código Correto**:
```typescript
const addService = async () => {
  if (!newService.title || !newService.description || !newService.price) {
    toast.error('Preencha todos os campos do serviço');
    return;
  }

  try {
    // Buscar o ID do perfil profissional
    const { data: profProfile, error: profError } = await supabase
      .from('professional_profiles')
      .select('id')
      .eq('user_id', profile?.id)
      .single();

    if (profError || !profProfile) {
      toast.error('Perfil profissional não encontrado. Salve seu perfil profissional primeiro.');
      return;
    }

    const { data, error } = await supabase
      .from('professional_services')
      .insert({
        professional_id: profProfile.id,  // ✅ CORRETO! Usando professional_profiles.id
        title: newService.title,
        description: newService.description,
        price: newService.price
      })
      .select()
      .single();

    if (error) throw error;

    setServices([...services, data]);
    setNewService({ title: '', description: '', price: '' });
    toast.success('Serviço adicionado!');
  } catch (error) {
    console.error('Erro ao adicionar serviço:', error);
    toast.error('Erro ao adicionar serviço');
  }
};
```

---

### 2. **Carregar Serviços com ID Errado**
**Linha 245 (dentro de `loadProfile`)**

**Problema**: Está buscando serviços usando `user.id` ao invés de `professionalData.id`.

**Código Atual (ERRADO)**:
```typescript
// Carregar serviços se for profissional
if (hasProfessionalProfile) {
  const { data: servicesData } = await supabase
    .from('professional_services')
    .select('*')
    .eq('professional_id', user.id);  // ❌ ERRADO! Usando profiles.id
  
  if (servicesData) {
    setServices(servicesData);
  }
}
```

**Código Correto**:
```typescript
// Carregar serviços se for profissional
if (hasProfessionalProfile && professionalData) {
  const { data: servicesData } = await supabase
    .from('professional_services')
    .select('*')
    .eq('professional_id', professionalData.id);  // ✅ CORRETO! Usando professional_profiles.id
  
  if (servicesData) {
    setServices(servicesData);
  }
}
```

---

## 📝 Resumo das Mudanças

| Problema | Linha | O que está errado | Solução |
|----------|-------|-------------------|---------|
| Adicionar serviço | 513 | Usa `profile?.id` (profiles) | Buscar `professional_profiles.id` primeiro |
| Carregar serviços | 245 | Usa `user.id` (profiles) | Usar `professionalData.id` |

---

## 🔧 Como Aplicar a Correção

### Opção 1: Substituir a função `addService` completa

Substitua a função `addService` (linha 507-530) pelo código correto acima.

### Opção 2: Substituir a seção de carregar serviços

Substitua o bloco de código em `loadProfile` (linha 241-249) pelo código correto acima.

---

## ✅ Teste após a correção

1. **Modo Edição**: Ative o perfil profissional
2. **Aba Profissional**: Adicione categoria e profissão
3. **Salvar**: Salve o perfil
4. **Adicionar Serviço**: Preencha título, descrição e preço
5. **Verificar**: O serviço deve aparecer na lista

---

## 📊 Estrutura do Banco de Dados

```
profiles (id: uuid)
  └─ professional_profiles (id: uuid, user_id: uuid → profiles.id)
      └─ professional_services (id: uuid, professional_id: uuid → professional_profiles.id)
```

**Chaves Corretas**:
- `profiles.id` = ID do usuário
- `professional_profiles.id` = ID do perfil profissional
- `professional_services.professional_id` = FK para `professional_profiles.id`
