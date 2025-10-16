import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AvaliacaoFormProps {
  professionalId: string;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  onCancel: () => void;
}

export function AvaliacaoForm({ professionalId: _professionalId, onSubmit, onCancel }: AvaliacaoFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Por favor, selecione uma avaliação');
      return;
    }

    if (comment.trim().length < 10) {
      alert('O comentário deve ter pelo menos 10 caracteres');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment: comment.trim() });
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Avaliar Profissional
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sua avaliação
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label 
            htmlFor="comment" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Comentário
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Conte sua experiência com este profissional..."
            required
            minLength={10}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Mínimo de 10 caracteres
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="flex-1"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AvaliacaoForm;
