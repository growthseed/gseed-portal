import { useState } from 'react';
import { X, Send, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Project } from '@/types/database.types';

interface ModalEnviarPropostaProps {
  isOpen: boolean;
  onClose: () => void;
  projeto: Project;
  onSuccess: () => void;
}

export function ModalEnviarProposta({ isOpen, onClose, projeto, onSuccess }: ModalEnviarPropostaProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    proposed_value: '',
    proposed_deadline: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implementar envio de proposta quando tivermos autenticação
      console.log('Enviando proposta:', formData);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(numbers) / 100);
    return formatted;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enviar Proposta
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Projeto Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {projeto.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {projeto.client?.company_name || projeto.client?.name}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mensagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mensagem da Proposta *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={6}
              placeholder="Descreva por que você é o profissional ideal para este projeto..."
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Mínimo 100 caracteres ({formData.message.length}/100)
            </p>
          </div>

          {/* Valor Proposto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor Proposto *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                value={formData.proposed_value}
                onChange={(e) => {
                  const formatted = formatCurrency(e.target.value);
                  setFormData({ ...formData, proposed_value: formatted });
                }}
                required
                placeholder="R$ 0,00"
                className="pl-10"
              />
            </div>
            {projeto.budget_min && projeto.budget_max && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Orçamento do projeto: R$ {projeto.budget_min.toLocaleString('pt-BR')} - R$ {projeto.budget_max.toLocaleString('pt-BR')}
              </p>
            )}
          </div>

          {/* Prazo Proposto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prazo de Entrega *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                value={formData.proposed_deadline}
                onChange={(e) => setFormData({ ...formData, proposed_deadline: e.target.value })}
                required
                placeholder="Ex: 30 dias, 2 semanas, 1 mês..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Dicas para uma boa proposta:
            </h4>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
              <li>• Seja específico sobre sua experiência relevante</li>
              <li>• Explique sua abordagem para o projeto</li>
              <li>• Mencione trabalhos similares que já realizou</li>
              <li>• Seja realista com prazos e valores</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || formData.message.length < 100}
              className="gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Enviar Proposta
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
