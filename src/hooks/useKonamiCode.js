import { useEffect, useRef } from "react";

const SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

/** Classic Konami code listener. Calls onComplete() once the full sequence is typed anywhere on the page. */
export function useKonamiCode(onComplete) {
  const idxRef = useRef(0);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = SEQUENCE[idxRef.current];
      if (key === expected) {
        idxRef.current += 1;
        if (idxRef.current === SEQUENCE.length) {
          idxRef.current = 0;
          onComplete();
        }
      } else {
        idxRef.current = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onComplete]);
}
