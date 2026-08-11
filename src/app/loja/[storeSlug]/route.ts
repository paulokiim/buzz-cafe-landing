import {
  proxyPublicStoreRequest,
  publicProxyPath,
} from "@/lib/public-store-proxy";

type StorefrontContext = {
  params: Promise<{ storeSlug: string }>;
};

const STORE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function storefront(request: Request, context: StorefrontContext) {
  const { storeSlug } = await context.params;
  if (!STORE_SLUG_PATTERN.test(storeSlug)) {
    return new Response("Loja não encontrada.", { status: 404 });
  }

  if (storeSlug === "loja-inicial") {
    return Response.redirect(new URL("/loja", request.url), 308);
  }

  return proxyPublicStoreRequest(
    request,
    publicProxyPath("/loja", [storeSlug]),
    { mode: "html" },
  );
}

export { storefront as GET, storefront as HEAD };
