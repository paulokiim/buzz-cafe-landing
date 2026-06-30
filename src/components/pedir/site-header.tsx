"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ASSET_BASE_PATH } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

const WHATSAPP_URL =
  "https://wa.me/5511917992193?text=Oi%2C%20Buzz%20Caf%C3%A9!%20Quero%20fazer%20um%20pedido%20com%20o%20cupom%20BUZZ10.";

export function SiteHeader() {
  const [isSolid, setIsSolid] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsSolid(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-40 grid grid-cols-[auto_1fr_auto] items-center gap-3 bg-transparent px-4 py-3 text-[var(--buzz-ink)] transition duration-200 sm:fixed sm:grid-cols-[1fr_auto_1fr] sm:px-8 sm:py-4 lg:px-20",
        isSolid ? "fixed" : "absolute",
        isSolid &&
          "bg-[rgba(255,250,242,0.94)] text-[var(--buzz-ink)] shadow-[0_1px_0_var(--buzz-line)] backdrop-blur-md"
      )}
      data-header
    >
      <nav
        aria-label="Principal"
        className="hidden items-center gap-2 justify-self-start text-sm font-black sm:flex"
      >
        <a
          className="rounded-full px-3 py-2 hover:bg-[rgba(32,26,23,0.08)] focus-visible:bg-[rgba(32,26,23,0.08)]"
          href="#cardapio"
        >
          Cardápio
        </a>
      </nav>
      <a
        aria-label="Buzz Café"
        className="inline-flex min-w-0 items-center justify-self-start font-black tracking-[0] sm:justify-self-center"
        href="#top"
      >
        <span className="relative block h-[49px] w-[126px] sm:h-[67px] sm:w-[174px] lg:h-[75px] lg:w-[194px]">
          <Image
            alt="Buzz Café"
            className={cn(
              "object-contain",
              !isSolid && "drop-shadow-[0_2px_8px_rgba(255,250,242,0.48)]"
            )}
            fill
            priority
            sizes="(min-width: 1024px) 194px, (min-width: 640px) 174px, 126px"
            src={`${ASSET_BASE_PATH}/brand-logo-header-transparent.webp`}
          />
        </span>
      </a>
      <nav aria-label="Pedido" className="justify-self-end text-sm font-black">
        <a
          aria-label="Chamar Buzz Café no WhatsApp"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2 text-white shadow-[0_8px_24px_rgba(37,211,102,0.26)] hover:bg-[#20bd5a] focus-visible:bg-[#20bd5a]"
          href={WHATSAPP_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span
            aria-hidden
            className="relative block size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-white/60"
          >
            <Image
              alt=""
              className="object-contain"
              fill
              sizes="20px"
              src={`${ASSET_BASE_PATH}/whatsapp-logo.svg`}
            />
          </span>
          WhatsApp
        </a>
      </nav>
    </header>
  );
}
