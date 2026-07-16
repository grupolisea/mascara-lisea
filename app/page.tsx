"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Verificar si existe un token generado en este dispositivo
    const token = localStorage.getItem("lisea_device_token");

    // Si no hay token, redirigir inmediatamente al login
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Si hay token, damos acceso
    setIsAuthenticated(true);
  }, []);

  // Mientras verifica, mostramos una carga rápida
  if (isAuthenticated === null) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh", 
        backgroundColor: "#0f172a", 
        color: "#38bdf8", 
        fontFamily: "sans-serif" 
      }}>
        <h3>Verificando integridad del dispositivo...</h3>
      </div>
    );
  }

  // Despliegue del portal
  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      margin: 0, 
      padding: 0, 
      overflow: "hidden", 
      backgroundColor: "#0f172a" 
    }}>
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