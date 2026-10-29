# Questionário interativo — I&C Salon (Cidade Jardim)

Levantamento de regras de atendimento e agenda para configurar a NORIA no
[@ic.sallon](https://www.instagram.com/ic.sallon/). Segue o formato dos questionários
interativos da NORIA: site estático, perguntas condicionais, fichas repetíveis, cenários
de conversa com destino IA/equipe, salvamento no navegador e exportação em PDF.

## O que já vem preenchido (o salão só revisa)

Da reunião com o salão:

- Lista de 21 serviços (cabelo, estética e corpo, sobrancelha, unhas tradicionais,
  maquiagem e penteado), com preço "a partir de" e avaliação obrigatória nas químicas,
  mechas em meio período (4–5 h) com pré-agenda confirmada pela equipe e pé e mão a R$ 57,00 no Pix/dinheiro.
- O que o salão não faz: unha de gel, acrigel, fibra, postiça, realista, henna e Dia da Noiva.
- Regra de sinal após falta, preço no crédito só quando perguntado, sem desconto,
  avaliação presencial gratuita e não por foto, preço pela balança, menores com os pais
  e a IA não pergunta a idade.
- Profissionais César e Ítalo, sem acesso ao painel (a gestão repassa).
- As 5 simulações de conversa da reunião, com a resposta combinada.

Do Instagram: endereço Av. das Acácias, 209 – Cidade Jardim e telefone (22) 99963-3775,
para confirmação.

A IA se apresenta como integrante da equipe, como combinado, mas não nega ser uma IA
quando a cliente pergunta diretamente (pergunta 1.1.6).

## Como as respostas viram configuração

O botão **Exportar dados para a NORIA (JSON)** gera um rascunho (`review_required: true`).
Nada é aplicado automaticamente.

| Seção | Destino no sistema |
|---|---|
| 1. Identidade | `tenants` (segmento `aesthetic_clinic`, capacidade `standard`), tom e prompt |
| 2. Funcionamento | `business_facts` (endereço, horários, grade e antecedência) |
| 3. Equipe | profissionais e rascunho de `service_resources` (serviço → profissional) para a agenda |
| 4. Serviços | `tenant_service_catalog` (preço Pix, preço crédito, duração, bloqueio, modo de agendamento) |
| 5. Avaliação e química | regras de avaliação, balança, intervalos e combinações proibidas |
| 6–8. Agenda, sinal e cancelamento | `appointments`, política de sinal após falta, conferência do Pix |
| 9. Cenários | respostas aprovadas e destino (IA ou equipe) |
| 10. Encaminhamento | colunas do Kanban de agendamento, áudio, contatos só humanos, follow-ups |

## Publicação

Publicado pelo GitHub Pages a partir da branch `main`, pasta `/ (root)`:
`https://jiwtech.github.io/questionario-salao/`.
