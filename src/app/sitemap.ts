import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/site-config";

const LAST_MODIFIED = "2026-07-08";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_ORIGIN}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${SITE_ORIGIN}/pedir-assets/hero-desktop.webp`,
        `${SITE_ORIGIN}/pedir-assets/combos/manha_leve.png`,
        `${SITE_ORIGIN}/pedir-assets/combos/caramelo_jamon.png`,
        `${SITE_ORIGIN}/pedir-assets/combos/matcha_crunch_single.png`,
      ],
    },
  ];
}
