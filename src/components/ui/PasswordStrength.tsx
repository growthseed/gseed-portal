import { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrength({ password, showRequirements = true }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Calcular pontuação
    if (checks.length) score += 20;
    if (checks.uppercase) score += 20;
    if (checks.lowercase) score += 20;
    if (checks.number) score += 20;
    if (checks.special) score += 20;

    // Determinar força
    let label = '';
    let color = '';

    if (score <= 20) {
      label = 'Muito fraca';
      color = 'bg-red-500';
    } else if (score <= 40) {
      label = 'Fraca';
      color = 'bg-orange-500';
    } else if (score <= 60) {
      label = 'Média';
      color = 'bg-yellow-500';
    } else if (score <= 80) {
      label = 'Forte';
      color = 'bg-blue-500';
    } else {
      label = 'Muito forte';
      color = 'bg-green-500';
    }

    return { score, label, color, checks };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Barra de força */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Força da senha
          </span>
          <span className={`text-xs font-semibold ${
            strength.score <= 40 ? 'text-red-600' : 
            strength.score <= 60 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {strength.label}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {/* Requisitos */}
      {showRequirements && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            A senha deve conter:
          </p>
          <div className="space-y-1">
            <Requirement met={strength.checks.length}>
              No mínimo 8 caracteres
            </Requirement>
            <Requirement met={strength.checks.uppercase}>
              Letras maiúsculas (A-Z)
            </Requirement>
            <Requirement met={strength.checks.lowercase}>
              Letras minúsculas (a-z)
            </Requirement>
            <Requirement met={strength.checks.number}>
              Números (0-9)
            </Requirement>
            <Requirement met={strength.checks.special}>
              Caracteres especiais (!@#$%...)
            </Requirement>
          </div>
        </div>
      )}
    </div>
  );
}

function Requirement({ met, children }: { met: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
      ) : (
        <XCircle size={14} className="text-gray-400 flex-shrink-0" />
      )}
      <span className={`text-xs ${met ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
        {children}
      </span>
    </div>
  );
}
