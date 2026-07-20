interface ToastProps {
  message: string;
  color: string;
}

export default function Toast({
  message,
  color,
}: ToastProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 25,
        right: 25,
        background: "#111",
        borderLeft: `5px solid ${color}`,
        color: "#fff",
        padding: "14px 18px",
        borderRadius: 12,
        boxShadow: "0 10px 25px rgba(0,0,0,.35)",
        zIndex: 9999,
        minWidth: 260,
        fontWeight: "bold",
        transition: "all .30s ease",
      }}
    >
      {message}
    </div>
  );
}