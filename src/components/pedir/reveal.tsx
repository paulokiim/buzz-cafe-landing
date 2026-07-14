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
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      const timer = window.setTimeout(() => setIsVisible(true), 0);

      return () => window.clearTimeout(timer);
    }

    const rect = node.getBoundingClientRect();
    const startsInView = rect.top < window.innerHeight * 0.88 && rect.bottom > 0;

    setIsVisible(startsInView);
    setIsReady(true);

    if (startsInView) {
      return;
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
    const safetyTimer = window.setTimeout(() => setIsVisible(true), 2500);

    observer.observe(node);

    return () => {
      window.clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, []);

  const sharedProps = {
    className: cn("buzz-reveal", className),
    "data-reveal-ready": isReady ? "true" : undefined,
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
