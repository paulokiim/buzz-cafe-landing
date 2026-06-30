import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PedirPage from "@/app/pedir/page";

describe("PedirPage", () => {
  it("renders the complete order page and records PageView on mount", async () => {
    vi.spyOn(window.console, "info").mockImplementation(() => undefined);
    vi.spyOn(window.console, "warn").mockImplementation(() => undefined);

    render(<PedirPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Manhã Leve" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Buzz Café").length).toBeGreaterThan(0);
    expect(screen.queryByText(/1 de \d+/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Use BUZZ10 em qualquer plataforma",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/vale para uma compra por cliente/i)
    ).toBeInTheDocument();
    expect(screen.queryByText("O que pedir primeiro")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Um café da manhã com cara de cafeteria",
      })
    ).not.toBeInTheDocument();

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
