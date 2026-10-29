# ADR 005: Armazenamento de Imagens dos Comprovantes

**Status:** Aprovado
**Data:** 28/10/2026
**Decisores:** João Pedro Pellegrini

## 1. Contexto e Problema

O EntregaProva recebe fotos de comprovantes de entrega (canhotos) capturadas pelo celular dos motoristas. Essas imagens são a prova que sustenta o faturamento do frete e precisam ser guardadas, exibidas no painel e reunidas no pacote de comprovação. Os principais requisitos são:

1.1: Imagens podem conter dados pessoais (nome, assinatura e documento do recebedor), portanto não podem ficar acessíveis publicamente
1.2: O painel do backoffice lista muitas entregas por vez e não deve baixar a foto original em cada linha
1.3: O envio acontece em campo, com rede móvel instável, então o arquivo precisa ser leve
1.4: O custo de Storage entra no teto de US$ 50 por equipe e cresce com o número e o tamanho das imagens, por isso precisa ser controlado desde o início
1.5: O reenvio de uma mesma imagem não pode gerar arquivos duplicados

## 2. Decisão Arquitetural

Foi decidido armazenar as imagens no Firebase Storage (Cloud Storage), com acesso privado e retenção limitada, dividido da seguinte forma:

2.1: Acesso e segurança

- Bucket privado, sem leitura pública. As Security Rules seguem o padrão deny-all, e o acesso é liberado apenas por regras de autorização por tenant e papel.
- A leitura das imagens é feita por URL assinada com validade de até 15 minutos, gerada pelo back-end (Node.js com TypeScript) somente após verificar o tenant e o papel do usuário.
- A URL assinada não é guardada no banco. O Firestore guarda apenas o caminho do arquivo, e uma nova URL é gerada a cada visualização.

2.2: Ciclo de vida e retenção

- Regra de lifecycle de 60 dias, que apaga automaticamente as imagens após esse prazo.
- O pacote de comprovação deve ser gerado e entregue dentro desse prazo.

2.3: Otimização de tamanho

- Compressão no cliente antes do upload, com lado maior de 1280 px e alvo de aproximadamente 300 KB por imagem.
- Geração de miniaturas para as listas e telas de pendências. A tela de detalhe carrega a imagem comprimida, e não a miniatura.
- Nome do arquivo derivado do hash do conteúdo (SHA-256), para que o reenvio sobrescreva o mesmo objeto em vez de criar um duplicado.

2.4: Organização dos arquivos

- Caminho com separação por tenant, por exemplo `tenants/{tenantId}/entregas/{entregaId}/{hash}.jpg`, e miniaturas em `.../thumbs/{hash}.jpg`.

## 3. Justificativas

O Firebase Storage já faz parte da stack aprovada no ADR 001, é integrado ao Auth e às Security Rules e dispensa a gestão de servidores. O bucket privado com URL assinada de curta duração impede que um link vazado continue válido por muito tempo e mantém o isolamento entre empresas clientes, já que a URL só é emitida depois da checagem de autorização. As URLs de download permanentes do Firebase não foram escolhidas, pois não expiram.

A compressão no cliente reduz o tempo de envio em rede móvel e é a principal alavanca de custo, porque cada imagem passa de vários MB para cerca de 300 KB. Como exemplo de planejamento, 10.000 imagens ocupariam cerca de 3 GB, o que mantém o custo de armazenamento baixo diante do teto de US$ 50. Essa conta deve ser revisada com os preços vigentes do GCP, pois é uma estimativa e não um valor garantido. As miniaturas evitam baixar a imagem completa em cada linha das listas, reduzindo a saída de dados e o tempo de carregamento do painel.

O lifecycle de 60 dias limita o crescimento do Storage e atende ao princípio de minimização da LGPD, já que as fotos podem conter dados pessoais e não devem ser mantidas além da necessidade. O nome por hash do conteúdo resolve o requisito de reenvio sem duplicação.

## 4. Consequências

**Positivas**

- Imagens nunca ficam expostas publicamente e o acesso é auditável.
- Custo de Storage previsível e com crescimento limitado.
- Painel mais rápido e envio mais confiável em campo.

**Negativas e riscos**

- Comprovantes com mais de 60 dias deixam de existir. Se o cliente precisar de retenção maior para auditoria ou disputa de frete, a regra de lifecycle precisará ser revista em um novo ADR.
- A compressão em 1280 px pode deixar ilegível um canhoto com letra pequena. É preciso validar a qualidade com imagens reais na Semana 2 e 3.
- O back-end passa a ser responsável por emitir as URLs assinadas, o que adiciona uma chamada a cada visualização.
- É preciso escrever testes que verifiquem que um usuário da empresa A não consegue obter URL de imagem da empresa B.
- Qualquer recurso novo no GCP para esse fluxo (por exemplo, Cloud Function para gerar miniaturas) exige aprovação do Tech Lead.
