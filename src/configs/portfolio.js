/**
 * In-app resume PDF. Place the file under `public/` and set the path from site root (leading slash).
 * Example: put `public/resume/cv.pdf` → "/resume/cv.pdf"
 * Leave null to show the built-in HTML resume in the Notes window.
 */
const base = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
export const resumePdfUrl = `${base}/resume/${encodeURIComponent("Resume - Guri Gacaferi.pdf")}`;

export const user = {
  name: "Guri Gacaferi",
  title: "BSc AI & Data Science Student · Full-Stack Developer",
  email: "gurigacaferi@outlook.com",
  github: "https://github.com/gurigacaferi",
  linkedin: "https://www.linkedin.com/in/guri-gacaferi-54947a359/",
  whatsapp: "+38345666796",
  avatar: null,
  bio: "BSc AI & Data Science student at the University of York Europe Campus. I build full-stack web applications, simulate complex systems, and bring AI into practical tools — from invoice scanners to swarm-based misinformation models.",
  location: "Prishtina, Kosovo"
};

export const education = [
  {
    institution: "University of York Europe Campus",
    degree: "BSc in Artificial Intelligence & Data Science",
    period: "Oct 2023 – Jun 2026",
    note: "Coursework spans machine learning, data systems, operating systems theory, and software engineering."
  },
  {
    institution: "Prishtina High School",
    degree: "High School Diploma",
    period: "Sep 2020 – Jun 2023",
    note: "Graduated with distinction."
  }
];

export const projects = [
  {
    id: 1,
    title: "Fatural",
    subtitle: "AI-Powered Invoice Scanner",
    description: "A full-stack web app that uses AI to scan and extract data from bills and invoices, then routes them directly into QuickBooks Online upon approval. Built on a microservices architecture with async communication, 2FA, CSV export for third-party systems, and a companion phone app that connects via a 6-digit code — letting you photograph invoices on mobile and have them processed instantly in your linked Fatural account.",
    highlights: [
      "Microservices architecture with async inter-service communication via message queues",
      "Deep QuickBooks Online API integration — invoices route directly into the client's ledger on approval",
      "Companion mobile app pairs to the web account via a 6-digit code, enabling on-the-go invoice capture",
      "Two-factor authentication and role-based access control across all services",
      "CSV export pipeline for compatibility with third-party accounting systems",
      "AI/OCR layer extracts line items, totals, and vendor details from unstructured document scans"
    ],
    tags: ["Microservices", "QuickBooks API", "2FA", "AI/OCR", "React", "Node.js", "Mobile"],
    color: "#10b981",
    year: "2025",
    solo: true,
    link: null,
    github: null,
    featured: true
  },
  {
    id: 2,
    title: "Invent",
    subtitle: "Legacy System Modernisation",
    description: "Migrated an existing inventory management system from a legacy Zend Framework PHP codebase to a modern Laravel stack with updated PHP, significantly hardened security, a fully redesigned UI with dark mode, CSV import/export, and GDPR compliance improvements. The result was a faster, more maintainable, and far more pleasant product to use.",
    highlights: [
      "Full migration from Zend Framework to Laravel — updated routing, ORM, and middleware layers",
      "Security hardening: CSRF protection, parameterised queries, session hardening, and dependency audits",
      "Fully redesigned UI built from scratch with dark mode as a first-class feature",
      "CSV import/export for bulk inventory operations and third-party integrations",
      "GDPR compliance improvements including data retention policies and audit logging",
      "Zero-downtime migration strategy preserving all existing inventory and user data"
    ],
    tags: ["Laravel", "PHP", "MySQL", "GDPR", "UI/UX", "Dark Mode"],
    color: "#6366f1",
    year: "2025",
    solo: false,
    link: null,
    github: null,
    featured: true
  },
  {
    id: 3,
    title: "OS Simulator",
    subtitle: "Educational Operating System Visualiser",
    description: "An educational operating-system simulator built in Processing (Java) that visually demonstrates core OS concepts — process scheduling, memory partitioning, and kernel/user request handling. Implements Process Control Block management, partition-based memory allocation, a simulated hardware layer (CPU, memory, timers), FIFO and Round Robin scheduling, request queuing, and live statistics tracking.",
    highlights: [
      "Live visual simulation of process scheduling using FIFO and Round Robin algorithms",
      "Process Control Block (PCB) management with process state transitions rendered in real time",
      "Partition-based memory allocation with fragmentation visualisation",
      "Simulated hardware abstraction layer covering CPU, memory buses, and hardware timers",
      "Kernel/user mode separation with a request queue for system calls",
      "Live statistics panel tracking throughput, wait times, and memory utilisation"
    ],
    tags: ["Java", "Processing", "Algorithms", "Systems", "Simulation"],
    color: "#f59e0b",
    year: "2024",
    solo: false,
    link: null,
    github: "https://github.com/egrabanica/Operating-system",
    featured: true
  },
  {
    id: 4,
    title: "Misinformation Simulation",
    subtitle: "Agent-Based Swarm Evolution Model",
    description: "A modular swarm-simulation exploring how genetic, strategic (game-theoretic), and cultural evolution unfold inside an agent-based boids system — separately or all at once. Honest, liar, and stubborn agents flock using Reynolds' boids rules, interact, accumulate fitness, shift beliefs, and reproduce. Supports pure genetic, pure game-theory, pure cultural, or full hybrid co-evolution across different timescales.",
    highlights: [
      "Three agent archetypes — honest, liar, and stubborn — competing under evolutionary selection pressure",
      "Reynolds' boids rules (separation, alignment, cohesion) drive spatial flocking and agent interaction",
      "Four evolution modes: pure genetic, pure game-theoretic, pure cultural, and full hybrid co-evolution",
      "Timescale separation between fast strategic adaptation and slow generational evolution",
      "Agents accumulate fitness scores through interactions and reproduce with mutation",
      "Modular architecture allows each evolution mechanism to be toggled independently for comparison"
    ],
    tags: ["Python", "Simulation", "Agent-Based", "Game Theory", "Evolutionary AI"],
    color: "#ec4899",
    year: "2025",
    solo: false,
    link: null,
    github: null,
    p5js: "https://editor.p5js.org/gurigacaferi/sketches/IPD4rg72v",
    featured: false
  },
  {
    id: 5,
    title: "InternLink",
    subtitle: "Full-Stack Internship Portal",
    description: "A full-stack internship application portal built for students using Node.js, Express, EJS, and SCSS. Students can browse listings, register, log in, and submit applications with validation. Features server-side rendering, responsive SCSS styling, RESTful Express routes, and an Agile group-developed codebase with full Docker/devcontainer support.",
    highlights: [
      "Server-side rendering with EJS templates and Express route handlers for all CRUD operations",
      "Student authentication with registration, login, and session management",
      "Application submission flow with client-side and server-side validation",
      "Responsive SCSS styling with a component-based structure and mobile-first layout",
      "Docker and devcontainer configuration for a fully reproducible development environment",
      "Developed in an Agile team with sprints, code reviews, and a shared Git workflow"
    ],
    tags: ["Node.js", "Express", "EJS", "SCSS", "Docker", "REST API"],
    color: "#3b82f6",
    year: "2024",
    solo: false,
    link: null,
    github: "https://github.com/aabazii/InternLink",
    featured: false
  },
  {
    id: 6,
    title: "Battlesnake Bot",
    subtitle: "Competitive AI Snake Bot with CI/CD",
    description: "A competitive Battlesnake bot built as a Node.js/Express web service, deployed live on Railway. The snake's decision logic is isolated in a single file for fast iteration, backed by a full CI/CD pipeline via GitHub Actions that runs Jest tests, ESLint linting, and coverage checks on every pull request — auto-deploying to production on merge.",
    highlights: [
      "Express web service responding to Battlesnake game API events in real time",
      "Snake strategy isolated in a single snakeLogic.js file for rapid, safe iteration",
      "Full Jest test suite covering core movement and collision-avoidance logic",
      "ESLint + Prettier enforced on every PR to maintain consistent code quality",
      "GitHub Actions pipeline runs lint, test, and coverage checks before any merge",
      "Automatic deployment to Railway on merge to main — zero manual deploy steps"
    ],
    tags: ["JavaScript", "Node.js", "Express", "Jest", "GitHub Actions", "Railway", "CI/CD"],
    color: "#ef4444",
    year: "2024",
    solo: false,
    link: null,
    github: "https://github.com/ggacaferi/software-development",
    featured: false
  }
];

export const workExperience = [
  {
    company: "Balkan Natural Adventure",
    role: "Finance automation technician",
    period: "Jun 2022 – Feb 2026",
    location: "Remote, Flexible",
    bullets: [
      "Led the company's transition from Excel-based bookkeeping to QuickBooks Online, designing clear, scalable workflows for future bookkeepers.",
      "Managed bills, invoices, and bank integrations end-to-end.",
      "Built custom scripts and tools to automate repetitive financial processes, reducing manual workload and improving operational efficiency.",
      "Leveraged AI to analyse staff performance data, delivering actionable insights to support management decision-making.",
      "Trained staff in January 2026 on QuickBooks usage and completed a full handover by end of February 2026."
    ],
    tags: ["QuickBooks Online", "Automation", "Finance", "AI"]
  },
  {
    company: "Dynamic Spheres",
    role: "Full-Stack Developer Intern",
    period: "Jul 2025 – Oct 2025",
    location: "Kosovo",
    bullets: [
      "Worked on the DsMIS ERP module focused on leasing operations, determining lease definitions under Kosovar law and implementing depreciation calculations per accounting standards.",
      "Contributed to an enterprise-grade PHP/Laravel codebase following structured development workflows.",
      "Conducted independent research into legal and financial requirements to inform software design decisions."
    ],
    tags: ["Laravel", "PHP", "ERP", "Full-Stack"]
  },
  {
    company: "University of York Europe Campus",
    role: "Teaching Assistant — Intro to Object-Oriented Programming",
    period: "Oct 2024 – Feb 2025",
    location: "Prishtina, Kosovo",
    bullets: [
      "Assisted students with core OOP concepts during weekly in-class labs, providing hints and guiding problem-solving rather than giving away answers.",
      "Delivered one-on-one tutoring sessions to students who needed dedicated support, adapting explanations to different learning styles.",
      "Helped bridge the gap between lecture theory and practical coding exercises."
    ],
    tags: ["Java", "OOP", "Teaching", "Mentoring"]
  }
];

export const skills = {
  languages: ["JavaScript", "TypeScript", "Python", "Java", "PHP", "SQL"],
  frontend: ["React", "EJS", "SCSS / CSS", "Processing (Java)", "Tailwind CSS"],
  backend: ["Node.js", "Express", "Laravel", "FastAPI", "REST APIs", "Microservices"],
  tools: ["Docker", "GitHub Actions", "Railway", "QuickBooks API", "Git", "CI/CD"]
};

export const languages = [
  { name: "Albanian", level: "Native" },
  { name: "English", level: "Fluent" }
];

export const terminalCommands = {
  whoami: `guri gacaferi
role:     bsc ai & data science · full-stack developer
location: prishtina, kosovo
status:   open to opportunities`,

  help: `available commands:
  whoami      — who am i
  ls          — list projects (finder-style)
  repos       — public github links for team projects
  education   — academic background
  work        — work experience
  skills      — technical skills
  contact     — how to reach me
  languages   — spoken languages
  clear       — clear terminal`,

  ls: `drwxr-xr-x  fatural/              (ai invoice scanner + qbo integration)
drwxr-xr-x  invent/               (zend → laravel migration)
drwxr-xr-x  os-simulator/         (educational os visualiser, processing/java)
drwxr-xr-x  misinformation-sim/   (agent-based swarm evolution model)
drwxr-xr-x  internlink/           (node · express · ejs internship portal)
drwxr-xr-x  battlesnake-bot/      (node · express · jest · github actions · railway)`,

  repos: `public repos (team / coursework):
  os-simulator/     github.com/egrabanica/Operating-system
  internlink/       github.com/aabazii/InternLink
  battlesnake-bot/  github.com/ggacaferi/software-development

  fatural, invent, misinformation-sim — not linked here (private or local).`,

  education: `bsc artificial intelligence & data science
  university of york europe campus
  oct 2023 – jun 2026
  ml · data systems · os theory · software engineering

high school diploma
  prishtina high school
  sep 2020 – jun 2023
  graduated with distinction`,

  work: `finance automation technician — balkan natural adventure
  jun 2022 – feb 2026 · remote
  excel → qbo · automation · ai insights · training · handover

full-stack developer intern — dynamic spheres
  jul 2025 – oct 2025 · kosovo
  dsmis erp leasing · kosovar law · depreciation · laravel/php

teaching assistant (intro to oop) — uye campus
  oct 2024 – feb 2025 · prishtina
  labs · 1-on-1 tutoring · java`,

  skills: `languages:   javascript · typescript · python · java · php · sql
frontend:    react · ejs · scss/css · tailwind · processing (java)
backend:     node.js · express · laravel · fastapi · rest · microservices
tools:       docker · github actions · railway · quickbooks api · git · ci/cd`,

  languages: `albanian  — native
english   — fluent`,

  contact: `email:     gurigacaferi@outlook.com
whatsapp:  +383 45 666 796   →  wa.me/38345666796
github:    github.com/gurigacaferi
linkedin:  linkedin.com/in/guri-gacaferi-54947a359`
};

export const dockApps = [
  {
    id: "about",
    title: "Finder",
    subtitle: "About Guri",
    icon: "finder",
    defaultOpen: true
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "My Work",
    icon: "projects"
  },
  {
    id: "terminal",
    title: "Terminal",
    subtitle: "Terminal",
    icon: "terminal"
  },
  {
    id: "resume",
    title: "Notes",
    subtitle: "Resume & CV",
    icon: "resume"
  },
  {
    id: "contact",
    title: "Mail",
    subtitle: "Contact",
    icon: "mail"
  },
  {
    id: "github",
    title: "GitHub",
    subtitle: "Source Code",
    icon: "github",
    external: "https://github.com/gurigacaferi"
  }
];
