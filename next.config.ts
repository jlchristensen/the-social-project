import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The Campfire moved from /community to the homepage.
      { source: "/community", destination: "/", permanent: true },
      // Blog was removed in the campfire-first redesign.
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:slug", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
