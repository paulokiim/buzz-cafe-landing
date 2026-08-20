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

`/loja` e `/loja/<slug>` redirecionam temporariamente para a vitrine hospedada
no Sites em `https://pdv.buzzcafe.com.br/loja`, preservando os parâmetros da
campanha. A landing não atua como proxy da API nem recebe credenciais do backend.

As antigas rotas de proxy falham fechadas com `404` e `Cache-Control: no-store`:

- `/api/public/<caminho>`
- `/loja-assets/<caminho>`
- `/media/<caminho>`

Não há variável de ambiente da loja pública nesta aplicação. No rollout:

1. publique e homologue primeiro o frontend do PDV/Sites e o backend Render;
2. confirme que `https://pdv.buzzcafe.com.br/loja` está saudável;
3. somente então publique este redirecionamento na landing.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
