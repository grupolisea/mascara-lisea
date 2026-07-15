import { NextResponse } from "next/server";
// Cambia esto en TODOS los archivos:
import { prisma } from "@/prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0; 

// GET: Listar todos los usuarios con sus dispositivos vinculados
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        devices: true, 
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      { error: "Error interno al recuperar la lista de usuarios." }, 
      { status: 500 }
    );
  }
}

// POST: (Opcional) Crear un nuevo usuario administrador o cliente
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        password, // En un entorno real, recuerda usar bcrypt para hashear esto
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear usuario." }, { status: 500 });
  }
}