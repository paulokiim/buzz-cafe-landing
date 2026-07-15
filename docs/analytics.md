# Buzz Cafe Landing Analytics

## Variaveis de ambiente

Configure estas variaveis no ambiente hospedado do Sites.

```env
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=000000000000000
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-000000000
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=optional_label
```

Preferencia operacional: use `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID` como fonte principal. Quando GTM estiver configurado, GA4, Meta Pixel e Google Ads devem ser adicionados dentro do container do GTM para evitar duplicidade de pageviews.

Se apenas `NEXT_PUBLIC_GA_MEASUREMENT_ID` estiver configurado, a landing carrega o `gtag.js` diretamente.

## Eventos enviados

Todos os eventos tambem entram no `window.dataLayer`, para uso no GTM:

- `PageView`
- `Clique_iFood`
- `Clique_Keeta`
- `Clique_99Food`
- `Clique_WhatsApp`

Eventos de clique tambem sao encaminhados quando os destinos existem:

- GA4 direto: `order_channel_click` ou `whatsapp_click`
- Meta Pixel: `OrderChannelClick` customizado ou `Contact` para WhatsApp

## Parametros de campanha

Use UTMs em links e QR codes para medir origem e regiao com precisao operacional:

```text
https://www.buzzcafe.com.br/?utm_source=panfleto&utm_medium=qr&utm_campaign=delivery_julho&utm_content=rua_bresser&utm_region=bras
```

Campos capturados no payload:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `utm_region`

Use `utm_region` para bairro/regiao/campanha local. Localizacao por IP em GA4 e aproximada; UTMs por QR/campanha sao mais confiaveis para acao operacional.
