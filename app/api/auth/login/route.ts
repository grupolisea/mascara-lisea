import { NextResponse } from "next/server";
// PON ESTA LÍNEA EXACTA
import { prisma } from "@/lib/prisma";
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Bypass Superadmin
    if (username === "admin@grupoolisea.com" && password === "Olisea$Master2024!") {
      const response = NextResponse.json({ success: true, role: "SUPERADMIN" });
      response.cookies.set("auth_token", "active", { httpOnly: true, path: "/", maxAge: 604800 });
      return response;
    }

    // Validación DB
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    return NextResponse.json({ error: "Error de conexión a BD" }, { status: 500 });
  }
}