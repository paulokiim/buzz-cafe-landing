import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";
import { HERO_SEO_TITLE } from "@/lib/landing-data";

describe("HomePage", () => {
  it("renders the complete order page and records PageView on mount", async () => {
    vi.spyOn(window.console, "info").mockImplementation(() => undefined);
    vi.spyOn(window.console, "warn").mockImplementation(() => undefined);

    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: HERO_SEO_TITLE })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Manhã Leve").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Buzz Café").length).toBeGreaterThan(0);
    expect(screen.queryByText(/1 de \d+/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Printou, mandou, ganhou!",
      })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/envie o print da avaliação no WhatsApp/i).length
    ).toBeGreaterThan(0);
    expect(screen.queryByText("O que pedir primeiro")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Café, doces e salgados perto do Pari",
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/Rua Xavantes, 819 - Brás/i)).toBeInTheDocument();
    expect(screen.getByText("O Buzz Café fica no Brás?")).toBeInTheDocument();

    await waitFor(() =>
      expect(window.dataLayer?.filter((event) => event.event === "PageView"))
        .toHaveLength(1)
    );
    expect(window.dataLayer?.[0]).toMatchObject({
      event: "PageView",
      page: "pedir-buzz-cafe",
      source: "next",
    });
  });
});
