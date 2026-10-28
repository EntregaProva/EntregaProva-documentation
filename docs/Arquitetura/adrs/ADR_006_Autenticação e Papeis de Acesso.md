# ADR 006: Autenticação e Papéis de Acesso

**Status:** Aprovado
**Data:** 28/10/2026
**Decisores:** João Pedro Pellegrini

## 1. Contexto e Problema

O EntregaProva é usado por mais de uma transportadora, e cada uma tem usuários com funções diferentes no fluxo de comprovação de entregas. Os dados de uma empresa nunca podem aparecer para outra, e dentro da mesma empresa cada pessoa só deve fazer o que o seu papel permite. Os principais requisitos são:

1.1: Isolamento entre empresas clientes (tenants), com erro 403 ou 404 quando um usuário tenta acessar dados de outro tenant
1.2: Quatro papéis com permissões distintas: admin, conferente, motorista e financeiro
1.3: A mesma regra de acesso deve valer no back-end, no Firestore, no Storage e no frontend, sem consultar o banco a cada requisição para descobrir quem o usuário é
1.4: O motorista acessa pelo celular em campo, então o login precisa ser simples e a sessão não pode depender de chamadas extras
1.5: A solução deve operar com custo baixíssimo e sem gerir servidores de identidade, conforme o ADR 001

## 2. Decisão Arquitetural

Foi decidido usar o Firebase Authentication com custom claims `{tenantId, role}` no token de cada usuário, dividido da seguinte forma:

2.1: Identidade e claims

- Autenticação: Firebase Authentication, já aprovado no ADR 001.
- Cada usuário recebe dois custom claims: `tenantId` (empresa a que pertence) e `role` (um dos quatro papéis).
- Os claims são definidos apenas pelo back-end, com o Admin SDK. O cliente nunca grava os próprios claims.
- Cada usuário pertence a um único tenant e tem um único papel.

2.2: Papéis

- **admin:** gerencia usuários, papéis e configurações do tenant.
- **conferente:** importa XMLs, confere o comprovante contra os dados da NF-e/CT-e e aprova ou rejeita.
- **motorista:** captura e envia a foto, o recebedor, a data e a hora das próprias entregas.
- **financeiro:** consulta pendências e aging por embarcador e gera o pacote de comprovação.

2.3: Aplicação das regras

- Back-end: um middleware valida o token a cada requisição, lê `tenantId` e `role` dos claims e nega por padrão qualquer rota sem permissão explícita para o papel.
- Firestore e Storage: Security Rules deny-all, liberando o acesso apenas quando o `tenantId` do documento ou do caminho for igual ao claim do token e o papel permitir a operação.
- Frontend: usa o papel apenas para mostrar ou esconder telas. A decisão de acesso nunca depende só do frontend.
- O `tenantId` nunca é aceito vindo do corpo da requisição. Sempre vem do token.

2.4: Ciclo de vida dos claims

- Criação do usuário e atribuição de claims por uma rota do back-end acessível apenas ao admin.
- Alteração de papel ou remoção de usuário revoga os refresh tokens, para que a mudança valha sem esperar o token expirar.
- O primeiro admin de cada tenant é criado por script de seed, e não por cadastro aberto.

## 3. Justificativas

Os custom claims vão dentro do token e podem ser lidos pelo back-end e pelas Security Rules sem consultar o Firestore, o que reduz leituras, custo e latência. Isso também permite aplicar a mesma regra em todas as camadas a partir de uma única fonte de verdade, e é o que torna possível o isolamento por tenant no Storage, conforme o ADR 005, e no Firestore. Como os claims só podem ser escritos pelo Admin SDK, o usuário não consegue elevar o próprio papel nem trocar de empresa.

A alternativa de guardar tenant e papel em uma coleção de usuários no Firestore foi descartada porque exigiria uma leitura extra a cada requisição e nas regras de segurança, aumentando custo e complexidade. Usar um projeto de Auth por tenant (multi-tenancy do Identity Platform) também foi descartado por adicionar configuração e possível custo fora do escopo do MVP.

Manter um papel por usuário simplifica as regras e os testes. Os quatro papéis cobrem as jornadas do MVP descritas na ficha do projeto.

## 4. Consequências

**Positivas**

- Isolamento por tenant e controle por papel aplicados de forma uniforme no back-end, Firestore e Storage.
- Sem leitura extra no banco para autorizar cada requisição.
- Testes de isolamento simples de escrever: basta gerar tokens de dois tenants e comparar as respostas.

**Negativas e riscos**

- Mudanças de papel só chegam ao token no próximo refresh. Por isso é preciso revogar os tokens ao alterar claims.
- O limite de tamanho dos custom claims (1000 bytes) impede guardar permissões detalhadas. Hoje só há `tenantId` e `role`, e qualquer permissão mais fina exigirá novo ADR.
- Um usuário que precise atuar em dois tenants ou ter dois papéis não é suportado nesta versão.
- É preciso escrever testes de autorização para cada papel e o teste de isolamento de tenant, que exige erro 403 ou 404 para acessos entre empresas.
- A matriz de permissões por papel e por rota deve ser documentada e mantida junto do OpenAPI v0.1.
