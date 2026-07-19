import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          error: "ID no recibido."
        },
        {
          status: 400
        }
      );
    }

    const { error } = await supabaseAdmin
      .from("devices")
      .delete()
      .eq("id", id);

    if (error) {

      console.error(error);

      return NextResponse.json(
        {
          error: "No fue posible eliminar."
        },
        {
          status: 500
        }
      );

    }

    return NextResponse.json({
      success: true
    });

  } catch (err) {

    console.error(err);

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