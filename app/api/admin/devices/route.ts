import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client"; // <-- Importación corregida

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("id");

    if (!deviceId) {
      return NextResponse.json({ error: "El ID del dispositivo es requerido." }, { status: 400 });
    }

    await prisma.device.delete({
      where: { id: deviceId },
    });

    return NextResponse.json({ success: true, message: "Dispositivo revocado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar dispositivo:", error);
    return NextResponse.json({ error: "Error al procesar la desvinculación." }, { status: 500 });
  }
}