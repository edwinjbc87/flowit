/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.API_URL,
    DIAGRAM_NODE_WIDTH: process.env.DIAGRAM_NODE_WIDTH,
    DIAGRAM_NODE_HEIGHT: process.env.DIAGRAM_NODE_HEIGHT,
    DIAGRAM_NODE_GAP_WIDTH: process.env.DIAGRAM_NODE_GAP_WIDTH,
    DIAGRAM_NODE_EDGE_HEIGHT: process.env.DIAGRAM_NODE_EDGE_HEIGHT,
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
  }
}

module.exports = nextConfig

