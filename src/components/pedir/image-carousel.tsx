"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ImageAsset } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

type CarouselItem = {
  title: string;
  description: string;
  image: ImageAsset;
};

type ImageCarouselProps = {
  items: readonly CarouselItem[];
};

export function ImageCarousel({ items }: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, items.length - 1));
    setActiveIndex(nextIndex);
    slideRefs.current[nextIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const syncActiveSlide = () => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const trackLeft = track.getBoundingClientRect().left;
    let closestIndex = activeIndex;
    let closestDistance = Number.POSITIVE_INFINITY;

    slideRefs.current.forEach((slide, index) => {
      if (!slide) {
        return;
      }

      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  return (
    <div
      aria-label="Itens do cardápio em destaque"
      className="relative overflow-hidden"
      role="region"
    >
      <div className="mb-4 flex justify-end gap-2">
        <Button
          aria-label="Imagem anterior"
          className="size-9 rounded-full border-[var(--buzz-line)] bg-[var(--buzz-card)] text-[var(--buzz-ink)] hover:bg-[var(--buzz-surface)]"
          disabled={activeIndex === 0}
          onClick={() => goToSlide(activeIndex - 1)}
          size="icon"
          type="button"
          variant="outline"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Button>
        <Button
          aria-label="Próxima imagem"
          className="size-9 rounded-full border-[var(--buzz-line)] bg-[var(--buzz-card)] text-[var(--buzz-ink)] hover:bg-[var(--buzz-surface)]"
          disabled={activeIndex === items.length - 1}
          onClick={() => goToSlide(activeIndex + 1)}
          size="icon"
          type="button"
          variant="outline"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Button>
      </div>

      <div
        className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-testid="image-carousel-track"
        onScroll={syncActiveSlide}
        ref={trackRef}
      >
        {items.map((item, index) => (
          <Card
            className="buzz-carousel-card min-w-[82%] snap-start overflow-hidden rounded-[8px] border-[var(--buzz-line)] bg-[var(--buzz-card)] p-0 shadow-none sm:min-w-[52%] lg:min-w-[31%]"
            data-testid={`image-carousel-slide-${index}`}
            key={item.title}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
          >
            <div className="relative aspect-[1.15/1] w-full overflow-hidden">
              <Image
                alt={item.image.alt}
                className="object-cover"
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 52vw, 82vw"
                src={item.image.src}
              />
            </div>
            <div className="p-[18px]">
              <h3 className="text-[1.08rem] leading-tight font-black tracking-[0]">
                {item.title}
              </h3>
              <p className="mt-2 text-[var(--buzz-muted)]">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div
        aria-label="Selecionar imagem do carrossel"
        className="mt-3 flex justify-center gap-1.5"
      >
        {items.map((item, index) => (
          <button
            aria-label={`Mostrar ${item.title}`}
            aria-current={activeIndex === index ? "true" : undefined}
            className={cn(
              "size-2 rounded-full bg-[var(--buzz-muted)]/35 transition-all duration-300 hover:bg-[var(--buzz-ink)]/70",
              activeIndex === index && "w-5 bg-[var(--buzz-ink)]"
            )}
            key={item.title}
            onClick={() => goToSlide(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
