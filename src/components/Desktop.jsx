import React from "react";
import TopBar from "./TopBar";
import Dock from "./Dock";
import Spotlight from "./Spotlight";
import Window from "./Window";
import AboutMe from "./apps/AboutMe";
import Projects from "./apps/Projects";
import Terminal from "./apps/Terminal";
import Resume from "./apps/Resume";
import Contact from "./apps/Contact";

const APP_CONFIG = [
  {
    id: "about",
    title: "About — Guri Gacaferi",
    component: <AboutMe />,
    defaultSize: { width: 760, height: 520 },
    defaultPosition: { x: 40, y: 44 },
    minWidth: 540,
    minHeight: 360
  },
  {
    id: "projects",
    title: "Projects",
    component: <Projects />,
    defaultSize: { width: 860, height: 560 },
    defaultPosition: { x: 100, y: 64 },
    minWidth: 480,
    minHeight: 400
  },
  {
    id: "terminal",
    title: "Terminal — zsh",
    component: <Terminal />,
    defaultSize: { width: 640, height: 400 },
    defaultPosition: { x: 220, y: 100 },
    minWidth: 400,
    minHeight: 280
  },
  {
    id: "resume",
    title: "Resume — Guri Gacaferi",
    component: <Resume />,
    defaultSize: { width: 700, height: 540 },
    defaultPosition: { x: 160, y: 84 },
    minWidth: 440,
    minHeight: 360
  },
  {
    id: "contact",
    title: "Mail — Contact Me",
    component: <Contact />,
    defaultSize: { width: 560, height: 500 },
    defaultPosition: { x: 240, y: 80 },
    minWidth: 380,
    minHeight: 320
  }
];


export default function Desktop() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
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

      {/* App windows */}
      {APP_CONFIG.map((app) => (
        <Window
          key={app.id}
          id={app.id}
          title={app.title}
          defaultPosition={app.defaultPosition}
          defaultSize={app.defaultSize}
          minWidth={app.minWidth}
          minHeight={app.minHeight}
        >
          {app.component}
        </Window>
      ))}

      {/* Dock */}
      <Dock />

      {/* Spotlight overlay */}
      <Spotlight />
    </div>
  );
}
