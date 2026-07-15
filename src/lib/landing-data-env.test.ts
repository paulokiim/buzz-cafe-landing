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

    expect(
      channels.map(({ href, key }) => {
        const url = new URL(href);

        return {
          content: url.searchParams.get("utm_content"),
          key,
          medium: url.searchParams.get("utm_medium"),
          source: url.searchParams.get("utm_source"),
        };
      })
    ).toEqual([
      {
        content: "ifood",
        key: "ifood",
        medium: "referral",
        source: "buzzcafe.com.br",
      },
      {
        content: "keeta",
        key: "keeta",
        medium: "referral",
        source: "buzzcafe.com.br",
      },
      {
        content: "99food",
        key: "99food",
        medium: "referral",
        source: "buzzcafe.com.br",
      },
    ]);
  });
});
