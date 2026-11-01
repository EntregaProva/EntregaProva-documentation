# Relatório de Testes v1

Data: 01/11/2026 · Checkpoint: CP2 · Responsável: QA · PR: #15 (`quality-assurance`)

Este é o primeiro relatório de testes do EntregaProva. Aqui está o que foi testado, o que passou, quanto do código os testes realmente tocam e o que ainda está em aberto. Os casos estão descritos na Suíte EP/BVA v1, e a ligação com os requisitos fica na Matriz de Rastreabilidade.

## 1. Resumo

A suíte do backend roda limpa no CI e na máquina local, sem nenhum teste falhando. Mesmo assim, tem coisa pendente: um bug confirmado (BUG-002), em que o backend devolve 422 onde o critério de aceite pede 400 para XML com entidade externa, e uma suspeita sobre o limite de upload (BUG-003). A cobertura de linhas ficou em 75,24%, e os módulos que concentram regra de negócio passam de 92%.

| Métrica | Valor |
| :--- | :---: |
| Testes registrados | 75 |
| Passaram | 74 |
| Falharam | 0 |
| Pendentes (`todo`) | 1 (CT-02) |
| Bugs abertos | 1 confirmado (BUG-002), 1 a confirmar (BUG-003) |
| Cobertura de linhas | 75,24% |
| Cobertura de branches | 87,93% |
| Cobertura de funções | 85% |
| Lint, build e tipos | Sem erros |

Vale olhar o 74 com cuidado. O CT-07 entra nessa conta porque está marcado como `it.fails`, ou seja, o teste espera falhar enquanto o BUG-002 existir. Na prática ele é um teste reprovado. Sem a marcação, o placar seria 73 passando e 1 falhando.

## 2. Escopo e ambiente

Testamos a API do backend (importação de XML, validação da chave, autorização por papel e por empresa) e as Security Rules do Firestore.

Ficou de fora a captura do canhoto (US-02), a conferência (US-03), o painel de aging (US-04), o pacote de comprovação (US-05) e a listagem do motorista. Essas histórias estão planejadas para o CP3 e o CP4.

Usamos Vitest 1.6.1, Supertest, `@firebase/rules-unit-testing` e cobertura V8. Os testes rodam localmente, com o emulador do Firestore em Docker, e no CI do GitHub (`npm run test:emulator`, Node 22, Java 21). Os testes de API usam mocks do Firebase; só as Security Rules rodam contra o emulador de verdade.

## 3. Resultado por suíte

| Suíte | Testes | Passaram | Observação |
| :--- | :---: | :---: | :--- |
| `unit/importacao-nfe.test.ts` (CT-01 a CT-08) | 8 | 6 + CT-07 | CT-07 está como `it.fails` (BUG-002); CT-02 é `todo` |
| `unit/nfe-chave.test.ts` (CT-09 a CT-13) | 5 | 5 | EP/BVA do tamanho e do dígito verificador |
| `security/autorizacao.test.ts` (CT-20 a CT-22) | 15 | 15 | 401, 403 e 404, sem alterar a entrega |
| `security/firestore-rules.test.ts` (CT-23 a CT-27) | 5 | 5 | Contra o emulador do Firestore |
| `security/tenant-isolation.test.ts` | 13 | 13 | Isolamento de tenant no backend |
| `api.test.ts` | 24 | 24 | API do backend |
| `checkpoint2.test.ts` | 5 | 5 | Testes do checkpoint |

## 4. Cobertura de código

| Módulo | Linhas | Branches | Funções |
| :--- | :---: | :---: | :---: |
| `src/middlewares` | 100% | 100% | 100% |
| `src/routes` | 100% | 100% | 100% |
| `src/controllers` | 93,01% | 89,77% | 100% |
| `src/utils` | 92,2% | 89,36% | 100% |
| `src/config` | 38,46% | 33,33% | 50% |
| `src` (raiz) | 42,58% | 73,68% | 60% |
| **Total** | **75,24%** | **87,93%** | **85%** |

O que puxa a média para baixo são `seed.ts`, `server.ts` e `config/firebase.ts`, todos com 0%. Eles só sobem o servidor e populam os dados de demonstração, então nenhum teste unitário passa por ali. Entre os arquivos que importam, o menos coberto é o `xmlParser.ts` (87,23%), e as linhas descobertas são ramos de erro.

## 5. Bugs abertos

| ID | Severidade | Caso | Descrição | Esperado | Obtido | Situação |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| BUG-001 | Média | CT-05 e CT-06 | A massa `testes/nfe-valida-400.xml` tem o dígito verificador da chave inválido (Módulo 11) | Massa "válida" passar na validação da chave (US-01 CA5; MTR-02, MTR-07) | `validarChaveNfe` devolve `{ valida: false, motivo: "DV_INVALIDO" }` | Aberto |
| BUG-002 | Média | CT-07 | XML com entidade externa (XXE) é recusado com status diferente do exigido pela US-01 CA3 | HTTP 400 | HTTP 422 | Confirmado, aberto |
| BUG-003 | Média | Planejado (US-02 CA5, MTR-06) | O `multer` aceita comprovantes de até 5 MB e PDF; a especificação manda rejeitar acima de 300 KB | Rejeição acima de 300 KB | Limite configurado em 5 MB | A confirmar com teste |
 
**BUG-001.** O defeito está na massa de teste, não no sistema. O `Id` da nota é `35260100000000000191550010000000011000000010` e o `cDV` está como `0`, mas o Módulo 11 sobre os 43 primeiros dígitos dá DV = 1. Por isso a validação recusa a massa. Tem mais um detalhe: o AAMM da chave (`2601`) não bate com o `dhEmi` (`2026-10-18`, que daria `2610`). Classifiquei como baixa porque trava qualquer teste que use essa massa, mas não afeta o sistema em produção. A correção é ajustar o DV e o `cDV` para 1 e o AAMM para 2610, ou trocar pela `nfe-exemplo-valida.xml` da documentação, que está correta. Enquanto isso não for feito, o CT-05 e o CT-06 (parser) ficam comprometidos sempre que usarem essa massa.
 
**BUG-002.** O parser recusa o XML malicioso, então a proteção funciona, o problema é só o código de status. Só que a asserção do status falha antes da que verifica se o conteúdo do arquivo local (`root:`) aparece na mensagem de erro. Por isso este teste ainda não prova que não há vazamento. Enquanto ninguém checar isso, a severidade fica em "média". Se houver vazamento, vira problema de segurança.
 
**BUG-003.** Apareceu sem teste que o comprove. Só vamos tratá-lo como confirmado depois de escrever os casos de 299, 300 e 301 KB.

## 6. Limitações desta versão

- O backend está bem coberto para a US-01 e a US-06, mas as US-02 a US-05 ainda não têm nenhum teste automatizado.
- O CT-02 (extensão diferente de `.xml`) ficou como `todo`, porque o backend só recebe o conteúdo do XML e não enxerga o nome do arquivo.
- O validador da chave usa a mesma mensagem para tamanho errado e para caractere não numérico, então os testes não conseguem distinguir as duas causas.
- Os testes `api`, `tenant-isolation` e `checkpoint2` ainda não têm identificador CT-xx.
- Não há testes de desempenho (MTR-01 e MTR-08) nem de interface.

## 7. Próximos passos

1. Corrigir o BUG-002 no `xmlParser.ts` (devolver 400 em XXE) e tirar o `.fails` do CT-07.
2. Escrever os casos de tamanho de upload e decidir se o limite de 5 MB fica ou desce para 300 KB.
3. Cobrir a US-02 (nome do recebedor e idempotência), depois a US-03 (motivo obrigatório) e por fim as faixas de aging da US-04.
4. Dar identificadores CT-xx aos testes do backend que ainda não têm.

## 8. Como reproduzir

```bash
cd backend
npm run lint
npm run build
npm run test:emulator

# cobertura (sem emulador, as 5 Security Rules são puladas)
npx vitest run --coverage --coverage.include="src/**/*.ts"
```

Se a porta 8080 estiver ocupada por outro contêiner do projeto, pare-o antes com `docker compose down`, na raiz do repositório.
