"use client";

import { useReportWebVitals } from "next/web-vitals";

import { analyticsConfig } from "@/lib/analytics-config";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];
type WebVitalMetric = Parameters<ReportWebVitalsCallback>[0];

export type WebVitalPayload = {
  delta: number;
  event: "WebVital";
  id: string;
  name: WebVitalMetric["name"];
  navigationType: WebVitalMetric["navigationType"];
  pagePath: string;
  rating: WebVitalMetric["rating"];
  value: number;
};

const reportWebVital: ReportWebVitalsCallback = (metric) => {
  const metricValue = Math.round(
    metric.name === "CLS" ? metric.value * 1000 : metric.value
  );
  const payload: WebVitalPayload = {
    delta: metric.delta,
    event: "WebVital",
    id: metric.id,
    name: metric.name,
    navigationType: metric.navigationType,
    pagePath: `${window.location.pathname}${window.location.search}`,
    rating: metric.rating,
    value: metricValue,
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);

  if (!analyticsConfig.googleTagManagerId && window.gtag) {
    window.gtag("event", "web_vital", {
      event_category: "web_vitals",
      event_label: metric.id,
      metric_delta: metric.delta,
      metric_name: metric.name,
      metric_rating: metric.rating,
      navigation_type: metric.navigationType,
      non_interaction: true,
      page_path: payload.pagePath,
      value: metricValue,
    });
  }
};

export function WebVitalsReporter() {
  useReportWebVitals(reportWebVital);
  return null;
}
