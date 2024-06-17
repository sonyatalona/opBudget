/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  experimental: {
    serverComponentsExternalPackages: ['oslo'],
  },
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    DB_URL: process.env.DB_URL,
  },
};

module.exports = nextConfig;
