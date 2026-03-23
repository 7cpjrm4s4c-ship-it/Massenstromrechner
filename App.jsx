import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// BERECHNUNGS-ENGINE
// ═══════════════════════════════════════════════════════════════

const MEDIEN = [
  { id: "wasser", name: "Wasser", cp: 4.182, dichte: 998 },
  { id: "glykol20", name: "Ethylenglykol 20%", cp: 3.89, dichte: 1025 },
  { id: "glykol30", name: "Ethylenglykol 30%", cp: 3.68, dichte: 1038 },
  { id: "glykol40", name: "Ethylenglykol 40%", cp: 3.46, dichte: 1052 },
  { id: "propylen20", name: "Propylenglykol 20%", cp: 3.98, dichte: 1018 },
  { id: "propylen30", name: "Propylenglykol 30%", cp: 3.82, dichte: 1028 },
  { id: "propylen40", name: "Propylenglykol 40%", cp: 3.64, dichte: 1038 },
];

function leistungZuMassenstrom(leistung_W, deltaT_K, cp, dichte) {
  if (deltaT_K === 0 || cp === 0) return null;
  const kgh = (leistung_W * 3.6) / (cp * deltaT_K);
  const m3h = kgh / dichte;
  return { kgh, m3h };
}

function massenstromZuLeistung(kgh, deltaT_K, cp) {
  if (deltaT_K === 0) return null;
  return (kgh * cp * deltaT_K) / 3.6;
}

function massenstromZuSpreizung(kgh, leistung_W, cp) {
  if (kgh === 0 || cp === 0) return null;
  return (leistung_W * 3.6) / (kgh * cp);
}

const MODI = [
  { id: "leistung", label: "Q̇ → ṁ", desc: "Leistung → Massenstrom" },
  { id: "massenstrom_leistung", label: "ṁ → Q̇", desc: "Massenstrom → Leistung" },
  { id: "massenstrom_spreizung", label: "ṁ → ΔT", desc: "Massenstrom → Spreizung" },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Field({ label, unit, value, onChange, step, min, helpText, options }) {
  const inputStyle = {
    width: "100%", padding: "14px 16px",
    paddingRight: unit ? 64 : 16,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    fontSize: 17, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600,
    color: "#fff", background: "rgba(255,255,255,0.07)",
    outline: "none", boxSizing: "border-box",
    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
  };

  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{
        display: "block", fontSize: 11.5, fontWeight: 600,
        color: "rgba(255,255,255,0.65)", marginBottom: 8,
        letterSpacing: "0.06em", textTransform: "uppercase",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        {options ? (
          <select value={value} onChange={(e) => onChange(e.target.value)}
            style={{
              ...inputStyle, cursor: "pointer",
              appearance: "none", WebkitAppearance: "none", paddingRight: 40,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath d='M3.5 5.5l3.5 3.5 3.5-3.5' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(100,160,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(100,160,255,0.1), inset 0 0 20px rgba(100,160,255,0.03)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}>
            {options.map((o) => <option key={o.value} value={o.value} style={{ background: "#242938", color: "#fff" }}>{o.label}</option>)}
          </select>
        ) : (
          <input type="number" value={value} step={step || 1} min={min || 0}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "" || raw === "-") { onChange(0); return; }
              const parsed = parseFloat(raw);
              if (!isNaN(parsed)) onChange(parsed);
            }}
            onFocus={(e) => {
              e.target.select();
              e.target.style.borderColor = "rgba(100,160,255,0.5)";
              e.target.style.boxShadow = "0 0 0 3px rgba(100,160,255,0.1), inset 0 0 20px rgba(100,160,255,0.03)";
            }}
            style={inputStyle}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }} />
        )}
        {unit && (
          <span style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            fontSize: 13, fontFamily: "'IBM Plex Mono', monospace",
            color: "rgba(255,255,255,0.45)", fontWeight: 500, pointerEvents: "none",
          }}>{unit}</span>
        )}
      </div>
      {helpText && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 6, lineHeight: 1.5, fontFamily: "'IBM Plex Sans', sans-serif" }}>{helpText}</div>}
    </div>
  );
}

function ResultCard({ label, value, unit, gradient }) {
  return (
    <div style={{
      position: "relative", borderRadius: 16, padding: "22px 22px 20px",
      background: gradient, overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -30, right: -30, width: 100, height: 100,
        borderRadius: "50%", background: "rgba(255,255,255,0.1)", filter: "blur(30px)",
      }} />
      <div style={{
        fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)",
        letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
        fontFamily: "'IBM Plex Sans', sans-serif", position: "relative",
      }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, position: "relative" }}>
        <span style={{
          fontSize: 34, fontWeight: 700, color: "#fff",
          fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "-0.03em",
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}>{value}</span>
        <span style={{
          fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.65)",
          fontFamily: "'IBM Plex Mono', monospace",
        }}>{unit}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

export default function Massenstromrechner() {
  const [modus, setModus] = useState("leistung");
  const [mediumId, setMediumId] = useState("wasser");
  const [leistung, setLeistung] = useState(1200);
  const [deltaT, setDeltaT] = useState(20);
  const [massenstrom, setMassenstrom] = useState(51.6);

  const medium = useMemo(() => MEDIEN.find((m) => m.id === mediumId), [mediumId]);

  const ergebnis = useMemo(() => {
    if (!medium) return null;
    if (modus === "leistung") {
      if (leistung <= 0 || deltaT <= 0) return null;
      return leistungZuMassenstrom(leistung, deltaT, medium.cp, medium.dichte);
    }
    if (modus === "massenstrom_leistung") {
      if (massenstrom <= 0 || deltaT <= 0) return null;
      const q = massenstromZuLeistung(massenstrom, deltaT, medium.cp);
      return q !== null ? { leistung_W: q } : null;
    }
    if (modus === "massenstrom_spreizung") {
      if (massenstrom <= 0 || leistung <= 0) return null;
      const dt = massenstromZuSpreizung(massenstrom, leistung, medium.cp);
      return dt !== null ? { spreizung_K: dt } : null;
    }
    return null;
  }, [modus, mediumId, leistung, deltaT, massenstrom, medium]);

  const formeln = {
    leistung: "ṁ = Q̇ × 3,6 / (c_p × ΔT)",
    massenstrom_leistung: "Q̇ = ṁ × c_p × ΔT / 3,6",
    massenstrom_spreizung: "ΔT = Q̇ × 3,6 / (ṁ × c_p)",
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #171b26; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 1; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div style={{
        background: "#171b26", minHeight: "100vh",
        fontFamily: "'IBM Plex Sans', sans-serif", color: "#fff",
      }}>
        {/* Ambient */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(60,100,180,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(100,60,180,0.08) 0%, transparent 50%)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "linear-gradient(135deg, rgba(80,140,255,0.15), rgba(120,80,255,0.1))",
                border: "1px solid rgba(100,150,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700, color: "rgba(140,180,255,0.8)",
                boxShadow: "0 4px 20px rgba(80,120,255,0.1)",
              }}>ṁ</div>
              <div>
                <h1 style={{
                  fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #fff 0%, rgba(180,200,255,0.8) 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>Massenstrom</h1>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500, marginTop: 1, letterSpacing: "0.04em" }}>
                  HVAC · Heizung & Kühlung
                </div>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 60px" }}>

            {/* Mode Toggle */}
            <div style={{
              display: "flex", gap: 6, marginBottom: 24,
              background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 4,
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              {MODI.map((m) => {
                const active = modus === m.id;
                return (
                  <button key={m.id} onClick={() => setModus(m.id)}
                    style={{
                      flex: 1, padding: "12px 8px", borderRadius: 11,
                      border: "none", cursor: "pointer",
                      background: active ? "linear-gradient(135deg, rgba(80,130,255,0.2), rgba(100,80,255,0.12))" : "transparent",
                      boxShadow: active ? "0 2px 12px rgba(80,130,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
                      transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}>
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 14,
                      fontWeight: 700, color: active ? "rgba(150,190,255,0.95)" : "rgba(255,255,255,0.25)",
                      marginBottom: 2, transition: "color 0.2s",
                    }}>{m.label}</div>
                    <div style={{
                      fontSize: 10, fontWeight: 500,
                      color: active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)",
                      transition: "color 0.2s",
                    }}>{m.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Input Card */}
            <div style={{
              background: "rgba(255,255,255,0.06)", borderRadius: 18,
              padding: "24px 22px 6px", border: "1px solid rgba(255,255,255,0.1)",
              marginBottom: 16,
            }}>
              <Field label="Wärmeträgermedium" value={mediumId} onChange={setMediumId}
                options={MEDIEN.map((m) => ({ value: m.id, label: m.name }))} />

              {modus === "leistung" && (
                <>
                  <Field label="Heiz-/Kühllast" unit="W" value={leistung} step={100} onChange={setLeistung} />
                  <Field label="Temperaturspreizung ΔT" unit="K" value={deltaT} step={1} onChange={setDeltaT}
                    helpText="Differenz zwischen Vorlauf- und Rücklauftemperatur" />
                </>
              )}
              {modus === "massenstrom_leistung" && (
                <>
                  <Field label="Massenstrom" unit="kg/h" value={massenstrom} step={1} onChange={setMassenstrom} />
                  <Field label="Temperaturspreizung ΔT" unit="K" value={deltaT} step={1} onChange={setDeltaT} />
                </>
              )}
              {modus === "massenstrom_spreizung" && (
                <>
                  <Field label="Massenstrom" unit="kg/h" value={massenstrom} step={1} onChange={setMassenstrom} />
                  <Field label="Heiz-/Kühllast" unit="W" value={leistung} step={100} onChange={setLeistung} />
                </>
              )}
            </div>

            {/* Formula */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", marginBottom: 16,
              borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.05)", flexWrap: "wrap",
            }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
                fontWeight: 600, color: "rgba(140,180,255,0.7)",
              }}>{formeln[modus]}</span>
              <span style={{
                marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.4)",
              }}>c_p={medium.cp} · ρ={medium.dichte}</span>
            </div>

            {/* Results */}
            {ergebnis ? (
              <div key={modus + mediumId} style={{ animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
                <div style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 20,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16,
                  }}>Ergebnis</div>

                  {modus === "leistung" && (
                    <div style={{ display: "grid", gap: 12 }}>
                      <ResultCard label="Massenstrom" value={ergebnis.kgh.toFixed(2)} unit="kg/h"
                        gradient="linear-gradient(135deg, rgba(60,110,220,0.3) 0%, rgba(80,60,180,0.2) 100%)" />
                      <ResultCard label="Volumenstrom" value={ergebnis.m3h.toFixed(4)} unit="m³/h"
                        gradient="linear-gradient(135deg, rgba(50,160,130,0.25) 0%, rgba(40,120,160,0.18) 100%)" />
                    </div>
                  )}

                  {modus === "massenstrom_leistung" && (
                    <ResultCard label="Leistung" value={ergebnis.leistung_W.toFixed(1)} unit="W"
                      gradient="linear-gradient(135deg, rgba(220,140,50,0.28) 0%, rgba(200,80,60,0.18) 100%)" />
                  )}

                  {modus === "massenstrom_spreizung" && (
                    <ResultCard label="Temperaturspreizung" value={ergebnis.spreizung_K.toFixed(2)} unit="K"
                      gradient="linear-gradient(135deg, rgba(220,140,50,0.28) 0%, rgba(200,80,60,0.18) 100%)" />
                  )}

                  <div style={{
                    display: "flex", gap: 16, marginTop: 16, padding: "12px 16px",
                    borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.05)", flexWrap: "wrap",
                  }}>
                    {[["Medium", medium.name], ["c_p", `${medium.cp} kJ/(kg·K)`], ["ρ", `${medium.dichte} kg/m³`]].map(([lbl, val]) => (
                      <div key={lbl} style={{ fontSize: 11 }}>
                        <span style={{ color: "rgba(255,255,255,0.4)" }}>{lbl}: </span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: "rgba(255,255,255,0.06)", borderRadius: 18,
                padding: "48px 20px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center",
              }}>
                <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.15, animation: "pulse 3s ease-in-out infinite" }}>◎</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Alle Eingabewerte müssen größer als 0 sein</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
