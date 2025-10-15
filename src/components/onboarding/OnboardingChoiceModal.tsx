import { Briefcase, Laptop, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge-advanced';

interface OnboardingChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContratante: () => void;
  onSelectProfissional: () => void;
}

export function OnboardingChoiceModal({
  isOpen,
  onClose,
  onSelectContratante,
  onSelectProfissional,
}: OnboardingChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-gseed-50 to-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Qual o seu objetivo no Gseed Jobs?
          </h2>
          <p className="text-gray-600 text-center">
            Escolha como você deseja usar a plataforma
          </p>
        </div>

        {/* Cards de Escolha */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card Contratante */}
            <button
              onClick={onSelectContratante}
              className="group relative p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-gseed-500 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
            >
              {/* Gradiente de fundo no hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-gseed-50/0 to-gseed-100/0 group-hover:from-gseed-50/50 group-hover:to-gseed-100/30 transition-all duration-300" />
              
              <div className="relative z-10">
                {/* Ícone */}
                <div className="w-16 h-16 bg-gseed-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gseed-500 group-hover:scale-110 transition-all duration-300">
                  <Briefcase className="text-gseed-600 group-hover:text-white transition-colors" size={32} />
                </div>

                {/* Texto */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sou contratante, busco por profissionais
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Publique projetos e vagas, encontre os melhores talentos para suas necessidades e construa seu time ideal.
                </p>

                {/* Indicador de hover */}
                <div className="mt-6 flex items-center gap-2 text-gseed-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Começar como contratante</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Card Profissional */}
            <button
              onClick={onSelectProfissional}
              className="group relative p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-gseed-500 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
            >
              {/* Badge "Recomendado" */}
              <div className="absolute top-4 right-4 z-20">
                <Badge variant="gradient" className="shadow-lg">
                  Recomendado
                </Badge>
              </div>

              {/* Gradiente de fundo no hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-gseed-50/0 to-gseed-100/0 group-hover:from-gseed-50/50 group-hover:to-gseed-100/30 transition-all duration-300" />
              
              <div className="relative z-10">
                {/* Ícone */}
                <div className="w-16 h-16 bg-gseed-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gseed-500 group-hover:scale-110 transition-all duration-300">
                  <Laptop className="text-gseed-600 group-hover:text-white transition-colors" size={32} />
                </div>

                {/* Texto */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sou profissional, busco por vagas e projetos
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Encontre oportunidades alinhadas com seu perfil, envie propostas e conecte-se com contratantes.
                </p>

                {/* Indicador de hover */}
                <div className="mt-6 flex items-center gap-2 text-gseed-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Começar como profissional</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

          </div>

          {/* Opção "Ambos" */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Você poderá alterar ou adicionar outro perfil depois
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
