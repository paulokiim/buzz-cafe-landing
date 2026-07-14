import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MobileOrderBar } from "@/components/pedir/mobile-order-bar";
import { OrderTrackingProvider } from "@/components/pedir/order-tracking-provider";
import { channels } from "@/lib/landing-data";

describe("MobileOrderBar", () => {
  it("appears after the user scrolls past the hero", async () => {
    const user = userEvent.setup();
    vi.spyOn(window.console, "info").mockImplementation(() => undefined);
    vi.spyOn(window.console, "warn").mockImplementation(() => undefined);
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });

    render(
      <OrderTrackingProvider>
        <MobileOrderBar orderChannels={channels} />
      </OrderTrackingProvider>
    );

    const bar = screen.getByLabelText("Pedido rápido");
    expect(bar).toHaveClass("hidden", "max-sm:grid");
    expect(bar).toHaveClass("pointer-events-none", "opacity-0");
    expect(screen.getByRole("link", { name: "Abrir iFood" }))
      .toHaveAccessibleName("Abrir iFood");
    expect(screen.getByRole("link", { name: "Abrir Keeta" }))
      .toHaveAccessibleName("Abrir Keeta");
    expect(screen.getByRole("link", { name: "Abrir 99 Food" }))
      .toHaveAccessibleName("Abrir 99 Food");
    expect(screen.getByText("iFood")).toHaveClass("sr-only");
    expect(screen.getByText("Keeta")).toHaveClass("sr-only");
    expect(screen.getByText("99")).toHaveClass("sr-only");
    expect(bar).toHaveClass("translate-y-[calc(100%+24px)]");

    window.scrollY = 600;
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => expect(bar).toHaveClass("translate-y-0"));
    expect(bar).toHaveClass("pointer-events-auto", "opacity-100");

    await user.click(screen.getByRole("link", { name: "Abrir 99 Food" }));

    await waitFor(() =>
      expect(window.dataLayer?.at(-1)).toMatchObject({
        channel: "99food",
        destinationConfigured: true,
        event: "Clique_99Food",
        source: "next",
      })
    );
  });
});
