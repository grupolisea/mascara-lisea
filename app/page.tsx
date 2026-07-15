export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      <iframe
        src="https://qr-access-hub-1.emergent.host"
        title="Portal Seguro"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
        }}
        allow="clipboard-write"
      />
    </div>
  );
}