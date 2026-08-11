import {
  proxyPublicStoreRequest,
  publicProxyPath,
} from "@/lib/public-store-proxy";

type PublicMediaContext = {
  params: Promise<{ path: string[] }>;
};

async function publicMedia(request: Request, context: PublicMediaContext) {
  try {
    const { path } = await context.params;
    return proxyPublicStoreRequest(
      request,
      publicProxyPath("/media", path),
      { mode: "passthrough" },
    );
  } catch {
    return new Response("Imagem não encontrada.", { status: 404 });
  }
}

export { publicMedia as GET, publicMedia as HEAD };
