# ADR 009: CI/CD com GitHub Actions e Autenticação do Pipeline

**Status:** Aprovado
**Data:** 11/11/2026
**Decisores:** João Pedro Pellegrini de Almeida

## 1. Contexto e Problema

O Checkpoint 3 pede deploy automático (preview a cada PR e atualização da produção no merge), sem comandos manuais, com build somente pelo GitHub Actions e acesso à nuvem por Workload Identity Federation, sem arquivo de chave JSON. A arquitetura da equipe (ADR 008) usa Render para a API e Firebase Hosting para o frontend, o que muda parte desse desenho. Os principais requisitos são:

1.1: Nenhuma publicação em produção feita à mão
1.2: Só publicar código que passou por lint, build e testes
1.3: Revisão do frontend em uma URL de preview antes do merge
1.4: Nenhum segredo no código ou no repositório
1.5: Registrar de forma explícita onde o pipeline se afasta do Caderno

## 2. Decisão Arquitetural

2.1: Verificações (CI)

O workflow `ci.yml` roda a cada Pull Request e a cada push na `main`:

- Lint e build do backend e do frontend.
- `npm run test:smoke` e `npm run test:emulator` no backend.
- `npm audit` (nível alto) no backend e no frontend.
- gitleaks para procurar segredos no histórico.
- `docker compose build` e build da imagem da API.

A `main` é protegida: nenhuma alteração entra sem Pull Request aprovado por outra pessoa e com os checks verdes. Há CODEOWNERS e template de Pull Request.

2.2: Pull Request

1. O CI roda por completo.
2. Se passar, o frontend é publicado em um canal de preview do Firebase Hosting (`pr-NUMERO`), com validade de 7 dias.
3. Antes de publicar, o workflow confere a configuração pública do frontend e executa um smoke test contra a API já publicada que o preview usa.
4. O link do preview aparece no PR para o revisor testar a mudança.

O PR **não** publica a API.

2.3: Merge na `main`

1. O CI roda de novo.
2. A API é publicada no Render por *deploy hook*, a partir do SHA aprovado. O auto-deploy por commit está desativado no Render, para que só o pipeline publique.
3. O script `backend/scripts/deploy-render.mjs` espera a API ficar no ar e a confere contra o SHA esperado [confirmar o comportamento exato do script].
4. Só depois que a API for verificada, o frontend é publicado no canal `live` do Firebase Hosting.

Se qualquer passo falhar, o deploy para. O grupo de concorrência `production-deploy` impede dois deploys de produção ao mesmo tempo.

2.4: Credenciais

- **Render:** a URL do deploy hook fica em secret do GitHub (`RENDER_DEPLOY_HOOK_URL`). Variáveis públicas, como a URL da API, ficam em variáveis do repositório.
- **Firebase Hosting:** o GitHub Actions usa a action oficial do Firebase com uma conta de serviço guardada no secret `FIREBASE_SERVICE_ACCOUNT_ENTREGAPROVA`. Isso é uma **chave JSON de conta de serviço**, e não Workload Identity Federation [confirmar o formato do secret].
- **API em produção:** o backend lê as credenciais do Firebase Admin de um *Secret File* montado no Render, nunca do Git nem da imagem.

2.5: Rollback

- **API:** pelo histórico de deploys do Render (há evidência em `docs/render-rollback.png`).
- **Frontend:** pelo histórico de versões do Firebase Hosting.
- O runbook de rollback deve ficar em `/docs` e o ensaio ao vivo é da Semana 8.

2.6: Exceções ao Caderno

| Item do Caderno | O que a equipe faz | Compensação |
| --- | --- | --- |
| Workload Identity Federation, sem chave JSON | Chave JSON de conta de serviço no secret do GitHub para o Hosting | gitleaks no CI, permissão mínima na conta de serviço, rotação da chave e troca por Workload Identity se os tutores exigirem |
| Build somente pelo GitHub Actions, sem Cloud Build | O Actions valida o build (inclusive o da imagem), mas a imagem que roda em produção é construída pelo Render a partir do Dockerfile | Deploy disparado só pelo pipeline, com o SHA aprovado |
| Imagem marcada com o SHA do commit no Artifact Registry | Não há Artifact Registry. O SHA identifica o deploy e a revisão esperada | Verificação do SHA após o deploy |
| Revisão nova sem tráfego, smoke test e depois troca de tráfego | O Render publica a versão e o pipeline a verifica depois | Rollback pelo histórico do Render |
| Rewrite `/api/**` no Hosting | O Hosting só reescreve para `index.html`; o frontend chama a API por URL absoluta (`VITE_API_URL`) | CORS restrito às origens exatas do frontend e dos canais de preview |

## 3. Justificativas

O deploy por *deploy hook* com auto-deploy desativado mantém a regra principal do Caderno: só o pipeline publica, e só depois dos checks. Publicar o frontend somente após a API ser verificada evita que o frontend aponte para uma API quebrada. O preview por PR permite revisar a interface antes do merge.

A chave JSON para o Hosting foi mantida por ser o caminho padrão da action oficial do Firebase e por já estar funcionando. Migrar para Workload Identity exige configurar provedor de identidade, vínculo com o repositório e permissões, o que fica como alternativa caso os tutores não aceitem a exceção.

## 4. Consequências

**Positivas**

- Produção atualizada só pelo pipeline, com checks obrigatórios e `main` protegida.
- Preview por PR e verificação da API antes de publicar o frontend.
- Custo zero em todo o pipeline.

**Negativas e riscos**

- Uma chave JSON de longa duração no GitHub é um risco maior que uma credencial temporária. É a principal exceção deste ADR e precisa de aprovação dos tutores.
- O Render constrói a imagem de produção, então o artefato testado no CI e o artefato publicado não são o mesmo arquivo.
- Não há troca gradual de tráfego. Uma versão com defeito fica no ar até o rollback.
- No plano Free do Render, o smoke test após o deploy pode levar cerca de 1 minuto por causa do cold start.
- O ensaio de rollback e o runbook completo ainda precisam ser finalizados antes da Semana 8.
