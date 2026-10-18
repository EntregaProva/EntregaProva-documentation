# ADR 001: Decisão da Stack Tecnológica

- **Status:** Aprovado
- **Data:** 13/10/2026
- **Decisores:** João Pedro Pellegrini e Maria Luisa

## 1. Contexto e Problema

O sistema exige a digitalização do fluxo de comprovantes de entregas, conciliando a captura operacional feita pelos motoristas com o backoffice da empresa. Os principais requisitos são:

1. Captura mobile simples dos comprovantes feita pelos motoristas em campo.
2. Operadores do backoffice conciliarem as fotos enviadas com os dados extraídos de arquivos XML e monitorarem o aging das pendências.
3. A solução deve operar com custo baixíssimo na fase de testes, reduzindo a complexidade de manutenção de servidores.

## 2. Decisão Arquitetural

Foi decidida a adoção de uma arquitetura **Serverless e Web-Native**, dividida da seguinte forma:

### 2.1 Front-end

- **Linguagem e framework:** React com Vite e TypeScript.
- **Interface e estilização:** Tailwind CSS + componentes do shadcn/ui.
- **Captura mobile:** API HTML5 nativa do navegador.

### 2.2 Back-end

- **Linguagem:** Node.js com TypeScript.
- **Autenticação:** Firebase Authentication.
- **Banco de dados:** Cloud Firestore (NoSQL).
- **Armazenamento:** Firebase Storage.

### 2.3 Teste e CI/CD

- Vitest ou Jest.
- GitHub Actions.

## 3. Justificativas

Foram selecionadas essas tecnologias porque a equipe já está familiarizada com grande parte delas. A infraestrutura serverless ajuda a reduzir o custo da operação. O uso de TypeScript com React, Tailwind e componentes prontos acelera a criação do painel administrativo, enquanto a captura nativa via HTML5 elimina a necessidade de publicar aplicativos nas lojas, reduzindo a fricção para os motoristas.

No back-end, o ecossistema Firebase (Auth, Firestore, Storage e Cloud Functions) elimina a gestão de servidores dedicados, automatiza o processamento de XMLs e documentos via eventos e garante segurança nativa. O GitHub Actions e o Vitest asseguram automação de testes e deploy contínuo sem complexidade operacional.
