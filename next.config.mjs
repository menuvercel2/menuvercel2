/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    env: {
      POSTGRES_URL: process.env.POSTGRES_URL,
    },
  }
  
  module.exports = nextConfig