"use client";

import { Cormorant_Garamond } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import Toast from "./components/Toast";
import "./admin.css";

const premiumFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Device {
  id: string;
  device_name: string;
  device_model: string;
  created_at: string;
  last_login: string;
  active: boolean;
}

interface Credential {
  id: string;
  username: string;
  active: boolean;
  created_at: string;
  max_devices: number;
  devices: Device[];
}

export default function AdminPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
  message: string;
  color: string;
} | null>(null);

  const [welcome, setWelcome] = useState(true);
  const [shine, setShine] = useState(false);

 useEffect(() => {

  loadCredentials();

  const timer1 = setTimeout(() => {
    setWelcome(false);
  }, 400);

  const timer2 = setTimeout(() => {
    setShine(true);
  }, 900);

  const timer3 = setTimeout(() => {
    setShine(false);
  }, 1800);

  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
    clearTimeout(timer3);
  };

}, []);;

function showToast(
  message: string,
  color: string
) {

  setToast({
    message,
    color,
  });

  setTimeout(() => {
    setToast(null);
  }, 2000);

}

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

async function deleteCredential(id: string) {

  const ok = confirm(
    "¿Eliminar esta credencial?\n\nTambién se eliminarán todos los dispositivos vinculados."
  );

  if (!ok) return;

  const res = await fetch(
    "/api/admin/credentials/delete",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    }
  );

  if (!res.ok) {

    alert("No fue posible eliminar la credencial.");

    return;

  }

  await loadCredentials();

}

async function changeStatus(
  id: string,
  active: boolean
) {

  const res = await fetch(
    "/api/admin/credentials/status",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        active,
      }),
    }
  );

  if (!res.ok) {

    alert("No fue posible cambiar el estado.");

    return;

  }

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
    background: "linear-gradient(135deg,#0d0d0d,#181818)",
    border: "1px solid rgba(212,175,55,.35)",
    borderRadius: 20,
    padding: 28,
    marginBottom: 35,
    textAlign: "center",
    boxShadow:
      "0 0 30px rgba(212,175,55,.10)",
    animation: "fadeWelcome .8s ease",
  }}
>

  <div
  style={{
    background: "linear-gradient(135deg,#0d0d0d,#181818)",
    border: "1px solid rgba(212,175,55,.35)",
    borderRadius: 20,
    padding: 28,
    marginBottom: 35,
    textAlign: "center",
    boxShadow: "0 0 30px rgba(212,175,55,.10)",
    animation: "fadeWelcome .8s ease",

    opacity: welcome ? 0 : 1,

    transform: welcome
      ? "translateY(25px)"
      : "translateY(0)",

    transition:
      "all .8s cubic-bezier(.2,.8,.2,1)",
  }}
></div>

  <div
  className={`${premiumFont.className} ${
    shine ? "golden-name" : ""
  }`}
  style={{
    fontSize: 46,
    color: "#D4AF37",
    fontWeight: 600,
    letterSpacing: 2,
    textShadow:
      "0 0 18px rgba(212,175,55,.35)",
  }}
>
  Ricardo Segura
</div>

  <div
    style={{
      color: "#999",
      marginTop: 10,
      fontSize: 15,
      letterSpacing: 2,
    }}
  >
    SUPERADMINISTRADOR
  </div>

</div>

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
      color: "#999",
      marginTop: 8,
      fontSize: 14,
    }}
  >
    📅 Creada:
    {" "}
    {credential.created_at
      ? new Date(
          credential.created_at
        ).toLocaleString()
      : "Sin registro"}
  </div>

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
      ? "🟢 Activa"
      : "🔴 Desactivada"}
  </div>
</div>

<div
  style={{
    marginTop: 18,
    display: "flex",
    alignItems: "center",
    gap: 12,
  }}
>
  <span
    style={{
      fontWeight: "bold",
      color: credential.active ? "#22c55e" : "#ef4444",
      minWidth: 95,
    }}
  >
    {credential.active ? "Activo" : "Suspendido"}
  </span>

  <label
    style={{
      position: "relative",
      width: 56,
      height: 30,
      display: "inline-block",
      cursor: "pointer",
    }}
  >
    <input
      type="checkbox"
      checked={credential.active}
      onChange={(e) =>
        changeStatus(
          credential.id,
          e.target.checked
        )
      }
      style={{
        opacity: 0,
        width: 0,
        height: 0,
      }}
    />

    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 30,
        background: credential.active
          ? "#34C759"
          : "#555",
        transition: "all .30s",
        boxShadow: credential.active
          ? "0 0 12px rgba(52,199,89,.45)"
          : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: credential.active ? 29 : 3,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#fff",
          transition: "all .30s",
          boxShadow: "0 2px 6px rgba(0,0,0,.35)",
        }}
      />
    </div>
  </label>
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

      <button
  onClick={() => deleteCredential(credential.id)}
  style={{
    marginTop: 18,
    background: "#b91c1c",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  🗑 Eliminar usuario
</button>



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
  📅 Registrado:
  {" "}
  {device.created_at
    ? new Date(
        device.created_at
      ).toLocaleString()
    : "Sin registro"}
</div>

          <div
  style={{
    color: "#999",
    marginTop: 6,
  }}
>
  🕒 Último acceso:
  {" "}
  {device.last_login
    ? new Date(
        device.last_login
      ).toLocaleString()
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