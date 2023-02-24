/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.artux.net",
        port: "",
        pathname: "/static/**",
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
