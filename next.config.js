/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL
  }
}

module.exports = nextConfig