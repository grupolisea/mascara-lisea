import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    success: true,
    users: [],
    message: "Módulo de usuarios en migración a Supabase."
  });
}

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Datos incompletos." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Creación de usuarios disponible en la siguiente fase."
  });
}