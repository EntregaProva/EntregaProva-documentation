---
title: Início
hide:
  - toc
---

<div class="ep-hero" markdown>

<span class="ep-tagline">:material-truck-delivery: Canhoto conferido. Frete faturado.</span>

# EntregaProva

Solução digital B2B de conciliação fiscal e comprovação de entregas para o transporte rodoviário de cargas.

[:material-rocket-launch: Visão e Escopo](produto/visao-e-escopo.md){ .md-button }
[:material-account-group: Conheça as personas](produto/personas.md){ .md-button .md-button--secondary }

</div>

## :material-bullseye-arrow: Objetivo do projeto

Eliminar o gargalo do canhoto de papel no transporte de cargas. O ciclo de faturamento e conciliação, que hoje leva semanas, passa a levar poucos minutos. Isso acontece com a captura web mobile e a conciliação direta com as notas fiscais eletrônicas (NF-e/CT-e).

Dúvida sobre algum termo? Consulte o [Glossário](glossario.md).

## :material-star-four-points-outline: O que o EntregaProva faz

<div class="grid cards" markdown>

-   :material-file-xml-box: **Importação de XML**

    ---

    Identificação de entregas a partir de NF-e e CT-e.

-   :material-camera-outline: **Comprovantes digitais**

    ---

    Captura de foto e registro dos dados do recebimento pelo celular.

-   :material-compare-horizontal: **Conferência**

    ---

    Comparação dos comprovantes com os dados fiscais disponíveis.

-   :material-clock-alert-outline: **Painel de pendências**

    ---

    Acompanhamento de entregas, atrasos e pendências por embarcador.

-   :material-package-variant-closed-check: **Pacote de comprovação**

    ---

    Organização dos documentos para apoiar o faturamento.

</div>

## :material-timeline-check-outline: Como funciona

O fluxo completo, da nota fiscal ao faturamento, em seis etapas.

<div class="ep-steps" markdown>

1.  :material-file-upload-outline:{ .ep-step-icon } **Importar**

    Carregar os documentos fiscais em XML.

2.  :material-clipboard-list-outline:{ .ep-step-icon } **Organizar**

    Identificar e registrar as entregas pendentes de comprovação.

3.  :material-cellphone-check:{ .ep-step-icon } **Capturar**

    Registrar a fotografia do comprovante e os dados do recebimento pelo celular.

4.  :material-text-box-check-outline:{ .ep-step-icon } **Conferir**

    Comparar os registros com as informações fiscais disponíveis.

5.  :material-chart-timeline-variant:{ .ep-step-icon } **Acompanhar**

    Visualizar pendências e o tempo decorrido até a comprovação.

6.  :material-package-variant-closed:{ .ep-step-icon } **Consolidar**

    Gerar um pacote documental para apoiar o faturamento.

</div>

## :material-flag-checkered: Escopo do MVP

| Inclui | Não inclui nesta fase |
| :--- | :--- |
| Captura mobile de comprovante | OCR |
| Conciliação com XML de NF-e/CT-e | Rastreamento contínuo |
| Validação e segurança do XML | Consulta à SEFAZ |
| Painel de pendências e aging | Roteirização |
| Geração de pacote de comprovação | ICP-Brasil |
| Reenvio de imagens sem duplicação | Modo offline completo |

A matriz completa, com o que o produto é e não é, está em [Visão e Escopo](produto/visao-e-escopo.md).

## :material-compass-outline: Por onde começar

<div class="grid cards" markdown>

-   :material-flag-checkered: **Visão e Escopo**

    ---

    Problema, escopo, proposta de valor e LGPD.

    [:octicons-arrow-right-24: Abrir](produto/visao-e-escopo.md)

-   :material-account-group: **Personas**

    ---

    Motorista de Campo (Seu Carlos) e Conferente de Faturamento (Juliana).

    [:octicons-arrow-right-24: Abrir](produto/personas.md)

-   :material-map-marker-path: **Jornadas do Usuário**

    ---

    Etapas, pontos de contato e regras de negócio das duas jornadas.

    [:octicons-arrow-right-24: Abrir](produto/jornada.md)

-   :material-view-dashboard-outline: **Canvas MVP**

    ---

    Proposta, funcionalidades, custo e métricas em uma página.

    [:octicons-arrow-right-24: Abrir](produto/canvas-mvp.md)

-   :material-fish: **Diagrama de Ishikawa**

    ---

    Causa-raiz do atraso de faturamento nos 6Ms.

    [:octicons-arrow-right-24: Abrir](produto/ishikawa.md)

-   :material-format-list-checks: **Backlog MoSCoW**

    ---

    Priorização, critérios de aceite mensuráveis e histórias de usuário.

    [:octicons-arrow-right-24: Abrir](backlog/index.md)

</div>

## :material-cog-outline: Para quem constrói

<div class="grid cards" markdown>

-   :material-api: **Referência da API**

    ---

    Contrato OpenAPI v0.1 com as rotas das jornadas do MVP.

    [:octicons-arrow-right-24: Abrir](api/referencia.md)

-   :material-sitemap-outline: **Decisões de Arquitetura**

    ---

    ADRs 001 a 007: stack, dados, XML, captura mobile, imagens, autenticação e custo zero.

    [:octicons-arrow-right-24: Abrir](arquitetura/adrs/001-stack-base.md)

-   :material-test-tube: **Estratégia de Testes**

    ---

    Isolamento multitenant, ferramental e diretrizes de asserção da API.

    [:octicons-arrow-right-24: Abrir](qualidade/estrategia-testes.md)

-   :material-table-check: **Matriz de Rastreabilidade**

    ---

    Requisitos, critérios de aceite e cobertura atual dos testes.

    [:octicons-arrow-right-24: Abrir](rastreabilidade.md)

-   :material-check-decagram-outline: **Definition of Done**

    ---

    Critérios para considerar uma entrega concluída.

    [:octicons-arrow-right-24: Abrir](gestao/dod.md)

-   :material-magnify-scan: **Pesquisa e Defensibilidade**

    ---

    Evidências de mercado, hipótese de defensibilidade e métrica da demo.

    [:octicons-arrow-right-24: Abrir](produto/pesquisa-e-evidencias.md)

-   :material-file-code-outline: **Exemplos de XML**

    ---

    Arquivos de NF-e usados nos cenários de teste e validação.

    [:octicons-arrow-right-24: Abrir](produto/exemplos-xml.md)

-   :material-cash-check: **FinOps e Custos**

    ---

    Teto de gasto, fases do plano de custo zero e controles.

    [:octicons-arrow-right-24: Abrir](gestao/finops.md)

</div>

## :material-account-multiple-outline: Quem faz

O projeto é desenvolvido pelo Grupo 3 do Projeto de Extensão Makers do AI Lab da UnB. Conheça a [equipe](equipe.md).
