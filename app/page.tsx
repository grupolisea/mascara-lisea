"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Verificar si existe un token generado en este dispositivo
    const token = localStorage.getItem("lisea_device_token");

    if (!token) {
      // Si ni siquiera hay token local, va directo al login
      window.location.href = "/login";
      return;
    }

    // 2. Opcional: Validar de forma rápida contra el backend si el token sigue activo
    // Para no retrasar tu prueba inmediata, asumimos que si el token existe localmente tras el login exitoso, le damos paso:
    setIsAuthenticated(true);
  }, []);

  // Mientras evalúa el token, mostramos una pantalla limpia de carga
  if (isAuthenticated === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#0f172a", color: "#38bdf8", fontFamily: "sans-serif" }}>
        <h3>Verificando integridad del dispositivo...</h3>
      </div>
    );
  }

  // Si está validado, se despliega el visor inmune en pantalla completa ocultando la URL primordial
  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden", backgroundColor: "#0f172a" }}>
      <iframe
        src="https://qr-access-hub-1.emergent.host"
        title="Portal Seguro Grupo Lisea"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
        }}
        allow="clipboard-write"
      />
    </div>
  );
}