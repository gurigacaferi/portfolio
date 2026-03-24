import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { user, skills, education, workExperience } from "../../configs/portfolio";

/* ── SF-Symbols-style SVG icons ─────────────────────────────────────────── */
const ic = (color = "currentColor") => ({ width: 16, height: 16, display: "block", flexShrink: 0, color });

function IconPerson()    { return <svg {...ic()} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="6" r="3.2"/><path d="M2.5 16c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/></svg>; }
function IconBolt()      { return <svg {...ic()} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 2L4 10h5.5L7.5 16 14 8H8.5z"/></svg>; }
function IconBriefcase() { return <svg {...ic()} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="6" width="15" height="10" rx="2"/><path d="M6 6V4.5A1.5 1.5 0 017.5 3h3A1.5 1.5 0 0112 4.5V6"/><line x1="1.5" y1="11" x2="16.5" y2="11"/></svg>; }
function IconGradCap()   { return <svg {...ic()} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L1 6.5l8 4.5 8-4.5L9 2z"/><path d="M5 8.8v4.2c0 1.2 1.8 2 4 2s4-.8 4-2V8.8"/><line x1="1" y1="6.5" x2="1" y2="11"/></svg>; }
function IconGlobe()     { return <svg {...ic()} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="9" r="7.5"/><ellipse cx="9" cy="9" rx="3" ry="7.5"/><line x1="1.5" y1="9" x2="16.5" y2="9"/><line x1="2.5" y1="5.5" x2="15.5" y2="5.5"/><line x1="2.5" y1="12.5" x2="15.5" y2="12.5"/></svg>; }

/* Stat card icons — slightly larger */
const ics = (color = "currentColor") => ({ width: 20, height: 20, display: "block", color });
function StatIconFolder()   { return <svg {...ics()} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5.5A1.5 1.5 0 013.5 4h3.38l1.5 2H16.5A1.5 1.5 0 0118 7.5v7A1.5 1.5 0 0116.5 16h-13A1.5 1.5 0 012 14.5V5.5z"/></svg>; }
function StatIconCode()     { return <svg {...ics()} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,7 2,10 6,13"/><polyline points="14,7 18,10 14,13"/><line x1="11" y1="5" x2="9" y2="15"/></svg>; }
function StatIconBuilding() { return <svg {...ics()} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="14" height="14" rx="1.5"/><line x1="3" y1="8" x2="17" y2="8"/><line x1="10" y1="3" x2="10" y2="17"/></svg>; }
function StatIconGlobe()    { return <svg {...ics()} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="10" cy="10" r="8"/><ellipse cx="10" cy="10" rx="3.2" ry="8"/><line x1="2" y1="10" x2="18" y2="10"/><line x1="3" y1="6" x2="17" y2="6"/><line x1="3" y1="14" x2="17" y2="14"/></svg>; }
function StatIconPin()      { return <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display:"block", flexShrink:0 }}><path d="M8 1.5a4.5 4.5 0 014.5 4.5c0 3.5-4.5 8.5-4.5 8.5S3.5 9.5 3.5 6A4.5 4.5 0 018 1.5z"/><circle cx="8" cy="6" r="1.5"/></svg>; }

/* Actual brand logos */
function IconGitHub()   {
  return (
    <svg {...ic()} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg {...ic()} viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
    </svg>
  );
}
function IconMail() {
  return (
    <svg {...ic()} viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="16" height="12" rx="2"/>
      <path d="M1 3.5l8 5 8-5"/>
    </svg>
  );
}

const sections = [
  { id: "overview",   label: "Overview",   Icon: IconPerson    },
  { id: "skills",     label: "Skills",     Icon: IconBolt      },
  { id: "experience", label: "Experience", Icon: IconBriefcase },
  { id: "education",  label: "Education",  Icon: IconGradCap   },
  { id: "languages",  label: "Languages",  Icon: IconGlobe     }
];

function Avatar() {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: "50%",
      background: "linear-gradient(145deg, #6366f1 0%, #8b5cf6 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 24, fontWeight: 700, color: "white", flexShrink: 0,
      boxShadow: "0 4px 16px rgba(99,102,241,0.35)"
    }}>
      GG
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20, margin: "3px 3px 3px 0",
      fontSize: 11, fontWeight: 500,
      background: color ? `${color}14` : "rgba(0,113,227,0.08)",
      color: color || "#0071e3",
      border: `1px solid ${color ? color + "28" : "rgba(0,113,227,0.18)"}`
    }}>
      {label}
    </span>
  );
}

function SkillGroup({ title, items }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#aeaeb2", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
        {title}
      </p>
      <div>{items.map(s => <Tag key={s} label={s} />)}</div>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: 10, padding: "14px 16px", backdropFilter: "blur(10px)",
      ...style
    }}>
      {children}
    </div>
  );
}

const slide = {
  hidden:  { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.16 } }
};

export default function AboutMe() {
  const [active, setActive] = useState("overview");

  return (
    <div className="mac-app-split" style={{ display: "flex", height: "100%", overflow: "hidden", background: "var(--mac-window-bg)" }}>

      {/* ── Sidebar ── */}
      <div className="mac-sidebar">
        <div className="mac-sidebar-section">
          <div className="mac-sidebar-section-title">Favourites</div>
          {sections.map(s => (
            <div
              key={s.id}
              className={`mac-sidebar-item${active === s.id ? " active" : ""}`}
              onClick={() => setActive(s.id)}
            >
              <span className="sidebar-icon" style={{ display: "flex", alignItems: "center" }}>
                <s.Icon />
              </span>
              {s.label}
            </div>
          ))}
        </div>

        <div className="mac-sidebar-section" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 12, marginTop: 4 }}>
          <div className="mac-sidebar-section-title">Links</div>
          {[
            { label: "GitHub",   Icon: IconGitHub,   url: user.github,              color: "#1c1c1e" },
            { label: "LinkedIn", Icon: IconLinkedIn,  url: user.linkedin,             color: "#0077b5" },
            { label: "Email",    Icon: IconMail,      url: `mailto:${user.email}`,    color: "#0071e3" }
          ].map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="mac-sidebar-item"
              style={{ textDecoration: "none" }}
            >
              <span className="sidebar-icon" style={{ display: "flex", alignItems: "center", color: link.color }}>
                <link.Icon />
              </span>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="mac-content" style={{ flex: 1, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            <motion.div key={active} variants={slide} initial="hidden" animate="visible">

              {active === "overview" && (
                <>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
                    <Avatar />
                    <div>
                      <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--mac-text)", marginBottom: 2, letterSpacing: "-0.4px" }}>{user.name}</h1>
                      <p style={{ fontSize: 13, color: "var(--mac-accent)", fontWeight: 500, marginBottom: 4 }}>{user.title}</p>
                      <p style={{ fontSize: 12, color: "var(--mac-text-2)", display: "flex", alignItems: "center", gap: 4 }}><StatIconPin />{user.location}</p>
                    </div>
                  </div>

                  <Card style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 13, color: "var(--mac-text-2)", lineHeight: 1.75 }}>{user.bio}</p>
                  </Card>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                    {[
                      { label: "Projects",         value: "6",  Icon: StatIconFolder   },
                      { label: "Years Coding",      value: "4+", Icon: StatIconCode     },
                      { label: "Internships",       value: "1",  Icon: StatIconBuilding },
                      { label: "Spoken Languages",  value: "2",  Icon: StatIconGlobe   }
                    ].map(s => (
                      <motion.div key={s.label} whileHover={{ scale: 1.02 }} className="mac-stat">
                        <div style={{ marginBottom: 6, color: "var(--mac-accent)", opacity: 0.8 }}><s.Icon /></div>
                        <div className="mac-stat-value">{s.value}</div>
                        <div className="mac-stat-label">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <Card style={{ background: "linear-gradient(135deg, rgba(0,113,227,0.06), rgba(99,102,241,0.05))", border: "1px solid rgba(0,113,227,0.14)" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "var(--mac-accent)", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 6 }}>
                      Education
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--mac-text)", marginBottom: 2 }}>{education[0].degree}</p>
                    <p style={{ fontSize: 12, color: "var(--mac-text-2)" }}>{education[0].institution} · {education[0].period}</p>
                  </Card>
                </>
              )}

              {active === "skills" && (
                <>
                  <h2 className="mac-content h2" style={{ marginBottom: 18 }}>Technical Skills</h2>
                  <SkillGroup title="Languages"            items={skills.languages} />
                  <SkillGroup title="Frontend"             items={skills.frontend}  />
                  <SkillGroup title="Backend & APIs"       items={skills.backend}   />
                  <SkillGroup title="Tools & Infrastructure" items={skills.tools}   />
                </>
              )}

              {active === "experience" && (
                <>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--mac-text)", marginBottom: 18, letterSpacing: "-0.3px" }}>Work Experience</h2>
                  {workExperience.map((exp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{ marginBottom: 12 }}
                    >
                      <Card>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--mac-text)", marginBottom: 1 }}>{exp.role}</p>
                            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--mac-accent)" }}>{exp.company}</p>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                            <p style={{ fontSize: 11, color: "var(--mac-text-2)" }}>{exp.period}</p>
                            <p style={{ fontSize: 11, color: "var(--mac-text-3)" }}>{exp.location}</p>
                          </div>
                        </div>
                        <div className="mac-divider" style={{ margin: "8px 0" }} />
                        <ul style={{ listStyle: "none", padding: 0, marginBottom: 10 }}>
                          {exp.bullets.map((b, j) => (
                            <li key={j} style={{ fontSize: 12.5, color: "var(--mac-text-2)", lineHeight: 1.7, paddingLeft: 14, position: "relative", marginBottom: 2 }}>
                              <span style={{ position: "absolute", left: 0, color: "var(--mac-accent)", fontWeight: 700 }}>·</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                        <div>{exp.tags.map(t => <Tag key={t} label={t} />)}</div>
                      </Card>
                    </motion.div>
                  ))}
                </>
              )}

              {active === "education" && (
                <>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--mac-text)", marginBottom: 18, letterSpacing: "-0.3px" }}>Education</h2>
                  {education.map((edu, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ marginBottom: 12 }}>
                      <Card style={{ position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--mac-text)" }}>{edu.degree}</p>
                          <p style={{ fontSize: 11, color: "var(--mac-text-2)", flexShrink: 0, marginLeft: 10 }}>{edu.period}</p>
                        </div>
                        <p style={{ fontSize: 12, color: "var(--mac-accent)", fontWeight: 500, marginBottom: 8 }}>{edu.institution}</p>
                        <p style={{ fontSize: 12.5, color: "var(--mac-text-2)", lineHeight: 1.65 }}>{edu.note}</p>
                      </Card>
                    </motion.div>
                  ))}
                </>
              )}

              {active === "languages" && (
                <>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--mac-text)", marginBottom: 18, letterSpacing: "-0.3px" }}>Languages</h2>
                  {[
                    { name: "Albanian", level: "Native",  pct: 100, color: "#34c759" },
                    { name: "English",  level: "Fluent",  pct: 95,  color: "var(--mac-accent)" }
                  ].map((lang, i) => (
                    <motion.div key={lang.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ marginBottom: 12 }}>
                      <Card>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--mac-text)" }}>{lang.name}</span>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                            background: `${lang.color}14`, color: lang.color,
                            border: `1px solid ${lang.color}30`
                          }}>{lang.level}</span>
                        </div>
                        <div style={{ height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 3, overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${lang.pct}%` }}
                            transition={{ delay: i * 0.1 + 0.2, duration: 0.7, ease: "easeOut" }}
                            style={{ height: "100%", background: lang.color, borderRadius: 3 }}
                          />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
