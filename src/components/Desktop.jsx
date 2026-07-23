import React, { lazy, Suspense, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TopBar from "./TopBar";
import Dock from "./Dock";
import Spotlight from "./Spotlight";
import Window from "./Window";
import { useDesktop } from "../context/DesktopContext";
import { dockApps, user } from "../configs/portfolio";
import { useIsMobileLayout } from "../hooks/useMediaQuery";

const AboutMe = lazy(() => import("./apps/AboutMe"));
const Projects = lazy(() => import("./apps/Projects"));
const Terminal = lazy(() => import("./apps/Terminal"));
const Resume = lazy(() => import("./apps/Resume"));
const Contact = lazy(() => import("./apps/Contact"));

function WindowContentFallback() {
  return (
    <div style={{ padding: 20, fontSize: 13, color: "var(--mac-text-2)" }}>
      Loading…
    </div>
  );
}

const APP_CONFIG = [
  {
    id: "about",
    title: "About — Guri Gacaferi",
    Component: AboutMe,
    defaultSize: { width: 760, height: 520 },
    defaultPosition: { x: 40, y: 44 },
    minWidth: 540,
    minHeight: 360
  },
  {
    id: "projects",
    title: "Projects",
    Component: Projects,
    defaultSize: { width: 860, height: 560 },
    defaultPosition: { x: 130, y: 78 },
    minWidth: 480,
    minHeight: 400
  },
  {
    id: "terminal",
    title: "Terminal — zsh",
    Component: Terminal,
    defaultSize: { width: 640, height: 400 },
    defaultPosition: { x: 220, y: 100 },
    minWidth: 400,
    minHeight: 280
  },
  {
    id: "resume",
    title: "Resume — Guri Gacaferi",
    Component: Resume,
    defaultSize: { width: 700, height: 540 },
    defaultPosition: { x: 160, y: 84 },
    minWidth: 440,
    minHeight: 360
  },
  {
    id: "contact",
    title: "Mail — Contact Me",
    Component: Contact,
    defaultSize: { width: 560, height: 500 },
    defaultPosition: { x: 240, y: 80 },
    minWidth: 380,
    minHeight: 320
  }
];

function DesktopHero() {
  return (
    <div className="desktop-hero" aria-hidden="true">
      <span className="desktop-hero-name">{user.name}</span>
      <span className="desktop-hero-role">{user.title} — {user.subtitle.split(" · ")[0]}</span>
    </div>
  );
}

function AvailabilityPill() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="desktop-status-pill"
      role="note"
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.55, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className="status-dot" />
      {user.lookingFor.pill}
    </motion.div>
  );
}

export default function Desktop() {
  const { openApp } = useDesktop();
  const isMobile = useIsMobileLayout();

  useEffect(() => {
    const autoOpenIds = dockApps.filter(a => a.defaultOpen).map(a => a.id);
    const ids = isMobile ? autoOpenIds.slice(0, 1) : autoOpenIds;
    const timers = ids.map((id, i) => setTimeout(() => openApp(id), 250 + i * 280));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="desktop-root" style={{ position: "relative", overflow: "hidden" }}>
      {/* Wallpaper */}
      <div className="wallpaper" />

      <DesktopHero />
      <AvailabilityPill />

      {/* Top bar */}
      <TopBar />

      {/* App windows — lazy chunks so react-pdf etc. never load until a window opens (fixes Safari / iOS) */}
      {APP_CONFIG.map((app) => {
        const C = app.Component;
        return (
          <Window
            key={app.id}
            id={app.id}
            title={app.title}
            defaultPosition={app.defaultPosition}
            defaultSize={app.defaultSize}
            minWidth={app.minWidth}
            minHeight={app.minHeight}
          >
            <Suspense fallback={<WindowContentFallback />}>
              <C />
            </Suspense>
          </Window>
        );
      })}

      {/* Dock */}
      <Dock />

      {/* Spotlight overlay */}
      <Spotlight />
    </div>
  );
}
