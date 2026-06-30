import { afterEach, describe, expect, it, vi } from "vitest";

describe("landing data env links", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses delivery links from env and normalizes missing protocols", async () => {
    vi.stubEnv(
      "IFOOD_LINK",
      "ifood.com.br/delivery/sao-paulo-sp/buzz-cafe-bras/f82204bc-fb5d-4d71-950f-fda218b23ac9?utm_medium=share"
    );
    vi.stubEnv("KEETA_LINK", "url-eu.mykeeta.com/NikFPhsz");
    vi.stubEnv("NINE_NINE_FOOD_LINK", "https://oia.99app.com/dlp9/JIFaZ7");
    vi.resetModules();

    const { channels } = await import("@/lib/landing-data");

    expect(channels.map(({ href, key }) => ({ href, key }))).toEqual([
      {
        href: "https://ifood.com.br/delivery/sao-paulo-sp/buzz-cafe-bras/f82204bc-fb5d-4d71-950f-fda218b23ac9?utm_medium=share",
        key: "ifood",
      },
      { href: "https://url-eu.mykeeta.com/NikFPhsz", key: "keeta" },
      { href: "https://oia.99app.com/dlp9/JIFaZ7", key: "99food" },
    ]);
  });
});
