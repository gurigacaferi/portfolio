import React, { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, user, PRESENT_YEAR } from "../../configs/portfolio";
import { useDesktop } from "../../context/DesktopContext";

const RailwayScene = lazy(() => import("./RailwayScene"));

function ClockGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 4.6V8l2.4 1.5" />
    </svg>
  );
}

function TimeBanner({ year, onReset }) {
  if (year === PRESENT_YEAR) return null;
  return (
    <div className="time-banner" style={{ margin: "14px 18px 0" }}>
      <span className="time-banner-label">
        <ClockGlyph />
        Viewing {year}. Showing projects shipped up to that year.
      </span>
      <button type="button" onClick={onReset}>Return to present →</button>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, color: "var(--mac-text-2)" }} aria-hidden>
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
      <path d="M5.5 7V4.8a2.5 2.5 0 015 0V7" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--mac-text-3)" }} aria-hidden>
      <path d="M4 10L10 4M5.2 4H10v4.8" />
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
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
        background: "var(--mac-surface)",
        border: "1px solid var(--mac-border)",
        borderRadius: 10,
        padding: "15px 16px",
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(9, 9, 11, 0.03)",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        overflow: "hidden"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--mac-border-strong)";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(9, 9, 11, 0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--mac-border)";
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(9, 9, 11, 0.03)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--mac-text-3)",
            fontVariantNumeric: "tabular-nums"
          }}>
            {project.year}
          </span>
          <span style={{ color: "var(--mac-border-strong)", fontSize: 11 }}>·</span>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--mac-text-3)"
          }}>
            {project.solo ? "Solo" : "Team"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {project.featured && (
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.02em",
              padding: "2px 6px",
              borderRadius: 4,
              background: "#18181b",
              color: "#fafafa"
            }}>
              Featured
            </span>
          )}
          <ArrowUpRight />
        </div>
      </div>

      <p style={{
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "-0.015em",
        color: "var(--mac-text)",
        marginBottom: 4,
        lineHeight: 1.35
      }}>
        {project.title}
      </p>

      <p style={{
        fontSize: 12,
        color: "var(--mac-text-2)",
        marginBottom: 14,
        lineHeight: 1.5,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        flexShrink: 0
      }}>
        {project.subtitle}
      </p>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 4,
        marginTop: "auto"
      }}>
        {project.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            title={tag}
            style={{
              padding: "2px 7px",
              borderRadius: 4,
              fontSize: 10.5,
              fontWeight: 500,
              background: "var(--mac-surface-subtle)",
              color: "var(--mac-text-2)",
              border: "1px solid rgba(9, 9, 11, 0.06)",
              whiteSpace: "nowrap"
            }}
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span style={{
            fontSize: 10.5,
            color: "var(--mac-text-3)",
            padding: "2px 2px",
            fontVariantNumeric: "tabular-nums"
          }}>
            +{project.tags.length - 3}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function ProjectDetail({ project }) {
  const accessMailto = `mailto:${user.email}?subject=${encodeURIComponent(`Access request: ${project.title}`)}&body=${encodeURIComponent(`Hi Guri,\n\nI'd like to take a look at ${project.title}. Could you share access or walk me through it?\n\n`)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
      style={{ height: "100%", overflowY: "auto" }}
    >
      <div style={{ maxWidth: 680, padding: "22px 26px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid var(--mac-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 11.5, color: "var(--mac-text-3)", fontWeight: 500 }}>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{project.year}</span>
            <span>·</span>
            <span>{project.solo ? "Solo build" : "Team project"}</span>
            {project.category === "coursework" && (
              <>
                <span>·</span>
                <span>Academic</span>
              </>
            )}
          </div>
          <h1 style={{ fontSize: 21, fontWeight: 650, color: "var(--mac-text)", letterSpacing: "-0.025em", marginBottom: 4 }}>
            {project.title}
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--mac-text-2)", lineHeight: 1.5 }}>
            {project.subtitle}
          </p>
        </div>

        {project.outcome && (
          <div style={{
            padding: "12px 15px",
            borderRadius: 8,
            marginBottom: 20,
            background: "var(--mac-surface-subtle)",
            border: "1px solid var(--mac-border)",
            borderLeft: "2.5px solid var(--mac-accent)"
          }}>
            <p style={{ fontSize: 10.5, fontWeight: 600, color: "var(--mac-text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              Outcome
            </p>
            <p style={{ fontSize: 13, color: "var(--mac-text)", lineHeight: 1.6, margin: 0 }}>
              {project.outcome}
            </p>
          </div>
        )}

        <p style={{ fontSize: 13.5, color: "var(--mac-text-2)", lineHeight: 1.75, marginBottom: 22 }}>
          {project.description}
        </p>

        {project.scene === "railway" && (
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 10.5, fontWeight: 600, color: "var(--mac-text-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
              Interactive model
            </p>
            <Suspense fallback={<div className="railway-scene-fallback"><p>Loading 3D scene…</p></div>}>
              <RailwayScene />
            </Suspense>
          </div>
        )}

        {project.highlights && (
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 10.5, fontWeight: 600, color: "var(--mac-text-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
              Implementation Highlights
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 13,
                    color: "var(--mac-text-2)",
                    lineHeight: 1.68,
                    paddingLeft: 15,
                    position: "relative",
                    marginBottom: 7
                  }}
                >
                  <span style={{
                    position: "absolute",
                    left: 0,
                    top: 9,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--mac-text-3)",
                    display: "block"
                  }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 10.5, fontWeight: 600, color: "var(--mac-text-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
            Stack
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.tags.map(tag => (
              <span key={tag} className="mac-tag" style={{ margin: 0 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {(project.github || project.link || project.p5js) ? (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 10,
            paddingTop: 14,
            borderTop: "1px solid var(--mac-border)"
          }}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="mac-btn"
                style={{ textDecoration: "none" }}
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
                style={{ textDecoration: "none" }}
                onClick={e => e.stopPropagation()}
              >
                Open in p5.js
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="mac-btn secondary"
                style={{ textDecoration: "none" }}
                onClick={e => e.stopPropagation()}
              >
                {project.linkLabel || "Live demo"}
              </a>
            )}
          </div>
        ) : (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 9,
            background: "var(--mac-surface)",
            border: "1px solid var(--mac-border)"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: "1 1 260px" }}>
              <LockIcon />
              <p style={{ fontSize: 12.5, color: "var(--mac-text-2)", lineHeight: 1.55, margin: 0 }}>
                Private repository (production / client system). Happy to walk through the architecture or share access on request.
              </p>
            </div>
            <a
              href={accessMailto}
              className="mac-btn"
              style={{ textDecoration: "none", flexShrink: 0 }}
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
  const [filter, setFilter] = useState("Featured");
  const [selected, setSelected] = useState(null);
  const { timeMachineYear, setTimeMachineYear } = useDesktop();

  const timeVisible = timeMachineYear === PRESENT_YEAR ? projects : projects.filter(p => Number(p.year) <= timeMachineYear);
  const filtered = filter === "Featured" ? timeVisible.filter(p => p.featured) : timeVisible;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "var(--mac-window-bg)" }}>

      {/* Toolbar */}
      <div className="mac-toolbar">
        {selected ? (
          <button type="button" className="mac-toolbar-btn" onClick={() => setSelected(null)} style={{ color: "var(--mac-text)" }}>
            ← All Projects
          </button>
        ) : (
          <>
            <div className="mac-segmented">
              {FILTERS.map(f => (
                <button
                  key={f}
                  type="button"
                  className={`mac-toolbar-btn${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="mac-toolbar-count">{filtered.length} {filtered.length === 1 ? "project" : "projects"}</span>
          </>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <AnimatePresence mode="wait">
          {selected ? (
            <ProjectDetail key="detail" project={selected} />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              style={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}
            >
              <TimeBanner year={timeMachineYear} onReset={() => setTimeMachineYear(PRESENT_YEAR)} />
              {filtered.length === 0 ? (
                <div style={{ padding: "18px 20px" }}>
                  <p style={{ fontSize: 13, color: "var(--mac-text-2)", lineHeight: 1.7 }}>
                    No featured projects recorded for {timeMachineYear} yet. Move the Time Machine slider forward to view later work.
                  </p>
                </div>
              ) : (
                <div
                  className="projects-grid-mobile"
                  style={{
                    padding: "16px 18px 20px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 248px), 1fr))",
                    gap: 12,
                    alignContent: "start"
                  }}
                >
                  {filtered.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.16 }}
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
