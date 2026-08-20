function publicApi(request: Request) {
  return new Response(
    request.method === "HEAD"
      ? null
      : JSON.stringify({ error: "Rota pública indisponível." }),
    {
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
      status: 404,
    },
  );
}

export {
  publicApi as GET,
  publicApi as HEAD,
  publicApi as OPTIONS,
  publicApi as POST,
};
