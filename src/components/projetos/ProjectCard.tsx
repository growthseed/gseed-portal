import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  DollarSign,
  Briefcase,
  MapPin,
  Clock,
  Eye,
  MessageSquare
} from 'lucide-react';
import type { Project } from '@/types/database.types';

interface ProjectCardProps {
  projeto: Project;
}

export function ProjectCard({ projeto }: ProjectCardProps) {
  
  const formatCurrency = (value?: number) => {
    if (!value) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Recente';
    const now = new Date();
    const then = new Date(date);
    const diffDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return `${Math.floor(diffDays / 30)} meses atrás`;
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link
      to={`/projetos/${projeto.id}`}
      className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-gseed-500 dark:hover:border-gseed-500 transition-all"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gseed-600 dark:group-hover:text-gseed-400 transition-colors line-clamp-2">
              {projeto.title}
            </h3>
          </div>
          {projeto.is_urgent && (
            <Badge variant="destructive" className="ml-2 flex-shrink-0">
              <Clock size={12} className="mr-1" />
              Urgente
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Briefcase size={14} />
          <span>{projeto.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
          {projeto.description}
        </p>

        {/* Skills */}
        {projeto.required_skills && projeto.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {projeto.required_skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {projeto.required_skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{projeto.required_skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          {/* Budget */}
          {(projeto.budget_min || projeto.budget_max) && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign size={14} className="text-gseed-600 dark:text-gseed-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {projeto.budget_min && projeto.budget_max && projeto.budget_min !== projeto.budget_max
                  ? `${formatCurrency(projeto.budget_min)} - ${formatCurrency(projeto.budget_max)}`
                  : formatCurrency(projeto.budget_min || projeto.budget_max)}
              </span>
            </div>
          )}

          {/* Deadline */}
          {projeto.deadline_date && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar size={14} />
              <span>Prazo: {new Date(projeto.deadline_date).toLocaleDateString('pt-BR')}</span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin size={14} />
            <span>
              {projeto.location_type === 'remote' 
                ? 'Remoto' 
                : `${projeto.location_city}, ${projeto.location_state}`
              }
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Client */}
          <div className="flex items-center gap-2">
            {projeto.client?.avatar_url ? (
              <img
                src={projeto.client.avatar_url}
                alt={projeto.client.company_name || projeto.client.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gseed-500 to-gseed-600 flex items-center justify-center text-white font-bold text-xs">
                {getInitials(projeto.client?.company_name || projeto.client?.name)}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(projeto.created_at)}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {projeto.client?.company_name || projeto.client?.name || 'Empresa'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{projeto.views_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={14} />
              <span>{projeto.proposals_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
