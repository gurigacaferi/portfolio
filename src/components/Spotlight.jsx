import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktop } from "../context/DesktopContext";
import { dockApps } from "../configs/portfolio";
import { AppIconById } from "./DockIcons";

export default function Spotlight() {
  const { spotlight, setSpotlight, openApp } = useDesktop();
  const [query,    setQuery]    = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  const results = query.trim()
    ? dockApps.filter(a => (a.title + " " + (a.subtitle || "")).toLowerCase().includes(query.toLowerCase()))
    : dockApps;

  useEffect(() => {
    if (spotlight) { setQuery(""); setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [spotlight]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  const launch = (app) => {
    setSpotlight(false);
    if (app.external) window.open(app.external, "_blank");
    else openApp(app.id);
  };

  const onKey = (e) => {
    if (e.key === "Escape")    setSpotlight(false);
    if (e.key === "ArrowDown") setActiveIdx(i => Math.min(i + 1, results.length - 1));
    if (e.key === "ArrowUp")   setActiveIdx(i => Math.max(i - 1, 0));
    if (e.key === "Enter" && results[activeIdx]) launch(results[activeIdx]);
  };

  return (
    <AnimatePresence>
      {spotlight && (
        <motion.div
          className="spotlight-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSpotlight(false)}
        >
          <motion.div
            className="spotlight-box"
            initial={{ opacity: 0, scale: 0.96, y: -18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -18 }}
            transition={{ type: "spring", damping: 32, stiffness: 400 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "2px 18px 0" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="var(--mac-text-3)" strokeWidth="1.8"/>
                <line x1="12.5" y1="12.5" x2="16.5" y2="16.5" stroke="var(--mac-text-3)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <input
                ref={inputRef}
                className="spotlight-input"
                placeholder="Spotlight Search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKey}
              />
            </div>

            {results.length > 0 && (
              <>
                <div className="spotlight-divider" />
                <div style={{ padding: "6px 0 8px", maxHeight: 300, overflowY: "auto" }}>
                  {results.map((app, i) => (
                    <div
                      key={app.id}
                      className={`spotlight-result${i === activeIdx ? " active" : ""}`}
                      onClick={() => launch(app)}
                      onMouseEnter={() => setActiveIdx(i)}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 7, overflow: "hidden", flexShrink: 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>
                        <AppIconById id={app.icon || app.id} size={32} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="spotlight-result-label">{app.title}</p>
                        <p className="spotlight-result-sub">{app.subtitle}</p>
                      </div>
                      {i === activeIdx && (
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginLeft: "auto" }}>↩ open</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
