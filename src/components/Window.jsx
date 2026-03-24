import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktop } from "../context/DesktopContext";

export default function Window({ id, title, children, defaultPosition, defaultSize, minWidth = 420, minHeight = 300 }) {
  const { openApps, minimizedApps, maximizedApps, zIndexMap, closeApp, minimizeApp, toggleMaximize, bringToFront } = useDesktop();

  const isOpen = openApps[id];
  const isMin  = minimizedApps[id];
  const isMax  = maximizedApps[id];
  const zIndex = zIndexMap[id] || 10;

  const [pos,  setPos]  = useState(defaultPosition || { x: 80, y: 50 });
  const [size, setSize] = useState(defaultSize     || { width: 700, height: 500 });
  const [hoverTL, setHoverTL] = useState(false);

  const dragStart   = useRef(null);
  const resizeStart = useRef(null);

  const handleTitlebarPointerDown = useCallback((e) => {
    if (isMax || e.target.closest("button")) return;
    e.preventDefault();
    bringToFront(id);
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, origX: pos.x, origY: pos.y };
    const onMove = (ev) => {
      setPos({
        x: Math.max(0, dragStart.current.origX + ev.clientX - dragStart.current.mouseX),
        y: Math.max(28, dragStart.current.origY + ev.clientY - dragStart.current.mouseY)
      });
    };
    const onUp = () => {
      dragStart.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [id, isMax, pos.x, pos.y, bringToFront]);

  const handleResizePointerDown = useCallback((e, dir) => {
    e.preventDefault(); e.stopPropagation();
    bringToFront(id);
    resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, origW: size.width, origH: size.height, origX: pos.x, origY: pos.y, dir };
    const onMove = (ev) => {
      const { mouseX, mouseY, origW, origH, origX, origY, dir: d } = resizeStart.current;
      const dx = ev.clientX - mouseX, dy = ev.clientY - mouseY;
      let w = origW, h = origH, x = origX, y = origY;
      if (d.includes("e")) w = Math.max(minWidth, origW + dx);
      if (d.includes("s")) h = Math.max(minHeight, origH + dy);
      if (d.includes("w")) { w = Math.max(minWidth, origW - dx); x = origX + (origW - w); }
      if (d.includes("n")) { h = Math.max(minHeight, origH - dy); y = origY + (origH - h); }
      setSize({ width: w, height: h }); setPos({ x, y });
    };
    const onUp = () => {
      resizeStart.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [id, size, pos, minWidth, minHeight, bringToFront]);

  const style = isMax
    ? { x: 0, y: 28, w: "100vw", h: "calc(100vh - 28px - 82px)" }
    : { x: pos.x, y: pos.y, w: size.width, h: size.height };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="window"
          style={{
            position: "fixed", left: style.x, top: style.y,
            width: style.w, height: style.h, zIndex,
            display: "flex", flexDirection: "column",
            pointerEvents: isMin ? "none" : "auto"
          }}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: isMin ? 0 : 1, scale: isMin ? 0.5 : 1, y: isMin ? window.innerHeight - pos.y : 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: "spring", damping: 30, stiffness: 380 }}
          onPointerDown={() => bringToFront(id)}
        >
          {/* Resize handles */}
          {!isMax && [
            { dir:"n",  s:{ top:0,    left:4,    right:4,   height:4,  cursor:"n-resize"  } },
            { dir:"s",  s:{ bottom:0, left:4,    right:4,   height:4,  cursor:"s-resize"  } },
            { dir:"e",  s:{ right:0,  top:4,     bottom:4,  width:4,   cursor:"e-resize"  } },
            { dir:"w",  s:{ left:0,   top:4,     bottom:4,  width:4,   cursor:"w-resize"  } },
            { dir:"ne", s:{ top:0,    right:0,   width:8,   height:8,  cursor:"ne-resize" } },
            { dir:"nw", s:{ top:0,    left:0,    width:8,   height:8,  cursor:"nw-resize" } },
            { dir:"se", s:{ bottom:0, right:0,   width:8,   height:8,  cursor:"se-resize" } },
            { dir:"sw", s:{ bottom:0, left:0,    width:8,   height:8,  cursor:"sw-resize" } },
          ].map(({ dir, s }) => (
            <div key={dir} style={{ position:"absolute", zIndex:20, ...s }} onPointerDown={e => handleResizePointerDown(e, dir)} />
          ))}

          {/* ── Title bar ── */}
          <div
            className="window-titlebar"
            onPointerDown={handleTitlebarPointerDown}
            onDoubleClick={() => toggleMaximize(id)}
          >
            {/* Traffic lights */}
            <div
              className="traffic-lights-group"
              onMouseEnter={() => setHoverTL(true)}
              onMouseLeave={() => setHoverTL(false)}
            >
              <button
                type="button"
                className="traffic-light close"
                aria-label="Close window"
                onPointerDown={e => { e.stopPropagation(); bringToFront(id); }}
                onClick={e => { e.stopPropagation(); closeApp(id); }}
              >
                {hoverTL && <span className="traffic-icon">✕</span>}
              </button>
              <button
                type="button"
                className="traffic-light minimize"
                aria-label="Minimize window"
                onPointerDown={e => { e.stopPropagation(); bringToFront(id); }}
                onClick={e => { e.stopPropagation(); minimizeApp(id); }}
              >
                {hoverTL && <span className="traffic-icon">−</span>}
              </button>
              <button
                type="button"
                className="traffic-light maximize"
                aria-label={isMax ? "Restore window" : "Maximize window"}
                onPointerDown={e => { e.stopPropagation(); bringToFront(id); }}
                onClick={e => { e.stopPropagation(); toggleMaximize(id); }}
              >
                {hoverTL && <span className="traffic-icon">⤢</span>}
              </button>
            </div>
            <span className="window-title">{title}</span>
          </div>

          {/* ── Content ── */}
          <div className="window-content">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
