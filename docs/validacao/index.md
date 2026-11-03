# :material-clipboard-check-outline: Validação de Mercado e Descoberta de Produto

Esta seção documenta o processo de validação empírica da dor, quantificação do *baseline* operacional e validação do formato do pacote de comprovação junto ao Perfil de Cliente Ideal (ICP): **transportadoras regionais de carga fracionada e dedicada (frotas de 20 a 200 veículos)** atuantes no Distrito Federal e Entorno.

---

## :material-shield-lock-outline: Termo de Consentimento e Conformidade LGPD

Todas as entrevistas registradas neste documento seguiram protocolo estrito de privacidade e proteção de dados (Lei nº 13.709/2018 — LGPD):

1. **Consentimento Informado:** Antes do início de cada conversa, os participantes foram informados sobre a finalidade exclusivamente acadêmica e de pesquisa de produto do projeto **Entrega Prova** (Universidade de Brasília — UnB), manifestando consentimento expresso para o uso agregado das métricas operacionais.
2. **Anonimização na Origem:** Nenhum dado pessoal identificável (nomes de gestores, CPFs, telefones ou e-mails) nem razões sociais ou CNPJs das transportadoras e embarcadores foram armazenados neste repositório. As empresas são identificadas apenas por códigos alfanuméricos e região administrativa.

---

## :material-help-circle-outline: Roteiro Estruturado de Entrevista (10 Perguntas)

O roteiro abaixo foi aplicado com tomadores de decisão das áreas financeira e de faturamento:

1. Quantas entregas vocês realizam por mês e quantos veículos compõem a operação (próprios e agregados)?
2. Como o canhoto físico ou comprovante volta hoje para a base e quem faz a conferência?
3. **Quantos dias, em média, levam entre a entrega física na doca do destinatário e o canhoto estar conferido e liberado para faturamento?** *(Métrica de Baseline)*
4. Quantos canhotos se perdem, rasgam ou chegam com foto ilegível por mês?
5. O que acontece quando o embarcador glosa ou atrasa o pagamento por falta de comprovante? Qual o volume financeiro médio retido?
6. **O que o embarcador exige receber no pacote de comprovação para liberar o pagamento do frete?**
7. Na operação diária, vocês exigem número de documento (RG/CPF) de quem assina o recebimento ou o nome legível com carimbo/assinatura basta? Por quê?
8. Que ferramentas vocês utilizam hoje para controlar essa etapa (WhatsApp, planilhas, ERP/TMS)?
9. Quem dentro da transportadora bate o martelo na contratação de um software para resolver isso?
10. Qual modelo de cobrança faria mais sentido para o seu fluxo de caixa: mensalidade fixa por veículo ou valor por documento conciliado? Quanto estariam dispostos a pagar?

---

## :material-Domain: Registro das Entrevistas (ICP)

### Entrevista #01 — Transportadora Alfa (Região: SIA / DF)
* **Perfil do Entrevistado:** Gerente Financeiro e de Faturamento.
* **Conduzida por:** Maria Luisa Oliveira Lima (Product Owner) e Marcelo Vitor Machado da Silva Filho (QA).
* **Modalidade:** Presencial na sede operacional (SIA Trecho 3) e alinhamento via Google Meet.
* **Consentimento Registrado:** Sim (autorizado uso anônimo das métricas em 26/10/2026).

| Pergunta | Resposta e Evidência Coletada |
| :--- | :--- |
| **1. Volume e Frota** | ~1.800 entregas/mês com 45 veículos (30 próprios e 15 motoristas agregados). |
| **2. Fluxo Atual** | O motorista traz o bloco de canhotos de papel quando retorna de viagem ou manda foto solta no WhatsApp quando o financeiro cobra urgência. Duas auxiliares de faturamento conferem um por um contra o XML impresso. |
| **3. Tempo até Conferência (Baseline)** | **14 dias em média** (rotas no Goiás e Bahia levam até 21 dias para o papel físico chegar no escritório). |
| **4. Perdas e Ilegibilidade** | Cerca de 4% a 5% das entregas (~80 canhotos/mês) dão retrabalho por foto escura/cortada no WhatsApp ou extravio do papel na cabine. |
| **5. Impacto Financeiro (Aging)** | Embarcadores grandes só abrem a janela de pagamento com 100% dos comprovantes do lote. Mantemos entre **R$ 180 mil e R$ 240 mil travados** constantemente esperando canhoto. |
| **6. Exigência do Pacote** | O embarcador pede uma planilha ou PDF de espelho do borderô com número da NF-e, data da entrega e nome do recebedor, acompanhado das imagens dos canhotos organizadas pelo número da nota. |
| **7. Dados do Recebedor** | **Apenas o nome do recebedor** no canhoto e a foto legível. Pedir RG ou CPF na doca gera atrito com o conferente do supermercado/centro de distribuição e atrasa a saída do caminhão. |
| **8. Ferramentas Atuais** | Grupos de WhatsApp por motorista + planilha Excel de controle de pendências + pasta compartilhada no Google Drive. |
| **9. Decisor de Compra** | Gerente Financeiro valida a redução de glosa e o Diretor Operacional aprova o custo. |
| **10. Disposição a Pagar (WTP)** | Prefere **SaaS por veículo ativo** (previsibilidade de custo), disposto a pagar entre **R$ 25 e R$ 35 por veículo/mês** (R$ 1.125 a R$ 1.575/mês). |

---

### Entrevista #02 — Transportadora Beta (Região: SCIA / Cidade do Automóvel - DF)
* **Perfil do Entrevistado:** Coordenadora de Faturamento e Contas a Receber.
* **Conduzida por:** Maria Luisa Oliveira Lima (Product Owner) e João Pedro Pellegrini de Almeida (Tech Lead).
* **Modalidade:** Videoconferência (Google Meet) com demonstração de tela do processo atual de conferência.
* **Consentimento Registrado:** Sim (autorizado uso anônimo das métricas em 27/10/2026).

| Pergunta | Resposta e Evidência Coletada |
| :--- | :--- |
| **1. Volume e Frota** | ~3.400 entregas/mês com 85 veículos (foco em distribuição B2B de alimentos e bebidas). |
| **2. Fluxo Atual** | Tentam usar grupos de WhatsApp, mas como o sinal de internet nas docas subterrâneas é ruim, o motorista esquece de reenviar quando sai para a rua. Três conferentes baixam as fotos manualmente e renomeiam arquivo por arquivo. |
| **3. Tempo até Conferência (Baseline)** | **18 dias em média** entre a entrega realizada e a baixa validada no faturamento. |
| **4. Perdas e Ilegibilidade** | ~120 comprovantes/mês chegam ilegíveis (sombra na foto, dedo na frente da chave ou foto duplicada de outra nota). |
| **5. Impacto Financeiro (Aging)** | Glosas e postergação de faturamento para a quinzena seguinte. Capital de giro retido gira em torno de **R$ 410 mil** por ciclo mensal, forçando antecipação bancária cara. |
| **6. Exigência do Pacote** | Arquivo compactado (ZIP) contendo o relatório resumo das notas do período, as fotos nomeadas pela chave de 44 dígitos e alguma garantia de que as fotos correspondem às notas listadas. |
| **7. Dados do Recebedor** | **Somente o nome de quem recebeu.** Por orientação jurídica de LGPD dos próprios clientes B2B, evitam coletar CPF de funcionários das docas. |
| **8. Ferramentas Atuais** | ERP legado apenas para emissão de CT-e + WhatsApp Web + planilhas manuais. |
| **9. Decisor de Compra** | Gerência Financeira em conjunto com os sócios da transportadora. |
| **10. Disposição a Pagar (WTP)** | Aceita modelo híbrido ou **por documento conciliado** (estimativa de **R$ 0,35 a R$ 0,50 por entrega conciliada** ou pacote fixo de R$ 2.200/mês). |

---

### Entrevista #03 — Transportadora Gama (Região: Gama / Polo JK - DF)
* **Perfil do Entrevistado:** Sócio-Administrador e Responsável pelo Financeiro.
* **Conduzida por:** Maria Luisa Oliveira Lima (Product Owner) e Ana Teresa Schneider Brandão (Frontend).
* **Modalidade:** Presencial no pátio logístico (Polo JK) e entrevista semiestruturada com o sócio-administrador.
* **Consentimento Registrado:** Sim (autorizado uso anônimo das métricas em 28/10/2026).

| Pergunta | Resposta e Evidência Coletada |
| :--- | :--- |
| **1. Volume e Frota** | ~1.100 entregas/mês com 28 veículos (operações curtas e médias no DF e Entorno). |
| **2. Fluxo Atual** | Motoristas mandam foto pelo celular no fim do dia, mas sem padrão. O próprio financeiro perde de 2 a 3 horas por dia caçando qual foto pertence a qual XML de NF-e. |
| **3. Tempo até Conferência (Baseline)** | **10 dias em média** (mesmo em rotas curtas, a demora na conferência manual trava o fechamento semanal). |
| **4. Perdas e Ilegibilidade** | Cerca de 35 a 45 canhotos por mês exigem cobrar o motorista novamente ou pedir segunda via ao destinatário. |
| **5. Impacto Financeiro (Aging)** | Cerca de **R$ 95 mil parados** em notas entregues aguardando fechamento de pacote para cobrança. |
| **6. Exigência do Pacote** | Resumo em PDF/CSV com os dados da nota, data/hora da entrega e nome do recebedor + pasta com as fotos nítidas. |
| **7. Dados do Recebedor** | **Apenas o nome.** O motorista precisa de tela rápida com botões grandes para preencher sob o sol e seguir viagem. |
| **8. Ferramentas Atuais** | 100% WhatsApp e planilha no Excel. |
| **9. Decisor de Compra** | O próprio Sócio-Administrador. |
| **10. Disposição a Pagar (WTP)** | **Mensalidade por veículo** (até R$ 30/veículo/mês) desde que não exija instalar aplicativo pesado que consuma a memória do celular dos motoristas. |

---

## :material-chart-timeline-variant: Consolidação do Baseline e Decisões de Produto

A tabela abaixo consolida os indicadores extraídos nas entrevistas que fundamentam as regras de negócio e a métrica de demonstração do **Entrega Prova**:

| Métrica / Indicador | Transportadora Alfa | Transportadora Beta | Transportadora Gama | **Média / Padrão Consolidado** |
| :--- | :---: | :---: | :---: | :---: |
| **Frota Ativa** | 45 veículos | 85 veículos | 28 veículos | **52 veículos (dentro do ICP 20–200)** |
| **Entregas / Mês** | 1.800 | 3.400 | 1.100 | **2.100 entregas/mês** |
| **Baseline (Entrega → Conferência)** | 14 dias | 18 dias | 10 dias | **14 dias (336 horas)** |
| **Taxa de Retrabalho / Perda** | ~4,5% | ~3,5% | ~3,6% | **~3,8% das entregas** |
| **Valor Retido por Aging** | R$ 210.000 | R$ 410.000 | R$ 95.000 | **R$ 238.300 por ciclo** |
| **Dado Pessoal Exigido na Doca** | Só nome | Só nome | Só nome | **Apenas `recebedorNome` (LGPD)** |

### Decisões Validadas para o Escopo do MVP:
1. **Métrica Oficial de Demo vs. Baseline:** O baseline validado nas entrevistas é de **14 dias médios** entre a entrega física e o comprovante conferido. A meta demonstrável do Entrega Prova é reduzir esse ciclo para **menos de 2 horas** com conciliação lado a lado e painel de aging em tempo real.
2. **Minimização de Dados (LGPD):** Confirmado que o mercado evita coletar RG/CPF na doca por atrito operacional e compliance. O sistema coleta exclusivamente o `recebedorNome` (e geolocalização opcional com consentimento).
3. **Resiliência de Rede sem Offline Complexo:** A maior dor na doca é a perda da foto quando o sinal oscila no envio. A funcionalidade de **compressão no navegador (~300 KB) + retry idempotente ("Tentar de novo" sem refazer a foto)** ataca diretamente o problema sem exigir banco offline complexo.
4. **Formato do Pacote de Comprovação (Jornada 5):** Validado o formato composto por `resumo.pdf` (ou `.csv`), pasta `fotos/` nomeada pela chave de 44 dígitos e `manifesto.json` contendo os hashes SHA-256 para auditoria do embarcador.

---

## :material-book-open-variant: Evidências Secundárias de Mercado

Os dados secundários abaixo contextualizam o cenário macroeconômico do setor no Brasil e são mantidos com o rótulo explícito de hipótese complementar às entrevistas primárias:

* **Prazo Médio de Recebimento no Setor (14 a 30 dias):** Dados setoriais apontam que o ciclo financeiro de transportadoras B2B sofre atraso de 14 a 30 dias decorrente da retenção física de comprovantes (*Fonte: [NTC&Logística — Estudos Econômicos do TRC](https://www.portalntc.org.br/) — **Hipótese não validada em escala nacional; validada localmente em 14 dias nas 3 entrevistas acima***).
* **Compressão de Margens Operacionais (< 5%):** Operadores de transporte rodoviário de cargas operam sob margens líquidas estreitas, onde glosas documentais e custos de antecipação de recebíveis corroem diretamente a rentabilidade (*Fonte: [Confederação Nacional do Transporte — Painel CNT do Transporte](https://www.cnt.org.br/painel-cnt-transporte) — **Hipótese secundária complementar***).

---

## :material-clipboard-text-clock-outline: Bastidores de Campo e Registro Interno de Condução

Para fins de auditoria acadêmica, conformidade metodológica e suporte a questionamentos da tutoria/banca, esta seção registra os bastidores operacionais, os responsáveis pela condução e as anotações qualitativas brutas colhidas pela equipe:

### Matriz de Condução das Entrevistas

| Entrevista | Empresa (Código Anônimo) | Data | Entrevistadores da Equipe | Modalidade | Duração |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **#01** | Transportadora Alfa (SIA / DF) | 26/10/2026 | Maria Luisa Oliveira Lima (PO) e Marcelo Vitor (QA) | Presencial na sede operacional + Google Meet | 45 min |
| **#02** | Transportadora Beta (SCIA / DF) | 27/10/2026 | Maria Luisa Oliveira Lima (PO) e João Pedro Pellegrini (Tech Lead) | Videoconferência (Google Meet) | 50 min |
| **#03** | Transportadora Gama (Gama / Polo JK - DF) | 28/10/2026 | Maria Luisa Oliveira Lima (PO) e Ana Teresa Schneider (Frontend) | Presencial no pátio logístico | 40 min |

### Anotações Brutas de Campo (Caderno de Campo)

??? note "Anotações Brutas — Entrevista #01 (Transportadora Alfa)"
    * **Ambiente e Clima:** Conversa realizada na sala de faturamento com 2 assistentes operando 3 telas simultâneas (ERP legado, pasta do Google Drive e WhatsApp Web com centenas de mensagens não lidas).
    * **Reação ao PWA:** A proposta de não exigir download em lojas de aplicativos gerou entusiasmo imediato no gestor: *"Se mandar o motorista baixar app de 50 MB, metade da frota agregada recusa na hora ou reclama que a memória do celular tá cheia"*.
    * **Anotação Crítica sobre LGPD:** O gestor reforçou que clientes embarcadores dos ramos farmacêutico e de cosméticos já notificaram formalmente a transportadora para não expor CPF de conferentes de farmácias em fotos de canhoto. Coletar apenas o nome do recebedor atende 100% aos requisitos de auditoria dos clientes.
    * **Ponto de Tensão:** O fechamento quinzenal acumula cerca de 300 notas esperando conferência física do papel; se o canhoto digital estiver nítido, eles faturam na mesma semana.

??? note "Anotações Brutas — Entrevista #02 (Transportadora Beta)"
    * **Ambiente e Clima:** Reunião remota com a coordenadora de faturamento e o encarregado de tráfego. Coordenadora demonstrou alto nível de estresse com o "aging documental invisível".
    * **Reação à Idempotência e Conectividade:** O encarregado destacou: *"Em doca subterrânea de supermercado em Brasília, o 4G oscila. O motorista clica no botão de enviar quatro vezes achando que travou"*. A validação de hash e tratamento de duplicidade sem gerar erro fatal foi considerada essencial para evitar retrabalho.
    * **Comentário sobre Pacote de Comprovação:** Exigência de que o PDF/resumo tenha o número da NF-e e a chave de 44 dígitos no cabeçalho ou rodapé para auditoria dos grandes embarcadores que contratam a Beta.
    * **Anotação de Usabilidade:** Pediram interface extremamente simplificada na ponta mobile, com botão da câmera de fácil alcance pelo polegar do motorista sob sol forte.

??? note "Anotações Brutas — Entrevista #03 (Transportadora Gama)"
    * **Ambiente e Clima:** Visita ao pátio no Polo JK no final da tarde, acompanhando a chegada de duas carretas de rota de entrega local.
    * **Observação Visual dos Canhotos:** Os canhotos físicos chegam amassados dentro de pranchetas de madeira na cabine, com marcas de poeira e dobras. Dois papéis estavam com assinatura quase ilegível por caneta fraca.
    * **Reação do Sócio:** Foco 100% pragmático em fluxo de caixa: *"Eu não preciso de IA lendo canhoto agora. Se eu tiver a foto nítida e os dados da nota do lado para a minha conferente bater o olho em 10 segundos e dar OK, eu adianto 10 dias de recebimento de frete"*.
    * **Cobrança por Veículo:** O sócio descartou modelos complexos por transação; prefere pagar mensalidade fixa por placa para facilitar o provisionamento de custo fixo na planilha da transportadora.