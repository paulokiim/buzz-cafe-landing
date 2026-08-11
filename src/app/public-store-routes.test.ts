import { afterEach, describe, expect, it, vi } from "vitest";

import {
  GET as getPublicApi,
  POST as postPublicApi,
} from "@/app/api/public/[...path]/route";
import { GET as getStoreAsset } from "@/app/loja-assets/[...path]/route";
import { GET as getStoreAlias } from "@/app/loja/[storeSlug]/route";
import { GET as getStore } from "@/app/loja/route";
import { GET as getPublicMedia } from "@/app/media/[...path]/route";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("public storefront routes", () => {
  it("serves the primary store at /loja", async () => {
    const upstream = vi.fn<(request: Request) => Promise<Response>>(
      async () =>
        new Response("<html>Loja Buzz</html>", {
          headers: { "content-type": "text/html" },
        }),
    );
    vi.stubGlobal("fetch", upstream);

    const response = await getStore(new Request("http://localhost:3001/loja"));

    expect(response.status).toBe(200);
    expect(upstream.mock.calls[0]?.[0].url).toBe(
      "http://localhost:3004/loja",
    );
  });

  it("redirects the legacy primary-store slug to the short public URL", async () => {
    const response = await getStoreAlias(
      new Request("http://localhost:3001/loja/loja-inicial"),
      { params: Promise.resolve({ storeSlug: "loja-inicial" }) },
    );

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("http://localhost:3001/loja");
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
