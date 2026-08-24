import { afterEach, describe, expect, it, vi } from "vitest";

import { GET as getPublicApi } from "@/app/api/public/[...path]/route";
import { GET as getStoreAsset } from "@/app/loja-assets/[...path]/route";
import { GET as getStoreAlias } from "@/app/loja/[storeSlug]/route";
import { GET as getStore } from "@/app/loja/route";
import { GET as getPublicMedia } from "@/app/media/[...path]/route";
import { GET as getMenuImage } from "@/app/menu/[...path]/route";

afterEach(() => vi.unstubAllGlobals());

describe("public storefront routes", () => {
  it("keeps the primary store on www and proxies it to the Sites frontend", async () => {
    const upstream = vi.fn<(request: Request) => Promise<Response>>(async () => new Response("<html>Buzz</html>", { headers: { "content-type": "text/html" } }));
    vi.stubGlobal("fetch", upstream);
    const response = await getStore(new Request("https://www.buzzcafe.com.br/loja?utm_source=meta"));
    expect(response.status).toBe(200);
    expect(upstream.mock.calls[0]?.[0]).toBeInstanceOf(Request);
    expect((upstream.mock.calls[0]?.[0] as Request).url).toBe("https://buzz-cafe-pdv.p12ulokr.chatgpt.site/loja?utm_source=meta");
  });

  it("normalizes the apex domain to the canonical www URL and preserves query parameters", async () => {
    const response = await getStore(new Request("https://buzzcafe.com.br/loja?campaign=launch"));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://www.buzzcafe.com.br/loja?campaign=launch");
  });

  it("rejects an unexpected host instead of creating an open proxy", async () => {
    const response = await getStore(new Request("https://attacker.example/loja"));
    expect(response.status).toBe(400);
  });

  it("normalizes the primary legacy slug on www", async () => {
    const response = await getStoreAlias(
      new Request("https://www.buzzcafe.com.br/loja/loja-inicial?utm_medium=qr"),
      { params: Promise.resolve({ storeSlug: "loja-inicial" }) },
    );
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://www.buzzcafe.com.br/loja?utm_medium=qr");
  });

  it("proxies storefront assets and both supported product-image namespaces", async () => {
    const upstream = vi.fn<(request: Request) => Promise<Response>>(async () => new Response("image", { headers: { "content-type": "image/png" } }));
    vi.stubGlobal("fetch", upstream);
    await getStoreAsset(new Request("https://www.buzzcafe.com.br/loja-assets/brand-logo.webp"), { params: Promise.resolve({ path: ["brand-logo.webp"] }) });
    await getPublicMedia(new Request("https://www.buzzcafe.com.br/media/products/latte.webp"), { params: Promise.resolve({ path: ["products", "latte.webp"] }) });
    await getMenuImage(new Request("https://www.buzzcafe.com.br/menu/iced_latte.png"), { params: Promise.resolve({ path: ["iced_latte.png"] }) });
    expect(upstream.mock.calls.map(([request]) => (request as Request).url)).toEqual([
      "https://buzz-cafe-pdv.p12ulokr.chatgpt.site/loja-assets/brand-logo.webp",
      "https://buzz-cafe-pdv.p12ulokr.chatgpt.site/media/products/latte.webp",
      "https://buzz-cafe-pdv.p12ulokr.chatgpt.site/menu/iced_latte.png",
    ]);
  });

  it("turns an upstream app-shell fallback into a missing product image", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html>PDV shell</html>", { headers: { "content-type": "text/html" } })));
    const [media, menu] = await Promise.all([
      getPublicMedia(new Request("https://www.buzzcafe.com.br/media/missing.webp"), { params: Promise.resolve({ path: ["missing.webp"] }) }),
      getMenuImage(new Request("https://www.buzzcafe.com.br/menu/missing.webp"), { params: Promise.resolve({ path: ["missing.webp"] }) }),
    ]);
    expect(media.status).toBe(404);
    expect(menu.status).toBe(404);
  });

  it("keeps the obsolete landing API closed", async () => {
    const response = await getPublicApi(new Request("https://www.buzzcafe.com.br/api/public/stores/loja-inicial/catalog"));
    expect(response.status).toBe(404);
  });
});
