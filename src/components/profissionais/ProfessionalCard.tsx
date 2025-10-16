import { Badge } from '@/components/ui/badge-advanced';
import { 
  Star,
  MapPin,
  MessageCircle,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProfessionalCardProps {
  id: string;
  nome: string;
  profissao: string;
  avatar?: string;
  fotoCapa?: string;
  descricao: string;
  cidade: string;
  estado: string;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  isNovo?: boolean;
  isTalentoEmAscensao?: boolean;
  whatsapp?: string;
  portfolioImages?: string[];
  onClick?: () => void;
  className?: string;
}

export function ProfessionalCard({
  id: _id,
  nome,
  profissao,
  avatar,
  fotoCapa,
  descricao,
  cidade,
  estado,
  avaliacaoMedia,
  totalAvaliacoes,
  isNovo = false,
  isTalentoEmAscensao = false,
  whatsapp,
  portfolioImages = [],
  onClick,
  className
}: ProfessionalCardProps) {
  
  // Função para obter iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Renderizar estrelas
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={cn(
          'transition-colors',
          index < Math.floor(avaliacaoMedia)
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        )}
      />
    ));
  };

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-gseed-300 dark:hover:border-gseed-600',
        className
      )}
      onClick={onClick}
    >
      {/* Foto de Capa */}
      <div className="relative h-32 bg-gradient-to-br from-gseed-400 to-gseed-600 overflow-hidden">
        {fotoCapa ? (
          <img
            src={fotoCapa}
            alt={`Capa de ${nome}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          // Gradiente padrão se não houver foto
          <div className="w-full h-full bg-gradient-to-br from-gseed-400 via-gseed-500 to-gseed-600" />
        )}
        
        {/* Overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Badges de Destaque (canto superior direito) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isNovo && (
            <Badge 
              variant="gradient" 
              icon={<Sparkles size={12} />}
              className="shadow-lg"
            >
              NOVO
            </Badge>
          )}
          {isTalentoEmAscensao && (
            <Badge 
              variant="info" 
              icon={<TrendingUp size={12} />}
              className="shadow-lg bg-yellow-400 text-yellow-900 border-0"
            >
              Talento em Ascensão
            </Badge>
          )}
        </div>
      </div>

      {/* Avatar sobreposto */}
      <div className="px-6 -mt-8 relative z-10">
        <div className="relative inline-block">
          {avatar ? (
            <img
              src={avatar}
              alt={nome}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gseed-500 to-gseed-700 flex items-center justify-center text-white font-bold text-lg ring-4 ring-white dark:ring-gray-800 shadow-lg">
              {getInitials(nome)}
            </div>
          )}
          {/* Indicador online (opcional) */}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-gseed-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3">
        {/* Nome e Profissão */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-gseed-600 dark:group-hover:text-gseed-400 transition-colors">
            {nome}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{profissao}</p>
        </div>

        {/* Avaliação */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {renderStars()}
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {avaliacaoMedia.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({totalAvaliacoes})
          </span>
        </div>

        {/* Localização */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <MapPin size={14} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{cidade}, {estado}</span>
        </div>

        {/* Descrição */}
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
          {descricao}
        </p>

        {/* Portfólio Preview (se houver) */}
        {portfolioImages.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {portfolioImages.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Portfolio ${idx + 1}`}
                className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700 hover:border-gseed-400 transition-colors flex-shrink-0"
              />
            ))}
            {portfolioImages.length > 3 && (
              <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 flex-shrink-0">
                +{portfolioImages.length - 3}
              </div>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="flex-1 py-2.5 px-4 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            Ver Perfil
          </button>
          
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-lg transition-all duration-300 hover:scale-110"
              title="WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Efeito hover sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-gseed-50/0 to-gseed-100/0 group-hover:from-gseed-50/30 group-hover:to-gseed-100/20 transition-all duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );
}
