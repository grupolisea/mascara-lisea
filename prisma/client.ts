import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Aseguramos que la instancia se cree una sola vez y sea resiliente
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error'],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}