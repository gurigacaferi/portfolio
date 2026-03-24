import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktop } from "../context/DesktopContext";
import { user } from "../configs/portfolio";
import { useIsMobileLayout } from "../hooks/useMediaQuery";

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="topbar-item">
      {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      {" "}
      {time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
    </span>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
      <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
      <path d="M4.5 7A4.97 4.97 0 018 5.5a4.97 4.97 0 013.5 1.5L13 5.5A6.97 6.97 0 008 3.5 6.97 6.97 0 003 5.5L4.5 7z" opacity="0.75"/>
      <path d="M1 4A9.95 9.95 0 018 1a9.95 9.95 0 017 3L16.5 2.5A11.95 11.95 0 008 0 11.95 11.95 0 00-.5 2.5L1 4z" opacity="0.5"/>
    </svg>
  );
}

function WifiConnectMenu({ onClose, openApp, triggerRef }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (triggerRef?.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onDoc, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, triggerRef]);

  const openContact = useCallback(() => {
    openApp("contact");
    onClose();
  }, [openApp, onClose]);

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-label="Connect"
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: 280,
        background: "rgba(40, 40, 48, 0.94)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        borderRadius: 12,
        boxShadow: "0 18px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.09)",
        padding: "14px 14px 12px",
        zIndex: 9999,
        color: "rgba(255,255,255,0.92)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white"
        }}>
          <svg width="18" height="14" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
            <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
            <path d="M4.5 7A4.97 4.97 0 018 5.5a4.97 4.97 0 013.5 1.5L13 5.5A6.97 6.97 0 008 3.5 6.97 6.97 0 003 5.5L4.5 7z" opacity="0.85"/>
            <path d="M1 4A9.95 9.95 0 018 1a9.95 9.95 0 017 3L16.5 2.5A11.95 11.95 0 008 0 11.95 11.95 0 00-.5 2.5L1 4z" opacity="0.55"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.35, textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>
            Wi‑Fi
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: "white" }}>
            Portfolio Network
          </p>
        </div>
      </div>

      <div style={{
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        margin: "0 -4px 12px"
      }} />

      <p style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 6, letterSpacing: -0.15 }}>
        Want to connect?
      </p>
      <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "rgba(255,255,255,0.65)", marginBottom: 14 }}>
        Connect with Guri — say hello, ask about a project, or just drop a note.
      </p>

      <button
        type="button"
        onClick={openContact}
        style={{
          width: "100%",
          border: "none",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: "pointer",
          color: "white",
          background: "linear-gradient(180deg, #0a84ff 0%, #0070e0 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.22) inset, 0 4px 12px rgba(0,112,224,0.35)",
          marginBottom: 8
        }}
      >
        Open Contact
      </button>
      <a
        href={`mailto:${user.email}`}
        onClick={onClose}
        style={{
          display: "block",
          width: "100%",
          textAlign: "center",
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(255,255,255,0.55)",
          textDecoration: "none",
          padding: "6px 0",
          borderRadius: 6
        }}
      >
        {user.email}
      </a>
    </motion.div>
  );
}

function BatteryStatus() {
  const [level, setLevel] = useState(null);
  const [charging, setCharging] = useState(false);
  const [supported, setSupported] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let bat = null;
    const onLevel = () => {
      if (bat) setLevel(bat.level);
    };
    const onCharging = () => {
      if (bat) setCharging(bat.charging);
    };

    if (typeof navigator !== "undefined" && typeof navigator.getBattery === "function") {
      navigator.getBattery()
        .then((b) => {
          if (cancelled) return;
          bat = b;
          setSupported(true);
          setLevel(b.level);
          setCharging(b.charging);
          b.addEventListener("levelchange", onLevel);
          b.addEventListener("chargingchange", onCharging);
        })
        .catch(() => {
          if (!cancelled) setSupported(false);
        });
    } else {
      setSupported(false);
    }

    return () => {
      cancelled = true;
      if (bat) {
        bat.removeEventListener("levelchange", onLevel);
        bat.removeEventListener("chargingchange", onCharging);
      }
    };
  }, []);

  const pct = level != null ? Math.round(level * 100) : null;
  const fillW = level != null ? Math.max(level > 0 ? 1.2 : 0, 14 * level) : 12;
  const label =
    supported === false
      ? "Battery (not available in this browser)"
      : pct == null
        ? "Battery"
        : charging
          ? `Battery ${pct}%, charging`
          : `Battery ${pct}%`;

  return (
    <span
      className="topbar-item topbar-battery"
      style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "default" }}
      title={label}
      aria-label={label}
    >
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden>
        <rect x="0.5" y="0.5" width="18" height="11" rx="3" stroke="white" strokeOpacity="0.85" strokeWidth="1.2"/>
        <rect
          x="2"
          y="2"
          width={supported === false ? 12 : fillW}
          height="8"
          rx="1.5"
          fill="white"
          fillOpacity={charging ? 0.95 : 0.85}
        />
        <path d="M19.5 4v4a2 2 0 000-4z" fill="white" fillOpacity="0.5"/>
        {charging && supported && (
          <path
            d="M9.2 3.2h1.4L8.8 6.2h2.1L7.5 9.2h1.2l2.2-3.4H9.2l1-2.6z"
            fill="rgba(40,40,48,0.92)"
          />
        )}
      </svg>
      {supported && pct != null && (
        <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.9, minWidth: 28, letterSpacing: "-0.02em" }}>
          {pct}%
        </span>
      )}
    </span>
  );
}

function ControlCenterIcon({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 0", display: "flex", alignItems: "center" }}
    >
      <svg width="18" height="14" viewBox="0 0 18 14" fill="white" opacity="0.85">
        <circle cx="3" cy="4" r="2.5"/>
        <circle cx="9" cy="4" r="2.5"/>
        <circle cx="15" cy="4" r="2.5"/>
        <circle cx="3" cy="10" r="2.5" opacity="0.6"/>
        <circle cx="9" cy="10" r="2.5" opacity="0.6"/>
        <circle cx="15" cy="10" r="2.5" opacity="0.6"/>
      </svg>
    </button>
  );
}

function AppleMenu({ onClose }) {
  const { openApp } = useDesktop();
  const items = [
    { label: "About Me", action: () => { openApp("about"); onClose(); } },
    null,
    { label: "System Preferences…", action: onClose },
    null,
    { label: "Sleep", action: onClose },
    { label: "Restart…", action: onClose },
    { label: "Shut Down…", action: onClose },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: 0,
        width: 200,
        background: "rgba(28, 28, 40, 0.92)",
        backdropFilter: "blur(30px)",
        borderRadius: 10,
        boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
        padding: "6px 0",
        zIndex: 9999
      }}
    >
      {items.map((item, i) =>
        item === null ? (
          <div key={i} style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
        ) : (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              width: "100%", textAlign: "left", background: "none", border: "none",
              color: "white", fontSize: 13, padding: "7px 14px", cursor: "pointer",
              borderRadius: 6
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.5)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            {item.label}
          </button>
        )
      )}
    </motion.div>
  );
}

const NAV_ITEMS = [
  { label: "File", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Terminal", id: "terminal" },
  { label: "Resume", id: "resume" },
  { label: "Contact", id: "contact" }
];

export default function TopBar() {
  const { openApp, setSpotlight } = useDesktop();
  const isMobile = useIsMobileLayout();
  const [showAppleMenu, setShowAppleMenu] = useState(false);
  const [showWifiMenu, setShowWifiMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const wifiBtnRef = useRef(null);
  const appleWrapRef = useRef(null);
  const mobileNavRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);

  useEffect(() => {
    if (!isMobile) setMobileNavOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!showAppleMenu) return undefined;
    const onDoc = (e) => {
      if (appleWrapRef.current?.contains(e.target)) return;
      setShowAppleMenu(false);
    };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
  }, [showAppleMenu]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const onDoc = (e) => {
      if (mobileMenuBtnRef.current?.contains(e.target)) return;
      if (mobileNavRef.current?.contains(e.target)) return;
      setMobileNavOpen(false);
    };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
  }, [mobileNavOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (e.metaKey && e.key === " ") {
        e.preventDefault();
        setSpotlight(s => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSpotlight]);

  return (
    <div className="topbar">
      <div className="topbar-left" ref={appleWrapRef} style={{ position: "relative" }}>
        <button
          type="button"
          className="topbar-apple topbar-item"
          onClick={() => setShowAppleMenu(v => !v)}
          style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
        >
          
        </button>
        <AnimatePresence>
          {showAppleMenu && <AppleMenu onClose={() => setShowAppleMenu(false)} />}
        </AnimatePresence>

        <button
          ref={mobileMenuBtnRef}
          type="button"
          className="topbar-mobile-menu-btn"
          aria-expanded={mobileNavOpen}
          aria-label="Apps menu"
          onClick={() => setMobileNavOpen((v) => !v)}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
            <path d="M1 2h16M1 7h16M1 12h16" />
          </svg>
        </button>

        <span className="topbar-item topbar-name-short" style={{ fontWeight: 700 }}>
          Guri Gacaferi
        </span>

        <div className="topbar-nav-desktop">
          {NAV_ITEMS.map((item) => (
            <span key={item.id} className="topbar-item" onClick={() => openApp(item.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openApp(item.id)}>
              {item.label}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              ref={mobileNavRef}
              role="menu"
              aria-label="Apps"
              className="topbar-mobile-sheet"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    openApp(item.id);
                    setMobileNavOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`topbar-right${isMobile ? " topbar-clock-compact" : ""}`}>
        <span className="topbar-item" onClick={() => setSpotlight(s => !s)} title="Spotlight (⌘Space)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="white" opacity="0.85">
            <circle cx="6" cy="6" r="4.5" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
          </svg>
        </span>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <button
            ref={wifiBtnRef}
            type="button"
            className="topbar-item topbar-icon-btn"
            aria-label="Wi‑Fi"
            aria-expanded={showWifiMenu}
            onClick={() => setShowWifiMenu(v => !v)}
            style={{
              background: "none",
              border: "none",
              padding: "4px 2px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "white"
            }}
          >
            <WifiIcon />
          </button>
          <AnimatePresence>
            {showWifiMenu && (
              <WifiConnectMenu
                triggerRef={wifiBtnRef}
                onClose={() => setShowWifiMenu(false)}
                openApp={openApp}
              />
            )}
          </AnimatePresence>
        </div>
        {!isMobile && <BatteryStatus />}
        <ControlCenterIcon onClick={() => {}} />
        <Clock />
      </div>
    </div>
  );
}
