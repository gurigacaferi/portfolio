# macOS Portfolio

A single-page portfolio that mimics a **macOS-style desktop**: menu bar, dock, draggable windows, and in-app “Finder” experiences. Built with React and published to [GitHub Pages](https://gurigacaferi.github.io/portfolio).

## Features

- **Desktop shell** — Boots straight to the desktop (no login gate), top bar (clock, Wi‑Fi-style status, quick links), **Spotlight**-style search (⌘Space), and a **dock** with cursor magnification.
- **Apps (windows)** — **Finder** (About Me), **Projects** (featured / all filters + detail), **Terminal** (custom commands), **Code** (Monaco-powered fix-the-bug demo with live test runner), **Fatural** (live invoice-pipeline demo: scan → OCR → review → sync), **Time Machine** (2022–2026 slider that rewrites About/Projects and tints the wallpaper), **Notes** (resume: embedded PDF), **Mail** (contact + hire CTA).
- **Terminal that ships** — beyond `open <app>`, `hire`, `cat <project>.md`: `deploy fatural` streams an animated CI/CD log, `kubectl get pods` lists Fatural's microservices, `spin -run block.pml` prints a SPIN model-checker run for the railway block-signaling project.
- **"Break the desktop" easter egg** — the Konami code (or `sudo rm -rf /` in Terminal) shakes the desktop, shows a BSOD parody, then restores with a toast and opens the résumé.
- **Content-driven** — Bio, projects, work history, skills, dock apps, terminal copy, and the Time Machine timeline live in one config file for easy edits.
- **Responsive** — Layout adapts for smaller screens and touch; heavy pieces (e.g. PDF viewer, Monaco editor) load lazily when a window opens.
- **Guided first impression** — About and Projects auto-open on landing, so visitors see substance immediately instead of an empty desktop.

## Tech stack

- [React](https://react.dev/) (Create React App + [Craco](https://craco.js.org/))
- [Framer Motion](https://www.framer.com/motion/) — window chrome, dock, transitions
- Custom pointer-capture window manager (drag / resize / maximize / minimize) — no external window library
- [react-pdf](https://github.com/wojtekmaj/react-pdf) — resume PDF in Notes
- [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) — the Code app's editable snippet + test runner

## Getting started

```bash
npm install
npm run dev
```

Opens the dev server (default [http://localhost:3000](http://localhost:3000)).

| Script        | Description        |
| ------------- | ------------------ |
| `npm run dev` | Start dev server   |
| `npm run build` | Production build |
| `npm test`    | Run tests          |
| `npm run lint` | ESLint            |

## Deployment

`package.json` sets `"homepage": "https://gurigacaferi.github.io/portfolio"` for a **GitHub Pages** base path. After `npm run build`, deploy the `build/` folder to the `gh-pages` branch (or your host’s static root).

## Customizing content

- **`src/configs/portfolio.js`** — Name, links, bio, `lookingFor`, `projects` (incl. `outcome` / `category`), `workExperience`, `education` (both with `startYear` for the Time Machine), `skills`, `dockApps`, `terminalCommands`, `timeline` (Time Machine narrative per year), `projectNotes`, resume PDF path (`resumePdfUrl`), etc.
- **`public/resume/`** — PDF for the Notes app (filename must match `resumePdfUrl`).

## License

Personal portfolio. Add a `LICENSE` if you repurpose or open-source this code.
