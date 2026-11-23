# Buzz Café Landing Strategy

## Vision

<!-- vision: author-approved 2026-11-23 -->

A landing do Buzz Café existe para que quem encontra a marca na busca, em um anúncio ou em um QR code saiba onde comprar ou falar com a cafeteria.
Ela atende quem ainda está escolhendo um canal de pedido e quem já chega por um link direto.
Seu domínio é a jornada pública de descoberta e encaminhamento para os canais de venda e contato.

### Encontrar o Buzz e chegar ao canal certo

A página inicial torna visíveis a localização, as formas de pedir e o contato da cafeteria.
Cada chamada identifica o canal e leva à loja ou à conversa correspondente.
Uma campanha pode destacar um canal adequado ao contexto e manter visíveis as demais opções de pedido.
Uma oferta editorial pode abrir o WhatsApp com itens e quantidades preenchidos como pedido de orçamento.
A conversa confirma disponibilidade, preço e retirada.
As fotos e ofertas ajudam a escolher sem empurrar as ações de pedido para fora do alcance de quem usa o celular.
Quando o dispositivo solicita economia de dados, uma foto leve e a ação de pedido podem vir antes da galeria carregada sob demanda.
Ação de pedido, WhatsApp e informações da loja ficam disponíveis mesmo quando o rastreamento falha.

### Links publicados continuam válidos

O endereço público da loja própria é www.buzzcafe.com.br/loja.
Links de /loja no domínio raiz seguem para o endereço canônico com a query, e links publicados em campanhas preservam o destino da loja.
Links publicados para /pedir continuam levando à página inicial.
Se a entrada canônica falha, um destino temporário do PDV pode receber o tráfego quando consegue concluir pedidos e preserva os parâmetros de campanha.
A jornada volta ao endereço canônico assim que ele volta a concluir pedidos.
Página canônica, sitemap e dados estruturados mantêm uma visão coerente do que a busca encontra.
As páginas públicas existentes concentram as informações de localização e horários das unidades.

### A loja própria continua sob autoridade do PDV

A landing serve a entrada da loja própria e os recursos públicos que a página precisa para abrir no endereço canônico.
O PDV fornece o catálogo transacional, o carrinho, o checkout e o estado do pagamento.
A landing pode exibir um indicador público de disponibilidade calculado pelo PDV, com validade curta e ocultação ao expirar.
O canal que recebe o pedido confirma a disponibilidade.
O encaminhamento usa origens, rotas e tipos de conteúdo definidos, sem repassar cookies ou autorização.
As antigas rotas da API pública na landing permanecem fechadas.
Rotas de API de negócio ficam no PDV, inclusive a leitura do catálogo transacional.

### Um clique mede a escolha do canal

A landing mede a chegada e a escolha de um canal, com a origem da campanha e a região quando identificadas na URL.
Os parâmetros de saída identificam a indicação do Buzz e o canal escolhido, preservando o destino de compra.
Cada visualização ou clique tem uma única fonte de envio por ferramenta de medição.
A conclusão da compra depende da confirmação do canal que processa o pedido.
A atribuição pode ligar uma visita de campanha a uma compra registrada e confirmada pelo PDV por meio de um identificador aleatório e temporário.
O relatório recebe apenas esse identificador e o evento de confirmação.

### A jornada pública funciona de ponta a ponta

Mudanças que afetam a entrada pública demonstram no navegador que a página abre, os destinos correspondem às chamadas e o fluxo cabe no celular.
Uma mudança de origem para a loja própria preserva a entrada pública e depende do frontend e da API de destino saudáveis.
A reversão da entrada pública independe dos registros de pedidos e pagamentos.

### Escopo

Entram páginas públicas da marca, conteúdo editorial, mídia, descoberta local, links oficiais e atribuição da jornada até a confirmação de compra pelo canal de destino.
Ficam fora páginas indexáveis separadas para cada unidade e rotas de API de negócio na landing.
Ficam fora o cadastro transacional de produtos, o motor de preços e disponibilidade, as contas de clientes e a gestão de pedidos e pagamentos.
O despacho de marketplaces fica no Buzz Orders.

Uma mudança se alinha quando torna o Buzz mais fácil de encontrar ou o próximo passo de compra mais claro, preserva links publicados e mantém a autoridade comercial no canal de destino.
Uma mudança merece resistência quando exige que a landing calcule uma promessa comercial, exponha uma rota operacional ou contabilize um clique como compra.
