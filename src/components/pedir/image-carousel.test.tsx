import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ImageCarousel } from "@/components/pedir/image-carousel";
import { menuItems } from "@/lib/landing-data";

describe("ImageCarousel", () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("renders the menu images as a navigable carousel", async () => {
    const user = userEvent.setup();

    render(<ImageCarousel items={menuItems} />);

    expect(
      screen.getByRole("region", { name: "Itens do cardápio em destaque" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Imagem anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próxima imagem" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Mostrar Manhã Leve" }))
      .toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Mostrar Caramelo Jamon" }))
      .not.toHaveAttribute("aria-current");
    expect(screen.getByRole("img", { name: menuItems[0].image.alt }))
      .toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Próxima imagem" }));

    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Imagem anterior" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Mostrar Caramelo Jamon" }))
      .toHaveAttribute("aria-current", "true");
  });

  it("syncs controls with manual horizontal scrolling and dot clicks", async () => {
    const user = userEvent.setup();

    render(<ImageCarousel items={menuItems} />);

    const track = screen.getByTestId("image-carousel-track");
    const firstSlide = screen.getByTestId("image-carousel-slide-0");
    const secondSlide = screen.getByTestId("image-carousel-slide-1");
    const thirdSlide = screen.getByTestId("image-carousel-slide-2");
    const fourthSlide = screen.getByTestId("image-carousel-slide-3");
    const fifthSlide = screen.getByTestId("image-carousel-slide-4");

    mockRect(track, { left: 0 });
    mockRect(firstSlide, { left: -320 });
    mockRect(secondSlide, { left: 0 });
    mockRect(thirdSlide, { left: 320 });
    mockRect(fourthSlide, { left: 640 });
    mockRect(fifthSlide, { left: 960 });

    fireEvent.scroll(track);

    expect(screen.getByRole("button", { name: "Mostrar Caramelo Jamon" }))
      .toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Imagem anterior" }))
      .toBeEnabled();

    await user.click(
      screen.getByRole("button", { name: "Mostrar Dupla Gelada" })
    );

    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Mostrar Dupla Gelada" }))
      .toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Próxima imagem" }))
      .toBeDisabled();
  });
});

function mockRect(element: HTMLElement, rect: Pick<DOMRect, "left">) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    bottom: 0,
    height: 0,
    left: rect.left,
    right: 0,
    top: 0,
    width: 0,
    x: rect.left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
}
