import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SiteHeader } from "@/components/pedir/site-header";

describe("SiteHeader", () => {
  it("starts transparent and links the top CTA to WhatsApp", async () => {
    const user = userEvent.setup();
    vi.spyOn(window.console, "info").mockImplementation(() => undefined);
    vi.spyOn(window.console, "warn").mockImplementation(() => undefined);
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });

    render(<SiteHeader />);

    const header = screen.getByRole("banner");
    const whatsappLink = screen.getByRole("link", {
      name: "Chamar Buzz Café no WhatsApp",
    });

    expect(header).toHaveClass("absolute", "bg-transparent");
    expect(whatsappLink).toHaveTextContent("WhatsApp");
    expect(whatsappLink).toHaveClass("bg-[#25D366]", "text-white");
    expect(whatsappLink).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/5511917992193")
    );
    expect(whatsappLink).toHaveAttribute(
      "href",
      expect.stringContaining("Avaliei%20meu%20pedido")
    );
    expect(whatsappLink).toHaveAttribute("data-event", "Clique_WhatsApp");
    expect(whatsappLink).toHaveAttribute("target", "_blank");
    expect(whatsappLink.querySelector("img")).toHaveAttribute(
      "src",
      expect.stringContaining("whatsapp-logo.svg")
    );

    await user.click(whatsappLink);

    await waitFor(() =>
      expect(window.dataLayer?.at(-1)).toMatchObject({
        channel: "whatsapp",
        destinationConfigured: true,
        event: "Clique_WhatsApp",
        source: "next",
      })
    );

    window.scrollY = 80;
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => expect(header).toHaveClass("fixed"));
    expect(header.className).toContain("bg-[rgba(255,250,242,0.94)]");
  });
});
