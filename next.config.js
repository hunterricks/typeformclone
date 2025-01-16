/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'typeformclone-3v0q57x2d-whateverapp.vercel.app',
        'typeformclone-git-main-whateverapp.vercel.app'
      ],
    },
  },
  // Enable gzip compression for better performance
  compress: true,
  // Increase build performance
  poweredByHeader: false,
  // Generate static pages when possible
  output: 'standalone',
}
