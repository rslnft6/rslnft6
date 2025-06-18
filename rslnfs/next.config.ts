import type { NextConfig } from "next";

const repoName = "rslnft6.github.io";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/",
  assetPrefix: "/",
};

module.exports = nextConfig;
export default nextConfig;
