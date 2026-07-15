import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client"; // <-- Importación corregida

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { username, password, deviceToken } = await request.json();

    if (!username || !password || !deviceToken) {
      return NextResponse.json({ error: "Faltan datos obligatorios." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    }

    const existingDevice = await prisma.device.findUnique({
      where: { token: deviceToken },
    });

    if (existingDevice) {
      if (existingDevice.userId === user.id) {
        return NextResponse.json({ success: true, message: "Dispositivo reconocido." });
      } else {
        return NextResponse.json({ error: "Token asignado a otro usuario." }, { status: 403 });
      }
    }

    const deviceCount = await prisma.device.count({
      where: { userId: user.id },
    });

    if (deviceCount >= 3) {
      return NextResponse.json({ error: "Límite superado (Máx 3 dispositivos)." }, { status: 403 });
    }

    await prisma.device.create({
      data: { token: deviceToken, userId: user.id },
    });

    return NextResponse.json({ success: true, message: "Dispositivo vinculado." });

  } catch (error) {
    console.error("Error en API Login:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}