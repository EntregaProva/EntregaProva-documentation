# Matriz de Rastreabilidade

Mapeamento dos requisitos do backlog, critérios de aceite e cobertura atual dos testes automatizados.

**Última rodada:** 17/11/2026, de 00:14:30 a 00:14:49, no repositório do código · branch `quality-assurance` (PR #18) · Vitest 5.1.0 com Auth, Firestore e Storage emulados (`npm run test:emulator`).

| Execução | Resultado |
| :--- | :--- |
| `npm run test:smoke` | 5 testes aprovados, sem falhas |
| `npm run test:emulator` | 13 arquivos aprovados; 153 testes aprovados e 1 `todo`, total de 154 casos registrados |
| Cobertura global de linhas, segundo `check-coverage.mjs` | 90,02% — 523/581 linhas; mínimo de 60% |
| Cobertura de linhas do domínio, segundo `check-coverage.mjs` | 95,80% — 319/333 linhas; mínimo de 80% |
| Códigos de saída das duas execuções | 0 |
| Códigos de gravação dos dois logs | 0 |

Ambiente local: Node v24.20.0, npm 11.19.0, Java Temurin 25.0.4 e Vitest 5.1.0, com Auth, Firestore e Storage emulados no projeto `demo-entregaprova`. O CI configura Java 21; esta rodada local não reproduz exatamente essa versão.

Os cinco testes de scripts executados por `test:smoke` são contabilizados separadamente do Vitest. Não representam uma nova execução contra a API publicada.

Evidências desta rodada: geradas localmente no repositório do código em `backend/evidencias-qa/suite-20261117-001430-9OemmI/`, incluindo `ambiente.log`, `smoke.log`, `suite.log`, `resultado.log`, `junit.xml` e relatórios de cobertura. 

Anexos versionados desta rodada:

- [Ambiente e commit da execução](relatorios-teste/evidencias-qa/suite-20261117-001430/ambiente.log)
- [Resultados e códigos de saída](relatorios-teste/evidencias-qa/suite-20261117-001430/resultado.log)
- [Log dos testes de scripts](relatorios-teste/evidencias-qa/suite-20261117-001430/smoke.log)
- [Log da suíte com emuladores](relatorios-teste/evidencias-qa/suite-20261117-001430/suite.log)
- [Relatório JUnit](relatorios-teste/evidencias-qa/suite-20261117-001430/junit.xml)
- [Resumo de cobertura](relatorios-teste/evidencias-qa/suite-20261117-001430/coverage-summary.json)

Os caminhos de arquivos de teste nas tabelas são relativos a `backend/tests/` do repositório do código. Os IDs CT representam cenários rastreados e não correspondem necessariamente a uma chamada `it` ou a um único teste executado.

Legenda de status:

- OK: cenário automatizado aprovado na rodada identificada, dentro do escopo das asserções descritas.
- Pendente (`todo`): caso registrado, mas ainda não implementado como teste executável.
- Planejado: verificação ainda não executada ou sem evidência suficiente.
- Aprovado por relato: execução manual relatada, sem evidências suficientes para reprodução independente.

Os resultados automatizados desta rodada não representam aprovação integral da interface, do ambiente publicado ou do checkpoint.

## 1. Cobertura detalhada por funcionalidade

### Importação e validação de NF-e (REQ-01, REQ-04 / US-01)

| Critério / Regra | Caso | Cenário testado | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- |
| CA1 · Layout NF-e 4.00 | CT-01 | Importação de XML válido pela API retorna `201` | `unit/importacao-nfe.test.ts` | OK |
| CA1 · Extensão `.xml` | CT-02 | Rejeita arquivos que não sejam `.xml` | `unit/importacao-nfe.test.ts` | Pendente (a API recebe só o payload; validação fica no front) |
| CA1 · Versão 4.00 | CT-03 | Aceita nota na versão 4.00 | `unit/importacao-nfe.test.ts` | OK |
| CA1 · Versão incompatível | CT-04 | Rejeita versões diferentes da 4.00 com `422` | `unit/importacao-nfe.test.ts` | OK |
| CA1 · Formatos de XML | CT-28 | Aceita tanto a nota pura quanto a processada (`nfeProc`) | `api.test.ts` | OK |
| CA2 · Extração de campos | CT-05 | Extrai número da nota (`nNF`), chave de acesso, emitente e destinatário | `unit/importacao-nfe.test.ts` | OK |
| CA2 · XML corrompido | CT-06 | Rejeita XML malformado com `422` | `unit/importacao-nfe.test.ts` | OK |
| CA3 / REQ-04 · Proteção XXE | CT-07 | Rejeita XML com entidade externa com status `400` e verifica ausência de `root:` na mensagem de erro | `unit/importacao-nfe.test.ts` | OK no reteste de 17/11; BUG-002 resolvido |
| CA3 / REQ-04 · Proteção XXE | CT-31.1, 31.2 | Rejeita DTD com entidade externa ou `ENTITY` solta sem refletir o conteúdo no erro | `api.test.ts` | OK |
| CA4 · Status inicial | CT-08 | Cria a entrega com status `PENDENTE` | `unit/importacao-nfe.test.ts` | OK |
| CA4 · Duplicidade | CT-32 | Grava em `tenants/{tenant}/deliveries/{chave44}` e barra reimportação com `409` | `api.test.ts` | OK |
| CA5 / MTR-07 · Tamanho da chave | CT-09, CT-12 | Rejeita chaves com 43 ou 45 dígitos | `unit/nfe-chave.test.ts` | OK |
| CA5 / MTR-02 · Módulo 11 | CT-10, CT-11 | Aceita chave de 44 dígitos com DV válido e rejeita quando o DV não bate | `unit/nfe-chave.test.ts` | OK |
| CA5 · Formato da chave | CT-13 | Rejeita chaves com caracteres não numéricos | `unit/nfe-chave.test.ts` | OK |
| CA5 · Consistência do DV | CT-31.3, 31.4 | Barra no parser chaves com DV inválido ou divergente da tag `cDV` | `api.test.ts` | OK |
| REQ-04 · Limite de 1 MiB | CT-29, CT-30 | Aceita até exatos 1 MiB (contado em bytes UTF-8) e rejeita 1 byte acima com `413` | `api.test.ts` | OK |
| REQ-04 · Payload excessivo | CT-33 | Rejeita XML acima do limite via HTTP (`413`) sem gravar nada no banco | `api.test.ts` | OK |

### Upload do comprovante de entrega (REQ-02 / US-02)

| Critério / Regra | Caso | Cenário testado | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- |
| CA5 / MTR-06 · Limite de 300 KB | CT-17.1 | Aceita imagem com exatamente 300.000 bytes (`200`) | `api.test.ts` | OK |
| CA5 / MTR-06 · Limite de 300 KB | CT-17.2 | Rejeita imagem com 300.001 bytes (`413`) sem chamar o salvamento do arquivo | `api.test.ts` | OK no reteste de 17/11; BUG-003 resolvido |
| LGPD · Dados do recebedor | CT-37.1 | Não persiste documento pessoal do recebedor | `api.test.ts` | OK |
| Acesso ao arquivo | CT-37.2 | Gera URL assinada v4 (somente leitura) com expiração de 15 minutos | `api.test.ts` | OK |
| CA4 · Proteção contra sobrescrita | CT-37.3 | Só grava no Storage se o arquivo ainda não existir | `api.test.ts` | OK |
| CA4 · Idempotência no reenvio | CT-37.4 | Repetir a mesma requisição retorna `200` sem subir o arquivo de novo | `api.test.ts` | OK |
| CA4 · Conflito de idempotência | CT-38 | Rejeita com `409` o reuso da mesma chave para um arquivo diferente | `api.test.ts` | OK |
| CA4 · Escopo da chave | CT-39 | Isola a chave de idempotência por tenant | `api.test.ts` | OK |
| Validação de entrada | CT-40.1, 40.2 | Exige cabeçalho de idempotência (`400`) e recusa arquivos que não sejam imagem (`415`) | `api.test.ts` | OK |
| CA4 · Upload simultâneo | CT-41 | Bloqueia com `409` um segundo envio enquanto o primeiro ainda está em andamento | `api.test.ts` | OK |
| CA4 · Retentativa após falha | CT-42, CT-43 | Se o upload funcionou mas a resposta caiu ou a assinatura da URL falhou, a retentativa conclui sem reenviar o arquivo | `api.test.ts` | OK |

### Conferência do comprovante (REQ-03 / US-03)

| Critério / Regra | Caso | Cenário testado | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- |
| Pré-condição | CT-44.1 | Impede a conferência de entregas que ainda não têm comprovante (`409`) | `api.test.ts` | OK |
| Validação de payload | CT-44.2 | Retorna `400` se o formato da decisão for inválido | `api.test.ts` | OK |
| CA3 · Rejeição justificada | CT-44.3 | Exige o motivo quando o comprovante é rejeitado (`400`) | `api.test.ts` | OK |
| Ciclo de reenvio | CT-44.4 | Permite enviar novo comprovante e aprovar a entrega após uma rejeição | `api.test.ts` | OK |

### Controle de acesso e isolamento multi-tenant (REQ-07, ADR 006 / US-06)

| Critério / Regra | Caso | Cenário testado | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- |
| Exigência de token | CT-20.1 a 20.5 | Sem token retorna `401` na leitura, no envio de comprovante e na conferência; token vencido ou não reconhecido retorna `401` na leitura | `security/tenant-isolation.test.ts` | OK |
| US-06 CA2 / MTR-09 · Escopo do motorista | CT-21.1, 21.2 | Motorista tentando ler ou enviar comprovante de entrega alheia recebe `403` sem alterar dados | `security/tenant-isolation.test.ts` | OK |
| REQ-01, REQ-03, ADR 006 · Alçada por papel | CT-21.3 a 21.6 | Motorista não confere entregas nem importa XML; operador não envia comprovante (`403`) | `security/tenant-isolation.test.ts` | OK |
| Isolamento entre empresas | CT-22.1 a 22.3 | Acesso a entregas de outro tenant retorna `404` (leitura, comprovante e conferência) | `security/tenant-isolation.test.ts` | OK |
| US-06 · Consulta unitária | CT-22.4, 22.5 | Operador consulta entregas do seu tenant; motorista consulta as próprias (apenas busca por ID) | `security/tenant-isolation.test.ts` | OK |
| Origem do tenant | CT-47 | Ignora o header `x-tenant-id` e considera apenas o `tenantId` do token (`404`) | `security/tenant-isolation.test.ts` | OK |
| ADR 006 · Validação de claims | CT-48.1 a 48.4 | Barra no middleware (`403`, sem ir ao banco) tokens sem `tenantId`, sem `role`, com papel desconhecido ou tentativa de path traversal | `security/tenant-isolation.test.ts` | OK |
| US-06 CA3 · Bloqueio de acesso direto ao Firestore | CT-23 a CT-27 | Regras do Firestore negam leitura, listagem, criação, edição e exclusão diretas pelo cliente (anônimo ou autenticado) | `security/firestore-rules.test.ts` | OK |

### Segurança da API, observabilidade e rotas legadas

| Critério / Regra | Caso | Cenário testado | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- |
| CORS · Bloqueio de origens | CT-18 | Não envia `Access-Control-Allow-Origin` para a origem não autorizada exercitada no teste | `api.test.ts` | OK no reteste de 17/11; BUG-004 resolvido |
| CORS · Origens permitidas | CT-19 | retorna `204` e a origem correspondente para Hosting, frontend local e preview exercitados com configuração de teste | `api.test.ts` | OK |
| Logs e privacidade | CT-45.1, 45.2 | Erros inesperados retornam `500` genérico e os logs omitem dados sensíveis | `api.test.ts` | OK |
| Health check | CT-34 | Rota de health responde `200` sem depender de autenticação, Firestore ou Storage | `api.test.ts` | OK |
| Readiness check | CT-35, CT-36 | Rota de readiness testa leitura leve no banco e retorna `503` (sem expor detalhes internos) se falhar ou der timeout | `api.test.ts` | OK |
| Retrocompatibilidade | CT-46 | Mantém funcionando as rotas antigas `/deliveries/:id/proof` e `/check` | `api.test.ts` | OK |

### Listagem de entregas (REQ-07 / US-06)

| Critério / Regra | Caso | Cenário testado | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- |
| CA1 · Listagem do operador | CT-14 | Operador consulta com filtro de status e limite de dois itens, percorre duas páginas por cursor e recebe cursor nulo ao final | `integration/deliveries.test.ts` | OK |
| CA1 · Listagem do motorista | CT-15 | Operador e motorista responsável recebem a entrega, outro motorista e outro tenant recebem coleção vazia | `integration/deliveries.test.ts` | OK |
| CA5 · Lista vazia | CT-16 | Sem entregas, a API retorna `200`, JSON com `itens: []` e `proximoCursor: null` | `contract/delivery-list.test.ts` | OK para a API |

## 2. Resumo por requisito

| Requisito | História | O que já está coberto | O que falta / Observações |
| :--- | :--- | :--- | :--- |
| **REQ-01** · Ingestão de XML | US-01 | Importação, validações e extração de número, chave, emitente e destinatário. | CT-02 permanece `todo`; falta comprovar a validação da extensão no frontend. |
| **REQ-04** · Segurança no XML e idempotência | US-01 (CA3) | Rejeição de XXE, limite de tamanho e bloqueio de duplicatas. CT-07 aprovado com status `400`. | BUG-002 resolvido no reteste de 17/11. |
| **REQ-02** · Captura do canhoto | US-02 | Idempotência, concorrência, recuperação e limite de 300.000 bytes por foto. | BUG-003 resolvido no reteste de 17/11. Tela e compressão no cliente exigem evidências próprias. |
| **REQ-03** · Conferência | US-03 | Motivo obrigatório na rejeição pela API, alçadas de acesso, rejeição, reenvio, aprovação e consulta posterior do estado na integração emulada. | A comparação visual entre comprovante e XML exige rastreabilidade e evidências próprias da jornada manual. |
| **REQ-07** · Visão restrita do motorista | US-06 | Isolamento por ID, restrições de escrita, regras do Firestore, listagem por usuário/tenant, paginação e contrato de lista vazia. | BUG-005 resolvido quanto à ausência do endpoint. A mensagem visual de lista vazia não é verificada pelos testes de API. |
| **REQ-06** · Pacote de comprovação | US-05 | Geração, conteúdo e integridade do ZIP, autorização, validações, tratamento de falhas e recuperação, conforme CT-QA-PAC-01 a CT-QA-PAC-12. | Geração no ambiente publicado não comprovada ainda na rodada atual(dia 17/11). |
| **REQ-05** · Painel de aging | US-04 | Sem cobertura na revisão feita hoje (dia 17/11). | Verificação pendente. |

### Cobertura complementar e origem das evidências

Os códigos com prefixo `CT-QA-` foram criados apenas para organizar nesta tabela os cenários que ainda não tinham ID na documentação. Eles não são testes novos no código e não entram na contagem total da suíte.

Os testes automatizados locais abaixo rodaram em 17/11/2026. Os testes manuais e os registros antigos do ambiente publicado estão identificados separadamente.

### Cadastro público no login

| Critério / Regra | Caso | Cenário testado | Arquivo / Evidência | Status |
| :--- | :--- | :--- | :--- | :--- |
| Autenticação e confirmação de e-mail | CT-QA-CAD-01 | Sem token retorna `401`; e-mail não confirmado retorna `422` e não grava claims | `contract/public-registration.test.ts` | OK |
| Papéis permitidos | CT-QA-CAD-02 | Aceita CPF com papel `driver` e CNPJ com `admin` ou `operator`; retorna `204`, grava role e tenant no formato esperado e salva o cadastro | `contract/public-registration.test.ts` | OK |
| Validação de entrada e vínculo | CT-QA-CAD-03 | Bloqueia CNPJ com papel `driver`, CPF inválido e tentativa de enviar tenant manualmente; retorna `400` sem gravar claims | `contract/public-registration.test.ts` | OK |
| Preservação de vínculo existente | CT-QA-CAD-04 | Conta já vinculada por outro fluxo recebe `409` e mantém as claims atuais | `contract/public-registration.test.ts` | OK |
| Recuperação após falha | CT-QA-CAD-05 | Se falhar ao gravar as claims, uma nova tentativa mantém o papel reservado originalmente e evita duplicar o registro | `contract/public-registration.test.ts` | OK |

Esses testes são de contrato e rodam com mocks. Eles não validam a tela de cadastro, o envio real de e-mail, a configuração de produção nem garantem que documentos pessoais deixaram de ser salvos em outras partes do banco.

### Jornada de conferência do comprovante contra o XML — S5–S6

| Critério / Regra | Caso | Cenário / Verificação | Arquivo / Evidência | Status |
| :--- | :--- | :--- | :--- | :--- |
| Importação e atribuição | CT-QA-JOR-01 | Importar XML e atribuir a entrega; tela mostra status pendente | Relatório v3, seção 5, teste manual de 13/11 | Relatado como OK; sem IDs ou prints |
| Envio do comprovante | CT-QA-JOR-02 | Motorista envia o comprovante; tela muda para aguardando conferência | Relatório v3, seção 5 | Relatado como OK; sem IDs ou prints |
| Conferência visual | CT-QA-JOR-03 | Operador compara a imagem com os dados fiscais e aprova | Relatório v3, seção 5 | Relatado como OK; sem evidência visual gravada |
| Rejeição sem motivo | CT-QA-JOR-04 | Tela impede rejeitar a entrega sem informar o motivo | Relatório v3, seção 5 | Relatado como OK; regra de API coberta à parte no CT-44.3 |
| Rejeição justificada | CT-QA-JOR-05 | Operador rejeita a entrega informando o motivo | Relatório v3, seção 5 | Relatado como OK |
| Reenvio | CT-QA-JOR-06 | Envio de novo comprovante volta a entrega para aguardando conferência | Relatório v3, seção 5 | Relatado como OK |
| Consulta da rejeição | CT-QA-JOR-07 | Motorista vê na tela o status rejeitado e o motivo | Relatório v3, seção 5 | Relatado como OK |
| Nova aprovação | CT-QA-JOR-08 | Operador confere o novo comprovante e aprova | Relatório v3, seção 5 | Relatado como OK |
| Ciclo automatizado de backend | CT-QA-JOR-09 | Teste emulado barra rejeição sem motivo, rejeita com motivo, reenvia, aprova e consulta o status final `CONFERIDO` com arquivo disponível | `integration/deliveries.test.ts` | OK; não cobre a comparação visual na tela |

Os textos de status exibidos na tela não garantem, sozinhos, que os valores batem com os enums internos do backend. Ainda precisamos rodar esse fluxo novamente usando IDs sintéticos, registrando a revisão do ambiente e salvando prints ou vídeo da jornada.

### Smoke e autorização no ambiente publicado

| Critério / Regra | Caso | Cenário / Verificação | Arquivo / Evidência | Status |
| :--- | :--- | :--- | :--- | :--- |
| Smoke pós-deploy | CT-QA-PUB-01 | Checagem de saúde e prontidão após o deploy, batendo a revisão esperada conforme descrito no relatório | Relatório v3, seção 3, histórico do pipeline | Validado no relatório; não rodou de novo na bateria local de 17/11 |
| Sem autenticação | CT-QA-PUB-02 | Listagem sem token retorna `401` | `scripts/verify-published.mjs`; log do reteste de 14/11 | OK no reteste de 14/11 |
| Token inválido | CT-QA-PUB-03 | Listagem com token inválido retorna `401` | Mesma evidência | OK no reteste de 14/11 |
| Listagem do operador | CT-QA-PUB-04 | Operador recebe `200` e a lista no formato esperado | Mesma evidência | OK no reteste de 14/11 |
| Listagem do motorista | CT-QA-PUB-05 | Motorista recebe `200` apenas com as entregas vinculadas ao token dele | Mesma evidência | OK no reteste de 14/11 |
| Entrega atribuída | CT-QA-PUB-06 | Motorista responsável consulta os detalhes da entrega com `200` | Mesma evidência | OK no reteste de 14/11 |
| Outro motorista | CT-QA-PUB-07 | Outro motorista tenta consultar os detalhes e recebe `403` | Mesma evidência | OK no reteste de 14/11 |
| Outro tenant | CT-QA-PUB-08 | Consulta de detalhes por outro tenant retorna `404` | Mesma evidência | OK no reteste de 14/11 |
| Papel proibido | CT-QA-PUB-09 | Motorista tenta conferir a entrega e recebe `403` | Mesma evidência | OK no reteste de 14/11 |
| Automação pós-deploy | CT-QA-PUB-10 | Pipeline gera tokens novos e roda os oito cenários contra a versão publicada | Workflow de deploy e autenticação do pipeline | Planejado; falta implementar e rodar |

Relatório: [QA — Checkpoint 3, v3](relatorios-teste/relatorio-v3.md).

Log do reteste de autorização de 14/11: [execução das 15:10](relatorios-teste/evidencias-qa/autorizacao-publicada-20261114-151037.log).

O reteste de 14/11 foi feito passando tokens manualmente, então ele ainda não comprova que a automação pós-deploy está funcionando sozinha no pipeline. Além disso, o script inclui um POST que deve ser negado (`403`), não sendo um teste apenas de leitura.

### Pacote de comprovação — REQ-06 / US-05

| Critério / Regra | Caso | Cenário testado | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- |
| Geração e conteúdo | CT-QA-PAC-01 | Criação retorna `202` (`PROCESSANDO`) e avança até `PRONTO`; ZIP final traz a foto, o manifesto e o resumo com a quantidade e o valor corretos | `contract/proof-package.test.ts` | OK |
| Integridade e privacidade | CT-QA-PAC-02 | Valida os bytes da foto e o SHA-256 dos arquivos no manifesto; garante que a resposta não vaza segredos nem caminhos internos e usa `no-store` no download | `contract/proof-package.test.ts` | OK |
| Autorização | CT-QA-PAC-03 | Criar pacote sem token retorna `401`; motorista recebe `403`; consulta por outro tenant retorna `404`; baixar arquivo sem permissão retorna `403` | `contract/proof-package.test.ts` | OK |
| Papel financeiro | CT-QA-PAC-04 | Usuário financeiro gera e consulta pacote do próprio tenant; outro tenant recebe `404`; rotas operacionais de entregas continuam bloqueadas | `contract/proof-package.test.ts` | OK |
| Link adulterado | CT-QA-PAC-05 | Assinatura alterada retorna `403`; o teste também envia data de expiração vencida, mas junto com a assinatura inválida | `contract/proof-package.test.ts` | OK para assinatura inválida; falta testar expiração isolada |
| Validação das entregas | CT-QA-PAC-06 | Recusa gerar pacote se houver entrega não conferida, data inválida, caminho de outro tenant, embarcador diferente, entrega inexistente ou fora do período | `contract/proof-package.test.ts` | OK |
| Arquivo removido ou alterado | CT-QA-PAC-07 | Baixar pacote após remoção da foto retorna `410`; se os bytes da foto mudarem, retorna `409` | `contract/proof-package.test.ts` | OK |
| Falhas de armazenamento | CT-QA-PAC-08 | Erro no download interno muda o status para `FALHOU`, sem expor detalhes internos da falha na resposta | `contract/proof-package.test.ts` | OK |
| Conteúdo e tamanho | CT-QA-PAC-09 | Falha quando o conteúdo do arquivo é inválido, o comprovante passa do limite ou o pacote final ultrapassa 20 MiB | `contract/proof-package.test.ts` | OK |
| Recuperação e concorrência | CT-QA-PAC-10 | Se a aplicação reiniciar com um trabalho preso (lease vencido), ela retoma o processamento sem baixar o arquivo duas vezes em chamadas simultâneas | `contract/proof-package.test.ts` | OK |
| Validação do pedido | CT-QA-PAC-11 | Parser barra requisições nulas, incompletas, sem entregas, com itens duplicados, formato incorreto ou datas inválidas | `contract/proof-package.test.ts` | OK |
| Integração com emuladores | CT-QA-PAC-12 | Importa XML, envia comprovante, aprova, gera pacote com perfil financeiro, valida bloqueios de acesso e baixa o ZIP conferindo foto e hash | `integration/deliveries.test.ts` | OK; assinatura do Storage mockada na fixture |

Os testes de contrato usam mocks e os de integração rodam nos emuladores (Auth, Firestore e Storage). Eles não garantem, sozinhos, que a geração de pacotes está funcionando no ambiente publicado.

### Lifecycle, retenção e operação

| Critério / Regra | Caso | Cenário testado / Verificação | Arquivo / Evidência | Status |
| :--- | :--- | :--- | :--- | :--- |
| Consulta após remoção | CT-QA-LIF-01 | Depois de simular a exclusão da foto, a consulta retorna `200` indicando arquivo indisponível, URL e expiração nulas, sem expor o caminho interno | `operations.test.ts` | OK |
| Retentativa após remoção | CT-QA-LIF-02 | Reenviar a mesma requisição idempotente após a remoção retorna `410`, não salva o arquivo de novo e mantém a entrega como `COMPROVADO` | `operations.test.ts` | OK |
| Proteções do script de retenção | CT-QA-LIF-03 | Teste do script passa na suíte; o título indica que ele roda em modo simulação por padrão, apaga fotos vencidas e para se a listagem falhar | `scripts/smoke.check.mjs`; `smoke.log` da rodada | OK na suíte de scripts; falta revisar as asserções internas do teste |
| Retenção real | CT-QA-LIF-04 | Confirmar se a rotina de retenção está configurada, agendada e rodando de fato na infraestrutura do projeto | Evidências de infra pendentes com DevOps | Planejado; o teste local com mock não cobre isso |
| Falha no armazenamento | CT-QA-OPE-01 | Se o upload falhar, retorna erro `500` genérico, mantém a entrega pendente e não cria registro nem arquivo órfão | `operations.test.ts` | OK |
| Validação de WebP | CT-QA-OPE-02 | Aceita imagem com assinatura WebP válida e recusa PDF renomeado com erro `415`, sem salvar nada | `operations.test.ts` | OK |
| Configuração de produção | CT-QA-OPE-03 | Testa a validação das variáveis de produção: bloqueia Auth Emulator, chave estática e identidade incompleta, exigindo credenciais válidas do Supabase para os comprovantes | `operations.test.ts` | OK na função validadora; não prova o que está configurado no servidor |

### Lacunas complementares de QA

- **Frontend:** definir e rodar a suíte e os CTs de interface, incluindo o CT-02 e a jornada visual S5–S6. Nesta rodada não houve validação automatizada de frontend.
- **Jornada manual:** rodar a bateria de novo usando IDs sintéticos, anotando ambiente e versão, e salvando prints ou vídeo como evidência.
- **Autorização publicada:** implementar o CT-QA-PUB-10 no pipeline e anexar o log da execução automática.
- **Pacote de comprovação:** criar um teste específico para link expirado com assinatura válida (hoje a expiração só roda junto com a assinatura adulterada).
- **Retenção:** cobrar de DevOps as evidências de que o job de limpeza está agendado e rodando no ambiente real.
- **Evidências de 17/11:** anexos selecionados incluídos nesta alteração; publicação depende da revisão e integração do PR.
- **Contagem no runbook:** atualizar os números para bater com o que rodou de fato, mantendo a contagem do Vitest separada dos testes de scripts.

## 3. Métricas de qualidade (MTR)

| Métrica | Como é validada | Casos de teste | Status atual |
| :--- | :--- | :--- | :--- |
| **MTR-02** · Integridade fiscal | Validação do dígito verificador (Módulo 11) e tag `cDV` | CT-10, CT-11, CT-31.3, CT-31.4 | OK |
| **MTR-07** · Tamanho da chave | Rejeição de chaves fora do padrão de 44 dígitos | CT-09, CT-12 | OK |
| **MTR-09** · Isolamento por motorista | Bloqueio (`403`) ao tentar acessar ou alterar entregas de outro motorista | CT-21.1, CT-21.2 | OK |
| **MTR-06** · Teto de 300 KB por foto | Aceita 300.000 bytes e rejeita 300.001 bytes com `413`, sem salvar o arquivo rejeitado | CT-17.1, CT-17.2 | OK no reteste de 17/11; BUG-003 resolvido |
| **MTR-08** · Performance do painel | Carregamento de 1.000 entregas em até 3 segundos | — | Planejado |

## 4. Pendências e bugs conhecidos

### Bugs abertos e histórico recente

| ID | Impacto nos testes | Requisito / Regra | Status | Evidência / Observação |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | CT-05, CT-06 | US-01 (CA5), MTR-02, MTR-07 | Resolvido | Mantido para rastreabilidade. |
| **BUG-002** | CT-07 | REQ-04, US-01 (CA3) | Resolvido, reteste aprovado em 17/11/2026 | Teste normal, sem `.fails`, exige status `400` para XML com entidade externa. |
| **BUG-003** | CT-17.2 | US-02 (CA5), MTR-06 | Resolvido, reteste aprovado em 17/11/2026 | Upload com 300.001 bytes retorna `413` sem chamar o salvamento. |
| **BUG-004** | CT-18, CT-19 | Segurança (CORS) | Resolvido, reteste aprovado em 17/11/2026 | Origem não autorizada sem cabeçalho de liberação; origens configuradas exercitadas pelo teste são aceitas. |
| **BUG-005** | CT-14, CT-15, CT-16 | REQ-07, US-06 (CA1, CA5) | Resolvido quanto à ausência do endpoint, reteste aprovado em 17/11/2026 | Listagem, isolamento, paginação e contrato de coleção vazia aprovados. |

### Testes pendentes (`todo`) na rodada de 17/11/2026
- CT-02 — Checagem da extensão `.xml`: único `todo` registrado na execução. O backend recebe o conteúdo do XML; a validação da seleção do arquivo no frontend ainda precisa de implementação ou evidência específica.