"use client";

import { useEffect, useState } from "react";

import type { channels } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

import { ChannelAction } from "./channel-action";

type MobileOrderBarProps = {
  orderChannels: typeof channels;
};

export function MobileOrderBar({ orderChannels }: MobileOrderBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 520);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <div
      aria-label="Pedido rápido"
      className={cn(
        "pointer-events-none fixed right-2.5 bottom-2.5 left-2.5 z-40 hidden translate-y-[calc(100%+24px)] grid-cols-3 gap-1.5 rounded-[8px] border border-[rgba(32,26,23,0.12)] bg-[rgba(255,250,242,0.95)] p-1.5 opacity-0 shadow-[0_18px_52px_rgba(32,26,23,0.18)] backdrop-blur-md transition duration-300 max-sm:grid",
        isVisible && "pointer-events-auto translate-y-0 opacity-100"
      )}
      data-mobile-order-bar
    >
      {orderChannels.map((channel) => (
        <ChannelAction
          ariaLabel={`Abrir ${channel.name}`}
          channel={channel}
          className={cn(
            "min-h-[54px] w-full px-1.5 py-2",
            channel.actionClassName
          )}
          iconOnly
          key={channel.key}
          label={channel.mobileLabel}
          logo={channel.mobileLogo}
        />
      ))}
    </div>
  );
}
