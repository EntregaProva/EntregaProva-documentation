# Estratégia de Testes e Isolamento Multitenant

Esta seção descreve a abordagem de garantia de qualidade (QA) adotada no projeto **Entrega Prova**, focando na integridade da separação lógica de dados entre diferentes transportadoras (isolamento de *tenant*), no framework de execução automatizada e nas diretrizes de asserção da API.

---

## 1. O Risco de Negócio: Falha de Isolamento de Tenant

Como o Entrega Prova é uma solução B2B compartilhada, diversas empresas transportadoras operam na mesma base computacional:

* **Tenant:** Representa uma empresa/transportadora cadastrada com credenciais e limites de dados próprios.
* **Cenário de Teste:**
    * `tenant-a`: Transportadora A
    * `tenant-b`: Transportadora B

!!! danger "Risco de Vazamento de Dados (Cross-Tenant Leak)"
    Se um operador da Transportadora A conseguir ler, atualizar (`PATCH`) ou remover (`DELETE`) uma nota fiscal ou comprovante de entrega pertencente à Transportadora B, ocorre uma violação severa de isolamento de *tenant* e conformidade com a LGPD.

A suíte de testes de integração existe para comprovar matematicamente que a camada de autorização do backend rejeita qualquer tentativa de cruzamento não autorizado.

---

## 2. Ferramental e Arquitetura de Testes

Os testes automatizados são desenvolvidos em **TypeScript** utilizando o executor **Vitest**.

### Funções Principais do Ciclo de Teste

| Recurso | Origem | Finalidade no Projeto |
| :--- | :--- | :--- |
| `describe` | `vitest` | Agrupa logicamente os testes de uma suíte (ex.: suíte de isolamento). |
| `it` | `vitest` | Declara um caso de teste pontual nomeado pela regra de negócio que valida. |
| `expect` | `vitest` | Realiza a asserção do valor retornado contra a expectativa esperada. |
| `beforeEach` | `vitest` | Executado antes de cada `it`, garantindo isolamento e banco limpo entre execuções. |
| `vi` | `vitest` | Cria mocks e spies de chamadas externas sem depender de serviços de terceiros. |

### Tipagem e Configuração do Ambiente de Execução

```typescript
// Define o tipo seguro da aplicação em tempo de compilação sem recorrer a 'any'
let app: Awaited<ReturnType<typeof TestApp>>;