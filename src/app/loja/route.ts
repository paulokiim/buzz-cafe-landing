import { proxyPublicStoreRequest } from "@/lib/public-store-proxy";

function storefront(request: Request) {
  return proxyPublicStoreRequest(request, "/loja", {
    mode: "html",
  });
}

export { storefront as GET, storefront as HEAD };
