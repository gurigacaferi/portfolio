import React from "react";
import { motion } from "framer-motion";
import { user } from "../../configs/portfolio";

function Chevron() {
  return (
    <svg className="mac-contact-chevron" width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M4.25 1.75L8.25 5.75L4.25 9.75" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "Email",
    detail: user.email,
    url: `mailto:${user.email}`,
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3 7.5l9 6 9-6" />
      </svg>
    )
  },
  {
    label: "LinkedIn",
    detail: "linkedin.com/in/guri-gacaferi",
    url: user.linkedin,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  },
  {
    label: "GitHub",
    detail: "github.com/gurigacaferi",
    url: user.github,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    )
  },
  {
    label: "Phone / WhatsApp",
    detail: user.whatsapp.replace(/(\+\d{3})(\d{2})(\d{3})(\d{3})/, "$1 $2 $3 $4"),
    url: `https://wa.me/${user.whatsapp.replace(/\D/g, "")}`,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    )
  }
];

export default function Contact() {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "var(--mac-window-bg)" }}>
      <div className="mac-content" style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 36 }}>

        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 650, color: "var(--mac-text)", letterSpacing: "-0.025em", marginBottom: 4 }}>
            Contact
          </h1>
          <p style={{ fontSize: 13, color: "var(--mac-text-2)", lineHeight: 1.6, marginBottom: 2 }}>
            {user.name} · {user.subtitle.split(" · ")[0]}
          </p>
          <p style={{ fontSize: 12.5, color: "var(--mac-text-3)", lineHeight: 1.6, marginBottom: 22 }}>
            Based in {user.location}. Direct channels below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.18 }}
        >
          <div className="section-rule" style={{ marginBottom: 12 }}>
            <h3>Direct Channels</h3>
          </div>

          <div className="mac-card mac-contact-group">
            {socialLinks.map(link => (
              <a
                key={link.label}
                href={link.url}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="mac-contact-row"
              >
                <div className="mac-contact-icon">
                  {link.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mac-contact-label">{link.label}</div>
                  <div className="mac-contact-detail">{link.detail}</div>
                </div>
                <Chevron />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
