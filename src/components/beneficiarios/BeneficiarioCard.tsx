import { Badge } from '@/components/ui/badge-advanced';
import { 
  User, 
  MapPin, 
  Calendar, 
  Activity, 
  Pill,
  ChevronRight,
  Star,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeneficiarioCardProps {
  id: string;
  nome: string;
  foto?: string;
  idade: number;
  sexo: 'M' | 'F' | 'Outro';
  cpf: string;
  cidade: string;
  estado: string;
  status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado';
  isVIP?: boolean;
  renovacaoProxima?: boolean;
  temAlerta?: boolean;
  totalConsultas: number;
  totalMedicamentos: number;
  ultimaConsulta?: string;
  onClick?: () => void;
  className?: string;
}

export function BeneficiarioCard({
  id,
  nome,
  foto,
  idade,
  sexo,
  cpf,
  cidade,
  estado,
  status,
  isVIP = false,
  renovacaoProxima = false,
  temAlerta = false,
  totalConsultas,
  totalMedicamentos,
  ultimaConsulta,
  onClick,
  className
}: BeneficiarioCardProps) {
  
  // Função para obter cor do status
  const getStatusVariant = () => {
    switch (status) {
      case 'ativo':
        return 'active';
      case 'inativo':
        return 'inactive';
      case 'pendente':
        return 'pending';
      case 'bloqueado':
        return 'alert';
      default:
        return 'default';
    }
  };

  // Função para mascarar CPF
  const maskCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})\d{3}(\d{3})(\d{2})/, '$1.***.***-$2');
  };

  // Função para obter iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        'group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-300',
        className
      )}
      onClick={onClick}
    >
      {/* Badge de destaque (canto superior direito) */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        {isVIP && (
          <Badge variant="gradient" icon={<Star size={12} />}>
            VIP
          </Badge>
        )}
        {temAlerta && (
          <Badge variant="alert" icon={<AlertCircle size={12} />}>
            Alerta
          </Badge>
        )}
      </div>

      <div className="p-6">
        {/* Seção do Header com Foto e Nome */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {foto ? (
              <img
                src={foto}
                alt={nome}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-blue-100">
                {getInitials(nome)}
              </div>
            )}
            {/* Indicador de status online/ativo */}
            {status === 'ativo' && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          {/* Nome e Informações Básicas */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
              {nome}
            </h3>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <User size={14} />
                {idade} anos • {sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Feminino' : 'Outro'}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              CPF: {maskCPF(cpf)}
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin size={16} className="text-gray-400" />
          <span>{cidade} - {estado}</span>
        </div>

        {/* Status e Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={getStatusVariant()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          
          {renovacaoProxima && (
            <Badge variant="pending" icon={<Calendar size={12} />}>
              Renovação Próxima
            </Badge>
          )}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Activity size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Consultas</p>
              <p className="text-lg font-bold text-gray-900">{totalConsultas}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Pill size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Medicamentos</p>
              <p className="text-lg font-bold text-gray-900">{totalMedicamentos}</p>
            </div>
          </div>
        </div>

        {/* Última Consulta */}
        {ultimaConsulta && (
          <div className="text-xs text-gray-500 mb-4">
            Última consulta: {ultimaConsulta}
          </div>
        )}

        {/* Botão de Ação */}
        <button className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group-hover:scale-[1.02]">
          Ver Detalhes
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Efeito de hover (gradiente sutil no fundo) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 transition-all duration-300 pointer-events-none rounded-xl"></div>
    </div>
  );
}
