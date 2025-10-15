import React from 'react';
import { Star } from 'lucide-react';
import AvaliacaoItem from './AvaliacaoItem';

interface Avaliacao {
  id: string;
  rating: number;
  comment: string;
  client_name: string;
  created_at: string;
}

interface AvaliacaoListProps {
  avaliacoes: Avaliacao[];
  averageRating: number;
  totalAvaliacoes: number;
}

export default function AvaliacaoList({ avaliacoes, averageRating, totalAvaliacoes }: AvaliacaoListProps) {
  if (totalAvaliacoes === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">Ainda não há avaliações</p>
        <p className="text-sm text-gray-500 mt-1">
          Seja o primeiro a avaliar este profissional
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Rating Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = avaliacoes.filter(a => a.rating === stars).length;
              const percentage = (count / totalAvaliacoes) * 100;
              
              return (
                <div key={stars} className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-600 w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 rounded-full h-2 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Avaliações de Clientes
        </h3>
        {avaliacoes.map((avaliacao) => (
          <AvaliacaoItem
            key={avaliacao.id}
            rating={avaliacao.rating}
            comment={avaliacao.comment}
            clientName={avaliacao.client_name}
            createdAt={avaliacao.created_at}
          />
        ))}
      </div>
    </div>
  );
}
