import { describe, expect, it } from "vitest";

import {
  CHANNEL_KEYS,
  ORDER_COUPON,
  cafeJsonLd,
  channels,
  fallbackChannelLinks,
  heroActions,
  heroSlides,
  menuItems,
} from "@/lib/landing-data";

describe("landing data contract", () => {
  it("defines one order channel for every supported channel key", () => {
    expect(channels.map((channel) => channel.key)).toEqual(CHANNEL_KEYS);
  });

  it("uses the same first-order coupon across every channel", () => {
    expect(
      channels.map(({ coupon, eventName, key }) => ({
        coupon,
        eventName,
        key,
      }))
    ).toEqual([
      { coupon: ORDER_COUPON, eventName: "Clique_iFood", key: "ifood" },
      { coupon: ORDER_COUPON, eventName: "Clique_Keeta", key: "keeta" },
      { coupon: ORDER_COUPON, eventName: "Clique_99Food", key: "99food" },
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
      title: `Usar ${ORDER_COUPON} no Keeta`,
    });
    expect(keeta?.description.toLowerCase()).not.toContain("frete");
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

  it("publishes local business structured data for the root page", () => {
    expect(cafeJsonLd).toMatchObject({
      "@type": "CafeOrCoffeeShop",
      areaServed: "Brás, São Paulo",
      name: "Buzz Café",
      url: "https://buzzcafe.com.br/",
    });
  });
});
