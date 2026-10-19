# Mapeamento de Jornadas do Usuário

Este documento descreve as etapas sequenciais das duas principais jornadas do **Entrega Prova**, destacando as ações do usuário, pontos de contato (*touchpoints*), emoções e regras de negócio do sistema.

---

## :material-cellphone: Jornada 1: O Motorista em Campo (Seu Carlos)
**Objetivo:** Registrar o comprovante de entrega na doca do cliente de forma rápida e segura.

| Etapa | Ação do Motorista | Ponto de Contato (*Touchpoint*) | Sentimento | Regra de Negócio / Sistema |
| :--- | :--- | :--- | :---: | :--- |
| **1. Descarga** | Finaliza a entrega e colhe assinatura/carimbo no papel | Físico (Doca do cliente) | :material-emoticon-neutral-outline: Neutro | Papel ainda é assinado fisicamente na portaria |
| **2. Acesso** | Abre o link da entrega recebido no celular | PWA Web Mobile | :material-emoticon-happy-outline: Aliviado | Não exige download na Play Store/App Store |
| **3. Captura** | Toca no botão da câmera e fotografa o canhoto | Câmera nativa do smartphone | :material-emoticon-outline: Confiante | Foto enquadrada com assinatura visível |
| **4. Dados** | Informa nome e documento de quem recebeu | Formulário mobile simples | :material-lightning-bolt: Rápido | Nome e RG/CPF obrigatórios para validade jurídica |
| **5. Envio** | Toca em "Confirmar e Enviar" | PWA Web Mobile | :material-party-popper: Concluído | Imagem comprimida ($\le 1.2\text{ MB}$) com hash anti-duplicação |

---

## :material-briefcase: Jornada 2: A Conferente de Faturamento (Juliana)
**Objetivo:** Conciliar o comprovante digitalizado com a nota fiscal e liberar a fatura para cobrança.

| Etapa | Ação da Conferente | Ponto de Contato (*Touchpoint*) | Sentimento | Regra de Negócio / Sistema |
| :--- | :--- | :--- | :---: | :--- |
| **1. Ingestão** | Arrasta os arquivos XML de NF-e para o painel | Painel Web Backoffice | :material-lightning-bolt: Eficiente | Parser seguro (mitigação XXE) cria notas `"PENDENTE"` |
| **2. Notificação** | Visualiza canhoto recém-enviado pelo motorista | Lista de entregas | :material-eye-outline: Atenta | Status atualiza para `"AGUARDANDO CONFERÊNCIA"` |
| **3. Inspeção** | Abre tela lado a lado (Foto vs. Dados do XML) | Tela de Conferência | :material-magnify: Focada | Ferramenta de rotação e zoom na assinatura |
| **4. Decisão** | Confere legibilidade e clica em **Aprovar** | Botão de Aprovação | :material-check-circle-outline: Satisfeita | Status muda para `"APROVADA"` com registro de auditoria |
| **5. Fechamento** | Exporta pacote digital para cobrança do embarcador | Módulo de Exportação | :material-rocket-launch-outline: Produtiva | PDF/arquivo gerado com chave fiscal e foto nítida |