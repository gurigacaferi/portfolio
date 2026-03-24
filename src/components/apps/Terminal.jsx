import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { terminalCommands, user } from "../../configs/portfolio";

const PROMPT_HOST = `${user.name.toLowerCase().split(" ")[0]}@portfolio`;
const PROMPT = `${PROMPT_HOST} % `;

const WELCOME = `Last login: ${new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} on ttys000

  ██████╗ ██╗   ██╗██████╗ ██╗
 ██╔════╝ ██║   ██║██╔══██╗██║
 ██║  ███╗██║   ██║██████╔╝██║
 ██║   ██║██║   ██║██╔══██╗██║
 ╚██████╔╝╚██████╔╝██║  ██║██║
  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝

Type 'help' for available commands.
`;

function parseCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return null;
  if (cmd === "clear") return "__clear__";
  if (terminalCommands[cmd]) return terminalCommands[cmd];
  if (cmd === "ls" || cmd === "ls -la" || cmd === "ls -l") return terminalCommands.ls;
  if (cmd === "cat skills.txt" || cmd === "cat skills") return terminalCommands.skills;
  if (cmd === "cat bio.txt") return terminalCommands.whoami;
  if (cmd === "cat contact.txt" || cmd === "cat contact") return terminalCommands.contact;
  if (cmd === "pwd") return `/Users/${user.name.split(" ")[0].toLowerCase()}`;
  if (cmd === "date") return new Date().toString();
  if (cmd.startsWith("echo ")) return cmd.slice(5);
  if (cmd.startsWith("open ")) {
    const t = cmd.slice(5).trim().toLowerCase();
    if (t === "github") return `Opening ${user.github.replace(/^https?:\/\//, "")} …`;
    if (t === "linkedin") return `Opening ${user.linkedin.replace(/^https?:\/\//, "")} …`;
    if (t === "whatsapp" || t === "wa") return `Opening wa.me/${user.whatsapp.replace(/\D/g, "")} …`;
    if (t === "mail" || t === "email") return `Opening mailto:${user.email} …`;
    return `open: ${cmd.slice(5).trim()}: no handler (try: github, linkedin, whatsapp, email)`;
  }
  return `zsh: command not found: ${cmd.split(" ")[0]}\nType 'help' to see available commands.`;
}

export default function Terminal() {
  const [history, setHistory]     = useState([{ type: "welcome", text: WELCOME }]);
  const [input,   setInput]       = useState("");
  const [cmdHist, setCmdHist]     = useState([]);
  const [histIdx, setHistIdx]     = useState(-1);
  const inputRef  = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const submit = (e) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    const out = parseCommand(cmd);
    if (out === "__clear__") {
      setHistory([]); setInput("");
      setCmdHist(p => [cmd, ...p]); setHistIdx(-1);
      return;
    }
    setHistory(p => [
      ...p,
      { type: "input", text: cmd },
      ...(out ? [{ type: "output", text: out }] : [])
    ]);
    setCmdHist(p => [cmd, ...p]); setHistIdx(-1); setInput("");
  };

  const onKey = (e) => {
    if (e.key === "ArrowUp")   { e.preventDefault(); const i = Math.min(histIdx + 1, cmdHist.length - 1); setHistIdx(i); setInput(cmdHist[i] || ""); }
    if (e.key === "ArrowDown") { e.preventDefault(); const i = Math.max(histIdx - 1, -1); setHistIdx(i); setInput(i === -1 ? "" : cmdHist[i]); }
    if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setHistory([]); }
  };

  return (
    <div
      className="terminal-screen"
      onClick={() => inputRef.current?.focus()}
      style={{ cursor: "text", height: "100%", overflowY: "auto" }}
    >
      {history.map((entry, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.08 }}>
          {entry.type === "welcome" && (
            <pre style={{ color: "#6c91c2", fontSize: 11, lineHeight: 1.3, marginBottom: 6, fontFamily: "inherit" }}>
              {entry.text}
            </pre>
          )}
          {entry.type === "input" && (
            <div style={{ marginBottom: 1 }}>
              <span className="terminal-prompt">{PROMPT}</span>
              <span className="terminal-cmd">{entry.text}</span>
            </div>
          )}
          {entry.type === "output" && (
            <pre className="terminal-output" style={{ marginBottom: 8, marginLeft: 0 }}>
              {entry.text}
            </pre>
          )}
        </motion.div>
      ))}

      <form onSubmit={submit} style={{ display: "flex", alignItems: "center" }}>
        <span className="terminal-prompt">{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          autoFocus
          spellCheck={false}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "#cdd6f4", fontFamily: "inherit", fontSize: "inherit", caretColor: "#a6e3a1"
          }}
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}
