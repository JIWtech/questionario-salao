const STORAGE_KEY = 'noria_questionario_ic_salon_v1';
const UNDEF = 'Ainda não definido', NA = 'Não se aplica', TO_TEAM = 'Encaminhar para a equipe';
const WEEKDAYS = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo','Feriados'];
const FROM_PRICE = 'A partir de (valor final após avaliação)';
const PRE_BOOK = 'A IA pré-agenda e a equipe confirma';

// Atalhos por pergunta: todas recebem "Ainda não definido", exceto as de fato/confirmação (plain).
// "Não se aplica" só onde a pergunta pode não existir; "Encaminhar para a equipe" só em condutas com a cliente.
const SHORTCUT_RULES = {
  plain:['1.1.3','1.2.1','2.1.1','3.1.1','3.1.3','4.1.1','4.1.3','4.1.4','5.1.1','5.1.4','5.4.3','6.2.2','7.1.2','7.1.4','7.2.1','10.2.2'],
  na:['1.1.2','1.1.7','2.1.4','2.2.3','5.2.1','7.1.5','7.2.5'],
  team:['4.1.2','5.2.2','6.2.3']
};
const shortcutsFor = id => SHORTCUT_RULES.plain.includes(id) ? [] :
  [UNDEF, ...(SHORTCUT_RULES.na.includes(id)?[NA]:[]), ...(SHORTCUT_RULES.team.includes(id)?[TO_TEAM]:[])];

const q = (id, text, type='textarea', extra={}) => ({id,text,type,quick:shortcutsFor(id),...extra});
const yesNo = (id,text,extra={}) => q(id,text,'radio',{options:['Sim','Não',...shortcutsFor(id)],...extra});
const choice = (id,text,options,extra={}) => q(id,text,'radio',{options:[...options,...shortcutsFor(id)],...extra});
const pick = (id,text,options,extra={}) => q(id,text,'radio',{options,...extra});
const multi = (id,text,options,extra={}) => q(id,text,'radio',{options,multi:true,...extra});
const weekGrid = (id,text,extra={}) => q(id,text,'grid',{keys:WEEKDAYS,placeholder:'ex.: 09h–19h ou Fechado',...extra});

const sections = [
  {title:'1. Identidade e WhatsApp', subsections:[
    {title:'1.1 Nome, apresentação e linguagem', questions:[
      choice('1.1.1','Qual nome comercial a IA deve usar?',['I&C Salon','I&C Salon Cidade Jardim','Outro'],{other:true}),
      q('1.1.2','A atendente terá um nome? Qual?','text'),
      choice('1.1.3','Na reunião, combinamos esta apresentação: “Oi, tudo bem? Sou nova na equipe, com quem eu falo? Como posso ajudar você hoje?”. Mantém?',['Sim, manter','Ajustar o texto'],{followupOn:'Ajustar o texto',followupId:'1.1.3a',followupText:'Escreva a apresentação desejada.'}),
      choice('1.1.4','Qual tom de conversa combina com o salão?',['Acolhedor e próximo','Rápido e objetivo','Consultivo (orienta e sugere)','Formal']),
      choice('1.1.5','A IA pode usar emojis?',['Sim, com moderação','Só em saudações','Não usar']),
      choice('1.1.6','Se a cliente perguntar diretamente se está falando com um robô ou uma IA, o que responder?',['Confirmar que é a assistente digital da equipe e seguir o atendimento','Confirmar e oferecer falar com uma pessoa da equipe','Outro'],{other:true,note:'A IA se apresenta como integrante da equipe, como combinado. Por transparência, ela não nega ser uma IA quando a cliente pergunta diretamente.'}),
      q('1.1.7','Quais palavras, gírias ou formas de tratamento devem ser evitadas?')
    ]},
    {title:'1.2 WhatsApp', questions:[
      choice('1.2.1','O telefone (22) 99963-3775, que aparece no Instagram, é o WhatsApp que será conectado à NORIA?',['Sim','Não, será outro número'],{followupOn:'Não, será outro número',followupId:'1.2.1a',followupText:'Qual número será conectado?'}),
      q('1.2.2','Quem responde esse WhatsApp hoje?','text')
    ]}
  ]},
  {title:'2. Funcionamento e agenda', subsections:[
    {title:'2.1 Endereço', questions:[
      choice('2.1.1','O Instagram mostra “Av. das Acácias, 209 – Cidade Jardim”. Está correto?',['Sim','Não, há correções'],{followupOn:'Não, há correções',followupId:'2.1.1a',followupText:'Informe o endereço correto.'}),
      q('2.1.2','Qual é o endereço completo (complemento, bairro, cidade e CEP)?','text'),
      q('2.1.3','Qual ponto de referência ou link do Google Maps deve ser enviado?','text'),
      q('2.1.4','Há estacionamento ou alguma informação de acesso importante?')
    ]},
    {title:'2.2 Horários', questions:[
      weekGrid('2.2.1','Horário de funcionamento do salão em cada dia'),
      choice('2.2.2','Serviços longos, como mechas, ocupam meio período. Quais são os turnos?',['Manhã das 09h30 às 12h00 e tarde a partir das 13h','Outro'],{other:true}),
      q('2.2.3','Os horários de início dos atendimentos seguem uma grade? (ex.: de 30 em 30 minutos)','text'),
      q('2.2.4','Com quanta antecedência mínima a cliente pode agendar? E até quantos dias à frente?','text'),
      choice('2.2.5','Quando chegar mensagem fora do horário, o que a IA deve fazer?',['Atender normalmente e agendar','Atender e avisar que a equipe confirma no próximo horário','Informar o horário de funcionamento','Outro'],{other:true}),
      q('2.2.6','Em que horário a equipe responde o WhatsApp?','text')
    ]}
  ]},
  {title:'3. Equipe e agendas', subsections:[
    {title:'3.1 Regras da equipe', questions:[
      choice('3.1.1','Na reunião, foram citados 4 profissionais. Está correto?',['Sim, 4 profissionais','Não'],{followupOn:'Não',followupId:'3.1.1a',followupText:'Quantos são?'}),
      choice('3.1.2','A cliente pode escolher o profissional?',['Sim, sempre','Sim, quando houver vaga; senão a IA oferece outro','Não, o salão define'],{note:'Cada profissional tem a própria agenda. A IA cruza o serviço pedido com quem o realiza.'}),
      choice('3.1.3','Cancelamentos em cima da hora: a gestão do salão avisa os profissionais internamente, porque eles não terão acesso ao sistema. Confirma?',['Sim, confirmo','Não, há correções'],{followupOn:'Não, há correções',followupId:'3.1.3a',followupText:'Como deve funcionar?'}),
      q('3.1.4','Quem atualiza bloqueios da agenda (folgas, férias, compromissos)?','text')
    ]},
    {title:'3.2 Ficha de cada profissional', repeater:'pros', description:'Uma ficha por profissional. Os nomes César e Ítalo foram citados na reunião; complete os demais.'}
  ]},
  {title:'4. Catálogo de serviços', subsections:[
    {title:'4.1 O que o salão faz e não faz', questions:[
      choice('4.1.1','Confirma que o salão NÃO faz: unha de gel, acrigel, fibra, postiça ou “realista”, henna na sobrancelha e pacote de Dia da Noiva?',['Sim, confirmo','Não, há correções'],{followupOn:'Não, há correções',followupId:'4.1.1a',followupText:'O que mudou?'}),
      q('4.1.2','Quando pedirem um serviço que o salão não faz, o que a IA deve sugerir no lugar?'),
      yesNo('4.1.3','O salão vende produtos (o Instagram tem o destaque “Produtos”)?',{followupOn:'Sim',followupId:'4.1.3a',followupText:'Quais produtos e a IA pode informar preços?'}),
      choice('4.1.4','A foto do panfleto já foi enviada. Maquiagem e penteado não estão no panfleto e foram incluídos na lista abaixo. Há outros serviços fora do panfleto?',['Não, a lista está completa','Sim'],{followupOn:'Sim',followupId:'4.1.4a',followupText:'Quais? Adicione também uma ficha para cada um abaixo.'})
    ]},
    {title:'4.2 Ficha de cada serviço', repeater:'services', description:'A lista já vem com os serviços citados na reunião e no Instagram. Confira, complete preço, duração e profissionais, remova o que não existir e adicione o que faltar. Preço no Pix/dinheiro é o valor padrão que a IA informa.'}
  ]},
  {title:'5. Avaliação, química e restrições', subsections:[
    {title:'5.1 Avaliação e preço pela balança', questions:[
      choice('5.1.1','A avaliação é presencial, gratuita e não é feita por foto. Confirma?',['Sim, confirmo','Não, há correções'],{followupOn:'Não, há correções',followupId:'5.1.1a',followupText:'Como funciona?'}),
      q('5.1.2','Como a IA deve explicar o preço pela balança? Escreva com suas palavras.'),
      q('5.1.3','Quais são as 3 medidas da balança e o valor de cada uma?'),
      choice('5.1.4','O valor final só pode ficar acima do “a partir de”, nunca abaixo. Confirma?',['Sim, confirmo','Não, há correções'],{followupOn:'Não, há correções',followupId:'5.1.4a',followupText:'Qual é a regra?'}),
      q('5.1.5','Como funciona o teste de mechas? Quando é feito e quanto tempo leva?'),
      choice('5.1.6','A avaliação pode ser agendada pela IA?',['Sim, a IA agenda a avaliação','A IA pré-agenda e a equipe confirma','Só a equipe agenda'])
    ]},
    {title:'5.2 Química e intervalos', questions:[
      q('5.2.1','Qual intervalo mínimo é exigido desde o último procedimento químico, para cada tipo de serviço?'),
      q('5.2.2','O que a IA deve fazer quando a cliente fez química recentemente?')
    ]},
    {title:'5.3 Serviços que não podem ser feitos juntos', repeater:'incompat', description:'Uma ficha para cada combinação proibida no mesmo dia ou que exige intervalo. Ex.: progressiva + mechas.'},
    {title:'5.4 Fotos de antes e depois', questions:[
      choice('5.4.1','Quando a IA deve enviar fotos de antes e depois?',['Sempre que a cliente perguntar sobre aquele serviço','Só em orçamentos de mechas e química','Só quando a cliente pedir','Outro'],{other:true}),
      q('5.4.2','Quem envia as fotos para a equipe NORIA e qual é o prazo?','text'),
      yesNo('5.4.3','As clientes das fotos autorizaram o uso?')
    ]}
  ]},
  {title:'6. Agendamento', subsections:[
    {title:'6.1 Dados e confirmação', questions:[
      multi('6.1.1','Quais dados a IA deve coletar para agendar?',['Nome','Sobrenome','Serviço','Detalhe do serviço (ex.: só mão, só pé, pé e mão)','Profissional de preferência','Data e horário','Se é a primeira vez no salão','Telefone de contato, se for outro'],{note:'Como combinado, a IA não pergunta idade nem data de nascimento.'}),
      choice('6.1.2','Como a IA deve tratar o atendimento de menores?',['Avisar que menores são atendidos com o pai ou a mãe quando a cliente indicar que é para menor','Incluir o aviso em toda confirmação de agendamento','Outro'],{other:true}),
      yesNo('6.1.3','A cliente deve confirmar um resumo (serviço, profissional, data e hora) antes do registro?'),
      q('6.1.4','Qual mensagem deve ser enviada depois que o agendamento for registrado?'),
      q('6.1.5','Nos serviços que a equipe confirma (ex.: mechas), quem confere e em quanto tempo responde?'),
      q('6.1.6','Qual mensagem a IA envia enquanto a equipe confere o pré-agendamento?')
    ]},
    {title:'6.2 Vagas e situações especiais', questions:[
      choice('6.2.1','Quando não houver vaga no horário pedido, o que a IA deve fazer?',['Oferecer outros horários do mesmo profissional','Oferecer outro profissional que faça o serviço','Oferecer alternativas e, se não resolver, encaminhar','Encaminhar para a equipe'],{}),
      yesNo('6.2.2','Existe encaixe ou lista de espera?',{followupOn:'Sim',followupId:'6.2.2a',followupText:'Como funciona?'}),
      q('6.2.3','Como agendar mais de um serviço no mesmo atendimento (ex.: corte + escova, pé e mão + sobrancelha)?'),
      yesNo('6.2.4','A cliente pode agendar para outra pessoa?',{followupOn:'Sim',followupId:'6.2.4a',followupText:'Quais dados da outra pessoa são necessários?'}),
      yesNo('6.2.5','Deseja lembrete automático antes do horário?',{followupOn:'Sim',followupId:'6.2.5a',followupText:'Com quanta antecedência?'})
    ]}
  ]},
  {title:'7. Pagamento e regra de sinal', subsections:[
    {title:'7.1 Formas de pagamento', questions:[
      multi('7.1.1','Quais formas de pagamento são aceitas?',['Dinheiro','Pix','Cartão de débito','Cartão de crédito','Outro'],{other:true}),
      choice('7.1.2','Combinamos: a IA informa o valor do Pix/dinheiro e só fala do valor no cartão de crédito se a cliente perguntar. Confirma?',['Sim, confirmo','Não, há correções'],{condition:{id:'7.1.1',includes:'Cartão de crédito'},followupOn:'Não, há correções',followupId:'7.1.2a',followupText:'Qual é a regra?'}),
      choice('7.1.3','Como é calculado o valor no cartão de crédito?',['Acréscimo percentual sobre o valor do Pix','Tabela própria (preenchida em cada ficha de serviço)','Outro'],{other:true,condition:{id:'7.1.1',includes:'Cartão de crédito'},followupOn:'Acréscimo percentual sobre o valor do Pix',followupId:'7.1.3a',followupText:'Qual percentual?'}),
      choice('7.1.4','O débito tem o mesmo valor do Pix?',['Sim','Não, tem o valor do crédito','Outro'],{other:true,condition:{id:'7.1.1',includes:'Cartão de débito'}}),
      q('7.1.5','Há parcelamento? Em quantas vezes e a partir de qual valor?','text',{condition:{id:'7.1.1',includes:'Cartão de crédito'}}),
      q('7.1.6','Qual é a chave Pix e o nome do favorecido?','text'),
      choice('7.1.7','A IA pode oferecer desconto?',['Nunca: só os valores cadastrados','Outro'],{other:true})
    ]},
    {title:'7.2 Sinal para quem faltou', questions:[
      choice('7.2.1','Regra combinada: 1º agendamento sem sinal. Se a cliente faltar ou desmarcar em cima da hora, para reagendar paga 50% de sinal via Pix. Se comparecer nesse, volta ao normal sem sinal. Vale para todos os serviços. Confirma?',['Sim, confirmo','Não, há correções'],{followupOn:'Não, há correções',followupId:'7.2.1a',followupText:'Qual é a regra correta?'}),
      q('7.2.2','O que conta como “em cima da hora”? (ex.: menos de 4 horas antes)','text'),
      q('7.2.3','Quem marca no sistema que a cliente faltou?','text'),
      q('7.2.4','Se a cliente pagou o sinal e faltou de novo, o que acontece com o valor?'),
      q('7.2.5','Nos serviços “a partir de”, o sinal de 50% é calculado sobre qual valor?'),
      choice('7.2.6','O que deve iniciar a conferência do sinal?',['Envio do comprovante','Qualquer aviso de pagamento','Outro'],{other:true}),
      q('7.2.7','Quem confere o Pix do sinal?','text')
    ]}
  ]},
  {title:'8. Cancelamento e atraso', subsections:[
    {title:'8.1 Regras', questions:[
      q('8.1.1','Com quanta antecedência a cliente pode cancelar ou remarcar sem penalidade?','text'),
      q('8.1.2','Qual é a tolerância de atraso? O que acontece depois dela?'),
      choice('8.1.3','A IA pode remarcar ou cancelar sozinha?',['Sim, dentro das regras acima','Só remarcar; cancelamento vai para a equipe','Não, tudo vai para a equipe']),
      q('8.1.4','Qual mensagem enviar quando o salão precisar desmarcar ou remanejar uma cliente?')
    ]}
  ]},
  {title:'9. Situações de conversa', subsections:[
    {title:'9.1 Respostas desejadas', scenarios:true, description:'As cinco primeiras situações foram simuladas na reunião e já vêm com a resposta combinada. Confira, ajuste e preencha as demais.'}
  ]},
  {title:'10. Encaminhamento, Kanban e acompanhamento', subsections:[
    {title:'10.1 Encaminhamento para a equipe', questions:[
      multi('10.1.1','Em quais situações a IA deve chamar a equipe?',['Pré-agendamento de mechas ou química','Cliente pediu uma pessoa','Reclamação','Cancelamento ou remarcação','Comprovante de sinal','Dúvida técnica sobre o cabelo','Reação ou problema após procedimento','Outro'],{other:true}),
      q('10.1.2','Qual mensagem padrão a IA envia ao chamar a equipe?'),
      q('10.1.3','Quem recebe cada tipo de caso? (ex.: mechas – profissional de mechas; sinal – gestão)'),
      choice('10.1.4','Como devem ficar as colunas do Kanban (painel de conversas)?',['Padrão sugerido: Conversas IA > Aguardando humano > Verificar Sinal > Em atendimento humano > Agendamentos > Finalizadas > Conversas abandonadas > Follow-ups','Quero outras colunas'],{followupOn:'Quero outras colunas',followupId:'10.1.4a',followupText:'Quais colunas, nesta ordem?'}),
      yesNo('10.1.5','Depois de chamar a equipe, a IA deve ficar em silêncio naquela conversa?'),
      q('10.1.6','Quem pode devolver a conversa para a IA?','text')
    ]},
    {title:'10.2 Mensagens automáticas e contatos', questions:[
      yesNo('10.2.1','A IA deve entender mensagens de áudio?'),
      yesNo('10.2.2','Existem contatos que só devem ser atendidos por pessoas? (fornecedores, família, equipe)',{followupOn:'Sim',followupId:'10.2.2a',followupText:'Liste os números ou categorias.'}),
      choice('10.2.3','Quando a cliente parar de responder no meio do agendamento, a IA deve retomar?',['Sim, depois de algumas horas','Sim, no dia seguinte','Não retomar','Outro'],{other:true}),
      yesNo('10.2.4','Deseja mensagens de retorno para manutenção (ex.: retoque de raiz, cronograma capilar)?',{followupOn:'Sim',followupId:'10.2.4a',followupText:'Para quais serviços e depois de quantos dias?'}),
      yesNo('10.2.5','Deseja enviar promoções pelo WhatsApp para clientes antigas?',{followupOn:'Sim',followupId:'10.2.5a',followupText:'Com que frequência? Como a cliente pede para não receber?'}),
      q('10.2.6','Qual mensagem de agradecimento deve ser enviada depois do atendimento?')
    ]},
    {title:'10.3 Validação', questions:[
      q('10.3.1','Quais são as cinco perguntas mais frequentes das clientes?'),
      q('10.3.2','Quais erros de atendimento não podem acontecer?'),
      q('10.3.3','Quem vai aprovar as respostas e avisar mudanças de preço, equipe ou regras?','text'),
      q('10.3.4','Quais situações devem ser testadas antes de ativar?')
    ]}
  ]}
];

const repeaters = {
  pros:{itemLabel:'Profissional', addLabel:'+ Adicionar profissional', questions:[
    q('3.2.1','Nome','text'),
    q('3.2.2','Especialidade','text'),
    q('3.2.3','Quais serviços realiza?'),
    weekGrid('3.2.4','Dias e horários de trabalho'),
    pick('3.2.5','Tem acesso ao painel da NORIA?',['Não (a gestão repassa)','Sim'])
  ]},
  services:{itemLabel:'Serviço', addLabel:'+ Adicionar outro serviço', questions:[
    q('4.2.1','Nome do serviço','text'),
    pick('4.2.2','Categoria',['Cabelo','Estética e corpo','Sobrancelha','Unhas','Maquiagem e penteado','Outro']),
    q('4.2.3','Descrição que a IA deve usar'),
    pick('4.2.4','Tipo de preço',['Preço fixo',FROM_PRICE]),
    q('4.2.5','Preço no Pix ou dinheiro','text'),
    q('4.2.6','Preço no cartão de crédito','text'),
    q('4.2.7','Duração média','text'),
    q('4.2.8','Tempo a reservar na agenda','text'),
    q('4.2.9','Quais profissionais fazem','text'),
    pick('4.2.10','Precisa de avaliação presencial antes?',['Sim, obrigatória','Recomendada','Não']),
    pick('4.2.11','Como a IA pode agendar?',['A IA agenda direto',PRE_BOOK,'Somente a equipe agenda']),
    q('4.2.12','O que a IA precisa perguntar antes de passar preço e horário?','text'),
    q('4.2.13','Preparo ou cuidados que a cliente precisa saber'),
    pick('4.2.14','Tem foto de antes e depois para a IA enviar?',['Sim, já enviada','Vou enviar','Não'])
  ]},
  incompat:{itemLabel:'Combinação', addLabel:'+ Adicionar outra combinação', questions:[
    q('5.3.1','Serviço A','text'),
    q('5.3.2','Serviço B','text'),
    pick('5.3.3','Regra',['Não podem no mesmo dia','Precisam de intervalo mínimo','Só após avaliação']),
    q('5.3.4','Intervalo mínimo ou detalhe','text'),
    q('5.3.5','Como a IA deve explicar para a cliente','text')
  ]}
};

const service = (name,cat,extra={}) => ({'4.2.1':name,'4.2.2':cat,...extra});
const chemical = {'4.2.4':FROM_PRICE,'4.2.10':'Sim, obrigatória'};
const highlights = {...chemical,'4.2.7':'4 a 5 horas','4.2.8':'Meio período (manhã 09h30–12h00 ou tarde)','4.2.9':'Apenas 1 profissional:','4.2.11':PRE_BOOK,'4.2.12':'Tipo de mecha e há quanto tempo fez a última química','4.2.13':'Sempre é feito teste de mechas antes.','4.2.14':'Vou enviar'};
const nails = {'4.2.12':'Se é só mão, só pé ou pé e mão'};
const SEED_SERVICES = [
  service('Mechas loiras','Cabelo',highlights),
  service('Morena iluminada','Cabelo',highlights),
  service('Coloração','Cabelo',chemical),
  service('Progressiva','Cabelo',chemical),
  service('Realinhamento capilar','Cabelo'),
  service('Corte','Cabelo'),
  service('Escova','Cabelo'),
  service('Terapia capilar','Cabelo',{'4.2.3':'Atendimento personalizado'}),
  service('Cronograma capilar','Cabelo'),
  service('Limpeza de pele','Estética e corpo'),
  service('Drenagem','Estética e corpo'),
  service('Massagem modeladora','Estética e corpo'),
  service('Massagem relaxante','Estética e corpo'),
  service('Design de sobrancelha','Sobrancelha',{'4.2.3':'Somente design (o salão não faz henna).'}),
  service('Mão tradicional','Unhas',{...nails,'4.2.3':'Cutilagem e esmaltação tradicional.'}),
  service('Pé tradicional','Unhas',{...nails,'4.2.3':'Cutilagem e esmaltação tradicional.'}),
  service('Pé e mão tradicional','Unhas',{...nails,'4.2.4':'Preço fixo','4.2.5':'R$ 57,00'}),
  service('Spa dos pés','Unhas'),
  service('Plástica dos pés','Unhas'),
  service('Maquiagem','Maquiagem e penteado',{'4.2.3':'Não consta no panfleto físico.'}),
  service('Penteado','Maquiagem e penteado',{'4.2.3':'Não consta no panfleto físico.'})
];

const IA='Continuar com IA';
const scenarios = [
  ['9.1.1','“Oi, queria saber mais sobre os serviços.”','Dar bom dia/boa tarde, se apresentar como nova na equipe, perguntar o nome e qual serviço a cliente procura. Não enviar o catálogo completo logo de cara.',IA],
  ['9.1.2','“Quanto custa fazer as unhas?”','Antes de passar preço ou horário, perguntar se é só mão, só pé ou pé e mão, porque cada opção ocupa um tempo diferente na agenda.',IA],
  ['9.1.3','“Poxa, achei muito caro.”','Nunca oferecer desconto. Destacar o diferencial do salão e a qualidade dos produtos e explicar que o valor informado já é o valor diferenciado para dinheiro ou Pix.',IA],
  ['9.1.4','“Quanto fica fazer luzes no meu cabelo?”','Perguntar o tipo de mecha (loiro, morena iluminada...) e há quanto tempo fez a última química; avisar que sempre é feito teste de mechas; explicar o preço justo pela balança, informar o valor “a partir de”, enviar a foto de antes e depois daquele serviço e convidar para a avaliação presencial gratuita.',IA],
  ['9.1.5','“Quero mudar o cabelo, o que você sugere?”','Perguntar como é o cabelo hoje, se já pensou em algo ou tem foto de referência, e convidar para uma avaliação presencial no salão.',IA],
  ['9.1.6','“Vocês fazem unha de gel ou alongamento?”','',''],
  ['9.1.7','“Fazem henna na sobrancelha?”','',''],
  ['9.1.8','“Vocês têm pacote de Dia da Noiva?”','',''],
  ['9.1.9','“Posso mandar foto do meu cabelo para você avaliar?”','Explicar com carinho que a avaliação não é feita por foto, porque a foto engana sobre o volume e o estado do fio, e convidar para a avaliação presencial gratuita.',IA],
  ['9.1.10','“Aceita cartão de crédito?”','Confirmar que aceita e informar o valor no crédito, que é diferente do valor no Pix ou dinheiro.',IA],
  ['9.1.11','“Quero marcar com o Ítalo.”','',''],
  ['9.1.12','“É para minha filha de 15 anos.”','Informar que menores são atendidos acompanhados do pai ou da mãe e seguir com o agendamento.',IA],
  ['9.1.13','“Não vou conseguir ir hoje.” (poucas horas antes)','',''],
  ['9.1.14','Cliente que faltou da última vez quer remarcar.','Explicar que, para reagendar, é necessário sinal de 50% via Pix.',''],
  ['9.1.15','“Quero fazer progressiva e mechas no mesmo dia.”','',''],
  ['9.1.16','A IA não entendeu um áudio ou uma mensagem.','','']
];

const emptyState = () => ({
  answers:{},
  repeaters:{pros:[{'3.2.1':'César','3.2.5':'Não (a gestão repassa)'},{'3.2.1':'Ítalo','3.2.5':'Não (a gestão repassa)'},{},{}], services:SEED_SERVICES.map(s=>({...s})), incompat:[{}]},
  scenarios:Object.fromEntries(scenarios.map(([id,,answer,route])=>[id,{answer,route}])),
  meta:{}, final:{}
});
const repeaterDrawers = {};
let state = loadState();

function loadState(){
  try { const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(saved) return {...emptyState(),...saved}; } catch {}
  return emptyState();
}
function saveState(){
  collectFixed();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  updateProgress();
}
function esc(v=''){ return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function valueOf(id){ return state.answers[id] ?? ''; }
function isAnsweredValue(v){
  if(Array.isArray(v)) return v.length>0;
  if(v && typeof v==='object') return Object.values(v).some(x=>String(x??'').trim()!=='');
  return String(v??'').trim()!=='';
}
function conditionMet(cond){
  if(!cond) return true; const v=valueOf(cond.id);
  if(cond.equals!==undefined) return v===cond.equals;
  if(cond.in) return cond.in.includes(v);
  if(cond.includes) return Array.isArray(v)&&v.includes(cond.includes);
  if(cond.notIn) return isAnsweredValue(v)&&!cond.notIn.includes(v);
  return true;
}

function render(){
  const host=document.getElementById('questionnaire'); host.innerHTML='';
  const nav=document.getElementById('sectionNav'); nav.innerHTML='';
  sections.forEach((section,si)=>{
    const sectionId=`sec-${si+1}`;
    const link=document.createElement('a'); link.href=`#${sectionId}`; link.textContent=section.title; nav.appendChild(link);
    const box=document.createElement('section'); box.className='section-card'; box.id=sectionId;
    const h2=document.createElement('h2'); h2.textContent=section.title; box.appendChild(h2);
    section.subsections.forEach(sub=>{
      const s=document.createElement('div'); s.className='subsection';
      if(sub.condition) s.dataset.condition=JSON.stringify(sub.condition);
      const h3=document.createElement('h3'); h3.textContent=sub.title; s.appendChild(h3);
      if(sub.description){ const p=document.createElement('p'); p.className='desc'; p.textContent=sub.description; s.appendChild(p); }
      if(sub.repeater) renderRepeater(s,sub.repeater);
      else if(sub.scenarios) renderScenarios(s);
      else sub.questions.forEach(item=>s.appendChild(renderQuestion(item)));
      box.appendChild(s);
    });
    host.appendChild(box);
  });
  hydrateFixed(); applyVisibility(); updateProgress();
}

function renderQuestion(item, store=state.answers, prefix='', quick=true){
  const card=document.createElement('div'); card.className='question-card'; card.dataset.qid=item.id;
  if(item.condition) card.dataset.condition=JSON.stringify(item.condition);
  const label=document.createElement('div'); label.className='question-label';
  label.innerHTML=`<span class="question-number">${esc(item.id)}</span>${esc(item.text)}`; card.appendChild(label);
  if(item.note){ const note=document.createElement('p'); note.className='dependency-note'; note.textContent=item.note; card.appendChild(note); }
  const fieldKey=prefix+item.id;
  const saved=store[item.id] ?? '';
  let control;
  if(item.type==='radio'){
    control=document.createElement('div'); control.className='choice-grid'; control.dataset.field=fieldKey;
    item.options.forEach(opt=>{
      const lab=document.createElement('label'); lab.className='choice-pill';
      const inp=document.createElement('input'); inp.type=item.multi?'checkbox':'radio'; inp.name=fieldKey; inp.value=opt;
      if(item.multi){ const arr=Array.isArray(saved)?saved:[]; inp.checked=arr.includes(opt); }
      else inp.checked=saved===opt;
      const span=document.createElement('span'); span.textContent=opt; lab.append(inp,span); control.appendChild(lab);
      inp.addEventListener('change',()=>{
        if(item.multi){ store[item.id]=[...control.querySelectorAll('input:checked')].map(x=>x.value); }
        else store[item.id]=inp.value;
        saveState(); applyVisibility(); renderFollowupState(card,item,store);
      });
    });
    card.appendChild(control);
    if(item.other){
      const other=document.createElement('input'); other.type='text'; other.placeholder='Se escolheu “Outro”, descreva aqui'; other.className='other-input'; other.value=store[item.id+'__other']||'';
      other.addEventListener('input',()=>{store[item.id+'__other']=other.value; saveState();});
      card.appendChild(other);
    }
  } else if(item.type==='grid'){
    const values=(saved && typeof saved==='object')?saved:{};
    control=document.createElement('div'); control.className='price-grid';
    item.keys.forEach(key=>{
      const lab=document.createElement('label'); lab.textContent=key;
      const inp=document.createElement('input'); inp.type='text'; inp.placeholder=item.placeholder||''; inp.value=values[key]||'';
      inp.addEventListener('input',()=>{values[key]=inp.value; store[item.id]=values; saveState();});
      lab.appendChild(inp); control.appendChild(lab);
    });
    card.appendChild(control);
  } else {
    control=document.createElement(item.type==='text'?'input':'textarea');
    if(item.type==='text') control.type='text'; else control.rows=3;
    control.value=saved; control.dataset.field=fieldKey;
    control.addEventListener('input',()=>{store[item.id]=control.value; saveState();}); card.appendChild(control);
    if(quick && item.quick.length) addQuickButtons(card,control,store,item.id,item.quick);
  }
  renderFollowupState(card,item,store);
  return card;
}

function addQuickButtons(card,control,store,key,options){
  const quick=document.createElement('div'); quick.className='quick-actions';
  options.forEach(txt=>{ const b=document.createElement('button'); b.type='button'; b.textContent=txt; b.onclick=()=>{control.value=txt;store[key]=txt;saveState();}; quick.appendChild(b); });
  card.appendChild(quick);
}

function followupPairs(item){ return item.followupOn?[[item.followupOn,item.followupId,item.followupText]]:[]; }
function renderFollowupState(card,item,store){
  card.querySelectorAll('.inline-followup').forEach(x=>x.remove());
  followupPairs(item).forEach(([trigger,id,text])=>{
    if(store[item.id]!==trigger) return;
    const wrap=document.createElement('div'); wrap.className='inline-followup';
    const lab=document.createElement('label'); lab.textContent=text;
    const ta=document.createElement('textarea'); ta.rows=2; ta.value=store[id]||'';
    ta.addEventListener('input',()=>{store[id]=ta.value;saveState();}); lab.appendChild(ta); wrap.appendChild(lab); card.appendChild(wrap);
    addQuickButtons(wrap,ta,store,id,[UNDEF]);
  });
}

function applyVisibility(){
  document.querySelectorAll('[data-condition]').forEach(el=>{
    el.classList.toggle('hidden-question',!conditionMet(JSON.parse(el.dataset.condition)));
  });
  updateProgress();
}

function renderRepeater(container,key){
  const def=repeaters[key];
  if(!state.repeaters[key]?.length) state.repeaters[key]=[{}];
  const wrap=document.createElement('div'); wrap.className='repeater';
  const draw=()=>{
    wrap.innerHTML='';
    const list=state.repeaters[key];
    list.forEach((item,i)=>{
      const box=document.createElement('div'); box.className='repeat-item';
      const head=document.createElement('div'); head.className='repeat-head';
      const name=item[def.questions[0].id];
      const title=document.createElement('strong'); title.textContent=`${def.itemLabel} ${i+1}${name?` — ${name}`:''}`; head.appendChild(title);
      if(list.length>1){ const rm=document.createElement('button'); rm.type='button'; rm.className='mini-btn remove-btn'; rm.textContent='Remover'; rm.onclick=()=>{list.splice(i,1);saveState();draw();}; head.appendChild(rm); }
      box.appendChild(head); def.questions.forEach(itemQ=>box.appendChild(renderQuestion(itemQ,item,`${key}-${i}-`,false))); wrap.appendChild(box);
    });
    const add=document.createElement('button'); add.type='button'; add.className='add-btn'; add.textContent=def.addLabel; add.onclick=()=>{list.push({});saveState();draw();}; wrap.appendChild(add); updateProgress();
  };
  repeaterDrawers[key]=draw;
  draw(); container.appendChild(wrap);
}

function renderScenarios(container){
  scenarios.forEach(([id,text])=>{
    if(!state.scenarios[id]) state.scenarios[id]={answer:'',route:''};
    const data=state.scenarios[id];
    const card=document.createElement('div'); card.className='question-card scenario-card';
    const label=document.createElement('div'); label.className='question-label'; label.innerHTML=`<span class="question-number">${id}</span>${esc(text)}`; card.appendChild(label);
    const ta=document.createElement('textarea'); ta.rows=3; ta.placeholder='Resposta desejada'; ta.value=data.answer||''; ta.addEventListener('input',()=>{data.answer=ta.value;saveState();}); card.appendChild(ta);
    const choices=document.createElement('div'); choices.className='choice-grid compact';
    [IA,TO_TEAM].forEach(opt=>{ const lab=document.createElement('label'); lab.className='choice-pill'; const inp=document.createElement('input'); inp.type='radio'; inp.name=`route-${id}`; inp.value=opt; inp.checked=data.route===opt; inp.onchange=()=>{data.route=opt;saveState();}; const span=document.createElement('span'); span.textContent=opt; lab.append(inp,span); choices.appendChild(lab); });
    card.appendChild(choices); container.appendChild(card);
  });
}

const FIXED_FIELDS = ['meta_nome','meta_funcao','meta_data','meta_aprovador','final_pendencias','final_responsavel','final_data'];
function collectFixed(){
  const v=id=>document.getElementById(id)?.value||'';
  state.meta={nome:v('meta_nome'),funcao:v('meta_funcao'),data:v('meta_data'),aprovador:v('meta_aprovador')};
  state.final={pendencias:v('final_pendencias'),responsavel:v('final_responsavel'),data:v('final_data')};
}
function hydrateFixed(){
  const set=(id,val)=>{document.getElementById(id).value=val||'';};
  set('meta_nome',state.meta?.nome); set('meta_funcao',state.meta?.funcao); set('meta_data',state.meta?.data||new Date().toISOString().slice(0,10)); set('meta_aprovador',state.meta?.aprovador);
  set('final_pendencias',state.final?.pendencias); set('final_responsavel',state.final?.responsavel); set('final_data',state.final?.data);
  FIXED_FIELDS.forEach(id=>document.getElementById(id).addEventListener('input',saveState));
}

function visibleSubsections(){
  return sections.flatMap(sec=>sec.subsections.filter(sub=>conditionMet(sub.condition)).map(sub=>({sec,sub})));
}
function updateProgress(){
  let total=0,answered=0;
  const count=(v)=>{total++; if(isAnsweredValue(v)) answered++;};
  visibleSubsections().forEach(({sub})=>{
    if(sub.questions) sub.questions.forEach(item=>{
      if(!conditionMet(item.condition)) return;
      count(state.answers[item.id]);
      followupPairs(item).forEach(([trigger,id])=>{ if(state.answers[item.id]===trigger) count(state.answers[id]); });
    });
    if(sub.repeater) (state.repeaters[sub.repeater]||[]).forEach(store=>repeaters[sub.repeater].questions.forEach(x=>count(store[x.id])));
    if(sub.scenarios) scenarios.forEach(([id])=>{ const d=state.scenarios?.[id]||{}; count(d.answer); count(d.route); });
  });
  const pct=total?Math.round(answered/total*100):0;
  document.getElementById('progressBar').style.width=pct+'%'; document.getElementById('progressText').textContent=`${pct}% respondido`;
}
function setStatus(msg){ const s=document.getElementById('status'); s.textContent=msg; clearTimeout(setStatus.t); setStatus.t=setTimeout(()=>s.textContent='',5000); }

function displayAnswer(item,store=state.answers){
  const v=store[item.id]; let ans;
  if(Array.isArray(v)) ans=v.join(', ');
  else if(v && typeof v==='object') ans=Object.entries(v).filter(([,p])=>String(p).trim()).map(([s,p])=>`${s}: ${p}`).join(' | ');
  else ans=v;
  ans=ans||'Sem resposta';
  if(item.other && store[item.id+'__other']) ans += ` — ${store[item.id+'__other']}`;
  return ans;
}

// ---------- PDF ----------
function addPdfLine(doc,text,y,opts={}){
  const margin=15,width=180,size=opts.size||9.5; doc.setFont('helvetica',opts.bold?'bold':'normal'); doc.setFontSize(size); const lines=doc.splitTextToSize(String(text),width); const lh=size*0.45; if(y.y+lines.length*lh+3>282){doc.addPage();y.y=16;} doc.text(lines,margin,y.y); y.y+=lines.length*lh+2;
}
function addQA(doc,y,id,text,answer){ addPdfLine(doc,`${id} ${text}`,y,{bold:true}); addPdfLine(doc,`Resposta: ${answer||'Sem resposta'}`,y); y.y+=1; }
function fileSlug(){
  const clean=(state.meta?.nome||'cliente').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
  return `${clean||'cliente'}-${state.meta?.data||new Date().toISOString().slice(0,10)}`;
}
function generatePdf(){
  saveState(); if(!window.jspdf?.jsPDF){setStatus('Não foi possível carregar o gerador de PDF. Use “Imprimir / salvar como PDF”.');return;}
  const {jsPDF}=window.jspdf; const doc=new jsPDF({unit:'mm',format:'a4'}); const y={y:18};
  addPdfLine(doc,'Questionário de atendimento — I&C Salon',y,{bold:true,size:15}); addPdfLine(doc,'Levantamento para configuração do atendimento automatizado NORIA',y,{size:9.5}); y.y+=2;
  addPdfLine(doc,`Responsável pelas respostas: ${state.meta?.nome||'Sem resposta'}`,y); addPdfLine(doc,`Função: ${state.meta?.funcao||'Sem resposta'}`,y); addPdfLine(doc,`Data: ${state.meta?.data||'Sem resposta'}`,y); addPdfLine(doc,`Aprovador: ${state.meta?.aprovador||'Sem resposta'}`,y); y.y+=3;
  let lastSec=null;
  visibleSubsections().forEach(({sec,sub})=>{
    if(sec!==lastSec){ if(lastSec) y.y+=2; addPdfLine(doc,sec.title,y,{bold:true,size:12.5}); lastSec=sec; }
    addPdfLine(doc,sub.title,y,{bold:true,size:10.5});
    if(sub.repeater){
      const def=repeaters[sub.repeater];
      (state.repeaters[sub.repeater]||[]).forEach((store,i)=>{ addPdfLine(doc,`${def.itemLabel} ${i+1}`,y,{bold:true}); def.questions.forEach(item=>addQA(doc,y,item.id,item.text,displayAnswer(item,store))); });
    } else if(sub.scenarios){
      scenarios.forEach(([id,text])=>{ const d=state.scenarios?.[id]||{}; addQA(doc,y,id,text,d.answer||'Sem resposta'); addPdfLine(doc,`Destino: ${d.route||'Sem resposta'}`,y); });
    } else sub.questions.forEach(item=>{
      if(!conditionMet(item.condition)) return;
      addQA(doc,y,item.id,item.text,displayAnswer(item));
      followupPairs(item).forEach(([trigger,id,text])=>{ if(state.answers[item.id]===trigger) addQA(doc,y,id,text,state.answers[id]||'Sem resposta'); });
    });
    y.y+=1;
  });
  y.y+=2;
  addPdfLine(doc,'Pendências antes da ativação',y,{bold:true,size:10.5}); addPdfLine(doc,state.final?.pendencias||'Sem resposta',y); addPdfLine(doc,`Responsável pela aprovação final: ${state.final?.responsavel||'Sem resposta'}`,y); addPdfLine(doc,`Data da aprovação: ${state.final?.data||'Sem resposta'}`,y);
  doc.save(`questionario-ic-salon-${fileSlug()}.pdf`); setStatus('PDF gerado. Agora é só enviar o arquivo pelo WhatsApp para a equipe NORIA.');
}

// ---------- Exportação no formato do sistema ----------
const TONE_IDS = {'Acolhedor e próximo':'friendly','Rápido e objetivo':'direct','Consultivo (orienta e sugere)':'consultative','Formal':'formal'};
function parsePrice(v){
  let s=String(v||'').replace(/[^\d,.]/g,'');
  if(!s) return null;
  if(s.includes(',')) s=s.replace(/\./g,'').replace(',','.');
  else if(/\.\d{3}$/.test(s)) s=s.replace(/\./g,'');
  const n=Number.parseFloat(s); return Number.isFinite(n)?n:null;
}
function slugify(v){ return String(v||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''); }
function ans(id){
  const v=state.answers[id]; const other=state.answers[id+'__other'];
  if(Array.isArray(v)) return v.includes('Outro')&&other?[...v.filter(x=>x!=='Outro'),other]:v;
  if(v==='Outro'&&other) return other;
  return isAnsweredValue(v)?v:null;
}
function filled(list){ return (list||[]).filter(x=>Object.values(x).some(isAnsweredValue)); }

function buildSystemExport(){
  saveState();
  const a=ans;
  const services=filled(state.repeaters.services).filter(s=>isAnsweredValue(s['4.2.1']));
  const pros=filled(state.repeaters.pros).filter(p=>isAnsweredValue(p['3.2.1']));
  const catalog=services.map(s=>({
    external_source:'questionario_onboarding', external_id:`servico_${slugify(s['4.2.1'])}`, category:s['4.2.2']||null, name:s['4.2.1'], description:s['4.2.3']||null,
    billing_unit:'servico', price:parsePrice(s['4.2.5']), notes:s['4.2.4']===FROM_PRICE?`A partir de ${s['4.2.5']||'(valor a definir)'}`:(s['4.2.5']||null), active:true,
    metadata:{price_type:s['4.2.4']===FROM_PRICE?'from':'fixed', price_pix_raw:s['4.2.5']||null, price_credit:parsePrice(s['4.2.6']), price_credit_raw:s['4.2.6']||null,
      duration:s['4.2.7']||null, booking_block:s['4.2.8']||null, professionals:s['4.2.9']||null, evaluation:s['4.2.10']||null, booking_mode:s['4.2.11']||null,
      qualify_before_quote:s['4.2.12']||null, preparation:s['4.2.13']||null, before_after_photo:s['4.2.14']||null}
  }));
  return {
    contract:'noria_onboarding_form_v1',
    review_required:true,
    review_note:'Rascunho gerado pelo questionário. Nada deve ser aplicado no Supabase sem revisão da equipe NORIA e aprovação do salão.',
    generated_at:new Date().toISOString(),
    filled_by:state.meta, approval:state.final,
    tenant:{name:a('1.1.1')||'I&C Salon', suggested_slug:'ic_salon', industry:'Salão de beleza, estética e bem-estar', segment:'aesthetic_clinic', capability:'standard',
      tone:TONE_IDS[a('1.1.4')]||null, tone_raw:a('1.1.4'), persona_name:a('1.1.2'),
      greeting:a('1.1.3')==='Ajustar o texto'?a('1.1.3a'):'Oi, tudo bem? Sou nova na equipe, com quem eu falo? Como posso ajudar você hoje?',
      emoji_policy:a('1.1.5'), ai_disclosure_when_asked:a('1.1.6'), avoid_terms:a('1.1.7'), never_ask:['idade','data de nascimento']},
    channel:{type:'whatsapp', phone:a('1.2.1')==='Sim'?'5522999633775':(a('1.2.1a')||null), operators:a('1.2.2')},
    business_facts:{
      name:a('1.1.1')||'I&C Salon',
      locations:[{id:'cidade_jardim', name:'I&C Salon Cidade Jardim', address:a('2.1.2')||'Av. das Acácias, 209 - Cidade Jardim', address_confirmed:a('2.1.1'), address_correction:a('2.1.1a'),
        reference:a('2.1.3'), access:a('2.1.4'), verified:false, verified_source:'Questionário de onboarding (pendente de conferência)'}],
      hours:{weekly:a('2.2.1'), long_service_shifts:a('2.2.2'), start_grid:a('2.2.3'), booking_window:a('2.2.4'), out_of_hours_behavior:a('2.2.5'), team_response_hours:a('2.2.6')},
      not_offered:a('4.1.1')==='Sim, confirmo'?['Unha de gel','Acrigel','Fibra','Unha postiça','Unha realista','Henna na sobrancelha','Pacote Dia da Noiva']:a('4.1.1a'),
      not_offered_alternative:a('4.1.2'), products:{sells:a('4.1.3'), details:a('4.1.3a')},
      evaluation:{free_in_person_no_photo:a('5.1.1'), details:a('5.1.1a'), scale_pitch:a('5.1.2'), scale_measures:a('5.1.3'), final_price_only_up:a('5.1.4'), highlight_test:a('5.1.5'), ai_can_book:a('5.1.6')},
      chemistry:{min_interval:a('5.2.1'), recent_chemistry_behavior:a('5.2.2'),
        incompatibilities:filled(state.repeaters.incompat).map(c=>({service_a:c['5.3.1']||null, service_b:c['5.3.2']||null, rule:c['5.3.3']||null, detail:c['5.3.4']||null, explanation:c['5.3.5']||null}))},
      media:{before_after_when:a('5.4.1'), sender:a('5.4.2'), consent:a('5.4.3')},
      payment:{methods:a('7.1.1')||[], mention_credit_only_if_asked:a('7.1.2'), credit_rule:a('7.1.3'), credit_percent:a('7.1.3a'), debit:a('7.1.4'), installments:a('7.1.5'), pix:a('7.1.6'), discounts:a('7.1.7')},
      deposit_policy:{rule_confirmed:a('7.2.1'), correction:a('7.2.1a'), rule:'1º agendamento sem sinal; após falta ou desmarcação em cima da hora, reagendamento exige 50% via Pix; comparecendo, volta ao normal.',
        late_cancel_window:a('7.2.2'), no_show_marked_by:a('7.2.3'), repeat_no_show:a('7.2.4'), base_for_from_prices:a('7.2.5'), verification_trigger:a('7.2.6'), verifier:a('7.2.7')},
      cancellation:{free_window:a('8.1.1'), late_tolerance:a('8.1.2'), ai_can_reschedule:a('8.1.3'), salon_cancel_message:a('8.1.4'), internal_notice_by_management:a('3.1.3')}
    },
    catalog,
    professionals:pros.map(p=>({name:p['3.2.1'], specialty:p['3.2.2']||null, services:p['3.2.3']||null, schedule:p['3.2.4']||{}, panel_access:p['3.2.5']||null})),
    scheduling:{
      team_size:a('3.1.1')==='Sim, 4 profissionais'?4:a('3.1.1a'), client_picks_professional:a('3.1.2'), blocks_managed_by:a('3.1.4'),
      service_resources_draft:Object.fromEntries(catalog.map(c=>[c.external_id,c.metadata.professionals])),
      required_fields:a('6.1.1')||[], minors_policy:a('6.1.2'), customer_confirms_summary:a('6.1.3'), booked_message:a('6.1.4'), human_review:a('6.1.5'), human_review_message:a('6.1.6'),
      no_slot:a('6.2.1'), waitlist:{exists:a('6.2.2'), rules:a('6.2.2a')}, multi_service:a('6.2.3'), third_party:{allowed:a('6.2.4'), data:a('6.2.4a')}, reminder:{enabled:a('6.2.5'), lead:a('6.2.5a')}
    },
    scenarios:Object.fromEntries(scenarios.map(([id,text])=>[id,{situation:text,answer:state.scenarios?.[id]?.answer||null,route:state.scenarios?.[id]?.route||null}])),
    handoff:{triggers:a('10.1.1')||[], message:a('10.1.2'), routing:a('10.1.3'), silence_after_handoff:a('10.1.5'), return_to_ai_by:a('10.1.6')},
    kanban:a('10.1.4')==='Quero outras colunas'?{custom:true, columns_raw:a('10.1.4a')}:{custom:false, columns:[
      {name:'Conversas IA',automation_key:'conversas_ia'},{name:'Aguardando humano',automation_key:'aguardando_humano'},{name:'Verificar Sinal',automation_key:'verificar_sinal'},
      {name:'Em atendimento humano',automation_key:'com_humano'},{name:'Agendamentos',automation_key:'agendamentos'},{name:'Finalizadas',automation_key:'finalizadas'},
      {name:'Conversas abandonadas',automation_key:'conversas_abandonadas'},{name:'Follow Ups',automation_key:'follow_ups'}]},
    automation:{audio_enabled:a('10.2.1'), contact_exclusion:{enabled:a('10.2.2'), list_raw:a('10.2.2a')}, follow_up:a('10.2.3'),
      maintenance_reminders:{enabled:a('10.2.4'), rules:a('10.2.4a')}, broadcasts:{enabled:a('10.2.5'), rules:a('10.2.5a')}, closing_message:a('10.2.6')},
    validation:{faq:a('10.3.1'), forbidden_errors:a('10.3.2'), approver:a('10.3.3'), test_cases:a('10.3.4')},
    raw_state:state
  };
}
function exportJson(){
  const blob=new Blob([JSON.stringify(buildSystemExport(),null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const link=document.createElement('a');
  link.href=url; link.download=`questionario-ic-salon-${fileSlug()}.json`; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  setStatus('Arquivo JSON gerado para a equipe NORIA revisar e importar.');
}

document.getElementById('saveBtn').onclick=()=>{saveState();setStatus('Respostas salvas neste navegador.');};
document.getElementById('jsonBtn').onclick=exportJson;
document.getElementById('printBtn').onclick=()=>{saveState();window.print();};
document.getElementById('pdfBtn').onclick=generatePdf;
window.addEventListener('beforeunload',saveState);
render();
