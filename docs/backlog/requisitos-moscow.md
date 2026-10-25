# Backlog MoSCoW e Critérios Mensuráveis

Este documento consolida a priorização de escopo do **Entrega Prova** utilizando a metodologia **MoSCoW** (*Must have*, *Should have*, *Could have*, *Won't have*), acompanhada das métricas de aceitação e histórias de usuário para o ciclo de desenvolvimento do MVP.

---

## 1. Priorização MoSCoW

| Categoria | ID | Requisito / Funcionalidade | Justificativa de Negócio |
| :--- | :--- | :--- | :--- |
| **Must have**<br>(Obrigatório para o MVP) | **REQ-01** | Ingestão e parsing seguro de XML de NF-e/CT-e | Entrada indispensável para registrar as entregas e chaves fiscais de 44 dígitos no sistema. |
| | **REQ-02** | Captura de foto do canhoto e metadados via PWA mobile | Garante a coleta digital do comprovante na ponta pelo motorista sem fricção de instalação de app nativo. |
| | **REQ-03** | Painel de conferência lado a lado (Foto vs. Dados Fiscais) | Permite ao conferente validar visualmente o documento e alterar o status (Aprovada/Rejeitada). |
| | **REQ-04** | Mitigação de vulnerabilidades XXE e idempotência no upload | Requisitos obrigatórios de segurança e integridade técnica para evitar injeções e arquivos duplicados. |
| | **REQ-05** | Painel de pendências e *aging* por embarcador | Viabiliza o controle do tempo de atraso dos comprovantes e priorização de cobrança por cliente. |
| | **REQ-06** | Geração do pacote digital de comprovação para faturamento | Exportação consolidada dos dados fiscais com a imagem validada, pronta para envio ao cliente pagador. |
| **Could have**<br>(Desejável se houver folga) | **REQ-07** | Notificação de rejeição de canhoto via webhook ou e-mail | Avisa a equipe de operações imediatamente quando um comprovante for recusado por ilegibilidade. |
| | **REQ-08** | Filtros avançados na listagem de entregas por valor e data | Melhora a usabilidade do backoffice em lotes com grande volume de notas fiscais. |
| **Won't have**<br>(Fora do Escopo do Ciclo) | **REQ-09** | Reconhecimento Óptico de Caracteres (OCR) no canhoto | Complexidade elevada e dependência de serviços pagos ou instáveis; a conferência no MVP é humana/visual. |
| | **REQ-10** | Aplicativo nativo empacotado para Android/iOS | Vetado pelas diretrizes do MVP para eliminar atrito de download e taxas de lojas de aplicativos. |
| | **REQ-11** | Consulta online direta aos Web Services da SEFAZ | Não homologada no escopo para manter o fluxo independente de certificados digitais e latências estaduais. |
| | **REQ-12** | Rastreamento GPS contínuo e roteirização | Foco estrito em logística documental e faturamento, sem expansão para telemetria de veículos. |

---

## 2. Critérios Mensuráveis de Sucesso (DoD & Métricas)

Para que uma funcionalidade seja aceita no projeto, ela deve satisfazer critérios técnicos e operacionais verificáveis:

| ID | Indicador / Critério | Alvo Mensurável | Método de Verificação |
| :--- | :--- | :--- | :--- |
| **MTR-01** | **Tempo de Ingestão de XML** | Processamento e persistência em $\le 1.5\text{ s}$ | Teste automatizado de carga local e log de Cloud Function. |
| **MTR-02** | **Taxa de Integridade Fiscal** | 100% de validação da chave de 44 dígitos (Módulo 11) | Testes unitários com massa sintética de chaves válidas e corrompidas. |
| **MTR-03** | **Tamanho de Payload Mobile** | Imagens enviadas com tamanho $\le 1\text{ MB}$; arquivo acima de 1 MB é rejeitado | Teste com imagens de 0,9 MB (aceita), 1 MB (aceita) e 1,1 MB (rejeitada); inspeção na Network tab. |
| **MTR-04** | **Lead Time de Comprovação (Demo)** | Redução do ciclo de dias para $\le 3\text{ minutos}$ no teste ponta a ponta | Cronometragem do fluxo: Ingestão XML $\rightarrow$ Foto Mobile $\rightarrow$ Conferência $\rightarrow$ Pacote. |
| **MTR-05** | **Custo Operacional de Nuvem** | Faturamento de US$ 0,00 no Google Cloud | Painel do Google Cloud Billing com Budget Alert ativo e sem desvio do Free Tier. |
| **MTR-06** | **Validação do Tamanho do Arquivo** | 100% dos uploads acima de 1 MB rejeitados com mensagem de erro clara | Testes automatizados com arquivos nos limites (valor-limite). |
| **MTR-07** | **Rejeição de Chave de Acesso Inválida** | Chaves com 43 ou 45 dígitos são rejeitadas; só 44 dígitos válidos (Módulo 11) são aceitos | Testes unitários com chaves de 43, 44 e 45 dígitos. |
| **MTR-08** | **Desempenho do Painel de Aging** | Painel carrega com 1.000 entregas em até 3 segundos | Seed de 1.000 entregas no emulador e medição do tempo de carga no navegador. |
---

## 3. Histórias de Usuário (User Stories)

### US-01: Ingestão de Cargas via XML
* **Como:** Conferente de Faturamento (Juliana).
* **Quero:** Fazer upload de arquivos XML de NF-e/CT-e no painel web.
* **Para:** Criar as entregas pendentes automaticamente no sistema sem ter que digitar dados fiscais manualmente.
* **Critérios de Aceite:**
  1. O sistema deve aceitar arquivos com extensão `.xml` e formato NF-e v4.00.
  2. O parser deve extrair número da nota (`nNF`), chave de acesso (44 dígitos), emitente e destinatário.
  3. Tentativas de envio de XMLs com entidades externas (ataque XXE) devem ser bloqueadas com erro HTTP 400.
  4. O registro deve ser salvo com o status inicial `"PENDENTE"`.
  5. Chaves de acesso com 43 ou 45 dígitos devem ser rejeitadas com erro de validação, e apenas chaves de 44 dígitos válidas (Módulo 11) são aceitas.

---

### US-02: Captura do Canhoto no Destino
* **Como:** Motorista de Transporte (Seu Carlos).
* **Quero:** Acessar a página web no meu celular, tirar uma foto do canhoto assinado e preencher quem recebeu.
* **Para:** Comprovar a entrega na hora e não precisar guardar e prestar contas do papel físico no fim do mês.
* **Critérios de Aceite:**
  1. O botão de upload deve acionar a câmera nativa do smartphone sem exigir instalação de aplicativo.
  2. O formulário deve obrigar o preenchimento do nome do recebedor e documento (RG ou CPF).
  3. A data e a hora do envio devem ser registradas automaticamente pelo sistema.
  4. Caso o motorista clique duas vezes em enviar, o sistema deve manter apenas um registro (idempotência).
  5. Imagens com tamanho acima de 1 MB devem ser rejeitadas, com mensagem informando o limite ao motorista.

---

### US-03: Conferência Visual e Conciliação
* **Como:** Conferente de Faturamento (Juliana).
* **Quero:** Ver lado a lado a foto do canhoto e os dados extraídos da nota fiscal correspondente.
* **Para:** Validar se a assinatura, o carimbo e o nome do recebedor conferem antes de autorizar a cobrança.
* **Critérios de Aceite:**
  1. A tela deve permitir zoom e rotação básica na foto do canhoto.
  2. A interface deve oferecer dois botões principais: **Aprovar** e **Rejeitar**.
  3. Ao rejeitar, deve ser obrigatório selecionar ou digitar o motivo (ex.: "Canhoto ilegível", "Assinatura ausente").
  4. A alteração de status deve refletir em tempo real na lista de entregas.
  5. O painel deve carregar 1.000 entregas em até 3 segundos.


---

### US-04: Painel de Aging de Pendências
* **Como:** Gerente Financeiro / Operacional.
* **Quero:** Visualizar um relatório das entregas agrupadas por embarcador e classificadas pelo tempo de atraso.
* **Para:** Cobrar motoristas sobre comprovantes não enviados e evitar que faturas de frete percam o prazo contratual.
* **Critérios de Aceite:**
  1. A tabela deve agrupar entregas em faixas de tempo: *0 a 3 dias*, *4 a 7 dias* e *mais de 7 dias*.
  2. Entregas com mais de 5 dias pendentes devem ter destaque visual (tag amarela/vermelha).
  3. Deve ser possível filtrar pendências por nome do embarcador (remetente).

---

### US-05: Emissão do Pacote de Comprovação
* **Como:** Conferente de Faturamento (Juliana).
* **Quero:** Exportar um arquivo consolidado contendo a imagem do canhoto e o resumo dos dados da entrega aprovada.
* **Para:** Anexar à fatura de cobrança enviada ao cliente pagador do frete.
* **Critérios de Aceite:**
  1. O sistema deve gerar um documento PDF ou arquivo compactado contendo os dados fiscais e a foto nítida.
  2. Apenas entregas com status `"APROVADA"` podem ter seus pacotes de faturamento gerados.
  3. O pacote gerado deve conter a chave de acesso impressa para auditoria externa.

---

### US-06: Visualização das Próprias Entregas
* **Como:** Motorista de Transporte (Seu Carlos).
* **Quero:** Visualizar na minha lista apenas as entregas atribuídas a mim.
* **Para:** Encontrar rápido as entregas em que preciso enviar o canhoto, sem confundir com as de outros motoristas e sem expor dados de terceiros.
* **Critérios de Aceite:**
  1. A listagem do motorista deve retornar somente as entregas vinculadas ao identificador do usuário autenticado.
  2. Ao tentar abrir, por link ou ID, uma entrega de outro motorista, o sistema deve negar o acesso (HTTP 403 ou 404) sem revelar nenhum dado dela.
  3. A restrição deve ser aplicada no servidor (API e regras de segurança do banco), e não apenas escondida na interface.
  4. O motorista não deve ver dados de faturamento nem de outros embarcadores além do necessário para a entrega (nome do recebedor e dados da NF-e da própria carga).
  5. Um motorista sem entregas atribuídas deve ver uma mensagem de lista vazia, e não um erro.
