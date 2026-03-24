import React, { lazy, Suspense } from "react";
import TopBar from "./TopBar";
import Dock from "./Dock";
import Spotlight from "./Spotlight";
import Window from "./Window";

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
    defaultPosition: { x: 100, y: 64 },
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

export default function Desktop() {
  return (
    <div className="desktop-root" style={{ position: "relative", overflow: "hidden" }}>
      {/* Wallpaper */}
      <div className="wallpaper" />

      {/* Wallpaper text */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        pointerEvents: "none", userSelect: "none"
      }}>
        <span style={{
          fontSize: "clamp(28px, 5vw, 56px)",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: "rgba(255,255,255,0.18)",
          textShadow: "0 2px 12px rgba(0,0,0,0.15)"
        }}>
          Guri — Portfolio
        </span>
      </div>

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
