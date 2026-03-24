import React from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   All icons use the macOS squircle shape (rounded-rect with ~26% corner radius)
   and layered gradients/shadows to match Big Sur / Sonoma visual language.
───────────────────────────────────────────────────────────────────────────── */

const SQ = ({ children, size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block" }}>
    {children}
  </svg>
);

/* macOS Finder — classic blue face */
export function FinderIcon() {
  return (
    <SQ>
      <defs>
        <linearGradient id="fi-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#63b4f6" />
          <stop offset="100%" stopColor="#1b6fd8" />
        </linearGradient>
        <linearGradient id="fi-face-l" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#85cafd" />
          <stop offset="100%" stopColor="#4facf5" />
        </linearGradient>
        <linearGradient id="fi-face-r" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1b6fd8" />
          <stop offset="100%" stopColor="#1456b0" />
        </linearGradient>
      </defs>
      {/* Background squircle */}
      <rect width="60" height="60" rx="13" fill="url(#fi-bg)" />
      {/* Light sheen */}
      <rect width="60" height="30" rx="13" fill="rgba(255,255,255,0.12)" />
      <rect x="0" y="15" width="60" height="15" fill="rgba(255,255,255,0.06)" />
      {/* Left face half */}
      <ellipse cx="23" cy="31" rx="14" ry="17" fill="url(#fi-face-l)" />
      {/* Right face half */}
      <ellipse cx="37" cy="31" rx="14" ry="17" fill="url(#fi-face-r)" />
      {/* Eyes */}
      <ellipse cx="21" cy="26" rx="3" ry="3.5" fill="white" />
      <ellipse cx="39" cy="26" rx="3" ry="3.5" fill="white" />
      <circle cx="22" cy="27" r="1.6" fill="#1a3f80" />
      <circle cx="40" cy="27" r="1.6" fill="#1a3f80" />
      <circle cx="22.5" cy="26.3" r="0.7" fill="white" />
      <circle cx="40.5" cy="26.3" r="0.7" fill="white" />
      {/* Smile */}
      <path d="M22 36 Q30 42 38 36" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Nose hint */}
      <ellipse cx="30" cy="32" rx="1.5" ry="1" fill="rgba(0,0,0,0.15)" />
    </SQ>
  );
}

/* macOS Terminal — black with green prompt */
export function TerminalIcon() {
  return (
    <SQ>
      <defs>
        <linearGradient id="ti-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d3d3d" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="13" fill="url(#ti-bg)" />
      {/* Screen inset */}
      <rect x="5" y="5" width="50" height="50" rx="9" fill="#0d0d0d" opacity="0.7" />
      {/* Prompt line */}
      <text x="11" y="30" fontFamily="'SF Mono', 'Fira Code', monospace" fontSize="10" fill="#28c840" fontWeight="600">
        ➜ ~ %
      </text>
      {/* Cursor blink block */}
      <rect x="11" y="35" width="6" height="9" rx="1" fill="#28c840" opacity="0.9" />
      {/* Code lines */}
      <rect x="11" y="16" width="22" height="2" rx="1" fill="#28c840" opacity="0.5" />
      <rect x="11" y="21" width="34" height="2" rx="1" fill="#28c840" opacity="0.3" />
      {/* Bottom sheen */}
      <rect x="0" y="50" width="60" height="10" rx="13" fill="rgba(255,255,255,0.03)" />
    </SQ>
  );
}

/* macOS Notes — yellow notepad */
export function NotesIcon() {
  return (
    <SQ>
      <defs>
        <linearGradient id="ni-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd426" />
          <stop offset="100%" stopColor="#f5a800" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="13" fill="url(#ni-bg)" />
      <rect width="60" height="28" rx="13" fill="rgba(255,255,255,0.14)" />
      <rect x="0" y="13" width="60" height="15" fill="rgba(255,255,255,0.06)" />
      {/* Paper */}
      <rect x="9" y="10" width="42" height="42" rx="4" fill="#fffde8" />
      {/* Ruled lines */}
      <line x1="13" y1="20" x2="47" y2="20" stroke="#e8dfa0" strokeWidth="1.5" />
      <line x1="13" y1="26" x2="47" y2="26" stroke="#e8dfa0" strokeWidth="1.5" />
      <line x1="13" y1="32" x2="47" y2="32" stroke="#e8dfa0" strokeWidth="1.5" />
      <line x1="13" y1="38" x2="47" y2="38" stroke="#e8dfa0" strokeWidth="1.5" />
      <line x1="13" y1="44" x2="40" y2="44" stroke="#e8dfa0" strokeWidth="1.5" />
      {/* Text simulation */}
      <rect x="13" y="16" width="24" height="2.5" rx="1.2" fill="#c0a800" opacity="0.8" />
      <rect x="13" y="22.5" width="32" height="2" rx="1" fill="#c0a800" opacity="0.4" />
      <rect x="13" y="28.5" width="28" height="2" rx="1" fill="#c0a800" opacity="0.4" />
      <rect x="13" y="34.5" width="30" height="2" rx="1" fill="#c0a800" opacity="0.4" />
      {/* Left margin rule */}
      <line x1="16" y1="10" x2="16" y2="52" stroke="#f0c840" strokeWidth="1.2" opacity="0.5" />
    </SQ>
  );
}

/* macOS Mail — blue envelope */
export function MailIcon() {
  return (
    <SQ>
      <defs>
        <linearGradient id="mi-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4db3f8" />
          <stop offset="100%" stopColor="#0071e3" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="13" fill="url(#mi-bg)" />
      <rect width="60" height="30" rx="13" fill="rgba(255,255,255,0.1)" />
      {/* Envelope body */}
      <rect x="8" y="17" width="44" height="30" rx="4" fill="white" opacity="0.96" />
      {/* Envelope flap fold */}
      <path d="M8 17 L30 33 L52 17 Z" fill="#e8f4ff" />
      {/* Envelope V crease */}
      <path d="M8 17 L30 33 L52 17" stroke="#b8d8f8" strokeWidth="1" fill="none" />
      {/* Bottom fold lines */}
      <line x1="8" y1="47" x2="21" y2="35" stroke="#c0d8f0" strokeWidth="1" />
      <line x1="52" y1="47" x2="39" y2="35" stroke="#c0d8f0" strokeWidth="1" />
    </SQ>
  );
}

/* Launchpad-style Projects icon */
export function ProjectsIcon() {
  return (
    <SQ>
      <defs>
        <linearGradient id="pi-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7e7e93" />
          <stop offset="100%" stopColor="#3a3a4a" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="13" fill="url(#pi-bg)" />
      {/* Grid of mini colorful icons */}
      {[
        { x: 9,  y: 9,  c1: "#ff6b6b", c2: "#ee5a24" },
        { x: 24, y: 9,  c1: "#ffd32a", c2: "#f8a50a" },
        { x: 39, y: 9,  c1: "#0be881", c2: "#05c46b" },
        { x: 9,  y: 24, c1: "#0fbcf9", c2: "#0071e3" },
        { x: 24, y: 24, c1: "#d980fa", c2: "#9980fa" },
        { x: 39, y: 24, c1: "#ff5e57", c2: "#d63031" },
        { x: 9,  y: 39, c1: "#f9ca24", c2: "#f0932b" },
        { x: 24, y: 39, c1: "#6ab04c", c2: "#1e3799" },
        { x: 39, y: 39, c1: "#c7ecee", c2: "#74b9ff" },
      ].map((d, i) => (
        <React.Fragment key={i}>
          <defs>
            <linearGradient id={`pg${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={d.c1} />
              <stop offset="100%" stopColor={d.c2} />
            </linearGradient>
          </defs>
          <rect x={d.x} y={d.y} width="12" height="12" rx="3" fill={`url(#pg${i})`} />
        </React.Fragment>
      ))}
    </SQ>
  );
}

/* GitHub icon */
export function GitHubIcon() {
  return (
    <SQ>
      <defs>
        <linearGradient id="gi-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a3f" />
          <stop offset="100%" stopColor="#1c1c1e" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="13" fill="url(#gi-bg)" />
      <rect width="60" height="30" rx="13" fill="rgba(255,255,255,0.04)" />
      <path
        transform="translate(12, 10) scale(0.6)"
        d="M30 2C15.1 2 3 14.1 3 29c0 11.9 7.7 22 18.4 25.6 1.3.2 1.8-.6 1.8-1.3v-4.5c-7.5 1.6-9.1-3.6-9.1-3.6-1.2-3.1-3-4-3-4-2.4-1.7.2-1.6.2-1.6 2.7.2 4.1 2.8 4.1 2.8 2.4 4.1 6.3 2.9 7.8 2.2.2-1.7.9-2.9 1.7-3.6-6-0.7-12.3-3-12.3-13.3 0-2.9 1-5.3 2.8-7.2-.3-.7-1.2-3.4.3-7.1 0 0 2.3-.7 7.5 2.8 2.2-.6 4.5-.9 6.8-.9s4.6.3 6.8.9c5.2-3.5 7.5-2.8 7.5-2.8 1.5 3.7.6 6.4.3 7.1 1.7 1.9 2.8 4.3 2.8 7.2 0 10.3-6.3 12.6-12.3 13.3.9.8 1.7 2.4 1.7 4.8v7.1c0 .7.5 1.5 1.8 1.3C49.3 51 57 40.9 57 29 57 14.1 44.9 2 30 2z"
        fill="white"
        fillRule="evenodd"
      />
    </SQ>
  );
}

export function AppIconById({ id, size = 52 }) {
  const map = {
    finder: FinderIcon,
    about:  FinderIcon,
    projects: ProjectsIcon,
    terminal: TerminalIcon,
    resume: NotesIcon,
    mail:   MailIcon,
    contact: MailIcon,
    github: GitHubIcon
  };
  const Icon = map[id] || FinderIcon;
  return (
    <div style={{ width: size, height: size, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}>
      <Icon />
    </div>
  );
}
