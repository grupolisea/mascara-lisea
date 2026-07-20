import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID requerido." },
        { status: 400 }
      );
    }

    // Eliminar todos los dispositivos asociados
    const { error: devicesError } = await supabaseAdmin
      .from("devices")
      .delete()
      .eq("credential_id", id);

    if (devicesError) throw devicesError;

    // Eliminar la credencial
    const { error: credentialError } = await supabaseAdmin
      .from("credentials")
      .delete()
      .eq("id", id);

    if (credentialError) throw credentialError;

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "No fue posible eliminar el usuario."
      },
      {
        status: 500
      }
    );
  }
}