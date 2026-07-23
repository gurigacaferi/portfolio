import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, user, PRESENT_YEAR } from "../../configs/portfolio";
import { useDesktop } from "../../context/DesktopContext";

function TimeBanner({ year, onReset }) {
  if (year === PRESENT_YEAR) return null;
  return (
    <div className="time-banner" style={{ margin: "12px 18px 0" }}>
      <span>🕒 Viewing {year} — only what shipped by then is shown.</span>
      <button type="button" onClick={onReset}>Return to present →</button>
    </div>
  );
}

function LockIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
      <path d="M5.5 7V4.8a2.5 2.5 0 015 0V7" />
    </svg>
  );
}

function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      layout
      className="project-card"
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.09)" }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: "rgba(255,255,255,0.75)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderLeft: `3px solid ${project.color}`,
        borderRadius: 10, padding: "14px 16px",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        transition: "box-shadow 0.18s",
        overflow: "hidden"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: `${project.color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700, color: project.color
        }}>
          {project.title[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 13.5, fontWeight: 600, color: "var(--mac-text)", marginBottom: 1,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            overflow: "hidden", lineHeight: 1.35,
            minHeight: "2.7em"
          }}>{project.title}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
            <p style={{ fontSize: 11, color: "var(--mac-text-3)" }}>{project.year}</p>
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: 0.3, padding: "1px 5px",
              borderRadius: 3, textTransform: "uppercase",
              background: "rgba(0,0,0,0.05)", color: "var(--mac-text-3)",
              border: "1px solid rgba(0,0,0,0.09)"
            }}>
              {project.solo ? "Solo" : "Team"}
            </span>
            {project.featured && (
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 0.3, padding: "1px 5px",
                borderRadius: 3, textTransform: "uppercase",
                background: `${project.color}18`, color: project.color,
                border: `1px solid ${project.color}30`
              }}>
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      <p style={{
        fontSize: 11.5, color: "var(--mac-text-2)", marginBottom: 10, lineHeight: 1.5,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        overflow: "hidden", flexShrink: 0,
        minHeight: "3em"
      }}>
        {project.subtitle}
      </p>

      <div style={{
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        gap: 4,
        marginTop: "auto",
        minWidth: 0,
        width: "100%",
        overflow: "hidden"
      }}>
        {project.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            title={tag}
            style={{
              flex: "1 1 0",
              minWidth: 0,
              padding: "2px 6px", borderRadius: 4,
              fontSize: 10, fontWeight: 500,
              background: "rgba(0,0,0,0.05)", color: "var(--mac-text-2)",
              border: "1px solid rgba(0,0,0,0.08)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >{tag}</span>
        ))}
        {project.tags.length > 3 && (
          <span style={{
            fontSize: 10, color: "var(--mac-text-3)", padding: "2px 0",
            flexShrink: 0, whiteSpace: "nowrap"
          }}>+{project.tags.length - 3}</span>
        )}
      </div>
    </motion.div>
  );
}

function ProjectDetail({ project, onBack }) {
  const accessMailto = `mailto:${user.email}?subject=${encodeURIComponent(`Access request: ${project.title}`)}&body=${encodeURIComponent(`Hi Guri,\n\nI'd like to take a look at ${project.title}. Could you share access or walk me through it?\n\n`)}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      style={{ height: "100%", overflowY: "auto" }}
    >
      {/* Header */}
      <div style={{
        padding: "20px 24px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        borderLeft: `3px solid ${project.color}`,
        display: "flex", alignItems: "center", gap: 14
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12, flexShrink: 0,
          background: `${project.color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 700, color: project.color
        }}>
          {project.title[0]}
        </div>
        <div>
          <h1 style={{ fontSize: 19, fontWeight: 700, color: "var(--mac-text)", letterSpacing: "-0.4px", marginBottom: 3 }}>{project.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <p style={{ fontSize: 12, color: "var(--mac-text-2)" }}>{project.subtitle}</p>
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: 0.3, padding: "2px 7px",
              borderRadius: 3, textTransform: "uppercase",
              background: "rgba(0,0,0,0.05)", color: "var(--mac-text-3)",
              border: "1px solid rgba(0,0,0,0.09)"
            }}>
              {project.solo ? "Solo" : "Team"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <button
          onClick={onBack}
          className="mac-btn secondary"
          style={{ marginBottom: 18, fontSize: 12 }}
        >
          ← Back to Projects
        </button>

        {project.outcome && (
          <div style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            padding: "12px 14px", borderRadius: 8, marginBottom: 18,
            background: `linear-gradient(135deg, ${project.color}14, ${project.color}05)`,
            border: `1px solid ${project.color}30`
          }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: project.color, textTransform: "uppercase", letterSpacing: 0.6, flexShrink: 0, paddingTop: 1 }}>
              Outcome
            </span>
            <p style={{ fontSize: 13, color: "var(--mac-text)", lineHeight: 1.6, margin: 0 }}>
              {project.outcome}
            </p>
          </div>
        )}

        <p style={{ fontSize: 13.5, color: "var(--mac-text-2)", lineHeight: 1.8, marginBottom: 22 }}>
          {project.description}
        </p>

        {project.highlights && (
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--mac-text-2)", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10 }}>
              Highlights
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {project.highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    fontSize: 13, color: "var(--mac-text-2)", lineHeight: 1.7,
                    paddingLeft: 16, position: "relative", marginBottom: 6
                  }}
                >
                  <span style={{
                    position: "absolute", left: 0, top: 7,
                    width: 5, height: 5, borderRadius: "50%",
                    background: "rgba(0,0,0,0.2)", display: "block"
                  }} />
                  {h}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--mac-text-2)", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8 }}>
            Technologies
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                padding: "4px 12px", borderRadius: 5, fontSize: 11.5, fontWeight: 500,
                background: "rgba(0,0,0,0.05)", color: "var(--mac-text-2)",
                border: "1px solid rgba(0,0,0,0.08)"
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {(project.github || project.link || project.p5js) ? (
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10,
            padding: "12px 14px", borderRadius: 8,
            background: "rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.07)"
          }}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="mac-btn"
                style={{ fontSize: 12.5, textDecoration: "none" }}
                onClick={e => e.stopPropagation()}
              >
                View on GitHub
              </a>
            )}
            {project.p5js && (
              <a
                href={project.p5js}
                target="_blank"
                rel="noreferrer"
                className="mac-btn"
                style={{ fontSize: 12.5, textDecoration: "none" }}
                onClick={e => e.stopPropagation()}
              >
                View on p5.js
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="mac-btn secondary"
                style={{ fontSize: 12.5, textDecoration: "none" }}
                onClick={e => e.stopPropagation()}
              >
                {project.linkLabel || "Live demo"}
              </a>
            )}
          </div>
        ) : (
          <div style={{
            display: "flex", flexDirection: "column", gap: 10,
            padding: "14px 16px", borderRadius: 10,
            background: `linear-gradient(135deg, ${project.color}14, ${project.color}05)`,
            border: `1px solid ${project.color}30`
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <LockIcon color={project.color} />
              <p style={{ fontSize: 12.5, color: "var(--mac-text-2)", lineHeight: 1.65, margin: 0 }}>
                Private codebase — built for a client / production use. I&apos;m glad to walk through the architecture or grant read access.
              </p>
            </div>
            <a
              href={accessMailto}
              className="mac-btn"
              style={{ alignSelf: "flex-start", fontSize: 12.5, textDecoration: "none", background: project.color }}
              onClick={e => e.stopPropagation()}
            >
              Request Access →
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const FILTERS = ["Featured", "All"];

export default function Projects() {
  const [filter,   setFilter]   = useState("Featured");
  const [selected, setSelected] = useState(null);
  const { timeMachineYear, setTimeMachineYear } = useDesktop();

  const timeVisible = timeMachineYear === PRESENT_YEAR ? projects : projects.filter(p => Number(p.year) <= timeMachineYear);
  const filtered = filter === "Featured" ? timeVisible.filter(p => p.featured) : timeVisible;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "var(--mac-window-bg)" }}>

      {/* Toolbar */}
      <div className="mac-toolbar">
        {selected ? (
          <button className="mac-toolbar-btn" onClick={() => setSelected(null)}>← Projects</button>
        ) : (
          <>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`mac-toolbar-btn${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
            <span className="mac-toolbar-count">{filtered.length} projects</span>
          </>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <AnimatePresence mode="wait">
          {selected ? (
            <ProjectDetail key="detail" project={selected} onBack={() => setSelected(null)} />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}
            >
              <TimeBanner year={timeMachineYear} onReset={() => setTimeMachineYear(PRESENT_YEAR)} />
              {filtered.length === 0 ? (
                <div style={{ padding: "16px 18px" }}>
                  <p style={{ fontSize: 13, color: "var(--mac-text-2)", lineHeight: 1.7 }}>
                    Nothing shipped yet in {timeMachineYear} — that&rsquo;s next. Slide the Time Machine forward to watch it happen.
                  </p>
                </div>
              ) : (
                <div
                  className="projects-grid-mobile"
                  style={{
                    padding: "16px 18px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
                    gap: 12, alignContent: "start"
                  }}
                >
                  {filtered.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ height: "100%", minHeight: 0 }}
                    >
                      <ProjectCard project={project} onClick={() => setSelected(project)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
