export interface Projeto {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string;
  profissao_necessaria: string;
  habilidades: string[];
  orcamento: string;
  prazo: 'sem_prazo' | 'com_prazo';
  data_prazo?: string;
  anexos?: string[];
  status: 'aberto' | 'em_andamento' | 'concluido' | 'cancelado';
  created_at: string;
  updated_at: string;
  total_propostas: number;
  visualizacoes: number;
}

export interface CreateProjetoData {
  titulo: string;
  descricao: string;
  profissao: string;
  habilidades: string[];
  orcamento: string;
  prazo: 'sem_prazo' | 'com_prazo';
  dataPrazo?: string;
  anexos?: File[];
}

export interface Proposta {
  id: string;
  projeto_id: string;
  profissional_id: string;
  valor: number;
  prazo: string;
  mensagem: string;
  status: 'pendente' | 'aceita' | 'recusada' | 'em_analise';
  visualizada: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePropostaData {
  projeto_id: string;
  valor: number;
  prazo: string;
  mensagem: string;
}
