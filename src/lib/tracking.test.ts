import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createTrackingPayload,
  recordTrackingEvent,
  type TrackingPayload,
} from "@/lib/tracking";
import { ORDER_COUPON } from "@/lib/landing-data";

describe("tracking", () => {
  beforeEach(() => {
    vi.spyOn(window.console, "info").mockImplementation(() => undefined);
    vi.spyOn(window.console, "warn").mockImplementation(() => undefined);
  });

  it("creates deterministic tracking payloads", () => {
    expect(
      createTrackingPayload(
        "Clique_iFood",
        { channel: "ifood", coupon: ORDER_COUPON },
        new Date("2026-06-26T10:00:00.000Z")
      )
    ).toEqual({
      channel: "ifood",
      coupon: ORDER_COUPON,
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
      { channel: "keeta", coupon: ORDER_COUPON },
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

  it("limits persisted history to the configured maximum", () => {
    recordTrackingEvent("PageView", { source: "next" }, { maxHistory: 2 });
    recordTrackingEvent(
      "Clique_iFood",
      { channel: "ifood", coupon: ORDER_COUPON },
      { maxHistory: 2 }
    );
    recordTrackingEvent(
      "Clique_99Food",
      { channel: "99food", coupon: ORDER_COUPON },
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
