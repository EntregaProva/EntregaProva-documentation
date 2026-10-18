# ADR 004: Captura Mobile via PWA e Upload Sem Duplicação

- **Status:** Aprovado
- **Data:** 18/10/2026
- **Decisores:** João Pedro Pellegrini

## 1. Contexto e Problema

O motorista precisa fotografar o canhoto da entrega pelo celular, em campo, onde o sinal costuma ser ruim. Um app nativo exigiria publicar nas lojas, manter duas versões e pedir que o motorista instalasse algo, e já está fora do escopo do MVP. Além disso, se a rede cair no meio do envio, o motorista vai enviar de novo. Sem proteção, o mesmo comprovante entra duas vezes e bagunça o painel de pendências, o aging e o pacote de faturamento.

## 2. Decisão

- **PWA em vez de app nativo:** a captura usa o front-end React + Vite, com a câmera aberta pela API HTML5 do navegador. O motorista acessa por link e pode instalar na tela inicial, sem loja de apps.
- **Chave da nota como ID da entrega:** o ID da entrega no Firestore é a chave de acesso de 44 dígitos, então a mesma nota nunca cria dois registros.
- **Hash SHA-256 no navegador:** a foto recebe o hash antes do envio, e o hash é o ID do comprovante e o nome do arquivo no Storage (`tenants/{tenantId}/comprovantes/{chaveNota}/{hash}.jpg`).
- **Reenvio seguro:** se chegar uma foto cuja chave e hash já existem, a resposta é "já recebido" (sucesso), sem criar outro registro.
- **Foto diferente para a mesma nota:** não cria novo comprovante e marca a entrega para conferência.
- **Rede instável:** se o envio falhar, a foto continua na tela e o motorista reenvia quando o sinal voltar. O modo offline completo fica fora do MVP.
- **Testes:** enviar a mesma foto duas vezes deve resultar em um único registro, rodando a cada Pull Request.

## 3. Consequências

### Positivas

- Não há custo nem espera de publicação em lojas, e as atualizações chegam a todos na hora.
- Uma só base de código atende o painel e a captura.
- Reenvios após queda de rede não geram duplicatas, por construção.
- Não há Storage gasto com cópias idênticas, o que ajuda no teto de custo.

### Negativas 

- A câmera pelo navegador tem menos recursos que a nativa.
- Sem modo offline completo, o motorista precisa reenviar quando a rede voltar.
- O hash só detecta arquivos idênticos, então duas fotos diferentes do mesmo canhoto dependem da chave da nota para serem barradas.
- O cálculo do hash roda no celular e precisa ser testado em aparelhos mais simples.
