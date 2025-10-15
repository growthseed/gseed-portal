/**
 * Lista Real de Igrejas ASDMR por Estado
 * Extraído da lista oficial de endereços
 */

export const CHURCH_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'PR', label: 'Paraná' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'TO', label: 'Tocantins' },
] as const;

export const CHURCHES_BY_STATE: Record<string, string[]> = {
  AC: ['Rio Branco'],
  
  AL: ['Arapiraca', 'Coqueiro Seco', 'Cururipe', 'Estrela de Alagoas', 'Maceió - Clima Bom', 'Maceió - Feitosa', 'Maceió - Benedito Bentes', 'Senador Rui Palmeira'],
  
  AM: ['Careiro Castanho', 'Manaus - Presidente Vargas', 'Manaus - Santa Etelvina', 'Manaus - Tancredo Neves', 'Purupuru'],
  
  AP: ['Alto Alegre', 'Macapá - Corre Água', 'Macapá - Pirativa', 'Macapá - Novo Horizonte', 'Macapá - Perpétuo Socorro', 'Porto Grande', 'Santana'],
  
  BA: ['Araci', 'Barreiras', 'Brumado', 'Buerarema', 'Cabaceiras do Paraguaçu', 'Caetité', 'Conceição do Coité', 'Eunápolis', 'Feira de Santana - Santo Antônio', 'Feira de Santana - Tomba', 'Guanambi', 'Ibicoara', 'Inhambupe', 'Itabuna', 'Jacobina', 'Lauro de Freitas', 'Mirante', 'Palmas de Monte Alto', 'Paulo Afonso', 'Porto Seguro', 'Ribeira do Pombal', 'Salvador - São Tomé', 'Salvador - Altos de Coutos', 'Salvador - Valéria', 'Salvador - Bairro da Paz', 'Salvador - Iapi', 'Santo Estêvão', 'Senhor do Bonfim', 'Serrinha', 'Tanhaçu', 'Teixeira de Freitas', 'Vitória da Conquista'],
  
  CE: ['Abaiara', 'Camocim', 'Caucaia', 'Fortaleza - Amadeu Furtado', 'Fortaleza - Palmeiras', 'Fortim', 'Iguatu', 'Juazeiro do Norte', 'Quixada', 'Sobral'],
  
  DF: ['Brasília - Asa Norte', 'Brasília - Ceilândia Sul', 'Brasília - Taguatinga', 'Estrutural', 'Gama', 'Paranoá', 'Sobradinho'],
  
  ES: ['Aracruz - Praia do Coqueiral', 'Aracruz - Bela Vista', 'Aracruz - Vila Rica', 'Araçatiba (Viana)', 'Cachoeiro de Itapemirim', 'Cariacica', 'Ibiraçu', 'Linhares', 'Nova Venécia', 'Serra - Serra Dourada', 'Serra - Planalto Serrano', 'Vila do Itapemirim', 'Vila Velha - Ulisses Guimarães', 'Vila Velha - Ilha dos Ayres', 'Vitória'],
  
  GO: ['Anapolis', 'Aparecida de Goiânia', 'Cachoeira Alta', 'Caldas Novas', 'Catalão', 'Goianésia', 'Goiânia - Vila São José', 'Goiânia - Setor Marechal Rondon', 'Goiânia - Alice Barbosa', 'Goiânia - Morada do Sol', 'Jaragua', 'Jataí', 'Luziânia', 'Padre Bernardo', 'Pirinopolis', 'Rio Verde', 'Santa Terezinha', 'Uruaçu'],
  
  MA: ['Açailândia', 'Bacabal', 'Balsas', 'Cajari', 'Coroatá', 'Estreito', 'Governador Nunes Freire', 'Grajau', 'Icatu', 'Imperatriz - João Castelo', 'Imperatriz - Centro', 'Pindaré Mirim', 'Pio Xii', 'Pirapemas', 'Santa Inês', 'São Bernardo', 'São João dos Patos', 'São Luis - Anjo da Guarda', 'São Luis - Tirirical', 'São Luís - Cidade Olímpica', 'São Luís - Janaína', 'São Luís Gonzaga', 'Tasso Fragoso', 'Timon', 'Vila Nova dos Martírios', 'Zé Doca'],
  
  MG: ['Araxá', 'Barbacena', 'Belo Horizonte - Minaslândia', 'Belo Horizonte - Piratininga', 'Belo Horizonte - Copacabana', 'Belo Horizonte - Santa Tereza', 'Cambuí', 'Conceição do Mato Dentro', 'Conceição do Rio Verde', 'Conselheiro Lafaiete', 'Contagem', 'Coronel Fabriciano', 'Divinópolis', 'Entre Rios de Minas', 'Estiva', 'Governador Valadares', 'Ibirama', 'Ibitira', 'Igarapé', 'Itacarambi', 'Ituiutaba', 'Joaima', 'Joíma', 'Juiz de Fora', 'Lagoa Formosa', 'Montes Claros', 'Nanuque', 'Patos de Minas', 'Pirapora', 'Poços de Caldas', 'Ribeirao das Neves', 'São Francisco', 'São João das Missões', 'Serro', 'Sete Lagoas', 'Simonésia', 'Teofilo Otoni', 'Uberlandia - Canaã', 'Uberlândia - Martins', 'Vespasiano'],
  
  MS: ['Anastácio', 'Bonito', 'Campo Grande - Vila Carvalho', 'Campo Grande - Jardim Aeroporto', 'Campo Grande - Aero-rancho', 'Corumbá', 'Dourados', 'Itaporã', 'Sete Quedas', 'Três Lagoas'],
  
  MT: ['Alta Floresta', 'Barra do Garça', 'Cuiabá', 'Peixoto de Azevedo', 'Rondonópolis', 'Sinop', 'Tangará da Serra', 'Água Boa'],
  
  PA: ['Abaetetuba', 'Altamira', 'Anapu', 'Barcarena', 'Belém - Cabanagem', 'Belém - Pedreira', 'Belém - Pratinha II', 'Belém - Aguas Lindas', 'Bragança', 'Breu Branco', 'Castanhal', 'Concórdia do Pará', 'Curuçá', 'Dom Eliseu', 'Goianésia', 'Jacundá', 'Marabá - Nova Marabá', 'Marabá - Liberdade', 'Marituba', 'Paragominas', 'Parauapebas', 'Redenção', 'Santa Izabel do Pará', 'Santarém', 'São Domingos do Araguaia', 'São Felix do Xingú', 'Tailândia', 'Tomé - Açú', 'Tucruí', 'Tucumã'],
  
  PB: ['Campina Grande', 'Guarabira', 'João Pessoa', 'Nova Cruz', 'Poço Comprido'],
  
  PE: ['Agua Preta', 'Belo Jardim', 'Caruaru', 'Chã Grande', 'Igarassu', 'João Alfredo', 'Limoeiro', 'Ouricuri', 'Petrolina', 'Petrolândia', 'Pombos', 'Recife', 'Riacho das Almas', 'Vitória de Santo Antão'],
  
  PI: ['Floriano', 'Parnaíba', 'Teresina'],
  
  PR: ['Almirante Tamandare - São Pedro', 'Almirante Tamandaré - Botiatuba', 'Almirante Tamandaré - Jardim Silvana', 'Angulo', 'Apucarana', 'Cambará', 'Cascavel', 'Castro', 'Colombo', 'Curitiba - Xaxim', 'Curitiba - São Francisco', 'Curitiba - Abranches', 'Cândido de Abreu', 'Fazenda Rio Grande', 'Foz do Iguaçu', 'Guarapuava', 'Londrina', 'Maringá', 'Morretes', 'Pinhalão', 'Ponta Grossa', 'Prudentópolis', 'Tamarana', 'Umuarama'],
  
  RJ: ['Duque de Caxias - Imbariê', 'Duque de Caxias - 25 de Agosto', 'Itaborai', 'Itaguaí', 'Macaé', 'Magé - Impiranga', 'Magé - Piabetá', 'Nova Friburgo', 'Nova Iguaçu - Carlos Sampaio', 'Nova Iguaçu - Ponto Chic', 'Paraty', 'Resende', 'Rio de Janeiro - Cascadura', 'Rio de Janeiro - Ilha de Guaratiba', 'Rio de Janeiro - Nova Cidade', 'São Gonçalo', 'São João de Meriti', 'Três Rios', 'Ubatuba', 'Volta Redonda'],
  
  RN: ['Natal'],
  
  RO: ['Ariquemes', 'Cacoal', 'Costa Marques', 'Guajará-mirim', 'Ji-paraná', 'Porto Velho', 'Presidente Médici', 'São Miguel do Guaporé'],
  
  RR: ['Boa Vista - Tancredo Neves', 'Boa Vista - Santa Luzia'],
  
  RS: ['Bagé', 'Bom Retiro', 'Cachoeirinha', 'Crissiumal', 'Gravataí', 'Lavras do Sul', 'Novo Hamburgo', 'Pelotas', 'Porto Alegre', 'Rio Grande'],
  
  SC: ['Camboriu', 'Chapeco', 'Criciuma', 'Florianopolis', 'Ibirama', 'Imaruí', 'Indaial', 'Itajai', 'Joinville', 'Tubarão'],
  
  SE: ['Aquidabã', 'Aracaju', 'Aracajú', 'Cumbe', 'Estância', 'Itabaiana', 'Nossa Senhora das Dores', 'Nossa Senhora do Socorro', 'Salgado', 'Siriri'],
  
  SP: ['Aparecida', 'Artur Nogueira', 'Assis', 'Atibaia', 'Bom Jesus dos Perdões', 'Botucatu', 'Bragança Paulista', 'Caiabu', 'Caieiras', 'Cajati', 'Campinas - Parque Industrial', 'Campinas - Shalon', 'Capão Bonito', 'Carapicuíba', 'Cesário Lange', 'Conchal - Centro', 'Conchal - Vivaldini', 'Elias Fausto', 'Ferraz de Vasconcelos', 'Guapiara', 'Guarulhos', 'Hortôlandia', 'Ibiúna', 'Indaiatuba', 'Itanhaém', 'Itapetininga', 'Itu', 'Jaú', 'Jundiaí', 'Juquiá - Cedro', 'Juquiá - Estação', 'Limeira', 'Lins', 'Louveira', 'Marília', 'Mogi das Cruzes', 'Pariquera - Açú', 'Perus', 'Pirassununga', 'Pontal', 'Praia Grande', 'Presidente Prudente', 'Registro', 'Ribeirão Preto', 'Rio Claro', 'Salesópolis', 'São Bernardo', 'São Caetano do Sul', 'São José do Rio Preto - Jardim Marajo', 'São José do Rio Preto - Estância São Judas', 'São José dos Campos', 'São Paulo - Vila Curuça', 'São Paulo - Vila Matilde', 'São Paulo - Alto da Lapa', 'São Paulo - Vila Rubi', 'São Paulo - Alto da Mooca', 'São Paulo - Vila Maria Alta', 'São Paulo - Artur Alvim', 'São Paulo - Vila Taquari', 'São Paulo - Jardim Guarujá', 'São Paulo - Vila Ré', 'São Paulo - Guaianazes', 'São Paulo - Jd. São José', 'São Vicente', 'Socorro', 'Sorocaba - Jd. Itanguá', 'Sorocaba - Jardim Santa Rosa', 'Suzano'],
  
  TO: ['Aguiarnópolis', 'Araguaina', 'Araguaína', 'Axixá', 'Palmas', 'Paraiso', 'Praia Norte'],
};

export const getChurchesByState = (state: string): string[] => {
  return CHURCHES_BY_STATE[state] || [];
};
