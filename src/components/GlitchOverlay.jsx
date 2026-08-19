import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useDesktop } from "../context/DesktopContext";
import { useKonamiCode } from "../hooks/useKonamiCode";

/**
 * "Break the desktop" easter egg. Triggered by the Konami code (anywhere) or
 * `sudo rm -rf /` in Terminal (which dispatches a `guri:glitch` window event).
 * Sequence: shake the desktop -> BSOD parody -> restore + open Resume + toast.
 */
export default function GlitchOverlay() {
  const { openApp } = useDesktop();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState("idle"); // idle | shake | bsod | toast
  const [pct, setPct] = useState(0);

  const trigger = useCallback(() => {
    setPhase(p => (p === "idle" ? "shake" : p));
  }, []);

  useKonamiCode(trigger);

  useEffect(() => {
    const onGlitch = () => trigger();
    window.addEventListener("guri:glitch", onGlitch);
    return () => window.removeEventListener("guri:glitch", onGlitch);
  }, [trigger]);

  useEffect(() => {
    if (phase === "idle") return undefined;
    document.body.classList.toggle("desktop-shake", phase === "shake" && !reduceMotion);
    return () => document.body.classList.remove("desktop-shake");
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "shake") return undefined;
    const t = setTimeout(() => setPhase("bsod"), reduceMotion ? 0 : 560);
    return () => clearTimeout(t);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "bsod") return undefined;
    setPct(0);
    const step = setInterval(() => setPct(p => Math.min(100, p + 14)), 90);
    const t = setTimeout(() => {
      setPhase("toast");
      openApp("resume");
    }, reduceMotion ? 900 : 2100);
    return () => { clearInterval(step); clearTimeout(t); };
  }, [phase, openApp, reduceMotion]);

  useEffect(() => {
    if (phase !== "toast") return undefined;
    const t = setTimeout(() => setPhase("idle"), 3200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <>
      <AnimatePresence>
        {phase === "bsod" && (
          <motion.div
            className="bsod-overlay"
            role="alertdialog"
            aria-label="Guri OS system message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.05 : 0.25 }}
          >
            <div className="bsod-face">:(</div>
            <div className="bsod-title">
              Your candidate pool just got smaller.<br />
              Guri_OS ran into a problem and needs to hire you.
            </div>
            <div className="bsod-code">Error code: 0x000000FEED (FULLY_EMPLOYED_ENGINEER_DETECTED)</div>
            <div className="bsod-progress">Collecting some info, then we&rsquo;ll restart for you ({pct}% complete)</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "toast" && (
          <motion.div
            className="glitch-toast"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: reduceMotion ? 0.05 : 0.3 }}
          >
            <span aria-hidden="true">🙂</span>
            Nice try. Here&rsquo;s my resume.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
