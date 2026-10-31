# Exemplos Anonimizados de XML (NF-e)

Como requisito do Checkpoint 1, foram disponibilizados dois arquivos de NF-e v4.00 sintéticos e descaracterizados de quaisquer dados corporativos reais, servindo como massa de teste para ingestão e validação no parser do sistema.

---

## Arquivos Disponíveis

1. **NF-e de Fluxo Válido:**
   * **Arquivo:** `docs/exemplos/nfe-exemplo-valida.xml`
   * **Cenário:** Emissão padrão com 44 dígitos regulares, cálculo de frete destacado e destinatário ativo.
   * **Dígito Verificador (<cDV>):** `0` (chave terminada em `...123450`, matematicamente válida pelo algoritmo Módulo 11 da SEFAZ).
2. **NF-e de Teste de Pendência:**
   * **Arquivo:** `docs/exemplos/nfe-exemplo-rejeitada.xml`
   * **Cenário:** Nota com dados divergentes para validação de fluxos de exceção e aging no painel.
   * **Erro proposital:** O dígito verificador (<cDV>) está incorreto de propósito (4 em vez de 5) para testar a rejeição da chave. Não altere este arquivo.

> **Nota de Privacidade (LGPD):** Todos os números de CNPJ, nomes de empresas, inscrições estaduais e chaves de acesso foram gerados de forma fictícia para ambiente de desenvolvimento.
