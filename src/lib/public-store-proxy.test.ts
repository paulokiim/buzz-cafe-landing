import { afterEach, describe, expect, it, vi } from "vitest";

import {
  publicProxyPath,
  proxyPublicStoreRequest,
} from "@/lib/public-store-proxy";

afterEach(() => vi.unstubAllEnvs());

describe("public store edge proxy", () => {
  it("proxies the storefront under the Buzz domain without forwarding cookies", async () => {
    vi.stubEnv("PUBLIC_PROXY_SECRET", "shared-storefront-proxy-secret");
    const fetcher = vi.fn<(request: Request) => Promise<Response>>(
      async () =>
        new Response(
          '<link href="/loja-assets/assets/store.css"><script>import("/loja-assets/assets/store.js")</script>',
          {
            headers: {
              "cache-control": "no-store",
              "content-security-policy": "default-src 'self'",
              "content-type": "text/html; charset=utf-8",
              "set-cookie": "internal_session=must-not-leak",
            },
          },
        ),
    );
    const request = new Request("https://buzzcafe.com.br/loja?utm_source=qr", {
      headers: {
        "cf-connecting-ip": "203.0.113.9",
        cookie: "private=value",
        "x-untrusted-header": "blocked",
      },
    });

    const response = await proxyPublicStoreRequest(
      request,
      "/loja/loja-inicial",
      { fetcher, mode: "html", upstreamOrigin: "https://pdv.buzzcafe.com.br" },
    );

    const upstreamRequest = fetcher.mock.calls[0]?.[0];
    expect(upstreamRequest).toBeInstanceOf(Request);
    expect(upstreamRequest?.url).toBe(
      "https://pdv.buzzcafe.com.br/loja/loja-inicial?utm_source=qr",
    );
    expect(upstreamRequest?.headers.get("cookie")).toBeNull();
    expect(upstreamRequest?.headers.get("x-untrusted-header")).toBeNull();
    expect(upstreamRequest?.headers.get("x-forwarded-host")).toBe(
      "buzzcafe.com.br",
    );
    expect(upstreamRequest?.headers.get("x-forwarded-proto")).toBe("https");
    expect(upstreamRequest?.headers.get("cf-connecting-ip")).toBe("203.0.113.9");
    expect(upstreamRequest?.headers.get("x-real-ip")).toBe("203.0.113.9");
    expect(upstreamRequest?.headers.get("x-buzz-proxy-secret")).toBe(
      "shared-storefront-proxy-secret",
    );
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.headers.get("content-security-policy")).toBe(
      "default-src 'self'",
    );
    expect(response.headers.get("x-frame-options")).toBe("DENY");
    const html = await response.text();
    expect(html).toContain('href="/loja-assets/assets/store.css"');
    expect(html).toContain('import("/loja-assets/assets/store.js")');
  });

  it("adds a storefront CSP with the Meta Pixel endpoints when the upstream omits one", async () => {
    const response = await proxyPublicStoreRequest(
      new Request("https://buzzcafe.com.br/loja"),
      "/loja/loja-inicial",
      {
        fetcher: async () =>
          new Response("<html>Buzz</html>", {
            headers: { "content-type": "text/html" },
          }),
        mode: "html",
        upstreamOrigin: "https://pdv.buzzcafe.com.br",
      },
    );

    const csp = response.headers.get("content-security-policy");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("connect.facebook.net");
    expect(csp).toContain("www.facebook.com");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });

  it("streams only the public API headers and body to the PDV worker", async () => {
    const fetcher = vi.fn<(request: Request) => Promise<Response>>(
      async () =>
        Response.json(
          { status: "pending" },
          { headers: { "cache-control": "public, max-age=60" }, status: 201 },
        ),
    );
    const request = new Request(
      "https://buzzcafe.com.br/api/public/stores/loja-inicial/checkouts",
      {
        method: "POST",
        headers: {
          authorization: "Bearer public-token",
          cookie: "internal_session=blocked",
          "content-type": "application/json",
          "idempotency-key": "checkout-key",
          origin: "https://buzzcafe.com.br",
        },
        body: '{"items":[]}',
      },
    );

    const response = await proxyPublicStoreRequest(
      request,
      "/api/public/stores/loja-inicial/checkouts",
      { fetcher, mode: "passthrough", upstreamOrigin: "https://pdv.buzzcafe.com.br" },
    );

    const upstreamRequest = fetcher.mock.calls[0]?.[0];
    expect(upstreamRequest).toBeInstanceOf(Request);
    expect(upstreamRequest?.method).toBe("POST");
    expect(upstreamRequest?.headers.get("authorization")).toBe(
      "Bearer public-token",
    );
    expect(upstreamRequest?.headers.get("idempotency-key")).toBe("checkout-key");
    expect(upstreamRequest?.headers.get("content-type")).toBe("application/json");
    expect(upstreamRequest?.headers.get("cookie")).toBeNull();
    await expect(upstreamRequest?.text()).resolves.toBe('{"items":[]}');
    expect(response.status).toBe(201);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("vary")).toContain("Authorization");
    await expect(response.json()).resolves.toEqual({ status: "pending" });
  });

  it.each([
    {
      name: "a cross-site origin",
      headers: {
        "content-type": "application/json",
        origin: "https://evil.example",
      },
      status: 403,
    },
    {
      name: "a missing origin",
      headers: { "content-type": "application/json" },
      status: 403,
    },
    {
      name: "a non-JSON content type",
      headers: {
        "content-type": "text/plain",
        origin: "https://buzzcafe.com.br",
      },
      status: 415,
    },
    {
      name: "a checkout without an idempotency header",
      headers: {
        "content-type": "application/json",
        origin: "https://buzzcafe.com.br",
      },
      status: 400,
    },
  ])("rejects $name before it reaches the PDV", async ({ headers, status }) => {
    const fetcher = vi.fn<(request: Request) => Promise<Response>>();
    const response = await proxyPublicStoreRequest(
      new Request(
        "https://buzzcafe.com.br/api/public/stores/loja-inicial/checkouts",
        { body: '{"items":[]}', headers, method: "POST" },
      ),
      "/api/public/stores/loja-inicial/checkouts",
      {
        fetcher,
        mode: "passthrough",
        upstreamOrigin: "https://pdv.buzzcafe.com.br",
      },
    );

    expect(response.status).toBe(status);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("constructs encoded allowlisted paths and rejects traversal", () => {
    expect(publicProxyPath("/api/public", ["stores", "loja inicial", "catalog"]))
      .toBe("/api/public/stores/loja%20inicial/catalog");
    expect(() => publicProxyPath("/api/public", ["..", "auth", "session"]))
      .toThrow("Caminho público inválido");
    expect(() => publicProxyPath("/api/public", ["stores", "a/b"]))
      .toThrow("Caminho público inválido");
  });

  it("rejects an upstream outside the production and localhost allowlist", async () => {
    const fetcher = vi.fn<(request: Request) => Promise<Response>>();

    const response = await proxyPublicStoreRequest(
      new Request("https://buzzcafe.com.br/loja"),
      "/loja",
      {
        fetcher,
        mode: "html",
        upstreamOrigin: "https://untrusted.example",
      },
    );

    expect(response.status).toBe(502);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
