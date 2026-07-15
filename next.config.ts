/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Cuando el usuario entre a la raíz "/"
        source: "/",
        // El servidor cargará internamente la Liga Primordial
        destination: "https://qr-access-hub-1.emergent.host",
      },
      {
        // Esto asegura que cualquier subruta (como /login, /assets, etc.) también se enmascare
        source: "/:path*",
        destination: "https://qr-access-hub-1.emergent.host/:path*",
      },
    ];
  },
};

export default nextConfig;