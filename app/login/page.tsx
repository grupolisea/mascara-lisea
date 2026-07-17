"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [deviceToken, setDeviceToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("lisea_device_token");

    if (!token) {
      token = window.crypto.randomUUID();
      localStorage.setItem("lisea_device_token", token);
    }

    setDeviceToken(token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          deviceToken,
          deviceInfo: {
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: `${window.screen.width}x${window.screen.height}`,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Error al validar las credenciales."
        );
      }

      alert("🔒 Dispositivo vinculado y validado. Accediendo...");

      window.location.href = "/mask";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: 16,
          padding: 40,
          boxShadow: "0 0 40px rgba(0,0,0,.45)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <Image
            src="/logo-lisea.png"
            alt="Grupo Lisea"
            width={180}
            height={180}
            priority
          />
        </div>

        {error && (
          <div
            style={{
              background: "#4b1113",
              color: "#ffb4b4",
              padding: 12,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <label
          style={{
            color: "#D4AF37",
            display: "block",
            marginBottom: 8,
          }}
        >
          Usuario
        </label>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 20,
            background: "#000",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 8,
          }}
        />

        <label
          style={{
            color: "#D4AF37",
            display: "block",
            marginBottom: 8,
          }}
        >
          Contraseña
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 30,
            background: "#000",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 8,
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            background: "#D4AF37",
            color: "#000",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          {loading
            ? "Comprobando dispositivos..."
            : "Vincular e Ingresar"}
        </button>
      </form>
    </div>
  );
}