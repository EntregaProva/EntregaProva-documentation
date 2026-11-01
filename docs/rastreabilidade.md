# Matriz de Rastreabilidade

Esta matriz liga cada requisito do backlog aos critérios de aceite, aos casos de teste (CT-xx) e ao resultado da última execução.

**Última execução:** 01/11/2026, branch `quality-assurance` (PR #15), Vitest 1.6.1, com o emulador do Firestore ligado (`npm run test:emulator`).

**Estados:** Passou · Reprovado (bug aberto) · Pendente (`todo`) · Planejado (CP3/CP4) · Sem teste.

## 1. Requisito → critério → caso de teste

### REQ-01 e REQ-04: ingestão segura de XML (US-01)

| Critério | CT | O que o teste confirma | Arquivo | Estado |
| :--- | :--- | :--- | :--- | :--- |
| CA1: aceita XML NF-e v4.00 | CT-01 | XML válido enviado pela API retorna 201 | `unit/importacao-nfe.test.ts` | Passou |
| CA1: só `.xml` | CT-02 | Arquivo com outra extensão é rejeitado | `unit/importacao-nfe.test.ts` | Pendente: o backend só recebe o conteúdo, a checagem é do frontend |
| CA1: versão 4.00 | CT-03 | NF-e versão 4.00 é aceita | `unit/importacao-nfe.test.ts` | Passou |
| CA1: versão suportada | CT-04 | NF-e de versão não suportada é rejeitada (422) | `unit/importacao-nfe.test.ts` | Passou |
| CA2: extração de dados | CT-05 | O parser extrai `nNF` e a chave | `unit/importacao-nfe.test.ts` | Passou |
| CA2: XML íntegro | CT-06 | XML malformado é rejeitado (422) | `unit/importacao-nfe.test.ts` | Passou |
| CA3: bloqueio de XXE (REQ-04) | CT-07 | XML com entidade externa é rejeitado com 400 | `unit/importacao-nfe.test.ts` | Reprovado: devolve 422 (BUG-002) |
| CA4: status inicial | CT-08 | A entrega importada nasce como `PENDENTE` | `unit/importacao-nfe.test.ts` | Passou |
| CA5, MTR-07: limite inferior | CT-09 | Chave de 43 dígitos é rejeitada | `unit/nfe-chave.test.ts` | Passou |
| CA5, MTR-02: chave válida | CT-10 | Chave de 44 dígitos com Módulo 11 correto é aceita | `unit/nfe-chave.test.ts` | Passou |
| CA5, MTR-02: DV | CT-11 | Chave de 44 dígitos com DV errado é rejeitada | `unit/nfe-chave.test.ts` | Passou |
| CA5, MTR-07: limite superior | CT-12 | Chave de 45 dígitos é rejeitada | `unit/nfe-chave.test.ts` | Passou |
| CA5: caractere inválido | CT-13 | Chave com caractere não numérico é rejeitada | `unit/nfe-chave.test.ts` | Passou |

### REQ-07 e ADR 006: autenticação, papéis e isolamento (US-06)

| Critério | CT | O que o teste confirma | Arquivo | Estado |
| :--- | :--- | :--- | :--- | :--- |
| Autenticação obrigatória | CT-20 | Sem token (leitura, comprovante, conferência) e com token vencido: 401 | `security/autorizacao.test.ts` | Passou (4 casos) |
| US-06 CA2, MTR-09 | CT-21 | Motorista não lê nem envia comprovante de outro motorista: 403, sem alterar a entrega | `security/autorizacao.test.ts` | Passou (CT-21.1, 21.2) |
| REQ-03, ADR 006: papéis | CT-21 | Motorista não confere entrega (de outro nem a própria); operador não envia comprovante: 403 | `security/autorizacao.test.ts` | Passou (CT-21.3 a 21.5) |
| REQ-01, ADR 006: papéis | CT-21 | Motorista não importa XML: 403 | `security/autorizacao.test.ts` | Passou (CT-21.6) |
| Isolamento de tenant | CT-22 | Usuário de outra empresa não lê, não envia comprovante e não confere: 404, sem alterar a entrega | `security/autorizacao.test.ts` | Passou (CT-22.1 a 22.3) |
| US-06 CA1 | CT-22 | Operador lê a entrega do próprio tenant; motorista lê a própria entrega | `security/autorizacao.test.ts` | Passou (CT-22.4, 22.5) |
| US-06 CA3: servidor impõe a regra | CT-23 | Anônimo não lê documento no Firestore | `security/firestore-rules.test.ts` | Passou |
| US-06 CA3 | CT-24 | Anônimo não escreve | `security/firestore-rules.test.ts` | Passou |
| US-06 CA3 | CT-25 | Autenticado não lê documento nem lista a coleção | `security/firestore-rules.test.ts` | Passou |
| US-06 CA3 | CT-26 | Autenticado não cria nem altera | `security/firestore-rules.test.ts` | Passou |
| US-06 CA3 | CT-27 | Autenticado não apaga | `security/firestore-rules.test.ts` | Passou |

### Reservados

Os CT-14 a CT-19 estão reservados para o CP3/CP4 e ainda não existem como teste.

## 2. Visão por requisito

| Requisito | História | Cobertura de teste | Situação |
| :--- | :--- | :--- | :--- |
| REQ-01 Ingestão de XML | US-01 | CA1 a CA5 cobertos (CT-01 a CT-13) | Coberto, com o CT-02 pendente |
| REQ-04 XXE e idempotência | US-01 CA3 | XXE no CT-07; idempotência sem teste | Parcial; CT-07 reprovado |
| REQ-07 Visão restrita do motorista | US-06 | CA1 a CA3 cobertos (CT-20 a CT-27) | Coberto no backend |
| REQ-02 Captura do canhoto | US-02 | Nenhum | Sem teste, planejado |
| REQ-03 Conferência | US-03 | Só o controle de papel (CT-21.3, 21.4, CT-22.3) | Parcial |
| REQ-05 Painel de aging | US-04 | Nenhum | Sem teste, planejado |
| REQ-06 Pacote de comprovação | US-05 | Nenhum | Sem teste, planejado |

## 3. Métricas de sucesso (MTR)

| Métrica | Verificação | CT | Situação |
| :--- | :--- | :--- | :--- |
| MTR-02 Integridade fiscal | Chaves válidas e corrompidas | CT-10, CT-11 | Passou |
| MTR-07 Chave inválida | Chaves de 43 e 45 dígitos | CT-09, CT-12 | Passou |
| MTR-09 Controle de acesso do motorista | Bloqueio 403 em entregas de terceiros | CT-21.1, CT-21.2 | Passou |
| MTR-06 Tamanho do arquivo (300 KB) | Uploads acima de 300 KB rejeitados | Planejado | Sem teste; o limite atual do `multer` é 5 MB|
| MTR-08 Desempenho do painel | 1.000 entregas em 3 s | Planejado | Sem teste |

## 4. Testes sem identificador CT
Outros 42 testes passam, mas ainda não têm CT-xx: `api.test.ts` (24), `tenant-isolation.test.ts` (13) e `checkpoint2.test.ts` (5). Eles são do backend e reforçam a cobertura, mas a numeração deles depende de combinar com o Backend.

## 5. Bugs ligados a esta matriz

| Bug | Caso afetado | Requisito |
| :--- | :--- | :--- |
| BUG-001 | CT-05 e CT-06 (Mesmo passando) | US-01, critério 5; MTR-02, MTR-07|
| BUG-002 | CT-07 | REQ-04, US-01 CA3 |
