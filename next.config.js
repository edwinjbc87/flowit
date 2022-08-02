/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.API_URL,
    DIAGRAM_NODE_WIDTH: 200,
    DIAGRAM_NODE_GAP_WIDTH: 15
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
  }
}

module.exports = nextConfig

