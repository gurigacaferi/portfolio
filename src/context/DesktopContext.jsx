import React, { createContext, useContext, useState, useCallback } from "react";

const DesktopContext = createContext(null);

export function DesktopProvider({ children }) {
  const [openApps, setOpenApps] = useState({});
  const [minimizedApps, setMinimizedApps] = useState({});
  const [maximizedApps, setMaximizedApps] = useState({});
  const [zIndexMap, setZIndexMap] = useState({});
  const [, setTopZ] = useState(10);
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

  return (
    <DesktopContext.Provider value={{
      openApps,
      minimizedApps,
      maximizedApps,
      zIndexMap,
      spotlight,
      openApp,
      closeApp,
      minimizeApp,
      toggleMaximize,
      bringToFront,
      setSpotlight
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
