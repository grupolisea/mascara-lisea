import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, deviceToken } = body;

    // 1. Validación estricta
    if (!username || !password || !deviceToken) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // 2. Transacción atómica para evitar estados inconsistentes
    const result = await prisma.$transaction(async (tx) => {
      // Buscar usuario
      const user = await tx.user.findUnique({ where: { username } });
      if (!user || user.password !== password) throw new Error("AUTH_FAILED");

      // Validar dispositivo
      const existingDevice = await tx.device.findUnique({ where: { token: deviceToken } });

      if (existingDevice) {
        if (existingDevice.userId !== user.id) throw new Error("TOKEN_IN_USE");
        return { success: true }; // Ya registrado
      }

      // Validar límite
      const count = await tx.device.count({ where: { userId: user.id } });
      if (count >= 3) throw new Error("LIMIT_REACHED");

      // Crear nuevo
      await tx.device.create({ data: { token: deviceToken, userId: user.id } });
      return { success: true };
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("DEBUG LOGIN ERROR:", error.message);

    // Mapeo preciso de errores para el frontend
    const errorMap: Record<string, { status: number, message: string }> = {
      AUTH_FAILED: { status: 401, message: "Credenciales incorrectas" },
      TOKEN_IN_USE: { status: 403, message: "Este dispositivo ya está vinculado a otra cuenta" },
      LIMIT_REACHED: { status: 403, message: "Has alcanzado el límite de 3 dispositivos" }
    };

    const err = errorMap[error.message] || { status: 500, message: "Error interno del servidor" };
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}