/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.API_URL,
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
  }
}

module.exports = nextConfig

