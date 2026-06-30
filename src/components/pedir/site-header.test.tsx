import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/pedir/site-header";

describe("SiteHeader", () => {
  it("starts transparent and links the top CTA to WhatsApp", async () => {
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
    expect(whatsappLink).toHaveAttribute("target", "_blank");
    expect(whatsappLink.querySelector("img")).toHaveAttribute(
      "src",
      expect.stringContaining("whatsapp-logo.svg")
    );

    window.scrollY = 80;
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => expect(header).toHaveClass("fixed"));
    expect(header.className).toContain("bg-[rgba(255,250,242,0.94)]");
  });
});
