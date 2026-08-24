import { describe, expect, it, vi } from "vitest";

import { proxyPublicStoreRequest, publicProxyPath } from "./public-store-proxy";

describe("public store edge proxy", () => {
  it("does not forward cookies, authorization, or untrusted headers", async () => {
    const fetcher = vi.fn<(request: Request) => Promise<Response>>(async () => new Response("ok", { headers: { "set-cookie": "private=blocked" } }));
    const response = await proxyPublicStoreRequest(
      new Request("https://www.buzzcafe.com.br/loja", { headers: { authorization: "Bearer blocked", cookie: "private=value", "x-untrusted": "blocked" } }),
      "/loja",
      { fetcher, mode: "html", upstreamOrigin: "https://buzz-cafe-pdv.p12ulokr.chatgpt.site" },
    );
    const upstream = fetcher.mock.calls[0]?.[0] as Request;
    expect(upstream.headers.get("cookie")).toBeNull();
    expect(upstream.headers.get("authorization")).toBeNull();
    expect(upstream.headers.get("x-untrusted")).toBeNull();
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("adds a restrictive CSP that permits the exact Render API origin", async () => {
    const response = await proxyPublicStoreRequest(
      new Request("https://www.buzzcafe.com.br/loja"),
      "/loja",
      { fetcher: async () => new Response("<html>Buzz</html>"), mode: "html", upstreamOrigin: "https://buzz-cafe-pdv.p12ulokr.chatgpt.site" },
    );
    expect(response.headers.get("content-security-policy")).toContain("https://api-pdv.buzzcafe.com.br");
    expect(response.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
  });

  it("allows only the production Sites origin or localhost", async () => {
    const fetcher = vi.fn();
    const response = await proxyPublicStoreRequest(
      new Request("https://www.buzzcafe.com.br/loja"),
      "/loja",
      { fetcher, mode: "html", upstreamOrigin: "https://evil.example" },
    );
    expect(response.status).toBe(502);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("does not select loopback from an attacker-controlled request hostname", async () => {
    const fetcher = vi.fn<(request: Request) => Promise<Response>>(async () => new Response("ok"));
    await proxyPublicStoreRequest(
      new Request("http://localhost/loja"),
      "/loja",
      { fetcher, mode: "html" },
    );
    expect((fetcher.mock.calls[0]?.[0] as Request).url).toBe(
      "https://buzz-cafe-pdv.p12ulokr.chatgpt.site/loja",
    );
  });

  it("encodes safe paths and rejects traversal", () => {
    expect(publicProxyPath("/menu", ["Combos", "vanilla brownie.png"])).toBe("/menu/Combos/vanilla%20brownie.png");
    expect(() => publicProxyPath("/menu", [".."]))
      .toThrow("Caminho público inválido");
    expect(() => publicProxyPath("/menu", ["a/b"]))
      .toThrow("Caminho público inválido");
  });
});
