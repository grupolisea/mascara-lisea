import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Si estamos en entorno de BUILD, no intentamos instanciar para evitar errores
// de validación de constructor.
export const prisma = (process.env.NODE_ENV === 'test' || process.env.SKIP_ENV_VALIDATION === 'true') 
  ? {} as any 
  : globalForPrisma.prisma || new PrismaClient({ log: ['error'] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}