/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lwi.nexon.com",
      },
      {
        protocol: "https",
        hostname: "bbscdn.df.nexon.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sisajournal-e.com",
      },
      {
        protocol: "https",
        hostname: "img.lostark.co.kr",
      },
      {
        protocol: "https",
        hostname: "cdn-lostark.game.onstove.com",
      },
      {
        protocol: "https",
        hostname: "img-api.neople.co.kr",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "cdn-store.leagueoflegends.co.kr",
      },
    ],
    domains: ['img-api.neople.co.kr', 'via.placeholder.com', 'i.imgur.com', 'bbscdn.df.nexon.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://43.201.55.91:8080/api/:path*', 
      },
    ];
  },
  webpack: (config) => {
    // ... existing code ...
  },
}

module.exports = nextConfig;