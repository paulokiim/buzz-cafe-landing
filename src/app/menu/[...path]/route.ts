import { proxyPublicStoreRequest, publicProxyPath } from "@/lib/public-store-proxy";

type Context = { params: Promise<{ path: string[] }> };
async function menuImage(request: Request, context: Context) {
  try {
    const response = await proxyPublicStoreRequest(request, publicProxyPath("/menu", (await context.params).path), { mode: "passthrough" });
    if (!/^image\/(?:jpeg|png|webp)\b/i.test(response.headers.get("content-type") ?? "")) {
      return new Response("Imagem não encontrada.", { status: 404 });
    }
    return response;
  }
  catch { return new Response("Imagem não encontrada.", { status: 404 }); }
}
export { menuImage as GET, menuImage as HEAD };
