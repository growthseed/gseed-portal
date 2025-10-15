import { useState } from 'react';
import { X, Briefcase, UserCheck } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'vaga' | 'projeto') => void;
}

export function CreateProjectModal({ isOpen, onClose, onSelectType }: CreateProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X size={24} className="text-gray-600 dark:text-gray-400" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            O que você quer criar?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Escolha entre publicar uma vaga de emprego ou um projeto pontual
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vaga */}
          <button
            onClick={() => onSelectType('vaga')}
            className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-8 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Vaga
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Contratação permanente de profissionais para sua equipe
              </p>
              
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                3 passos · Processo simplificado
              </div>
            </div>
          </button>

          {/* Projeto */}
          <button
            onClick={() => onSelectType('projeto')}
            className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-8 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gseed-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Projeto
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Demanda pontual com prazo e entrega definidos
              </p>
              
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                4 passos · Mais detalhado
              </div>
            </div>
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            💡 <strong>Dica:</strong> Vagas são ideais para contratações CLT ou permanentes. 
            Projetos são perfeitos para trabalhos freelance ou pontuais.
          </p>
        </div>
      </div>
    </div>
  );
}
