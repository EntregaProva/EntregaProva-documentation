# Relatório de Testes v2

Data: 07/11/2026 · Checkpoint: CP2 (correções após o feedback) · Responsável: QA · PR: #18 (`quality-assurance`)

Este relatório apresenta a atualização dos testes em relação à versão de 01/11 (v1), incluindo as mudanças na suíte do backend, os resultados da execução de 07/11 e a situação atual dos bugs identificados.

## 1. Resumo

Rodei a suíte do backend com o emulador do Firestore ligado e nenhum teste falhou de forma inesperada. Desde o v1, todos os testes ganharam um CT-xx (até o CT-48), tirei 15 testes duplicados e acrescentei 7: o limite de 300 KB da foto, o CORS e a listagem de entregas.

Dos 76 testes, 68 passam, 3 estão marcados com `it.fails` porque o bug que eles descrevem ainda existe, e 5 são `todo`. O Vitest mostra 71 aprovados porque conta o `it.fails` como sucesso.

| Indicador | v1 (01/11) | v2 (07/11) |
| :--- | :---: | :---: |
| Testes | 75 | 76 |
| Passando | 73 | 68 |
| `it.fails` (bug conhecido) | 1 | 3 (CT-07, CT-17.2, CT-18) |
| Falhas inesperadas | 0 | 0 |
| `todo` | 1 | 5 (CT-02, CT-14 a CT-16, CT-19) |
| Testes sem CT-xx | 42 | 0 |
| Testes duplicados | 15 | 0 |
| Bugs abertos | 1 confirmado, 1 a confirmar | 4 (BUG-002 a BUG-005) |
| Cobertura de linhas | 75,24% | 74,21% |
| Cobertura de branches | 87,93% | 88% |
| Cobertura de funções | 85% | 85% |
| Lint, build e tipos | OK | OK |

O CI do PR #18 passou nos 8 checks (lint e build, `npm audit`, `gitleaks`, `docker compose build` e os previews). O PR ainda aguarda revisão de outro integrante da equipe(no caso da nossa PO ou de nosso Tech Lead).

## 2. O que mudou desde o v1

- Todos os testes do backend têm o CT-xx no título.
- Tirei 15 duplicados: 5 do `checkpoint2.test.ts` (repetiam o CT-09 a CT-13), 8 do `tenant-isolation.test.ts` (repetiam o CT-20 a CT-22) e 2 do `api.test.ts` (repetiam o CT-04 e o CT-06).
- Juntei o `autorizacao.test.ts` com o `tenant-isolation.test.ts`. O CT-47 e o CT-48 já existiam sem número, e agora conferem também se o banco foi consultado. O token não reconhecido virou o CT-20.5.
- Separei os testes que checavam várias coisas de uma vez (CT-37, 40, 44 e 45), para saber exatamente o que quebrou quando um falhar.
- Acrescentei o CT-17.1 e o CT-17.2 (limite de 300 KB) e o CT-18 (CORS). Deixei como `todo` a listagem (CT-14 a CT-16) e as origens permitidas do CORS (CT-19).
- No CT-07, a checagem de vazamento (`root:`) agora vem antes da checagem do status. O CT-31, passou a conferir que a mensagem de erro não repete o conteúdo enviado.

## 3. O que foi testado

Testei a API do backend: importação de NF-e, validação da chave, upload de comprovante, conferência, acesso por papel e por empresa, CORS, health e readiness. Também testei as Security Rules do Firestore.

Ficaram de fora o painel de aging (US-04), o pacote de comprovação (US-05), a listagem de entregas e as telas.  

Uso Vitest 1.6.1, Supertest, `@firebase/rules-unit-testing` e cobertura V8, tudo com `npm run test:emulator`. Nos testes de API, Auth, Firestore e Storage são simulados em memória. Só as Security Rules rodam contra o emulador de verdade.

## 4. Resultado por arquivo

| Arquivo | Total | OK | `it.fails` | `todo` |
| :--- | :---: | :---: | :---: | :---: |
| `unit/importacao-nfe.test.ts` (CT-01 a CT-08) | 8 | 6 | 1 (CT-07) | 1 (CT-02) |
| `unit/nfe-chave.test.ts` (CT-09 a CT-13) | 5 | 5 | 0 | 0 |
| `security/tenant-isolation.test.ts` (CT-20 a CT-22, CT-47, CT-48) | 21 | 21 | 0 | 0 |
| `security/firestore-rules.test.ts` (CT-23 a CT-27) | 5 | 5 | 0 | 0 |
| `api.test.ts` (CT-14 a CT-19, CT-28 a CT-46) | 37 | 31 | 2 (CT-17.2, CT-18) | 4 (CT-14 a CT-16, CT-19) |
| **Total** | **76** | **68** | **3** | **5** |

As mensagens `PERMISSION_DENIED` no `stderr` dos CT-24, CT-26 e CT-27 são esperadas. Esses testes tentam escrever ou apagar no emulador, e as regras `deny-all` bloqueiam.

## 5. Cobertura

| Módulo | Linhas | Branches | Funções |
| :--- | :---: | :---: | :---: |
| `src/middlewares` | 100% | 100% | 100% |
| `src/routes` | 100% | 100% | 100% |
| `src/controllers` | 93,01% | 89,88% | 100% |
| `src/utils` | 92,2% | 89,36% | 100% |
| `src/config` | 30,3% | 33,33% | 50% |
| `src` (raiz) | 42,58% | 73,68% | 60% |
| **Total** | **74,21%** | **88%** | **85%** |

A cobertura de linhas ficou em 74,21%, pouco mais de um ponto abaixo do v1 (75,24%). A queda vem de `src/config` (de 38,46% para 30,3%), porque foi feito um commit que aumentou o `firebase.ts` para ler a credencial da variável `FIREBASE_SERVICE_ACCOUNT_JSON`, e esse arquivo não tem teste.

## 6. Bugs

| ID | Severidade | Casos | Problema | Esperado | Obtido | Situação |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| BUG-001 | Média | CT-05, CT-06 | A massa `testes/nfe-valida-400.xml` tinha o dígito verificador errado | Passar na validação da chave | DV e `cDV` com 0; o Módulo 11 dá 1 | Resolvido |
| BUG-002 | Média | CT-07 | XXE é recusado com status diferente do pedido na US-01 CA3 | 400 | 422 | Aberto |
| BUG-003 | Média | CT-17.2 | O `multer` aceita até 5 MB, mas o limite da especificação é 300 KB | 413 acima de 300 KB | 200 (aceita até 5 MB) | Aberto |
| BUG-004 | Média | CT-18 | O `cors()` está sem lista de origens | Sem o header para origens não autorizadas | `Access-Control-Allow-Origin: *` | Aberto |
| BUG-005 | Alta | CT-14 a CT-16 | Não existe rota de listagem de entregas | Operador lista as do tenant; motorista lista só as dele | Rota inexistente | Aberto |

**BUG-001.** O defeito estava na massa de teste, não no sistema. Corrigi o DV e o `cDV` para 1 e o AAMM para 2610. Marquei como média porque travava qualquer teste que usasse esse arquivo, mas não afetava a produção.

**BUG-002.** O parser recusa o XML malicioso. O problema é só o código: devolve 422 e o critério da US-01 pede 400. Os CT-31.1 e CT-31.2 mostram que o erro não repete o conteúdo enviado. No v1, a checagem do status falhava antes da de vazamento, então o teste não provava nada sobre vazamento. Agora a ordem está invertida. Ainda preciso rodar o CT-07 sem `.fails` para confirmar que o `root:` também não aparece. PREENCHER com o resultado. Falta o cliente decidir se XXE fica com 400 e o resto com 422.

**BUG-003.** No `multer.ts` o limite está em `5 * 1024 * 1024`. Por isso o CT-17.2, que envia 300 KB mais 1 byte, recebe 200 em vez de 413. O CT-17.1, com exatos 300 KB, protege contra baixar o limite além do certo. Falta confirmar com o cliente se os 300 KB são regra do servidor ou se a ideia era comprimir no frontend.

**BUG-004.** A API está pública no Render, e com o CORS aberto qualquer site pode chamá-la pelo navegador. A correção é limitar às origens do Firebase Hosting e dos emuladores. Isso também libera o CT-19.

**BUG-005.** Sem a rota de listagem, as telas de Entregas e Conferência do frontend ficam no estado de erro, e as jornadas de ponta a ponta não fecham. Quando a rota existir, os CT-14 a CT-16 viram testes de verdade.

## 7. Limitações

- Os testes de API usam Auth, Firestore e Storage simulados. A verificação do token com o Auth Emulator ainda não foi feita.
- Os critérios que dependem de tela e de compressão no cliente (US-02 CA1 a CA3, US-03 CA1, CA2 e CA4) não são cobertos pelo backend. O CT-02 também depende do frontend, porque a API só recebe o texto do XML.
- O app não tem testes automatizados. O CI só roda lint e build nele. As jornadas J1 a J3 esperam a ligação entre frontend e backend.
- Entre os 8 checks do PR #18 não aparece um job só de testes. A evidência da suíte é a rodada local da seção 9.
- Não há testes de desempenho (MTR-01 e MTR-08).

## 8. Próximos passos

1. Quando cada bug (BUG-002 a BUG-004) for corrigido, trocar o `it.fails` correspondente por `it`.
2. Quando a rota de listagem existir, transformar o CT-14, o CT-15 e o CT-16 em testes de verdade e escrever o CT-19 assim que a lista de origens for definida.
3. Rodar as jornadas J1 a J3 com `docker compose up`, um usuário por papel, e acrescentar o resultado numa seção 10.
4. Avaliar um teste que valide o token direto no Auth Emulator.

## 9. Como rodar

```bash
cd backend
npm run lint
npm run build
npm run test:emulator

# cobertura (sem o emulador, as 5 Security Rules são puladas)
npx vitest run --coverage --coverage.include="src/**/*.ts"
```

Se a porta 8080 estiver ocupada por outro contêiner do projeto, rode `docker compose down` na raiz do repositório antes de iniciar o emulador.

Saída final da rodada de 07/11/2026 (`npm run test:emulator`):

```text
Test Files  5 passed (5)
     Tests  71 passed | 5 todo (76)
```
