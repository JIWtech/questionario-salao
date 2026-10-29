# Questionário interativo — I&C Salon (Cidade Jardim)

Levantamento de regras de atendimento e agenda para configurar a NORIA no
[@ic.sallon](https://www.instagram.com/ic.sallon/). Segue o formato dos questionários
interativos da NORIA: site estático, perguntas condicionais, fichas repetíveis, cenários
de conversa com destino IA/equipe, salvamento no navegador e exportação em PDF.

## O que já está definido (não é perguntado de novo)

Tudo o que foi combinado na reunião e o que está no Instagram aparece na seção 1,
"O que já foi combinado", só para leitura, com um único campo para correções:
apresentação da IA, equipe de 4 profissionais sem acesso ao painel, o que o salão não faz,
preço "a partir de" e pela balança, avaliação presencial gratuita, mechas em meio período com
pré-agenda, preço no crédito só quando perguntado, sem desconto, regra de sinal após falta,
menores com os pais e as 5 simulações de conversa da reunião.

O questionário pergunta só o que falta: horários, responsáveis, a ficha de cada serviço
(a lista dos 21 serviços já vem preenchida), quem faz cada serviço, medidas da balança,
química, pagamento e regras de agenda. Também pede para esclarecer uma contradição da
reunião: mechas de 4–5 h num turno da manhã de 09h30 às 12h00 (pergunta 3.2.2).

A IA se apresenta como integrante da equipe, como combinado, mas não nega ser uma IA
quando a cliente pergunta diretamente (pergunta 2.1.3).

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
