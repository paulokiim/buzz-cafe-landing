import { afterEach, describe, expect, it, vi } from "vitest";

describe("analytics config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("trims configured analytics ids", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID", " GTM-ABC123 ");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", " 123456789 ");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_CUSTOM_EVENTS", " true ");
    vi.resetModules();

    const { analyticsConfig } = await import("@/lib/analytics-config");

    expect(analyticsConfig).toMatchObject({
      enableVercelCustomEvents: true,
      googleTagManagerId: "GTM-ABC123",
      metaPixelId: "123456789",
    });
  });

  it("loads direct Google tag only when GTM is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID", "GTM-ABC123");
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-XYZ987");
    vi.resetModules();

    const withGtm = await import("@/lib/analytics-config");
    expect(withGtm.shouldLoadDirectGoogleTag).toBe(false);

    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-XYZ987");
    vi.resetModules();

    const withoutGtm = await import("@/lib/analytics-config");
    expect(withoutGtm.shouldLoadDirectGoogleTag).toBe(true);
  });

  it("loads direct Meta Pixel only when GTM is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID", "GTM-ABC123");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789");
    vi.resetModules();

    const withGtm = await import("@/lib/analytics-config");
    expect(withGtm.shouldLoadDirectMetaPixel).toBe(false);

    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789");
    vi.resetModules();

    const withoutGtm = await import("@/lib/analytics-config");
    expect(withoutGtm.shouldLoadDirectMetaPixel).toBe(true);
  });
});
