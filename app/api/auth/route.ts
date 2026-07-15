import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; 

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password, deviceToken } = await request.json();

    // 1. Validar campos obligatorios
    if (!username || !password || !deviceToken) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para el registro seguro." },
        { status: 400 }
      );
    }

    // 2. Buscar al usuario por su credencial única (username)
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    }

    // 3. Validar contraseña directa
    if (user.password !== password) {
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    }

    // 4. Verificar si este dispositivo ya fue registrado previamente para este usuario
    const existingDevice = await prisma.device.findUnique({
      where: { token: deviceToken },
    });

    if (existingDevice) {
      if (existingDevice.userId === user.id) {
        return NextResponse.json({ success: true, message: "Dispositivo reconocido. Acceso concedido." });
      } else {
        return NextResponse.json({ error: "Este token de dispositivo pertenece a otro usuario." }, { status: 403 });
      }
    }

    // 5. Validar que el usuario no tenga ya 3 dispositivos vinculados
    const deviceCount = await prisma.device.count({
      where: { userId: user.id },
    });

    if (deviceCount >= 3) {
      return NextResponse.json(
        { error: "Límite superado: Esta credencial ya cuenta con 3 dispositivos vinculados." },
        { status: 403 }
      );
    }

    // 6. Si tiene menos de 3 slots ocupados, registramos el nuevo token de este dispositivo
    await prisma.device.create({
      data: {
        token: deviceToken,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, message: "Nuevo dispositivo vinculado exitosamente." });

  } catch (error) {
    console.error("Error en API Login:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}