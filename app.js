const STORAGE_KEY = 'noria_questionario_ic_salon_v2';
const UNDEF = 'Ainda não definido', TO_TEAM = 'Encaminhar para a equipe';
const WEEKDAYS = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo','Feriados'];
const FROM_PRICE = 'A partir de (valor final após avaliação)';
const PRE_BOOK = 'A IA pré-agenda e a equipe confirma';
const CREDIT_TABLE = 'Tabela própria (preencha em cada ficha de serviço)';

// Atalhos por pergunta: decisões recebem "Ainda não definido"; perguntas de fato ficam sem atalho (plain).
// "Encaminhar para a equipe" só aparece em condutas com a cliente.
const SHORTCUT_RULES = {
  plain:['1.1.1','4.1.2','6.4.2','7.2.2','8.1.1'],
  team:['4.1.1','6.2.2']
};
const shortcutsFor = id => SHORTCUT_RULES.plain.includes(id) ? [] : [UNDEF, ...(SHORTCUT_RULES.team.includes(id)?[TO_TEAM]:[])];

const q = (id, text, type='textarea', extra={}) => ({id,text,type,quick:shortcutsFor(id),...extra});
const yesNo = (id,text,extra={}) => q(id,text,'radio',{options:['Sim','Não',...shortcutsFor(id)],...extra});
const choice = (id,text,options,extra={}) => q(id,text,'radio',{options:[...options,...shortcutsFor(id)],...extra});
const pick = (id,text,options,extra={}) => q(id,text,'radio',{options,...extra});
const multi = (id,text,options,extra={}) => q(id,text,'radio',{options,multi:true,...extra});
const weekGrid = (id,text,extra={}) => q(id,text,'grid',{keys:WEEKDAYS,placeholder:'ex.: 09h–19h ou Fechado',...extra});

const KNOWN_FACTS = [
  'Salão: I&C Salon | Cidade Jardim. Endereço: Av. das Acácias, 209 – Cidade Jardim. Telefone/WhatsApp: (22) 99963-3775.',
  'Apresentação da IA: “Oi, tudo bem? Sou nova na equipe, com quem eu falo? Como posso ajudar você hoje?”. Atendimento humanizado e próximo.',
  'Em mensagens genéricas, a IA cumprimenta, se apresenta, pergunta o nome e qual serviço a cliente procura. Não envia o catálogo completo de cara.',
  'Equipe de 4 profissionais (entre eles César e Ítalo), cada um com a própria agenda. Os profissionais não acessam o sistema: a gestão repassa cancelamentos e mudanças.',
  'O salão não faz: unha de gel, acrigel, fibra, postiça ou “realista”, henna na sobrancelha e pacote de Dia da Noiva. Maquiagem e penteado são oferecidos, mesmo fora do panfleto.',
  'Química e mechas têm preço “a partir de”. O valor final só pode subir, nunca baixar, depois da avaliação presencial.',
  'Preço justo pela balança: o valor depende da quantidade de produto usada (3 medidas), não só do comprimento. Um cabelo longo com pouco volume pode pagar menos que um curto muito volumoso.',
  'A avaliação é presencial e gratuita, e não é feita por foto. Sempre há teste de mechas antes.',
  'Mechas: 4 a 5 horas, meio período, só 1 profissional faz e não cabem duas no mesmo turno. A IA pré-agenda e a equipe confirma.',
  'Orçamento de mechas: perguntar o tipo e a última química, explicar a balança, informar o “a partir de”, enviar foto de antes e depois e convidar para a avaliação.',
  'Cliente indecisa: perguntar como é o cabelo hoje e se tem referência, e convidar para avaliação presencial.',
  'Unhas: antes de passar preço ou horário, a IA pergunta se é só mão, só pé ou pé e mão (cada opção ocupa um tempo diferente).',
  'A IA informa o preço no Pix/dinheiro e só fala do valor no crédito se a cliente perguntar. Ex.: pé e mão R$ 57,00 no Pix/dinheiro.',
  'A IA nunca oferece desconto: destaca a qualidade e explica que o valor já é o diferenciado para Pix/dinheiro.',
  'Sinal: o 1º agendamento não tem sinal. Quem faltou ou desmarcou em cima da hora paga 50% via Pix para reagendar. Comparecendo, volta ao normal. Vale para todos os serviços.',
  'Menores só são atendidos com o pai ou a mãe. A IA não pergunta idade nem data de nascimento.'
];
const RESPONSIBILITIES = ['Responde o WhatsApp hoje','Confere pré-agendamentos de mechas e química','Confere o Pix do sinal','Marca faltas no sistema','Atualiza bloqueios da agenda (folgas, férias)','Recebe reclamações','Pode devolver a conversa para a IA','Aprova mudanças de preço e regras'];

const sections = [
  {title:'1. O que já foi combinado', subsections:[
    {title:'1.1 Resumo da reunião e do Instagram', known:KNOWN_FACTS, questions:[
      q('1.1.1','Alguma informação acima está errada ou mudou? Se sim, descreva.')
    ]}
  ]},
  {title:'2. Identidade', subsections:[
    {title:'2.1 Atendente e linguagem', questions:[
      q('2.1.1','A atendente terá um nome? Se sim, qual?','text'),
      choice('2.1.2','A IA pode usar emojis?',['Sim, com moderação','Só em saudações','Não usar']),
      choice('2.1.3','Se a cliente perguntar diretamente se está falando com um robô ou uma IA, o que responder?',['Confirmar que é a assistente digital da equipe e seguir o atendimento','Confirmar e oferecer falar com uma pessoa da equipe','Outro'],{other:true,note:'A IA se apresenta como integrante da equipe, como combinado. Por transparência, ela não nega ser uma IA quando a cliente pergunta diretamente.'}),
      q('2.1.4','Há palavras, gírias ou formas de tratamento que a IA deve evitar? Quais?')
    ]}
  ]},
  {title:'3. Funcionamento e agenda', subsections:[
    {title:'3.1 Endereço', questions:[
      q('3.1.1','Complete o endereço: complemento, cidade e CEP.','text'),
      q('3.1.2','Qual ponto de referência ou link do Google Maps deve ser enviado?','text'),
      q('3.1.3','Há estacionamento ou alguma informação de acesso importante?')
    ]},
    {title:'3.2 Horários', questions:[
      weekGrid('3.2.1','Horário de funcionamento do salão em cada dia'),
      q('3.2.2','As mechas levam de 4 a 5 horas, mas o turno da manhã citado na reunião vai das 09h30 às 12h00. Qual é o horário real de início e fim dos turnos de mechas (manhã e tarde)?'),
      q('3.2.3','Os atendimentos começam em horários fixos? (ex.: de 30 em 30 minutos)','text'),
      q('3.2.4','Com quanta antecedência mínima a cliente pode agendar? E até quantos dias à frente?','text'),
      choice('3.2.5','Quando chegar mensagem fora do horário, o que a IA deve fazer?',['Atender normalmente e agendar','Atender e avisar que a equipe confirma no próximo horário','Informar o horário de funcionamento','Outro'],{other:true}),
      q('3.2.6','Em que horário a equipe responde o WhatsApp?','text')
    ]}
  ]},
  {title:'4. Serviços', subsections:[
    {title:'4.1 Regras gerais', questions:[
      q('4.1.1','Quando pedirem um serviço que o salão não faz (unha de gel, henna, Dia da Noiva), o que a IA deve sugerir?'),
      yesNo('4.1.2','O salão vende produtos (o Instagram tem o destaque “Produtos”)?',{followupOn:'Sim',followupId:'4.1.2a',followupText:'Quais produtos e a IA pode informar preços?'}),
      choice('4.1.3','Como é calculado o valor no cartão de crédito?',['Acréscimo percentual sobre o valor do Pix',CREDIT_TABLE,'Outro'],{other:true,followupOn:'Acréscimo percentual sobre o valor do Pix',followupId:'4.1.3a',followupText:'Qual percentual?'})
    ]},
    {title:'4.2 Ficha de cada serviço', repeater:'services', description:'A lista já vem com os serviços citados na reunião e no Instagram. Complete preço, duração e tempo de agenda, remova o que não existir e adicione o que faltar.'}
  ]},
  {title:'5. Equipe e responsáveis', subsections:[
    {title:'5.1 Agendas', questions:[
      choice('5.1.1','A cliente pode escolher o profissional?',['Sim, sempre','Sim, quando houver vaga; senão a IA oferece outro','Não, o salão define']),
      q('5.1.2','Quem é o responsável por cada tarefa?','grid',{keys:RESPONSIBILITIES,placeholder:'Nome'})
    ]},
    {title:'5.2 Ficha de cada profissional', repeater:'pros', description:'Uma ficha por profissional. Marque os serviços que cada um faz; a lista vem das fichas da seção 4.'}
  ]},
  {title:'6. Avaliação e química', subsections:[
    {title:'6.1 Avaliação', questions:[
      q('6.1.1','Quais são as 3 medidas da balança e o valor de cada uma?'),
      q('6.1.2','Como funciona o teste de mechas? Quando é feito e quanto tempo leva?'),
      choice('6.1.3','A avaliação pode ser agendada pela IA?',['Sim, a IA agenda a avaliação','A IA pré-agenda e a equipe confirma','Só a equipe agenda'])
    ]},
    {title:'6.2 Química recente', questions:[
      q('6.2.1','Qual intervalo mínimo é exigido desde o último procedimento químico, para cada tipo de serviço?'),
      q('6.2.2','O que a IA deve fazer quando a cliente fez química recentemente?')
    ]},
    {title:'6.3 Serviços que não podem ser feitos juntos', repeater:'incompat', description:'Uma ficha para cada combinação proibida no mesmo dia ou que exige intervalo. Ex.: progressiva + mechas.'},
    {title:'6.4 Fotos de antes e depois', questions:[
      choice('6.4.1','Além do orçamento de mechas, quando a IA deve enviar fotos de antes e depois?',['Só no orçamento de mechas e química','Sempre que a cliente perguntar de um serviço que tenha foto','Só quando a cliente pedir','Outro'],{other:true}),
      yesNo('6.4.2','As clientes das fotos autorizaram o uso?')
    ]}
  ]},
  {title:'7. Agendamento', subsections:[
    {title:'7.1 Dados e confirmação', questions:[
      multi('7.1.1','Além do nome e do serviço, quais dados a IA deve coletar para agendar?',['Sobrenome','Profissional de preferência','Se é a primeira vez no salão','Telefone de contato, se for outro'],{other:true}),
      choice('7.1.2','Quando a IA deve avisar que menores são atendidos com o pai ou a mãe?',['Só quando a cliente indicar que é para menor','Em toda confirmação de agendamento','Outro'],{other:true}),
      yesNo('7.1.3','A cliente deve confirmar um resumo (serviço, profissional, data e hora) antes do registro?'),
      q('7.1.4','Qual mensagem deve ser enviada depois que o agendamento for registrado?'),
      q('7.1.5','Em quanto tempo a equipe responde a um pré-agendamento de mechas ou química?','text'),
      q('7.1.6','Qual mensagem a IA envia enquanto a equipe confere o pré-agendamento?')
    ]},
    {title:'7.2 Vagas e situações especiais', questions:[
      choice('7.2.1','Quando não houver vaga no horário pedido, o que a IA deve fazer?',['Oferecer outros horários do mesmo profissional','Oferecer outro profissional que faça o serviço','Oferecer alternativas e, se não resolver, encaminhar','Encaminhar para a equipe']),
      yesNo('7.2.2','Existe encaixe ou lista de espera?',{followupOn:'Sim',followupId:'7.2.2a',followupText:'Como funciona?'}),
      q('7.2.3','Como agendar mais de um serviço no mesmo atendimento (ex.: corte + escova, pé e mão + sobrancelha)?'),
      yesNo('7.2.4','A cliente pode agendar para outra pessoa?',{followupOn:'Sim',followupId:'7.2.4a',followupText:'Quais dados da outra pessoa são necessários?'}),
      yesNo('7.2.5','Deseja lembrete automático antes do horário?',{followupOn:'Sim',followupId:'7.2.5a',followupText:'Com quanta antecedência?'})
    ]}
  ]},
  {title:'8. Pagamento, sinal e cancelamento', subsections:[
    {title:'8.1 Pagamento', questions:[
      choice('8.1.1','Dinheiro, Pix e crédito são aceitos. E o cartão de débito?',['Aceita, com o valor do Pix','Aceita, com o valor do crédito','Não aceita']),
      q('8.1.2','O crédito pode ser parcelado? Em quantas vezes e a partir de qual valor?','text'),
      q('8.1.3','Qual é a chave Pix, o nome do favorecido e o banco?','text')
    ]},
    {title:'8.2 Sinal após falta', questions:[
      q('8.2.1','Na reunião, “3 a 4 horas antes” foi citado como exemplo. Qual prazo exato conta como desmarcar em cima da hora?','text'),
      q('8.2.2','Se a cliente pagou o sinal e faltou de novo, o que acontece com o valor?'),
      q('8.2.3','Nos serviços “a partir de”, o sinal de 50% é calculado sobre qual valor?'),
      choice('8.2.4','O que deve iniciar a conferência do sinal?',['Envio do comprovante','Qualquer aviso de pagamento','Outro'],{other:true})
    ]},
    {title:'8.3 Cancelamento e atraso', questions:[
      q('8.3.1','Qual é a tolerância de atraso? O que acontece depois dela?'),
      choice('8.3.2','A IA pode remarcar ou cancelar sozinha?',['Sim, dentro das regras','Só remarcar; cancelamento vai para a equipe','Não, tudo vai para a equipe']),
      q('8.3.3','Qual mensagem enviar quando o salão precisar desmarcar ou remanejar uma cliente?')
    ]}
  ]},
  {title:'9. Situações de conversa', subsections:[
    {title:'9.1 Respostas desejadas', scenarios:true, description:'Situações que ainda não foram combinadas. Escreva a resposta desejada e marque se a IA continua atendendo ou encaminha para a equipe.'}
  ]},
  {title:'10. Encaminhamento, Kanban e acompanhamento', subsections:[
    {title:'10.1 Encaminhamento para a equipe', questions:[
      multi('10.1.1','Em quais situações a IA deve chamar a equipe?',['Pré-agendamento de mechas ou química','Cliente pediu uma pessoa','Reclamação','Cancelamento ou remarcação','Comprovante de sinal','Dúvida técnica sobre o cabelo','Reação ou problema após procedimento','Outro'],{other:true}),
      q('10.1.2','Qual mensagem padrão a IA envia ao chamar a equipe?'),
      choice('10.1.3','Como devem ficar as colunas do Kanban (painel de conversas)?',['Padrão sugerido: Conversas IA > Aguardando humano > Verificar Sinal > Em atendimento humano > Agendamentos > Finalizadas > Conversas abandonadas > Follow-ups','Quero outras colunas'],{followupOn:'Quero outras colunas',followupId:'10.1.3a',followupText:'Quais colunas, nesta ordem?'}),
      yesNo('10.1.4','Depois de chamar a equipe, a IA deve ficar em silêncio naquela conversa?')
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
      q('10.3.3','Quais situações devem ser testadas antes de ativar?')
    ]}
  ]}
];

const repeaters = {
  services:{itemLabel:'Serviço', addLabel:'+ Adicionar outro serviço', affects:'pros', questions:[
    q('4.2.1','Nome do serviço','text',{redraw:'pros'}),
    pick('4.2.2','Categoria',['Cabelo','Estética e corpo','Sobrancelha','Unhas','Maquiagem e penteado','Outro']),
    q('4.2.3','Descrição que a IA deve usar'),
    pick('4.2.4','Tipo de preço',['Preço fixo',FROM_PRICE]),
    q('4.2.5','Preço no Pix ou dinheiro (o valor mínimo, se for “a partir de”)','text'),
    q('4.2.6','Preço no cartão de crédito','text',{condition:{id:'4.1.3',equals:CREDIT_TABLE}}),
    q('4.2.7','Duração média','text'),
    q('4.2.8','Tempo a reservar na agenda (com preparo e limpeza)','text'),
    pick('4.2.9','Precisa de avaliação presencial antes?',['Sim, obrigatória','Recomendada','Não']),
    pick('4.2.10','Como a IA pode agendar?',['A IA agenda direto',PRE_BOOK,'Somente a equipe agenda']),
    q('4.2.11','O que a IA precisa perguntar antes de passar preço e horário?','text'),
    q('4.2.12','Preparo ou cuidados que a cliente precisa saber'),
    pick('4.2.13','Tem foto de antes e depois para a IA enviar?',['Sim, já enviada','Vou enviar','Não'])
  ]},
  pros:{itemLabel:'Profissional', addLabel:'+ Adicionar profissional', questions:[
    q('5.2.1','Nome','text'),
    q('5.2.2','Serviços que realiza','services'),
    weekGrid('5.2.3','Dias e horários de trabalho')
  ]},
  incompat:{itemLabel:'Combinação', addLabel:'+ Adicionar outra combinação', questions:[
    q('6.3.1','Serviço A','text'),
    q('6.3.2','Serviço B','text'),
    pick('6.3.3','Regra',['Não podem no mesmo dia','Precisam de intervalo mínimo','Só após avaliação']),
    q('6.3.4','Intervalo mínimo ou detalhe','text'),
    q('6.3.5','Como a IA deve explicar para a cliente','text')
  ]}
};

const service = (name,cat,extra={}) => ({'4.2.1':name,'4.2.2':cat,...extra});
const chemical = {'4.2.4':FROM_PRICE,'4.2.9':'Sim, obrigatória'};
const highlights = {...chemical,'4.2.7':'4 a 5 horas','4.2.8':'Meio período','4.2.10':PRE_BOOK,'4.2.11':'Tipo de mecha e há quanto tempo fez a última química','4.2.12':'Sempre é feito teste de mechas antes.','4.2.13':'Vou enviar'};
const nails = {'4.2.11':'Se é só mão, só pé ou pé e mão'};
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
  service('Maquiagem','Maquiagem e penteado'),
  service('Penteado','Maquiagem e penteado')
];

const IA = 'Continuar com IA';
const scenarios = [
  ['9.1.1','“Não vou conseguir ir hoje.” (poucas horas antes do horário)'],
  ['9.1.2','A cliente reclama do resultado de um procedimento.'],
  ['9.1.3','A cliente relata irritação, alergia ou queda de cabelo depois de um procedimento.'],
  ['9.1.4','A IA não entendeu um áudio ou uma mensagem.']
];

const emptyState = () => ({
  answers:{},
  repeaters:{services:SEED_SERVICES.map(s=>({...s})), pros:[{'5.2.1':'César'},{'5.2.1':'Ítalo'},{},{}], incompat:[{}]},
  scenarios:{}, meta:{}, final:{}
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
function serviceNames(){ return (state.repeaters.services||[]).map(s=>String(s['4.2.1']||'').trim()).filter(Boolean); }

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
      if(sub.known){ const ul=document.createElement('ul'); ul.className='known-list'; sub.known.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; ul.appendChild(li); }); s.appendChild(ul); }
      if(sub.repeater) renderRepeater(s,sub.repeater);
      else if(sub.scenarios) renderScenarios(s);
      else sub.questions.forEach(item=>s.appendChild(renderQuestion(item)));
      box.appendChild(s);
    });
    host.appendChild(box);
  });
  hydrateFixed(); applyVisibility(); updateProgress();
}

function renderChoices(card,item,store,fieldKey,options){
  const saved=store[item.id] ?? '';
  const control=document.createElement('div'); control.className=item.type==='services'?'choice-grid dense':'choice-grid'; control.dataset.field=fieldKey;
  options.forEach(opt=>{
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
}

function renderQuestion(item, store=state.answers, prefix='', quick=true){
  const card=document.createElement('div'); card.className='question-card'; card.dataset.qid=item.id;
  if(item.condition) card.dataset.condition=JSON.stringify(item.condition);
  const label=document.createElement('div'); label.className='question-label';
  label.innerHTML=`<span class="question-number">${esc(item.id)}</span>${esc(item.text)}`; card.appendChild(label);
  if(item.note){ const note=document.createElement('p'); note.className='dependency-note'; note.textContent=item.note; card.appendChild(note); }
  const fieldKey=prefix+item.id;
  const saved=store[item.id] ?? '';
  if(item.type==='radio'){
    renderChoices(card,item,store,fieldKey,item.options);
    if(item.other){
      const other=document.createElement('input'); other.type='text'; other.placeholder='Se escolheu “Outro”, descreva aqui'; other.className='other-input'; other.value=store[item.id+'__other']||'';
      other.addEventListener('input',()=>{store[item.id+'__other']=other.value; saveState();});
      card.appendChild(other);
    }
  } else if(item.type==='services'){
    const names=serviceNames();
    if(!names.length){ const p=document.createElement('p'); p.className='dependency-note'; p.textContent='Preencha os nomes dos serviços na seção 4 para marcar aqui.'; card.appendChild(p); }
    else renderChoices(card,{...item,multi:true},store,fieldKey,names);
  } else if(item.type==='grid'){
    const values=(saved && typeof saved==='object')?saved:{};
    const control=document.createElement('div'); control.className='key-grid';
    item.keys.forEach(key=>{
      const lab=document.createElement('label'); lab.textContent=key;
      const inp=document.createElement('input'); inp.type='text'; inp.placeholder=item.placeholder||''; inp.value=values[key]||'';
      inp.addEventListener('input',()=>{values[key]=inp.value; store[item.id]=values; saveState();});
      lab.appendChild(inp); control.appendChild(lab);
    });
    card.appendChild(control);
  } else {
    const control=document.createElement(item.type==='text'?'input':'textarea');
    if(item.type==='text') control.type='text'; else control.rows=3;
    control.value=saved; control.dataset.field=fieldKey;
    control.addEventListener('input',()=>{store[item.id]=control.value; saveState();});
    if(item.redraw) control.addEventListener('change',()=>repeaterDrawers[item.redraw]?.());
    card.appendChild(control);
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
    const add=document.createElement('button'); add.type='button'; add.className='add-btn'; add.textContent=def.addLabel; add.onclick=()=>{list.push({});saveState();draw();}; wrap.appendChild(add);
    if(def.affects) repeaterDrawers[def.affects]?.();
    applyVisibility();
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
    if(sub.repeater) (state.repeaters[sub.repeater]||[]).forEach(store=>repeaters[sub.repeater].questions.forEach(x=>{ if(conditionMet(x.condition)) count(store[x.id]); }));
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
    if(sub.known) sub.known.forEach(t=>addPdfLine(doc,`• ${t}`,y));
    if(sub.repeater){
      const def=repeaters[sub.repeater];
      (state.repeaters[sub.repeater]||[]).forEach((store,i)=>{ addPdfLine(doc,`${def.itemLabel} ${i+1}`,y,{bold:true}); def.questions.forEach(item=>{ if(conditionMet(item.condition)) addQA(doc,y,item.id,item.text,displayAnswer(item,store)); }); });
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
  const a=ans; const owners=a('5.1.2')||{};
  const services=filled(state.repeaters.services).filter(s=>isAnsweredValue(s['4.2.1']));
  const pros=filled(state.repeaters.pros).filter(p=>isAnsweredValue(p['5.2.1']));
  const creditTable=a('4.1.3')===CREDIT_TABLE;
  const catalog=services.map(s=>({
    external_source:'questionario_onboarding', external_id:`servico_${slugify(s['4.2.1'])}`, category:s['4.2.2']||null, name:s['4.2.1'], description:s['4.2.3']||null,
    billing_unit:'servico', price:parsePrice(s['4.2.5']), notes:s['4.2.4']===FROM_PRICE?`A partir de ${s['4.2.5']||'(valor a definir)'}`:(s['4.2.5']||null), active:true,
    metadata:{price_type:s['4.2.4']===FROM_PRICE?'from':'fixed', price_pix_raw:s['4.2.5']||null, price_credit:creditTable?parsePrice(s['4.2.6']):null, price_credit_raw:creditTable?(s['4.2.6']||null):null,
      duration:s['4.2.7']||null, booking_block:s['4.2.8']||null, evaluation:s['4.2.9']||null, booking_mode:s['4.2.10']||null,
      qualify_before_quote:s['4.2.11']||null, preparation:s['4.2.12']||null, before_after_photo:s['4.2.13']||null,
      professionals:pros.filter(p=>(p['5.2.2']||[]).includes(s['4.2.1'])).map(p=>p['5.2.1'])}
  }));
  return {
    contract:'noria_onboarding_form_v1',
    review_required:true,
    review_note:'Rascunho gerado pelo questionário. Nada deve ser aplicado no Supabase sem revisão da equipe NORIA e aprovação do salão.',
    generated_at:new Date().toISOString(),
    filled_by:state.meta, approval:state.final,
    known_facts:KNOWN_FACTS, known_facts_corrections:a('1.1.1'),
    tenant:{name:'I&C Salon', suggested_slug:'ic_salon', industry:'Salão de beleza, estética e bem-estar', segment:'aesthetic_clinic', capability:'standard',
      tone:'friendly', persona_name:a('2.1.1'), greeting:'Oi, tudo bem? Sou nova na equipe, com quem eu falo? Como posso ajudar você hoje?',
      emoji_policy:a('2.1.2'), ai_disclosure_when_asked:a('2.1.3'), avoid_terms:a('2.1.4'), never_ask:['idade','data de nascimento']},
    channel:{type:'whatsapp', phone:'5522999633775', operators:owners['Responde o WhatsApp hoje']||null},
    responsibilities:owners,
    business_facts:{
      name:'I&C Salon',
      locations:[{id:'cidade_jardim', name:'I&C Salon Cidade Jardim', address:'Av. das Acácias, 209 - Cidade Jardim', address_complement:a('3.1.1'), reference:a('3.1.2'), access:a('3.1.3'),
        verified:false, verified_source:'Instagram + questionário de onboarding (pendente de conferência)'}],
      hours:{weekly:a('3.2.1'), highlight_shifts:a('3.2.2'), start_grid:a('3.2.3'), booking_window:a('3.2.4'), out_of_hours_behavior:a('3.2.5'), team_response_hours:a('3.2.6')},
      not_offered:['Unha de gel','Acrigel','Fibra','Unha postiça','Unha realista','Henna na sobrancelha','Pacote Dia da Noiva'],
      not_offered_alternative:a('4.1.1'), products:{sells:a('4.1.2'), details:a('4.1.2a')},
      evaluation:{free_in_person_no_photo:true, final_price_only_up:true, scale_measures:a('6.1.1'), highlight_test:a('6.1.2'), ai_can_book:a('6.1.3')},
      chemistry:{min_interval:a('6.2.1'), recent_chemistry_behavior:a('6.2.2'),
        incompatibilities:filled(state.repeaters.incompat).map(c=>({service_a:c['6.3.1']||null, service_b:c['6.3.2']||null, rule:c['6.3.3']||null, detail:c['6.3.4']||null, explanation:c['6.3.5']||null}))},
      media:{before_after_when:a('6.4.1'), consent:a('6.4.2')},
      payment:{methods:['Dinheiro','Pix','Cartão de crédito'], debit:a('8.1.1'), mention_credit_only_if_asked:true, credit_rule:a('4.1.3'), credit_percent:a('4.1.3a'), installments:a('8.1.2'), pix:a('8.1.3'), discounts:'never'},
      deposit_policy:{rule:'1º agendamento sem sinal; após falta ou desmarcação em cima da hora, reagendamento exige 50% via Pix; comparecendo, volta ao normal.',
        late_cancel_window:a('8.2.1'), no_show_marked_by:owners['Marca faltas no sistema']||null, repeat_no_show:a('8.2.2'), base_for_from_prices:a('8.2.3'), verification_trigger:a('8.2.4'), verifier:owners['Confere o Pix do sinal']||null},
      cancellation:{late_tolerance:a('8.3.1'), ai_can_reschedule:a('8.3.2'), salon_cancel_message:a('8.3.3'), internal_notice_by_management:true}
    },
    catalog,
    professionals:pros.map(p=>({name:p['5.2.1'], services:p['5.2.2']||[], schedule:p['5.2.3']||{}, panel_access:false})),
    scheduling:{
      team_size:4, client_picks_professional:a('5.1.1'), blocks_managed_by:owners['Atualiza bloqueios da agenda (folgas, férias)']||null,
      service_resources_draft:Object.fromEntries(catalog.map(c=>[c.external_id,c.metadata.professionals])),
      extra_required_fields:a('7.1.1')||[], minors_notice:a('7.1.2'), customer_confirms_summary:a('7.1.3'), booked_message:a('7.1.4'),
      human_review:{reviewer:owners['Confere pré-agendamentos de mechas e química']||null, response_time:a('7.1.5'), waiting_message:a('7.1.6')},
      no_slot:a('7.2.1'), waitlist:{exists:a('7.2.2'), rules:a('7.2.2a')}, multi_service:a('7.2.3'), third_party:{allowed:a('7.2.4'), data:a('7.2.4a')}, reminder:{enabled:a('7.2.5'), lead:a('7.2.5a')}
    },
    scenarios:Object.fromEntries(scenarios.map(([id,text])=>[id,{situation:text,answer:state.scenarios?.[id]?.answer||null,route:state.scenarios?.[id]?.route||null}])),
    handoff:{triggers:a('10.1.1')||[], message:a('10.1.2'), silence_after_handoff:a('10.1.4'), return_to_ai_by:owners['Pode devolver a conversa para a IA']||null, complaints_owner:owners['Recebe reclamações']||null},
    kanban:a('10.1.3')==='Quero outras colunas'?{custom:true, columns_raw:a('10.1.3a')}:{custom:false, columns:[
      {name:'Conversas IA',automation_key:'conversas_ia'},{name:'Aguardando humano',automation_key:'aguardando_humano'},{name:'Verificar Sinal',automation_key:'verificar_sinal'},
      {name:'Em atendimento humano',automation_key:'com_humano'},{name:'Agendamentos',automation_key:'agendamentos'},{name:'Finalizadas',automation_key:'finalizadas'},
      {name:'Conversas abandonadas',automation_key:'conversas_abandonadas'},{name:'Follow Ups',automation_key:'follow_ups'}]},
    automation:{audio_enabled:a('10.2.1'), contact_exclusion:{enabled:a('10.2.2'), list_raw:a('10.2.2a')}, follow_up:a('10.2.3'),
      maintenance_reminders:{enabled:a('10.2.4'), rules:a('10.2.4a')}, broadcasts:{enabled:a('10.2.5'), rules:a('10.2.5a')}, closing_message:a('10.2.6')},
    validation:{faq:a('10.3.1'), forbidden_errors:a('10.3.2'), approver:owners['Aprova mudanças de preço e regras']||null, test_cases:a('10.3.3')},
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
