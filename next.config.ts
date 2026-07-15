import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Puedes dejar las opciones de configuración aquí si las necesitas en el futuro */
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;