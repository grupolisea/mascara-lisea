"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = localStorage.getItem("ml_session");

      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        background: "#050505",
        color: "#fff",
      }}
    >
      <h1
        style={{
          color: "#D4AF37",
          fontSize: "2.5rem",
          letterSpacing: "6px",
        }}
      >
        MÁSCARA LISEA
      </h1>

    <p style={{ marginTop: 20, color: "red", fontSize: 40 }}>
  VERSION NUEVA
</p>
    </main>
  );
}
