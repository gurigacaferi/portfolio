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
    label: "GitHub",
    detail: "@gurigacaferi",
    url: user.github,
    iconBg: "#24292f",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" aria-hidden>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    )
  },
  {
    label: "LinkedIn",
    detail: "Guri Gacaferi",
    url: user.linkedin,
    iconBg: "#0a66c2",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  },
  {
    label: "WhatsApp",
    detail: user.whatsapp.replace(/(\+\d{3})(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4"),
    url: `https://wa.me/${user.whatsapp.replace(/\D/g, "")}`,
    iconBg: "#25D366",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    )
  },
  {
    label: "Email",
    detail: user.email,
    url: `mailto:${user.email}`,
    iconBg: "var(--mac-accent)",
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" aria-hidden>
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    )
  }
];

export default function Contact() {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "var(--mac-window-bg)" }}>
      <div className="mac-content" style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 36 }}>

        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--mac-text)", letterSpacing: "-0.45px", marginBottom: 6 }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: 13, color: "var(--mac-text-2)", lineHeight: 1.65, marginBottom: 4 }}>
            {user.name} · {user.title}
          </p>
          <p style={{ fontSize: 13, color: "var(--mac-text-2)", lineHeight: 1.65, marginBottom: 22 }}>
            Choose a channel below — I&apos;ll get back to you as soon as I can.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.28 }}
        >
          <div className="section-rule" style={{ marginBottom: 12 }}>
            <h3>Connect</h3>
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
                <div className="mac-contact-icon" style={{ background: link.iconBg }}>
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
