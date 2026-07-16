"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = localStorage.getItem("ml_session");

      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#050505",
        color: "#fff",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          letterSpacing: "4px",
          color: "#D4AF37",
        }}
      >
        MÁSCARA LISEA
      </h1>

      <p style={{ marginTop: 20 }}>
        Inicializando...
      </p>
    </main>
  );
}