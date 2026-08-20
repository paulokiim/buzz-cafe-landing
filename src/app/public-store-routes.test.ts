import { afterEach, describe, expect, it, vi } from "vitest";

import {
  GET as getPublicApi,
  HEAD as headPublicApi,
  OPTIONS as optionsPublicApi,
  POST as postPublicApi,
} from "@/app/api/public/[...path]/route";
import {
  GET as getStoreAsset,
  HEAD as headStoreAsset,
} from "@/app/loja-assets/[...path]/route";
import {
  GET as getStoreAlias,
  HEAD as headStoreAlias,
} from "@/app/loja/[storeSlug]/route";
import { GET as getStore, HEAD as headStore } from "@/app/loja/route";
import {
  GET as getPublicMedia,
  HEAD as headPublicMedia,
} from "@/app/media/[...path]/route";

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

  it("fails closed locally for every obsolete proxy method", async () => {
    const upstream = vi.fn(() => {
      throw new Error("obsolete landing routes must not call fetch");
    });
    vi.stubGlobal("fetch", upstream);

    const cases = [
      getPublicApi(
        new Request("http://localhost:3001/api/public/stores/loja-inicial/catalog"),
      ),
      headPublicApi(
        new Request("http://localhost:3001/api/public/stores/loja-inicial/catalog", {
          method: "HEAD",
        }),
      ),
      optionsPublicApi(
        new Request("http://localhost:3001/api/public/stores/loja-inicial/catalog", {
          method: "OPTIONS",
        }),
      ),
      postPublicApi(
        new Request("http://localhost:3001/api/public/stores/loja-inicial/checkouts", {
          body: '{"items":[]}',
          headers: { "content-type": "application/json" },
          method: "POST",
        }),
      ),
      getStoreAsset(
        new Request("http://localhost:3001/loja-assets/brand-logo.webp"),
      ),
      headStoreAsset(
        new Request("http://localhost:3001/loja-assets/brand-logo.webp", {
          method: "HEAD",
        }),
      ),
      getPublicMedia(
        new Request("http://localhost:3001/media/products/iced-latte.webp"),
      ),
      headPublicMedia(
        new Request("http://localhost:3001/media/products/iced-latte.webp", {
          method: "HEAD",
        }),
      ),
    ];

    for (const response of cases) {
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(404);
      expect(response.headers.get("cache-control")).toBe("no-store");
    }
    expect(upstream).not.toHaveBeenCalled();
    expect(await cases[1]!.text()).toBe("");
    expect(await cases[5]!.text()).toBe("");
    expect(await cases[7]!.text()).toBe("");
  });
});
