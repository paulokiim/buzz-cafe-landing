import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

type MockedImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  src: string | { src: string };
};

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: MockedImageProps) => {
    delete props.fill;
    delete props.priority;
    delete props.sizes;

    return React.createElement("img", {
      ...props,
      alt: alt ?? "",
      src: typeof src === "string" ? src : src.src,
    });
  },
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.dataLayer = [];
});
