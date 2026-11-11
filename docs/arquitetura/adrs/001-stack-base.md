# ADR 001: Decisão da Stack Tecnológica

- **Status:** Aprovado
- **Data:** 13/10/2026 (revisão: 11/11/2026)
- **Decisores:** João Pedro Pellegrini e Maria Luisa

## 1. Contexto e Problema

O sistema exige a digitalização do fluxo de comprovantes de entregas, conciliando a captura operacional feita pelos motoristas com o backoffice da empresa. Os principais requisitos são:

1. Captura mobile simples dos comprovantes, feita pelos motoristas em campo.
2. Operadores do backoffice conciliam as fotos enviadas com os dados extraídos de arquivos XML e monitoram o aging das pendências.
3. A solução deve operar com custo baixíssimo na fase de testes, reduzindo a complexidade de manutenção de servidores.

## 2. Decisão Arquitetural

Foi decidida a adoção de uma arquitetura **Web-Native**, com frontend estático, API em container e serviços gerenciados para autenticação e banco, dividida da seguinte forma:

### 2.1 Front-end

- **Linguagem e framework:** React com Vite e TypeScript.
- **Interface e estilização:** Tailwind CSS + componentes do shadcn/ui.
- **Captura mobile:** API HTML5 nativa do navegador.
- **Hospedagem:** Firebase Hosting (plano Spark).

### 2.2 Back-end

- **Linguagem e framework:** Node.js com TypeScript e Express, executado como container no **Render** (plano Free).
- **Autenticação:** Firebase Authentication.
- **Banco de dados:** Cloud Firestore (NoSQL).
- **Armazenamento de imagens:** Supabase Storage (bucket privado), conforme o ADR 008.

### 2.3 Testes e CI/CD

- **Testes:** Vitest.
- **CI/CD:** GitHub Actions (detalhado no ADR 009).

### 2.4 Ambiente local

- Docker Compose com a API (Express), o frontend e os emuladores Firebase (Auth, Firestore e Storage). Até a Semana 4 tudo roda localmente, sem deploy na nuvem.

## 3. Justificativas

Foram selecionadas essas tecnologias porque a equipe já está familiarizada com grande parte delas. O uso de TypeScript com React, Tailwind e componentes prontos acelera a criação do painel administrativo, enquanto a captura nativa via HTML5 elimina a necessidade de publicar aplicativos nas lojas, reduzindo a fricção para os motoristas.

No back-end, Firebase Auth e Firestore evitam a gestão de servidores de identidade e de banco e entregam segurança nativa. A API em Express concentra o processamento de XMLs e documentos (incluindo a validação segura contra XXE) em uma topologia simples de entender, testar e rodar localmente com Docker Compose. O Render executa essa mesma API como container, o que mantém a paridade entre o ambiente local e o publicado.

A hospedagem no Render e no Firebase Hosting, ambas em plano gratuito e sem cartão cadastrado, foi escolhida para manter o custo em US$ 0 durante o ciclo (ADR 007). O GitHub Actions e o Vitest asseguram automação de testes e deploy sem complexidade operacional.

> **Revisão de 11/11/2026:** a versão original previa a API em Cloud Run e o armazenamento em Firebase Storage, com custo baseado em créditos do GCP. Como a equipe não terá faturamento vinculado (ADR 007), a API passou para o Render e as imagens para o Supabase Storage. Firebase Auth, Firestore e Hosting foram mantidos.

## 4. Consequências

### Positivas

- **Custo zero:** Render, Firebase (Spark), Supabase e UptimeRobot em planos gratuitos, sem cartão, o que elimina o risco de ultrapassar o teto de US$ 50 por equipe.
- **Sem gestão de servidores de identidade ou banco:** Firebase Auth e Firestore são gerenciados.
- **Paridade local/nuvem:** a API roda como container no Docker Compose e no Render, e os emuladores Firebase reproduzem Auth e Firestore localmente.
- **Stack única em TypeScript:** frontend e backend compartilham linguagem, tipos e ferramentas de teste, o que acelera o desenvolvimento.
- **Sem lojas de aplicativos:** a captura via HTML5 dispensa publicação em lojas e simplifica o acesso dos motoristas.

### Negativas

- **Cold start elevado:** no plano Free do Render a API desliga após cerca de 15 minutos sem tráfego e leva cerca de 1 minuto para voltar, acima dos 10 s que o Caderno tolera. A tela precisa mostrar "carregando" e a equipe acorda a API antes de demonstrações.
- **Planos gratuitos não são para produção:** os limites do Render, do Supabase e do Firebase Spark são adequados a um MVP de demonstração, não a uma operação real.
- **Acoplamento a mais de um provedor:** Firebase (Auth, Firestore, Hosting), Render e Supabase. Trocar qualquer um exige reescrever a integração correspondente.
- **Modelo NoSQL:** o Firestore tem consultas e agregações limitadas (sem joins), exigindo modelagem cuidadosa dos dados e consistência de agregados feita na aplicação.
- **Afastamento do Caderno:** o Caderno define a base comum como GCP + Firebase. As diferenças estão listadas como exceções no ADR 008 e dependem de aprovação dos tutores.
- **Captura limitada pelo navegador:** a API HTML5 oferece menos controle de câmera e nenhum modo offline completo, comparada a um app nativo.
- **Segurança sob responsabilidade do time:** Security Rules do Firestore, autorização na API e o isolamento entre clientes precisam ser bem escritos e testados.

## 5. Histórico de revisões

| Data | Alteração |
| --- | --- |
| 13/10/2026 | Versão original (API em Cloud Run, Firebase Storage). |
| 11/11/2026 | API movida para o Render, imagens para o Supabase Storage, Firebase Hosting explicitado. Substituições formalizadas nos ADRs 008 a 010. |
