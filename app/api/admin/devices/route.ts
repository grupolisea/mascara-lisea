import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {

    const { id } = await request.json();

    if (!id) {

      return NextResponse.json(
        {
          error: "Id del dispositivo requerido."
        },
        {
          status: 400
        }
      );

    }

    const { error } = await supabaseAdmin
      .from("devices")
      .update({
        active: false
      })
      .eq("id", id);

    if (error) {

      return NextResponse.json(
        {
          error: error.message
        },
        {
          status: 500
        }
      );

    }

    return NextResponse.json({
      success: true
    });

  } catch {

    return NextResponse.json(
      {
        error: "Error interno."
      },
      {
        status: 500
      }
    );

  }
}