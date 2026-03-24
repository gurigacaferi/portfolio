import React, { createContext, useContext, useState, useCallback } from "react";

const DesktopContext = createContext(null);

const DEFAULT_POSITIONS = {
  about: { x: 60, y: 40 },
  projects: { x: 120, y: 60 },
  terminal: { x: 180, y: 80 },
  resume: { x: 240, y: 60 },
  contact: { x: 300, y: 50 }
};

const DEFAULT_SIZES = {
  about: { width: 760, height: 520 },
  projects: { width: 860, height: 560 },
  terminal: { width: 640, height: 400 },
  resume: { width: 700, height: 540 },
  contact: { width: 560, height: 440 }
};

export function DesktopProvider({ children }) {
  const [openApps, setOpenApps] = useState({});
  const [minimizedApps, setMinimizedApps] = useState({});
  const [maximizedApps, setMaximizedApps] = useState({});
  const [zIndexMap, setZIndexMap] = useState({});
  const [topZ, setTopZ] = useState(10);
  const [dark, setDark] = useState(true);
  const [spotlight, setSpotlight] = useState(false);

  const bringToFront = useCallback((id) => {
    setTopZ(z => {
      const next = z + 1;
      setZIndexMap(prev => ({ ...prev, [id]: next }));
      return next;
    });
  }, []);

  const openApp = useCallback((id) => {
    setOpenApps(prev => ({ ...prev, [id]: true }));
    setMinimizedApps(prev => ({ ...prev, [id]: false }));
    bringToFront(id);
  }, [bringToFront]);

  const closeApp = useCallback((id) => {
    setOpenApps(prev => ({ ...prev, [id]: false }));
    setMaximizedApps(prev => ({ ...prev, [id]: false }));
  }, []);

  const minimizeApp = useCallback((id) => {
    setMinimizedApps(prev => ({ ...prev, [id]: true }));
  }, []);

  const toggleMaximize = useCallback((id) => {
    setMaximizedApps(prev => ({ ...prev, [id]: !prev[id] }));
    bringToFront(id);
  }, [bringToFront]);

  const toggleDark = useCallback(() => {
    setDark(d => !d);
  }, []);

  return (
    <DesktopContext.Provider value={{
      openApps,
      minimizedApps,
      maximizedApps,
      zIndexMap,
      dark,
      spotlight,
      openApp,
      closeApp,
      minimizeApp,
      toggleMaximize,
      bringToFront,
      toggleDark,
      setSpotlight,
      DEFAULT_POSITIONS,
      DEFAULT_SIZES
    }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used within DesktopProvider");
  return ctx;
}
