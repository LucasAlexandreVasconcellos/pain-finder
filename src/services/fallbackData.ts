import { TriageResponse, TriageQuestion, PrescriptionResponse, PartnerProduct, PainTrendItem } from '../types';

export const INITIAL_PARTNER_PRODUCTS: PartnerProduct[] = [
  {
    id: 'p1',
    name: 'Almofada Lombar Ortopédica Viscoelástica Fibrasca D45',
    category: 'Ergonomia & Saúde',
    type: 'physical',
    painTarget: 'Dores nas costas, lombar, pescoço e fadiga postural no home office',
    priceBRL: 289.0,
    rating: 4.9,
    affiliateUrl: 'https://www.amazon.com.br/s?k=almofada+lombar+viscoelastica+fibrasca',
    description: 'Espuma viscoelástica aeroespacial D45 com memória anatômica e cintas elásticas duplas com fivelas de alta pressão para fixação em cadeiras de escritório.',
    verifiedBadge: true
  },
  {
    id: 'p2',
    name: 'Template Notion Second Brain & Life OS 2.0 (Tiago Forte / Thomas Frank)',
    category: 'Produtividade & Foco',
    type: 'digital',
    format: 'Template / Sistema',
    painTarget: 'Procrastinação, falta de foco, desorganização mental e estudos',
    priceBRL: 97.0,
    rating: 4.95,
    affiliateUrl: 'https://www.google.com/search?q=notion+template+second+brain+life+os+tiago+forte',
    description: 'Sistema operacional completo de produtividade pessoal, rastreamento de hábitos e gestão de projetos sem mensalidades.',
    verifiedBadge: true
  },
  {
    id: 'p3',
    name: 'Robô Aspirador de Pó Inteligente iRobot Roomba 980 / Xiaomi S10 LiDAR',
    category: 'Ambiente Doméstico',
    type: 'physical',
    painTarget: 'Faxina, pó acumulado, tempo perdido com limpeza e pelos de pets',
    priceBRL: 1490.0,
    rating: 4.88,
    affiliateUrl: 'https://lista.mercadolivre.com.br/robo-aspirador-irobot-roomba-ou-xiaomi-lidar',
    description: 'Navegação a laser LiDAR 360°, sucção ultra potente de 4000Pa e mapeamento em múltiplos andares com retorno autônomo à base.',
    verifiedBadge: true
  }
];

export const INITIAL_PAIN_TRENDS: PainTrendItem[] = [
  {
    id: 'trend-1',
    painQuery: 'Dores na coluna lombar e cervical pós expediente de 8 horas sentado',
    category: 'Ergonomia & Saúde',
    monthlySearches: 412000,
    unmetDemandScore: 89,
    missingSolutionGap: 'Hardware de suporte dinâmico portátil para quem trabalha híbrido ou em cafés.',
    targetAudience: 'Desenvolvedores, designers e trabalhadores remotos (24-42 anos)',
    dateAdded: 'Hoje'
  },
  {
    id: 'trend-2',
    painQuery: 'Fadiga por decisão e sobrecarga mental na gestão de tarefas domésticas',
    category: 'Ambiente Doméstico',
    monthlySearches: 328000,
    unmetDemandScore: 92,
    missingSolutionGap: 'App de automação de listas de compras integrado a despensa inteligente e cardápio semanal.',
    targetAudience: 'Casais com filhos e profissionais solo de alta performance',
    dateAdded: 'Hoje'
  },
  {
    id: 'trend-3',
    painQuery: 'Procrastinação paralisante em tarefas de estudo e certificações',
    category: 'Produtividade & Foco',
    monthlySearches: 580000,
    unmetDemandScore: 95,
    missingSolutionGap: 'Dispositivo físico não-telas (hardware anti-distração com micro-timer analógico tátil).',
    targetAudience: 'Estudantes de concursos, vestibular e profissionais em transição de carreira',
    dateAdded: 'Ontem'
  },
  {
    id: 'trend-4',
    painQuery: 'Ansiedade por separação canina e destruição de mobília em home alone',
    category: 'Comportamento Animal',
    monthlySearches: 194000,
    unmetDemandScore: 84,
    missingSolutionGap: 'Alimentador interativo programável com estimulação mental olfativa contínua.',
    targetAudience: 'Tutores urbanos com cães de porte pequeno e médio',
    dateAdded: '3 dias atrás'
  }
];

export function generateFallbackTriage(userPain: string): TriageResponse {
  const lower = userPain.toLowerCase();

  // Safety emergency check
  if (
    lower.includes('suicid') ||
    lower.includes('me matar') ||
    lower.includes('acabar com a vida') ||
    lower.includes('overdose') ||
    lower.includes('violência') ||
    lower.includes('infarto') ||
    lower.includes('derrame') ||
    lower.includes('sangramento grave')
  ) {
    return {
      isSafetyEmergency: true,
      emergencyMessage: 'Identificamos que você pode estar passando por uma situação de emergência ou sofrimento extremo. O Pain Finder não substitui atendimento de saúde e emergência. Por favor, entre em contato imediatamente com o CVV (Centro de Valorização da Vida) pelo número 188 (ligação gratuita 24h) ou acione o SAMU 192 ou pronto-socorro mais próximo.',
      detectedCategory: 'Emergência Médica / Psicológica',
      empathySummary: 'Acolhimento prioritário. Sua integridade e vida vêm sempre em primeiro lugar.',
      questions: []
    };
  }

  let category = 'Rotina & Desempenho Humano';
  let b2bMarketIntel = {
    estimatedMonthlySearches: 180000,
    unmetDemandScore: 82,
    missingSolutionGap: 'Sistema integrado de micro-hábitos e ferramentas sem fricção de adesão.',
    targetAudience: 'Adultos em busca de redução de estresse e previsibilidade na rotina'
  };

  if (lower.includes('cachorro') || lower.includes('pet') || lower.includes('cão') || lower.includes('cao') || lower.includes('gato') || lower.includes('latid') || lower.includes('destr')) {
    category = 'Comportamento Animal & Bem-estar';
    b2bMarketIntel = {
      estimatedMonthlySearches: 210000,
      unmetDemandScore: 87,
      missingSolutionGap: 'Hardware de enriquecimento ambiental e estimulação cognitiva autônoma para pets urbanos.',
      targetAudience: 'Tutores urbanos e casais com pets em apartamentos'
    };
  } else if (lower.includes('costas') || lower.includes('dor') || lower.includes('lombar') || lower.includes('pescoço') || lower.includes('postur') || lower.includes('saúde') || lower.includes('fadiga') || lower.includes('punho') || lower.includes('mouse') || lower.includes('joelho') || lower.includes('ombro')) {
    category = 'Ergonomia & Saúde Ocupacional';
    b2bMarketIntel = {
      estimatedMonthlySearches: 480000,
      unmetDemandScore: 92,
      missingSolutionGap: 'Dispositivo físico de suporte biomecânico dinâmico com correção postural passiva.',
      targetAudience: 'Trabalhadores remotos, programadores e profissionais que passam 8h+ sentados'
    };
  } else if (lower.includes('estudo') || lower.includes('procrastin') || lower.includes('foco') || lower.includes('atenção') || lower.includes('concentra') || lower.includes('celular')) {
    category = 'Produtividade & Foco Cognitivo';
    b2bMarketIntel = {
      estimatedMonthlySearches: 620000,
      unmetDemandScore: 95,
      missingSolutionGap: 'Hardware físico analógico/minimalista anti-distração com feedback tátil e bloqueio de estímulos.',
      targetAudience: 'Estudantes de alta performance, concurseiros e profissionais criativos'
    };
  } else if (lower.includes('faxina') || lower.includes('limpeza') || lower.includes('poeira') || lower.includes('sujeira') || lower.includes('aspirador') || (lower.includes('casa') && (lower.includes('arrum') || lower.includes('limp') || lower.includes('organiz')))) {
    category = 'Ambiente Doméstico & Organização';
    b2bMarketIntel = {
      estimatedMonthlySearches: 340000,
      unmetDemandScore: 89,
      missingSolutionGap: 'Sistemas automatizados de limpeza passiva integrados a rotinas espaciais sem atrito.',
      targetAudience: 'Profissionais de rotina intensa e famílias que sofrem com manutenção doméstica'
    };
  } else if (lower.includes('dinheiro') || lower.includes('finança') || lower.includes('gasto') || lower.includes('dívida')) {
    category = 'Finanças & Rotina Orçamentária';
    b2bMarketIntel = {
      estimatedMonthlySearches: 290000,
      unmetDemandScore: 86,
      missingSolutionGap: 'Interface física/digital de visualização de fluxo de caixa em tempo real sem conciliação manual.',
      targetAudience: 'Profissionais liberais, autônomos e famílias em busca de clareza financeira'
    };
  }

  let questions: TriageQuestion[] = [];

  if (
    lower.includes('mouse') ||
    lower.includes('punho') ||
    lower.includes('ombro') ||
    lower.includes('pulso') ||
    lower.includes('cotovelo') ||
    lower.includes('ler') ||
    lower.includes('dort')
  ) {
    category = 'Ergonomia & Saúde Ocupacional (Membros Superiores)';
    b2bMarketIntel = {
      estimatedMonthlySearches: 510000,
      unmetDemandScore: 94,
      missingSolutionGap: 'Periféricos ergonômicos de alinhamento neutro e apoios com regulação milimétrica sem atrito.',
      targetAudience: 'Programadores, designers, analistas e profissionais digitais que usam mouse 6h+ ao dia'
    };
    questions = [
      {
        id: 'q1',
        question: 'Qual é o arranjo exato do seu mouse e dos seus braços durante o trabalho no computador?',
        options: [
          'Mouse óptico padrão achatado, mantendo antebraço suspenso no ar sem apoio dos braços da cadeira',
          'Uso trackpad de notebook sem teclado ou mouse externo, mantendo ombros elevados e cabeça projetada',
          'Mouse ergonômico vertical, mas a mesa é alta demais forçando tensão e elevação contínua no trapézio',
          'Mousepad comum sem almofada de alinhamento neutro para o punho, forçando flexão lateral constante'
        ]
      },
      {
        id: 'q2',
        question: 'Em que momento da jornada a queimação, rigidez ou pontada atinge o ápice?',
        options: [
          'Após 2 a 3 horas contínuas de cliques repetitivos e arrasto de arquivos com precisão',
          'No final da tarde (após 6h+), irradiando do punho até o antebraço, ombro e pescoço',
          'Logo nos primeiros 30 minutos de trabalho, indicando inflamação ou estresse biomecânico acumulado',
          'Apenas ao segurar o mouse com pegada de pinça com esforço excessivo dos tendões'
        ]
      },
      {
        id: 'q3',
        question: 'Qual o seu nível de abertura para investir na adequação ergonômica da sua estação?',
        options: [
          'Quero apenas pausas biomecânicas e ajustes de postura sem custo financeiro imediato',
          'Apoio ergonômico de punho ortopédico e mousepad anatômico (R$ 50 a R$ 120)',
          'Mouse vertical ergonômico sem fio (Logitech Lift/MX) + teclado ergonômico (R$ 180 a R$ 450)',
          'Investimento completo em setup ergonômico com braço articulado e suporte biomecânico (R$ 500+)'
        ]
      }
    ];
  } else if (
    lower.includes('costas') ||
    lower.includes('lombar') ||
    lower.includes('pescoço') ||
    lower.includes('postur') ||
    lower.includes('cervical') ||
    lower.includes('coluna') ||
    lower.includes('joelho')
  ) {
    category = 'Ergonomia & Saúde Ocupacional (Eixo Coluna & Postura)';
    b2bMarketIntel = {
      estimatedMonthlySearches: 480000,
      unmetDemandScore: 92,
      missingSolutionGap: 'Dispositivo físico de suporte biomecânico dinâmico com correção postural passiva.',
      targetAudience: 'Trabalhadores remotos, programadores e profissionais que passam 8h+ sentados'
    };
    questions = [
      {
        id: 'q1',
        question: 'Qual é o tipo de assento e a disposição física da sua coluna durante o trabalho?',
        options: [
          'Cadeira simples ou de jantar sem sustentação lombar, com o tronco curvado para a frente',
          'Cadeira gamer ou executiva profunda sem ajuste fino de altura do suporte lombar na curvatura L1-L5',
          'Notebook apoiado direto na mesa baixa, forçando o pescoço em inclinação de 45° para baixo',
          'Mais de 7 horas sentado contínuo sem alternância com pés suspensos sem apoio firme no piso'
        ]
      },
      {
        id: 'q2',
        question: 'Qual é o sinal somático predominante de sobrecarga postural ao longo do dia?',
        options: [
          'Sensação de queimação ou facada na musculatura da lombar ao tentar se levantar da cadeira',
          'Tensão e rigidez em nó muscular nos ombros e trapézio com cefaleia tensional no final da tarde',
          'Formigamento suave ou peso nas pernas por compressão na borda frontal do assento',
          'Fadiga muscular profunda e incapacidade de manter o tronco ereto após o meio-dia'
        ]
      },
      {
        id: 'q3',
        question: 'Qual é o investimento que você considera viável para eliminar a sobrecarga lombar/cervical?',
        options: [
          'Protocolo de descompressão diária de 3 minutos e adaptações com almofadas sem custo',
          'Suporte articulado para elevação do notebook na linha dos olhos + apoio lombar portátil (R$ 80 a R$ 180)',
          'Cadeira ergonômica com certificação NR-17 e múltiplos ajustes dinâmicos (R$ 380 a R$ 850)',
          'Estação completa com mesa com regulagem elétrica de altura para trabalho sentado/em pé (R$ 900+)'
        ]
      }
    ];
  } else if (
    lower.includes('cachorro') ||
    lower.includes('pet') ||
    lower.includes('cão') ||
    lower.includes('cao') ||
    lower.includes('gato') ||
    lower.includes('latid') ||
    lower.includes('destr')
  ) {
    category = 'Comportamento Animal & Bem-estar';
    b2bMarketIntel = {
      estimatedMonthlySearches: 210000,
      unmetDemandScore: 87,
      missingSolutionGap: 'Hardware de enriquecimento ambiental e estimulação cognitiva autônoma para pets urbanos.',
      targetAudience: 'Tutores urbanos e casais com pets em apartamentos'
    };
    questions = [
      {
        id: 'q1',
        question: 'Qual é a manifestação comportamental mais crítica do seu pet no ambiente?',
        options: [
          'Latidos histéricos e uivos nos primeiros 15 a 20 minutos após o tutor fechar a porta',
          'Destruição física de móveis, rodapés, portas ou estofados especificamente durante a ausência',
          'Urina e fezes fora do local correto apenas quando deixado sozinho em casa',
          'Hiperatividade crônica, mordidas em objetos e incapacidade de relaxar mesmo com o tutor presente'
        ]
      },
      {
        id: 'q2',
        question: 'Como é a rotina atual de gasto de energia mental e enriquecimento ambiental do pet?',
        options: [
          'Passeio rápido higiênico de 10 min, sem desafios cognitivos ou farejamento real',
          'Fica solto pela casa sem brinquedos recheáveis ou comedouros lentos que prolonguem a atividade',
          'Brinquedos normais de borracha/pelúcia que ele ignora ou destrói em poucos minutos',
          'Não há ritual prévio de dessensibilização dos gatilhos de saída (pegar chave, calçar sapato)'
        ]
      },
      {
        id: 'q3',
        question: 'Que nível de solução você busca para restabelecer a harmonia com seu pet?',
        options: [
          'Técnicas comportamentais gratuitas de dessensibilização e comida congelada em garrafas PET',
          'Kit de brinquedos interativos dispensadores de alimento KONG/Nylon atóxico (R$ 60 a R$ 180)',
          'Método em vídeo passo a passo de adestramento para ansiedade de separação (R$ 150 a R$ 350)',
          'Solução completa com câmera bidirecional de petiscos e protocolo de suplementação (R$ 400+)'
        ]
      }
    ];
  } else if (
    lower.includes('estudo') ||
    lower.includes('procrastin') ||
    lower.includes('foco') ||
    lower.includes('atenção') ||
    lower.includes('atencao') ||
    lower.includes('concentra') ||
    lower.includes('celular') ||
    lower.includes('distra')
  ) {
    category = 'Produtividade & Foco Cognitivo';
    b2bMarketIntel = {
      estimatedMonthlySearches: 620000,
      unmetDemandScore: 95,
      missingSolutionGap: 'Hardware físico analógico/minimalista anti-distração com feedback tátil e bloqueio de estímulos.',
      targetAudience: 'Estudantes de alta performance, concurseiros e profissionais criativos'
    };
    questions = [
      {
        id: 'q1',
        question: 'Qual é o mecanismo físico ou digital exato que quebra o seu fluxo de foco?',
        options: [
          'Smartphone repousando ao lado do teclado: pego e destravo por impulso ao menor tédio',
          'Navegador com dezenas de abas abertas alternando entre redes sociais, e-mail e trabalho sem progredir',
          'Falta de clareza do próximo passo exato, gerando paralisia por sobrecarga de tarefas',
          'Ambiente doméstico com ruídos de conversas, trânsito ou interrupções constantes de familiares'
        ]
      },
      {
        id: 'q2',
        question: 'Qual padrão descreve o colapso dos seus blocos de trabalho ou estudo?',
        options: [
          'Tento produzir por horas a fio sem intervalos programados e desabo em procrastinação após 45 min',
          'Uso alarmes no smartphone, mas caio na armadilha de checar notificações e fico 30 min preso no feed',
          'Demoro mais de 30 minutos para iniciar a primeira tarefa (atrito de inicialização crônico)',
          'Produzo razoavelmente de manhã, mas o período da tarde se torna totalmente improdutivo e disperso'
        ]
      },
      {
        id: 'q3',
        question: 'Qual ferramenta de ancoragem de atenção você prefere adotar?',
        options: [
          'Método analógico gratuito de Time-Boxing com caderno de captura de pensamentos intrusivos',
          'Temporizador visual físico analógico (Time Timer / Cubo de Foco) sem conexão digital (R$ 60 a R$ 140)',
          'Fone com cancelamento ativo de ruído ou sistema estruturado de Second Brain / Notion OS (R$ 150 a R$ 400)',
          'Ecossistema avançado com cofre de bloqueio físico de smartphone e mentoria de produtividade (R$ 450+)'
        ]
      }
    ];
  } else if (
    lower.includes('faxina') ||
    lower.includes('limpeza') ||
    lower.includes('poeira') ||
    lower.includes('sujeira') ||
    lower.includes('aspirador') ||
    (lower.includes('casa') && (lower.includes('arrum') || lower.includes('limp') || lower.includes('organiz')))
  ) {
    category = 'Ambiente Doméstico & Organização';
    b2bMarketIntel = {
      estimatedMonthlySearches: 340000,
      unmetDemandScore: 89,
      missingSolutionGap: 'Sistemas automatizados de limpeza passiva integrados a rotinas espaciais sem atrito.',
      targetAudience: 'Profissionais de rotina intensa e famílias que sofrem com manutenção doméstica'
    };
    questions = [
      {
        id: 'q1',
        question: 'Onde está localizada a maior barreira física na manutenção da sua casa limpa?',
        options: [
          'Poeira fina e pelos que reacumulam no piso horas após passar a vassoura convencional',
          'Piso frio ou porcelanato que mancha com marcas de calçado e gordura exigindo pano úmido frequente',
          'Limpeza pesada de banheiros e rejuntes exigindo força lombar e produtos químicos agressivos',
          'Falta de rotina distribuída, gerando acúmulo desastroso para o fim de semana em faxinas de 4 horas'
        ]
      },
      {
        id: 'q2',
        question: 'Qual equipamento você utiliza predominantemente e qual seu nível de fadiga atual?',
        options: [
          'Vassoura de cerdas e rodo com pano de chão (esforço físico alto e poeira fica suspensa no ar)',
          'Aspirador antigo de arrasto pesado e barulhento com cabo curto que desanima só de tirar da despensa',
          'Apenas panos de microfibra manuais sem ferramentas de alavancagem mecânica',
          'Aspirador vertical simples, mas que não alcança embaixo de camas, sofás e cantos difíceis'
        ]
      },
      {
        id: 'q3',
        question: 'Qual solução você gostaria de integrar para manter o ambiente impecável sem exaustão?',
        options: [
          'Rotina em micro-blocos de 15 minutos do método FlyLady com ferramentas manuais que já possuo',
          'Mop giratório profissional com balde centrífuga e cerdas de microfibra magnética (R$ 80 a R$ 160)',
          'Aspirador vertical potente sem fio com bateria de lítio e filtragem HEPA (R$ 250 a R$ 550)',
          'Robô aspirador inteligente com mapeamento a laser e retorno autônomo à base (R$ 700 a R$ 1.800+)'
        ]
      }
    ];
  } else if (
    lower.includes('sono') ||
    lower.includes('insônia') ||
    lower.includes('insonia') ||
    lower.includes('dormir') ||
    lower.includes('acord') ||
    lower.includes('cansaço') ||
    lower.includes('cansaco')
  ) {
    category = 'Higiene do Sono & Recuperação Biológica';
    b2bMarketIntel = {
      estimatedMonthlySearches: 410000,
      unmetDemandScore: 91,
      missingSolutionGap: 'Dispositivos de bloqueio sensorial e termorregulação circadiana passiva para sono profundo.',
      targetAudience: 'Pessoas com rotina estressante, trabalhadores em turnos e insones crônicos'
    };
    questions = [
      {
        id: 'q1',
        question: 'Qual é o maior obstáculo ambiental ou fisiológico quando você deita para dormir?',
        options: [
          'Exposição a telas de celular/TV na cama com luz artificial até minutos antes de fechar os olhos',
          'Mente acelerada repassando listas de pendências do trabalho e ansiedade antecipatória do dia seguinte',
          'Travesseiro deformado causando dor no pescoço ou sensação de calor e sufocamento térmico',
          'Ruídos urbanos de rua, vizinhos ou familiares que fragmentam a entrada nas ondas delta de sono'
        ]
      },
      {
        id: 'q2',
        question: 'Qual é a dinâmica do seu despertar e da sua energia matinal?',
        options: [
          'Acordo com sensação de corpo pesado e névoa mental profunda, como se não tivesse descansado nada',
          'Desperto várias vezes entre 3h e 4h da manhã e fico rolando na cama sem conseguir retomar o sono',
          'Acordo com dores na cervical ou trapézio devido ao mau alinhamento postural na cama',
          'Aperto o botão soneca sucessivas vezes por incapacidade de levantar no primeiro estímulo'
        ]
      },
      {
        id: 'q3',
        question: 'Qual tipo de intervenção no seu quarto ou rotina você deseja viabilizar?',
        options: [
          'Protocolo gratuito de exposição solar matinal de 15 min e corte definitivo de cafeína após as 14h',
          'Máscara de sono 3D com bloqueio total de luz + protetores auriculares de redução acústica (R$ 45 a R$ 120)',
          'Travesseiro ortopédico viscoelástico anatômico com espuma de memória NASA e capa térmica (R$ 130 a R$ 260)',
          'Luminária circadiana simuladora de amanhecer com gerador de ruído branco de alta fidelidade (R$ 280 a R$ 550)'
        ]
      }
    ];
  } else if (
    lower.includes('dinheiro') ||
    lower.includes('finança') ||
    lower.includes('financa') ||
    lower.includes('gasto') ||
    lower.includes('dívida') ||
    lower.includes('divida') ||
    lower.includes('orçamento') ||
    lower.includes('orcamento')
  ) {
    category = 'Finanças & Rotina Orçamentária';
    b2bMarketIntel = {
      estimatedMonthlySearches: 290000,
      unmetDemandScore: 86,
      missingSolutionGap: 'Interface física/digital de visualização de fluxo de caixa em tempo real sem conciliação manual.',
      targetAudience: 'Profissionais liberais, autônomos e famílias em busca de clareza financeira'
    };
    questions = [
      {
        id: 'q1',
        question: 'Onde se concentra o vazamento financeiro mais angustiante do seu mês?',
        options: [
          'Micro-gastos impulsivos e repetidos em delivery, corridas por aplicativo e compras rápidas no cartão',
          'Falta de controle de dezenas de assinaturas e faturas de cartão que chegam com valor assustador',
          'Imprevistos financeiros recorrentes sem ter uma reserva de emergência segura para absorvê-los',
          'Incerteza do saldo disponível daqui a 15 dias, descobrindo rombos orçamentários apenas no susto'
        ]
      },
      {
        id: 'q2',
        question: 'Qual é o seu sistema atual de controle e por que ele costuma falhar?',
        options: [
          'Não registro nada: tomo decisões financeiras confiando unicamente na memória de cabeça',
          'Planilhas manuais complexas que comecei mas abandonei por excesso de atrito na digitação diária',
          'Checo apenas o extrato do banco sem planejamento prévio de envelopes ou categorias',
          'Misturo despesas fixas da casa com despesas variáveis e profissionais na mesma conta corrente'
        ]
      },
      {
        id: 'q3',
        question: 'Qual alavanca de controle você prefere implementar para blindar seu bolso?',
        options: [
          'Regra comportamental dos 3 dias de reflexão para compras não essenciais + método dos envelopes (sem custo)',
          'Planilha financeira inteligente automatizada com dashboard de fluxo de caixa anual (R$ 37 a R$ 97)',
          'Método em vídeo de reestruturação orçamentária, corte de juros e investimento inicial (R$ 150 a R$ 350)',
          'Software financeiro de automação bancária ou consultoria de planejamento patrimonial (R$ 400+)'
        ]
      }
    ];
  } else {
    // Ultra-contextual questions citing the user's actual phrase
    const snippet = userPain.length > 55 ? `"${userPain.slice(0, 50)}..."` : `"${userPain}"`;
    questions = [
      {
        id: 'q1',
        question: `Considerando o atrito em ${snippet}, qual arranjo físico do ambiente ou da sua rotina mais sobrecarrega o seu dia?`,
        options: [
          'Falta de ferramentas e equipamentos ergonômicos específicos para a tarefa',
          'Desordem ou layout do espaço físico gerando retrabalho e esforço dobrado',
          'Fadiga mental acumulada que diminui a tolerância ao menor sinal de estresse',
          'Interrupções constantes e ausência de um método claro de execução sequencial'
        ]
      },
      {
        id: 'q2',
        question: 'Em que momento ou fase da atividade essa fricção costuma atingir o ponto de ruptura?',
        options: [
          'Logo nos primeiros minutos devido à resistência e atrito de inicialização',
          'Após algumas horas de esforço contínuo quando a reserva de energia se esgota',
          'No final da jornada quando o corpo e a mente já estão saturados de estímulos',
          'Apenas sob prazos apertados ou quando ocorrem imprevistos fora do planejado'
        ]
      },
      {
        id: 'q3',
        question: 'Qual o investimento que você considera mais equilibrado para erradicar essa dor definitivamente?',
        options: [
          'Protocolo de micro-hábitos e reorganização espacial imediata a custo zero',
          'Acessórios, utilitários ou métodos práticos de baixo custo (R$ 50 a R$ 140)',
          'Hardware consagrado ou sistema educacional com metodologia validada (R$ 150 a R$ 450)',
          'Equipamento definitivo de alta engenharia ou solução premium completa (R$ 500+)'
        ]
      }
    ];
  }

  return {
    isSafetyEmergency: false,
    detectedCategory: category,
    empathySummary: `Compreendemos o desgaste gerado por "${userPain.slice(0, 75)}...". O atrito contínuo drena energia mental e cria sobrecarga sistêmica.`,
    b2bMarketIntel,
    questions
  };
}

export function generateFallbackPrescription(
  userPain: string,
  triageAnswers: Record<string, string>,
  partnerProducts: PartnerProduct[] = []
): PrescriptionResponse {
  const lower = userPain.toLowerCase();

  // Check safety emergency
  if (
    lower.includes('suicid') ||
    lower.includes('me matar') ||
    lower.includes('acabar com a vida')
  ) {
    return {
      isSafetyEmergency: true,
      emergencyMessage: 'Acolhimento imediato necessário. Ligue 188 para o CVV ou procure auxílio médico.',
      diagnosisTitle: {
        part1Dark: 'Acolhimento Prioritário.',
        part2Gray: 'Cuidado e Vida em Primeiro Lugar.'
      },
      rootCauseAnalysis: 'Sua integridade é a única prioridade agora.',
      painAnatomyTags: ['Acolhimento', 'Suporte', 'CVV 188', 'Saúde'],
      layer01_ImmediateRelief: {
        title: 'Protocolo de Emergência',
        subtitle: 'Cuidado imediato',
        steps: [
          {
            stepNumber: 1,
            actionTitle: 'Ligue 188 (CVV)',
            description: 'Canal gratuito, confidencial e disponível 24 horas por dia.',
            timeRequired: 'Imediato'
          },
          {
            stepNumber: 2,
            actionTitle: 'Conecte-se com alguém de confiança',
            description: 'Compartilhe com um familiar ou amigo próximo o momento difícil que está atravessando.',
            timeRequired: '5 min'
          },
          {
            stepNumber: 3,
            actionTitle: 'Procure uma unidade de saúde',
            description: 'Dirija-se à UPA ou pronto-socorro mais próximo para suporte profissional humanizado.',
            timeRequired: 'Hoje'
          }
        ]
      },
      layer02_PhysicalProducts: [],
      layer03_DigitalSolutions: []
    };
  }

  // Home cleaning / domestic chaos
  if (lower.includes('faxina') || lower.includes('limpeza') || lower.includes('poeira') || lower.includes('sujeira') || lower.includes('aspirador') || (lower.includes('casa') && (lower.includes('arrum') || lower.includes('limp') || lower.includes('organiz') || lower.includes('bagunça')))) {
    const verifiedRobot = partnerProducts.find(p => p.id === 'p3') || {
      name: 'Robô Aspirador com Mapeamento Inteligente LiDAR',
      category: 'Ambiente Doméstico',
      whyItSolves: 'Elimina o atrito diário de 45 minutos de varrição e aspiração ao automatizar a manutenção de piso no piloto automático.',
      pros: ['Mapeamento a laser sem colisões', 'Agendamento diário automático', 'Retorno autônomo à base'],
      cons: ['Exige chão livre de cabos soltos'],
      estimatedPriceBRL: 1490,
      painScore: 9.8,
      searchQueryAmazon: 'robo aspirador lidar mapeamento',
      searchQueryMercadoLivre: 'robo aspirador sensor laser lidar',
      visualIconType: 'vacuum',
      isVerifiedPartner: true
    };

    return {
      diagnosisTitle: {
        part1Dark: 'Fadiga por Manutenção Doméstica.',
        part2Gray: 'Arquitetura de Limpeza Passiva.'
      },
      rootCauseAnalysis: 'O acúmulo de sujeira gera carga cognitiva invisível contínua porque o cérebro percebe desordem visual como tarefas inacabadas em espera. A solução exige automação de base associada a regras espaciais claras.',
      painAnatomyTags: ['Carga Cognitiva', 'Atrito Físico Diário', 'Micro-Resíduos', 'Decisão de Limpeza'],
      painAnatomyVectors: [
        {
          tag: 'Carga Cognitiva Invisível',
          vectorType: 'Vetor Primário',
          clinicalExplanation: 'Ambiente desordenado envia estímulos contínuos ao córtex pré-frontal interpretados como tarefas inacabadas.',
          severity: 9
        },
        {
          tag: 'Atrito de Execução Diária',
          vectorType: 'Mecanismo de Propagação',
          clinicalExplanation: 'A ausência de ferramentas de limpeza passiva transforma a manutenção doméstica em um evento extenuante e adiado.',
          severity: 8
        },
        {
          tag: 'Contaminação Externa Contínua',
          vectorType: 'Ponto Cego',
          clinicalExplanation: 'Calçados e aberturas introduzem até 80% do pó em suspensão sem que a causa primária seja contida.',
          severity: 7
        },
        {
          tag: 'Espiral de Adiamento de Fim de Semana',
          vectorType: 'Gatilho de Cronificação',
          clinicalExplanation: 'Concentrar a faxina nos dias de descanso consome a energia regenerativa, gerando frustração crônica e recaída.',
          severity: 9
        }
      ],
      layer01_ImmediateRelief: {
        title: 'Engenharia de Hábito. Alívio Imediato.',
        subtitle: 'Protocolo de 3 ações sem investimento financeiro para reduzir 40% do atrito hoje',
        steps: [
          {
            stepNumber: 1,
            actionTitle: 'Regra de 2 Minutos para Superfícies Planas',
            description: 'Esvazie pias e balcões antes de qualquer outra tarefa. A amplitude visual destrava sensação instantânea de controle.',
            timeRequired: '3 min',
            vectorType: 'Atrito Ambiental'
          },
          {
            stepNumber: 2,
            actionTitle: 'Zona de Quarentena de Calçados na Entrada',
            description: 'Institua a regra "zero sapatos de rua em casa". Isso reduz até 70% de poeira e microrresíduos que entram diariamente.',
            timeRequired: '5 min',
            vectorType: 'Reset Biomecânico/Fisiológico'
          },
          {
            stepNumber: 3,
            actionTitle: 'Micro-Blocos de Reset Noturno de 10 Minutos',
            description: 'Defina um timer estrito de 10 minutos após o jantar com foco exclusivo em recolher itens fora do lugar.',
            timeRequired: '10 min',
            vectorType: 'Micro-hábito de Ancoragem'
          }
        ]
      },
      layer02_PhysicalProducts: [
        {
          name: 'Robô Aspirador de Pó Inteligente iRobot Roomba 980 / Xiaomi S10 LiDAR',
          category: 'Ambiente Doméstico',
          whyItSolves: 'Automatiza o piso diário sem intervenção humana, quebrando a espiral de poeira e microrresíduos acumulados.',
          pros: ['Navegação LiDAR sem colisões', 'Elimina 90% do pó em suspensão e pelos', 'Retorno automático para recarga na base'],
          cons: ['Exige chão sem fios soltos'],
          estimatedPriceBRL: 1490,
          painScore: 9.8,
          searchQueryAmazon: 'robo aspirador irobot roomba ou xiaomi lidar',
          searchQueryMercadoLivre: 'robo aspirador sensor laser lidar irobot xiaomi',
          visualIconType: 'vacuum',
          isVerifiedPartner: true
        },
        {
          name: 'Mop Giratório FlashLimp Fit com Balde Duplo e Centrífuga Inox',
          category: 'Ferramentas de Precisão',
          whyItSolves: 'Diminui o esforço físico na coluna e elimina o contato direto com produtos químicos e água suja.',
          pros: ['Centrífuga em aço inox de alta rotação', 'Balde com separação de enxágue higiênico', 'Refil em microfibra lavável'],
          cons: ['Ocupa pequeno espaço em lavanderia'],
          estimatedPriceBRL: 169,
          painScore: 9.4,
          searchQueryAmazon: 'mop giratorio flashlimp balde duplo inox',
          searchQueryMercadoLivre: 'mop giratorio flashlimp fit balde centrifuga',
          visualIconType: 'mop',
          isVerifiedPartner: false
        }
      ],
      layer03_DigitalSolutions: [
        {
          name: 'Método FlyLady Brasil: Sistema de Manutenção Residencial em Zonas',
          format: 'Ebook & Planner Digital',
          transformationPromise: 'Transforma faxinas extenuantes de fim de semana em micro-rotinas de 12 minutos diários.',
          implementationTime: '2 dias para implantação completa',
          estimatedPriceBRL: 67,
          painScore: 9.5,
          searchQueryPlatform: 'metodo flylady brasil rotina domestica zonas',
          isVerifiedPartner: false
        },
        {
          name: 'Template Notion Smart Home & Inventory 2.0',
          format: 'Template / Sistema',
          transformationPromise: 'Automação visual de lembretes sazonais, controle de despensa e checklist de manutenção residencial.',
          implementationTime: 'Configuração em 15 min',
          estimatedPriceBRL: 47,
          painScore: 9.2,
          searchQueryPlatform: 'notion template smart home tarefas domesticas',
          isVerifiedPartner: false
        }
      ]
    };
  }

  // Ergonomics / Back pain / Home office
  if (lower.includes('costas') || lower.includes('dor') || lower.includes('lombar') || lower.includes('pescoço') || lower.includes('postur') || lower.includes('home office')) {
    const verifiedPosture = partnerProducts.find(p => p.id === 'p1');

    return {
      diagnosisTitle: {
        part1Dark: 'Sobrecarga Biomecânica Estática.',
        part2Gray: 'Engenharia Postural e Cinética.'
      },
      rootCauseAnalysis: 'O corpo humano não foi projetado para compressão intervertebral estática por mais de 45 minutos contínuos. A rigidez dos flexores do quadril projeta o pescoço à frente e transfere estresse para as vértebras lombares L4-L5.',
      painAnatomyTags: ['Compressão Discal', 'Projeção Cervical', 'Isquemia Muscular', 'Imobilidade Pélvica'],
      painAnatomyVectors: [
        {
          tag: 'Compressão Intervertebral L4-L5',
          vectorType: 'Vetor Primário',
          clinicalExplanation: 'A sustentação estática sentada por 45+ minutos concentra carga gravitacional excessiva sobre os discos lombares.',
          severity: 10
        },
        {
          tag: 'Projeção Anterior Cervical',
          vectorType: 'Mecanismo de Propagação',
          clinicalExplanation: 'Cada centímetro de projeção da cabeça para frente aumenta em até 4,5 kg a carga sobre a musculatura do trapézio e cervical.',
          severity: 9
        },
        {
          tag: 'Encurtamento do Psoas Ilíaco',
          vectorType: 'Ponto Cego',
          clinicalExplanation: 'A flexão crônica do quadril trava a pelve em retroversão, impedindo o relaxamento lombar mesmo deitado.',
          severity: 8
        },
        {
          tag: 'Micro-isquemia por Imobilidade Contínua',
          vectorType: 'Gatilho de Cronificação',
          clinicalExplanation: 'A ausência de estímulo de descompressão periódica induz espasmo muscular reflexo e queimação persistente.',
          severity: 9
        }
      ],
      layer01_ImmediateRelief: {
        title: 'Engenharia de Hábito. Alívio Imediato.',
        subtitle: 'Protocolo biomecânico de custo zero para descomprimir a coluna imediatamente',
        steps: [
          {
            stepNumber: 1,
            actionTitle: 'Elevação do Topo do Monitor na Linha dos Olhos',
            description: 'Coloque 2 a 3 livros rígidos sob a tela do notebook para impedir a flexão contínua do pescoço em 45 graus.',
            timeRequired: '3 min',
            vectorType: 'Atrito Ambiental'
          },
          {
            stepNumber: 2,
            actionTitle: 'Descompressão Cervical "Queixo Duplo" (McKenzie)',
            description: 'Recue a cabeça em linha reta criando o efeito de queixo duplo por 5 segundos. Repita 8 vezes para alinhar o atlas vertebral.',
            timeRequired: '2 min',
            vectorType: 'Reset Biomecânico/Fisiológico'
          },
          {
            stepNumber: 3,
            actionTitle: 'Protocolo Pomodoro Cinético 50/10',
            description: 'A cada 50 minutos sentado, fique 10 minutos de pé ou faça alongamento da cadeia posterior para restaurar a circulação.',
            timeRequired: 'Contínuo',
            vectorType: 'Micro-hábito de Ancoragem'
          }
        ]
      },
      layer02_PhysicalProducts: [
        {
          name: 'Almofada Lombar Ortopédica Viscoelástica Fibrasca D45 com Cintas Duplas',
          category: 'Ergonomia Biomecânica',
          whyItSolves: 'Preenche a curva lordótica natural, mantendo o ângulo pélvico neutro e reduzindo em até 48% a pressão sobre os discos vertebrais L4-L5.',
          pros: ['Espuma viscoelástica aeroespacial D45', 'Cintas elásticas duplas com fivela ajustável', 'Capa respirável lavável anti-ácaro'],
          cons: ['Exige adaptação inicial de 3 a 5 dias'],
          estimatedPriceBRL: 289,
          painScore: 9.8,
          searchQueryAmazon: 'almofada lombar viscoelastica fibrasca ortopedica',
          searchQueryMercadoLivre: 'almofada lombar ergonomica ortopedica fibrasca',
          visualIconType: 'ergonomics',
          isVerifiedPartner: true
        },
        {
          name: 'Suporte Articulado de Alumínio Baseus Comfort Pro para Notebook',
          category: 'Hardware Estrutural',
          whyItSolves: 'Alinha perfeitamente o centro do display ao horizonte de visão, impedindo a flexão contínua de 45° do pescoço.',
          pros: ['Construção em liga de alumínio aeroespacial', 'Dissipação passiva de calor', 'Dobrável e portátil'],
          cons: ['Requer teclado e mouse dedicados para uso ergonômico'],
          estimatedPriceBRL: 149,
          painScore: 9.6,
          searchQueryAmazon: 'suporte notebook aluminio articulado baseus',
          searchQueryMercadoLivre: 'suporte laptop aluminio inclinavel baseus ugreen',
          visualIconType: 'stand',
          isVerifiedPartner: false
        }
      ],
      layer03_DigitalSolutions: [
        {
          name: 'Curso Online Mobilidade Ativa Diária & Descompressão Postural (Dr. Mike)',
          format: 'Curso Online',
          transformationPromise: 'Série guiada de 7 minutos diários com fisioterapeutas para destravar quadris e eliminar queimação escapular.',
          implementationTime: '7 min por dia',
          estimatedPriceBRL: 129,
          painScore: 9.7,
          searchQueryPlatform: 'curso mobilidade postural fisioterapia coluna dr mike',
          isVerifiedPartner: false
        },
        {
          name: 'Template Notion Ergonomia & Protocolo de Saúde Biomecânica',
          format: 'Template / Sistema',
          transformationPromise: 'Metodologia precisa para auditar ângulos de cotovelo, altura de assento, iluminação e suporte de punhos.',
          implementationTime: 'Configuração em 15 min',
          estimatedPriceBRL: 49,
          painScore: 9.3,
          searchQueryPlatform: 'guia ergonomia home office postura trabalho notion',
          isVerifiedPartner: false
        }
      ]
    };
  }

  // Focus / Procrastination / Deep Work
  if (lower.includes('estudo') || lower.includes('procrastin') || lower.includes('foco') || lower.includes('atenção') || lower.includes('concentra')) {
    const verifiedNotion = partnerProducts.find(p => p.id === 'p2');

    return {
      diagnosisTitle: {
        part1Dark: 'Fragmentação de Atenção e Sobrecarga Dopaminérgica.',
        part2Gray: 'Arquitetura de Estado de Foco Profundo.'
      },
      rootCauseAnalysis: 'A procrastinação não é falha moral de disciplina, mas uma resposta neurobiológica de fuga ao atrito de início e à clareza ambígua do próximo micro-passo. Reduzir a fricção inicial é o único antídoto real.',
      painAnatomyTags: ['Micro-Fricção Inicial', 'Sobrecarga Dopamínica', 'Ambiguidade de Tarefas', 'Fadiga Decisória'],
      painAnatomyVectors: [
        {
          tag: 'Micro-Fricção de Início de Tarefa',
          vectorType: 'Vetor Primário',
          clinicalExplanation: 'O cérebro interpreta o início de tarefas complexas como ameaça energética, acionando o circuito de esquiva da amígdala.',
          severity: 9
        },
        {
          tag: 'Fragmentação da Atenção por Multitasking',
          vectorType: 'Mecanismo de Propagação',
          clinicalExplanation: 'Alternar entre abas e notificações dispersa resíduo de atenção, drenando o glicogênio pré-frontal em menos de 2 horas.',
          severity: 9
        },
        {
          tag: 'Custo Oculto da Ambivalência de Prioridades',
          vectorType: 'Ponto Cego',
          clinicalExplanation: 'Falta de definição granular da primeira ação física ("ler pág. 1" vs "estudar") trava a decisão motora.',
          severity: 8
        },
        {
          tag: 'Recompensa Dopaminérgica Imediata das Telas',
          vectorType: 'Gatilho de Cronificação',
          clinicalExplanation: 'Dispositivos conectados oferecem alívio instantâneo do desconforto, reforçando neurobiologicamente o hábito de procrastinar.',
          severity: 10
        }
      ],
      layer01_ImmediateRelief: {
        title: 'Engenharia de Hábito. Alívio Imediato.',
        subtitle: 'Protocolo neurocientífico imediato para destravar paralisia de execução',
        steps: [
          {
            stepNumber: 1,
            actionTitle: 'Isolamento Físico de Notificações em Outro Cômodo',
            description: 'Coloque o smartphone em modo silencioso e deixe-o fisicamente fora do seu alcance visual. A mera visão do aparelho reduz a capacidade de trabalho em até 20%.',
            timeRequired: '1 min',
            vectorType: 'Atrito Ambiental'
          },
          {
            stepNumber: 2,
            actionTitle: 'Regra dos 5 Minutos com Entrada Reduzida',
            description: 'Comprometa-se a abrir o documento e escrever apenas 3 frases ou ler apenas 1 página. O cérebro dissipa a aversão após romper a inércia.',
            timeRequired: '5 min',
            vectorType: 'Reset Biomecânico/Fisiológico'
          },
          {
            stepNumber: 3,
            actionTitle: 'Definição da Próxima Ação Física Única',
            description: 'Em vez de "estudar matemática", anote em post-it: "resolver os exercícios 1 a 4 da página 22". Elimine o custo de pensar no próximo passo.',
            timeRequired: '2 min',
            vectorType: 'Micro-hábito de Ancoragem'
          }
        ]
      },
      layer02_PhysicalProducts: [
        {
          name: 'Timer Visual Analógico Time Timer MOD Pomodoro 60 Minutos',
          category: 'Hardware Cognitivo',
          whyItSolves: 'Converte a passagem do tempo abstrata em uma barra colorida visualmente decrescente, criando senso tátil de urgência sem telas.',
          pros: ['Zero notificações e distrações', 'Mecanismo silencioso sem tique-taque', 'Gatilho psicológico imediato anti-procrastinação'],
          cons: ['Requer 1 pilha AAA de longa duração'],
          estimatedPriceBRL: 129,
          painScore: 9.7,
          searchQueryAmazon: 'time timer visual timer pomodoro mod 60 min',
          searchQueryMercadoLivre: 'timer visual analogico time timer mod',
          visualIconType: 'clock',
          isVerifiedPartner: false
        },
        {
          name: 'Fone de Ouvido Bluetooth Sony WH-1000XM4 Noise Cancelling Premium',
          category: 'Acústica de Concentração',
          whyItSolves: 'Cria uma cápsula de silêncio absoluto eliminando 98% dos ruídos ambientes e conversas paralelas.',
          pros: ['Cancelamento ativo de ruído líder de mercado (-38dB)', 'Almofadas anatômicas de alívio de pressão', 'Bateria de 30 horas com carga rápida'],
          cons: ['Investimento mais elevado para tecnologia topo de linha'],
          estimatedPriceBRL: 1290,
          painScore: 9.9,
          searchQueryAmazon: 'sony wh 1000xm4 cancelamento ativo ruido bluetooth',
          searchQueryMercadoLivre: 'headphone sony wh 1000xm4 anc noise cancelling',
          visualIconType: 'headphones',
          isVerifiedPartner: true
        }
      ],
      layer03_DigitalSolutions: [
        {
          name: 'Template Notion Second Brain & Life OS 2.0 (Tiago Forte / Thomas Frank)',
          format: 'Template / Sistema',
          transformationPromise: 'Centraliza metas, projetos, notas e rastreamento de hábitos em uma interface limpa sem distrações.',
          implementationTime: '15 minutos para clonar e rodar',
          estimatedPriceBRL: 97,
          painScore: 9.9,
          searchQueryPlatform: 'notion template second brain life os tiago forte',
          isVerifiedPartner: true
        },
        {
          name: 'Método Deep Work & Foco Sem Telas: Neurociência da Inércia',
          format: 'Curso Online',
          transformationPromise: 'Framework neurocientífico passo a passo para reconstruir foco contínuo e eliminar distrações digitais crônicas.',
          implementationTime: '3 horas de aulas aplicadas',
          estimatedPriceBRL: 147,
          painScore: 9.5,
          searchQueryPlatform: 'metodo deep work neurociencia foco livro curso',
          isVerifiedPartner: false
        }
      ]
    };
  }

  // Pet anxiety / destruction
  if (lower.includes('cachorro') || lower.includes('pet') || lower.includes('gato') || lower.includes('ansied') || lower.includes('destr')) {
    return {
      diagnosisTitle: {
        part1Dark: 'Tédio e Ansiedade por Isolamento.',
        part2Gray: 'Estimulação Mental e Autonomia Canina.'
      },
      rootCauseAnalysis: 'Cães não destroem objetos por vingança, mas para aliviar picos de cortisol por tédio e falta de gasto energético olfativo. O ato de mastigar e farejar estimula endorfinas que acalmam o sistema nervoso parassimpático.',
      painAnatomyTags: ['Tédio Crônico', 'Cortisol Elevado', 'Privação Olfativa', 'Gasto Energético Baixo'],
      painAnatomyVectors: [
        {
          tag: 'Pico de Cortisol por Isolamento Súbito',
          vectorType: 'Vetor Primário',
          clinicalExplanation: 'A saída do tutor sem transição previsível ativa hipervigilância e estresse agudo de separação no animal.',
          severity: 9
        },
        {
          tag: 'Descarga Motora Destrutiva Compensatória',
          vectorType: 'Mecanismo de Propagação',
          clinicalExplanation: 'O pet canaliza frustração mastigando superfícies e móveis como mecanismo reflexo para liberação de endorfina.',
          severity: 8
        },
        {
          tag: 'Privação de Estimulação Olfativa',
          vectorType: 'Ponto Cego',
          clinicalExplanation: 'Tutores costumam focar apenas em cansaço físico de corrida, ignorando que o esforço cognitivo do faro acalma 3x mais.',
          severity: 8
        },
        {
          tag: 'Rituais Teatrais de Despedida e Boas-Vindas',
          vectorType: 'Gatilho de Cronificação',
          clinicalExplanation: 'Despedidas efusivas superestimulam a expectativa do pet antes da solidão, amplificando a ansiedade antecipatória.',
          severity: 9
        }
      ],
      layer01_ImmediateRelief: {
        title: 'Engenharia de Hábito. Alívio Imediato.',
        subtitle: 'Protocolo de enriquecimento ambiental de custo zero para aplicar hoje',
        steps: [
          {
            stepNumber: 1,
            actionTitle: 'Tapete de Caça com Toalha Enrolada',
            description: 'Polvilhe grãos de ração em uma toalha velha, enrole bem firme e dê pequenos nós. Obrigar o cão a desatar ativa 20 min de esforço cognitivo.',
            timeRequired: '5 min',
            vectorType: 'Atrito Ambiental'
          },
          {
            stepNumber: 2,
            actionTitle: 'Caminhada de Faro Lento antes de Deixar o Pet',
            description: '15 minutos farejando postes e grama cansam o cérebro do animal mais do que 40 minutos de corrida mecânica.',
            timeRequired: '15 min',
            vectorType: 'Reset Biomecânico/Fisiológico'
          },
          {
            stepNumber: 3,
            actionTitle: 'Saída sem Rituais Teatrais de Despedida',
            description: 'Ignore o pet 10 minutos antes de sair e 5 minutos ao retornar. Tratar a saída como algo banal reduz a expectativa de angústia.',
            timeRequired: '15 min',
            vectorType: 'Micro-hábito de Ancoragem'
          }
        ]
      },
      layer02_PhysicalProducts: [
        {
          name: 'Brinquedo Mordedor Dispensador KONG Classic Vermelho para Cães',
          category: 'Enriquecimento Ambiental',
          whyItSolves: 'Congelado com pasta de amendoim ou sachê, proporciona 40 a 60 minutos de lambedura constante, liberando serotonina e induzindo sono.',
          pros: ['Borracha atóxica natural ultra resistente', 'Recomendado por 98% dos veterinários comportamentais', 'Alivia ansiedade de separação'],
          cons: ['Exige congelamento prévio do recheio'],
          estimatedPriceBRL: 89,
          painScore: 9.9,
          searchQueryAmazon: 'brinquedo kong classic vermelho mordedor cao',
          searchQueryMercadoLivre: 'brinquedo kong classic vermelho original',
          visualIconType: 'gear',
          isVerifiedPartner: true
        },
        {
          name: 'Câmera Inteligente Wi-Fi 360° TP-Link Tapo C200 Full HD com Áudio',
          category: 'Monitoramento & Conforto',
          whyItSolves: 'Permite acompanhar o comportamento do pet em tempo real pelo smartphone e falar calmamente caso ele demonstre inquietação.',
          pros: ['Resolução Full HD 1080p e visão noturna infravermelha', 'Detecção e alertas de latidos ou movimentos', 'Fácil instalação e app rápido'],
          cons: ['Necessita de tomada e rede Wi-Fi estável'],
          estimatedPriceBRL: 189,
          painScore: 9.5,
          searchQueryAmazon: 'camera tp link tapo c200 wifi 360',
          searchQueryMercadoLivre: 'camera tp link tapo c200 wifi 360',
          visualIconType: 'device',
          isVerifiedPartner: false
        }
      ],
      layer03_DigitalSolutions: [
        {
          name: 'Curso Online Cão Cidadão: Adestramento & Fim da Ansiedade (Alexandre Rossi / Dr. Pet)',
          format: 'Curso Online',
          transformationPromise: 'Passo a passo com o maior especialista do Brasil para ensinar seu cão a amar ficar sozinho sem chorar nem destruir.',
          implementationTime: '14 dias com treinos de 10 min',
          estimatedPriceBRL: 147,
          painScore: 9.8,
          searchQueryPlatform: 'curso cao cidadao alexandre rossi adestramento',
          isVerifiedPartner: true
        },
        {
          name: 'Guia de Enriquecimento Ambiental e 50 Brinquedos Cognitivos Caseiros',
          format: 'Ebook & Guia Prático',
          transformationPromise: 'Aprenda a produzir quebra-cabeças cognitivos reutilizando caixas de ovos, papelão e petiscos naturais saudáveis.',
          implementationTime: 'Leitura em 30 min',
          estimatedPriceBRL: 37,
          painScore: 9.2,
          searchQueryPlatform: 'guia enriquecimento ambiental mental para caes',
          isVerifiedPartner: false
        }
      ]
    };
  }

  // Sleep / Insomnia / Night awakenings / Room light
  if (lower.includes('sono') || lower.includes('dormir') || lower.includes('insonia') || lower.includes('insônia') || lower.includes('acordar') || lower.includes('claridade') || lower.includes('cansaço') || lower.includes('quarto') || lower.includes('travesseiro')) {
    return {
      diagnosisTitle: {
        part1Dark: 'Fragmentação do Ciclo Circadiano.',
        part2Gray: 'Higiene Ambiental e Restauração de Sono REM.'
      },
      rootCauseAnalysis: 'A incapacidade de adormecer ou manter sono contínuo é provocada pela supressão de melatonina por contaminação de luz artificial e descompasso térmico no quarto. O isolamento de estímulos visuais e sonoros é o único mecanismo fisiológico para reativar o sono de ondas lentas.',
      painAnatomyTags: ['Melatonina Inibida', 'Poluição Luminosa', 'Sono REM Interrompido', 'Fadiga Residual'],
      painAnatomyVectors: [
        {
          tag: 'Supressão Fototópica de Melatonina',
          vectorType: 'Vetor Primário',
          clinicalExplanation: 'A incidência de ondas azuis de displays após as 21h bloqueia o sinal da glândula pineal para transição circadiana.',
          severity: 9
        },
        {
          tag: 'Hiperativação Simpática Noturna',
          vectorType: 'Mecanismo de Propagação',
          clinicalExplanation: 'Pendências cognitivas retidas provocam microdespertares e fragmentam os estágios de sono profundo NREM 3 e REM.',
          severity: 9
        },
        {
          tag: 'Gradiente Térmico Desfavorável no Quarto',
          vectorType: 'Ponto Cego',
          clinicalExplanation: 'Ambientes acima de 22°C impedem a queda natural de 1°C na temperatura corporal central necessária para o adormecer.',
          severity: 7
        },
        {
          tag: 'Associação Cama-Alerta pelo Celular',
          vectorType: 'Gatilho de Cronificação',
          clinicalExplanation: 'Utilizar o smartphone deitado condiciona o cérebro a associar o colchão a dopamina e vigília, e não a repouso.',
          severity: 10
        }
      ],
      layer01_ImmediateRelief: {
        title: 'Engenharia de Hábito. Alívio Imediato.',
        subtitle: 'Protocolo de higiene circadiana de custo zero para aplicar hoje à noite',
        steps: [
          {
            stepNumber: 1,
            actionTitle: 'Corte de Luz Azul 60 Minutos Antes de Deitar',
            description: 'Desligue telas e ative iluminação indireta âmbar ou amarelada pela casa para permitir que a pineal libere melatonina.',
            timeRequired: '60 min',
            vectorType: 'Atrito Ambiental'
          },
          {
            stepNumber: 2,
            actionTitle: 'Resfriamento Térmico do Quarto (19°C a 21°C)',
            description: 'Deixe o ambiente levemente fresco. O corpo precisa reduzir a temperatura central em 1°C para iniciar o estado de sono profundo.',
            timeRequired: '10 min',
            vectorType: 'Reset Biomecânico/Fisiológico'
          },
          {
            stepNumber: 3,
            actionTitle: 'Descompressão Mental no Papel (Brain Dump)',
            description: 'Escreva em uma folha todas as pendências de amanhã. Esvaziar a memória operacional reduz a ativação da amígdala cerebral.',
            timeRequired: '5 min',
            vectorType: 'Micro-hábito de Ancoragem'
          }
        ]
      },
      layer02_PhysicalProducts: [
        {
          name: 'Máscara de Sono 3D Ergonômica Anatômica com Bloqueio 100% de Luz',
          category: 'Higiene do Sono',
          whyItSolves: 'Bloqueia 100% da claridade externa sem encostar nas pálpebras ou pressionar os olhos, viabilizando ciclos completos de sono REM.',
          pros: ['Espaço côncavo 3D para livre piscar', 'Espuma viscoelástica respirável com memória', 'Alça ultrafina sem pressão na nuca'],
          cons: ['Exige adaptação ao contato nas têmporas nos primeiros 2 dias'],
          estimatedPriceBRL: 79,
          painScore: 9.8,
          searchQueryAmazon: 'mascara de dormir 3d blackout bloqueio luz macks',
          searchQueryMercadoLivre: 'mascara de dormir 3d anatomica blackout',
          visualIconType: 'gear',
          isVerifiedPartner: true
        },
        {
          name: 'Aparelho de Ruído Branco & Sons da Natureza Bivolt com Temporizador',
          category: 'Acústica Terapêutica',
          whyItSolves: 'Cria uma camada homogênea de som neutro que mascara ruídos súbitos da rua, vizinhos ou eletrodomésticos, impedindo microdespertares.',
          pros: ['24 opções de frequências relaxantes calibradas', 'Temporizador inteligente programável (30/60/90 min)', 'Bateria recarregável bivolt para viagens'],
          cons: ['Requer manter ligado próximo à cabeceira'],
          estimatedPriceBRL: 169,
          painScore: 9.6,
          searchQueryAmazon: 'aparelho som ruido branco sleep sound machine',
          searchQueryMercadoLivre: 'aparelho gerador ruido branco sono relaxante',
          visualIconType: 'device',
          isVerifiedPartner: false
        }
      ],
      layer03_DigitalSolutions: [
        {
          name: 'Protocolo Sono Profundo 21 Dias: Arquitetura do Ciclo Circadiano',
          format: 'Curso Online',
          transformationPromise: 'Framework neurobiológico para calibrar o relógio biológico, adormecer em menos de 15 minutos e acordar com energia alta.',
          implementationTime: '3 módulos de 20 min com plano de ação',
          estimatedPriceBRL: 97,
          painScore: 9.7,
          searchQueryPlatform: 'protocolo sono circadiano sono profundo curso 21 dias',
          isVerifiedPartner: true
        },
        {
          name: 'Guia Prático em PDF: Higiene do Quarto & Suplementação Circadiana',
          format: 'Ebook & Guia Prático',
          transformationPromise: 'Manual de bolso com auditoria de quarto, alimentação pré-cama e frequências binaurais para relaxamento neuromuscular.',
          implementationTime: 'Leitura em 20 min',
          estimatedPriceBRL: 47,
          painScore: 9.3,
          searchQueryPlatform: 'guia higiene do sono quarto escuro melatonina',
          isVerifiedPartner: false
        }
      ]
    };
  }

  // Finances / Debts / Budget control
  if (lower.includes('finan') || lower.includes('dinheiro') || lower.includes('divida') || lower.includes('dívida') || lower.includes('orcamento') || lower.includes('orçamento') || lower.includes('gasto') || lower.includes('despesa')) {
    return {
      diagnosisTitle: {
        part1Dark: 'Cegueira Orçamentária e Atrito Decisório.',
        part2Gray: 'Arquitetura de Fluxo de Caixa Passivo.'
      },
      rootCauseAnalysis: 'O endividamento e a sensação de escassez raramente decorrem apenas de renda, mas da falta de visibilidade em tempo real sobre vazamentos invisíveis e despesas recorrentes não computadas.',
      painAnatomyTags: ['Vazamentos Invisíveis', 'Ansiedade Orçamentária', 'Descontrole de Gastos', 'Atrito de Registro'],
      painAnatomyVectors: [
        {
          tag: 'Cegueira por Atrito de Registro Manual',
          vectorType: 'Vetor Primário',
          clinicalExplanation: 'A complexidade de lançar despesas item a item gera desistência rápida e perda total de visibilidade orçamentária.',
          severity: 9
        },
        {
          tag: 'Erosão Financeira por Micro-Assinaturas',
          vectorType: 'Mecanismo de Propagação',
          clinicalExplanation: 'Cobranças automáticas fragmentadas em múltiplos cartões sangram o saldo disponível sem gerar alerta perceptível.',
          severity: 8
        },
        {
          tag: 'Efeito Dopaminérgico do Crédito Sem Fricção',
          vectorType: 'Ponto Cego',
          clinicalExplanation: 'O pagamento por aproximação ou 1-clique dissocia a dor imediata do pagamento da aquisição do bem.',
          severity: 8
        },
        {
          tag: 'Ciclo de Ansiedade e Evitação Financeira',
          vectorType: 'Gatilho de Cronificação',
          clinicalExplanation: 'O medo do saldo negativo leva a não abrir o extrato bancário, acumulando juros rotativos de forma exponencial.',
          severity: 10
        }
      ],
      layer01_ImmediateRelief: {
        title: 'Engenharia de Hábito. Alívio Imediato.',
        subtitle: 'Protocolo de estancamento financeiro de custo zero para as próximas 24h',
        steps: [
          {
            stepNumber: 1,
            actionTitle: 'Cancelamento em 10 Minutos de Assinaturas Não Utilizadas',
            description: 'Abra os extratos dos últimos 30 dias e cancele serviços de streaming e apps recorrentes esquecidos. Recuperação média de R$ 120/mês.',
            timeRequired: '10 min',
            vectorType: 'Atrito Ambiental'
          },
          {
            stepNumber: 2,
            actionTitle: 'Instituição da Regra de Quarentena de 72 Horas',
            description: 'Para compras não essenciais acima de R$ 100, pause a decisão por 72 horas. 82% do impulso de dopamina dissipa nesse intervalo.',
            timeRequired: '72 horas',
            vectorType: 'Reset Biomecânico/Fisiológico'
          },
          {
            stepNumber: 3,
            actionTitle: 'Limite Único em Cartão Virtual para Lazer Semanal',
            description: 'Defina um teto estrito semanal em dinheiro ou cartão virtual exclusivo para lazer, separando das contas fixas de subsistência.',
            timeRequired: '15 min',
            vectorType: 'Micro-hábito de Ancoragem'
          }
        ]
      },
      layer02_PhysicalProducts: [
        {
          name: 'Caderno Planner Financeiro Inteligente de Planejamento Mensal 12 Meses',
          category: 'Ferramentas de Gestão',
          whyItSolves: 'Torna as metas tangíveis no papel físico, eliminando o atrito cognitivo de abrir planilhas complicadas no fim do dia.',
          pros: ['12 divisórias mensais com envelopes porta-comprovantes', 'Capa dura resistente e papel de alta gramatura', 'Seção de controle de metas e quitação de dívidas'],
          cons: ['Exige hábito manual de anotação'],
          estimatedPriceBRL: 69,
          painScore: 9.6,
          searchQueryAmazon: 'planner financeiro inteligente organizador despesas',
          searchQueryMercadoLivre: 'caderno organizador financeiro anual controle gastos',
          visualIconType: 'gear',
          isVerifiedPartner: false
        },
        {
          name: 'Cofre Organizador de Metas com Divisórias em Acrílico e Chave',
          category: 'Segurança & Metas',
          whyItSolves: 'Cria uma barreira física real para reservas de emergência imediatas e poupança de curto prazo.',
          pros: ['Construção sólida com fechadura e divisórias', 'Estimula o reforço visual de economia', 'Fácil de guardar discretamente'],
          cons: ['Capacidade finita'],
          estimatedPriceBRL: 119,
          painScore: 9.1,
          searchQueryAmazon: 'cofre organizador metas acrilico divisoria',
          searchQueryMercadoLivre: 'cofre organizador dinheiro metas economia',
          visualIconType: 'device',
          isVerifiedPartner: false
        }
      ],
      layer03_DigitalSolutions: [
        {
          name: 'Planilha Inteligente Gestão Financeira 50/30/20 & Dashboard Automatizado',
          format: 'Template / Sistema',
          transformationPromise: 'Painel visual no Google Sheets e Excel que calcula automaticamente orçamento, aportes e simula quitação de dívidas bola de neve.',
          implementationTime: '15 min de preenchimento inicial',
          estimatedPriceBRL: 87,
          painScore: 9.9,
          searchQueryPlatform: 'planilha inteligente gestao financeira 50 30 20 dashboard',
          isVerifiedPartner: true
        },
        {
          name: 'Curso Organização Financeira Prática: Saia das Dívidas e Monte sua Reserva',
          format: 'Curso Online',
          transformationPromise: 'Aulas curtas e diretas ao ponto com especialistas em renegociação bancária e blindagem de patrimônio.',
          implementationTime: '2 horas de imersão',
          estimatedPriceBRL: 127,
          painScore: 9.4,
          searchQueryPlatform: 'curso organizacao financeira renegociacao dividas reserva',
          isVerifiedPartner: false
        }
      ]
    };
  }

  // Wrist / RSI / Carpal Tunnel / Tendinitis
  if (lower.includes('punho') || lower.includes('pulso') || lower.includes('tendinite') || lower.includes('ler') || lower.includes('dort') || lower.includes('túnel do carpo') || lower.includes('tunel do carpo') || (lower.includes('mão') && lower.includes('dor'))) {
    return {
      diagnosisTitle: {
        part1Dark: 'Torção de Pronação e Compressão do Túnel do Carpo.',
        part2Gray: 'Alívio Articular e Alinhamento Neutro.'
      },
      rootCauseAnalysis: 'O uso prolongado de mouse horizontal convencional força o rádio e a ulna a cruzarem em pronação de 90°, comprimindo o nervo mediano e inflamando os tendões flexores. A posição de aperto de mão natural a 57° neutraliza essa tensão imediatamente.',
      painAnatomyTags: ['Nervo Mediano Comprimido', 'Pronação Excessiva', 'Inflamação de Tendões', 'Atrito Repetitivo'],
      painAnatomyVectors: [
        {
          tag: 'Torção de Pronação a 90°',
          vectorType: 'Vetor Primário',
          clinicalExplanation: 'Mouse tradicional força o rádio a cruzar a ulna, comprimindo continuamente o túnel do carpo contra a mesa.',
          severity: 10
        },
        {
          tag: 'Compressão do Nervo Mediano',
          vectorType: 'Mecanismo de Propagação',
          clinicalExplanation: 'A pressão na base da palma provoca parestesia (formigamento), queimação e perda reflexa de força de preensão.',
          severity: 9
        },
        {
          tag: 'Quina Viva da Mesa sem Apoio Proximal',
          vectorType: 'Ponto Cego',
          clinicalExplanation: 'Descansar o pulso na borda afiada da mesa corta o fluxo venoso local durante a digitação e uso do mouse.',
          severity: 8
        },
        {
          tag: 'Repetição Isquêmica Contínua sem Pausa Cinética',
          vectorType: 'Gatilho de Cronificação',
          clinicalExplanation: 'Micro-movimentos repetitivos sem alívio geram microlesões tendíneas cumulativas (LER/DORT).',
          severity: 9
        }
      ],
      layer01_ImmediateRelief: {
        title: 'Engenharia de Hábito. Alívio Imediato.',
        subtitle: 'Protocolo de descompressão do túnel do carpo para alívio hoje',
        steps: [
          {
            stepNumber: 1,
            actionTitle: 'Ajuste de Ângulo dos Braços a 90° em Relação à Mesa',
            description: 'Apoie o antebraço inteiro no plano da mesa, sem deixar o punho dobrado para cima no teclado.',
            timeRequired: '3 min',
            vectorType: 'Atrito Ambiental'
          },
          {
            stepNumber: 2,
            actionTitle: 'Alongamento do Oração Invertida para Punhos',
            description: 'Junte as palmas das mãos em posição de prece na altura do peito e empurre suavemente para baixo por 20 segundos para descomprimir o nervo.',
            timeRequired: '2 min',
            vectorType: 'Reset Biomecânico/Fisiológico'
          },
          {
            stepNumber: 3,
            actionTitle: 'Pausa Ativa Cinética de 30 Segundos por Hora',
            description: 'Gire suavemente os punhos para dentro e para fora 10 vezes em cada intervalo de trabalho.',
            timeRequired: '1 min',
            vectorType: 'Micro-hábito de Ancoragem'
          }
        ]
      },
      layer02_PhysicalProducts: [
        {
          name: 'Mouse Ergonômico Vertical Sem Fio Logitech Lift 57° / MX Master 3S',
          category: 'Hardware Ergonômico de Precisão',
          whyItSolves: 'Mantém a mão e o antebraço no ângulo natural de aperto de mão a 57°, eliminando a torção articular e a queimação no pulso.',
          pros: ['Ângulo anatômico 57° validado clinicamente', 'Rolagem magnética silenciosa SmartWheel', 'Bateria com autonomia de até 2 anos'],
          cons: ['Adaptação motora de 24h a 48h'],
          estimatedPriceBRL: 379,
          painScore: 9.9,
          searchQueryAmazon: 'mouse logitech lift ergonomico vertical sem fio 57',
          searchQueryMercadoLivre: 'mouse logitech lift vertical sem fio bluetooth',
          visualIconType: 'device',
          isVerifiedPartner: true
        },
        {
          name: 'Apoio de Punho Ergonômico em Gel com Memória para Teclado e Mouse',
          category: 'Apoio Articular',
          whyItSolves: 'Evita a hiperextensão do punho sobre a quina da mesa, distribuindo o peso do braço sobre almofada de gel termoestável.',
          pros: ['Gel anatômico de resiliência durável', 'Base antiderrapante em borracha natural', 'Revestimento lavável e toque fresco'],
          cons: ['Exige espaço frontal de 8cm na mesa'],
          estimatedPriceBRL: 79,
          painScore: 9.5,
          searchQueryAmazon: 'apoio punho teclado mouse ergonomico gel memoria',
          searchQueryMercadoLivre: 'apoio punho teclado ergonomico gel viscoelastico',
          visualIconType: 'gear',
          isVerifiedPartner: false
        }
      ],
      layer03_DigitalSolutions: [
        {
          name: 'Guia Clínico de Fisioterapia: Prevenção & Alívio de LER/DORT em Home Office',
          format: 'Ebook & Guia Prático',
          transformationPromise: 'Manual ilustrado de descompressão muscular, técnicas de automassagem miofascial e protocolo anti-inflamatório caseiro.',
          implementationTime: '10 min de exercícios por dia',
          estimatedPriceBRL: 49,
          painScore: 9.6,
          searchQueryPlatform: 'guia fisioterapia tendinite ler dort prevencao home office',
          isVerifiedPartner: true
        },
        {
          name: 'Template Notion Ergonomia & Protocolo de Saúde Biomecânica',
          format: 'Template / Sistema',
          transformationPromise: 'Checklist interativo de ergonomia para calibrar altura de cadeira, braços, apoio de pés e pausas inteligentes.',
          implementationTime: '15 min de auditoria',
          estimatedPriceBRL: 39,
          painScore: 9.2,
          searchQueryPlatform: 'notion template ergonomia postura e saude articular',
          isVerifiedPartner: false
        }
      ]
    };
  }

  // Generic sophisticated fallback
  return {
    diagnosisTitle: {
      part1Dark: 'Atrito Sistêmico em Rotina.',
      part2Gray: 'Otimização com Engenharia de Processos.'
    },
    rootCauseAnalysis: `A fricção relatada em "${userPain.slice(0, 80)}" decorre do descompasso entre a demanda cognitiva imposta e as estruturas de apoio presentes no ambiente. Ajustar hábitos imediatos e instalar ferramentas de alta precisão interrompe o ciclo de sobrecarga.`,
    painAnatomyTags: ['Fadiga Estrutural', 'Fricção de Execução', 'Pontos de Atrito', 'Carga Residual'],
    painAnatomyVectors: [
      {
        tag: 'Gargalo Estrutural Primário',
        vectorType: 'Vetor Primário',
        clinicalExplanation: 'Incompatibilidade entre a demanda cognitiva imposta e as estruturas de apoio presentes no ambiente.',
        severity: 9
      },
      {
        tag: 'Fricção de Execução Cumulativa',
        vectorType: 'Mecanismo de Propagação',
        clinicalExplanation: 'Micro-resistências diárias na execução drenam energia de vontade e provocam sobrecarga sistêmica.',
        severity: 8
      },
      {
        tag: 'Ponto Cego de Automação de Processos',
        vectorType: 'Ponto Cego',
        clinicalExplanation: 'Tentativas repetidas de esforço manual em tarefas que demandam ferramentas dedicadas de alívio passivo.',
        severity: 8
      },
      {
        tag: 'Gatilho de Cronificação da Inércia',
        vectorType: 'Gatilho de Cronificação',
        clinicalExplanation: 'A ausência de um pré-compromisso com gatilhos físicos consolida o ciclo de desconforto diário.',
        severity: 9
      }
    ],
    layer01_ImmediateRelief: {
      title: 'Engenharia de Hábito. Alívio Imediato.',
      subtitle: 'Protocolo de tripla ação imediata para reduzir o desgaste hoje sem desembolsar recursos',
      steps: [
        {
          stepNumber: 1,
          actionTitle: 'Padronização da Entrada de Tarefas',
          description: 'Crie uma gaveta ou espaço único para processar itens pendentes, impedindo a contaminação de outros ambientes.',
          timeRequired: '5 min',
          vectorType: 'Atrito Ambiental'
        },
        {
          stepNumber: 2,
          actionTitle: 'Auditoria de Gargalo de 3 Minutos',
          description: 'Identifique o exato ponto de parada que gera resistência e defina um pré-compromisso claro para remover o obstáculo físico.',
          timeRequired: '3 min',
          vectorType: 'Reset Biomecânico/Fisiológico'
        },
        {
          stepNumber: 3,
          actionTitle: 'Checklist de Fechamento Diário',
          description: 'Dedique os últimos 7 minutos do seu ciclo para listar as prioridades do dia seguinte, aliviando a memória de trabalho.',
          timeRequired: '7 min',
          vectorType: 'Micro-hábito de Ancoragem'
        }
      ]
    },
    layer02_PhysicalProducts: [
      {
        name: 'Organizador de Mesa Minimalista em Alumínio Orbitkey Desk Mat',
        category: 'Engenharia do Espaço',
        whyItSolves: 'Elimina ruído visual e delimita zonas físicas estritas para ferramentas essenciais de uso diário com trilho magnético.',
        pros: ['Design atemporal em couro vegano e alumínio', 'Trilho magnético anti-bagunça', 'Barreira contra desorganização visual'],
        cons: ['Requer mesa com ao menos 70cm de largura'],
        estimatedPriceBRL: 189,
        painScore: 9.6,
        searchQueryAmazon: 'organizador de mesa aluminio minimalista orbitkey',
        searchQueryMercadoLivre: 'organizador escritorio aluminio anodizado desk mat',
        visualIconType: 'gear',
        isVerifiedPartner: false
      },
      {
        name: 'Mouse Ergonômico Vertical Sem Fio Logitech Lift 57° / MX Master 3S',
        category: 'Hardware de Alta Precisão',
        whyItSolves: 'Coloca o antebraço na posição anatômica natural de aperto de mão, reduzindo fadiga muscular e atrito repetitivo.',
        pros: ['Ângulo anatômico ideal de 57°', 'Cliques ultrassilenciosos e rolagem magnética SmartWheel', 'Bateria com duração de até 2 anos'],
        cons: ['Período de adaptação motora de 48 horas'],
        estimatedPriceBRL: 379,
        painScore: 9.9,
        searchQueryAmazon: 'mouse logitech lift ergonomico vertical sem fio',
        searchQueryMercadoLivre: 'mouse logitech lift vertical bluetooth',
        visualIconType: 'device',
        isVerifiedPartner: true
      }
    ],
    layer03_DigitalSolutions: [
      {
        name: 'Template Notion Second Brain & Life OS 2.0 (Tiago Forte / Thomas Frank)',
        format: 'Template / Sistema',
        transformationPromise: 'Centraliza metas, projetos, notas e rastreamento de hábitos em uma interface limpa sem distrações.',
        implementationTime: '15 minutos para clonar e rodar',
        estimatedPriceBRL: 97,
        painScore: 9.8,
        searchQueryPlatform: 'notion template second brain life os tiago forte',
        isVerifiedPartner: true
      },
      {
        name: 'Método Deep Work & Foco Sem Telas: Neurociência da Inércia',
        format: 'Curso Online',
        transformationPromise: 'Framework neurocientífico passo a passo para reconstruir foco contínuo e eliminar distrações crônicas.',
        implementationTime: '3 horas de aulas aplicadas',
        estimatedPriceBRL: 147,
        painScore: 9.4,
        searchQueryPlatform: 'metodo deep work neurociencia foco livro curso',
        isVerifiedPartner: false
      }
    ]
  };
}
