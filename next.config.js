/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
