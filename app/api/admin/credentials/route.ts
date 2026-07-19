import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {

    const { data, error } = await supabaseAdmin
  .from("credentials")
  .select(`
    id,
    username,
    active,
    created_at,
    max_devices,
    devices (
      id,
      device_name,
      device_model,
      device_fingerprint,
      created_at,
      last_login,
      active
    )
  `)
  .order("username");

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        error: "No fue posible obtener las credenciales."
      },
      {
        status: 500
      }
    );

  }
}