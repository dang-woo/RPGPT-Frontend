/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
}

module.exports = nextConfig;