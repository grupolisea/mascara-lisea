import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Traer todos los usuarios con sus dispositivos asociados
    const users = await prisma.user.findMany({
      include: {
        devices: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios para admin:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}