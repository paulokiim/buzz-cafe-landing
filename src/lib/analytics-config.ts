const truthyEnvValues = new Set(["1", "true", "yes", "on"]);

function cleanEnvValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function cleanBooleanEnvValue(value: string | undefined): boolean {
  const trimmed = value?.trim().toLowerCase();
  return Boolean(trimmed && truthyEnvValues.has(trimmed));
}

export const analyticsConfig = {
  googleTagManagerId: cleanEnvValue(
    process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
  ),
  gaMeasurementId: cleanEnvValue(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  googleAdsConversionId: cleanEnvValue(
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID
  ),
  googleAdsConversionLabel: cleanEnvValue(
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL
  ),
  metaPixelId: cleanEnvValue(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  enableVercelCustomEvents: cleanBooleanEnvValue(
    process.env.NEXT_PUBLIC_VERCEL_CUSTOM_EVENTS
  ),
} as const;

export const shouldLoadDirectGoogleTag =
  !analyticsConfig.googleTagManagerId &&
  Boolean(
    analyticsConfig.gaMeasurementId || analyticsConfig.googleAdsConversionId
  );

export const shouldLoadDirectMetaPixel =
  !analyticsConfig.googleTagManagerId && Boolean(analyticsConfig.metaPixelId);
