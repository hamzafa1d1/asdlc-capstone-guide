# ASDLC Capstone Guide

A guide for the **Agentic AI & ASDLC** capstone projects supervised by Hamza Faidi at SUP'COM (2026-27).

**Live site:** https://hamzafa1d1.github.io/asdlc-capstone-guide/

The official scope is the [ASDLC Capstone Projects document](https://docs.google.com/document/d/1vXNRej6hJEaWrtFM7qIWMgIDCAGHGPS0MogUjb9GLoE/edit?usp=sharing). If this guide and that document disagree, the document wins.

## Sections

| # | Section | Route | Source file |
|---|---------|-------|-------------|
| 01 | Start here (plan, rules, how to use the guide) | `#/start` | `data.js` |
| 02 | Free toolkit | `#/tools` | `content/tools.js` |
| 03 | Claude Code as a harness (one page per component) | `#/harness`, `#/harness/<id>` | `content/harness.js` |
| 04 | Core concepts | `#/concepts` | `content/concepts.js` (key `concepts`) |
| 05 | Test your work | `#/testing` | `content/testing.js` |
| 06 | Building blocks | `#/primitives` | `content/concepts.js` (key `primitives`) |
| | Project tracks overview | `#/projects` | built from the three tracks |
| | Hamza 1, 2, 3 tracks and milestones | `#/p1`, `#/p1/m2`, ... | `content/p1.js`, `p2.js`, `p3.js` |
| 07 | Final delivery (rubric and submission) | `#/final` | `data.js` |

Any route can take an anchor, for example `#/concepts#term-agent` or `#/p1/m1#test`.

## How it works

Plain static HTML, CSS and JS. No build step, no framework. GitHub Pages serves the repo as is.

- `index.html` loads each `content/*.js` file, then `data.js`, then `app.js`.
- Each content file adds one part to `window.GUIDE_PARTS`:
  ```js
  (window.GUIDE_PARTS = window.GUIDE_PARTS || {}).tools = { id: "tools", num: "02", title: "...", kicker: "...", summary: "...", blocks: [ ... ] };
  ```
- `data.js` holds site config (doc link, supervisor, last verified date), the start page, the final delivery page and the rubric. It assembles the parts into `window.GUIDE`. A missing part is skipped and the rest of the site still renders.
- `app.js` renders everything: sidebar, pages, on-page table of contents, search palette (`Ctrl K` / `Cmd K` or `/`), light and dark theme.

## Editing content

Edit the matching file in `content/`, commit, push. GitHub Pages redeploys.

A page is a list of blocks. Supported block types: `lead`, `h`, `p`, `list`, `steps`, `callout` (`info` / `warn` / `tip`), `code`, `table`, `defs`, `resources`, `checklist`, `timeline`, `tools`, `components`, `diagram`, `lab`, `primitives`, `equation`, `source`, `rubric`. Fields that hold HTML accept `<strong>`, `<em>`, `<code>` and `<a>`.

To link to a Claude Code component from any HTML field, write `<a data-cc="hooks">hooks</a>`. The site turns it into a link to `#/harness/hooks` with a small CC marker, and the component page lists every place in the guide that links to it.

Project tracks use the project object (slot, title, why, evidence, architecture, stack, milestones with build / deliver / measure / test / lab / cc / resources, stretch, pitfalls). See any `content/p*.js` file for a complete example.

Check a content file's syntax with:

```bash
node -e "global.window={};require('./content/tools.js');console.log(Object.keys(window.GUIDE_PARTS))"
```

Preview locally with `python3 -m http.server` in the repo and open http://localhost:8000.

## Progress

Checkboxes, lab verifications and "milestone done" marks are saved in each student's browser only (localStorage). Nothing is sent anywhere.
