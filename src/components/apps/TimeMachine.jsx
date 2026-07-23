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

  return (
    <div style={{
      height: "100%", overflowY: "auto", background: "var(--mac-window-bg)",
      padding: "22px 22px 26px", display: "flex", flexDirection: "column", gap: 18
    }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--mac-text)", letterSpacing: "-0.3px", marginBottom: 4 }}>
          Time Machine
        </h1>
        <p style={{ fontSize: 12.5, color: "var(--mac-text-2)", lineHeight: 1.6 }}>
          Drag the slider to travel through my journey — About and Projects change to match.
        </p>
      </div>

      <div>
        <input
          type="range"
          min={2022}
          max={PRESENT_YEAR}
          step={1}
          value={timeMachineYear}
          onChange={(e) => setTimeMachineYear(Number(e.target.value))}
          aria-label="Travel through time"
          style={{ width: "100%", accentColor: "#7c3aed", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {YEARS.map(y => (
            <button
              key={y}
              type="button"
              onClick={() => setTimeMachineYear(y)}
              style={{
                appearance: "none", border: "none", background: "none", cursor: "pointer",
                fontSize: 11.5, fontWeight: y === timeMachineYear ? 700 : 500,
                color: y === timeMachineYear ? "#7c3aed" : "var(--mac-text-3)",
                padding: "2px 4px"
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          style={{
            borderRadius: 12, padding: "16px 18px",
            background: "linear-gradient(135deg, rgba(124,58,237,0.09), rgba(99,102,241,0.04))",
            border: "1px solid rgba(124,58,237,0.22)"
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8 }}>
            {timeMachineYear}
          </p>
          <p style={{ fontSize: 13.5, color: "var(--mac-text)", lineHeight: 1.7, marginBottom: eventsForYear(timeMachineYear).length ? 10 : 0 }}>
            {timeline[timeMachineYear]}
          </p>
          {eventsForYear(timeMachineYear).map((ev, i) => (
            <p key={i} style={{ fontSize: 12, color: "var(--mac-text-2)", paddingLeft: 14, position: "relative", marginBottom: 4 }}>
              <span style={{ position: "absolute", left: 0, color: "#7c3aed", fontWeight: 700 }}>·</span>
              {ev}
            </p>
          ))}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 11.5, color: "var(--mac-text-3)" }}>
          Check About → Experience and Projects to see the difference.
        </p>
        {timeMachineYear !== PRESENT_YEAR && (
          <button
            type="button"
            className="mac-btn secondary"
            style={{ fontSize: 12 }}
            onClick={() => setTimeMachineYear(PRESENT_YEAR)}
          >
            Return to Present
          </button>
        )}
      </div>
    </div>
  );
}
