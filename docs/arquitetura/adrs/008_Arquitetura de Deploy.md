# ADR 008: Arquitetura de Deploy Confirmada 

**Status:** Aprovado
**Data:** 11/11/2026
**Decisores:** João Pedro Pellegrini de Almeida

## 1. Contexto e Problema

O ADR 007 (01/11/2026) decidiu trocar GCP + Firebase por Render + Supabase, com Postgres, Supabase Auth, RLS e Supabase Storage. A arquitetura que a equipe efetivamente construiu e confirmou em 06/11/2026 (runbook do backend) é diferente: Firebase Auth e Firestore foram mantidos, e o Supabase ficou apenas com o armazenamento dos comprovantes. O ADR 001 também ainda previa Cloud Run.

Hoje há decisões registradas que contradizem o que está no ar. Os principais requisitos desta decisão são:

1.1: Registrar em um único lugar a arquitetura real de deploy, para tutores e novos integrantes
1.2: Manter o custo em US$ 0 e sem cartão em nenhuma plataforma, conforme o ADR 007
1.3: Preservar o isolamento por tenant e os papéis já definidos nos ADRs 002 e 006
1.4: Listar de forma explícita cada exceção ao Caderno de Projetos B2B, para aprovação dos tutores
1.5: Indicar o que muda nos ADRs anteriores

## 2. Decisão Arquitetural

Foi decidida a seguinte arquitetura, dividida por responsabilidade:

2.1: Componentes

| Componente | Plataforma | Plano |
| --- | --- | --- |
| Frontend (React + Vite) | Firebase Hosting | Spark |
| API (Node.js, TypeScript, Express) | Render, como container (Dockerfile do backend) | Free |
| Autenticação | Firebase Authentication, com custom claims `{tenantId, role}` | Spark |
| Banco de dados | Cloud Firestore, com Security Rules deny-all para clientes | Spark |
| Imagens dos comprovantes | Supabase Storage, bucket privado | Free |
| Monitoramento | Health check do Render e UptimeRobot | Free |
| CI/CD | GitHub Actions | Free |

2.2: Regras de acesso

- O cliente nunca acessa Firestore nem Storage diretamente para dados de negócio. Todo acesso passa pela API, que valida o token Firebase, o tenant e o papel antes de qualquer leitura, escrita ou emissão de link.
- O `tenantId` vem sempre do token, nunca do corpo da requisição (ADR 006).
- As Security Rules do Firestore continuam deny-all para clientes.

2.3: Armazenamento de imagens (Supabase Storage)

- Bucket **privado**, com limite de 300000 bytes por arquivo e tipos permitidos image/jpeg, image/png, image/webp e application/pdf (compatibilidade legada). O servidor confere essas condições na inicialização e falha com mensagem genérica se a configuração for insegura.
- Sem políticas de leitura pública e sem acesso direto de usuários anônimos ou autenticados ao bucket.
- A chave secreta do Supabase fica somente no backend.
- A API autoriza antes de fazer upload ou assinar: token Firebase verificado, tenant e motorista da entrega.
- O banco guarda apenas o caminho privado do arquivo. Links assinados valem até 15 minutos e não são persistidos.
- Upload com `upsert=false` e caminhos determinísticos, para que o reenvio não crie duplicatas (ADR 004).

2.4: Segredos

- Variáveis de ambiente e *Secret File* (`firebase-admin.json`) configurados no Render. No Git fica apenas o `.env.example`.
- Não há Secret Manager, Artifact Registry nem Cloud Run no projeto.

2.5: O que muda nos ADRs anteriores

- **ADR 001:** revisado para refletir Render, Firebase Hosting e Supabase Storage.
- **ADR 005:** o armazenamento passa de Firebase Storage para Supabase Storage. Bucket privado, URL assinada de 15 minutos, compressão no cliente, miniaturas e nome por hash permanecem. O lifecycle de 60 dias passa a ser um job agendado que remove os arquivos pela API do Storage, e a capacidade passa a ser de 1 GB.
- **ADR 006:** permanece válido (Firebase Auth com claims `tenantId` e `role`).
- **ADR 007:** substituído por este ADR. Permanecem a regra de custo zero, sem cartão, e o uso do Render. **Não** foram adotados Postgres do Supabase, Supabase Auth nem RLS.

2.5.1: Exceções ao Caderno

| Item do Caderno | O que a equipe faz | Compensação |
| --- | --- | --- |
| Base GCP + Firebase com Cloud Run | API no Render; Firebase mantido para Auth, Firestore e Hosting | Este ADR e a aprovação dos tutores |
| Cloud Storage para imagens | Supabase Storage, bucket privado | Mesmas regras de acesso do ADR 005 |
| Plano Blaze, alertas de orçamento (US$ 25, 40 e 50) e meta de gasto de US$ 12 | Planos gratuitos, sem faturamento | Prints do painel de uso e do plano Spark (`finops.md`) |
| Cold start de até 10 s | Cerca de 1 minuto no Render Free | Tela de carregando e aquecimento antes de demonstrações |
| Secret Manager, Artifact Registry e retenção de 5 imagens | Não aplicável | Segredos no Render; sem registro de imagens próprio |

Exceções de CI/CD e de monitoramento estão nos ADRs 009 e 010.

## 3. Justificativas

A arquitetura híbrida mantém o que já estava implementado e testado (Firebase Auth, Firestore, Security Rules, emuladores locais) e usa o Supabase somente onde o plano gratuito do Firebase não atende: o Cloud Storage for Firebase exige o plano Blaze, que pede faturamento e cartão. Manter Auth e Firestore evita reescrever autorização, testes de isolamento de tenant e modelagem de dados.

Alternativas descartadas: migrar tudo para Supabase (Postgres, Auth e RLS), por exigir reescrever autorização e testes em fase avançada do ciclo; ativar o Blaze, por exigir cartão; guardar imagens no disco do Render, por ser efêmero.

## 4. Consequências

**Positivas**

- Custo de US$ 0 e nenhum cartão cadastrado.
- Nenhuma reescrita da camada de autorização e do modelo de dados.
- Arquitetura documentada de forma consistente com o repositório.

**Negativas e riscos**

- Três provedores para operar (Firebase, Render e Supabase), cada um com seus limites gratuitos.
- A API leva cerca de 1 minuto para responder após inatividade, acima do limite de 10 s do Caderno.
- O projeto do Supabase pausa após 7 dias sem atividade, e o armazenamento gratuito é de 1 GB.
- O lifecycle de 60 dias depende de um job próprio, que precisa de teste e de monitoramento.
- O runbook cita os papéis `admin/operator/driver`, enquanto o ADR 006 define `admin`, `conferente`, `motorista` e `financeiro`. É preciso alinhar os nomes no código e na documentação.
- Sem a aprovação dos tutores, as exceções acima não valem.
