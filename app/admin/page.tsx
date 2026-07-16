"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    loadCredentials();
  }, []);

  async function loadCredentials() {
    const res = await fetch("/api/admin/credentials");

    const data = await res.json();

    setCredentials(data);

    setLoading(false);
  }

  if (loading) {
    return <h2 style={{ padding: 30 }}>Cargando...</h2>;
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Panel Superadministrador</h1>

      {credentials.map((credential) => (
        <div
          key={credential.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 20,
            marginBottom: 25,
          }}
        >
          <h2>{credential.username}</h2>

          <p>
            Dispositivos:
            {" "}
            {credential.devices.length}
            {" / "}
            {credential.max_devices}
          </p>

          {credential.devices.map((device) => (
            <div
              key={device.id}
              style={{
                padding: 10,
                marginBottom: 10,
                background: "#f6f6f6",
                borderRadius: 6,
              }}
            >
              <strong>{device.device_name}</strong>

              <br />

              {device.device_model}

              <br />

              Último acceso:

              {" "}

              {device.last_login
                ? new Date(device.last_login).toLocaleString()
                : "Nunca"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}