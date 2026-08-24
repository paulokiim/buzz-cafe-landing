import { proxyPublicStoreRequest, publicProxyPath } from "@/lib/public-store-proxy";

type Context = { params: Promise<{ path: string[] }> };

async function asset(request: Request, context: Context) {
  try {
    const response = await proxyPublicStoreRequest(request, publicProxyPath("/loja-assets", (await context.params).path), { mode: "passthrough" });
    if (response.headers.get("content-type")?.startsWith("text/html")) return new Response("Asset não encontrado.", { status: 404 });
    return response;
  } catch {
    return new Response("Asset não encontrado.", { status: 404 });
  }
}

export { asset as GET, asset as HEAD };
