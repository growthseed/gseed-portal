/**
 * Profissões disponíveis no Gseed Works
 * 
 * IMPORTANTE: A opção "Outro" permite que o usuário digite uma profissão customizada
 */

export const PROFESSIONS = [
  // Tecnologia
  { value: 'desenvolvimento-web', label: 'Desenvolvimento Web' },
  { value: 'desenvolvimento-mobile', label: 'Desenvolvimento Mobile' },
  { value: 'ui-ux-design', label: 'UI/UX Design' },
  { value: 'devops', label: 'DevOps' },
  { value: 'analise-dados', label: 'Análise de Dados' },
  { value: 'ciencia-dados', label: 'Ciência de Dados' },
  
  // Design e Criação
  { value: 'design-grafico', label: 'Design Gráfico' },
  { value: 'motion-design', label: 'Motion Design' },
  { value: 'ilustracao', label: 'Ilustração' },
  { value: 'fotografia', label: 'Fotografia' },
  { value: 'videomaker', label: 'Videomaker' },
  { value: 'arquitetura', label: 'Arquitetura' },
  { value: 'arquiteto', label: 'Arquiteto' },
  
  // Marketing e Comunicação
  { value: 'marketing-digital', label: 'Marketing Digital' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'copywriting', label: 'Copywriting' },
  { value: 'seo', label: 'SEO' },
  { value: 'redacao', label: 'Redação' },
  { value: 'traducao', label: 'Tradução' },
  
  // Consultoria e Gestão
  { value: 'consultoria-negocios', label: 'Consultoria de Negócios' },
  { value: 'gestao-projetos', label: 'Gestão de Projetos' },
  { value: 'consultoria-investimentos', label: 'Consultoria de Investimentos' },
  { value: 'investimentos', label: 'Investimentos' },
  { value: 'gestao-financeira', label: 'Gestão Financeira' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'recursos-humanos', label: 'Recursos Humanos' },
  
  // Profissões Regulamentadas
  { value: 'advocacia', label: 'Advocacia' },
  { value: 'advogado', label: 'Advogado' },
  { value: 'contabilidade', label: 'Contabilidade' },
  { value: 'contador', label: 'Contador' },
  { value: 'psicologia', label: 'Psicologia' },
  { value: 'psicologo', label: 'Psicólogo' },
  { value: 'engenharia-civil', label: 'Engenharia Civil' },
  { value: 'engenheiro-civil', label: 'Engenheiro Civil' },
  
  // Saúde e Bem-estar
  { value: 'personal-trainer', label: 'Personal Trainer' },
  { value: 'nutricionista', label: 'Nutricionista' },
  { value: 'nutricao', label: 'Nutrição' },
  { value: 'terapeuta', label: 'Terapeuta' },
  { value: 'terapia', label: 'Terapia' },
  { value: 'fisioterapeuta', label: 'Fisioterapeuta' },
  
  // Arte e Cultura (Suas adições)
  { value: 'musica', label: 'Música' },
  { value: 'producao-musical', label: 'Produção Musical' },
  { value: 'professor-musica', label: 'Professor de Música' },
  
  // Educação
  { value: 'professor', label: 'Professor' },
  { value: 'tutor', label: 'Tutor' },
  { value: 'mentoria', label: 'Mentoria' },
  
  // Outros
  { value: 'assistente-virtual', label: 'Assistente Virtual' },
  { value: 'atendimento-cliente', label: 'Atendimento ao Cliente' },
  { value: 'outro', label: 'Outro (especifique)' },
] as const;

export const PROFESSION_CATEGORIES = [
  { value: 'tecnologia', label: 'Tecnologia' },
  { value: 'design-criacao', label: 'Design e Criação' },
  { value: 'marketing-comunicacao', label: 'Marketing e Comunicação' },
  { value: 'consultoria-gestao', label: 'Consultoria e Gestão' },
  { value: 'profissoes-regulamentadas', label: 'Profissões Regulamentadas' },
  { value: 'saude-bem-estar', label: 'Saúde e Bem-estar' },
  { value: 'arte-cultura', label: 'Arte e Cultura' },
  { value: 'educacao', label: 'Educação' },
  { value: 'outros', label: 'Outros' },
] as const;

export const SKILLS = [
  // Tech Skills
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'PHP', 'Laravel',
  'Ruby', 'Ruby on Rails', 'C#', '.NET', 'Swift', 'Kotlin', 'Flutter',
  'React Native', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD',
  
  // Design Skills
  'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
  'After Effects', 'Premiere Pro', 'Blender', '3D Studio Max', 'AutoCAD',
  'SketchUp', 'UI Design', 'UX Design', 'Design Thinking', 'Prototipagem',
  
  // Marketing Skills
  'Google Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads',
  'Google Analytics', 'SEO', 'SEM', 'E-mail Marketing', 'Content Marketing',
  'Inbound Marketing', 'Growth Hacking', 'Copywriting', 'Storytelling',
  
  // Business Skills
  'Gestão de Projetos', 'Scrum', 'Kanban', 'Agile', 'Excel Avançado',
  'Power BI', 'Tableau', 'Análise de Dados', 'Business Intelligence',
  'Planejamento Estratégico', 'Gestão de Pessoas', 'Negociação',
  
  // Soft Skills
  'Comunicação', 'Liderança', 'Trabalho em Equipe', 'Resolução de Problemas',
  'Criatividade', 'Pensamento Crítico', 'Adaptabilidade', 'Empatia',
  
  // Outras Habilidades
  'Outro (especifique)',
] as const;

export type ProfessionValue = typeof PROFESSIONS[number]['value'];
export type ProfessionCategoryValue = typeof PROFESSION_CATEGORIES[number]['value'];
export type SkillValue = typeof SKILLS[number];
