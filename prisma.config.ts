import { defineConfig } from '@prisma/config';

try {
  process.loadEnvFile();
} catch (e) {}

export default defineConfig({
  migrations: {
    seed: 'node ./prisma/seed.js',
  },
  datasource: {
    // Prisma 7 extrae el enlace directo automáticamente del entorno o usa la URL principal adaptada
    url: process.env.DATABASE_URL,
  },
});