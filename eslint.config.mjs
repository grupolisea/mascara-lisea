/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/hub/:path*",
        destination: "https://qr-access-hub-1.emergent.host/:path*",
      },
    ];
  },
};

export default nextConfig;