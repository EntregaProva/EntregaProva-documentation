# Backlog do Produto e Requisitos (MoSCoW)

Este documento centraliza o Product Backlog do projeto **Entrega Prova**, estruturado com base na metodologia MoSCoW, critérios de aceite quantificáveis e o histórico de revisões semanais exigido pelo Caderno de Projetos B2B v2.

---

## 1. Visão Geral das Histórias de Usuário (MoSCoW)

| ID | Épico / Funcionalidade | Prioridade | Descrição Resumida |
| :--- | :--- | :--- | :--- |
| **US-01** | Importação de XML | **Must-Have** | Admin importa XML de NF-e/CT-e (4.00, $\le 1$ MB) gerando entrega pendente. |
| **US-02** | Captura Mobile | **Must-Have** | Motorista captura comprovante pelo celular com compressão e retry idempotente. |
| **US-03** | Conferência de Comprovante | **Must-Have** | Conferente/Admin valida ou rejeita o comprovante com motivo obrigatório. |
| **US-04** | Painel de Aging | **Must-Have** | Visualização de pendências por faixas de dias e valor retido por embarcador. |
| **US-05** | Pacote de Comprovação | **Must-Have** | Geração assíncrona de pacote de cobrança com resumo e manifesto de hashes SHA-256. |
| **US-06** | Escopo do Motorista | **Must-Have** | Motorista visualiza e gerencia exclusivamente as entregas atribuídas ao seu ID. |
| **US-07** | Gestão de Ciclo de Vida (Lifecycle) | **Must-Have** | Exclusão automática de imagens antigas do bucket após 60 dias e alertas ativos. |

---

## 2. Detalhamento e Critérios de Aceite (Must-Have)

### US-01 — Importação de XML de NF-e e CT-e
* **Como** Administrador logado, **quero** importar o arquivo XML de uma nota fiscal ou conhecimento de transporte, **para** que o sistema crie automaticamente a entrega correspondente no status pendente de forma idempotente.
* **Critérios de Aceite:**
  * **CA01:** Arquivos com tamanho superior a $1.048.576$ bytes ($1$ MB) devem ser rejeitados imediatamente com código HTTP `413` (`ERR_XML_TOO_LARGE`) sem passar pelo parser.
  * **CA02:** Tentativas de injeção de entidades externas (`<!DOCTYPE` ou `<!ENTITY`) devem ser bloqueadas com código HTTP `400` (`ERR_XML_DTD_FORBIDDEN`) antes do processamento.
  * **CA03:** O sistema aceita exclusivamente XMLs de NF-e (modelo 55) e CT-e (modelo 57) na versão `4.00`. Outras versões retornam `422`.
  * **CA04:** A chave de acesso de $44$ dígitos é validada matematicamente por Módulo 11. Chaves inválidas retornam `422` (`ERR_KEY_CHECK_DIGIT`).
  * **CA05:** A importação da mesma chave de acesso duas vezes pelo mesmo tenant retorna código HTTP `409` (`ERR_DUPLICATE_IMPORT`).

### US-02 — Captura Mobile do Comprovante
* **Como** Motorista autenticado, **quero** capturar a foto do canhoto diretamente pela câmera do celular, **para** que o comprovante seja enviado à API com segurança e redimensionamento adequado.
* **Critérios de Aceite:**
  * **CA01:** O campo de upload aciona preferencialmente a câmera traseira (`capture="environment"`).
  * **CA02:** A imagem é comprimida no navegador via `canvas` para o lado maior de no máximo $1280$ px, resultando em um arquivo otimizado de aproximadamente $300$ KB (formatos JPEG ou WebP).
  * **CA03:** O envio utiliza uma chave de idempotência (`Idempotency-Key` UUID gerada na captura). Múltiplos envios simultâneos com a mesma chave registram apenas $1$ comprovante no banco.
  * **CA04:** Em caso de queda de rede, a interface exibe um alerta acessível (`role="alert"`) e disponibiliza o botão "Tentar de novo", reenviando a mesma imagem sem exigir nova foto.

### US-03 — Conferência Lado a Lado
* **Como** Conferente ou Administrador, **quero** visualizar os dados essenciais da nota ao lado da foto miniatura/zoom do comprovante, **para** aprovar ou rejeitar o documento rapidamente.
* **Critérios de Aceite:**
  * **CA01:** O aprovador pode alternar o status da entrega de `COMPROVANTE_ENVIADO` para `CONFERIDA` (sucesso).
  * **CA02:** Ao rejeitar o comprovante, o preenchimento de um motivo estruturado é obrigatório. A entrega transita para o status `REJEITADA` e o motorista é autorizado a realizar um novo envio.
  * **CA03:** Tentativas de transição de status fora da máquina de estados oficial retornam HTTP `409` (`ERR_INVALID_TRANSITION`).

### US-04 — Painel de Aging e Pendências (Jornada S5-S6)
* **Como** Gestor Financeiro ou Administrador, **quero** consultar um painel consolidado com faixas de atraso e valores retidos por embarcador, **para** priorizar cobranças e evitar glosas.
* **Critérios de Aceite:**
  * **CA01:** O painel agrupa as entregas em quatro faixas de aging baseadas em dias corridos a partir da data de importação (`pendenteDesde`): $0\text{–}3$ dias, $4\text{–}7$ dias, $8\text{–}15$ dias e $> 15$ dias.
  * **CA02:** O cálculo de totais e contagens utiliza agregações nativas do banco de dados, respondendo em até $2$ segundos mesmo com bases de sementes consolidadas.

### US-05 — Pacote de Comprovação (Jornada S5-S6)
* **Como** Gestor Financeiro, **quero** gerar um pacote digital de comprovação por embarcador e período, **para** anexar ao faturamento e acelerar o recebimento do frete.
* **Critérios de Aceite:**
  * **CA01:** A solicitação de geração assíncrona retorna status HTTP `202 Accepted` com um identificador de pacote.
  * **CA02:** O pacote final entregue em link seguro contém um relatório resumo, a pasta de fotos nomeadas pela chave de $44$ dígitos e o `manifesto.json` contendo os hashes SHA-256 de integridade.

### US-06 — Escopo Restrito do Motorista
* **Como** Motorista autenticado, **quero** visualizar e interagir apenas com as entregas vinculadas ao meu perfil (`motoristaId === uid`), **para** manter a privacidade da operação.
* **Critérios de Aceite:**
  * **CA01:** Requisições de listagem ou detalhamento de entregas de terceiros retornam código HTTP `403 Forbidden`.

### US-07 — Gestão de Ciclo de Vida e Alertas (Lifecycle — Jornada S5-S6)
* **Como** Operador de Infraestrutura e Administrador, **quero** garantir o descarte automático de arquivos antigos e alertas de capacidade, **para** manter a conformidade com a LGPD e controlar custos.
* **Critérios de Aceite:**
  * **CA01:** O bucket de armazenamento possui regra de ciclo de vida (*lifecycle*) que remove automaticamente arquivos de imagem com mais de $60$ dias.
  * **CA02:** Alertas ativos no monitoramento de nuvem notificam falhas de infraestrutura e estouro de limites operacionais.

---

## 3. Histórico de Revisões do Backlog

### Revisão 01 — 21/10/2026 (Fim da Semana 3)
* **O que mudou:** Consolidação inicial das histórias US-01 a US-03 para o escopo do Checkpoint 2.
* **Motivo:** Direcionamento do Caderno B2B v2 para garantir que o fluxo base de importação, captura e conferência estivesse com critérios numéricos claros antes da implementação local.

### Revisão 02 — 28/10/2026 (Fim da Semana 4)
* **O que mudou:** Promoção das Histórias US-04 (Painel de Aging) e US-05 (Pacote de Comprovação) para o status de **Must-Have**, além da inclusão da US-06 (Isolamento do motorista).
* **Motivo:** Alinhamento com as fichas de produto da fase S5-S6 e diretrizes do tutor para garantir entrega antecipada de valor comercial.

### Revisão 03 — 09/11/2026 (Fim da Semana 5 / Início da Semana 6)
* **O que mudou:** Inclusão formal da US-07 (Ciclo de Vida do Bucket e Alertas) como requisito essencial para o Checkpoint 3 na nuvem.
* **Motivo:** Atendimento integral aos critérios de infraestrutura e governança de dados exigidos para o deploy automatizado em ambiente de produção (15/11).

---

## 4. Roteiro de Demonstração (Demo — Checkpoint 3)

1. **Apresentação da Dor (30s):** Contextualização do baseline de $14$ dias de atraso no recebimento de canhotos físicos, com base nas entrevistas com transportadoras.
2. **Demonstração do Pipeline e Preview de PR (60s):** Abertura de um Pull Request no GitHub, visualização do CI rodando e acesso ao link temporário de pré-visualização (*preview channel*) no Firebase Hosting.
3. **Deploy Automatizado na Nuvem (30s):** Realização do *merge* na branch `main` e acompanhamento do deploy automático no Cloud Run (API) e Firebase Hosting (Front), com smoke test verde.
4. **Jornada de Ponta a Ponta na URL Pública (90s):**
   * Admin importa um XML válido e um XML malicioso (bloqueado pelo parser).
   * Motorista simula a captura pelo celular com compressão e reenvio idempotente.
   * Conferente aprova o comprovante na tela lado a lado.
5. **Painel de Aging e Lifecycle (60s):** Exibição do painel de pendências por faixas de dias e comprovação das regras de retenção de imagens na nuvem.
6. **Métricas de Engenharia e FinOps (30s):** Validação dos endpoints `/healthz` e `/readyz`, exibição dos alertas ativos no monitoramento e comprovação do faturamento acumulado em até $\text{US\$ } 12$.

# Backlog e MoSCoW do Projeto

Este documento apresenta o Backlog do produto **Entrega Prova**, estruturado com a metodologia MoSCoW (Must-have, Should-have, Could-have, Won't-have), critérios de aceite numéricos e o histórico de revisões semanais.

---

## 1. Visão Geral e Priorização (MoSCoW)

| ID | Épico / Funcionalidade | Descrição Resumida | Prioridade |
| :--- | :--- | :--- | :--- |
| **US-01** | Importação de XML | Importação, validação e parser seguro de XMLs (NF-e/CT-e) com prevenção contra XXE e validação do Módulo 11. | **Must-Have** |
| **US-02** | Captura Mobile e Idempotência | Envio de comprovante fotográfico pelo motorista com controle de idempotência (`Idempotency-Key`) e persistência segura no Storage. | **Must-Have** |
| **US-03** | Conferência Lado a Lado | Painel de validação e conferência do comprovante contra os dados da nota fiscal, com emissão de status e motivo obrigatório em caso de rejeição. | **Must-Have** |
| **US-04** | Painel de Aging de Entregas | Visualização e rastreamento de entregas pendentes organizadas por faixas de dias (0-3, 4-7, 8-15 e >15 dias). | **Must-Have** |
| **US-05** | Pacote de Comprovação | Exportação e geração de pacote de auditoria contendo comprovantes, metadados e assinaturas criptográficas (SHA-256). | **Must-Have** |
| **US-06** | Isolamento por Tenant e Papéis | Restrição rigorosa de acesso baseada nas *claims* de papel (`ADMIN`, `CONFERENTE`, `MOTORISTA`, `FINANCEIRO`) e ID do tenant. | **Must-Have** |
| **US-07** | Jornada de Nuvem e Lifecycle | **[Nova - S5/S6]** Automação do ciclo de vida (*lifecycle*) do bucket para remoção de fotos antigas e alertas operacionais em ambiente de nuvem. | **Must-Have** |

---

## 2. Histórias de Usuário e Critérios de Aceite Numéricos

### US-01: Importação de XML de NF-e/CT-e
* **CA-01 (Tamanho):** O arquivo XML enviado via multipart/form-data deve possuir tamanho estritamente menor ou igual a $1$ MB ($1048576$ bytes medidos em UTF-8). Arquivos maiores devem ser rejeitados com HTTP 413.
* **CA-02 (Estrutura e Parser):** O parser deve recusar qualquer DTD, entidades externas ou tentativas de XXE, retornando HTTP 400.
* **CA-03 (Chave de Acesso):** A chave de acesso da NF-e deve conter exatamente $44$ dígitos, com validação matemática do Dígito Verificador (Módulo 11).

### US-02: Captura Mobile e Idempotência
* **CA-01 (Formato e Tamanho da Foto):** O comprovante fotográfico deve ser nos formatos JPEG, PNG ou WebP, com tamanho otimizado no cliente de até $300$ KB e resolução máxima de $1280$ px.
* **CA-02 (Idempotência):** Requisições repetidas com o mesmo cabeçalho `Idempotency-Key` e hash de conteúdo idêntico devem retornar o cache anterior sem duplicar registros no Firestore.

### US-03: Conferência Lado a Lado
* **CA-01 (Decisão de Conferência):** A rota de conferência deve aceitar exclusivamente os status de decisão `APROVAR` ou `REJEITAR`.
* **CA-02 (Motivo Obrigatório):** Caso a decisão seja `REJEITAR`, o campo de justificativa textual é obrigatório, sob pena de recusa da requisição com HTTP 400.

### US-07: Jornada de Nuvem, Lifecycle e Alertas (S5-S6)
* **CA-01 (Retenção de Imagens):** O sistema deve configurar política de ciclo de vida no Cloud Storage para expurgar automaticamente comprovantes que excedam o período de retenção regulamentar, mantendo o uso de armazenamento otimizado.
* **CA-02 (Alertas de Nuvem):** O ambiente de produção em nuvem deve manter ativos alertas no Cloud Monitoring para taxas de erro HTTP $5xx$ superiores a $2\%$ e latência p95 superior a $2000$ ms.

---

## 3. Roteiro da Demonstração — Checkpoint 3 (15/11)

1. **Pipeline de Deploy e Preview:** Disparo de um PR de teste para validação do canal de preview no Firebase Hosting, seguido de merge para a `main` publicando a API no Cloud Run com smoke tests automáticos.
2. **Validação de Health Checks:** Verificação imediata dos endpoints `/api/v1/healthz` e `/api/v1/readyz` na URL pública.
3. **Jornada 1 (Importação):** Upload de XML válido na interface web de produção.
4. **Jornada 2 (Captura Mobile):** Envio de comprovante fotográfico pelo motorista na aplicação responsiva (com observação do comportamento de *cold start* em até 10 s com tela de carregamento).
5. **Jornada 3 (Conferência):** Validação lado a lado e encerramento do ciclo da entrega pelo conferente.
6. **Auditoria de Custos:** Apresentação do painel de faturamento com teto acumulado de até **US$ 12**.

---

## 4. Histórico de Revisões Semanais do Backlog

### Revisão 01 — Semana 3 (Registrado em 21/10/2026)
* **O que mudou:** Inclusão formal das restrições de parser de XML e validação rigorosa de chaves de 44 dígitos.
* **Motivo:** Adequação aos requisitos de segurança contra ataques de XXE e padronização do contrato de importação exigidos pelo Caderno B2B.

### Revisão 02 — Semana 4 (Registrado em 28/10/2026)
* **O que mudou:** Elevação dos requisitos de isolamento por tenant e papéis para o escopo principal de testes obrigatórios (CT-23 a CT-27).
* **Motivo:** Garantir a conformidade absoluta com as regras de segurança *deny-all* do Firestore e Storage exigidas para a entrega do Checkpoint 2.

### Revisão 03 — Semana 6 (Registrado em 08/11/2026)
* **O que mudou:** Incorporação da US-07 (Jornada de Nuvem, Lifecycle de Bucket e Alertas do Cloud Monitoring) e ajuste do escopo para o ambiente de produção em nuvem.
* **Motivo:** Atendimento direto às diretrizes do Guia do Checkpoint 3 para migração do ambiente local para a infraestrutura serverless na nuvem.