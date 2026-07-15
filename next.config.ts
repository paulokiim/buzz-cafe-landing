import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sites/vinext serves the immutable files from `public/` directly. Disabling
  // the Next image optimizer keeps local brand assets off the unsupported
  // `/_vinext/image` route in production.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
