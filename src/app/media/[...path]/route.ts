function publicMedia(request: Request) {
  return new Response(
    request.method === "HEAD" ? null : "Imagem não encontrada.",
    {
      headers: { "cache-control": "no-store" },
      status: 404,
    },
  );
}

export { publicMedia as GET, publicMedia as HEAD };
