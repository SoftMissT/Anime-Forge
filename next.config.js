/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.imgur.com', 'cdn.discordapp.com'],
  },
  webpack: (config) => {
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json'];
    return config;
  },
};

module.exports = nextConfig;
