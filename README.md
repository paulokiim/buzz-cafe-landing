This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Loja pública

`/loja` é a borda pública da loja. Ela encaminha apenas as rotas públicas da
vitrine para o PDV e não envia os cookies do visitante ao painel.

Rotas expostas pela borda:

- `/loja` e `/loja/<slug>` para a vitrine; `/loja/loja-inicial` redireciona
  permanentemente para `/loja`.
- `/api/public/<caminho>` para a API pública, `/loja-assets/<caminho>` para
  assets e `/media/<caminho>` para mídia.

Variáveis de ambiente para o rollout:

- `PUBLIC_PROXY_SECRET` (obrigatória; não inclua o valor no repositório)
- `PDV_PUBLIC_UPSTREAM_ORIGIN` (opcional)

No rollout, configure e valide primeiro o PDV para aceitar o segredo do proxy;
depois configure a landing com o mesmo segredo e publique a borda pública.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
