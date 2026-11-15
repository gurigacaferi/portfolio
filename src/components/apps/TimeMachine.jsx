import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { timeline, workExperience, education, PRESENT_YEAR } from "../../configs/portfolio";
import { useDesktop } from "../../context/DesktopContext";

const YEARS = [2022, 2023, 2024, 2025, 2026];

function eventsForYear(year) {
  const events = [];
  workExperience.forEach(e => { if (e.startYear === year) events.push(`Started as ${e.role} at ${e.company}`); });
  education.forEach(e => { if (e.startYear === year) events.push(`Began ${e.degree} at ${e.institution}`); });
  return events;
}

export default function TimeMachine() {
  const { timeMachineYear, setTimeMachineYear } = useDesktop();
  const events = eventsForYear(timeMachineYear);

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      background: "var(--mac-window-bg)",
      padding: "22px 24px 26px",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 650, color: "var(--mac-text)", letterSpacing: "-0.025em", marginBottom: 4 }}>
          Timeline
        </h1>
        <p style={{ fontSize: 12.5, color: "var(--mac-text-2)", lineHeight: 1.6 }}>
          Scrub across years to filter the About and Projects windows to a specific point in time.
        </p>
      </div>

      <div className="mac-card" style={{ padding: "14px 16px" }}>
        <input
          type="range"
          min={2022}
          max={PRESENT_YEAR}
          step={1}
          value={timeMachineYear}
          onChange={(e) => setTimeMachineYear(Number(e.target.value))}
          aria-label="Select year"
          style={{ width: "100%", accentColor: "#18181b", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {YEARS.map(y => (
            <button
              key={y}
              type="button"
              onClick={() => setTimeMachineYear(y)}
              style={{
                appearance: "none",
                border: "none",
                background: y === timeMachineYear ? "#18181b" : "transparent",
                color: y === timeMachineYear ? "#fafafa" : "var(--mac-text-3)",
                borderRadius: 5,
                cursor: "pointer",
                fontSize: 11.5,
                fontWeight: y === timeMachineYear ? 600 : 500,
                fontVariantNumeric: "tabular-nums",
                padding: "3px 8px",
                transition: "background-color 0.12s ease, color 0.12s ease"
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={timeMachineYear}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="mac-card"
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--mac-text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>
            {timeMachineYear}
          </p>
          <p style={{ fontSize: 13, color: "var(--mac-text)", lineHeight: 1.7, marginBottom: events.length ? 12 : 0 }}>
            {timeline[timeMachineYear]}
          </p>
          {events.length > 0 && (
            <div style={{ borderTop: "1px solid var(--mac-border)", paddingTop: 10 }}>
              {events.map((ev, i) => (
                <p key={i} style={{ fontSize: 12, color: "var(--mac-text-2)", paddingLeft: 13, position: "relative", marginBottom: i < events.length - 1 ? 4 : 0 }}>
                  <span style={{ position: "absolute", left: 0, top: 7, width: 4, height: 4, borderRadius: "50%", background: "var(--mac-text-3)" }} />
                  {ev}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <p style={{ fontSize: 11.5, color: "var(--mac-text-3)", margin: 0 }}>
          Updates Experience and Projects automatically.
        </p>
        {timeMachineYear !== PRESENT_YEAR && (
          <button
            type="button"
            className="mac-btn secondary"
            style={{ fontSize: 12 }}
            onClick={() => setTimeMachineYear(PRESENT_YEAR)}
          >
            Reset to {PRESENT_YEAR}
          </button>
        )}
      </div>
    </div>
  );
}
