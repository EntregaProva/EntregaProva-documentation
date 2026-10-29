# ADR 001: Decisão da Stack Tecnológica

- **Status:** Aprovado
- **Data:** 13/10/2026
- **Decisores:** João Pedro Pellegrini e Maria Luisa

## 1. Contexto e Problema

O sistema exige a digitalização do fluxo de comprovantes de entregas, conciliando a captura operacional feita pelos motoristas com o backoffice da empresa. Os principais requisitos são:

1. Captura mobile simples dos comprovantes, feita pelos motoristas em campo.
2. Operadores do backoffice conciliam as fotos enviadas com os dados extraídos de arquivos XML e monitoram o aging das pendências.
3. A solução deve operar com custo baixíssimo na fase de testes, reduzindo a complexidade de manutenção de servidores.

## 2. Decisão Arquitetural

Foi decidida a adoção de uma arquitetura **Serverless e Web-Native**, dividida da seguinte forma:

### 2.1 Front-end

- **Linguagem e framework:** React com Vite e TypeScript.
- **Interface e estilização:** Tailwind CSS + componentes do shadcn/ui.
- **Captura mobile:** API HTML5 nativa do navegador.

### 2.2 Back-end

- **Linguagem e framework:** Node.js com TypeScript e Express, executado em **Cloud Run** (container serverless).
- **Autenticação:** Firebase Authentication.
- **Banco de dados:** Cloud Firestore (NoSQL).
- **Armazenamento:** Firebase Storage.

### 2.3 Testes e CI/CD

- **Testes:** Vitest.
- **CI/CD:** GitHub Actions.

### 2.4 Ambiente local

- Docker Compose com a API (Express), o frontend e os emuladores Firebase (Auth, Firestore e Storage). Até a Semana 4 tudo roda localmente, sem deploy na nuvem.

## 3. Justificativas

Foram selecionadas essas tecnologias porque a equipe já está familiarizada com grande parte delas. A infraestrutura serverless ajuda a reduzir o custo da operação. O uso de TypeScript com React, Tailwind e componentes prontos acelera a criação do painel administrativo, enquanto a captura nativa via HTML5 elimina a necessidade de publicar aplicativos nas lojas, reduzindo a fricção para os motoristas.

No back-end, o ecossistema Firebase (Auth, Firestore e Storage) combinado ao Cloud Run elimina a gestão de servidores dedicados e garante segurança nativa. O Cloud Run escala a zero quando não há tráfego, o que mantém o custo baixo, e a API em Express concentra o processamento de XMLs e documentos (incluindo a validação segura contra XXE) em uma topologia simples de entender, testar e rodar localmente com Docker Compose. O GitHub Actions e o Vitest asseguram automação de testes e deploy contínuo sem complexidade operacional.

## 4. Consequências

### Positivas

- **Custo baixo:** Cloud Run escala a zero e o Firebase tem camada gratuita generosa, o que ajuda a ficar dentro do teto de US$ 50 por equipe.
- **Sem gestão de servidores:** não há máquinas dedicadas para manter, aplicar patches ou monitorar.
- **Paridade local/nuvem:** a API roda como container no Docker Compose, com emuladores Firebase, e é a mesma imagem que sobe no Cloud Run.
- **Stack única em TypeScript:** frontend e backend compartilham linguagem, tipos e ferramentas de teste, o que acelera o desenvolvimento.
- **Sem lojas de aplicativos:** a captura via HTML5 dispensa publicação em lojas e simplifica o acesso dos motoristas.
- **Autenticação e armazenamento prontos:** Firebase Auth e Storage reduzem o código de segurança próprio.

### Negativas

- **Acoplamento ao Google Cloud/Firebase:** migrar para outro provedor exigiria reescrever integrações de Auth, Firestore e Storage.
- **Modelo NoSQL:** o Firestore tem consultas e agregações limitadas (sem joins), exigindo modelagem cuidadosa dos dados e consistência de agregados feita na aplicação.
- **Cold start:** com escala a zero, a primeira requisição após um período ocioso pode ter latência maior.
- **Mais configuração que Cloud Functions:** é preciso manter Dockerfile, configuração de deploy e a API Express, em troca de uma topologia mais clara e portável.
- **Captura limitada pelo navegador:** a API HTML5 oferece menos controle de câmera e nenhum modo offline completo, comparada a um app nativo.
- **Risco de custo:** sem monitoramento, o uso de Cloud Run, Firestore e Storage pode estourar o teto; são necessários alertas de orçamento em 50%, 80% e 100%.
- **Segurança sob responsabilidade do time:** Security Rules do Firestore/Storage e o isolamento entre clientes precisam ser bem escritos e testados.
