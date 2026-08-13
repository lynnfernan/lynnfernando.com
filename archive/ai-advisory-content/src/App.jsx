import { useState } from "react";
import { comparisons } from "./data/comparisons";
import { automations } from "./data/automations";
import { safetyCards, weeklyPrompts } from "./data/promptsAndSafety";

// ─── DESIGN TOKENS ───────────────────────────────────
const T = {
  gold: "#C9A84C",
  goldLight: "#F0D080",
  goldDim: "rgba(201,168,76,0.15)",
  goldBorder: "rgba(201,168,76,0.3)",
  navy: "#0A1628",
  navyMid: "#142240",
  blue: "#1B3A6B",
  blueBright: "#2D5BE3",
  cream: "#FAF6EE",
  textDark: "#0A1628",
  textMid: "#3D4F6E",
  textMuted: "#7A8BA8",
  success: "#2ECC71",
  warning: "#F39C12",
  danger: "#E74C3C",
  purple: "#9B59B6",
};

const edgeStyles = {
  gold:   { color: "#7B5C00", background: "rgba(201,168,76,0.18)" },
  blue:   { color: "#1B3A6B", background: "rgba(45,91,227,0.12)" },
  green:  { color: "#1A6B3C", background: "rgba(46,204,113,0.12)" },
  red:    { color: "#7B1818", background: "rgba(231,76,60,0.12)" },
  purple: { color: "#4A1B6B", background: "rgba(155,89,182,0.12)" },
};

const iconStyles = {
  danger:  { background: "rgba(231,76,60,0.12)" },
  warning: { background: "rgba(243,156,18,0.12)" },
  success: { background: "rgba(46,204,113,0.12)" },
};

// ─── COMPARISON CARD ─────────────────────────────────
function ComparisonCard({ data }) {
  return (
    <div style={{
      background: T.cream,
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      maxWidth: 520,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: T.navy,
        padding: "28px 28px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: T.gold,
          marginBottom: 8,
        }}>{data.eyebrow}</div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 26,
          fontWeight: 700,
          color: "white",
          lineHeight: 1.2,
          marginBottom: 6,
        }}>
          {data.title} <em style={{ color: T.goldLight, fontStyle: "italic" }}>{data.titleHighlight}</em>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>
          {data.subtitle}
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: "20px 24px 8px" }}>
        {/* Column headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "140px 1fr 110px",
          gap: 8,
          paddingBottom: 10,
          borderBottom: `1px solid rgba(10,22,40,0.12)`,
          marginBottom: 8,
        }}>
          {["Platform & Role", "Best For", ""].map((h, i) => (
            <span key={i} style={{
              fontSize: 9, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: 1.5, color: T.textMuted,
              textAlign: i === 2 ? "right" : "left",
            }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {data.tools.map((tool, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 110px",
            gap: 8,
            alignItems: "center",
            padding: "12px 4px",
            borderRadius: 8,
          }}>
            {/* Tool name */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: tool.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: tool.iconColor,
                flexShrink: 0,
              }}>{tool.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: tool.nameColor }}>{tool.name}</div>
                <div style={{
                  fontSize: 9, color: T.textMuted, textTransform: "uppercase",
                  letterSpacing: 1,
                }}>{tool.role}</div>
              </div>
            </div>

            {/* Use case */}
            <div style={{ fontSize: 11.5, color: T.textMid, lineHeight: 1.4 }}>
              {tool.useCase}
            </div>

            {/* Edge badge */}
            <div style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: 0.5, textAlign: "right",
              padding: "4px 8px", borderRadius: 4,
              justifySelf: "end",
              ...edgeStyles[tool.edgeStyle],
            }}>{tool.edge}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        margin: "12px 24px 20px",
        padding: "10px 14px",
        background: T.navy,
        borderRadius: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{data.footer.brand}</span>
        <span style={{ fontSize: 11, color: T.gold, fontFamily: "'Space Mono', monospace" }}>{data.footer.link}</span>
      </div>
    </div>
  );
}

// ─── AUTOMATION CARD ─────────────────────────────────
function AutomationCard({ data }) {
  return (
    <div style={{
      background: T.navy,
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      border: `1px solid ${T.goldBorder}`,
      maxWidth: 440,
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
    }}>
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${T.gold}, ${T.blueBright}, ${T.gold})`,
      }} />

      {/* Header row */}
      <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          background: T.goldDim,
          border: `1px solid ${T.goldBorder}`,
          color: T.gold,
          fontSize: 10, fontWeight: 600, letterSpacing: 2,
          textTransform: "uppercase",
          padding: "5px 12px", borderRadius: 50,
          fontFamily: "'Space Mono', monospace",
        }}>{data.badge}</div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 64, fontWeight: 900,
          color: "rgba(201,168,76,0.07)",
          lineHeight: 1,
        }}>{data.number}</div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 28px 8px" }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22, fontWeight: 700,
          color: "white", lineHeight: 1.25, marginBottom: 18,
        }}>
          {data.title}{" "}
          <span style={{ color: T.gold }}>{data.titleHighlight}</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "rgba(201,168,76,0.15)",
                border: `1px solid ${T.goldBorder}`,
                color: T.gold, fontSize: 10, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontFamily: "'Space Mono', monospace",
                marginTop: 1,
              }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 13, color: "white", fontWeight: 600, marginBottom: 2 }}>
                  {step.title}
                </div>
                <div style={{
                  fontSize: 12.5,
                  color: step.isPrompt ? T.goldLight : "rgba(255,255,255,0.65)",
                  lineHeight: 1.5,
                  fontStyle: step.isPrompt ? "italic" : "normal",
                  background: step.isPrompt ? "rgba(201,168,76,0.06)" : "transparent",
                  borderRadius: step.isPrompt ? 6 : 0,
                  padding: step.isPrompt ? "6px 10px" : 0,
                  borderLeft: step.isPrompt ? `2px solid ${T.goldBorder}` : "none",
                  marginTop: step.isPrompt ? 4 : 0,
                }}>{step.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        margin: "20px 28px 24px",
        padding: "12px 18px",
        background: "linear-gradient(135deg, rgba(201,168,76,0.1), rgba(45,91,227,0.08))",
        border: `1px solid ${T.goldBorder}`,
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{data.cta.text}</span>
        <a href={data.cta.link} style={{
          fontSize: 11, color: T.gold, fontWeight: 600,
          fontFamily: "'Space Mono', monospace", textDecoration: "none",
        }}>{data.cta.label}</a>
      </div>
    </div>
  );
}

// ─── SAFETY CARD ─────────────────────────────────────
function SafetyCard({ data }) {
  return (
    <div style={{
      background: "#F8F4EE",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      maxWidth: 480,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1A2E4A, #0A1628)",
        padding: "28px 28px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: 20, top: "50%",
          transform: "translateY(-50%)",
          fontSize: 56, opacity: 0.12, pointerEvents: "none",
        }}>🛡️</div>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 9,
          letterSpacing: 3, textTransform: "uppercase",
          color: T.goldLight, marginBottom: 8,
        }}>{data.eyebrow}</div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 24, fontWeight: 700,
          color: "white", lineHeight: 1.2,
        }}>
          {data.title}<br />
          <span style={{ color: T.goldLight }}>{data.titleHighlight}</span>
        </div>
      </div>

      {/* Rows */}
      <div style={{ padding: "22px 24px 16px" }}>
        {data.rows.map((row, i) => (
          <div key={i}>
            <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, flexShrink: 0,
                ...iconStyles[row.iconStyle],
              }}>{row.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.textDark, marginBottom: 2 }}>
                  {row.title}
                </div>
                <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.45 }}>
                  {row.body}
                </div>
              </div>
            </div>
            {i < data.rows.length - 1 && (
              <div style={{ height: 1, background: "rgba(10,22,40,0.08)", marginBottom: 14 }} />
            )}
          </div>
        ))}
      </div>

      {/* Rule of thumb */}
      <div style={{
        margin: "0 24px 20px",
        padding: "10px 14px",
        background: "rgba(10,22,40,0.06)",
        borderRadius: 8,
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <span>💡</span>
        <span style={{ fontSize: 11, color: T.textMid }}>
          Rule of thumb: <strong style={{ color: T.textDark }}>{data.ruleOfThumb}</strong>
        </span>
      </div>
    </div>
  );
}

// ─── PROMPT CARD ─────────────────────────────────────
function PromptCard({ data }) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = () => {
    navigator.clipboard.writeText(data.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: T.navy,
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      maxWidth: 520,
      fontFamily: "'DM Sans', sans-serif",
      border: `1px solid rgba(45,91,227,0.2)`,
    }}>
      <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 9,
          letterSpacing: 2, textTransform: "uppercase",
          color: T.blueBright, background: "rgba(45,91,227,0.1)",
          padding: "5px 12px", borderRadius: 50,
          border: "1px solid rgba(45,91,227,0.25)",
        }}>Prompt of the Week · {data.week}</div>
        <div style={{ display: "flex", gap: 6 }}>
          {data.tags.map((tag, i) => (
            <span key={i} style={{
              fontSize: 10, color: T.textMuted,
              background: "rgba(255,255,255,0.05)",
              padding: "3px 8px", borderRadius: 50,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 24px 0" }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20, fontWeight: 700, color: "white",
          marginBottom: 6,
        }}>{data.title}</h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 16, lineHeight: 1.5 }}>
          {data.description}
        </p>

        {/* Prompt box */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          padding: "14px 16px",
          position: "relative",
          marginBottom: 16,
        }}>
          <pre style={{
            fontSize: 12, color: T.goldLight,
            lineHeight: 1.7, whiteSpace: "pre-wrap",
            fontFamily: "'Space Mono', monospace",
            margin: 0,
          }}>{data.prompt}</pre>

          <button onClick={copyPrompt} style={{
            position: "absolute", top: 10, right: 10,
            background: copied ? "rgba(46,204,113,0.2)" : T.goldDim,
            border: `1px solid ${copied ? "rgba(46,204,113,0.4)" : T.goldBorder}`,
            color: copied ? T.success : T.gold,
            fontSize: 10, fontWeight: 600,
            fontFamily: "'Space Mono', monospace",
            padding: "4px 10px", borderRadius: 6,
            cursor: "pointer",
            transition: "all 0.2s",
          }}>
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>

        {/* Meta */}
        <div style={{
          display: "flex", gap: 16, paddingBottom: 20,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 14,
        }}>
          <div>
            <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Best With</div>
            <div style={{ fontSize: 12, color: T.gold, fontWeight: 600 }}>{data.useWith}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Pro Tip</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{data.proTip}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("comparison");
  const [activeIdx, setActiveIdx] = useState(0);

  const tabs = [
    { id: "comparison", label: "🔢 Comparison Cards", count: comparisons.length },
    { id: "automation", label: "⚡ Automation Cards", count: automations.length },
    { id: "safety",     label: "🛡️ Safety Cards",     count: safetyCards.length },
    { id: "prompt",     label: "🔑 Prompt Cards",      count: weeklyPrompts.length },
  ];

  const dataMap = {
    comparison: comparisons,
    automation: automations,
    safety: safetyCards,
    prompt: weeklyPrompts,
  };

  const currentData = dataMap[activeTab];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080E1C",
      fontFamily: "'DM Sans', sans-serif",
      padding: "40px 24px",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          display: "inline-block",
          fontFamily: "'Space Mono', monospace",
          fontSize: 10, letterSpacing: 3,
          textTransform: "uppercase",
          color: T.gold,
          border: `1px solid ${T.goldBorder}`,
          padding: "6px 16px", borderRadius: 2,
          marginBottom: 20,
        }}>AI Advisory Content System</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 900, color: "white",
          marginBottom: 10, lineHeight: 1.1,
        }}>
          Content Engine{" "}
          <span style={{ color: T.gold }}>Dashboard</span>
        </h1>
        <p style={{ fontSize: 15, color: T.textMuted, maxWidth: 480, margin: "0 auto" }}>
          REV Global × LynnFernando.com — All infographic templates in one place.
        </p>
      </div>

      {/* Tab Nav */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveIdx(0); }} style={{
            fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
            padding: "9px 20px", borderRadius: 50,
            border: `1px solid ${activeTab === tab.id ? T.gold : "rgba(255,255,255,0.12)"}`,
            background: activeTab === tab.id ? T.gold : "transparent",
            color: activeTab === tab.id ? T.navy : T.textMuted,
            cursor: "pointer", transition: "all 0.2s",
          }}>
            {tab.label}
            <span style={{
              marginLeft: 8, fontSize: 10,
              background: activeTab === tab.id ? "rgba(10,22,40,0.2)" : "rgba(255,255,255,0.08)",
              padding: "1px 7px", borderRadius: 50,
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Card selector */}
      {currentData.length > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
          {currentData.map((item, i) => (
            <button key={i} onClick={() => setActiveIdx(i)} style={{
              width: 32, height: 32, borderRadius: "50%",
              border: `1px solid ${i === activeIdx ? T.gold : "rgba(255,255,255,0.15)"}`,
              background: i === activeIdx ? T.goldDim : "transparent",
              color: i === activeIdx ? T.gold : T.textMuted,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>{i + 1}</button>
          ))}
        </div>
      )}

      {/* Card display */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {activeTab === "comparison" && <ComparisonCard data={comparisons[activeIdx]} />}
        {activeTab === "automation" && <AutomationCard data={automations[activeIdx]} />}
        {activeTab === "safety"     && <SafetyCard data={safetyCards[activeIdx]} />}
        {activeTab === "prompt"     && <PromptCard data={weeklyPrompts[activeIdx]} />}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <p style={{
          fontFamily: "'Space Mono', monospace", fontSize: 10,
          letterSpacing: 2, textTransform: "uppercase",
          color: "rgba(255,255,255,0.15)",
        }}>Lynn Fernando · REV Global · AI Advisory · 2026</p>
      </div>
    </div>
  );
}
