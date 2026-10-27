# Mapeamento de Jornadas do Usuário

Este documento descreve as etapas sequenciais das duas principais jornadas do **Entrega Prova**, destacando as ações do usuário, pontos de contato (*touchpoints*), emoções e regras de negócio do sistema.

---

## 📱 Jornada 1: O Motorista em Campo (Seu Carlos)
**Objetivo:** Registrar o comprovante de entrega na doca do cliente de forma rápida e segura.

| Etapa | Ação do Motorista | Ponto de Contato (*Touchpoint*) | Sentimento | Regra de Negócio / Sistema |
| :--- | :--- | :--- | :---: | :--- |
| **1. Descarga** | Finaliza a entrega e colhe assinatura/carimbo no papel | Físico (Doca do cliente) | 😐 Neutro | Papel ainda é assinado fisicamente na portaria |
| **2. Acesso** | Abre o link da entrega recebido no celular | PWA Web Mobile | 🙂 Aliviado | Não exige download na Play Store/App Store |
| **3. Captura** | Toca no botão da câmera e fotografa o canhoto | Câmera nativa do smartphone | 😊 Confiante | Foto enquadrada com assinatura visível |
| **4. Dados** | Informa nome e documento de quem recebeu | Formulário mobile simples | ⚡ Rápido | Nome e RG/CPF obrigatórios para validade jurídica |
| **5. Envio** | Toca em "Confirmar e Enviar" | PWA Web Mobile | 🎉 Concluído | Imagem comprimida (~300 KB (1280 px)) com hash anti-duplicação |

---

## 💼 Jornada 2: A Conferente de Faturamento (Juliana)
**Objetivo:** Conciliar o comprovante digitalizado com a nota fiscal e liberar a fatura para cobrança.

| Etapa | Ação da Conferente | Ponto de Contato (*Touchpoint*) | Sentimento | Regra de Negócio / Sistema |
| :--- | :--- | :--- | :---: | :--- |
| **1. Ingestão** | Arrasta os arquivos XML de NF-e para o painel | Painel Web Backoffice | ⚡ Eficiente | Parser seguro (mitigação XXE) cria notas `"PENDENTE"` |
| **2. Notificação** | Visualiza canhoto recém-enviado pelo motorista | Lista de entregas | 👀 Atenta | Status atualiza para `"AGUARDANDO CONFERÊNCIA"` |
| **3. Inspeção** | Abre tela lado a lado (Foto vs. Dados do XML) | Tela de Conferência | 🔍 Focada | Ferramenta de rotação e zoom na assinatura |
| **4. Decisão** | Confere legibilidade e clica em **Aprovar** | Botão de Aprovação | ✅ Satisfeita | Status muda para `"APROVADA"` com registro de auditoria |
| **5. Fechamento** | Exporta pacote digital para cobrança do embarcador | Módulo de Exportação | 🚀 Produtiva | PDF/arquivo gerado com chave fiscal e foto nítida |