import { X, Briefcase, Users } from 'lucide-react';

interface EscolhaTipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVaga: () => void;
  onSelectProjeto: () => void;
}

export function EscolhaTipoModal({ isOpen, onClose, onSelectVaga, onSelectProjeto }: EscolhaTipoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-8 relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-600 dark:text-gray-400" />
        </button>

        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            O que você gostaria de publicar?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Escolha o tipo de oportunidade que deseja criar
          </p>
        </div>

        {/* Opções */}
        <div className="grid grid-cols-2 gap-6">
          {/* Opção: Vaga */}
          <button
            onClick={onSelectVaga}
            className="group p-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gseed-500 dark:hover:border-gseed-500 hover:shadow-lg transition-all"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
              <Users size={32} className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Vaga
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Contratação permanente ou temporária de profissionais
            </p>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
              3 passos simples
            </div>
          </button>

          {/* Opção: Projeto */}
          <button
            onClick={onSelectProjeto}
            className="group p-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gseed-500 dark:hover:border-gseed-500 hover:shadow-lg transition-all"
          >
            <div className="w-16 h-16 bg-gseed-100 dark:bg-gseed-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gseed-500 transition-colors">
              <Briefcase size={32} className="text-gseed-600 dark:text-gseed-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Projeto
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Demanda pontual com escopo e prazo definidos
            </p>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
              4 passos detalhados
            </div>
          </button>
        </div>

        {/* Info adicional */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            <strong className="text-gray-900 dark:text-white">Dica:</strong> Use "Vaga" para contratações fixas e "Projeto" para trabalhos pontuais.
          </p>
        </div>
      </div>
    </div>
  );
}
