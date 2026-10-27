# Canvas MVP — Entrega Prova

O Canvas MVP consolida a proposta de valor, público-alvo, personas, jornadas essenciais, hipóteses de negócio e métricas do ciclo de lançamento do **Entrega Prova**.

---

| Bloco | Definição no Entrega Prova |
| :--- | :--- |
| **1. Proposta do MVP** | Plataforma web responsiva (PWA) de conciliação fiscal rápida que digitaliza o canhoto de entrega no ato do descarregamento e elimina o prazo de retenção documental do frete B2B. |
| **2. Personas Atendidas** | • **Seu Carlos (Motorista):** Precisa comprovar a entrega em 1 minuto pelo celular sem instalar aplicativos pesados.<br>• **Juliana (Conferente de Faturamento):** Precisa conciliar a imagem com os dados da NF-e e liberar faturamento sem depender do papel físico. |
| **3. Jornadas Principais** | • **J1:** Upload e extração segura do XML da NF-e/CT-e no painel web.<br>• **J2:** Captura da foto do canhoto e envio de metadados na ponta mobile.<br>• **J3:** Validação lado a lado (Foto vs. Dados Fiscais) e aprovação da prova.<br>• **J4:** Visualização de pendências em painel de aging por cliente.<br>• **J5:** Geração e exportação do pacote documental para cobrança. |
| **4. Funcionalidades (Must Have)** | • Parser seguro de XML (mitigação XXE e validação de chave de 44 dígitos).<br>• Interface PWA mobile com acionamento nativo de câmera.<br>• Painel desktop de conferência e conciliação manual.<br>• Controle de status de entrega (Pendente, Aprovada, Rejeitada). |
| **5. Não Entra no MVP** | • Aplicativo nativo empacotado para lojas (Android/iOS).<br>• Reconhecimento óptico de caracteres (OCR) automático.<br>• Consulta direta online em Web Services da SEFAZ.<br>• Telemetria e rastreamento GPS contínuo da frota. |
| **6. Custo e Infraestrutura** | • Orçamento: **US$ 0,00** (arquitetura apoiada estritamente no Firebase Free Tier e Docker local). |
| **7. Métricas de Sucesso** | • **Lead time de comprovação:** Redução do ciclo de dias para $\le 3\text{ minutos}$ na demo ponta a ponta.<br>• **Taxa de integridade:** 100% de validação da chave fiscal de 44 dígitos.<br>• **Payload mobile:** Imagens comprimidas no cliente em ~300 KB (1280 px). |