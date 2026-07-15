import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Usamos la configuración estándar. 
// Prisma lee automáticamente process.env.DATABASE_URL
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error'], 
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}