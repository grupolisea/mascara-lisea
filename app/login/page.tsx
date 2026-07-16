"use client";

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
        throw new Error(data.error || "Error al validar las credenciales.");
      }

      alert("🔒 Dispositivo vinculado y validado. Accediendo...");

      // Ahora entra a la máscara
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        fontFamily: "sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#1e293b",
          padding: "40px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h2
          style={{
            color: "#38bdf8",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Grupo Lisea
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#f87171",
              color: "#7f1d1d",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              color: "#94a3b8",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Usuario Único
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #334155",
              backgroundColor: "#0f172a",
              color: "#f8fafc",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              color: "#94a3b8",
              display: "block",
              marginBottom: "8px",
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
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #334155",
              backgroundColor: "#0f172a",
              color: "#f8fafc",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: "#38bdf8",
            color: "#0f172a",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
          }}
        >
          {loading
            ? "Comprobando slots de dispositivos (Máx 3)..."
            : "Vincular e Ingresar"}
        </button>
      </form>
    </div>
  );
}