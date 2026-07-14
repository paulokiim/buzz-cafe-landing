import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChannelAction } from "@/components/pedir/channel-action";
import { OrderTrackingProvider } from "@/components/pedir/order-tracking-provider";
import { channels, type ChannelConfig } from "@/lib/landing-data";

function renderWithProvider(children: React.ReactNode) {
  vi.spyOn(window.console, "info").mockImplementation(() => undefined);
  vi.spyOn(window.console, "warn").mockImplementation(() => undefined);

  render(<OrderTrackingProvider>{children}</OrderTrackingProvider>);
}

describe("ChannelAction", () => {
  it("renders an accessible prototype button and shows a toast when the link is blank", async () => {
    const user = userEvent.setup();
    const channel = { ...channels[0], href: "" } satisfies ChannelConfig;

    renderWithProvider(<ChannelAction channel={channel} />);

    const button = screen.getByRole("button", { name: "Abrir iFood" });
    expect(button).not.toHaveAttribute("href");

    await user.click(button);

    expect(await screen.findByTestId("prototype-toast")).toHaveTextContent(
      "Clique em iFood registrado"
    );
    await waitFor(() =>
      expect(window.dataLayer?.map((event) => event.event)).toContain(
        "Clique_iFood"
      )
    );
    expect(window.dataLayer?.at(-1)).toMatchObject({
      channel: "ifood",
      destinationConfigured: false,
      event: "Clique_iFood",
      source: "next",
    });
  });

  it("renders a tracked outbound link when a production href exists", async () => {
    const user = userEvent.setup();
    const channel = {
      ...channels[1],
      href: "https://example.com/keeta",
    } satisfies ChannelConfig;

    renderWithProvider(<ChannelAction channel={channel} />);

    const link = screen.getByRole("link", { name: "Abrir Keeta" });
    expect(link).toHaveAttribute("href", "https://example.com/keeta");
    expect(link).toHaveAttribute("target", "_blank");

    await user.click(link);

    await waitFor(() =>
      expect(window.dataLayer?.map((event) => event.event)).toContain(
        "Clique_Keeta"
      )
    );
    expect(window.dataLayer?.at(-1)).toMatchObject({
      channel: "keeta",
      destinationConfigured: true,
      event: "Clique_Keeta",
      source: "next",
    });
    expect(screen.getByTestId("prototype-toast")).toBeEmptyDOMElement();
  });
});
