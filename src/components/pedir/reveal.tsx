"use client";

import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "li";
  delay?: number;
  effect?: "fade-up" | "slide-left" | "scale-in";
};

export function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  effect = "fade-up",
  style,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setIsVisible(true), 0);

      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const sharedProps = {
    className: cn("buzz-reveal", className),
    "data-reveal": isVisible ? "visible" : "hidden",
    "data-reveal-effect": effect,
    style: {
      "--reveal-delay": `${delay}ms`,
      ...style,
    } as CSSProperties,
    ...props,
  };

  if (as === "li") {
    return (
      <li {...sharedProps} ref={ref as Ref<HTMLLIElement>}>
        {children}
      </li>
    );
  }

  return (
    <div
      {...sharedProps}
      ref={ref as Ref<HTMLDivElement>}
    >
      {children}
    </div>
  );
}
