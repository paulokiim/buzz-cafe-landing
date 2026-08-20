type StorefrontContext = {
  params: Promise<{ storeSlug: string }>;
};

const STORE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STOREFRONT_URL = "https://pdv.buzzcafe.com.br/loja";

async function storefront(request: Request, context: StorefrontContext) {
  const { storeSlug } = await context.params;
  if (!STORE_SLUG_PATTERN.test(storeSlug)) {
    return new Response("Loja não encontrada.", { status: 404 });
  }

  const destination = new URL(STOREFRONT_URL);
  destination.search = new URL(request.url).search;

  return new Response(null, {
    status: 307,
    headers: {
      "cache-control": "no-store",
      location: destination.toString(),
    },
  });
}

export { storefront as GET, storefront as HEAD };
