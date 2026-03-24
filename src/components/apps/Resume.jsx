import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import { FiDownload, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { user, skills, projects, education, workExperience, resumePdfUrl } from "../../configs/portfolio";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ""}/pdf.worker.min.mjs`;

function Rule({ title }) {
  return (
    <div className="section-rule" style={{ marginBottom: 12 }}>
      <h3>{title}</h3>
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4, margin: "2px 2px 2px 0",
      fontSize: 10, fontWeight: 500,
      background: color ? `${color}10` : "rgba(0,113,227,0.07)",
      color: color || "var(--mac-accent)",
      border: `1px solid ${color ? color + "26" : "rgba(0,113,227,0.15)"}`
    }}>
      {label}
    </span>
  );
}

function fade(delay) {
  return { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.22 } };
}

function ResumePdfViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(640);
  const [loadError, setLoadError] = useState(null);
  const [busy, setBusy] = useState(true);
  const scrollRef = useRef(null);
  const fullscreenRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth;
      setPageWidth(Math.max(240, Math.min(w - 40, 960)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const sync = () => {
      const el = fullscreenRef.current;
      const doc = document;
      const active =
        (doc.fullscreenElement && doc.fullscreenElement === el) ||
        (doc.webkitFullscreenElement && doc.webkitFullscreenElement === el);
      setIsFullscreen(!!active);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = fullscreenRef.current;
    if (!el) return;
    const doc = document;
    const active =
      (doc.fullscreenElement && doc.fullscreenElement === el) ||
      (doc.webkitFullscreenElement && doc.webkitFullscreenElement === el);
    try {
      if (active) {
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    } catch {
      /* unsupported or blocked */
    }
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: n }) => {
    setNumPages(n);
    setLoadError(null);
    setBusy(false);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    setLoadError(err?.message || "Could not load PDF");
    setBusy(false);
  }, []);

  const matBg = isFullscreen ? "#1a1a1a" : "var(--mac-sidebar-bg)";

  return (
    <div
      ref={fullscreenRef}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--mac-window-bg)"
      }}
    >
      <div style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "8px 12px",
        borderBottom: "1px solid var(--mac-border)",
        background: "var(--mac-window-bg)"
      }}>
        <span style={{ fontSize: 12, color: "var(--mac-text-2)" }}>Resume</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit full screen (Esc)" : "Full screen"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: "var(--mac-accent)",
              background: "rgba(0,113,227,0.08)",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: "6px 10px",
              borderRadius: 6
            }}
          >
            {isFullscreen ? <FiMinimize2 size={14} aria-hidden /> : <FiMaximize2 size={14} aria-hidden />}
            {isFullscreen ? "Exit" : "Full screen"}
          </button>
          <a
            href={resumePdfUrl}
            download
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: "var(--mac-accent)",
              textDecoration: "none",
              padding: "6px 10px",
              borderRadius: 6
            }}
          >
            <FiDownload size={14} aria-hidden />
            Download
          </a>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 12px 24px",
          background: matBg
        }}
      >
        {busy && !loadError && (
          <p style={{ fontSize: 13, color: "var(--mac-text-2)", marginTop: 24 }}>Loading…</p>
        )}
        {loadError && (
          <div style={{ marginTop: 24, textAlign: "center", maxWidth: 360 }}>
            <p style={{ fontSize: 13, color: "var(--mac-text-2)", marginBottom: 12 }}>{loadError}</p>
            <a href={resumePdfUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--mac-accent)" }}>
              Open PDF in new tab
            </a>
          </div>
        )}
        {!loadError && (
          <Document
            file={resumePdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
          >
            {numPages
              ? Array.from({ length: numPages }, (_, i) => (
                  <div
                    key={i + 1}
                    style={{
                      marginBottom: i + 1 < numPages ? 16 : 0,
                      boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                      borderRadius: 2,
                      overflow: "hidden",
                      lineHeight: 0
                    }}
                  >
                    <Page
                      pageNumber={i + 1}
                      width={pageWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))
              : null}
          </Document>
        )}
      </div>
    </div>
  );
}

export default function Resume() {
  if (resumePdfUrl) {
    return <ResumePdfViewer />;
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "var(--mac-window-bg)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 32px 40px" }}>

        {/* Header */}
        <motion.div {...fade(0)} style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--mac-text)", letterSpacing: "-0.6px", marginBottom: 4 }}>{user.name}</h1>
          <p style={{ fontSize: 13, color: "var(--mac-accent)", fontWeight: 500, marginBottom: 8 }}>{user.title}</p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 18px", fontSize: 12, color: "var(--mac-text-2)", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {user.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {user.email}
            </span>
            <a href={user.github} target="_blank" rel="noreferrer" style={{ color: "var(--mac-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              GitHub
            </a>
            <a href={user.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--mac-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
          </div>
        </motion.div>

        <div style={{ height: 1, background: "var(--mac-border)", marginBottom: 22 }} />

        {/* Summary */}
        <motion.div {...fade(0.04)} style={{ marginBottom: 24 }}>
          <Rule title="Summary" />
          <p style={{ fontSize: 13, color: "var(--mac-text-2)", lineHeight: 1.78 }}>
            {user.bio} I thrive at the intersection of engineering and problem-solving — whether
            modernising legacy systems, building AI-integrated tooling, or helping peers grasp
            programming fundamentals.
          </p>
        </motion.div>

        {/* Education */}
        <motion.div {...fade(0.07)} style={{ marginBottom: 24 }}>
          <Rule title="Education" />
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: i < education.length - 1 ? 14 : 0, paddingBottom: i < education.length - 1 ? 14 : 0, borderBottom: i < education.length - 1 ? "1px solid var(--mac-border-2)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--mac-text)" }}>{edu.degree}</span>
                <span style={{ fontSize: 11, color: "var(--mac-text-2)", flexShrink: 0, marginLeft: 10 }}>{edu.period}</span>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--mac-accent)", fontWeight: 500, margin: "2px 0 4px" }}>{edu.institution}</p>
              <p style={{ fontSize: 12, color: "var(--mac-text-2)", lineHeight: 1.65 }}>{edu.note}</p>
            </div>
          ))}
        </motion.div>

        {/* Experience */}
        <motion.div {...fade(0.1)} style={{ marginBottom: 24 }}>
          <Rule title="Experience" />
          {workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: i < workExperience.length - 1 ? 18 : 0, paddingBottom: i < workExperience.length - 1 ? 18 : 0, borderBottom: i < workExperience.length - 1 ? "1px solid var(--mac-border-2)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--mac-text)" }}>{exp.role}</span>
                <span style={{ fontSize: 11, color: "var(--mac-text-2)", flexShrink: 0, marginLeft: 10 }}>{exp.period}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0 8px" }}>
                <span style={{ fontSize: 12.5, color: "var(--mac-accent)", fontWeight: 500 }}>{exp.company}</span>
                <span style={{ fontSize: 11, color: "var(--mac-text-3)" }}>{exp.location}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 8px" }}>
                {exp.bullets.map((b, j) => (
                  <li key={j} style={{ fontSize: 12, color: "var(--mac-text-2)", lineHeight: 1.7, paddingLeft: 12, position: "relative", marginBottom: 1 }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--mac-accent)" }}>·</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div>{exp.tags.map(t => <Tag key={t} label={t} />)}</div>
            </div>
          ))}
        </motion.div>

        {/* Projects */}
        <motion.div {...fade(0.13)} style={{ marginBottom: 24 }}>
          <Rule title="Selected Projects" />
          {projects.slice(0, 4).map((p) => (
            <div key={p.id} style={{ marginBottom: 12, paddingLeft: 12, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 6, width: 5, height: 5, borderRadius: "50%", background: p.color }} />
              <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--mac-text)" }}>{p.title}</span>
                <span style={{ fontSize: 11, color: "var(--mac-text-3)" }}>{p.year}</span>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--mac-text-2)", lineHeight: 1.65, marginBottom: 5 }}>
                {p.description.split(".")[0]}.
              </p>
              <div>{p.tags.slice(0, 4).map(t => <Tag key={t} label={t} color={p.color} />)}</div>
            </div>
          ))}
        </motion.div>

        {/* Skills */}
        <motion.div {...fade(0.16)} style={{ marginBottom: 24 }}>
          <Rule title="Skills" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
            {Object.entries(skills).map(([cat, items]) => (
              <div key={cat}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--mac-text-2)", textTransform: "capitalize", letterSpacing: 0.4, marginBottom: 5 }}>{cat}</p>
                <div>{items.map(s => <Tag key={s} label={s} />)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Languages */}
        <motion.div {...fade(0.19)}>
          <Rule title="Languages" />
          <div style={{ display: "flex", gap: 12 }}>
            {[{ name: "Albanian", level: "Native" }, { name: "English", level: "Fluent" }].map(l => (
              <div key={l.name} style={{
                background: "rgba(255,255,255,0.65)", border: "1px solid var(--mac-border)",
                borderRadius: 8, padding: "10px 18px", textAlign: "center"
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--mac-text)", marginBottom: 2 }}>{l.name}</p>
                <p style={{ fontSize: 11, color: "var(--mac-accent)" }}>{l.level}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
