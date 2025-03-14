/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
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
