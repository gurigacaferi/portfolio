import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";

const STARTER_CODE = `// battlesnake-bot — isSafeMove() from snakeLogic.js (simplified)
// Bug report: the bot occasionally slithers off the edge of the board.
// Find the off-by-one and fix it.

function isSafeMove(x, y, boardSize) {
  return x >= 0 && x <= boardSize && y >= 0 && y <= boardSize;
}
`;

const TESTS = [
  { desc: "rejects x at the right edge (out of bounds)", run: (fn) => fn(10, 5, 10) === false },
  { desc: "rejects y at the top edge (out of bounds)",   run: (fn) => fn(5, 10, 10) === false },
  { desc: "rejects a negative coordinate",                run: (fn) => fn(-1, 3, 10) === false },
  { desc: "accepts a move in the centre of the board",    run: (fn) => fn(5, 5, 10) === true }
];

const HINT = "A board of size N has valid coordinates 0 .. N-1. Somewhere a `<=` should be a `<`.";

function extractFn(code) {
  // eslint-disable-next-line no-new-func
  return new Function(`${code}\nreturn isSafeMove;`)();
}

export default function PairProgram() {
  const [code, setCode] = useState(STARTER_CODE);
  const [results, setResults] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [running, setRunning] = useState(false);

  const runTests = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      try {
        const fn = extractFn(code);
        if (typeof fn !== "function") throw new Error("isSafeMove is not defined");
        const out = TESTS.map(t => {
          try {
            return { desc: t.desc, pass: !!t.run(fn), error: null };
          } catch (err) {
            return { desc: t.desc, pass: false, error: err.message };
          }
        });
        setResults(out);
      } catch (err) {
        setResults([{ desc: "Syntax / runtime error", pass: false, error: err.message }]);
      }
      setRunning(false);
    }, 260);
  }, [code]);

  const allPass = results && results.every(r => r.pass);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#1e1e2e" }}>
      {/* Fake VS Code tab bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 0,
        background: "#181825", borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 4px", flexShrink: 0
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px", fontSize: 12.5, color: "#cdd6f4",
          background: "#1e1e2e", borderTop: "2px solid #7c3aed"
        }}>
          <span style={{ color: "#f9e2af" }}>●</span>
          snakeLogic.js
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", padding: "0 10px" }}>
          Fix the bug — tests run in the panel below
        </span>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(v) => { setCode(v ?? ""); setResults(null); }}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 14 },
            renderLineHighlight: "none",
            wordWrap: "on"
          }}
        />
      </div>

      {/* Action bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 14px", background: "#181825",
        borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0
      }}>
        <button
          type="button"
          onClick={runTests}
          disabled={running}
          style={{
            appearance: "none", border: "none", borderRadius: 7,
            padding: "7px 16px", fontSize: 12.5, fontWeight: 600, cursor: running ? "default" : "pointer",
            color: "white",
            background: running ? "rgba(124,58,237,0.5)" : "linear-gradient(180deg,#8b5cf6,#7c3aed)"
          }}
        >
          {running ? "Running…" : "▶ Run Tests"}
        </button>
        <button
          type="button"
          onClick={() => { setCode(STARTER_CODE); setResults(null); }}
          style={{
            appearance: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7,
            padding: "7px 14px", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
            color: "rgba(255,255,255,0.75)", background: "transparent"
          }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setShowHint(h => !h)}
          style={{
            appearance: "none", border: "none", borderRadius: 7,
            padding: "7px 10px", fontSize: 12, fontWeight: 500, cursor: "pointer",
            color: "rgba(255,255,255,0.5)", background: "transparent"
          }}
        >
          {showHint ? "Hide hint" : "Need a hint?"}
        </button>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", flexShrink: 0 }}
          >
            <p style={{ margin: 0, padding: "8px 14px", fontSize: 12, color: "#f9e2af", background: "#181825" }}>
              💡 {HINT}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test panel */}
      <div style={{
        maxHeight: 150, overflowY: "auto",
        background: "#11111b", borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "10px 14px", fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
        fontSize: 12, flexShrink: 0
      }}>
        {!results && (
          <p style={{ color: "rgba(255,255,255,0.35)", margin: 0 }}>Run the tests to see results here.</p>
        )}
        {results && results.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4, color: r.pass ? "#a6e3a1" : "#f38ba8" }}>
            <span>{r.pass ? "✓" : "✗"}</span>
            <span style={{ color: r.pass ? "#a6e3a1" : "#f38ba8" }}>
              {r.desc}
              {r.error && <span style={{ color: "rgba(255,255,255,0.4)" }}> — {r.error}</span>}
            </span>
          </div>
        ))}
        {allPass && (
          <p style={{ color: "#a6e3a1", fontWeight: 600, marginTop: 6, marginBottom: 0 }}>
            All tests passing — nice work. This is basically how I ship: write it, test it, ship it.
          </p>
        )}
      </div>
    </div>
  );
}
