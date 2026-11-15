import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { user } from "../../configs/portfolio";

const SAMPLES = [
  {
    vendor: "Nordic Cloud Hosting",
    number: "INV-20487",
    date: "12 Jun 2026",
    items: [
      { desc: "Compute (production cluster)", qty: 1, amount: 812.4 },
      { desc: "Object storage (2.1 TB)", qty: 1, amount: 96.5 },
      { desc: "Support plan (Business)", qty: 1, amount: 149.0 }
    ]
  },
  {
    vendor: "Acme Office Supplies",
    number: "INV-88213",
    date: "9 Jun 2026",
    items: [
      { desc: "Standing desks (x4)", qty: 4, amount: 1240.0 },
      { desc: "Monitor arms (x4)", qty: 4, amount: 220.0 },
      { desc: "Delivery & install", qty: 1, amount: 85.0 }
    ]
  }
];

function total(sample) {
  return sample.items.reduce((s, i) => s + i.amount, 0);
}

const money = (n) => `$${n.toFixed(2)}`;

function DocumentIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <polyline points="8.5 12.2 11 14.7 15.8 9.8" />
    </svg>
  );
}

export default function Fatural() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const [stage, setStage] = useState("idle"); // idle | scanning | review | synced
  const sample = SAMPLES[sampleIdx];
  const accessMailto = `mailto:${user.email}?subject=${encodeURIComponent("Access request: Fatural")}&body=${encodeURIComponent("Hi Guri,\n\nI just tried the Fatural demo. Could you walk me through the real thing?\n\n")}`;

  const scan = () => {
    setStage("scanning");
    setTimeout(() => setStage("review"), 1150);
  };

  const approve = () => {
    setStage("synced");
  };

  const tryAnother = () => {
    setSampleIdx(i => (i + 1) % SAMPLES.length);
    setStage("idle");
  };

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      background: "var(--mac-window-bg)",
      padding: "20px 24px 26px",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h1 style={{ fontSize: 18, fontWeight: 650, color: "var(--mac-text)", letterSpacing: "-0.025em" }}>
            Fatural · Invoice Pipeline Demo
          </h1>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--mac-text-2)", lineHeight: 1.6 }}>
          Interactive walkthrough of the production flow: document capture → OCR extraction → approval → QuickBooks Online sync.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scan}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && scan()}
            style={{
              border: "1px dashed var(--mac-border-strong)",
              borderRadius: 10,
              padding: "42px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: "var(--mac-surface)",
              transition: "border-color 0.15s ease, background-color 0.15s ease"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--mac-surface-subtle)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--mac-surface)"; }}
          >
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 10,
              background: "var(--mac-surface-subtle)",
              border: "1px solid var(--mac-border)",
              color: "var(--mac-text)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12
            }}>
              <DocumentIcon />
            </div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--mac-text)", marginBottom: 4 }}>
              Run sample invoice extraction
            </p>
            <p style={{ fontSize: 12, color: "var(--mac-text-2)" }}>
              Click to process &ldquo;{sample.vendor}&rdquo; ({sample.number})
            </p>
          </motion.div>
        )}

        {stage === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "relative",
              borderRadius: 10,
              overflow: "hidden",
              background: "var(--mac-surface)",
              border: "1px solid var(--mac-border)",
              padding: "28px 24px",
              minHeight: 210
            }}
          >
            <div style={{ maxWidth: 260, margin: "0 auto" }}>
              <div style={{ height: 9, width: "68%", background: "rgba(9,9,11,0.1)", borderRadius: 3, marginBottom: 10 }} />
              <div style={{ height: 7, width: "44%", background: "rgba(9,9,11,0.06)", borderRadius: 3, marginBottom: 20 }} />
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ height: 6, width: `${80 - i * 6}%`, background: "rgba(9,9,11,0.06)", borderRadius: 3, marginBottom: 8 }} />
              ))}
            </div>
            <motion.div
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.05, ease: "linear" }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, transparent, #18181b, transparent)"
              }}
            />
            <p style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", fontSize: 12, color: "var(--mac-text-2)", fontWeight: 500 }}>
              Extracting structured line items…
            </p>
          </motion.div>
        )}

        {stage === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mac-card"
            style={{ padding: 0, overflow: "hidden" }}
          >
            <div style={{ padding: "13px 16px", background: "var(--mac-surface-subtle)", borderBottom: "1px solid var(--mac-border)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--mac-text)" }}>{sample.vendor}</p>
              <p style={{ fontSize: 11.5, color: "var(--mac-text-3)", fontVariantNumeric: "tabular-nums" }}>{sample.number} · {sample.date}</p>
            </div>
            <div style={{ padding: "10px 16px" }}>
              {sample.items.map((it, i) => (
                <div
                  key={it.desc}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "7px 0",
                    fontSize: 12.5,
                    color: "var(--mac-text-2)",
                    borderBottom: i < sample.items.length - 1 ? "1px solid var(--mac-border-2)" : "none"
                  }}
                >
                  <span>{it.desc}</span>
                  <span style={{ color: "var(--mac-text)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{money(it.amount)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, fontSize: 13.5, fontWeight: 650, color: "var(--mac-text)", fontVariantNumeric: "tabular-nums" }}>
                <span>Total</span>
                <span>{money(total(sample))}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, padding: "10px 16px 14px", borderTop: "1px solid var(--mac-border)" }}>
              <button type="button" className="mac-btn" onClick={approve}>
                Approve & Sync to QuickBooks
              </button>
              <button type="button" className="mac-btn secondary" onClick={() => setStage("idle")}>
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {stage === "synced" && (
          <motion.div
            key="synced"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mac-card"
            style={{ padding: "22px 18px", textAlign: "center" }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(34, 197, 94, 0.1)",
              color: "#15803d",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10
            }}>
              <CheckIcon />
            </div>
            <p style={{ fontSize: 14, fontWeight: 650, color: "var(--mac-text)", marginBottom: 4 }}>
              Synced to QuickBooks Online
            </p>
            <p style={{ fontSize: 12.5, color: "var(--mac-text-2)", marginBottom: 14 }}>
              {sample.vendor} · {money(total(sample))} posted to the ledger with zero manual re-entry.
            </p>
            <button type="button" className="mac-btn secondary" onClick={tryAnother}>
              Try Another Sample
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        marginTop: "auto",
        padding: "13px 15px",
        borderRadius: 9,
        background: "var(--mac-surface)",
        border: "1px solid var(--mac-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10
      }}>
        <p style={{ fontSize: 12, color: "var(--mac-text-2)", lineHeight: 1.55, margin: 0, flex: "1 1 240px" }}>
          Production Fatural runs on Node.js microservices with 2FA and a mobile capture companion app. Private client codebase.
        </p>
        <a href={accessMailto} className="mac-btn secondary" style={{ fontSize: 12, textDecoration: "none", flexShrink: 0 }}>
          Request Access →
        </a>
      </div>
    </div>
  );
}
