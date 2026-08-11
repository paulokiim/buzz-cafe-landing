import {
  proxyPublicStoreRequest,
  publicProxyPath,
} from "@/lib/public-store-proxy";

type StoreAssetContext = {
  params: Promise<{ path: string[] }>;
};

async function storeAsset(request: Request, context: StoreAssetContext) {
  try {
    const { path } = await context.params;
    const response = await proxyPublicStoreRequest(
      request,
      publicProxyPath("/loja-assets", path),
      { mode: "passthrough" },
    );
    if (response.headers.get("content-type")?.startsWith("text/html")) {
      return new Response(
        request.method === "HEAD" ? null : "Asset não encontrado.",
        { status: 404 },
      );
    }
    return response;
  } catch {
    return new Response("Asset não encontrado.", { status: 404 });
  }
}

export { storeAsset as GET, storeAsset as HEAD };
