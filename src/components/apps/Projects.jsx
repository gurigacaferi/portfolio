import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../../configs/portfolio";

function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.09)" }}
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.75)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderLeft: `3px solid ${project.color}`,
        borderRadius: 10, padding: "14px 16px",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        transition: "box-shadow 0.18s"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: "rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700, color: "var(--mac-text-2)"
        }}>
          {project.title[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--mac-text)", marginBottom: 1 }}>{project.title}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <p style={{ fontSize: 11, color: "var(--mac-text-3)" }}>{project.year}</p>
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: 0.3, padding: "1px 5px",
              borderRadius: 3, textTransform: "uppercase",
              background: "rgba(0,0,0,0.05)", color: "var(--mac-text-3)",
              border: "1px solid rgba(0,0,0,0.09)"
            }}>
              {project.solo ? "Solo" : "Team"}
            </span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11.5, color: "var(--mac-text-2)", marginBottom: 10, lineHeight: 1.5 }}>
        {project.subtitle}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 4px" }}>
        {project.tags.slice(0, 3).map(tag => (
          <span key={tag} style={{
            display: "inline-block", padding: "2px 7px", borderRadius: 4,
            fontSize: 10, fontWeight: 500,
            background: "rgba(0,0,0,0.05)", color: "var(--mac-text-2)",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>{tag}</span>
        ))}
        {project.tags.length > 3 && (
          <span style={{ fontSize: 10, color: "var(--mac-text-3)", padding: "2px 0" }}>+{project.tags.length - 3}</span>
        )}
      </div>
    </motion.div>
  );
}

function ProjectDetail({ project, onBack }) {
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
          background: "rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 700, color: "var(--mac-text-2)"
        }}>
          {project.title[0]}
        </div>
        <div>
          <h1 style={{ fontSize: 19, fontWeight: 700, color: "var(--mac-text)", letterSpacing: "-0.4px", marginBottom: 3 }}>{project.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "12px 14px", borderRadius: 8,
            background: "rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.07)"
          }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1, color: "var(--mac-text-3)" }}>
              <circle cx="8" cy="8" r="6.5"/>
              <line x1="8" y1="7" x2="8" y2="11"/>
              <circle cx="8" cy="5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
            <p style={{ fontSize: 12.5, color: "var(--mac-text-2)", lineHeight: 1.65, margin: 0 }}>
              The source code for this project is private. If you'd like to take a look,{" "}
              <span style={{ color: "var(--mac-text)", fontWeight: 500 }}>reach out and I'll give you access.</span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter,   setFilter]   = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = filter === "Featured" ? projects.filter(p => p.featured) : projects;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "var(--mac-window-bg)" }}>

      {/* Toolbar */}
      <div className="mac-toolbar">
        {selected ? (
          <button className="mac-toolbar-btn" onClick={() => setSelected(null)}>← Projects</button>
        ) : (
          <>
            {["All", "Featured"].map(f => (
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
      <div style={{ flex: 1, overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          {selected ? (
            <ProjectDetail key="detail" project={selected} onBack={() => setSelected(null)} />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="projects-grid-mobile"
              style={{
                height: "100%", overflowY: "auto", padding: "16px 18px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
                gap: 12, alignContent: "start"
              }}
            >
              {filtered.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <ProjectCard project={project} onClick={() => setSelected(project)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
