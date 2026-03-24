import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktop } from "../context/DesktopContext";
import { useCoarsePointer, useIsMobileLayout } from "../hooks/useMediaQuery";

const TOPBAR_FALLBACK = 28;
/** Bottom chrome for clamping (dock + margin; approximate on mobile incl. safe area). */
function dockBottomPx(isMobile) {
  return isMobile ? 96 : 82;
}

export default function Window({ id, title, children, defaultPosition, defaultSize, minWidth = 420, minHeight = 300 }) {
  const { openApps, minimizedApps, maximizedApps, zIndexMap, closeApp, minimizeApp, toggleMaximize, bringToFront } = useDesktop();

  const isMobile = useIsMobileLayout();
  const coarsePointer = useCoarsePointer();

  const isOpen = openApps[id];
  const isMin = minimizedApps[id];
  const isMax = maximizedApps[id];
  const zIndex = zIndexMap[id] || 10;

  const [pos, setPos] = useState(defaultPosition || { x: 80, y: 50 });
  const [size, setSize] = useState(defaultSize || { width: 700, height: 500 });
  const [hoverTL, setHoverTL] = useState(false);
  const [topBarH, setTopBarH] = useState(TOPBAR_FALLBACK);

  const dragStart = useRef(null);
  const resizeStart = useRef(null);
  const doubleTapRef = useRef(0);

  useEffect(() => {
    const el = document.querySelector(".topbar");
    if (!el) return undefined;
    const sync = () => setTopBarH(Math.max(TOPBAR_FALLBACK, el.getBoundingClientRect().height));
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  const clampToViewport = useCallback(
    (x, y, w, h) => {
      const pad = 4;
      const topMin = topBarH + pad;
      const d = dockBottomPx(isMobile);
      const maxW = window.innerWidth - pad * 2;
      const maxH = window.innerHeight - topMin - d - pad;
      const cw = Math.min(Math.max(w, isMobile ? 260 : minWidth), maxW);
      const ch = Math.min(Math.max(h, isMobile ? 200 : minHeight), maxH);
      const cx = Math.min(Math.max(pad, x), Math.max(pad, window.innerWidth - cw - pad));
      const cy = Math.min(Math.max(topMin, y), Math.max(topMin, window.innerHeight - ch - d - pad));
      return { x: cx, y: cy, width: cw, height: ch };
    },
    [isMobile, minWidth, minHeight, topBarH]
  );

  const fitMobileLayout = useCallback(() => {
    const pad = 8;
    const d = dockBottomPx(true);
    const tb = Math.max(TOPBAR_FALLBACK, document.querySelector(".topbar")?.getBoundingClientRect().height ?? topBarH);
    const top = tb + pad;
    const availW = window.innerWidth - pad * 2;
    const availH = window.innerHeight - top - d - pad;
    const next = clampToViewport(pad, top, availW, availH);
    setPos({ x: next.x, y: next.y });
    setSize({ width: next.width, height: next.height });
  }, [clampToViewport, topBarH]);

  useEffect(() => {
    if (!isOpen || !isMobile || isMax) return undefined;
    fitMobileLayout();
    const onResize = () => fitMobileLayout();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen, isMobile, isMax, fitMobileLayout]);

  const handleTitlebarPointerDown = useCallback(
    (e) => {
      if (isMax || e.target.closest("button")) return;
      if (e.button === 2) return;
      e.preventDefault();
      bringToFront(id);

      const startX = e.clientX;
      const startY = e.clientY;
      let moved = false;
      dragStart.current = { mouseX: startX, mouseY: startY, origX: pos.x, origY: pos.y };
      const pid = e.pointerId;
      const el = e.currentTarget;
      try {
        el.setPointerCapture(pid);
      } catch (_) {
        /* noop */
      }

      const onMove = (ev) => {
        if (Math.abs(ev.clientX - startX) > 6 || Math.abs(ev.clientY - startY) > 6) moved = true;
        const nextX = dragStart.current.origX + ev.clientX - dragStart.current.mouseX;
        const nextY = dragStart.current.origY + ev.clientY - dragStart.current.mouseY;
        const c = clampToViewport(nextX, nextY, size.width, size.height);
        setPos({ x: c.x, y: c.y });
      };

      const onUp = (ev) => {
        try {
          el.releasePointerCapture(pid);
        } catch (_) {
          /* noop */
        }
        dragStart.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);

        if (!isMax && !moved && ev.pointerType === "touch") {
          const now = Date.now();
          if (now - doubleTapRef.current < 340) {
            toggleMaximize(id);
            doubleTapRef.current = 0;
          } else {
            doubleTapRef.current = now;
          }
        }
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [id, isMax, pos.x, pos.y, size.width, size.height, bringToFront, clampToViewport, toggleMaximize]
  );

  const handleResizePointerDown = useCallback(
    (e, dir) => {
      e.preventDefault();
      e.stopPropagation();
      bringToFront(id);
      resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, origW: size.width, origH: size.height, origX: pos.x, origY: pos.y, dir };
      const pid = e.pointerId;
      const el = e.currentTarget;
      try {
        el.setPointerCapture(pid);
      } catch (_) {
        /* noop */
      }

      const onMove = (ev) => {
        const { mouseX, mouseY, origW, origH, origX, origY, dir: d } = resizeStart.current;
        const dx = ev.clientX - mouseX;
        const dy = ev.clientY - mouseY;
        let w = origW;
        let h = origH;
        let x = origX;
        let y = origY;
        if (d.includes("e")) w = Math.max(minWidth, origW + dx);
        if (d.includes("s")) h = Math.max(minHeight, origH + dy);
        if (d.includes("w")) {
          w = Math.max(minWidth, origW - dx);
          x = origX + (origW - w);
        }
        if (d.includes("n")) {
          h = Math.max(minHeight, origH - dy);
          y = origY + (origH - h);
        }
        const c = clampToViewport(x, y, w, h);
        setSize({ width: c.width, height: c.height });
        setPos({ x: c.x, y: c.y });
      };

      const onUp = () => {
        try {
          el.releasePointerCapture(pid);
        } catch (_) {
          /* noop */
        }
        resizeStart.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [id, size, pos, minWidth, minHeight, bringToFront, clampToViewport]
  );

  const dockOuterPx = isMobile ? 78 : 82;
  const style = isMax
    ? {
        x: 0,
        y: topBarH,
        w: "100vw",
        h: isMobile
          ? `calc(100dvh - ${topBarH}px - ${dockOuterPx}px - env(safe-area-inset-bottom, 0px))`
          : `calc(100dvh - ${topBarH}px - ${dockOuterPx}px)`
      }
    : { x: pos.x, y: pos.y, w: size.width, h: size.height };

  const edge = isMobile || coarsePointer ? 14 : 4;
  const corner = isMobile || coarsePointer ? 22 : 8;

  const resizeHandles = !isMax
    ? [
        { dir: "n", s: { top: 0, left: corner, right: corner, height: edge, cursor: "n-resize" } },
        { dir: "s", s: { bottom: 0, left: corner, right: corner, height: edge, cursor: "s-resize" } },
        { dir: "e", s: { right: 0, top: corner, bottom: corner, width: edge, cursor: "e-resize" } },
        { dir: "w", s: { left: 0, top: corner, bottom: corner, width: edge, cursor: "w-resize" } },
        { dir: "ne", s: { top: 0, right: 0, width: corner, height: corner, cursor: "ne-resize" } },
        { dir: "nw", s: { top: 0, left: 0, width: corner, height: corner, cursor: "nw-resize" } },
        { dir: "se", s: { bottom: 0, right: 0, width: corner, height: corner, cursor: "se-resize" } },
        { dir: "sw", s: { bottom: 0, left: 0, width: corner, height: corner, cursor: "sw-resize" } }
      ]
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`window${isMobile ? " window--mobile" : ""}`}
          style={{
            position: "fixed",
            left: style.x,
            top: style.y,
            width: style.w,
            height: style.h,
            zIndex,
            display: "flex",
            flexDirection: "column",
            pointerEvents: isMin ? "none" : "auto"
          }}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: isMin ? 0 : 1, scale: isMin ? 0.5 : 1, y: isMin ? window.innerHeight - pos.y : 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: "spring", damping: 30, stiffness: 380 }}
          onPointerDown={() => bringToFront(id)}
        >
          {resizeHandles.map(({ dir, s }) => (
            <div
              key={dir}
              className="window-resize-handle"
              style={{ position: "absolute", zIndex: 20, touchAction: "none", ...s }}
              onPointerDown={(e) => handleResizePointerDown(e, dir)}
            />
          ))}

          <div
            className="window-titlebar"
            onPointerDown={handleTitlebarPointerDown}
            onDoubleClick={() => toggleMaximize(id)}
          >
            <div
              className="traffic-lights-group"
              onMouseEnter={() => setHoverTL(true)}
              onMouseLeave={() => setHoverTL(false)}
            >
              <button
                type="button"
                className="traffic-light close"
                aria-label="Close window"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  bringToFront(id);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  closeApp(id);
                }}
              >
                {(hoverTL || coarsePointer) && <span className="traffic-icon">✕</span>}
              </button>
              <button
                type="button"
                className="traffic-light minimize"
                aria-label="Minimize window"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  bringToFront(id);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeApp(id);
                }}
              >
                {(hoverTL || coarsePointer) && <span className="traffic-icon">−</span>}
              </button>
              <button
                type="button"
                className="traffic-light maximize"
                aria-label={isMax ? "Restore window" : "Maximize window"}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  bringToFront(id);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximize(id);
                }}
              >
                {(hoverTL || coarsePointer) && <span className="traffic-icon">⤢</span>}
              </button>
            </div>
            <span className="window-title">{title}</span>
          </div>

          <div className="window-content">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
