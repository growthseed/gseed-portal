import { useState } from 'react';
import { validateField, ValidationErrors } from '@/lib/validation';
import { toast } from 'sonner';
import { 
  Send, 
  Paperclip, 
  DollarSign, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { proposalService, type ProposalData } from '@/services/proposalService';
import { MultipleImageUpload } from '@/components/upload';

interface CreateProposalFormProps {
  projectId: string;
  projectTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProposalForm({ 
  projectId, 
  projectTitle, 
  onSuccess, 
  onCancel 
}: CreateProposalFormProps) {
  const [formData, setFormData] = useState<Omit<ProposalData, 'project_id'>>({
    message: '',
    proposed_value: 0,
    proposed_deadline: '',
    attachments: [],
  });

  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validar formulário
    const newErrors: ValidationErrors = {};
    
    const messageError = validateField(formData.message, [
      { required: true, message: 'Mensagem é obrigatória' },
      { minLength: 50, message: 'Mensagem deve ter no mínimo 50 caracteres' },
      { maxLength: 2000, message: 'Mensagem deve ter no máximo 2000 caracteres' },
    ]);
    if (messageError) newErrors.message = messageError;
    
    const valueError = validateField(formData.proposed_value, [
      { required: true, message: 'Valor é obrigatório' },
      { custom: (val) => val > 0, message: 'Valor deve ser maior que zero' },
    ]);
    if (valueError) newErrors.proposed_value = valueError;
    
    const deadlineError = validateField(formData.proposed_deadline, [
      { required: true, message: 'Prazo é obrigatório' },
      { minLength: 3, message: 'Prazo deve ter no mínimo 3 caracteres' },
    ]);
    if (deadlineError) newErrors.proposed_deadline = deadlineError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return;
    }
    
    setIsSubmitting(true);

    try {
      await proposalService.createProposal({
        project_id: projectId,
        ...formData,
        attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Proposta Enviada!
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Sua proposta foi enviada com sucesso. O contratante será notificado e você receberá uma resposta em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enviar Proposta
        </h2>
        <p className="text-gray-600">
          Projeto: <span className="font-medium text-gray-900">{projectTitle}</span>
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Erro ao enviar proposta</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Mensagem */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Mensagem para o Contratante *
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
            if (errors.message) setErrors(prev => { const newErrors = {...prev}; delete newErrors.message; return newErrors; });
          }}
          rows={6}
          placeholder="Descreva sua experiência, como você pretende executar o projeto e por que você é a melhor escolha para este trabalho..."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent resize-none ${
            errors.message ? 'border-red-500 bg-red-50' : formData.message.length >= 50 ? 'border-green-300' : 'border-gray-300'
          }`}
          maxLength={2000}
        />
        <div className="flex items-center justify-between mt-2">
          <p className={`text-xs ${
            formData.message.length < 50 ? 'text-gray-500' : formData.message.length > 1900 ? 'text-orange-600' : 'text-green-600'
          }`}>
            {formData.message.length}/2000 caracteres {formData.message.length < 50 && `(mínimo 50)`}
          </p>
          {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
        </div>
      </div>

      {/* Valor Proposto */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Valor Proposto *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <DollarSign size={20} className="text-gray-400" />
          </div>
          <input
            type="number"
            value={formData.proposed_value || ''}
            onChange={(e) => {
              setFormData({ ...formData, proposed_value: Number(e.target.value) });
              if (errors.proposed_value) setErrors(prev => { const newErrors = {...prev}; delete newErrors.proposed_value; return newErrors; });
            }}
            min="0"
            step="0.01"
            placeholder="0,00"
            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent ${
              errors.proposed_value ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            Informe o valor que você cobra para realizar este projeto
          </p>
          {errors.proposed_value && <p className="text-sm text-red-600">{errors.proposed_value}</p>}
        </div>
      </div>

      {/* Prazo Proposto */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Prazo de Entrega Proposto *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Calendar size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.proposed_deadline}
            onChange={(e) => {
              setFormData({ ...formData, proposed_deadline: e.target.value });
              if (errors.proposed_deadline) setErrors(prev => { const newErrors = {...prev}; delete newErrors.proposed_deadline; return newErrors; });
            }}
            placeholder="Ex: 7 dias, 2 semanas, 1 mês..."
            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent ${
              errors.proposed_deadline ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            Informe em quanto tempo você pode entregar o projeto
          </p>
          {errors.proposed_deadline && <p className="text-sm text-red-600">{errors.proposed_deadline}</p>}
        </div>
      </div>

      {/* Anexos */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Anexos (opcional)
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Adicione imagens de trabalhos anteriores, certificados ou documentos relevantes
        </p>
        <MultipleImageUpload
          onUploadComplete={(urls) => setAttachmentUrls(urls)}
          currentImageUrls={attachmentUrls}
          maxImages={3}
          folder="propostas/anexos"
          maxSizeMB={5}
          className=""
        />
      </div>

      {/* Dica */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Dicas para uma proposta de sucesso
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Seja específico sobre sua experiência relevante</li>
              <li>• Explique sua abordagem para o projeto</li>
              <li>• Mantenha um tom profissional e cordial</li>
              <li>• Seja realista com prazos e valores</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send size={20} />
              Enviar Proposta
            </>
          )}
        </button>
      </div>
    </form>
  );
}
