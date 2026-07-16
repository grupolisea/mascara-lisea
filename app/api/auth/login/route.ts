import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Superadministrador
    if (
      username === "admin@grupoolisea.com" &&
      password === "Olisea$Master2024!"
    ) {
      const response = NextResponse.json({
        success: true,
        role: "SUPERADMIN",
      });

      response.cookies.set("auth_token", "active", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json(
      {
        error:
          "La autenticación de usuarios está siendo migrada a Supabase.",
      },
      {
        status: 401,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      {
        status: 500,
      }
    );
  }
}