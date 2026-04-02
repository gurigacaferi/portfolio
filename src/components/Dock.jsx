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

  const peakScale = maxSize / baseSize;
  const influencePx = 135;
  const rawScale = useTransform(distance, (d) => {
    if (!Number.isFinite(d)) return 1;
    const t = Math.min(1, Math.abs(d) / influencePx);
    const falloff = 1 - t * t;
    return 1 + (peakScale - 1) * falloff;
  });
  const scale = useSpring(rawScale, {
    stiffness: 140,
    damping: 22,
    mass: 0.55
  });

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
      <motion.div
        style={{
          scale,
          transformOrigin: "bottom center",
          width: baseSize,
          height: baseSize
        }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          style={{
            width: "100%",
            height: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderRadius: 12
          }}
          onClick={handleClick}
          title={app.subtitle || app.title}
        >
          <DockTooltip label={app.subtitle || app.title} />
          <div style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden" }}>
            <AppIconById id={app.icon || app.id} size={baseSize} />
          </div>
        </motion.button>
      </motion.div>
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
  return <div className="dock-label">{label}</div>;
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
