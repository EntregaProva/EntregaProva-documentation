---
title: FinOps e Custos
---

# FinOps e Custos

Como o projeto controla o gasto em nuvem. A decisão completa está na [ADR 007 — Plano de Custo Zero](<../arquitetura/adrs/007_Plano de Custo Zero.md>), e esta página a resume.

## Limites do ciclo

| Item | Valor |
| :--- | :--- |
| Teto de gasto por equipe | US$ 50 |
| Teto até a Semana 4 (regra de ouro) | US$ 5, com meta de US$ 0 |
| Início de qualquer deploy na nuvem | Semana 6 |
| Gasto acumulado atual | A definir |

## Fases

=== "Fase 1 — custo zero (Semanas 2 a 4)"

    - Todo o desenvolvimento roda local com `docker compose up`, usando o Firebase Emulator Suite para Auth, Firestore e Storage.
    - Nenhum projeto GCP ou Firebase da equipe fica vinculado a uma conta de faturamento. Se um projeto Firebase for criado nessa fase, ele permanece no plano Spark, sem cartão.
    - Nenhum deploy na nuvem e nenhum recurso novo no GCP.

=== "Fase 2 — migração condicionada (a partir da Semana 6)"

    - A migração para o plano Blaze só acontece com necessidade concreta de deploy e exige aprovação do Tech Lead.
    - Antes de vincular o faturamento, a equipe cria o orçamento no GCP com alertas em 50%, 80% e 100%, equivalentes a US$ 25, US$ 40 e US$ 50, e guarda um print do console como prova.
    - A equipe define um responsável por acompanhar os alertas e agir sobre eles.
    - Um único projeto de nuvem por equipe, em uma única região, somente com os recursos já previstos nos ADRs.

## Controles

- Testes automáticos e CI usam apenas emuladores, configurados por variáveis de ambiente, e nunca recebem credenciais de projetos reais.
- Chaves e credenciais não vão para o repositório. O `.env.example` traz apenas valores de exemplo.
- O uso do Firestore é acompanhado contra as cotas diárias do plano gratuito.
- Qualquer serviço fora do previsto exige ADR ou aprovação do Tech Lead.

## Serviços de deploy

O README do repositório de código descreve o deploy do frontend no Firebase Hosting e da API no Render, ambos em plano gratuito. Veja a lista completa em [Como rodar o projeto](../como-rodar.md#tecnologias).

!!! warning "Limite do plano gratuito"
    Segundo a ADR 007, o Cloud Storage for Firebase exige o plano Blaze, e novos deploys de Cloud Functions não estão disponíveis no Spark. Por isso o custo zero se sustenta enquanto tudo roda nos emuladores. Os alertas de orçamento avisam, mas não interrompem o uso.

## Pendências de definição

| Item | Situação |
| :--- | :--- |
| Responsável por acompanhar os alertas de orçamento | A definir |
| Titular do cartão para o plano Blaze, se houver migração | A definir |
| Gasto acumulado e evidências (prints do console) | A definir |
