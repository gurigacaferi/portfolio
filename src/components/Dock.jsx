import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useDesktop } from "../context/DesktopContext";
import { dockApps } from "../configs/portfolio";
import { AppIconById } from "./DockIcons";
import { useCoarsePointer, useIsMobileLayout } from "../hooks/useMediaQuery";

const BASE_DESKTOP = 46;
const BASE_MOBILE = 48;
const MAX_DESKTOP = 60;
const MAX_MOBILE = 56;

function DockItem({ app, mouseX, baseSize, maxSize }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const { openApp, openApps, minimizedApps } = useDesktop();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const rawScale = useTransform(distance, [-110, 0, 110], [1, maxSize / baseSize, 1]);
  const scale = useSpring(rawScale, { stiffness: 360, damping: 32, mass: 0.45 });

  const isOpen = openApps[app.id] && !minimizedApps[app.id];

  const handleClick = () => {
    if (app.external) {
      window.open(app.external, "_blank", "noopener");
    } else {
      openApp(app.id);
    }
  };

  return (
    <div className="dock-item-wrapper" ref={ref}>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="dock-label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.12 }}
          >
            {app.subtitle || app.title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        style={{
          width: baseSize,
          height: baseSize,
          scale,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          transformOrigin: "bottom center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileTap={{ scale: 0.92 }}
        onClick={handleClick}
        aria-label={app.subtitle || app.title}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 11, overflow: "hidden" }}>
          <AppIconById id={app.icon || app.id} size={baseSize} />
        </div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dock-dot"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const coarse = useCoarsePointer();
  const mobile = useIsMobileLayout();
  const baseSize = mobile ? BASE_MOBILE : BASE_DESKTOP;
  const maxSize = mobile ? MAX_MOBILE : MAX_DESKTOP;

  return (
    <div
      className="dock-container"
      onPointerMove={(e) => {
        if (!coarse && e.pointerType === "mouse") mouseX.set(e.clientX);
      }}
      onPointerLeave={() => {
        if (!coarse) mouseX.set(Infinity);
      }}
    >
      {dockApps.map((app) => (
        <DockItem key={app.id} app={app} mouseX={mouseX} baseSize={baseSize} maxSize={maxSize} />
      ))}
    </div>
  );
}
