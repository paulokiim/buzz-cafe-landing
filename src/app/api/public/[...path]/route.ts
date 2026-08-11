import {
  proxyPublicStoreRequest,
  publicProxyPath,
} from "@/lib/public-store-proxy";

type PublicApiContext = {
  params: Promise<{ path: string[] }>;
};

async function publicApi(request: Request, context: PublicApiContext) {
  try {
    const { path } = await context.params;
    return proxyPublicStoreRequest(
      request,
      publicProxyPath("/api/public", path),
      { mode: "passthrough" },
    );
  } catch {
    return Response.json({ error: "Rota pública inválida." }, { status: 404 });
  }
}

export {
  publicApi as GET,
  publicApi as HEAD,
  publicApi as OPTIONS,
  publicApi as POST,
};
