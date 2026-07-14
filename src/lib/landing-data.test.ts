import { describe, expect, it } from "vitest";

import {
  CHANNEL_KEYS,
  HERO_SEO_DESCRIPTION,
  HERO_SEO_TITLE,
  ORDER_REWARD,
  ORDER_REWARD_LABEL,
  cafeJsonLd,
  channels,
  faqItems,
  faqJsonLd,
  fallbackChannelLinks,
  heroActions,
  heroSlides,
  localSeoHighlights,
  menuItems,
} from "@/lib/landing-data";

describe("landing data contract", () => {
  it("defines one order channel for every supported channel key", () => {
    expect(channels.map((channel) => channel.key)).toEqual(CHANNEL_KEYS);
  });

  it("defines a tracked action for every supported channel", () => {
    expect(
      channels.map(({ eventName, key, title }) => ({
        eventName,
        key,
        title,
      }))
    ).toEqual([
      { eventName: "Clique_iFood", key: "ifood", title: "Pedir no iFood" },
      { eventName: "Clique_Keeta", key: "keeta", title: "Pedir no Keeta" },
      {
        eventName: "Clique_99Food",
        key: "99food",
        title: "Pedir no 99 Food",
      },
    ]);
  });

  it("uses every order channel as a primary hero action", () => {
    expect(heroActions.map((channel) => channel.key)).toEqual([
      "ifood",
      "keeta",
      "99food",
    ]);
  });

  it("provides useful fallback links when production URLs are not configured", () => {
    expect(channels.map(({ href, key }) => ({ href, key }))).toEqual([
      { href: fallbackChannelLinks.ifood, key: "ifood" },
      { href: fallbackChannelLinks.keeta, key: "keeta" },
      { href: fallbackChannelLinks["99food"], key: "99food" },
    ]);
    expect(fallbackChannelLinks["99food"]).toContain("99app.com/99food");
  });

  it("presents Keeta as an order channel, not as a freight-comparison path", () => {
    const keeta = channels.find((channel) => channel.key === "keeta");

    expect(keeta).toMatchObject({
      title: "Pedir no Keeta",
    });
    expect(keeta?.description.toLowerCase()).not.toContain("frete");
    expect(ORDER_REWARD).toBe("Americano iced ou hot");
    expect(ORDER_REWARD_LABEL).toBe(
      "Americano iced ou hot grátis"
    );
  });

  it("uses the selected combo photos for the carousel", () => {
    expect(menuItems).toHaveLength(5);
    expect(menuItems.map((item) => item.title)).toEqual([
      "Manhã Leve",
      "Caramelo Jamon",
      "Matcha Crunch",
      "Matcha Chocolate",
      "Dupla Gelada",
    ]);
  });

  it("uses the cardapio items as hero carousel slides", () => {
    expect(heroSlides).toHaveLength(menuItems.length);
    expect(heroSlides.map((slide) => slide.title)).toEqual(
      menuItems.map((item) => item.title)
    );
    expect(heroSlides.map((slide) => slide.image)).toEqual(
      menuItems.map((item) => item.image)
    );
  });

  it("keeps the hero conversion carousel while publishing a stable local SEO headline", () => {
    expect(HERO_SEO_TITLE).toBe("Cafeteria no Brás para pedir agora");
    expect(HERO_SEO_DESCRIPTION).toContain("perto do Pari");
    expect(heroSlides.map((slide) => slide.title)).toContain("Manhã Leve");
  });

  it("publishes local SEO copy for Brás and Pari", () => {
    const searchableCopy = [
      HERO_SEO_TITLE,
      HERO_SEO_DESCRIPTION,
      ...localSeoHighlights.flatMap((highlight) => [
        highlight.title,
        highlight.description,
      ]),
      ...faqItems.flatMap((item) => [item.question, item.answer]),
    ].join(" ");

    expect(searchableCopy).toContain("Brás");
    expect(searchableCopy).toContain("Pari");
  });

  it("publishes local business structured data for the root page", () => {
    expect(cafeJsonLd).toMatchObject({
      "@type": "CafeOrCoffeeShop",
      "@id": "https://www.buzzcafe.com.br/#buzz-cafe",
      name: "Buzz Café",
      telephone: "+5511917992193",
      url: "https://www.buzzcafe.com.br/",
    });
    expect(cafeJsonLd.areaServed.map((area) => area.name)).toEqual([
      "Brás, São Paulo",
      "Pari, São Paulo",
    ]);
    expect(cafeJsonLd.servesCuisine).toEqual(
      expect.arrayContaining(["Café da manhã", "Doces", "Salgados"])
    );
  });

  it("publishes FAQ structured data from visible FAQ content", () => {
    expect(faqJsonLd).toMatchObject({
      "@type": "FAQPage",
    });
    expect(faqJsonLd.mainEntity).toHaveLength(faqItems.length);
    expect(faqJsonLd.mainEntity[0]).toMatchObject({
      "@type": "Question",
      name: faqItems[0].question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqItems[0].answer,
      },
    });
  });
});
