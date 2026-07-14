"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ChannelAction } from "@/components/pedir/channel-action";
import type {
  ChannelConfig,
  HeroSlide,
  ImageAsset,
} from "@/lib/landing-data";
import {
  ASSET_BASE_PATH,
  HERO_SEO_DESCRIPTION,
  HERO_SEO_TITLE,
  ORDER_REWARD_LABEL,
} from "@/lib/landing-data";
import { cn } from "@/lib/utils";

type HeroCarouselProps = {
  actions: readonly ChannelConfig[];
  slides: readonly HeroSlide[];
};

const AUTO_ADVANCE_MS = 3000;
const HERO_ACTION_LOGO: Pick<ImageAsset, "width" | "height"> = {
  width: 64,
  height: 28,
};

export function HeroCarousel({
  actions,
  slides,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (
      isPaused ||
      slides.length < 2 ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, isPaused, slides.length]);

  if (!activeSlide) {
    return null;
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] overflow-hidden bg-[var(--buzz-ink)]"
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 -z-20">
        {slides.map((slide, index) => (
          <div
            aria-hidden={index !== activeIndex}
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-[1200ms] ease-in-out",
              index === activeIndex && "opacity-100"
            )}
            key={slide.key}
          >
            <Image
              alt={slide.image.alt}
              className={cn(
                "buzz-hero-carousel-image h-full w-full object-cover",
                index === activeIndex && "is-active"
              )}
              fill
              priority={index === 0}
              sizes="100vw"
              src={slide.image.src}
              style={{ objectPosition: slide.imagePosition }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(32,26,23,0.22)_0%,rgba(32,26,23,0.08)_28%,rgba(32,26,23,0.34)_56%,rgba(32,26,23,0.82)_100%)] md:bg-[linear-gradient(180deg,rgba(32,26,23,0.16)_0%,rgba(32,26,23,0.08)_34%,rgba(32,26,23,0.38)_66%,rgba(32,26,23,0.86)_100%)]" />

      <div className="relative z-10 flex min-h-[100svh] w-full items-end px-5 pt-28 pb-[calc(20px+env(safe-area-inset-bottom))] text-white sm:px-8 md:px-10 md:pt-36 md:pb-11 lg:px-16 lg:pb-16">
        <div className="mx-auto grid w-full max-w-[1180px] gap-6 md:grid-cols-[minmax(0,1fr)_minmax(290px,380px)] md:items-end lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,420px)]">
          <div className="buzz-hero-copy" key={activeSlide.key}>
            <h1
              className="max-w-[42ch] text-[0.95rem] leading-tight font-black tracking-[0] text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.42)] md:text-[1.05rem]"
              id="hero-title"
            >
              {HERO_SEO_TITLE}
            </h1>
            <p
              className="mt-2 max-w-[11ch] text-[clamp(3.35rem,16vw,5.35rem)] leading-[0.9] font-normal tracking-[0] uppercase text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.34)] md:mt-3 md:text-[clamp(4.1rem,9vw,6.4rem)] lg:text-[clamp(4.8rem,7.5vw,7.8rem)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {activeSlide.title}
            </p>
            <p className="mt-4 max-w-[34ch] text-[1rem] leading-relaxed text-white/86 drop-shadow-[0_2px_10px_rgba(0,0,0,0.38)] md:mt-5 md:text-[1.04rem] lg:max-w-[42ch] lg:text-[1.15rem]">
              {HERO_SEO_DESCRIPTION}
            </p>
            <p className="mt-4 text-sm font-black tracking-[0] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:text-base">
              Printou, mandou, ganhou:{" "}
              <span className="text-[var(--buzz-honey)]">
                {ORDER_REWARD_LABEL}
              </span>
              .
            </p>
          </div>

          <div
            aria-label="Ações principais"
            className="grid gap-2 md:justify-self-end md:self-end"
          >
            {actions.map((channel) => (
              <ChannelAction
                channel={channel}
                className={cn(
                  "min-h-12 w-full min-w-0 justify-center rounded-[8px] border border-white/36 bg-white/88 px-3 py-2.5 text-[0.9rem] text-[var(--buzz-ink)] shadow-[0_18px_42px_rgba(0,0,0,0.22)] backdrop-blur-md hover:-translate-y-0.5 hover:border-white/70 hover:bg-white md:w-[min(100%,380px)] md:gap-2 md:px-3 md:text-[0.84rem] lg:min-h-[54px] lg:w-[420px] lg:px-4 lg:text-sm",
                  channel.key === "ifood"
                    ? "border-[rgba(255,255,255,0.52)] bg-[rgba(255,250,242,0.9)]"
                    : channel.key === "keeta"
                      ? "border-[rgba(255,255,255,0.42)] bg-[rgba(255,250,242,0.84)]"
                      : "border-[rgba(255,255,255,0.38)] bg-[rgba(255,250,242,0.82)]"
                )}
                key={channel.key}
                label={channel.heroActionLabel ?? channel.actionLabel}
                logo={getHeroLogo(channel)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getHeroLogo(channel: ChannelConfig): ImageAsset {
  if (channel.key === "ifood") {
    return {
      src: `${ASSET_BASE_PATH}/ifood-logo-red.svg`,
      alt: "",
      ...HERO_ACTION_LOGO,
    };
  }

  return {
    src: channel.buttonLogo.src,
    alt: "",
    ...HERO_ACTION_LOGO,
  };
}
