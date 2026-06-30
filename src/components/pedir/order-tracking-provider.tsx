"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ChannelKey,
  TrackingEventName,
} from "@/lib/landing-data";
import { recordTrackingEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

type TrackChannelInput = {
  channel: ChannelKey;
  channelLabel: string;
  coupon: string;
  eventName: TrackingEventName;
  href: string;
};

type OrderTrackingContextValue = {
  trackChannelClick: (input: TrackChannelInput) => void;
};

const OrderTrackingContext = createContext<OrderTrackingContextValue | null>(
  null
);

export function OrderTrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToastMessage(message);
    setIsToastVisible(true);
    toastTimerRef.current = window.setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);
  }, []);

  const trackChannelClick = useCallback(
    ({ channel, channelLabel, coupon, eventName, href }: TrackChannelInput) => {
      recordTrackingEvent(eventName, {
        channel,
        coupon,
        destinationConfigured: Boolean(href),
        source: "next",
      });

      if (!href) {
        showToast(
          `Clique em ${channelLabel} registrado. Configure o link real nas variáveis NEXT_PUBLIC antes de publicar.`
        );
      }
    },
    [showToast]
  );

  useEffect(() => {
    recordTrackingEvent("PageView", { source: "next" });

    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  return (
    <OrderTrackingContext.Provider value={{ trackChannelClick }}>
      {children}
      <div
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed left-1/2 bottom-[84px] z-50 w-[min(420px,calc(100%_-_28px))] -translate-x-1/2 translate-y-6 rounded-[8px] bg-[var(--buzz-ink)] px-3.5 py-3 text-sm font-semibold text-white opacity-0 shadow-[var(--buzz-shadow)] transition duration-200 sm:bottom-5",
          isToastVisible && "translate-y-0 opacity-100"
        )}
        role="status"
        data-testid="prototype-toast"
      >
        {toastMessage}
      </div>
    </OrderTrackingContext.Provider>
  );
}

export function useOrderTracking() {
  const context = useContext(OrderTrackingContext);

  if (!context) {
    throw new Error(
      "useOrderTracking must be used inside OrderTrackingProvider"
    );
  }

  return context;
}
