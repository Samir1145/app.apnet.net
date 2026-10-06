/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/dashboard/my-assets',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
