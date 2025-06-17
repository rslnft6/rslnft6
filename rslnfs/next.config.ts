import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // لتفادي مشاكل المتصفح البسيط أثناء التطوير
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
export default nextConfig;
