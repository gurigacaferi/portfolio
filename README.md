# macOS Portfolio

A single-page portfolio that mimics a **macOS-style desktop**: menu bar, dock, draggable windows, and in-app “Finder” experiences. Built with React and published to [GitHub Pages](https://gurigacaferi.github.io/portfolio).

## Features

- **Desktop shell** — Top bar (clock, Wi‑Fi-style status, quick links), **Spotlight**-style search (⌘Space), and a **dock** with cursor magnification.
- **Apps (windows)** — **Finder** (About Me), **Projects** (featured / all filters + detail), **Terminal** (custom commands, incl. `open <app>`, `hire`, `cat <project>.md`), **Notes** (resume: embedded PDF), **Mail** (contact + hire CTA).
- **Content-driven** — Bio, projects, work history, skills, dock apps, and terminal copy live in one config file for easy edits.
- **Responsive** — Layout adapts for smaller screens and touch; heavy pieces (e.g. PDF viewer) load lazily when a window opens.
- **Guided first impression** — About and Projects auto-open on landing, so visitors see substance immediately instead of an empty desktop.

## Tech stack

- [React](https://react.dev/) (Create React App + [Craco](https://craco.js.org/))
- [Framer Motion](https://www.framer.com/motion/) — window chrome, dock, transitions
- Custom pointer-capture window manager (drag / resize / maximize / minimize) — no external window library
- [react-pdf](https://github.com/wojtekmaj/react-pdf) — resume PDF in Notes

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

- **`src/configs/portfolio.js`** — Name, links, bio, `lookingFor`, `projects` (incl. `outcome` / `category`), `workExperience`, `skills`, `dockApps`, `terminalCommands`, `projectNotes`, resume PDF path (`resumePdfUrl`), etc.
- **`public/resume/`** — PDF for the Notes app (filename must match `resumePdfUrl`).

## License

Personal portfolio. Add a `LICENSE` if you repurpose or open-source this code.
