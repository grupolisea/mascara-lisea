import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Si el usuario entra a la raíz "/" o a "/hub"
  if (url.pathname === "/" || url.pathname.startsWith("/hub")) {
    // El servidor reescribe la petición hacia la URL primordial de forma invisible
    return NextResponse.rewrite(new URL("https://qr-access-hub-1.emergent.host"));
  }

  return NextResponse.next();
}

// Opcional: Solo intercepta estas rutas para optimizar rendimiento
export const config = {
  matcher: ["/", "/hub/:path*"],
};