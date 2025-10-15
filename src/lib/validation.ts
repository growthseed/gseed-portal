/**
 * Serviço de Validação de Formulários
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Valida um campo individual
 */
export const validateField = (
  value: any,
  rules: ValidationRule[]
): string | null => {
  for (const rule of rules) {
    // Required
    if (rule.required && (!value || value.length === 0)) {
      return rule.message;
    }

    // Skip other rules if empty and not required
    if (!value || value.length === 0) continue;

    // Min Length
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message;
    }

    // Max Length
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message;
    }

    // Pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }

    // Custom
    if (rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }

  return null;
};

/**
 * Valida múltiplos campos
 */
export const validateForm = (
  data: Record<string, any>,
  schema: Record<string, ValidationRule[]>
): ValidationErrors => {
  const errors: ValidationErrors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};

/**
 * Regras de validação comuns
 */
export const commonRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido',
  },
  phone: {
    pattern: /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
    message: 'Telefone inválido',
  },
  cpf: {
    pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    message: 'CPF inválido',
  },
  cnpj: {
    pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    message: 'CNPJ inválido',
  },
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'URL inválida',
  },
  password: {
    minLength: 8,
    message: 'Senha deve ter no mínimo 8 caracteres',
  },
  strongPassword: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: 'Senha deve ter letras maiúsculas, minúsculas e números',
  },
};

/**
 * Schemas de validação prontos
 */
export const validationSchemas = {
  login: {
    email: [
      { required: true, message: 'Email é obrigatório' },
      commonRules.email,
    ],
    password: [
      { required: true, message: 'Senha é obrigatória' },
    ],
  },

  register: {
    name: [
      { required: true, message: 'Nome é obrigatório' },
      { minLength: 3, message: 'Nome deve ter no mínimo 3 caracteres' },
    ],
    email: [
      { required: true, message: 'Email é obrigatório' },
      commonRules.email,
    ],
    password: [
      { required: true, message: 'Senha é obrigatória' },
      commonRules.password,
    ],
    confirmPassword: [
      { required: true, message: 'Confirme sua senha' },
    ],
  },

  project: {
    title: [
      { required: true, message: 'Título é obrigatório' },
      { minLength: 20, message: 'Título deve ter no mínimo 20 caracteres' },
      { maxLength: 200, message: 'Título deve ter no máximo 200 caracteres' },
    ],
    description: [
      { required: true, message: 'Descrição é obrigatória' },
      { minLength: 100, message: 'Descrição deve ter no mínimo 100 caracteres' },
    ],
    category: [
      { required: true, message: 'Selecione uma categoria' },
    ],
    skills: [
      { 
        required: true, 
        message: 'Selecione pelo menos uma habilidade',
        custom: (value) => Array.isArray(value) && value.length > 0
      },
    ],
  },

  profile: {
    name: [
      { required: true, message: 'Nome é obrigatório' },
      { minLength: 3, message: 'Nome deve ter no mínimo 3 caracteres' },
    ],
    email: [
      { required: true, message: 'Email é obrigatório' },
      commonRules.email,
    ],
    phone: [
      commonRules.phone,
    ],
    bio: [
      { maxLength: 500, message: 'Bio deve ter no máximo 500 caracteres' },
    ],
  },
};

/**
 * Máscaras de formatação
 */
export const masks = {
  phone: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  },

  cpf: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  },

  cnpj: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  },

  currency: (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue / 100);
  },

  date: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  },
};
