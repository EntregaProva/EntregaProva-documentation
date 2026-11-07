# Matriz de Rastreabilidade

Mapeamento dos requisitos do backlog, critérios de aceite e cobertura atual dos testes automatizados.

**Última rodada:** 07/11/2026 · branch `quality-assurance` (PR #18) · Vitest 1.6.1 com emulador do Firestore (`npm run test:emulator`)

**Resultado:** 76 testes. 68 OK, 3 falhas conhecidas (CT-07, CT-17.2, CT-18) e 5 pendentes (CT-02, CT-14, CT-15, CT-16, CT-19).

**Legenda de status:**
* **OK:** teste passando.
* **Falha conhecida (`it.fails`):** comportamento já especificado no teste, mas aguardando correção de bug aberto. Quando o bug for corrigido, basta trocar `it.fails` por `it`.
* **Pendente (`todo`):** teste ainda não implementado por depender de outra entrega.
* **Planejado:** previsto para os próximos checkpoints (CP3/CP4).

## 1. Cobertura detalhada por funcionalidade

### Importação e validação de NF-e (REQ-01, REQ-04 / US-01)

| Critério / Regra | Caso | Cenário testado | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- |
| CA1 · Layout NF-e 4.00 | CT-01 | Importação de XML válido pela API retorna `201` | `unit/importacao-nfe.test.ts` | OK |
| CA1 · Extensão `.xml` | CT-02 | Rejeita arquivos que não sejam `.xml` | `unit/importacao-nfe.test.ts` | Pendente (a API recebe só o payload; validação fica no front) |
| CA1 · Versão 4.00 | CT-03 | Aceita nota na versão 4.00 | `unit/importacao-nfe.test.ts` | OK |
| CA1 · Versão incompatível | CT-04 | Rejeita versões diferentes da 4.00 com `422` | `unit/importacao-nfe.test.ts` | OK |
| CA1 · Formatos de XML | CT-28 | Aceita tanto a nota pura quanto a processada (`nfeProc`) | `api.test.ts` | OK |
| CA2 · Extração de campos | CT-05 | Extrai número da nota (`nNF`) e chave de acesso | `unit/importacao-nfe.test.ts` | OK |
| CA2 · XML corrompido | CT-06 | Rejeita XML malformado com `422` | `unit/importacao-nfe.test.ts` | OK |
| CA3 / REQ-04 · Proteção XXE | CT-07 | Bloqueia entidade externa com `400` sem vazar arquivo local | `unit/importacao-nfe.test.ts` | Falha conhecida: hoje retorna `422` (BUG-002) |
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
| CA5 / MTR-06 · Limite de 300 KB | CT-17.1 | Aceita imagem com exatos 300 KB | `api.test.ts` | OK |
| CA5 / MTR-06 · Limite de 300 KB | CT-17.2 | Rejeita imagem com 1 byte acima de 300 KB (`413`) | `api.test.ts` | Falha conhecida: `multer` está liberando até 5 MB (BUG-003) |
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
| Exigência de token | CT-20.1 a 20.5 | Requisições sem token, com token expirado ou inválido tomam `401` em todas as rotas | `security/tenant-isolation.test.ts` | OK |
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
| CORS · Bloqueio de origens | CT-18 | Não envia `Access-Control-Allow-Origin` para domínios fora da whitelist | `api.test.ts` | Falha conhecida: `cors()` está aberto com `*` (BUG-004) |
| CORS · Origens permitidas | CT-19 | Libera origens do Firebase Hosting e emuladores locais | `api.test.ts` | Pendente (falta fechar a lista de origens) |
| Logs e privacidade | CT-45.1, 45.2 | Erros inesperados retornam `500` genérico e os logs omitem dados sensíveis | `api.test.ts` | OK |
| Health check | CT-34 | Rota de health responde `200` sem depender de autenticação, Firestore ou Storage | `api.test.ts` | OK |
| Readiness check | CT-35, CT-36 | Rota de readiness testa leitura leve no banco e retorna `503` (sem expor detalhes internos) se falhar ou der timeout | `api.test.ts` | OK |
| Retrocompatibilidade | CT-46 | Mantém funcionando as rotas antigas `/deliveries/:id/proof` e `/check` | `api.test.ts` | OK |

## 2. Resumo por requisito

| Requisito | História | O que já está coberto | O que falta / Observações |
| :--- | :--- | :--- | :--- |
| **REQ-01** · Ingestão de XML | US-01 | CA1 e CA3 a CA5. No CA2, já extrai destinatário e valor. | Falta extrair o emitente no parser (CA2 parcial) e validar a extensão no front (CT-02). |
| **REQ-04** · Segurança no XML e idempotência | US-01 (CA3) | Bloqueio de XXE (CT-31.1, 31.2), limite de tamanho e bloqueio de duplicatas (CT-32). | Ajustar o status code de erro de XXE no CT-07 para `400` (BUG-002). |
| **REQ-02** · Captura do canhoto | US-02 | Idempotência, concorrência e recuperação (CA4), além dos testes de limite de 300 KB (CA5). | Corrigir o limite do `multer` no backend (BUG-003). Os critérios CA1 a CA3 dependem do app/front (tela e compressão no cliente). |
| **REQ-03** · Conferência | US-03 | Obrigatoriedade de motivo na rejeição (CA3), alçadas de acesso e fluxo de reenvio. | Os critérios CA1, CA2 e CA4 são visuais e dependem das telas de conferência. |
| **REQ-07** · Visão restrita do motorista | US-06 | Isolamento na leitura por ID, bloqueio de escrita em entregas de terceiros (CA2) e regras do Firestore (CA3). | Implementar o endpoint de listagem (BUG-005) para destravar os testes CT-14 a CT-16 (CA1 e CA5). |
| **REQ-05** · Painel de aging | US-04 | Sem cobertura ainda. | Escopo planejado para as próximas entregas. |
| **REQ-06** · Pacote de comprovação | US-05 | Sem cobertura ainda. | Escopo planejado para as próximas entregas. |

## 3. Métricas de qualidade (MTR)

| Métrica | Como é validada | Casos de teste | Status atual |
| :--- | :--- | :--- | :--- |
| **MTR-02** · Integridade fiscal | Validação do dígito verificador (Módulo 11) e tag `cDV` | CT-10, CT-11, CT-31.3, CT-31.4 | OK |
| **MTR-07** · Tamanho da chave | Rejeição de chaves fora do padrão de 44 dígitos | CT-09, CT-12 | OK |
| **MTR-09** · Isolamento por motorista | Bloqueio (`403`) ao tentar acessar ou alterar entregas de outro motorista | CT-21.1, CT-21.2 | OK |
| **MTR-06** · Teto de 300 KB por foto | Rejeição de uploads acima de 300 KB | CT-17.1, CT-17.2 | Em aberto — `multer` aceita até 5 MB hoje (BUG-003) |
| **MTR-08** · Performance do painel | Carregamento de 1.000 entregas em até 3 segundos | — | Planejado |

## 4. Pendências e bugs conhecidos

### Bugs abertos e histórico recente

| ID | Impacto nos testes | Requisito / Regra | Status | O que precisa ser feito |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | CT-05, CT-06 | US-01 (CA5), MTR-02, MTR-07 | Resolvido | — |
| **BUG-002** | CT-07 (`it.fails`) | REQ-04, US-01 (CA3) | Aberto | Trocar o retorno de XML com entidade externa de `422` para `400` e remover o `.fails` do teste. |
| **BUG-003** | CT-17.2 (`it.fails`) | US-02 (CA5), MTR-06 | Aberto | Reduzir o limite configurado no `multer` de 5 MB para 300 KB e remover o `.fails` do teste. |
| **BUG-004** | CT-18 (`it.fails`) | Segurança (CORS) | Aberto | Restringir o middleware `cors()` apenas às origens confiáveis (hoje responde `*`). |
| **BUG-005** | CT-14, CT-15, CT-16 (`todo`) | REQ-07, US-06 (CA1, CA5) | Aberto | Criar a rota de listagem de entregas para o motorista e implementar os testes pendentes. |

### Outros testes pendentes (`todo`)
* **CT-02 (Checagem de extensão `.xml`):** aguarda implementação da trava no frontend, já que a API recebe apenas o conteúdo bruto do XML.
* **CT-19 (Whitelist de CORS):** aguarda a definição final das URLs do Firebase Hosting e das portas dos emuladores para fechar a configuração junto com o BUG-004.
