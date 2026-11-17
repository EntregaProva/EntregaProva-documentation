# Relatório de QA — Checkpoint 3

Data: 14/11/2026 · Checkpoint: CP3 · Responsável: QA

Este relatório cobre o recorte de QA pedido no Checkpoint 3: o smoke automático depois do deploy, a autorização na URL publicada e a jornada nova de conferência do comprovante contra o XML. Foi atualizado depois do reteste das 15:10.

## 1. Resumo

O smoke automático e a autorização na URL publicada passaram. A jornada nova de conferência foi executada manualmente por mim (QA) e registrada como aprovada.

| Item | Resultado |
| :-- | :-- |
| Smoke após o deploy | Validado: `/healthz` e `/readyz` com 200 |
| Autorização na URL publicada | 8 de 8 cenários aprovados no reteste das 15:10 |
| Jornada de conferência (manual) | 8 casos aprovados por relato |
| Falhas inesperadas | 1 (401 às 15:00, tokens expirados) |
| 401 do motorista em 13/11 | Causa não determinada |
| Evidência no repositório | Log em `evidencias-qa` na documentação |

A tentativa das 15:00 foi interrompida com HTTP 401 na listagem do operador. O diagnóstico local identificou os quatro tokens expirados desde 13/11. Após substituí-los, o reteste passou nos oito cenários. Não foi demonstrado defeito do backend nessa ocorrência.

## 2. Escopo e ambiente

Testei a API publicada em https://entregaprova.onrender.com: o smoke que roda no pipeline depois do deploy, a autorização por token, papel e empresa (tenant), e a jornada de conferência do comprovante contra o XML na aplicação publicada.

## 3. Smoke automático após o deploy

O smoke está validado para o fluxo de publicação da API. Na execução do pipeline ([run 43275374999](https://github.com/EntregaProva/EntregaProva/actions/runs/43275374999)) todos os jobs ficaram verdes, e o log de `node backend/scripts/deploy-render.mjs` mostrou os dois endpoints respondendo 200.

| Endpoint | HTTP | Duração |
| :-- | :-: | :-: |
| `/healthz` | 200 | 130 ms |
| `/readyz` | 200 | 131 ms |

Li `deploy-render.mjs` e `smoke.mjs` nesse commit. O deploy é pedido com o SHA esperado, e o smoke confere HTTP 200 e Content-Type JSON. O `/healthz` precisa devolver status `ok` e o serviço `entregaprova-api`. O `/readyz` precisa devolver `ready`, e a `revision` do `/healthz` tem que bater com o SHA esperado. Falhas são repetidas dentro do limite do script, e uma falha persistente encerra com código 1.

O workflow encadeia `checks`, `deploy-api` e `deploy-hosting`. A aprovação vale para esse caminho automatizado da API. Não cobre deploys manuais feitos por fora do pipeline nem o frontend.

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

## 6. Limitações

- O motivo obrigatório na rejeição foi validado só pela interface. Não tentei rejeitar sem motivo direto pela API.
- Os testes manuais não têm IDs, capturas, XML nem commit registrados.
- A autorização publicada foi executada localmente com tokens fornecidos manualmente; ainda falta automatizar a obtenção dos tokens e a execução pós-deploy no pipeline.
- Tokens, senhas, arquivos `.env` e cabeçalhos Authorization não podem ir nos anexos.

## 7. Próximos passos

1. Publicar este relatório e os logs no site de documentação, após revisão e integração do PR.
2. Acrescentar IDs das entregas, XML, URL do frontend, commit e capturas da jornada, se der para recuperar. Se não der, a ausência continua explícita aqui.
3. Testar a rejeição sem motivo direto pela API.
4. Conferir a persistência das aprovações depois de recarregar e se o reenvio do comprovante não duplica registros.
5. Investigar o 401 do motorista de 13/11, que continua sem causa.

## 8. Como reproduzir

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

  ## 9. Conclusão
  O smoke automático foi validado para o fluxo de publicação da API analisado. Os oito cenários de autorização na URL publicada foram aprovados no reteste de 14/11/2026. A jornada nova de conferência, incluindo rejeição com motivo e reenvio, foi registrada como aprovada na execução manual de 13/11/2026, com as limitações documentadas. 