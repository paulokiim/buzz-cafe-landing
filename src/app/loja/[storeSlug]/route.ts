import { canonicalStorefrontRequest, proxyPublicStoreRequest, publicProxyPath } from "@/lib/public-store-proxy";

type Context = { params: Promise<{ storeSlug: string }> };
const STORE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function storefront(request: Request, context: Context) {
  const canonical = canonicalStorefrontRequest(request);
  if (canonical) return canonical;
  const { storeSlug } = await context.params;
  if (!STORE_SLUG_PATTERN.test(storeSlug)) return new Response("Loja não encontrada.", { status: 404 });
  if (storeSlug === "loja-inicial") {
    const shortUrl = new URL(request.url);
    shortUrl.pathname = "/loja";
    return Response.redirect(shortUrl, 308);
  }
  return proxyPublicStoreRequest(request, publicProxyPath("/loja", [storeSlug]), { mode: "html" });
}

export { storefront as GET, storefront as HEAD };
