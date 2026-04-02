import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useDesktop } from "../context/DesktopContext";
import { dockApps } from "../configs/portfolio";
import { AppIconById } from "./DockIcons";
import { useCoarsePointer, useIsMobileLayout } from "../hooks/useMediaQuery";

const BASE_DESKTOP = 52;
const BASE_MOBILE = 56;
const MAX_DESKTOP = 80;
const MAX_MOBILE = 72;

function DockItem({ app, mouseX, baseSize, maxSize }) {
  const ref = useRef(null);
  const { openApp, openApps, minimizedApps } = useDesktop();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const rawScale = useTransform(distance, [-120, 0, 120], [1, maxSize / baseSize, 1]);
  const scale = useSpring(rawScale, { stiffness: 300, damping: 28, mass: 0.5 });

  const isOpen = openApps[app.id] && !minimizedApps[app.id];

  const handleClick = () => {
    if (app.external) {
      window.open(app.external, "_blank");
    } else {
      openApp(app.id);
    }
  };

  return (
    <div className="dock-item-wrapper" ref={ref}>
      <motion.button
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
        whileTap={{ scale: 0.88 }}
        onClick={handleClick}
        title={app.subtitle || app.title}
      >
        <DockTooltip label={app.subtitle || app.title} />
        <motion.div
          style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden" }}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <AppIconById id={app.icon || app.id} size={baseSize} />
        </motion.div>
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

function DockTooltip({ label }) {
  return (
    <motion.div
      className="dock-label"
      initial={{ opacity: 0, y: 4 }}
      whileHover={{ opacity: 1, y: 0 }}
      style={{ opacity: 0 }}
    >
      {label}
    </motion.div>
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
