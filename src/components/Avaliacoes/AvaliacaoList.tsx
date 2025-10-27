import { Star, User } from 'lucide-react';
import type { Avaliacao } from '@/services/avaliacaoService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AvaliacaoListProps {
  avaliacoes: Avaliacao[];
  averageRating: number;
  totalAvaliacoes: number;
}

export function AvaliacaoList({ avaliacoes, averageRating, totalAvaliacoes }: AvaliacaoListProps) {
  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ptBR
      });
    } catch (error) {
      return 'Data desconhecida';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }
          />
        ))}
      </div>
    );
  };

  if (avaliacoes.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma avaliação ainda
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mt-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = avaliacoes.filter(a => a.rating === stars).length;
              const percentage = totalAvaliacoes > 0 ? (count / totalAvaliacoes) * 100 : 0;
              
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                    {stars} {stars === 1 ? 'estrela' : 'estrelas'}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {avaliacoes.map((avaliacao) => (
          <div
            key={avaliacao.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {avaliacao.client?.avatar_url ? (
                  <img
                    src={avaliacao.client.avatar_url}
                    alt={avaliacao.client.name || 'Cliente'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gseed-500 to-gseed-600 flex items-center justify-center text-white font-semibold">
                    {avaliacao.client?.name?.charAt(0) || <User size={24} />}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {avaliacao.client?.name || 'Cliente Anônimo'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(avaliacao.rating)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(avaliacao.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {avaliacao.comment}
                </p>

                {/* Response */}
                {avaliacao.response && (
                  <div className="mt-4 pl-4 border-l-2 border-gseed-500">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Resposta do profissional:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {avaliacao.response}
                    </p>
                    {avaliacao.responded_at && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(avaliacao.responded_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvaliacaoList;
