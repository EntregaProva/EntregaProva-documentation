---

## :material-shield-check-outline: Privacidade e Proteção de Dados (LGPD)

Em estrita observância aos princípios da finalidade, adequação, necessidade (minimização de dados) e segurança previstos na Lei Geral de Proteção de Dados (Lei nº 13.709/2018):

* **Dados Pessoais Coletados:** O sistema coleta exclusivamente o **nome do recebedor** (`recebedorNome`) no ato da entrega física, o **e-mail corporativo e nome** dos usuários autenticados da transportadora (`members`) e, de forma estritamente opcional e mediante consentimento explícito registrado pelo motorista, a **geolocalização pontual** (`lat, lng`) do momento da captura. **Não são coletados CPF ou RG do recebedor.**
* **Finalidade e Base Legal:** Os dados destinam-se exclusivamente à comprovação da execução do contrato de transporte B2B perante o embarcador e ao controle de acesso multitenant (Base Legal: Execução de Contrato e Legítimo Interesse, Art. 7º, V e IX da LGPD).
* **Retenção e Descarte Automático (Lifecycle):** As imagens dos comprovantes são armazenadas em bucket privado sem acesso público (leitura restrita via URLs assinadas com expiração de até **15 minutos**) e contam com política automática de descarte (*lifecycle*) após **60 dias** (ciclo de faturamento e auditoria). Logs de aplicação em formato JSON são higienizados na origem para nunca registrar dados pessoais (PII).

---

## :material-lock-Check-outline: Hipótese de Defensibilidade e Métrica de Demonstração

> **Defensibilidade em uma frase:** Enquanto o captura-e-envia técnico (PWA e parser XML) pode ser replicado, o **Entrega Prova** constrói uma barreira competitiva inegociável através do **histórico proprietário acumulado de entregas, motivos de ocorrência e tempos reais de ciclo por embarcador**, que se transforma na base auditável para renegociação de SLAs logísticos e precificação de risco para antecipação de recebíveis.

### Métrica de Demonstração (Demo Day)
* **O que é medido:** Tempo médio decorrido entre a entrega registrada e o comprovante conferido (`conferidaEm - entregueEm`), consolidado no **Painel de Aging por Embarcador** ao lado do volume financeiro retido em cada faixa (`0–3`, `4–7`, `8–15` e `> 15 dias`).
* **Comparação com o Baseline:** Confronto direto na tela entre o **baseline real de 14 dias (336 horas)** levantado nas entrevistas com transportadoras (documentado em `/docs/validacao`) e o ciclo reduzido para **menos de 2 horas** operando no fluxo ponta a ponta do Entrega Prova.