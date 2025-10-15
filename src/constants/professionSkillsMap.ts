/**
 * Mapeamento de Profissões → Habilidades Relevantes
 * Cada profissão tem suas habilidades específicas
 */

export const PROFESSION_SKILLS_MAP: Record<string, string[]> = {
  // Tecnologia
  'desenvolvimento-web': [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
    'HTML', 'CSS', 'PHP', 'Laravel', 'SQL', 'PostgreSQL', 'MySQL',
    'MongoDB', 'Git', 'Docker', 'AWS', 'Azure'
  ],
  'desenvolvimento-mobile': [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java',
    'JavaScript', 'TypeScript', 'Firebase', 'Git'
  ],
  'ui-ux-design': [
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
    'UI Design', 'UX Design', 'Design Thinking', 'Prototipagem',
    'Wireframing', 'User Research'
  ],
  'devops': [
    'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'Google Cloud',
    'Linux', 'Git', 'Jenkins', 'Terraform', 'Ansible'
  ],
  'analise-dados': [
    'Python', 'SQL', 'Excel Avançado', 'Power BI', 'Tableau',
    'Análise de Dados', 'Business Intelligence', 'Statistics'
  ],
  'ciencia-dados': [
    'Python', 'R', 'Machine Learning', 'Deep Learning', 'TensorFlow',
    'SQL', 'Statistics', 'Data Visualization', 'Jupyter'
  ],
  
  // Design e Criação
  'design-grafico': [
    'Photoshop', 'Illustrator', 'InDesign', 'CorelDRAW',
    'Design Thinking', 'Tipografia', 'Branding'
  ],
  'motion-design': [
    'After Effects', 'Premiere Pro', 'Cinema 4D', 'Blender',
    'Animation', 'Video Editing'
  ],
  'ilustracao': [
    'Illustrator', 'Photoshop', 'Procreate', 'Drawing',
    'Character Design', 'Digital Painting'
  ],
  'fotografia': [
    'Lightroom', 'Photoshop', 'Camera Operation', 'Lighting',
    'Photo Editing', 'Composition'
  ],
  'videomaker': [
    'Premiere Pro', 'After Effects', 'Final Cut Pro', 'DaVinci Resolve',
    'Camera Operation', 'Video Editing', 'Color Grading'
  ],
  'arquitetura': [
    'AutoCAD', 'SketchUp', 'Revit', '3D Studio Max', 'Lumion',
    'Arquitetura', 'Projeto Arquitetônico', 'Desenho Técnico'
  ],
  'arquiteto': [
    'AutoCAD', 'SketchUp', 'Revit', '3D Studio Max', 'Lumion',
    'Arquitetura', 'Projeto Arquitetônico', 'Desenho Técnico'
  ],
  
  // Marketing e Comunicação
  'marketing-digital': [
    'Google Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads',
    'Google Analytics', 'SEO', 'SEM', 'E-mail Marketing',
    'Content Marketing', 'Inbound Marketing', 'Growth Hacking'
  ],
  'social-media': [
    'Instagram Ads', 'Facebook Ads', 'TikTok Ads', 'Content Marketing',
    'Copywriting', 'Canva', 'Social Media Strategy', 'Community Management'
  ],
  'copywriting': [
    'Copywriting', 'Storytelling', 'SEO', 'Content Marketing',
    'Persuasive Writing', 'Marketing'
  ],
  'seo': [
    'SEO', 'Google Analytics', 'Google Search Console', 'SEM',
    'Keyword Research', 'Link Building', 'Content Marketing'
  ],
  'redacao': [
    'Redação', 'Copywriting', 'Storytelling', 'SEO',
    'Content Marketing', 'Gramática', 'Revisão'
  ],
  'traducao': [
    'Tradução', 'Inglês', 'Espanhol', 'Francês',
    'Localização', 'Revisão', 'Interpretação'
  ],
  
  // Consultoria e Gestão
  'consultoria-negocios': [
    'Business Intelligence', 'Planejamento Estratégico', 'Análise de Dados',
    'Excel Avançado', 'Power BI', 'Gestão de Projetos', 'Negociação'
  ],
  'gestao-projetos': [
    'Gestão de Projetos', 'Scrum', 'Kanban', 'Agile', 'MS Project',
    'Jira', 'Liderança', 'Comunicação'
  ],
  'consultoria-investimentos': [
    'Análise Financeira', 'Excel Avançado', 'Investimentos',
    'Mercado Financeiro', 'Gestão de Carteiras'
  ],
  'investimentos': [
    'Análise Financeira', 'Excel Avançado', 'Investimentos',
    'Mercado Financeiro', 'Gestão de Carteiras'
  ],
  'gestao-financeira': [
    'Excel Avançado', 'Contabilidade', 'Finanças', 'Orçamento',
    'Análise Financeira', 'Power BI'
  ],
  'financeiro': [
    'Excel Avançado', 'Contabilidade', 'Finanças', 'Orçamento',
    'Análise Financeira', 'Power BI'
  ],
  'recursos-humanos': [
    'Recrutamento e Seleção', 'Gestão de Pessoas', 'Comunicação',
    'Liderança', 'Excel Avançado', 'Treinamento'
  ],
  
  // Profissões Regulamentadas
  'advocacia': [
    'Direito Civil', 'Direito Trabalhista', 'Direito Penal',
    'Peticionamento', 'Oratória', 'Negociação'
  ],
  'advogado': [
    'Direito Civil', 'Direito Trabalhista', 'Direito Penal',
    'Peticionamento', 'Oratória', 'Negociação'
  ],
  'contabilidade': [
    'Contabilidade', 'Excel Avançado', 'Legislação Tributária',
    'Declaração de Impostos', 'Auditoria', 'Gestão Financeira'
  ],
  'contador': [
    'Contabilidade', 'Excel Avançado', 'Legislação Tributária',
    'Declaração de Impostos', 'Auditoria', 'Gestão Financeira'
  ],
  'psicologia': [
    'Psicologia', 'Terapia', 'Aconselhamento', 'Empatia',
    'Comunicação', 'Escuta Ativa'
  ],
  'psicologo': [
    'Psicologia', 'Terapia', 'Aconselhamento', 'Empatia',
    'Comunicação', 'Escuta Ativa'
  ],
  'engenharia-civil': [
    'AutoCAD', 'Revit', 'Cálculo Estrutural', 'Gestão de Obras',
    'Orçamento de Obras', 'Desenho Técnico'
  ],
  'engenheiro-civil': [
    'AutoCAD', 'Revit', 'Cálculo Estrutural', 'Gestão de Obras',
    'Orçamento de Obras', 'Desenho Técnico'
  ],
  
  // Saúde e Bem-estar
  'personal-trainer': [
    'Educação Física', 'Nutrição Esportiva', 'Musculação',
    'Treinamento Funcional', 'Avaliação Física'
  ],
  'nutricionista': [
    'Nutrição', 'Dietética', 'Avaliação Nutricional',
    'Educação Alimentar', 'Planejamento de Dietas'
  ],
  'nutricao': [
    'Nutrição', 'Dietética', 'Avaliação Nutricional',
    'Educação Alimentar', 'Planejamento de Dietas'
  ],
  'terapeuta': [
    'Terapia', 'Aconselhamento', 'Empatia', 'Escuta Ativa',
    'Comunicação', 'Técnicas Terapêuticas'
  ],
  'terapia': [
    'Terapia', 'Aconselhamento', 'Empatia', 'Escuta Ativa',
    'Comunicação', 'Técnicas Terapêuticas'
  ],
  'fisioterapeuta': [
    'Fisioterapia', 'Reabilitação', 'Avaliação Postural',
    'Exercícios Terapêuticos', 'Anatomia'
  ],
  
  // Arte e Cultura
  'musica': [
    'Teoria Musical', 'Instrumento', 'Composição',
    'Produção Musical', 'Arranjo'
  ],
  'producao-musical': [
    'Produção Musical', 'Mixagem', 'Masterização',
    'Logic Pro', 'Ableton', 'Pro Tools'
  ],
  'professor-musica': [
    'Teoria Musical', 'Pedagogia Musical', 'Instrumento',
    'Comunicação', 'Didática'
  ],
  
  // Educação
  'professor': [
    'Pedagogia', 'Didática', 'Comunicação', 'Planejamento de Aulas',
    'Avaliação', 'Gestão de Sala'
  ],
  'tutor': [
    'Tutoria', 'Comunicação', 'Didática', 'Paciência',
    'Explicação', 'Acompanhamento'
  ],
  'mentoria': [
    'Mentoria', 'Coaching', 'Liderança', 'Comunicação',
    'Feedback', 'Desenvolvimento'
  ],
  
  // Outros
  'assistente-virtual': [
    'Organização', 'Excel', 'Google Workspace', 'Gestão de Agenda',
    'Comunicação', 'E-mail', 'Atendimento'
  ],
  'atendimento-cliente': [
    'Atendimento ao Cliente', 'Comunicação', 'Empatia',
    'CRM', 'Chat', 'Resolução de Problemas'
  ],
};

/**
 * Retorna as habilidades relevantes para uma profissão
 */
export function getSkillsForProfession(professionValue: string): string[] {
  return PROFESSION_SKILLS_MAP[professionValue] || [];
}
