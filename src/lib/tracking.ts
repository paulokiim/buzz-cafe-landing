import type {
  ChannelKey,
  TrackingEventName,
  TrackingSource,
} from "@/lib/landing-data";

export type TrackingDetails = {
  destinationConfigured?: boolean;
  source?: TrackingSource;
  channel?: ChannelKey;
  coupon?: string;
};

export type TrackingPayload = {
  event: TrackingEventName;
  page: "pedir-buzz-cafe";
  timestamp: string;
} & TrackingDetails;

export type RecordTrackingOptions = {
  maxHistory?: number;
  now?: Date;
  storageKey?: string;
  targetWindow?: TrackingWindow;
};

declare global {
  interface Window {
    dataLayer?: TrackingPayload[];
  }
}

const DEFAULT_STORAGE_KEY = "buzzCafeEvents";
const DEFAULT_MAX_HISTORY = 30;

type TrackingWindow = Window & typeof globalThis;

export function createTrackingPayload(
  eventName: TrackingEventName,
  details: TrackingDetails = {},
  now = new Date()
): TrackingPayload {
  return {
    event: eventName,
    page: "pedir-buzz-cafe",
    timestamp: now.toISOString(),
    ...details,
  };
}

export function recordTrackingEvent(
  eventName: TrackingEventName,
  details: TrackingDetails = {},
  options: RecordTrackingOptions = {}
): TrackingPayload {
  const eventPayload = createTrackingPayload(eventName, details, options.now);
  const targetWindow =
    options.targetWindow ?? (typeof window === "undefined" ? undefined : window);

  if (!targetWindow) {
    return eventPayload;
  }

  targetWindow.dataLayer = targetWindow.dataLayer ?? [];
  targetWindow.dataLayer.push(eventPayload);
  targetWindow.dispatchEvent(
    new targetWindow.CustomEvent("buzz:tracking", { detail: eventPayload })
  );

  persistTrackingEvent(targetWindow, eventPayload, {
    maxHistory: options.maxHistory ?? DEFAULT_MAX_HISTORY,
    storageKey: options.storageKey ?? DEFAULT_STORAGE_KEY,
  });

  targetWindow.console.info("[Buzz Cafe tracking]", eventPayload);

  return eventPayload;
}

function persistTrackingEvent(
  targetWindow: TrackingWindow,
  eventPayload: TrackingPayload,
  options: Required<Pick<RecordTrackingOptions, "maxHistory" | "storageKey">>
) {
  try {
    const rawHistory = targetWindow.localStorage.getItem(options.storageKey);
    const parsedHistory: unknown = rawHistory ? JSON.parse(rawHistory) : [];
    const history = Array.isArray(parsedHistory) ? parsedHistory : [];
    history.push(eventPayload);
    targetWindow.localStorage.setItem(
      options.storageKey,
      JSON.stringify(history.slice(-options.maxHistory))
    );
  } catch (error) {
    targetWindow.console.warn(
      "[Buzz Cafe tracking] localStorage indisponível",
      error
    );
  }
}
