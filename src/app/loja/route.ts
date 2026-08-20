const STOREFRONT_URL = "https://pdv.buzzcafe.com.br/loja";

function storefront(request: Request) {
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
