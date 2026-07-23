import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { terminalCommands, projectNotes, user } from "../../configs/portfolio";
import { useDesktop } from "../../context/DesktopContext";

const PROMPT_HOST = `${user.name.toLowerCase().split(" ")[0]}@portfolio`;
const PROMPT = `${PROMPT_HOST} % `;

const APP_IDS = ["about", "projects", "terminal", "code", "fatural", "timemachine", "resume", "contact"];

const WELCOME = `Last login: ${new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} on ttys000

  ██████╗ ██╗   ██╗██████╗ ██╗
 ██╔════╝ ██║   ██║██╔══██╗██║
 ██║  ███╗██║   ██║██████╔╝██║
 ██║   ██║██║   ██║██╔══██╗██║
 ╚██████╔╝╚██████╔╝██║  ██║██║
  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝

Type 'help' for available commands. Try 'deploy fatural', or 'open projects'.
`;

/* Animated "green checks" CI log for `deploy fatural` — each line lands with its own delay. */
const CI_SEQUENCE = [
  { text: "Running CI pipeline for fatural…", delay: 150 },
  { text: "  ✓ lint             (1.2s)", delay: 380 },
  { text: "  ✓ unit tests        (2.8s)", delay: 420 },
  { text: "  ✓ build             (4.1s)", delay: 480 },
  { text: "  ✓ security scan     (1.6s)", delay: 380 },
  { text: "Deploying to production…", delay: 320 },
  { text: "  ✓ api-gateway       → healthy", delay: 260 },
  { text: "  ✓ ocr-worker        → healthy", delay: 220 },
  { text: "  ✓ invoice-service   → healthy", delay: 220 },
  { text: "  ✓ qbo-sync          → healthy", delay: 260 },
  { text: "✓ Deployed fatural to production — 0 downtime, 6/6 services healthy.", delay: 320 }
];

const RM_RF_PATTERN = /^(sudo\s+)?rm\s+-rf\s+\/\s*$/;

function parseCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return null;
  if (cmd === "clear") return "__clear__";
  if (cmd === "kubectl get pods" || cmd === "kubectl get pods -n fatural") return terminalCommands.kubectl;
  if (cmd === "spin -run block.pml" || cmd === "spin -run block.pml -a") return terminalCommands.spin;
  if (terminalCommands[cmd]) return terminalCommands[cmd];
  if (cmd === "ls" || cmd === "ls -la" || cmd === "ls -l") return terminalCommands.ls;
  if (cmd === "cat skills.txt" || cmd === "cat skills") return terminalCommands.skills;
  if (cmd === "cat bio.txt") return terminalCommands.whoami;
  if (cmd === "cat contact.txt" || cmd === "cat contact") return terminalCommands.contact;
  if (cmd.startsWith("cat ")) {
    const slug = cmd.slice(4).trim().replace(/\/$/, "").replace(/\.md$/, "");
    if (projectNotes[slug]) return projectNotes[slug];
    return `cat: ${cmd.slice(4).trim()}: No such file or directory\nType 'ls' to see available projects.`;
  }
  if (cmd === "pwd") return `/Users/${user.name.split(" ")[0].toLowerCase()}`;
  if (cmd === "date") return new Date().toString();
  if (cmd.startsWith("echo ")) return cmd.slice(5);
  return `zsh: command not found: ${cmd.split(" ")[0]}\nType 'help' to see available commands.`;
}

export default function Terminal() {
  const { openApp } = useDesktop();
  const [history, setHistory]     = useState([{ type: "welcome", text: WELCOME }]);
  const [input,   setInput]       = useState("");
  const [cmdHist, setCmdHist]     = useState([]);
  const [histIdx, setHistIdx]     = useState(-1);
  const inputRef  = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const runOpen = (target) => {
    const t = target.toLowerCase();
    if (APP_IDS.includes(t)) {
      openApp(t);
      return `Opening ${t} …`;
    }
    if (t === "github") {
      window.open(user.github, "_blank", "noopener");
      return `Opening ${user.github.replace(/^https?:\/\//, "")} …`;
    }
    if (t === "linkedin") {
      window.open(user.linkedin, "_blank", "noopener");
      return `Opening ${user.linkedin.replace(/^https?:\/\//, "")} …`;
    }
    if (t === "whatsapp" || t === "wa") {
      const num = user.whatsapp.replace(/\D/g, "");
      window.open(`https://wa.me/${num}`, "_blank", "noopener");
      return `Opening wa.me/${num} …`;
    }
    if (t === "mail" || t === "email") {
      window.location.href = `mailto:${user.email}`;
      return `Opening mailto:${user.email} …`;
    }
    return `open: ${target}: no handler (try: about, projects, terminal, code, fatural, timemachine, resume, contact, github, linkedin, whatsapp, email)`;
  };

  const pushCommand = (cmd, out) => {
    setHistory(p => [
      ...p,
      { type: "input", text: cmd },
      ...(out ? [{ type: "output", text: out }] : [])
    ]);
    setCmdHist(p => [cmd, ...p]); setHistIdx(-1); setInput("");
  };

  const runDeploySequence = (cmd) => {
    setHistory(p => [...p, { type: "input", text: cmd }]);
    setCmdHist(p => [cmd, ...p]); setHistIdx(-1); setInput("");
    let delay = 0;
    CI_SEQUENCE.forEach((line) => {
      delay += line.delay;
      setTimeout(() => {
        setHistory(p => [...p, { type: "output", text: line.text }]);
      }, delay);
    });
  };

  const runCommand = () => {
    const cmd = input.trim();
    if (!cmd) return;
    const lower = cmd.toLowerCase();

    // Easter egg: a "destructive" command is the trigger for Konami-style desktop glitch mode.
    if (RM_RF_PATTERN.test(lower)) {
      window.dispatchEvent(new Event("guri:glitch"));
      pushCommand(cmd, "rm: it's dangerous to operate recursively on '/'\nrm: use --no-preserve-root to override this failsafe\n\n...just kidding. Nice try.");
      return;
    }

    if (lower === "deploy fatural") {
      runDeploySequence(cmd);
      return;
    }

    const out = lower.startsWith("open ")
      ? runOpen(cmd.slice(5).trim())
      : parseCommand(cmd);

    if (out === "__clear__") {
      setHistory([]); setInput("");
      setCmdHist(p => [cmd, ...p]); setHistIdx(-1);
      return;
    }
    pushCommand(cmd, out);
  };

  const onKey = (e) => {
    if (e.key === "Enter")     { e.preventDefault(); runCommand(); }
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

      <form onSubmit={(e) => { e.preventDefault(); runCommand(); }} style={{ display: "flex", alignItems: "center" }}>
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
