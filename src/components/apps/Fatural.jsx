import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { user } from "../../configs/portfolio";

const SAMPLES = [
  {
    vendor: "Nordic Cloud Hosting",
    number: "INV-20487",
    date: "12 Jun 2026",
    items: [
      { desc: "Compute — production cluster", qty: 1, amount: 812.4 },
      { desc: "Object storage (2.1 TB)", qty: 1, amount: 96.5 },
      { desc: "Support plan — Business", qty: 1, amount: 149.0 }
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

export default function Fatural() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const [stage, setStage] = useState("idle"); // idle | scanning | review | synced
  const sample = SAMPLES[sampleIdx];
  const accessMailto = `mailto:${user.email}?subject=${encodeURIComponent("Access request: Fatural")}&body=${encodeURIComponent("Hi Guri,\n\nI just tried the Fatural demo — could you walk me through the real thing?\n\n")}`;

  const scan = () => {
    setStage("scanning");
    setTimeout(() => setStage("review"), 1200);
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
      height: "100%", overflowY: "auto", background: "var(--mac-window-bg)",
      padding: "20px 22px 26px", display: "flex", flexDirection: "column", gap: 16
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "var(--mac-text)", letterSpacing: "-0.3px" }}>
            Fatural — Live Demo
          </h1>
        </div>
        <p style={{ fontSize: 12, color: "var(--mac-text-2)", lineHeight: 1.6 }}>
          A simplified walk-through of the real pipeline: scan → AI/OCR extraction → review → sync to QuickBooks Online.
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
            onKeyDown={(e) => e.key === "Enter" && scan()}
            style={{
              border: "2px dashed rgba(16,185,129,0.4)", borderRadius: 14,
              padding: "48px 24px", textAlign: "center", cursor: "pointer",
              background: "rgba(16,185,129,0.05)"
            }}
          >
            <div style={{ fontSize: 34, marginBottom: 10 }}>🧾</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--mac-text)", marginBottom: 4 }}>
              Try a sample invoice
            </p>
            <p style={{ fontSize: 12, color: "var(--mac-text-2)" }}>
              Click to simulate scanning &ldquo;{sample.vendor}&rdquo; — {sample.number}
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
              position: "relative", borderRadius: 14, overflow: "hidden",
              background: "#f5f5f0", border: "1px solid rgba(0,0,0,0.08)",
              padding: "28px 24px", minHeight: 220
            }}
          >
            <div style={{ maxWidth: 260, margin: "0 auto" }}>
              <div style={{ height: 10, width: "70%", background: "rgba(0,0,0,0.12)", borderRadius: 3, marginBottom: 10 }} />
              <div style={{ height: 8, width: "45%", background: "rgba(0,0,0,0.08)", borderRadius: 3, marginBottom: 20 }} />
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ height: 7, width: `${80 - i * 6}%`, background: "rgba(0,0,0,0.08)", borderRadius: 3, marginBottom: 8 }} />
              ))}
            </div>
            <motion.div
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.1, ease: "linear" }}
              style={{
                position: "absolute", left: 0, right: 0, height: 3,
                background: "linear-gradient(90deg, transparent, #10b981, transparent)",
                boxShadow: "0 0 12px rgba(16,185,129,0.7)"
              }}
            />
            <p style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", fontSize: 12, color: "#0d9268", fontWeight: 600 }}>
              Scanning · extracting line items with AI/OCR…
            </p>
          </motion.div>
        )}

        {stage === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, overflow: "hidden" }}
          >
            <div style={{ padding: "14px 16px", background: "rgba(16,185,129,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--mac-text)" }}>{sample.vendor}</p>
              <p style={{ fontSize: 11.5, color: "var(--mac-text-2)" }}>{sample.number} · {sample.date}</p>
            </div>
            <div style={{ padding: "10px 16px" }}>
              {sample.items.map((it, i) => (
                <motion.div
                  key={it.desc}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12.5, color: "var(--mac-text-2)", borderBottom: i < sample.items.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}
                >
                  <span>{it.desc}</span>
                  <span style={{ color: "var(--mac-text)", fontWeight: 500 }}>{money(it.amount)}</span>
                </motion.div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, fontSize: 13.5, fontWeight: 700, color: "var(--mac-text)" }}>
                <span>Total</span>
                <span>{money(total(sample))}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, padding: "10px 16px 14px" }}>
              <button className="mac-btn" style={{ fontSize: 12.5, background: "#10b981" }} onClick={approve}>
                Approve & Sync to QuickBooks
              </button>
              <button className="mac-btn secondary" style={{ fontSize: 12.5 }} onClick={() => setStage("idle")}>
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {stage === "synced" && (
          <motion.div
            key="synced"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12,
              background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.03))",
              padding: "20px 18px", textAlign: "center"
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 8 }}>✅</div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--mac-text)", marginBottom: 4 }}>
              Synced to QuickBooks Online
            </p>
            <p style={{ fontSize: 12, color: "var(--mac-text-2)", marginBottom: 14 }}>
              {sample.vendor} · {money(total(sample))} landed in the client&rsquo;s ledger — zero manual re-entry.
            </p>
            <button className="mac-btn secondary" style={{ fontSize: 12.5 }} onClick={tryAnother}>
              Try Another Sample
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        marginTop: "auto", padding: "12px 14px", borderRadius: 10,
        background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column", gap: 8
      }}>
        <p style={{ fontSize: 11.5, color: "var(--mac-text-2)", lineHeight: 1.6, margin: 0 }}>
          This is a simplified simulation — the real Fatural is a microservices app with async messaging, 2FA, and a mobile companion app. Source is private (client work).
        </p>
        <a href={accessMailto} className="mac-btn" style={{ alignSelf: "flex-start", fontSize: 12, textDecoration: "none", background: "#10b981" }}>
          Request Access →
        </a>
      </div>
    </div>
  );
}
