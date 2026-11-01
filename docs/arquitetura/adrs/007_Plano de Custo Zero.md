# ADR 007: Plano de Custo Zero 

**Status:** Aprovado
**Data:** 01/11/2026
**Decisores:** João Pedro Pellegrini

## 1. Contexto e Problema

O ciclo B2B define um teto de US$ 50 por equipe e uma regra de ouro: até a Semana 4 tudo roda no computador, com Docker Compose e emuladores, e o gasto na nuvem deve ficar em no máximo US$ 5. Qualquer deploy na nuvem (Firebase Hosting, Cloud Run, preview em PR) só entra na Semana 6. A stack aprovada no ADR 001 usa Firebase Auth, Firestore, Storage e Cloud Functions, e o ADR 005 depende do Storage. Os principais requisitos são:

1.1: Desenvolver e testar o sistema inteiro sem gastar, enquanto não há necessidade de nuvem
1.2: Não exigir cartão de crédito de nenhum integrante na fase de desenvolvimento
1.3: Saber desde já o que o plano gratuito do Firebase (Spark) não cobre, para evitar surpresas na hora do deploy
1.4: Manter o gasto total dentro do teto de US$ 50, com alertas e um responsável por agir sobre eles
1.5: Garantir que testes automáticos e o CI nunca acessem recursos reais por engano

## 2. Decisão Arquitetural

Foi decidido adotar o custo zero como padrão até a Semana 4, com o plano Spark e emuladores locais, e permitir a migração para o plano Blaze apenas sob condições definidas, dividido da seguinte forma:

2.1: Fase 1, custo zero (Semanas 2 a 4)

- Todo o desenvolvimento roda local com `docker compose up`, usando o Firebase Emulator Suite para Auth, Firestore e Storage.
- Nenhum projeto GCP ou Firebase da equipe fica vinculado a uma conta de faturamento. Se um projeto Firebase for criado nessa fase, ele permanece no plano Spark, sem cartão.
- Nenhum deploy na nuvem e nenhum recurso novo no GCP nessa fase.
- Meta de gasto: US$ 0, com limite de US$ 5 conforme a regra de ouro.

2.2: Fase 2, migração condicionada para o Blaze (a partir da Semana 6)

- A migração para o Blaze só acontece quando houver necessidade concreta de deploy, e exige aprovação do Tech Lead.
- Antes de vincular o faturamento, a equipe cria o orçamento no GCP com alertas em 50%, 80% e 100%, equivalentes a US$ 25, US$ 40 e US$ 50, e guarda um print do console como prova.
- A equipe define um responsável por acompanhar os alertas e agir sobre eles.
- Um único projeto de nuvem por equipe, em uma única região, e somente com os recursos já previstos nos ADRs.

2.3: Controles de custo e de segurança dos testes

- Testes automáticos e CI usam apenas emuladores, configurados por variáveis de ambiente, e nunca recebem credenciais de projetos reais.
- Chaves e credenciais não vão para o repositório. O `.env.example` traz apenas valores de exemplo.
- Uso do Firestore é acompanhado contra as cotas diárias do plano gratuito.
- Qualquer serviço fora do previsto exige ADR ou aprovação do Tech Lead.

## 3. Justificativas

O Emulator Suite permite exercitar Auth, Firestore e Storage sem consumir cota nem gerar cobrança, e o Spark dispensa forma de pagamento. Isso permite que todos os integrantes trabalhem no mesmo ambiente sem custo e sem cartão, e é o que a regra de ouro do ciclo pede.

É preciso reconhecer um limite do plano gratuito: o Cloud Storage for Firebase exige o plano Blaze, e novos deploys de Cloud Functions também não estão disponíveis no Spark. Como o ADR 001 e o ADR 005 dependem de ambos, o custo zero só se sustenta enquanto tudo roda nos emuladores. Por isso a decisão trata o Spark como a fase de desenvolvimento, e não como o plano final de produção. O Blaze mantém as cotas gratuitas, e ativá-lo não significa que tudo passa a ser cobrado, mas passa a permitir cobrança por uso.

Os alertas de orçamento avisam, mas não interrompem o uso, e por isso precisam de um responsável designado. A decisão de adiar o Blaze até a Semana 6 reduz o tempo de exposição a cobranças e concentra o gasto na fase em que ele é necessário. Alternativas descartadas: ativar o Blaze desde o início, por gastar sem necessidade e exigir cartão de um integrante, e trocar a stack por serviços 100% gratuitos, por contrariar o ADR 001.

## 4. Consequências

**Positivas**

- Gasto zero e sem cartão durante o desenvolvimento.
- Ambiente igual para todos os integrantes, reproduzível com um único comando.
- Testes seguros contra gastos acidentais.

**Negativas e riscos**

- Os emuladores podem se comportar de forma diferente da nuvem, por exemplo em URLs assinadas do Storage e em Security Rules. Esses pontos precisam ser revalidados no primeiro deploy.
- Como Storage e Functions exigem o Blaze, o deploy completo não será possível sem vincular faturamento. É preciso definir quem será o titular do cartão antes da Semana 6.
- Alertas de orçamento não impedem o gasto. Sem responsável atento, o teto de US$ 50 pode ser ultrapassado.
- O primeiro deploy concentra riscos de configuração (regiões, permissões, regras de segurança) e deve ser planejado com antecedência.
- Se o time precisar subir algo para a nuvem antes da Semana 6, será necessário um novo ADR ou aprovação do Tech Lead.
