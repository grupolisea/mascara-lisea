"use client";

import { useEffect, useState } from "react";

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  async function installApp() {
    if (!deferredPrompt) {
      alert(
        "La instalación aún no está disponible. Espera unos segundos y vuelve a intentarlo."
      );
      return;
    }

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
  }

  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      }}
    >
      <div
        style={{
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#D4AF37",
            marginBottom: 25,
          }}
        >
          Máscara LISEA
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            marginBottom: 35,
          }}
        >
          Es importante instalar esta aplicación para poder utilizarla correctamente.
        </p>

        <button
          onClick={installApp}
          style={{
            width: "100%",
            padding: 18,
            borderRadius: 10,
            border: "none",
            background: "#D4AF37",
            color: "#000",
            fontWeight: "bold",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          📲 Instalar aplicación
        </button>
      </div>
    </div>
  );
}