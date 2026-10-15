# EntregaProva — Documentação

Repositório de documentação do projeto **EntregaProva**, desenvolvido no programa **AI Lab Makers — Engenharia de Software**, no ciclo de projetos B2B.

O EntregaProva é uma solução de **logística documental** para transportadoras regionais. Seu objetivo é reduzir atrasos e perdas de comprovantes de entrega, permitindo a captura do canhoto pelo celular, a conciliação com XML de NF-e/CT-e, o acompanhamento de pendências e a geração do pacote necessário para comprovação e faturamento do frete. 

## Problema

Transportadoras frequentemente enfrentam comprovantes físicos que chegam tarde, se perdem ou ficam ilegíveis. Isso atrasa a comprovação da entrega e, consequentemente, o faturamento do frete. 

## Solução proposta

O MVP contempla:

- Importação de XML e criação de entregas pendentes.
- Captura de foto, recebedor, data e hora pelo celular.
- Conferência do comprovante contra os dados do XML.
- Painel de pendências e aging por embarcador.
- Geração do pacote de comprovação.

## Escopo do MVP

| Inclui | Não inclui nesta fase |
|---|---|
| Captura mobile de comprovante | OCR |
| Conciliação com XML de NF-e/CT-e | Rastreamento contínuo |
| Validação e segurança do XML | Consulta à SEFAZ |
| Painel de pendências e aging | Roteirização |
| Geração de pacote de comprovação | ICP-Brasil |
| Reenvio de imagens sem duplicação | Modo offline completo |

## Equipe

| Papel | Integrante |
|---|---|
| Product Owner | Maria Luisa Oliveira Lima |
| Tech Lead | João Pedro Pellegrini de Almeida |
| Frontend | Ana Teresa Schneider Brandão |
| Backend | João Victor Pereira Santos |
| QA | Marcelo Vitor Machado da Silva Filho |
| DevOps | Felipe Júnior Duarte da Silva | 

## Convenções

- Documentos em **Markdown**.
- Nomes de arquivos em **kebab-case**, por exemplo: `estrategia-de-testes.md`.
- Toda decisão relevante deve possuir data, responsável, contexto, decisão e consequências.
- Evidências de testes devem incluir data, resultado esperado, resultado obtido e status.

## Status do projeto

- **Ciclo:** AI Lab Makers — Projetos B2B.
- **Período:** 04 de outubro a 05 de dezembro de 2026.
- **Fase atual:** documentação inicial e planejamento.
