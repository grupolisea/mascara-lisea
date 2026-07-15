import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Forzamos la creación del cliente sin que intente autodetectar adaptadores extraños
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error'],
  // Definimos explícitamente el motor binario para evitar el error del constructor
  adapter: undefined, 
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}