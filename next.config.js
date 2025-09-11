/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone build for Docker
  output: 'standalone',
  
  // Optional: Add tracing for better debugging
  experimental: {
    instrumentationHook: false,
  },
  
  // Ensure SQLite files are accessible
  serverExternalPackages: ['sqlite3'],
}

module.exports = nextConfig
