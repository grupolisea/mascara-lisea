"use client";

import { useState, useEffect } from "react";

interface Device {
  id: string;
  token: string;
  createdAt: string;
}

interface UserWithDevices {
  id: string;
  username: string;
  role: string;
  devices: Device[];
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserWithDevices[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Cargar usuarios y sus dispositivos vinculados desde la API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (res.ok) setUsers(data);
      } catch (err) {
        console.error("Error al cargar credenciales:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 2. Filtrado dinámico por coincidencia en la barra de búsqueda
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Acción letal y segura para borrar un dispositivo ligado
  const handleDeleteDevice = async (deviceId: string) => {
    const confirmDelete = confirm("⚠️ ¿Estás seguro de desvincular este dispositivo? Perderá el acceso de inmediato.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/devices?id=${deviceId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Actualizar la interfaz removiendo el dispositivo sin recargar la página
        setUsers((prevUsers) =>
          prevUsers.map((user) => ({
            ...user,
            devices: user.devices.filter((d) => d.id !== deviceId),
          }))
        );
        alert("Dispositivo desvinculado con éxito.");
      } else {
        alert("Error al intentar remover el dispositivo.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#0f172a", color: "#38bdf8" }}>
        <h2>Cargando Panel de Control de Grupo Lisea...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#0f172a", minHeight: "100vh", fontFamily: "sans-serif", color: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "20px" }}>
        <h1 style={{ color: "#38bdf8", margin: 0 }}>Panel de Control Superadministrador</h1>
        <span style={{ backgroundColor: "#1e293b", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", color: "#94a3b8" }}>Grupo Lisea Real</span>
      </div>

      {/* Barra de búsqueda integrada */}
      <div style={{ marginTop: "30px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Buscar credencial única de usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "1px solid #334155",
            backgroundColor: "#1e293b",
            color: "#f8fafc",
            fontSize: "16px",
            outline: "none"
          }}
        />
      </div>

      {/* Tabla de Gestión Remota */}
      <div style={{ overflowX: "auto", backgroundColor: "#1e293b", borderRadius: "12px", padding: "10px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "#94a3b8", borderBottom: "1px solid #334155", textAlign: "left" }}>
              <th style={{ padding: "16px" }}>Usuario / Credencial</th>
              <th style={{ padding: "16px" }}>Slots Activos (Máx 3)</th>
              <th style={{ padding: "16px" }}>Gestión de Acceso</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "16px", fontWeight: "bold", color: "#38bdf8" }}>
                  👤 {user.username} 
                  <span style={{ marginLeft: "8px", fontSize: "11px", color: "#64748b", fontWeight: "normal" }}>({user.role})</span>
                </td>
                <td style={{ padding: "16px" }}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    backgroundColor: user.devices.length >= 3 ? "#7f1d1d" : "#064e3b",
                    color: user.devices.length >= 3 ? "#f87171" : "#4ade80"
                  }}>
                    {user.devices.length} / 3 Dispositivos
                  </span>
                </td>
                <td style={{ padding: "16px" }}>
                  {user.devices.length === 0 ? (
                    <span style={{ color: "#64748b", fontSize: "14px" }}>No hay dispositivos vinculados a este token</span>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {user.devices.map((device, idx) => (
                        <div key={device.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0f172a", padding: "8px 12px", borderRadius: "6px" }}>
                          <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                            📱 Disp. {idx + 1} <code style={{ color: "#e2e8f0" }}>({device.token.substring(0, 8)}...)</code>
                          </span>
                          <button
                            onClick={() => handleDeleteDevice(device.id)}
                            style={{
                              backgroundColor: "#ef4444",
                              color: "#fff",
                              border: "none",
                              padding: "4px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "bold"
                            }}
                          >
                            Revocar Acceso
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}