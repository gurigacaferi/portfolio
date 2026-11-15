import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";

const STARTER_CODE = `// battlesnake-bot: isSafeMove() from snakeLogic.js (simplified)
// Bug report: the bot occasionally slithers off the edge of the board.
// Find the off-by-one and fix it.

function isSafeMove(x, y, boardSize) {
  return x >= 0 && x <= boardSize && y >= 0 && y <= boardSize;
}
`;

const TESTS = [
  { desc: "rejects x at the right edge (out of bounds)", run: (fn) => fn(10, 5, 10) === false },
  { desc: "rejects y at the top edge (out of bounds)",   run: (fn) => fn(5, 10, 10) === false },
  { desc: "rejects a negative coordinate",               run: (fn) => fn(-1, 3, 10) === false },
  { desc: "accepts a move in the centre of the board",   run: (fn) => fn(5, 5, 10) === true }
];

const HINT = "A board of size N has valid coordinates 0 .. N-1. Replace `<=` with `<` on the upper bounds.";

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
    }, 220);
  }, [code]);

  const allPass = results && results.every(r => r.pass);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#141519" }}>
      {/* Editor tab bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        background: "#0f1014",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 6px",
        flexShrink: 0
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 14px",
          fontSize: 12,
          fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
          color: "#e4e4e7",
          background: "#141519",
          borderTop: "1.5px solid #e4e4e7"
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a1a1aa" }} />
          snakeLogic.js
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", padding: "0 10px" }}>
          Fix the off-by-one · Run the test suite below
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
            fontSize: 12.5,
            fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
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
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        background: "#0f1014",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0
      }}>
        <button
          type="button"
          onClick={runTests}
          disabled={running}
          style={{
            appearance: "none",
            border: "none",
            borderRadius: 6,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: running ? "default" : "pointer",
            color: "#09090b",
            background: running ? "rgba(244,244,245,0.65)" : "#f4f4f5"
          }}
        >
          {running ? "Running…" : "Run Tests"}
        </button>
        <button
          type="button"
          onClick={() => { setCode(STARTER_CODE); setResults(null); }}
          style={{
            appearance: "none",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 6,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "inherit",
            cursor: "pointer",
            color: "#d4d4d8",
            background: "transparent"
          }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setShowHint(h => !h)}
          style={{
            appearance: "none",
            border: "none",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "inherit",
            cursor: "pointer",
            color: "#a1a1aa",
            background: "transparent"
          }}
        >
          {showHint ? "Hide hint" : "Hint"}
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
            <p style={{ margin: 0, padding: "8px 14px", fontSize: 12, color: "#d4d4d8", background: "#141519", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              Hint: {HINT}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test panel */}
      <div style={{
        maxHeight: 150,
        overflowY: "auto",
        background: "#0b0c0f",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "10px 14px",
        fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
        fontSize: 12,
        flexShrink: 0
      }}>
        {!results && (
          <p style={{ color: "#71717a", margin: 0 }}>Test output will appear here.</p>
        )}
        {results && results.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4, color: r.pass ? "#4ade80" : "#f87171" }}>
            <span>{r.pass ? "✓" : "✗"}</span>
            <span>
              {r.desc}
              {r.error && <span style={{ color: "#71717a" }}> ({r.error})</span>}
            </span>
          </div>
        ))}
        {allPass && (
          <p style={{ color: "#e4e4e7", fontWeight: 500, marginTop: 6, marginBottom: 0 }}>
            4/4 passing.
          </p>
        )}
      </div>
    </div>
  );
}
