"use client";

import { buttonVariants } from "@/components/ui/button";
import type { ChannelConfig, ImageAsset } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

import { useOrderTracking } from "./order-tracking-provider";

type ChannelActionProps = {
  ariaLabel?: string;
  channel: ChannelConfig;
  className?: string;
  iconOnly?: boolean;
  label?: string;
  logo?: ImageAsset;
};

export function ChannelAction({
  ariaLabel,
  channel,
  className,
  iconOnly = false,
  label = channel.actionLabel,
  logo = channel.buttonLogo,
}: ChannelActionProps) {
  const { trackChannelClick } = useOrderTracking();
  const href = channel.href.trim();

  const handleClick = () => {
    trackChannelClick({
      channel: channel.key,
      channelLabel: channel.name,
      eventName: channel.eventName,
      href,
    });
  };

  const content = (
    <>
      <span
        aria-hidden={logo.alt ? undefined : true}
        className={cn(
          "relative block shrink-0 overflow-hidden",
          channel.key === "keeta" && "rounded-[6px]"
        )}
        style={{ height: logo.height, width: logo.width }}
      >
        <img
          alt={logo.alt}
          className="absolute inset-0 h-full w-full object-contain"
          src={logo.src}
        />
      </span>
      <span className={cn(iconOnly && "sr-only")}>{label}</span>
    </>
  );

  const actionClassName = cn(
    buttonVariants({ variant: "default", size: "lg" }),
    "buzz-action h-auto min-h-12 rounded-[8px] px-4 py-3 font-black leading-tight tracking-[0] focus-visible:ring-3",
    className
  );

  if (href) {
    return (
      <a
        aria-label={ariaLabel}
        className={actionClassName}
        data-channel={channel.key}
        data-event={channel.eventName}
        href={href}
        onClick={handleClick}
        rel="noopener noreferrer"
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      aria-label={ariaLabel}
      className={actionClassName}
      data-channel={channel.key}
      data-event={channel.eventName}
      onClick={handleClick}
      type="button"
    >
      {content}
    </button>
  );
}
