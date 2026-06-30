import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HeroCarousel } from "@/components/pedir/hero-carousel";
import { OrderTrackingProvider } from "@/components/pedir/order-tracking-provider";
import { heroActions, heroProofPoints, heroSlides } from "@/lib/landing-data";

describe("HeroCarousel", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("auto-advances the main hero image every 3 seconds", () => {
    vi.useFakeTimers();
    vi.spyOn(window.console, "info").mockImplementation(() => undefined);
    vi.spyOn(window.console, "warn").mockImplementation(() => undefined);

    render(
      <OrderTrackingProvider>
        <HeroCarousel actions={heroActions} slides={heroSlides} />
      </OrderTrackingProvider>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: heroSlides[0].title })
    ).toBeInTheDocument();
    expect(screen.queryByText(heroSlides[0].eyebrow)).not.toBeInTheDocument();
    expect(screen.queryByText("Buzz Café")).not.toBeInTheDocument();
    heroProofPoints.forEach((proofPoint) => {
      expect(screen.queryByText(proofPoint)).not.toBeInTheDocument();
    });
    const actionRegion = screen.getByLabelText("Ações principais");
    const logoSlots = actionRegion.querySelectorAll("a > span:first-child");
    expect(logoSlots).toHaveLength(3);
    logoSlots.forEach((logoSlot) => {
      expect(logoSlot).toHaveStyle({ height: "28px", width: "64px" });
    });
    expect(
      screen.getByRole("link", { name: "Pedir no iFood" })
    ).toHaveClass("bg-[rgba(255,250,242,0.9)]", "md:text-[0.84rem]");
    expect(screen.getByLabelText("Ações principais")).toHaveClass(
      "md:justify-self-end"
    );

    act(() => {
      vi.advanceTimersByTime(2999);
    });

    expect(
      screen.getByRole("heading", { level: 1, name: heroSlides[0].title })
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(
      screen.getByRole("heading", { level: 1, name: heroSlides[1].title })
    ).toBeInTheDocument();
  });
});
