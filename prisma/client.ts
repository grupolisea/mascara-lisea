import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Usamos un Singleton para evitar múltiples conexiones en serverless
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Definimos el pool de conexión para que Prisma lo utilice como adaptador
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}