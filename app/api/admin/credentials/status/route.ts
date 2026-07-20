import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: Request) {
  try {

    const { id, active } = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          error: "ID requerido."
        },
        {
          status: 400
        }
      );
    }

    const { error } = await supabaseAdmin
      .from("credentials")
      .update({
        active
      })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        error: "No fue posible actualizar el estado."
      },
      {
        status: 500
      }
    );

  }
}