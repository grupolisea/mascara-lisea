import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// En versiones modernas de Prisma, el cliente detecta automáticamente 
// DATABASE_URL desde las variables de entorno. 
// No fuerces 'datasources' si TypeScript te da error.
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error'],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}