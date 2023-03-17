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
  async rewrites() {
    return [
      {
        source: "/pdanetwork/:path*",
        destination: "https://dev.artux.net/pdanetwork/:path*",
      },
    ];
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
