# Backlog do Produto e Requisitos (MoSCoW)

Este documento centraliza o Product Backlog do **EntregaProva**: histórias de usuário, prioridade MoSCoW, critérios de aceite com número ou resultado testável e o histórico de revisões. Ele descreve a arquitetura de custo zero confirmada no [ADR 008](../arquitetura/adrs/008_Arquitetura%20de%20Deploy.md): frontend no Firebase Hosting, API no Render, Firebase Auth e Firestore, e imagens no Supabase Storage, tudo em plano gratuito e sem cartão.

---

## 1. Visão geral (MoSCoW)

| ID | Funcionalidade | Prioridade | Descrição resumida |
| :--- | :--- | :--- | :--- |
| **US-01** | Importação de XML | **Must** | Admin importa XML de NF-e/CT-e (versão 4.00, até 1 MB) e gera a entrega pendente. |
| **US-02** | Captura mobile | **Must** | Motorista captura o comprovante pelo celular, com compressão e reenvio idempotente. |
| **US-03** | Conferência do comprovante | **Must** | Conferente ou Admin aprova ou rejeita o comprovante, com motivo obrigatório na rejeição. |
| **US-04** | Painel de aging | **Must** | Pendências por faixa de dias e valor retido por embarcador. |
| **US-05** | Pacote de comprovação | **Must** | Geração assíncrona do pacote de cobrança, com resumo e manifesto de hashes SHA-256. |
| **US-06** | Escopo do motorista e isolamento | **Must** | Motorista vê só as próprias entregas; uma empresa nunca acessa dados de outra. |
| **US-07** | Retenção, monitoramento e custo zero | **Must** | Descarte de imagens com mais de 60 dias, aviso de indisponibilidade e gasto de US$ 0. |
| **WN-01** | OCR do canhoto | **Won't** | Fora do MVP. A conferência é visual. |
| **WN-02** | Rastreamento contínuo e roteirização | **Won't** | Fora do MVP. |
| **WN-03** | Consulta à SEFAZ | **Won't** | Fora do MVP. A validação usa só a chave de 44 dígitos. |
| **WN-04** | Assinatura ICP-Brasil | **Won't** | Fora do MVP. |
| **WN-05** | Modo offline completo | **Won't** | Fora do MVP. Só há reenvio manual após queda de rede (US-02). |

> Não há histórias Should nem Could neste momento. Se o time decidir incluir alguma, registre aqui e crie uma revisão na seção 4.

---

## 2. Detalhamento e critérios de aceite

### US-01 — Importação de XML de NF-e e CT-e

**Como** Administrador, **quero** importar o XML de uma nota fiscal ou de um conhecimento de transporte, **para** criar a entrega pendente de forma idempotente.

* **CA01:** arquivo maior que 1.048.576 bytes (1 MB) é rejeitado com HTTP `413` (`ERR_XML_TOO_LARGE`), sem passar pelo parser.
* **CA02:** arquivo com `<!DOCTYPE` ou `<!ENTITY` é rejeitado com HTTP `400` (`ERR_XML_DTD_FORBIDDEN`).
* **CA03:** só são aceitos XMLs de NF-e (modelo 55) e CT-e (modelo 57) na versão `4.00`. Outras versões retornam `422`.
* **CA04:** a chave de 44 dígitos é validada pelo dígito verificador (Módulo 11). Chave inválida retorna `422` (`ERR_KEY_CHECK_DIGIT`).
* **CA05:** importar a mesma chave duas vezes no mesmo tenant retorna `409` (`ERR_DUPLICATE_IMPORT`).

### US-02 — Captura mobile do comprovante

**Como** Motorista autenticado, **quero** fotografar o canhoto pela câmera do celular, **para** enviar o comprovante com segurança e em tamanho adequado.

* **CA01:** o campo de upload abre preferencialmente a câmera traseira (`capture="environment"`).
* **CA02:** a imagem é comprimida no navegador para no máximo 1280 px no lado maior e cerca de 300 KB (JPEG ou WebP). Upload acima de 300.000 bytes retorna `413`.
* **CA03:** o envio usa `Idempotency-Key` (UUID gerado na captura). Vários envios com a mesma chave registram só 1 comprovante.
* **CA04:** em queda de rede, a tela mostra um alerta (`role="alert"`) e o botão "Tentar de novo", que reenvia a mesma imagem sem nova foto.

### US-03 — Conferência lado a lado

**Como** Conferente ou Administrador, **quero** ver os dados da nota ao lado da foto do comprovante, **para** aprovar ou rejeitar com rapidez.

* **CA01:** a entrega pode passar de `COMPROVANTE_ENVIADO` para `CONFERIDA`.
* **CA02:** ao rejeitar, o motivo é obrigatório (sem motivo, HTTP `400`). A entrega vai para `REJEITADA` e o motorista pode reenviar.
* **CA03:** transição fora da máquina de estados retorna `409` (`ERR_INVALID_TRANSITION`).

### US-04 — Painel de aging e pendências

**Como** Gestor Financeiro ou Administrador, **quero** um painel com faixas de atraso e valores retidos por embarcador, **para** priorizar cobranças.

* **CA01:** as entregas são agrupadas em quatro faixas, contadas em dias corridos a partir de `pendenteDesde`: 0 a 3, 4 a 7, 8 a 15 e mais de 15 dias.
* **CA02:** o painel responde em até 2 segundos com a massa de teste consolidada.

### US-05 — Pacote de comprovação

**Como** Gestor Financeiro, **quero** gerar um pacote de comprovação por embarcador e período, **para** anexar ao faturamento do frete.

* **CA01:** a solicitação retorna `202 Accepted` com o identificador do pacote.
* **CA02:** o pacote contém um relatório resumo, as fotos nomeadas pela chave de 44 dígitos e o `manifesto.json` com o SHA-256 de cada arquivo.

### US-06 — Escopo do motorista e isolamento por empresa

**Como** Motorista autenticado, **quero** ver apenas as entregas ligadas ao meu perfil (`motoristaId === uid`), **para** manter a privacidade da operação.

* **CA01:** listar ou detalhar entregas de outro motorista retorna `403`.
* **CA02:** um usuário da empresa A que acessa dados da empresa B recebe `403` ou `404`. O `tenantId` vem sempre do token, nunca do corpo da requisição.

### US-07 — Retenção de imagens, monitoramento e custo zero

**Como** Administrador e responsável pela infraestrutura, **quero** descartar automaticamente imagens antigas, ser avisado quando a API sair do ar e manter o gasto em US$ 0, **para** cumprir a LGPD e o teto de custo sem cartão de crédito.

* **CA01 (retenção):** um job agendado remove, pela API do Supabase Storage, as imagens com mais de 60 dias. Em teste com arquivos de 59 e de 61 dias, só o de 61 é removido, e uma segunda execução não gera erro.
* **CA02 (monitoramento):** `/healthz` e `/readyz` respondem `200` com JSON. O health check do Render e o UptimeRobot (plano gratuito) monitoram `/healthz` e avisam quando ele falha.
* **CA03 (custo):** nenhum cartão está cadastrado em Render, Supabase ou Firebase (plano Spark). Cada checkpoint tem um print do painel de uso de cada plataforma, e o gasto acumulado é US$ 0.
* **CA04 (limites gratuitos):** a API é acordada antes de cada demonstração (cold start de cerca de 1 minuto), o Supabase recebe uma requisição periódica para não pausar após 7 dias sem uso, e o uso do Storage fica abaixo de 1 GB.

> Os números do CA02 e do CA04 e o local onde o job do CA01 roda ainda precisam de confirmação do time. Ajuste o texto quando forem definidos.

---

## 3. Roteiro de demonstração — custo zero

Tudo roda em plano gratuito. Nenhuma etapa usa Cloud Run, Cloud Monitoring ou faturamento.

1. **Preparação (antes da demo):** acordar a API acessando `/healthz`, porque o cold start do Render Free leva cerca de 1 minuto. Confirmar que o projeto Supabase está ativo.
2. **A dor (30 s):** baseline de 14 dias de atraso no recebimento de canhotos físicos, com base nas entrevistas com transportadoras.
3. **Pipeline e preview (60 s):** abrir um Pull Request, mostrar o CI verde e o link do canal de preview no Firebase Hosting.
4. **Deploy na `main` (30 s):** mostrar o merge disparando o deploy da API no Render por deploy hook, a verificação do SHA publicado e, depois dela, a publicação do frontend no Firebase Hosting.
5. **Jornada de ponta a ponta na URL pública (90 s):**
   * Admin importa um XML válido e um XML malicioso, que é bloqueado.
   * Motorista captura o comprovante pelo celular e reenvia sem duplicar.
   * Conferente aprova na tela lado a lado.
6. **Aging e pacote (60 s):** painel de pendências por faixa de dias e geração do pacote com o `manifesto.json`.
7. **Retenção (30 s):** executar o job de limpeza com uma imagem de teste de 61 dias e mostrar que ela some e a de 59 dias fica.
8. **Custo zero e saúde (30 s):** `/healthz` e `/readyz` com `200`, o alerta do UptimeRobot e os prints dos painéis de uso mostrando US$ 0.

---

## 4. Histórico de revisões

### Revisão 01 — 21/10/2026 (fim da Semana 3)
* **O que mudou:** consolidação inicial das histórias US-01 a US-03, com critérios numéricos.
* **Motivo:** garantir que importação, captura e conferência tivessem critérios claros antes da implementação local.

### Revisão 02 — 28/10/2026 (fim da Semana 4)
* **O que mudou:** inclusão de US-04 e US-05 como Must e da US-06 (escopo do motorista e isolamento por tenant).
* **Motivo:** alinhamento com as fichas da fase das Semanas 5 e 6 e com as diretrizes do tutor.

### Revisão 03 — 09/11/2026 (Semana 5 / início da Semana 6)
* **O que mudou:** inclusão da US-07 como requisito do Checkpoint 3.
* **Motivo:** cobrir retenção de imagens e monitoramento para o deploy de 15/11.

### Revisão 04 — 19/11/2026
* **O que mudou:** backlog reescrito em um único documento, sem Cloud Run. A US-07 e o roteiro da demo passaram para a versão custo zero (Render, Firebase e Supabase). Foram registradas as histórias Won't WN-01 a WN-05.
* **Motivo:** o ADR 008 confirmou a arquitetura efetivamente construída e substituiu o ADR 007, e a equipe não terá faturamento vinculado.
