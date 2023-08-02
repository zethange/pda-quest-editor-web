const { withAxiom } = require("next-axiom");
/** @type {import('next').NextConfig} */
const nextConfig = withAxiom({
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
  httpAgentOptions: {
    keepAlive: false,
  },
  async rewrites() {
    return [
      {
        source: "/pdanetwork/:path*",
        destination: "https://dev.artux.net/pdanetwork/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/pdanetwork/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, OPTIONS, PATCH",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ];
  },
  reactStrictMode: false,
});

module.exports = nextConfig;
