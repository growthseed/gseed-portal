import { useNavigate } from 'react-router-dom';
import { Briefcase, UserPlus, X } from 'lucide-react';

interface ModalEscolhaProjetoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalEscolhaProjeto({ isOpen, onClose }: ModalEscolhaProjetoProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleEscolha = (tipo: 'projeto' | 'vaga') => {
    onClose();
    navigate(tipo === 'projeto' ? '/criar-projeto' : '/criar-vaga');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gseed-500 to-gseed-600 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">O que você deseja publicar?</h2>
          <p className="text-gseed-50">Escolha o tipo de publicação mais adequado para sua necessidade</p>
        </div>

        {/* Options */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PROJETO */}
          <button
            onClick={() => handleEscolha('projeto')}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Projeto</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Demanda pontual com escopo definido, prazo específico e pagamento único.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Ideal para trabalhos com início e fim definidos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Entrega rápida e pontual</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Orçamento por faixas de valor</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                Publicar Projeto
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 transition-all duration-300" />
          </button>

          {/* VAGA */}
          <button
            onClick={() => handleEscolha('vaga')}
            className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gseed-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserPlus size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Vaga</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Contratação de profissional para trabalho contínuo ou para integrar sua equipe.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-gseed-500 mt-0.5">•</span>
                  <span>Ideal para posições fixas no time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gseed-500 mt-0.5">•</span>
                  <span>Trabalho contínuo e recorrente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gseed-500 mt-0.5">•</span>
                  <span>Encontre o talento certo para sua empresa</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center gap-2 text-gseed-600 dark:text-gseed-400 font-semibold group-hover:gap-3 transition-all">
                Publicar Vaga
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-gseed-500/0 to-gseed-600/0 group-hover:from-gseed-500/5 group-hover:to-gseed-600/5 transition-all duration-300" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 bg-gseed-500 rounded-full" />
            <p>Não se preocupe, você poderá editar ou excluir sua publicação depois</p>
          </div>
        </div>
      </div>
    </div>
  );
}
