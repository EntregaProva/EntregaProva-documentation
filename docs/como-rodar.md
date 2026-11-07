---
title: Como rodar o projeto
---

# Como rodar o projeto

Guia para subir o **EntregaProva** na sua máquina. Tudo roda localmente com Docker Compose e emuladores do Firebase. Nenhuma conta de nuvem, cartão ou segredo real é necessário.

!!! info "Fonte"
    Este guia resume o README do repositório de código, [EntregaProva/EntregaProva](https://github.com/EntregaProva/EntregaProva). Em caso de divergência, vale o README de lá.

## Pré-requisitos

- Docker e Docker Compose
- Git
- Node 22 LTS (apenas para rodar testes ou scripts fora do Docker)

## Passo a passo

1. Clone o repositório:

    ```bash
    git clone https://github.com/EntregaProva/EntregaProva.git
    cd EntregaProva
    ```

2. Crie o arquivo de ambiente a partir do exemplo:

    ```bash
    cp .env.example .env
    ```

    Todos os valores do `.env.example` são falsos e já funcionam com os emuladores (projeto `demo-entregaprova`). Não é preciso alterar nada.

3. Suba todos os serviços:

    ```bash
    docker compose up --build
    ```

    O `compose.yaml` da raiz inclui o `docker/docker-compose.yml`, que define o backend, o frontend e os emuladores.

4. Em outro terminal, popule os emuladores com os dados de exemplo:

    ```bash
    docker compose exec backend npm run seed
    ```

    O seed é reproduzível: apaga e recria sempre os mesmos usuários no emulador de Auth. Ele recusa rodar fora dos emuladores.

Para parar tudo, use `docker compose down`. Para apagar também os dados, use `docker compose down -v`.

## Serviços e portas

| Serviço | URL |
| :--- | :--- |
| Frontend (`entregaprova-app`, Vite) | `http://localhost:5173` |
| API (`backend`) | `http://localhost:3000` |
| Emulador de Auth | `http://localhost:9099` |
| Emulador de Firestore | `http://localhost:8080` |
| Emulador de Storage | `http://localhost:9199` |
| UI dos emuladores | `http://localhost:4000` |

## Usuários de teste

Criados pelo seed no emulador de Auth. Valem apenas no ambiente local.

| Papel | E-mail | Senha |
| :--- | :--- | :--- |
| Admin / painel | `admin@teste.com` | `Teste@123` |
| Motorista | `motorista@teste.com` | `Teste@123` |

## Variáveis de ambiente

O `.env.example` é dividido em três blocos:

| Bloco | Variáveis | Observação |
| :--- | :--- | :--- |
| Geral | `NODE_ENV`, `GCP_PROJECT_ID` | O prefixo `demo-` garante que os emuladores nunca tocam na nuvem. |
| Backend | `PORT`, `STORAGE_BUCKET`, `*_EMULATOR_HOST` | O Compose já injeta os hosts dos emuladores. Só preencha se rodar a API fora do Docker. |
| Frontend (Vite) | `VITE_*` | Apontam para a API e para os emuladores locais. |

!!! warning "Segredos"
    O arquivo `.env` real nunca vai para o GitHub.

## Verificação rápida

- `GET http://localhost:3000/` responde 200 com a mensagem "EntregaProva API está ativa!".
- O login com um usuário de teste abre a tela inicial.
- A UI dos emuladores (`http://localhost:4000`) mostra os usuários criados pelo seed.

## Problemas comuns

| Sintoma | O que fazer |
| :--- | :--- |
| Porta ocupada | Pare o processo que a usa ou altere a porta no `.env`. |
| Emuladores sem dados | Rode o seed de novo. |
| Alterou o `.env` | `docker compose down && docker compose up --build`. |
| Dados antigos atrapalhando | `docker compose down -v` e suba de novo. |
| Rodando a API fora do Docker | Preencha no `.env` os três `*_EMULATOR_HOST` apontando para `localhost`. |

## Testes e qualidade

Dentro de `backend/`:

```bash
npm ci
npm run lint
npm run build
npm test
```

Os testes cobrem autorização, EP/BVA e Security Rules (estes últimos rodam contra o emulador). O CI executa a cada PR: lint e build (Node 22), `npm audit`, gitleaks e `docker compose build`. O job de testes do backend entra no CI quando a suíte estiver estável.

Para os resultados e a cobertura, veja a [Estratégia de Testes](qualidade/estrategia-testes.md), a [Matriz de Rastreabilidade](rastreabilidade.md) e o [Relatório v2](relatorios-teste/relatorio-v2.md).

## Tecnologias

| Camada | Tecnologia |
| :--- | :--- |
| Backend | Node 22 LTS, TypeScript, Express e Firebase Admin |
| Frontend | Vite (`entregaprova-app`) |
| Autenticação, banco e arquivos | Firebase Auth, Firestore e Storage (emuladores locais nesta fase) |
| Ambiente | Docker e Docker Compose |
| Deploy | Firebase Hosting (frontend) e Render (API), ambos em plano gratuito |
| Testes e qualidade | Vitest, ESLint e GitHub Actions (CI) |

## Estrutura do repositório de código

| Pasta / arquivo | Conteúdo |
| :--- | :--- |
| `backend/` | API em TypeScript (Express + Firebase Admin), com `src/` e `tests/` |
| `entregaprova-app/` | Frontend |
| `docker/` | Dockerfiles e `docker-compose.yml` (backend, frontend e emuladores) |
| `compose.yaml` | Ponto de entrada do Compose (inclui `docker/docker-compose.yml`) |
| `firebase.json` | Configuração dos emuladores e do Firebase Hosting |
| `firestore.rules` / `storage.rules` | Security Rules (deny-all: o acesso é só pela API) |
| `testes/` | Testes de autorização, EP/BVA, Security Rules e carga |
| `docs/` | Evidências de FinOps do repositório de código |
