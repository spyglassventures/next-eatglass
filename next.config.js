/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "openweathermap.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
