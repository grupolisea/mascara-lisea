import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("id");

    if (!deviceId) {
      return NextResponse.json({ error: "El ID del dispositivo es requerido." }, { status: 400 });
    }

    // Borrar físicamente el token vinculado de la base de datos
    await prisma.device.delete({
      where: { id: deviceId },
    });

    return NextResponse.json({ success: true, message: "Dispositivo revocado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar dispositivo:", error);
    return NextResponse.json({ error: "Error al procesar la desvinculación." }, { status: 500 });
  }
}