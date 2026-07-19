"use client";

import { useEffect, useState } from "react";

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent);

    setIsIOS(ios);

    // Si ya está instalada, entrar directamente
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (standalone) {
      window.location.href = "/login";
      return;
    }

    // Registrar Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(console.error);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
    };
  }, []);

  async function installAndroid() {
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
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
      }}
    >
      <div
        style={{
          maxWidth: 450,
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
            lineHeight: 1.8,
            marginBottom: 35,
          }}
        >
          Para utilizar esta aplicación es obligatorio instalarla en tu dispositivo.
        </p>

        {isIOS ? (
          <>
            <div
              style={{
                background: "#111",
                padding: 20,
                borderRadius: 12,
                marginBottom: 25,
                textAlign: "left",
              }}
            >
              <b>iPhone / iPad</b>

              <br />
              <br />

              1️⃣ Pulsa el botón Compartir de Safari.

              <br />
              <br />

              2️⃣ Selecciona
              <b> Agregar a pantalla de inicio.</b>

              <br />
              <br />

              3️⃣ Abre la aplicación instalada.
            </div>
          </>
        ) : (
          <button
            onClick={installAndroid}
            style={{
              width: "100%",
              padding: 18,
              border: "none",
              borderRadius: 12,
              background: "#D4AF37",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            📲 Instalar aplicación
          </button>
        )}
      </div>
    </div>
  );
}