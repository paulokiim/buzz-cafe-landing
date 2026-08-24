function storeAsset(request: Request) {
  return new Response(
    request.method === "HEAD" ? null : "Asset não encontrado.",
    {
      headers: { "cache-control": "no-store" },
      status: 404,
    },
  );
}

export { storeAsset as GET, storeAsset as HEAD };
