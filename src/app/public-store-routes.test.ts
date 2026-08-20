import { afterEach, describe, expect, it, vi } from "vitest";

import {
  GET as getPublicApi,
  POST as postPublicApi,
} from "@/app/api/public/[...path]/route";
import { GET as getStoreAsset } from "@/app/loja-assets/[...path]/route";
import {
  GET as getStoreAlias,
  HEAD as headStoreAlias,
} from "@/app/loja/[storeSlug]/route";
import { GET as getStore, HEAD as headStore } from "@/app/loja/route";
import { GET as getPublicMedia } from "@/app/media/[...path]/route";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("public storefront routes", () => {
  it("temporarily redirects the primary store to the fixed PDV storefront", async () => {
    const upstream = vi.fn<(request: Request) => Promise<Response>>();
    vi.stubGlobal("fetch", upstream);

    const response = await getStore(
      new Request(
        "https://attacker.example/loja?utm_source=meta&item=latte%20buzz",
      ),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://pdv.buzzcafe.com.br/loja?utm_source=meta&item=latte%20buzz",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(upstream).not.toHaveBeenCalled();
  });

  it("redirects HEAD without a response body", async () => {
    const response = await headStore(
      new Request("https://buzzcafe.com.br/loja?campaign=launch", {
        method: "HEAD",
      }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://pdv.buzzcafe.com.br/loja?campaign=launch",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.text()).toBe("");
  });

  it("normalizes the legacy primary-store slug to the fixed short PDV URL", async () => {
    const response = await getStoreAlias(
      new Request(
        "https://attacker.example/loja/loja-inicial?utm_medium=paid-social",
      ),
      { params: Promise.resolve({ storeSlug: "loja-inicial" }) },
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://pdv.buzzcafe.com.br/loja?utm_medium=paid-social",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("uses the same fixed destination for a valid slug HEAD request", async () => {
    const response = await headStoreAlias(
      new Request("https://buzzcafe.com.br/loja/outra-loja?source=qr", {
        method: "HEAD",
      }),
      { params: Promise.resolve({ storeSlug: "outra-loja" }) },
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://pdv.buzzcafe.com.br/loja?source=qr",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.text()).toBe("");
  });

  it("does not expose a redirecting POST handler for the storefront", async () => {
    const [storeRoute, storeAliasRoute] = await Promise.all([
      import("@/app/loja/route"),
      import("@/app/loja/[storeSlug]/route"),
    ]);

    expect(storeRoute).not.toHaveProperty("POST");
    expect(storeAliasRoute).not.toHaveProperty("POST");
  });

  it("keeps the public API under the apex origin", async () => {
    const upstream = vi.fn<(request: Request) => Promise<Response>>(
      async () => Response.json({ ok: true }),
    );
    vi.stubGlobal("fetch", upstream);

    const response = await getPublicApi(
      new Request("http://localhost:3001/api/public/stores/loja-inicial/catalog"),
      {
        params: Promise.resolve({
          path: ["stores", "loja-inicial", "catalog"],
        }),
      },
    );

    expect(response.status).toBe(200);
    expect(upstream.mock.calls[0]?.[0].url).toBe(
      "http://localhost:3004/api/public/stores/loja-inicial/catalog",
    );
  });

  it("rejects an unsafe public API POST at the landing boundary", async () => {
    const upstream = vi.fn<(request: Request) => Promise<Response>>();
    vi.stubGlobal("fetch", upstream);

    const response = await postPublicApi(
      new Request("http://localhost:3001/api/public/stores/loja-inicial/checkouts", {
        body: '{"items":[]}',
        headers: { "content-type": "text/plain" },
        method: "POST",
      }),
      { params: Promise.resolve({ path: ["stores", "loja-inicial", "checkouts"] }) },
    );

    expect(response.status).toBe(403);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("forwards namespaced storefront assets and product media", async () => {
    const upstream = vi.fn<(request: Request) => Promise<Response>>(
      async (request) =>
        new Response("binary", {
          headers: {
            "content-type": request.url.includes("loja-assets")
              ? "image/webp"
              : "image/jpeg",
          },
        }),
    );
    vi.stubGlobal("fetch", upstream);

    await getStoreAsset(
      new Request("http://localhost:3001/loja-assets/brand-logo.webp"),
      { params: Promise.resolve({ path: ["brand-logo.webp"] }) },
    );
    await getPublicMedia(
      new Request("http://localhost:3001/media/products/iced-latte.webp"),
      {
        params: Promise.resolve({ path: ["products", "iced-latte.webp"] }),
      },
    );

    expect(upstream.mock.calls.map(([request]) => request.url)).toEqual([
      "http://localhost:3004/loja-assets/brand-logo.webp",
      "http://localhost:3004/media/products/iced-latte.webp",
    ]);
  });

  it("turns an upstream app-shell fallback into a missing asset response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<(request: Request) => Promise<Response>>(async () =>
        new Response("<html>PDV shell</html>", {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      ),
    );

    const response = await getStoreAsset(
      new Request("http://localhost:3001/loja-assets/assets/missing.js"),
      { params: Promise.resolve({ path: ["assets", "missing.js"] }) },
    );

    expect(response.status).toBe(404);
  });
});
