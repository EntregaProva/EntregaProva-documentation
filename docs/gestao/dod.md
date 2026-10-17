# Definition of Done (DoD)

Este documento define os critérios mínimos e inegociáveis para que qualquer história de usuário, funcionalidade ou correção de bug seja considerada **pronta (Done)** no projeto **Entrega Prova**.

---

## 📋 Critérios Globais de Aceite (Caderno B2B)

Uma entrega só é aceita no repositório principal se cumprir rigorosamente todas as condições abaixo:

1. **Pull Request Revisado e CI Verde:**
   * O código deve passar por *Code Review* formal com aprovação de pelo menos um desenvolvedor diferente do autor.
   * As esteiras automatizadas de integração contínua (CI) no GitHub Actions devem rodar com sucesso (*lint* sem avisos impeditivos e *build* completo).

2. **Testes Automatizados Vinculados aos Requisitos:**
   * Toda nova funcionalidade deve conter pelo menos um teste automatizado cobrindo diretamente o critério mensurável da respectiva história de usuário.

3. **Segurança e Higiene de Código:**
   * É estritamente proibido incluir segredos, senhas, tokens de API ou credenciais de banco no código versionado.
   * Todas as variáveis de ambiente devem estar documentadas no `.env.example`.

4. **Experiência do Usuário (Estados de Interface):**
   * Toda tela ou componente de dados no frontend deve tratar e exibir explicitamente os três estados básicos:
     * **Carregando (*Loading*):** Feedback visual claro durante requisições assíncronas.
     * **Vazio (*Empty State*):** Mensagem orientativa quando não houver dados (ex.: "Nenhuma entrega pendente").
     * **Erro (*Error State*):** Mensagem amigável e acionável em caso de falha de conexão ou validação.

5. **Privacidade e LGPD nos Logs:**
   * Logs de backend e Cloud Functions não podem expor dados sensíveis ou pessoais (nomes, CPFs ou documentos de terceiros capturados nos canhotos).

6. **Governança de Infraestrutura e Custos (FinOps):**
   * Nenhum recurso novo ou serviço adicional do Google Cloud Platform (GCP) pode ser provisionado sem aprovação do Tech Lead e sem uma Architecture Decision Record (ADR) registrada.