"use client";

import { useEffect, useMemo, useState } from "react";

interface Device {
  id: string;
  device_name: string;
  device_model: string;
  last_login: string;
  active: boolean;
}

interface Credential {
  id: string;
  username: string;
  active: boolean;
  max_devices: number;
  devices: Device[];
}

export default function AdminPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

 useEffect(() => {
  loadCredentials();
}, []);

async function loadCredentials() {
  try {
    const res = await fetch("/api/admin/credentials");
    const data = await res.json();

    setCredentials(data);

  } finally {
    setLoading(false);
  }
}

async function deleteDevice(id: string) {

  const ok = confirm("¿Eliminar este dispositivo?");

  if (!ok) return;

  const res = await fetch("/api/admin/devices", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    alert("No fue posible eliminar.");
    return;
  }

  alert("✅ Dispositivo eliminado correctamente.");

  await loadCredentials();
}

  const filteredCredentials = useMemo(() => {
    return credentials.filter((c) =>
      c.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [credentials, search]);

  const totalCredentials = credentials.length;

  const activeCredentials = credentials.filter(
    (c) => c.active
  ).length;

  const inactiveCredentials =
    totalCredentials - activeCredentials;

  const totalDevices = credentials.reduce(
    (acc, c) => acc + c.devices.length,
    0
  );

  if (loading) {
    return (
      <div
        style={{
          background: "#000",
          color: "#D4AF37",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 22,
        }}
      >
        Cargando Panel...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "#fff",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#D4AF37",
            textAlign: "center",
            fontSize: 34,
            letterSpacing: 2,
            marginBottom: 40,
          }}
        >
          PANEL SUPERADMINISTRADOR
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
            marginBottom: 35,
          }}
        >
          <div
            style={{
              background: "#111",
              padding: 20,
              borderRadius: 12,
              border: "1px solid #222",
            }}
          >
            <div
              style={{
                color: "#888",
                fontSize: 13,
              }}
            >
              Credenciales
            </div>

            <div
              style={{
                color: "#D4AF37",
                fontSize: 34,
                fontWeight: "bold",
              }}
            >
              {totalCredentials}
            </div>
          </div>

          <div
            style={{
              background: "#111",
              padding: 20,
              borderRadius: 12,
              border: "1px solid #222",
            }}
          >
            <div
              style={{
                color: "#888",
                fontSize: 13,
              }}
            >
              Activas
            </div>

            <div
              style={{
                color: "#22c55e",
                fontSize: 34,
                fontWeight: "bold",
              }}
            >
              {activeCredentials}
            </div>
          </div>

          <div
            style={{
              background: "#111",
              padding: 20,
              borderRadius: 12,
              border: "1px solid #222",
            }}
          >
            <div
              style={{
                color: "#888",
                fontSize: 13,
              }}
            >
              Desactivadas
            </div>

            <div
              style={{
                color: "#ef4444",
                fontSize: 34,
                fontWeight: "bold",
              }}
            >
              {inactiveCredentials}
            </div>
          </div>

          <div
            style={{
              background: "#111",
              padding: 20,
              borderRadius: 12,
              border: "1px solid #222",
            }}
          >
            <div
              style={{
                color: "#888",
                fontSize: 13,
              }}
            >
              Dispositivos registrados
            </div>

            <div
              style={{
                color: "#38bdf8",
                fontSize: 34,
                fontWeight: "bold",
              }}
            >
              {totalDevices}
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            background: "#111",
            border: "1px solid #333",
            color: "white",
            borderRadius: 10,
            marginBottom: 35,
            fontSize: 16,
          }}
        />       {filteredCredentials.map((credential) => {
  const used = credential.devices.length;
  const free = credential.max_devices - used;

  return (
    <div
      key={credential.id}
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: 14,
        padding: 25,
        marginBottom: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 15,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              color: "#D4AF37",
              margin: 0,
            }}
          >
            {credential.username}
          </h2>

          <div
            style={{
              color: credential.active
                ? "#22c55e"
                : "#ef4444",
              marginTop: 8,
              fontWeight: "bold",
            }}
          >
            {credential.active
              ? "● Activa"
              : "● Desactivada"}
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: "#38bdf8",
              fontWeight: "bold",
            }}
          >
            {used} / {credential.max_devices}
          </div>

          <div
            style={{
              color:
                free === 0
                  ? "#ef4444"
                  : "#22c55e",
            }}
          >
            {free === 0
              ? "Límite alcanzado"
              : `${free} dispositivo(s) disponible(s)`}
          </div>
        </div>
      </div>

      {credential.devices.length === 0 && (
        <div
          style={{
            color: "#777",
            padding: "15px 0",
          }}
        >
          Esta credencial aún no tiene dispositivos registrados.
        </div>
      )}

      {credential.devices.map((device) => (
        <div
          key={device.id}
          style={{
            background: "#000",
            border: "1px solid #222",
            borderRadius: 10,
            padding: 18,
            marginBottom: 15,
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            📱 {device.device_name}
          </div>

          <div
            style={{
              color: "#999",
              marginTop: 6,
            }}
          >
            Modelo: {device.device_model}
          </div>

          <div
            style={{
              color: "#999",
              marginTop: 6,
            }}
          >
            Último acceso{" "}
            {device.last_login
              ? new Date(device.last_login).toLocaleString()
              : "Nunca"}
          </div>

                  <button
  onClick={() => deleteDevice(device.id)}
  style={{
    marginTop: 15,
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  🗑 Eliminar dispositivo
</button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}