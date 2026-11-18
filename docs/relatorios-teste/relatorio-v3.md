# Relatório de QA — Checkpoint 3

Data: 14/11/2026 · Checkpoint: CP3 · Responsável: QA · PR: #28

Este relatório cobre o recorte de QA pedido no Checkpoint 3: o smoke automático depois do deploy, a autorização na URL publicada e a jornada nova de conferência do comprovante contra o XML. Foi atualizado depois do reteste das 15:10.

## 1. Resumo

O smoke automático e a autorização na URL publicada passaram. A jornada nova de conferência foi executada manualmente por mim (QA) e registrada como aprovada.  
Depois, a obtenção de tokens e a execução dos testes de autorização foram integradas ao pipeline de publicação. Conforme confirmação do responsável pela execução, todos os checks de CI e o workflow de publicação concluíram com sucesso.

| Item | Resultado |
| :-- | :-- |
| Smoke após o deploy | Validado: `/healthz` e `/readyz` com 200 |
| Autorização na URL publicada | 8 de 8 cenários aprovados no reteste das 15:10 |
| Jornada de conferência (manual) | 8 casos aprovados por relato |
| Falhas inesperadas | 1 (401 às 15:00, tokens expirados) |
| 401 do motorista em 13/11 | Causa não determinada |
| Evidência no repositório | Log em `evidencias-qa` na documentação |

A tentativa das 15:00 foi interrompida com HTTP 401 na listagem do operador. O diagnóstico local identificou os quatro tokens expirados desde 13/11. Após substituí-los, o reteste passou nos oito cenários. Não foi demonstrado defeito do backend nessa ocorrência.  
A automação posterior elimina a necessidade de fornecer tokens manualmente ao pipeline: as quatro contas são autenticadas no início da verificação publicada.

## 2. Escopo e ambiente

Testei a API publicada em https://entregaprova.onrender.com: o smoke que roda no pipeline depois do deploy, a autorização por token, papel e empresa (tenant), e a jornada de conferência do comprovante contra o XML na aplicação publicada.]
A atualização da automação utiliza quatro contas existentes no Firebase da API publicada:
- Operador da empresa da entrega sintética.
- Motorista responsável pela entrega sintética.
- Outro motorista da mesma empresa, sem atribuição à entrega selecionada.
- Operador de outra empresa, utilizado no cenário de isolamento entre tenants.

## 3. Smoke automático após o deploy

O smoke está validado para o fluxo de publicação da API. Na execução do pipeline ([run 43275374999](https://github.com/EntregaProva/EntregaProva/actions/runs/43275374999)) todos os jobs ficaram verdes, e o log de `node backend/scripts/deploy-render.mjs` mostrou os dois endpoints respondendo 200.

| Endpoint | HTTP | Duração |
| :-- | :-: | :-: |
| `/healthz` | 200 | 130 ms |
| `/readyz` | 200 | 131 ms |

Li `deploy-render.mjs` e `smoke.mjs` nesse commit. O deploy é pedido com o SHA esperado, e o smoke confere HTTP 200 e Content-Type JSON. O `/healthz` precisa devolver status `ok` e o serviço `entregaprova-api`. O `/readyz` precisa devolver `ready`, e a `revision` do `/healthz` tem que bater com o SHA esperado. Falhas são repetidas dentro do limite do script, e uma falha persistente encerra com código 1.

O workflow encadeia checks, deploy-api e deploy-hosting. Com a atualização, o job deploy-api também executa os testes de autorização após a publicação e a verificação inicial da API.  

## 4. Autorização na URL publicada

Rodei `npm run verify:published` em `backend`, de 15:10:37 a 15:10:42 (-03). O smoke inicial deu 200 no `/healthz` (620 ms) e no `/readyz` (503 ms), e os oito cenários de autorização passaram. Código de saída do teste: 0. Código de gravação do log: 0.

| Cenário | Esperado | Obtido | Resultado |
| :-- | :-: | :-: | :-- |
| Sem token | 401 | 401 | Aprovado |
| Token inválido | 401 | 401 | Aprovado |
| Listagem do operador | 200 | 200 | Aprovado |
| Listagem do motorista | 200 | 200 | Aprovado |
| Detalhe da entrega atribuída | 200 | 200 | Aprovado |
| Outro motorista | 403 | 403 | Aprovado |
| Outro tenant | 404 | 404 | Aprovado |
| Papel proibido na conferência | 403 | 403 | Aprovado |

O script também confere o formato das listagens e se os itens devolvidos ao motorista têm `driverId` igual ao `sub` do token dele. O cenário do papel proibido envia um POST de conferência como motorista, esperando 403, então o teste não é estritamente de leitura.

O log do reteste está incluído neste repositório de documentação: [autorização publicada — 14/11/2026, 15:10](evidencias-qa/autorizacao-publicada-20261114-151037.log).

**401 das 15:00.** Às 15:00:27, o mesmo teste parou na listagem do operador com HTTP 401, depois do smoke e de dois cenários negativos aprovados (código do teste 1, gravação 0; log `autorizacao-publicada-20261114-150027.log`). O diagnóstico local mostrou os quatro tokens expirados desde 13/11. Troquei os tokens, o diagnóstico passou a mostrá-los válidos e o reteste das 15:10 aprovou tudo. O problema estava nas credenciais, e não ficou demonstrado defeito do backend.

**401 do motorista em 13/11.** A primeira ocorrência, na listagem do motorista, continua com causa não determinada. Não deve ser confundida com a de 14/11.

Foi implementado o script backend/scripts/verify-published-ci.mjs, responsável por autenticar as quatro contas de homologação no Firebase Authentication, obter tokens novos e executar verify-published.mjs.  
Foram cadastrados oito Repository secrets para os e-mails e as senhas das quatro contas, além das três Repository variables utilizadas pelo fluxo: API_BASE_URL, VITE_FIREBASE_API_KEY e TEST_DELIVERY_ID. O workflow publicado concluiu com sucesso, incluindo a autenticação das contas e os oito cenários de autorização. O link e o SHA dessa execução ainda precisam ser adicionados à documentação.  

## 5. Jornada nova: conferência do comprovante contra o XML

Executei a jornada manualmente na aplicação publicada em 13/11/2026, na empresa reservada para testes. Os oito casos tiveram os resultados esperados conforme minhas observações.

| Caso | O que vi | Situação |
| :-- | :-- | :-- |
| Importar o XML e atribuir a entrega | Entrega aparece como pendente | Aprovado |
| Enviar o comprovante como motorista | Aguardando conferência | Aprovado |
| Conferir imagem e dados fiscais e aprovar | Dados corretos, aprovação feita | Aprovado |
| Rejeitar uma segunda entrega sem motivo | A interface impede a rejeição | Aprovado |
| Rejeitar com motivo | Rejeição feita | Aprovado |
| Reenviar o comprovante | Volta para Aguardando conferência | Aprovado |
| Motorista consultar a rejeição | Estado rejeitado e motivo visíveis | Aprovado |
| Nova conferência pelo operador | Nova aprovação feita | Aprovado |

Os nomes de estado são os que a interface mostra e não confirmam equivalência com os enums internos.

## 6. Testes automatizados e integração ao CI/CD

### 6.1. Testes do autenticador

Inclui dez novos casos de teste no arquivo `backend/scripts/verify-published-ci.check.mjs` para cobrir o comportamento do autenticador em diferentes cenários:

1. Login dos quatro perfis de acesso e mascaramento correto dos tokens no GitHub Actions.
2. Garantia de que os comandos de mascaramento não sejam emitidos fora do ambiente do GitHub Actions.
3. Bloqueio imediato (sem chamadas de rede) caso a chave do Firebase não esteja configurada.
4. Validação prévia de todas as credenciais antes de iniciar qualquer requisição externa.
5. Interrupção do fluxo assim que ocorre um erro HTTP durante o login.
6. Tratamento de falhas de rede sem vazar detalhes internos da aplicação.
7. Rejeição de respostas que retornem sem um token válido.
8. Preservação de espaços em branco nas senhas informadas.
9. Rejeição de payloads JSON inválidos sem expor o erro interno original.
10. Bloqueio de tokens malformados antes que qualquer log seja gerado.

Juntei esses novos cenários aos cinco testes *smoke* que já existiam, centralizando toda a execução no comando `npm run test:smoke`.

| Resultado local | Quantidade |
| :--- | :---: |
| Testes executados | 15 |
| Testes aprovados | 15 |
| Falhas | 0 |
| Testes cancelados | 0 |
| Testes ignorados | 0 |


### 6.2. Pipeline de publicação

Sempre que há um `push` na branch `main`, o workflow **Render e Hosting** entra em ação seguindo esta ordem:

1. Roda o workflow reutilizável de CI.
2. Faz o deploy da revisão aprovada no Render e verifica a saúde da API.
3. Gera novos tokens de acesso e executa os testes de autorização no ambiente publicado.
4. Realiza o build e publica o frontend no Firebase Hosting.

Dentro da etapa de CI, a pipeline valida:
- Lint e build tanto do backend quanto do frontend.
- Testes *smoke* e suítes com emuladores no backend.
- Auditoria de segurança das dependências nos dois pacotes.
- Varredura de segredos expostos usando o Gitleaks.
- Build do Docker Compose e da imagem da API.

O deploy no Hosting fica condicionado ao sucesso completo do job da API (o que inclui passar nos testes de autorização. Se algo falhar nessa etapa, o frontend não é atualizado. Vale destacar que essa trava não faz rollback automático da API, já que ela sobe antes da validação de autorização rodar.  

Todos os checks e etapas do workflow de publicação rodaram sem erros.

## 7. Limitações

- O motivo obrigatório na rejeição foi validado só pela interface. Não tentei rejeitar sem motivo direto pela API.
- Os testes manuais não têm IDs, capturas, XML nem commit registrados.
- Tokens, senhas, arquivos `.env` e cabeçalhos Authorization não podem ir nos anexos.

## 8. Próximos passos

1. Publicar este relatório e os logs no site de documentação, após revisão e integração do PR.
2. Acrescentar IDs das entregas, XML, URL do frontend, commit e capturas da jornada, se der para recuperar. Se não der, a ausência continua explícita aqui.
3. Testar a rejeição sem motivo direto pela API.
4. Conferir a persistência das aprovações depois de recarregar e se o reenvio do comprovante não duplica registros.
5. Investigar o 401 do motorista de 13/11, que continua sem causa.

## 9. Como reproduzir

```bash
cd backend
npm run verify:published
```

Para funcionar, é necessário definir no ambiente:
  - `TARGET_API_URL`
  - `TEST_OPERATOR_TOKEN`
  - `TEST_DRIVER_TOKEN`
  - `TEST_OTHER_DRIVER_TOKEN`
  - `TEST_OTHER_TENANT_TOKEN`
  - `TEST_DELIVERY_ID`

## 10. Conclusão
  O smoke automático foi validado para o fluxo de publicação da API analisado. Os oito cenários de autorização na URL publicada foram aprovados no reteste de 14/11/2026 e, posteriormente, integrados ao pipeline com obtenção automática de tokens novos.  
  Os 15 testes locais passaram sem falhas. Conforme confirmação do responsável pela execução, os checks de CI, a verificação de autorização publicada e o workflow de publicação também concluíram com sucesso. A pendência de automação e validação de autorização pós-deploy está concluída.
