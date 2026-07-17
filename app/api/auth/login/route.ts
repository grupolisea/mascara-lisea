import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const userAgent = request.headers.get("user-agent") || "";

const isAndroid = /Android/i.test(userAgent);

const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

if (!isAndroid && !isIOS) {
  return NextResponse.json(
    {
      error:
        "Esta aplicación únicamente puede utilizarse desde dispositivos Android o iPhone.",
    },
    {
      status: 403,
    }
  );
}
  try {
    const {
  username,
  password,
  deviceToken,
} = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // ============================
    // SUPERADMIN
    // ============================

    const superAdminEmail = process.env.SUPERADMIN_EMAIL;
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD;

    if (
      username === superAdminEmail &&
      password === superAdminPassword
    ) {
      const response = NextResponse.json({
        success: true,
        role: "SUPERADMIN",
      });

      response.cookies.set("auth_token", "superadmin", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // ============================
    // USUARIO
    // ============================

    const { data: credential, error } = await supabaseAdmin
      .from("credentials")
      .select("*")
      .eq("username", username)
      .single();

      console.log("========== LOGIN ==========");
console.log("Usuario recibido:", username);
console.log("Credencial encontrada:", credential);
console.log("Error Supabase:", error);


let currentCredential = credential;

// Si la credencial no existe, crearla automáticamente
if (!currentCredential) {

  const passwordHash = await hash(password, 10);

  const { data: newCredential, error: createError } =
    await supabaseAdmin
      .from("credentials")
      .insert({
        username,
        password_hash: passwordHash,
        active: true,
        max_devices: 3,
      })
      .select()
      .single();

  if (createError || !newCredential) {

    console.error(createError);

    return NextResponse.json(
      {
        error: "No fue posible crear la credencial."
      },
      {
        status: 500
      }
    );

  }

  currentCredential = newCredential;

  console.log("Nueva credencial creada:", currentCredential);

}

    if (!currentCredential.active) {
      return NextResponse.json(
        { error: "La credencial está desactivada" },
        { status: 403 }
      );
    }

    const validPassword = await compare(
      password,
      currentCredential.password_hash
    );

    console.log("Contraseña válida:", validPassword);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }
    // ============================
// VALIDAR DISPOSITIVO
// ============================

const { data: existingDevice } = await supabaseAdmin
  .from("devices")
  .select("*")
  .eq("credential_id", currentCredential.id)
  .eq("device_fingerprint", deviceToken)
  .single();

if (existingDevice) {

  await supabaseAdmin
    .from("devices")
    .update({
      last_login: new Date().toISOString()
    })
    .eq("id", existingDevice.id);

} else {

  const { count } = await supabaseAdmin
    .from("devices")
    .select("*", {
      count: "exact",
      head: true
    })
    .eq("credential_id", currentCredential.id)
    .eq("active", true);

  if ((count ?? 0) >= currentCredential.max_devices) {

    return NextResponse.json(
      {
        error:
          "Esta credencial ya alcanzó el máximo de dispositivos permitidos."
      },
      {
        status: 403
      }
    );

  }

  await supabaseAdmin
    .from("devices")
    .insert({

      credential_id: currentCredential.id,

      device_fingerprint: deviceToken,

      device_name: "Equipo",

      device_model: "Navegador",

      active: true

    });

}

    const response = NextResponse.json({
      success: true,
      role: "USER",
      credentialId: currentCredential.id,
    });

    response.cookies.set("auth_token", currentCredential.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}