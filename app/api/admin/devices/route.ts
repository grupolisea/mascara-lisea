import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client"; 

export const dynamic = "force-dynamic";
export const revalidate = 0; 

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      include: { user: true }, 
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(devices);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener dispositivos." }, { status: 500 });
  }
}

// DELETE: Revocar (eliminar) un dispositivo por su ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de dispositivo requerido." }, { status: 400 });
    }

    await prisma.device.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: "Dispositivo revocado." });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar dispositivo." }, { status: 500 });
  }
}