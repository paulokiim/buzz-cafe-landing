import type {
  ChannelKey,
  TrackingEventName,
  TrackingSource,
} from "@/lib/landing-data";
import { analyticsConfig } from "@/lib/analytics-config";
import type { WebVitalPayload } from "@/components/analytics/web-vitals-reporter";
import { track } from "@vercel/analytics";

export type TrackingDetails = {
  destinationConfigured?: boolean;
  source?: TrackingSource;
  channel?: ChannelKey | "whatsapp";
};

export type TrackingCampaignDetails = {
  pagePath?: string;
  pageUrl?: string;
  referrer?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmMedium?: string;
  utmRegion?: string;
  utmSource?: string;
  utmTerm?: string;
};

export type TrackingPayload = {
  event: TrackingEventName;
  page: "pedir-buzz-cafe";
  timestamp: string;
} & TrackingDetails &
  TrackingCampaignDetails;

export type RecordTrackingOptions = {
  maxHistory?: number;
  now?: Date;
  storageKey?: string;
  targetWindow?: TrackingWindow;
};

declare global {
  interface Window {
    dataLayer?: Array<TrackingPayload | WebVitalPayload | Record<string, unknown>>;
    fbq?: MetaPixelFunction;
    gtag?: GoogleTagFunction;
  }
}

const DEFAULT_STORAGE_KEY = "buzzCafeEvents";
const DEFAULT_MAX_HISTORY = 30;
const UTM_PARAM_MAP = {
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_medium: "utmMedium",
  utm_region: "utmRegion",
  utm_source: "utmSource",
  utm_term: "utmTerm",
} as const;

type TrackingWindow = Window & typeof globalThis;
type GoogleTagFunction = (
  command: "event",
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) => void;
type MetaPixelFunction = (
  command: "track" | "trackCustom",
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) => void;

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
  const targetWindow =
    options.targetWindow ?? (typeof window === "undefined" ? undefined : window);
  const eventPayload = {
    ...createTrackingPayload(eventName, details, options.now),
    ...(targetWindow ? getTrackingContext(targetWindow) : {}),
  };

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
  sendToGoogleAnalytics(targetWindow, eventPayload);
  sendToMetaPixel(targetWindow, eventPayload);
  sendToVercelCustomEvents(targetWindow, eventPayload);

  return eventPayload;
}

function getTrackingContext(
  targetWindow: TrackingWindow
): TrackingCampaignDetails {
  const currentUrl = new URL(targetWindow.location.href);
  const campaignDetails: TrackingCampaignDetails = {
    pagePath: `${currentUrl.pathname}${currentUrl.search}`,
    pageUrl: currentUrl.href,
  };
  const referrer = targetWindow.document.referrer;

  if (referrer) {
    campaignDetails.referrer = referrer;
  }

  for (const [paramName, payloadKey] of Object.entries(UTM_PARAM_MAP)) {
    const paramValue = currentUrl.searchParams.get(paramName)?.trim();

    if (paramValue) {
      campaignDetails[payloadKey] = paramValue;
    }
  }

  return campaignDetails;
}

function sendToGoogleAnalytics(
  targetWindow: TrackingWindow,
  eventPayload: TrackingPayload
) {
  if (
    analyticsConfig.googleTagManagerId ||
    !targetWindow.gtag ||
    eventPayload.event === "PageView"
  ) {
    return;
  }

  targetWindow.gtag("event", toGoogleAnalyticsEventName(eventPayload), {
    ...compactAnalyticsProperties({
      channel: eventPayload.channel,
      destination_configured: eventPayload.destinationConfigured,
      event_category: "landing_engagement",
      event_label: eventPayload.channel ?? eventPayload.event,
      page_name: eventPayload.page,
      page_path: eventPayload.pagePath,
      referrer: eventPayload.referrer,
      source: eventPayload.source,
      utm_campaign: eventPayload.utmCampaign,
      utm_content: eventPayload.utmContent,
      utm_medium: eventPayload.utmMedium,
      utm_region: eventPayload.utmRegion,
      utm_source: eventPayload.utmSource,
      utm_term: eventPayload.utmTerm,
    }),
  });
}

function sendToMetaPixel(
  targetWindow: TrackingWindow,
  eventPayload: TrackingPayload
) {
  if (
    analyticsConfig.googleTagManagerId ||
    !targetWindow.fbq ||
    eventPayload.event === "PageView"
  ) {
    return;
  }

  if (eventPayload.event === "Clique_WhatsApp") {
    targetWindow.fbq("track", "Contact", {
      channel: "whatsapp",
      page_name: eventPayload.page,
      source: eventPayload.source,
    });
    return;
  }

  targetWindow.fbq("trackCustom", "OrderChannelClick", {
    channel: eventPayload.channel,
    destination_configured: eventPayload.destinationConfigured,
    page_name: eventPayload.page,
    source: eventPayload.source,
  });
}

function sendToVercelCustomEvents(
  targetWindow: TrackingWindow,
  eventPayload: TrackingPayload
) {
  if (!analyticsConfig.enableVercelCustomEvents || eventPayload.event === "PageView") {
    return;
  }

  try {
    track(
      toVercelEventName(eventPayload),
      compactTrackingProperties(eventPayload)
    );
  } catch (error) {
    targetWindow.console.warn("[Buzz Cafe tracking] Vercel custom event falhou", error);
  }
}

function compactTrackingProperties(eventPayload: TrackingPayload) {
  return compactAnalyticsProperties({
    channel: eventPayload.channel,
    destinationConfigured: eventPayload.destinationConfigured,
    page: eventPayload.page,
    source: eventPayload.source,
    utmCampaign: eventPayload.utmCampaign,
    utmMedium: eventPayload.utmMedium,
    utmRegion: eventPayload.utmRegion,
    utmSource: eventPayload.utmSource,
  });
}

function compactAnalyticsProperties<
  T extends Record<string, string | number | boolean | undefined>,
>(properties: T) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean>;
}

function toGoogleAnalyticsEventName(eventPayload: TrackingPayload) {
  if (eventPayload.event === "Clique_WhatsApp") {
    return "whatsapp_click";
  }

  return "order_channel_click";
}

function toVercelEventName(eventPayload: TrackingPayload) {
  if (eventPayload.event === "Clique_WhatsApp") {
    return "whatsapp_click";
  }

  return "order_channel_click";
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
