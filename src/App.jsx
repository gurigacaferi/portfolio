import React, { useState, useEffect, Component } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DesktopProvider } from "./context/DesktopContext";
import Desktop from "./components/Desktop";

/* ── Error boundary: shows a visible message instead of blank screen ─── */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            position: "fixed", inset: 0, background: "#0a0a1a",
            color: "#e8e8ed", fontFamily: "monospace",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: 32, gap: 16, textAlign: "center"
          }}
        >
          <span style={{ fontSize: 40 }}>⚠</span>
          <p style={{ fontSize: 16, fontWeight: 600 }}>Something went wrong</p>
          <pre style={{ fontSize: 11, opacity: 0.5, maxWidth: 520, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8, padding: "8px 20px", borderRadius: 8, border: "none",
              background: "#0071e3", color: "#fff", fontSize: 14, cursor: "pointer"
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function BootScreen({ onDone }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const delay = reduceMotion ? 350 : 1800;
    const timer = setTimeout(onDone, delay);
    return () => clearTimeout(timer);
  }, [onDone, reduceMotion]);

  const t = reduceMotion ? 0 : undefined;

  return (
    <motion.div
      className="mac-boot-screen"
      exit={{ opacity: reduceMotion ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 28
      }}
    >
      <motion.div
        className="mac-boot-mark"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: t ?? 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        G
      </motion.div>

      <motion.div
        className="mac-boot-progress-track"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: t ?? 0.25, delay: reduceMotion ? 0 : 0.3 }}
      >
        <motion.div
          className="mac-boot-progress-fill"
          initial={reduceMotion ? false : { width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: reduceMotion ? 0 : 1.25,
            ease: reduceMotion ? undefined : [0.65, 0, 0.35, 1]
          }}
        />
      </motion.div>
    </motion.div>
  );
}

function LoginScreen({ onLogin }) {
  const [time, setTime] = useState(new Date());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fadeDur = reduceMotion ? 0 : 0.4;

  return (
    <motion.div
      className="mac-login-screen"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: reduceMotion ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
      style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#000000"
      }}
    >
      <div
        className="wallpaper"
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.45,
          filter: "blur(72px) saturate(1.15)",
          transform: "scale(1.08)"
        }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reduceMotion ? 0 : 0.12,
          duration: fadeDur,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        style={{ position: "relative", textAlign: "center", marginBottom: "clamp(32px, 8vh, 48px)" }}
      >
        <div className="mac-login-time">
          {time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
        </div>
        <div className="mac-login-date">
          {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reduceMotion ? 0 : 0.2,
          duration: fadeDur,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16
        }}
      >
        <div className="mac-login-avatar">GG</div>

        <div className="mac-login-name">Guri Gacaferi</div>

        <motion.button
          type="button"
          className="mac-login-button"
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.32, duration: reduceMotion ? 0 : 0.3 }}
          onClick={onLogin}
        >
          Log In
        </motion.button>

        <p className="mac-login-hint">
          No password required — tap Log In to open the desktop.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("boot"); // boot | login | desktop
  const reduceMotion = useReducedMotion();

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {phase === "boot" && (
          <BootScreen key="boot" onDone={() => setPhase("login")} />
        )}
        {phase === "login" && (
          <LoginScreen key="login" onLogin={() => setPhase("desktop")} />
        )}
        {phase === "desktop" && (
          <motion.div
            key="desktop"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ width: "100vw", height: "100vh", background: "#000" }}
          >
            <DesktopProvider>
              <Desktop />
            </DesktopProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
