import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("metadata routes", () => {
  it("allows crawlers and points them to the canonical sitemap", () => {
    expect(robots()).toMatchObject({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://www.buzzcafe.com.br/sitemap.xml",
      host: "https://www.buzzcafe.com.br",
    });
  });

  it("publishes the canonical landing page in the sitemap", () => {
    expect(sitemap()).toEqual([
      expect.objectContaining({
        url: "https://www.buzzcafe.com.br/",
        changeFrequency: "weekly",
        priority: 1,
      }),
    ]);
  });
});
