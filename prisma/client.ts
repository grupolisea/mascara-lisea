import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Si ya existe una instancia, la usamos; si no, creamos una nueva.
// En entornos Serverless, Prisma gestiona internamente la conexión.
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}