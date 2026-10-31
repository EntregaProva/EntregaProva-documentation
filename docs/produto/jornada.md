# Mapeamento de Jornadas do Usuário

Este documento descreve as etapas sequenciais das duas principais jornadas do **EntregaProva**. Ele destaca as ações do usuário, os pontos de contato (*touchpoints*), o sentimento em cada etapa e as regras de negócio do sistema.

## :material-cellphone: Jornada 1: o motorista em campo (Seu Carlos)

**Objetivo:** registrar o comprovante de entrega na doca do cliente de forma rápida e segura.

| Etapa | Ação do motorista | Ponto de contato (*touchpoint*) | Sentimento | Regra de negócio / sistema |
| :--- | :--- | :--- | :--- | :--- |
| **1. Descarga** | Finaliza a entrega e colhe assinatura/carimbo no papel | Físico (doca do cliente) | :material-emoticon-neutral-outline: Neutro | Papel ainda é assinado fisicamente na portaria |
| **2. Acesso** | Abre o link da entrega recebido no celular | PWA Web Mobile | :material-emoticon-happy-outline: Aliviado | Não exige download na Play Store/App Store |
| **3. Captura** | Toca no botão da câmera e fotografa o canhoto | Câmera nativa do smartphone | :material-emoticon-cool-outline: Confiante | Foto enquadrada com assinatura visível |
| **4. Dados** | Informa nome de quem recebeu | Formulário mobile simples | :material-lightning-bolt: Rápido | Apenas o nome é obrigatório (cumprimento LGPD) para validade jurídica |
| **5. Envio** | Toca em "Confirmar e Enviar" | PWA Web Mobile | :material-party-popper: Concluído | Imagem comprimida (~300 KB, 1280 px) com hash anti-duplicação |

## :material-briefcase-outline: Jornada 2: a conferente de faturamento (Juliana)

**Objetivo:** conciliar o comprovante digitalizado com a nota fiscal e liberar a fatura para cobrança.

| Etapa | Ação da conferente | Ponto de contato (*touchpoint*) | Sentimento | Regra de negócio / sistema |
| :--- | :--- | :--- | :--- | :--- |
| **1. Ingestão** | Arrasta os arquivos XML de NF-e para o painel | Painel web backoffice | :material-lightning-bolt: Eficiente | Parser seguro (mitigação XXE) cria notas `"PENDENTE"` |
| **2. Notificação** | Visualiza canhoto recém-enviado pelo motorista | Lista de entregas | :material-eye-outline: Atenta | Status atualiza para `"COMPROVANTE ENVIADO"` |
| **3. Inspeção** | Abre tela lado a lado (foto vs. dados do XML) | Tela de conferência | :material-magnify: Focada | Ferramenta de rotação e zoom na assinatura |
| **4. Decisão** | Confere legibilidade e clica em **Aprovar** | Botão de aprovação | :material-check-circle-outline: Satisfeita | Status muda para `"CONFERIDA"` com registro de auditoria |
| **5. Fechamento** | Exporta pacote digital para cobrança do embarcador | Módulo de exportação | :material-rocket-launch-outline: Produtiva | PDF/arquivo gerado com chave fiscal e foto nítida |
