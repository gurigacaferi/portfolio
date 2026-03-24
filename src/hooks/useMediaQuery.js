import { useState, useEffect } from "react";

/**
 * Subscribes to a CSS media query; updates on match changes (orientation, resize).
 */
export function useMediaQuery(query) {
  const getMatches = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, [query]);

  return matches;
}

export const MOBILE_MAX_WIDTH = 768;

export function useIsMobileLayout() {
  return useMediaQuery(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
}

export function useCoarsePointer() {
  return useMediaQuery("(pointer: coarse)");
}
