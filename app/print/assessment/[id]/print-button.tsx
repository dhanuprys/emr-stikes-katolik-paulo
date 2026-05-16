"use client";

export function PrintButton() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        onClick={() => window.print()}
        style={{
          background: "white",
          color: "#1e293b",
          border: "none",
          padding: "8px 20px",
          borderRadius: "6px",
          fontWeight: 600,
          fontSize: "13px",
          cursor: "pointer",
        }}
      >
        🖨️ Cetak / Simpan PDF
      </button>
      <button
        onClick={() => window.close()}
        style={{
          background: "transparent",
          color: "#94a3b8",
          border: "1px solid #475569",
          padding: "8px 16px",
          borderRadius: "6px",
          fontWeight: 500,
          fontSize: "13px",
          cursor: "pointer",
        }}
      >
        Tutup
      </button>
    </div>
  );
}
