# Suíte EP/BVA v1

Aqui testamos a validação da chave de acesso da NF-e usando partição de equivalência (EP) e valor limite (BVA). Ela vem do critério de aceite 5 da US-01 e das métricas MTR-02 e MTR-07 do backlog: só entram chaves com 44 dígitos numéricos e Módulo 11 correto. Chaves com 43 ou 45 dígitos são recusadas.

- Código testado: `validateNFeKey`, em `backend/src/utils/nfeKeyValidator.ts`
- Testes: `backend/tests/checkpoint2.test.ts` (5 testes). Os mesmos cenários estão em `tests/unit/nfe-chave.test.ts`, com os identificadores CT-09 a CT-13.
- Última execução: 01/11/2026, tudo passando

## 1. Como a validação funciona

São duas checagens, uma depois da outra:

1. A chave tem que ter exatamente 44 caracteres e todos precisam ser dígitos. Se não for assim, devolve `isValid: false` com a mensagem "A chave deve possuir exatamente 44 dígitos numéricos".
2. Os 43 primeiros dígitos passam pelo Módulo 11 da SEFAZ (pesos de 2 a 9, da direita para a esquerda). Se o resultado não bater com o 44º dígito, a mensagem é "Dígito verificador inválido".

Daí saem as partições: tamanho e conteúdo caem na primeira checagem, e o dígito verificador na segunda.

## 2. O que testamos

A chave de referência é `35231012345678000195550010000001011234567891`. Fiz a conta do Módulo 11 nos 43 primeiros dígitos e deu 1, o mesmo dígito que a chave tem no final. Então ela é válida de verdade.

| CT | O que o teste faz | Esperado | Resultado |
| :--- | :--- | :--- | :---: |
| CT-10 | Chave de referência (44 dígitos, DV certo) | Aceita | Passou |
| CT-09 | Chave com 43 dígitos | Recusada, motivo cita "44 dígitos" | Passou |
| CT-12 | Chave com 45 dígitos | Recusada, motivo cita "44 dígitos" | Passou |
| CT-11 | 44 dígitos, mas com o último trocado de 1 para 2 | Recusada, "Dígito verificador inválido" | Passou |
| CT-13 | 43 dígitos e a letra A no fim | Recusada | Passou |

## 3. O que ainda não está coberto

- Chave vazia (`""`), que é o extremo do tamanho.
- 42 e 46 dígitos, para confirmar que a recusa vale para a faixa toda e não só para 43 e 45.
- Chave com espaços ou hífens, porque quem copia de um documento costuma trazer formatada.
- Os 9 dígitos verificadores errados, para garantir que nenhum passa por sorte.
- Uma chave cujo Módulo 11 dê resto 0 ou 1, que é o caso especial em que o DV fica 0.
- `null` e `undefined`, só se a API puder mandar isso para o validador.

## 4. Pontos de atenção

- O teste de caractere não numérico confere só o `isValid`, não a mensagem. Como é o mesmo regex do tamanho, a mensagem é a mesma. Dá para acrescentar `expect(result.reason).toContain("numéricos")`, como o CT-13 do `nfe-chave.test.ts` já faz.
- Existem dois arquivos com os mesmos cenários: `checkpoint2.test.ts` (sem CT-xx) e `nfe-chave.test.ts` (com CT-09 a CT-13). Vale combinar com o João qual fica. Eu manteria o `nfe-chave.test.ts`, que já tem os identificadores.
- Esta suíte testa só a função, não a rota. A recusa de chave inválida na importação de XML (HTTP 422) aparece nos testes da US-01, em `importacao-nfe.test.ts`.

## 5. Outros casos da v1

- Importação de XML (US-01): CT-01 a CT-08, em `tests/unit/importacao-nfe.test.ts`. O CT-02 está como `todo` e o CT-07 está reprovado por causa do BUG-002.
- Autorização e isolamento: CT-20 a CT-22, em `tests/security/autorizacao.test.ts`.
- Security Rules do Firestore: CT-23 a CT-27, em `tests/security/firestore-rules.test.ts`.

O detalhe de cada um está na Matriz de Rastreabilidade e os resultados no Relatório de Testes v1. As histórias US-02 a US-05 ficam para o CP3 e o CP4.
