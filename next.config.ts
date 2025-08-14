import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this new 'images' property
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com", // The new one
        port: "",
        pathname: "/**",
      },
      // You can add more trusted hostnames here in the future
    ],
  },
};

export default nextConfig;
