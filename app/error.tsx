"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>Something went wrong on this page</h2>
      <p style={{ opacity: 0.7 }}>Please try again.</p>
      <button onClick={() => reset()} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#111", color: "#fff", cursor: "pointer" }}>Retry</button>
    </div>
  );
}
