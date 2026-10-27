# Pesquisa, Evidências Secundárias e Defensibilidade

Este documento reúne a base factual do **Entrega Prova**, apresentando **evidências secundárias rotuladas** do setor de transporte rodoviário de cargas no Brasil, a **hipótese de defensibilidade** do produto e a definição da **métrica da demonstração** requerida para o Checkpoint 1.

---

## 1. Evidências Secundárias Rotuladas

Para fundamentar que a morosidade e a dependência do canhoto em papel constituem um gargalo financeiro real no transporte rodoviário de cargas, foram mapeados dados consolidados da indústria logística e de sistemas TMS (*Transportation Management System*).

### [EVIDÊNCIA 01] O Gargalo do Canhoto Físico e o Ciclo Financeiro do Frete
* **Fonte:** Análise Setorial de Gestão de Fretes e Tecnologias TMS (SIL Sistemas / Brudam TMS).
* **Rótulo Temático:** *Fluxo de Caixa, Retenção Documental e Faturamento B2B*.
* **Contexto e Dados:**
  * O ciclo financeiro das transportadoras rodoviárias de carga no Brasil opera com um prazo médio de faturamento de frete condicionado à apresentação do comprovante de entrega (POD – *Proof of Delivery*).
  * No modelo analógico tradicional, o canhoto físico assinado viaja na cabine do veículo até o retorno do motorista à base ou filial, gerando um atraso típico de **14 a 30 dias** entre o término do serviço e a liberação da fatura para o embarcador.
  * Em caso de perda, avaria do papel (umidade, rasura) ou ilegibilidade na assinatura/documento do recebedor, a cobrança é contestada ou glosada ("abatimento em fatura"), obrigando a transportadora a arcar com o custo operacional do frete sem contrapartida imediata.
* **Impacto no Entrega Prova:** Justifica a digitalização da prova no exato momento da entrega (*at point of delivery*), vinculando os metadados (nome, data e hora) à chave eletrônica para eliminar o tempo de viagem do papel físico.

---

### [EVIDÊNCIA 02] Complexidade Operacional e Custos Logísticos no Brasil
* **Fonte:** Relatório de Custos Logísticos no Brasil (Instituto ILOS / Fundação Dom Cabral / SETCESP).
* **Rótulo Temático:** *Eficiência Operacional e Custos Administrativos do Transporte*.
* **Contexto e Dados:**
  * Os custos logísticos no Brasil consomem entre **15,5% e 18,4% do PIB**, sendo o modal rodoviário responsável por mais de 60% da movimentação de cargas do país.
  * Uma parcela substancial desses custos decorre de complexidades acessórias, retrabalho administrativo no backoffice financeiro e gestão manual de documentos fiscais (NF-e e CT-e).
  * Transportadoras de médio e pequeno porte sofrem desproporcionalmente com a necessidade de capital de giro: a retenção de faturas por atraso documental força a contratação de crédito caro ou operações de antecipação de recebíveis, com taxas de desconto que corroem as já estreitas margens líquidas do setor (frequentemente abaixo de 5%).
* **Impacto no Entrega Prova:** Sustenta o valor de negócio do produto: uma solução acessível de baixo custo que acelera o faturamento direto e encurta a dependência de capital de giro sem necessidade de aquisição de coletores dedicados de dados ou infraestrutura cara.

---

## 2. Hipótese de Defensibilidade

A defensibilidade do **Entrega Prova** em um mercado com ferramentas logísticas legadas apoia-se em quatro pilares de desenho de produto:

1. **Atrito Zero na Ponta Operacional (Web PWA sem App Nativo):**
   * Sistemas tradicionais exigem que motoristas instalem aplicativos pesados das lojas (Google Play/App Store), façam autenticações burocráticas e consumam memória do próprio aparelho.
   * O Entrega Prova adota uma interface web mobile progressiva de alta velocidade: o operador compartilha o acesso da entrega via link e o motorista aciona a câmera nativa do navegador imediatamente, garantindo taxa de adesão máxima mesmo em frotas terceirizadas e agregadas.
2. **Ingestão Segura e Desacoplada do Padrão Fiscal Brasileiro (NF-e/CT-e):**
   * O produto não concorre com os ERPs de emissão nem exige integrações proprietárias complexas; ele consome o padrão universal do ecossistema fiscal (XML da NF-e v4.00 e CT-e).
   * A conversão isolada para JSON com mitigação rigorosa de injeções (XXE) e validação matemática da chave de 44 dígitos garante confiabilidade técnica imediata.
3. **Idempotência e Tolerância à Rede Instável:**
   * Motoristas operam em docas e regiões com conectividade intermitente. O mecanismo de hash de integridade evita que reenvios em conexões oscilantes gerem duplicidades de entregas ou comprovantes sobrepostos no banco de dados.
4. **Custo Operacional Zero / FinOps Extremo:**
   * Construído sobre arquitetura *serverless* (GCP + Firebase) com consultas paginadas e limites estritos no Free Tier, permitindo que a transportadora opere a ferramenta sem custos fixos de licenciamento de servidores dedicados.

---

## 3. Métrica da Demonstração (Demo Day Gate)

O sucesso prático do MVP será comprovado através de uma métrica de eficiência temporal diretamente mensurável na apresentação final do ciclo:

$$\text{Lead Time de Comprovação} = T_{\text{Pacote Gerado}} - T_{\text{Ingestão XML}}$$

* **Linha de Base Analógica (Benchmark do Mercado):** **14 a 21 dias** (tempo entre a entrega física, retorno do caminhão, descarregamento de malote, triagem do papel, conferência manual e digitação no faturamento).
* **Meta Mensurável do MVP Entrega Prova:** **$\le 3\text{ minutos}$** no fluxo demonstrado ponta a ponta durante a banca.
* **Cenário de Demonstração:**
  1. *[00:00 - 00:30]* Ingestão do XML de NF-e e criação imediata da entrega pendente na tabela do backoffice.
  2. *[00:31 - 01:30]* Acesso mobile pelo motorista, captura fotográfica do canhoto e envio com metadados (recebedor e horário).
  3. *[01:31 - 02:15]* Atualização reativa da tela do conferente, conferência lado a lado e aprovação com alteração de status.
  4. *[02:16 - 03:00]* Exibição do encerramento da pendência no aging e geração do pacote consolidado em PDF/arquivo para faturamento imediato.