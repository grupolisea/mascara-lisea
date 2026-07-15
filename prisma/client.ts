import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Constructor mínimo para evitar validaciones de adaptadores innecesarias
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error'],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}