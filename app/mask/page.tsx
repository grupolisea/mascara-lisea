export default function MaskPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#000",
      }}
    >
      <iframe
        src="https://qr-access-hub-1.emergent.host"
        title="Grupo Lisea"
        allow="camera; microphone; clipboard-read; clipboard-write; fullscreen"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}