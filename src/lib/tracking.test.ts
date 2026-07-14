import { beforeEach, describe, expect, it, vi } from "vitest";

const analyticsConfigMock = vi.hoisted(() => ({
  analyticsConfig: {
    enableVercelCustomEvents: false,
    googleTagManagerId: undefined as string | undefined,
  },
}));

vi.mock("@/lib/analytics-config", () => analyticsConfigMock);

import {
  createTrackingPayload,
  recordTrackingEvent,
  type TrackingPayload,
} from "@/lib/tracking";

describe("tracking", () => {
  beforeEach(() => {
    analyticsConfigMock.analyticsConfig.googleTagManagerId = undefined;
    vi.spyOn(window.console, "info").mockImplementation(() => undefined);
    vi.spyOn(window.console, "warn").mockImplementation(() => undefined);
  });

  it("creates deterministic tracking payloads", () => {
    expect(
      createTrackingPayload(
        "Clique_iFood",
        { channel: "ifood" },
        new Date("2026-06-26T10:00:00.000Z")
      )
    ).toEqual({
      channel: "ifood",
      event: "Clique_iFood",
      page: "pedir-buzz-cafe",
      timestamp: "2026-06-26T10:00:00.000Z",
    });
  });

  it("pushes events to dataLayer, dispatches a custom event, and stores history", () => {
    const listener = vi.fn();
    window.addEventListener("buzz:tracking", listener);

    const payload = recordTrackingEvent(
      "Clique_Keeta",
      { channel: "keeta" },
      {
        now: new Date("2026-06-26T11:00:00.000Z"),
        targetWindow: window,
      }
    );

    expect(window.dataLayer).toEqual([payload]);
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<TrackingPayload>).detail)
      .toEqual(payload);
    expect(
      JSON.parse(window.localStorage.getItem("buzzCafeEvents") ?? "[]")
    ).toEqual([payload]);
  });

  it("enriches events with campaign params and forwards clicks to GA and Meta when loaded", () => {
    const gtag = vi.fn();
    const fbq = vi.fn();
    window.gtag = gtag;
    window.fbq = fbq;
    window.history.pushState(
      {},
      "",
      "/?utm_source=instagram&utm_medium=social&utm_campaign=julho_delivery&utm_content=story_01&utm_term=cafe&utm_region=bras"
    );

    const payload = recordTrackingEvent(
      "Clique_iFood",
      {
        channel: "ifood",
        destinationConfigured: true,
        source: "next",
      },
      {
        now: new Date("2026-06-26T12:00:00.000Z"),
        targetWindow: window,
      }
    );

    expect(payload).toMatchObject({
      pagePath:
        "/?utm_source=instagram&utm_medium=social&utm_campaign=julho_delivery&utm_content=story_01&utm_term=cafe&utm_region=bras",
      utmCampaign: "julho_delivery",
      utmContent: "story_01",
      utmMedium: "social",
      utmRegion: "bras",
      utmSource: "instagram",
      utmTerm: "cafe",
    });
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "order_channel_click",
      expect.objectContaining({
        channel: "ifood",
        destination_configured: true,
        event_category: "landing_engagement",
        utm_campaign: "julho_delivery",
        utm_region: "bras",
        utm_source: "instagram",
      })
    );
    expect(fbq).toHaveBeenCalledWith(
      "trackCustom",
      "OrderChannelClick",
      expect.objectContaining({
        channel: "ifood",
        destination_configured: true,
        page_name: "pedir-buzz-cafe",
      })
    );
  });

  it("forwards WhatsApp clicks as contact events to Meta", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    recordTrackingEvent(
      "Clique_WhatsApp",
      {
        channel: "whatsapp",
        destinationConfigured: true,
        source: "next",
      },
      { targetWindow: window }
    );

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Contact",
      expect.objectContaining({
        channel: "whatsapp",
        page_name: "pedir-buzz-cafe",
      })
    );
  });

  it("leaves vendor click forwarding to GTM when GTM is configured", () => {
    analyticsConfigMock.analyticsConfig.googleTagManagerId = "GTM-ABC123";
    const gtag = vi.fn();
    const fbq = vi.fn();
    window.gtag = gtag;
    window.fbq = fbq;

    const payload = recordTrackingEvent(
      "Clique_99Food",
      {
        channel: "99food",
        destinationConfigured: true,
        source: "next",
      },
      {
        now: new Date("2026-06-26T13:00:00.000Z"),
        targetWindow: window,
      }
    );

    expect(window.dataLayer).toContain(payload);
    expect(gtag).not.toHaveBeenCalled();
    expect(fbq).not.toHaveBeenCalled();
  });

  it("limits persisted history to the configured maximum", () => {
    recordTrackingEvent("PageView", { source: "next" }, { maxHistory: 2 });
    recordTrackingEvent(
      "Clique_iFood",
      { channel: "ifood" },
      { maxHistory: 2 }
    );
    recordTrackingEvent(
      "Clique_99Food",
      { channel: "99food" },
      { maxHistory: 2 }
    );

    const history = JSON.parse(
      window.localStorage.getItem("buzzCafeEvents") ?? "[]"
    ) as TrackingPayload[];

    expect(history).toHaveLength(2);
    expect(history.map((event) => event.event)).toEqual([
      "Clique_iFood",
      "Clique_99Food",
    ]);
  });
});
