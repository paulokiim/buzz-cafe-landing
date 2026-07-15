function cleanEnvValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
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
} as const;

export const shouldLoadDirectGoogleTag =
  !analyticsConfig.googleTagManagerId &&
  Boolean(
    analyticsConfig.gaMeasurementId || analyticsConfig.googleAdsConversionId
  );

export const shouldLoadDirectMetaPixel =
  !analyticsConfig.googleTagManagerId && Boolean(analyticsConfig.metaPixelId);
