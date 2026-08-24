import { canonicalStorefrontRequest, proxyPublicStoreRequest } from "@/lib/public-store-proxy";

function storefront(request: Request) {
  return canonicalStorefrontRequest(request) ?? proxyPublicStoreRequest(request, "/loja", { mode: "html" });
}

export { storefront as GET, storefront as HEAD };
