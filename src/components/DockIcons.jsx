import React from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Graphite Studio icon suite — cohesive monochrome/slate squircles with
   precision geometric vector glyphs. Uses percentage sizing so icons scale
   cleanly across both the Dock and Spotlight without SVG ID collisions.
───────────────────────────────────────────────────────────────────────────── */

function Shell({ children, light = false }) {
  const fill = light ? "#f4f4f5" : "#1c1e24";
  const border = light ? "rgba(9,9,11,0.12)" : "rgba(255,255,255,0.12)";
  const topHighlight = light ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.06)";

  return (
    <svg width="100%" height="100%" viewBox="0 0 60 60" fill="none" style={{ display: "block" }}>
      <rect x="0.5" y="0.5" width="59" height="59" rx="13.5" fill={fill} stroke={border} strokeWidth="1" />
      <path d="M14 1.2H46" stroke={topHighlight} strokeWidth="1" strokeLinecap="round" />
      {children}
    </svg>
  );
}

/* About / Finder: clean split-pane workspace glyph */
export function FinderIcon() {
  return (
    <Shell light>
      <rect x="13" y="15" width="34" height="30" rx="5" fill="#ffffff" stroke="#18181b" strokeWidth="1.8" />
      <line x1="24" y1="15" x2="24" y2="45" stroke="#18181b" strokeWidth="1.6" />
      <line x1="16.5" y1="21" x2="20.5" y2="21" stroke="#71717a" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16.5" y1="26" x2="20.5" y2="26" stroke="#71717a" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16.5" y1="31" x2="20.5" y2="31" stroke="#a1a1aa" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="33.5" cy="25.5" r="3.5" stroke="#18181b" strokeWidth="1.7" />
      <path d="M28.5 36.5c1-2.6 2.8-4 5-4s4 1.4 5 4" stroke="#18181b" strokeWidth="1.7" strokeLinecap="round" />
    </Shell>
  );
}

/* Projects: architectural 2x2 bento grid */
export function ProjectsIcon() {
  return (
    <Shell>
      <rect x="14" y="14" width="14" height="14" rx="3.2" fill="#f4f4f5" />
      <rect x="32" y="14" width="14" height="14" rx="3.2" stroke="#a1a1aa" strokeWidth="1.8" />
      <rect x="14" y="32" width="14" height="14" rx="3.2" stroke="#a1a1aa" strokeWidth="1.8" />
      <rect x="32" y="32" width="14" height="14" rx="3.2" fill="#52525b" />
    </Shell>
  );
}

/* Terminal: crisp prompt chevron + underscore */
export function TerminalIcon() {
  return (
    <Shell>
      <rect x="10" y="12" width="40" height="36" rx="6" fill="#111216" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <path d="M18 24L24.5 30L18 36" stroke="#f4f4f5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="28.5" y1="36" x2="38.5" y2="36" stroke="#71717a" strokeWidth="2.2" strokeLinecap="round" />
    </Shell>
  );
}

/* Code: clean angle brackets + slash */
export function CodeIcon() {
  return (
    <Shell>
      <path d="M23 22L15 30L23 38" stroke="#f4f4f5" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M37 22L45 30L37 38" stroke="#f4f4f5" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="32.5" y1="20" x2="27.5" y2="40" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
    </Shell>
  );
}

/* Fatural: document + scan brackets */
export function FaturalIcon() {
  return (
    <Shell light>
      <rect x="18" y="14" width="24" height="32" rx="3.5" fill="#ffffff" stroke="#18181b" strokeWidth="1.7" />
      <line x1="23" y1="22" x2="37" y2="22" stroke="#18181b" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="23" y1="27.5" x2="34" y2="27.5" stroke="#71717a" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="23" y1="38" x2="31" y2="38" stroke="#a1a1aa" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13" y1="32.5" x2="47" y2="32.5" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
    </Shell>
  );
}

/* Time Machine: minimal history dial */
export function TimeMachineIcon() {
  return (
    <Shell>
      <path d="M16.5 26A14.5 14.5 0 1 1 18.2 37.5" stroke="#e4e4e7" strokeWidth="2" strokeLinecap="round" />
      <path d="M15.5 20.5V26.5H21.5" stroke="#e4e4e7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 22.5V30.5L35.5 33.5" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Shell>
  );
}

/* Resume / CV: crisp document page */
export function NotesIcon() {
  return (
    <Shell light>
      <path
        d="M19 13H35L42 20V45C42 46.1 41.1 47 40 47H19C17.9 47 17 46.1 17 45V15C17 13.9 17.9 13 19 13Z"
        fill="#ffffff"
        stroke="#18181b"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M35 13V20H42" stroke="#18181b" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="22" y1="26" x2="36" y2="26" stroke="#18181b" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="22" y1="31.5" x2="37" y2="31.5" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="36.5" x2="37" y2="36.5" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="41.5" x2="31" y2="41.5" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" />
    </Shell>
  );
}

/* Contact / Mail: geometric envelope */
export function MailIcon() {
  return (
    <Shell>
      <rect x="13" y="18" width="34" height="24" rx="4" stroke="#f4f4f5" strokeWidth="1.9" />
      <path d="M14.5 20L30 31.5L45.5 20" stroke="#a1a1aa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Shell>
  );
}

/* GitHub: official mark on matching graphite squircle */
export function GitHubIcon() {
  return (
    <Shell>
      <path
        transform="translate(13.5, 13) scale(0.55)"
        d="M30 2C15.1 2 3 14.1 3 29c0 11.9 7.7 22 18.4 25.6 1.3.2 1.8-.6 1.8-1.3v-4.5c-7.5 1.6-9.1-3.6-9.1-3.6-1.2-3.1-3-4-3-4-2.4-1.7.2-1.6.2-1.6 2.7.2 4.1 2.8 4.1 2.8 2.4 4.1 6.3 2.9 7.8 2.2.2-1.7.9-2.9 1.7-3.6-6-0.7-12.3-3-12.3-13.3 0-2.9 1-5.3 2.8-7.2-.3-.7-1.2-3.4.3-7.1 0 0 2.3-.7 7.5 2.8 2.2-.6 4.5-.9 6.8-.9s4.6.3 6.8.9c5.2-3.5 7.5-2.8 7.5-2.8 1.5 3.7.6 6.4.3 7.1 1.7 1.9 2.8 4.3 2.8 7.2 0 10.3-6.3 12.6-12.3 13.3.9.8 1.7 2.4 1.7 4.8v7.1c0 .7.5 1.5 1.8 1.3C49.3 51 57 40.9 57 29 57 14.1 44.9 2 30 2z"
        fill="#f4f4f5"
        fillRule="evenodd"
      />
    </Shell>
  );
}

export function AppIconById({ id, size = 46 }) {
  const map = {
    finder: FinderIcon,
    about: FinderIcon,
    projects: ProjectsIcon,
    terminal: TerminalIcon,
    resume: NotesIcon,
    mail: MailIcon,
    contact: MailIcon,
    github: GitHubIcon,
    code: CodeIcon,
    fatural: FaturalIcon,
    timemachine: TimeMachineIcon
  };
  const Icon = map[id] || FinderIcon;
  return (
    <div style={{ width: size, height: size, filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.28))" }}>
      <Icon />
    </div>
  );
}
