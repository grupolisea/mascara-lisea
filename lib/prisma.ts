import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// En v7, si no usas adaptadores, simplemente inicializa el cliente.
// Prisma leerá automáticamente tu variable DATABASE_URL del sistema.
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}