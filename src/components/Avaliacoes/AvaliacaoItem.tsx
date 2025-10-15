import React from 'react';
import { Star, User } from 'lucide-react';

interface AvaliacaoItemProps {
  rating: number;
  comment: string;
  clientName: string;
  createdAt: string;
}

export default function AvaliacaoItem({ rating, comment, clientName, createdAt }: AvaliacaoItemProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-full p-2">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{clientName}</p>
            <p className="text-xs text-gray-500">{formatDate(createdAt)}</p>
          </div>
        </div>
        
        {/* Rating Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      {comment && (
        <p className="text-gray-700 text-sm leading-relaxed">
          {comment}
        </p>
      )}
    </div>
  );
}
