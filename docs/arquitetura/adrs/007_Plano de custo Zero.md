# ADR 007: Plano de Custo Zero com Render e Supabase 

**Status:** Aprovado
**Data:** 01/11/2026
**Decisores:** João Pedro Pellegrini

## 1. Contexto e Problema

O Caderno de Projetos B2B define a base comum do ciclo como GCP + Firebase, com teto de US$ 50 por equipe, alertas de orçamento e emuladores Firebase no Docker Compose. A regra de ouro do ciclo também diz que, até a Semana 4, tudo roda local e o gasto na nuvem fica em no máximo US$ 5.

Na prática, o plano gratuito do Firebase (Spark) não cobre a stack aprovada no ADR 001: o Cloud Storage for Firebase e as Cloud Functions exigem o plano Blaze, que pede faturamento vinculado e cartão de crédito. O ADR 005 (imagens) e o ADR 006 (papéis) dependem desses serviços. Os principais requisitos desta decisão são:

1.1: Operar o MVP inteiro, inclusive o deploy, com custo de US$ 0 e sem cartão de crédito de nenhum integrante
1.2: Manter a arquitetura já definida: React com Vite e TypeScript no frontend, Node.js com TypeScript no back-end e GitHub Actions no CI
1.3: Continuar garantindo isolamento por tenant e controle por papel, com testes automáticos
1.4: Documentar de forma explícita cada ponto em que a equipe se afasta do Caderno, para que os tutores possam aprovar ou recusar
1.5: Conhecer desde já os limites dos planos gratuitos para não ser surpreendido no deploy e no Demo Day

## 2. Decisão Arquitetural

Foi decidido substituir GCP + Firebase por Render (hospedagem) e Supabase (dados, autenticação e arquivos), ambos no plano gratuito e sem cartão, dividido da seguinte forma:

2.1: Plataformas e responsabilidades

- **Frontend:** React com Vite e TypeScript, publicado como site estático no Render, que é gratuito.
- **Back-end:** API Node.js com TypeScript, publicada como web service no plano Free do Render. Ela valida o token, aplica regras de negócio, processa XMLs e gera as URLs assinadas.
- **Banco de dados:** Postgres do Supabase, no lugar do Firestore. O banco do Render não será usado, pois o Postgres gratuito do Render expira 30 dias após a criação.
- **Autenticação:** Supabase Auth, no lugar do Firebase Auth.
- **Arquivos:** Supabase Storage, no lugar do Firebase Storage. O disco do Render não guarda arquivos, pois é efêmero.
- **CI:** GitHub Actions, sem mudança, com lint e build a cada Pull Request.

2.2: Desenvolvimento local

- O `docker compose up` sobe o frontend, a API e a pilha local do Supabase (Postgres, Auth e Storage), por meio do Supabase CLI, no lugar dos emuladores Firebase.
- Testes e CI usam apenas o ambiente local, com variáveis de ambiente de exemplo no `.env.example`. Chaves reais, inclusive a `service_role` do Supabase, nunca vão para o repositório.

2.3: O que muda nos ADRs anteriores

- **ADR 001:** frontend, linguagem do back-end e CI permanecem. Firebase Auth, Firestore, Firebase Storage e Cloud Functions são substituídos pelos equivalentes acima.
- **ADR 005:** bucket privado e URL assinada de até 15 minutos (900 segundos) permanecem, agora no Supabase Storage. A compressão no cliente, as miniaturas e o nome por hash também permanecem. O lifecycle de 60 dias deixa de ser uma regra do bucket e passa a ser um job agendado que remove os arquivos antigos pela API do Storage. A capacidade passa a ser de 1 GB, ou seja, da ordem de 3.000 imagens de 300 KB.
- **ADR 006:** os claims `{tenantId, role}` passam a ficar no `app_metadata` do usuário, gravado apenas pelo back-end com a chave de serviço, e aparecem no JWT. Os quatro papéis (admin, conferente, motorista e financeiro) permanecem.
- As Security Rules deny-all dão lugar ao Row Level Security (RLS) do Postgres, ativado em todas as tabelas, com política negada por padrão, e a políticas de acesso do Storage por tenant.

2.4: Limites dos planos gratuitos e como lidar com eles

- **Render, web service:** desliga após 15 minutos sem tráfego e leva cerca de 1 minuto para voltar. Antes de cada demonstração, a equipe acorda a API com antecedência. Há 750 horas gratuitas por mês por workspace, então a API é o único web service em execução contínua.
- **Supabase:** dois projetos ativos, 500 MB de banco, 1 GB de arquivos, 5 GB de saída de dados e 50.000 usuários ativos por mês. O projeto é pausado após 7 dias sem atividade. A equipe mantém uma rotina de requisição periódica (por exemplo, agendada no GitHub Actions) e verifica o painel de uso antes de cada checkpoint.
- Nenhum cartão é cadastrado em nenhuma das plataformas. O custo é zero por construção, e o ultrapassar de um limite resulta em restrição do serviço, e não em cobrança.

2.5: Exceções ao Caderno

| Item do Caderno | O que a equipe fará | Compensação |
| --- | --- | --- |
| Base GCP + Firebase | Render + Supabase | Este ADR e a aprovação dos tutores |
| Firestore (NoSQL) | Postgres do Supabase | Modelagem por tenant e RLS em todas as tabelas |
| Firebase Auth com claims | Supabase Auth com `app_metadata` | Mesmos quatro papéis e mesmo `tenantId` |
| Security Rules deny-all com testes | RLS e políticas de Storage negadas por padrão, com testes | Teste de isolamento de tenant mantido (403 ou 404 entre empresas) |
| Emuladores Firebase no Compose | Pilha local do Supabase via Supabase CLI | `docker compose up` continua subindo o sistema inteiro |
| Alertas de orçamento em 50%, 80% e 100% (US$ 25, 40 e 50) | Não aplicável, pois não há faturamento | Sem cartão cadastrado e print do painel de uso de cada plataforma em cada checkpoint |
| Deploy na Semana 6 em Firebase Hosting ou Cloud Run, com Workload Identity | Deploy no Render | Endpoint de health check e registro de erros equivalentes aos pedidos |
| Nenhum recurso novo no GCP sem ADR ou aprovação | Nenhum serviço novo, pago ou gratuito, sem ADR ou aprovação do Tech Lead | Mesma regra, aplicada às novas plataformas |

## 3. Justificativas

Render e Supabase cobrem todas as peças da arquitetura já aprovada, com planos gratuitos que não exigem cartão. O Supabase reúne banco, autenticação e arquivos em um único serviço, e o RLS do Postgres permite aplicar o isolamento por tenant diretamente no banco, o que mantém a mesma garantia das Security Rules. A manutenção do React, do Node.js com TypeScript e do GitHub Actions preserva o que a equipe já conhece e reduz o impacto da troca.

Alternativas descartadas: ativar o Blaze do Firebase, por exigir cartão e faturamento; usar o Postgres gratuito do Render, por expirar em 30 dias; e guardar imagens no disco do Render, por perder os arquivos a cada reinício ou novo deploy.

Os planos gratuitos são adequados a protótipos e demonstrações, e não a produção. Como o escopo do ciclo é um MVP para o Demo Day, o custo zero compensa os limites, desde que eles estejam registrados e tenham plano de mitigação.

## 4. Consequências

**Positivas**

- Custo de US$ 0 em todo o ciclo, sem cartão e sem risco de ultrapassar o teto de US$ 50.
- Isolamento por tenant garantido no próprio banco, com RLS.
- Mesma stack de frontend, back-end e CI, o que limita o retrabalho.

**Negativas e riscos**

- O sistema se afasta da base do Caderno, e o que depende de GCP e Firebase nos critérios de avaliação pode precisar de equivalência aprovada. Sem a aprovação dos tutores, esta decisão não vale.
- A primeira requisição à API após inatividade leva cerca de 1 minuto, o que pode atrapalhar uma demonstração se não houver aquecimento prévio.
- O projeto do Supabase pausa após 7 dias sem atividade e fica indisponível até ser retomado, e o banco gratuito é limitado a 500 MB.
- O armazenamento de 1 GB reduz a capacidade de imagens em relação à estimativa do ADR 005, e o lifecycle de 60 dias passa a depender de um job próprio, que precisa de testes.
- A documentação do Render indica que os recursos gratuitos não devem ser usados em produção. Uma operação real exigiria planos pagos, fora do escopo deste ciclo.
- É preciso reescrever os testes de autorização e de isolamento de tenant para RLS e revisar os ADRs 001, 005 e 006 para refletir esta decisão.
