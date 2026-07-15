import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Forzamos el uso de la conexión estándar sin intentar usar el nuevo "adapter" o "accelerate"
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error'],
  // Esta línea es la que soluciona el error de "engine type"
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}