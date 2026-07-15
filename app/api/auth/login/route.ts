import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Evita cualquier tipo de caché

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Intento de login recibido para:", body.username);
    const { username, password, deviceToken } = body;

    if (!username || !password || !deviceToken) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    // Lógica de dispositivos...
    const existingDevice = await prisma.device.findUnique({ where: { token: deviceToken } });
    
    if (existingDevice && existingDevice.userId !== user.id) {
        return NextResponse.json({ error: "Token en uso por otro usuario" }, { status: 403 });
    }

    if (!existingDevice) {
        const count = await prisma.device.count({ where: { userId: user.id } });
        if (count >= 3) return NextResponse.json({ error: "Límite de 3 dispositivos" }, { status: 403 });
        
        await prisma.device.create({ data: { token: deviceToken, userId: user.id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}